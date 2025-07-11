/*
 * Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses>.
 */

#include "common/box.h"
#include "common/common.h"
#include "common/httpsession.h"
#include <QAudioSink>
#include <QAudioSource>
#include <QBuffer>
#include <QCamera>
#include <QDir>
#include <QLocalSocket>
#include <QMediaCaptureSession>
#include <QMediaDevices>
#include <QNetworkInterface>
#include <QScreen>
#include <QTimer>
#include <QVideoSink>

#if defined SERIAL
#include <QSerialPort>
#include <QSerialPortInfo>
#endif

#if defined OS_ANDROID
#include "alib.h"
#endif

#if !defined NOGUI
#include <QFileDialog>
#endif


Box::Box(QObject *parent, bool remote) : QObject(parent)
{
    m_remote = remote;
    m_rtstimer = nullptr;
    m_remotetimeout = G_LOCALSETTINGS.get("system.remotetimeout").toInt();
    m_refreshrate = G_LOCALSETTINGS.get("system.refreshrate", "10").toInt();
    m_id = 1;

#if defined USB
    libusb_init_context(&m_usbcontext, NULL, 0);
#endif

#if defined OS_ANDROID
    if (!G_BOX)
        alibserial_init();
#endif

    if (G_BOX) {
        m_hotplugworker = nullptr;
        connect(G_BOX, &Box::hotPlug, this, &Box::hotPlug);
    } else {
        QEventLoop loop;
        QThread *thread = new QThread(this);
        m_hotplugworker = new HotPlugWorker(this);
        m_hotplugworker->moveToThread(thread);
        connect(thread, &QThread::started, m_hotplugworker, &HotPlugWorker::start);
        connect(m_hotplugworker, &HotPlugWorker::started, &loop, &QEventLoop::quit);
        thread->start();
        loop.exec();
    }
}


Box::~Box()
{
    QList<int> keys;

    keys = G_BOX->audioDevices()->keys();
    AudioDevice *audiodev;
    for (int &i : keys) {
        audiodev = G_BOX->audioDevices()->value(i);
        if (audiodev->parent == this && audiodev->devname != "O:null")
            audioDevice_close(i);
    }

    keys = G_BOX->videoDevices()->keys();
    for (int &i : keys)
        if (G_BOX->videoDevices()->value(i)->parent == this)
            videoDevice_close(i);

    keys = G_BOX->serialPorts()->keys();
    for (int &i : keys)
        if (G_BOX->serialPorts()->value(i)->parent == this)
            serialPort_close(i);

#if defined USB
    keys = G_BOX->usbDevices()->keys();
    USBDevice *usbdevice;
    for (int &i : keys) {
        usbdevice = G_BOX->usbDevices()->value(i);
        if (usbdevice->parent == this && usbdevice->handle)
            USB_close(i);
    }

    libusb_exit(m_usbcontext);
#endif

    keys = m_SDRs.keys();
    for (int &i : keys)
        SDR_release(i);

    keys = m_DSPs.keys();
    for (int &i : keys)
        DSP_release(i);

    if (m_rtstimer)
        m_rtstimer->deleteLater();

    if (m_hotplugworker) {
        QEventLoop loop;
        QThread *thread = m_hotplugworker->thread();
        connect(m_hotplugworker, &HotPlugWorker::stopped, thread, &QThread::quit);
        connect(thread, &QThread::finished, &loop, &QEventLoop::quit);
        m_hotplugworker->stop();
        loop.exec();
        thread->deleteLater();
        m_hotplugworker->deleteLater();
    }
}


void Box::audioDevice_close(const int devid)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    if (G_VERBOSE) qInfo() << qPrintable("BOX: Closing audio device " + audioDevice_description(G_BOX->audioDevices()->value(devid)->devname));

    QMutexLocker locker(&m_audioDevice_mutex);

    if (device->i_o == 'I') {
#if defined OS_ANDROID
        android_audioDeviceClose(device);
#else
        disconnect(device->audioinput, &QAudioSource::stateChanged, this, &Box::audioDeviceInputStateChanged);
        disconnect(device->iodevice, &QIODevice::readyRead, this, &Box::audioDeviceReadyRead);
        device->audioinput->deleteLater();
        device->iodevice->deleteLater();
#endif

    } else if (device->i_o == 'O') {
        device->processing = false;
        device->future.waitForFinished();

#if defined OS_ANDROID
        android_audioDeviceClose(device);
#else
        if (device->devname != "O:null" && device->audiooutput) {
            QObject::disconnect(device->audiooutput, &QAudioSink::stateChanged, this, &Box::audioDeviceOutputStateChanged);
            device->audiooutput->deleteLater();
        }
#endif
    } else if (device->i_o == 'V')
        device->iodevice->deleteLater();

    DSP_release(device->dspid);
    delete device;

    G_BOX->audioDevices()->remove(devid);
}


QString Box::audioDevice_defaultInput()
{
    if (m_remote)
        return QString();

#if defined OS_ANDROID
    return android_audioDeviceDefaultInput();
#else
    return "I:" + QMediaDevices::defaultAudioInput().description().trimmed();
#endif
}


QString Box::audioDevice_defaultOutput()
{
    if (m_remote)
        return QString();

#if defined OS_ANDROID
    return android_audioDeviceDefaultOutput();
#else
    return "O:" + QMediaDevices::defaultAudioOutput().description().trimmed();
#endif
}


QString Box::audioDevice_description(const QString &devname)
{
    if (devname == "O:null")
        return G_LOCALSETTINGS.get("system.dummyaudio");

    if (m_remote)
        return remoteBox("audioDevice_description", devname);

#if defined OS_ANDROID
    if (devname.startsWith("I:") || devname.startsWith("O:"))
        return id.mid(2);
    else
        return id;
#else
    QAudioDevice dev = audioDevice_fromName(devname);
    if (dev.isNull())
        return devname;
    else
        return dev.description().trimmed();
#endif
}


bool Box::audioDevice_isOpen()
{
    return !G_BOX->audioDevices()->isEmpty();
}


bool Box::audioDevice_isOpen(const QString &devname)
{
    if (devname.isEmpty())
        return false;

    if (m_remote)
        return false;

    QList<AudioDevice *> devs = G_BOX->audioDevices()->values();
    for (AudioDevice *&dev : devs)
        if (dev->devname == devname)
            return true;

    return false;
}


QList<QString> Box::audioDevice_list(const QString &mode, bool raw)
{
    QList<QString> list;

    if (m_remote) {
        QString ret = remoteBox("audioDevice_list", mode);
        list = Settings::stringToListString(ret);
        list.removeOne("[" + m_appname + "]");
        return list;
    }

    if (mode == "ALL") {
        list.append(audioDevice_list("INPUT", raw));
        list.append(audioDevice_list("OUTPUT", raw));

    } else if (mode == "INPUT") {
#if defined OS_ANDROID
        list = android_audioDeviceList(mode);
#else
        for (QAudioDevice &device : QMediaDevices::audioInputs())
            list << "I:" + device.description().trimmed();
#endif
        if (!raw)
            list.append(*G_BOX->virtualDevices());
        list.removeOne("[" + m_appname + "]");

    } else if (mode == "OUTPUT") {
#if defined OS_ANDROID
        list = android_audioDeviceList(mode);
#else
        for (QAudioDevice &device : QMediaDevices::audioOutputs())
            list.append("O:" + device.description().trimmed());
#endif
        list.append("O:null");
    }

    return list;
}


QString Box::audioDevice_mode(const QString &devname)
{
    if (m_remote)
        return QString();

    QList<AudioDevice *> devs = G_BOX->audioDevices()->values();
    for (AudioDevice *&dev : devs)
        if (dev->devname == devname)
            return QString::number(dev->samplerate) + "," + QString::number(dev->samplingbits) + "," + QString::number(dev->compressedbits);

    return QString();
}



void Box::audioDevice_mute(const int devid, const bool mute)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    device->mute = mute;

    audioDevice_setVolume(devid, device->volume);
}


int Box::audioDevice_open(const QString &devname, const QString &mode, const bool direct)
// mode: sampling-rate, sampling-bits, compressed-bits
{
    if (m_remote)
        return -1;

    QString lmode = mode;
    QList<QString> amode = lmode.replace(" ", "").toUpper().split(',');
    if (amode.size() < 3)
        return -1;

    int samplerate = amode.at(0).toInt();
    int samplingbits = amode.at(1).toInt();
    int compressedbits = amode.at(2).toInt();

    if (samplingbits != 8 && samplingbits != 16 && samplingbits != 32)
        return -1;

#if !defined OS_ANDROID
    QAudioDevice audiodev = audioDevice_fromName(devname);

    if (audiodev.isNull() && devname != "O:null" && !G_BOX->virtualDevices()->contains(devname))
        return -1;
#endif

    int deviceid = G_BOX->id();

    AudioDevice *audiodevice = new AudioDevice(this);

    audiodevice->id = deviceid;
    audiodevice->devname = devname;
    audiodevice->samplerate = samplerate;
    audiodevice->samplingbits = samplingbits;
    audiodevice->compressedbits = compressedbits;
    audiodevice->processsize = SF * static_cast<int>(samplerate / m_refreshrate);
    audiodevice->direct = direct;
    audiodevice->volume = 1.0;
    audiodevice->dspid = DSP_create();
    audiodevice->mute = false;
    audiodevice->busy = false;

    if (G_VERBOSE) qInfo() << qPrintable("BOX: Opening audio device " + audioDevice_description(devname) + " (" + mode + ")");

    if (G_BOX->virtualDevices()->contains(devname)) {
        audiodevice->i_o = 'V';
        QLocalSocket *master = new QLocalSocket(this);
        audiodevice->iodevice = reinterpret_cast<QIODevice *>(master);
        QString servername = localSocketName(devname.sliced(1).chopped(1), 10);
        master->connectToServer(servername);
        master->setObjectName(QString::number(deviceid));
        connect(master, &QLocalSocket::readyRead, this, &Box::slaveDeviceReadyRead);

        G_BOX->audioDevices()->insert(deviceid, audiodevice);
        return deviceid;
    }

    QMutexLocker locker(&m_audioDevice_mutex);

    QAudioFormat format;

    format.setChannelCount(1);
    format.setSampleRate(samplerate);

    if (samplingbits == 8)
        format.setSampleFormat(QAudioFormat::UInt8);
    else if (samplingbits == 16)
        format.setSampleFormat(QAudioFormat::Int16);
    else if (samplingbits == 32)
        format.setSampleFormat(QAudioFormat::Float);

    audiodevice->i_o = devname.toUtf8().at(0);

    if (audiodevice->i_o == 'I') {
        if (!getPermission("microphone"))
            return -1;
#if defined OS_ANDROID
        deviceid = android_audioDeviceOpen(audiodevice);
        if (deviceid == -1) {
            if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening audio device " + audioDevice_description(devname));
            return -1;
        }
#else
        audiodevice->audioinput = new QAudioSource(audiodev, format, this);
        audiodevice->audioinput->setObjectName(QString::number(deviceid));
        audiodevice->audioinput->setBufferSize(4 * audiodevice->processsize);
        connect(audiodevice->audioinput, &QAudioSource::stateChanged, this, &Box::audioDeviceInputStateChanged);

        audiodevice->iodevice = nullptr;
        audiodevice->iodevice = audiodevice->audioinput->start();

        if (audiodevice->audioinput->error() != QAudio::NoError || !audiodevice->iodevice) {
            if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening audio device " + audioDevice_description(devname));
            audiodevice->audioinput->deleteLater();
            delete audiodevice;
            return -1;
        }

        audiodevice->iodevice->setObjectName(QString::number(deviceid));
        connect(audiodevice->iodevice, &QIODevice::readyRead, this, &Box::audioDeviceReadyRead);
#endif

        G_BOX->audioDevices()->insert(deviceid, audiodevice);
        return deviceid;

    } else if (audiodevice->i_o == 'O') {

        if (devname != "O:null") {
#if defined OS_ANDROID
            deviceid = android_audioDeviceOpen(audiodevice);
            if (deviceid == -1) {
                if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening audio device " + audioDevice_description(devname));
                return -1;
            }
#else
            audiodevice->audiooutput = new QAudioSink(audiodev, format, this);
            audiodevice->audiooutput->setObjectName(QString::number(deviceid));
            audiodevice->audiooutput->setBufferSize(4 * audiodevice->processsize);
            connect(audiodevice->audiooutput, &QAudioSink::stateChanged, this, &Box::audioDeviceOutputStateChanged);

            audiodevice->buffering = true;
            audiodevice->iodevice = nullptr;
            audiodevice->iodevice = audiodevice->audiooutput->start();

            if (audiodevice->audiooutput->error() != QAudio::NoError || !audiodevice->iodevice) {
                if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening audio device " + audioDevice_description(devname));
                audiodevice->audiooutput->deleteLater();
                delete audiodevice;
                return -1;
            }
#endif
        }

        audiodevice->future = QtConcurrent::run(audio_process, this, audiodevice);

        G_BOX->audioDevices()->insert(deviceid, audiodevice);
        return deviceid;

    } else
        return -1;
}


void Box::audioDevice_recordPause(const int devid, const bool pause)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    device->recordpause = pause;
}


void Box::audioDevice_recordStart(const int devid, const QString filename, const int rawsamplerate)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    if (rawsamplerate == 0) {
        device->wav.setFileName(G_LOCALSETTINGS.localFilePath() + "/data/" + filename);
        if (!device->wav.open(QFile::WriteOnly))
            return;

        device->wav.write("RIFF");
        device->wav.write("0000");  // File size - 8. To be written when closing the file
        device->wav.write("WAVE");
        device->wav.write("fmt ");
        device->wav.write(integerToLittleEndian(16)); // Format chunk size
        device->wav.write(shortToLittleIndian(device->samplingbits == 32 ? 3 : 1));
        device->wav.write(shortToLittleIndian(1)); // Mono
        device->wav.write(integerToLittleEndian(device->samplerate)); // Sample rate
        device->wav.write(integerToLittleEndian(device->samplerate * device->samplingbits / 8)); // Byte rate
        device->wav.write(shortToLittleIndian(device->samplingbits)); // Bits per sample, including all channels
        device->wav.write(shortToLittleIndian(device->samplingbits)); // Number of bits per sample and channel
        device->wav.write("data");
        device->wav.write("0000");  // Data chunk size (file size - 44). To be written when closing the file

        device->recordlength = 44;
        device->recording = true;
        device->recordpause = false;
    } else {
        device->raw.setFileName(G_LOCALSETTINGS.localFilePath() + "/data/" + filename);
        if (!device->raw.open(QFile::WriteOnly))
            return;

        device->raw.write("RIFF");
        device->raw.write("0000");  // File size - 8. To be written when closing the file
        device->raw.write("WAVE");
        device->raw.write("fmt ");
        device->raw.write(integerToLittleEndian(16)); // Format chunk size
        device->raw.write(shortToLittleIndian(3)); // Floating point
        device->raw.write(shortToLittleIndian(2)); // Two channels (I/Q)
        device->raw.write(integerToLittleEndian(rawsamplerate)); // Sample rate
        device->raw.write(integerToLittleEndian(2 * SF * rawsamplerate)); // Byte rate
        device->raw.write(shortToLittleIndian(2 * 8 * SF)); // Bits per sample, including all channels
        device->raw.write(shortToLittleIndian(8 * SF)); // Number of bits per sample and channel
        device->raw.write("data");
        device->raw.write("0000");  // Data chunk size (file size - 44). To be written when closing the file

        device->recordlength = 44;
        device->recording = true;
        device->recordpause = false;
    }
}


void Box::audioDevice_recordStop(const int devid)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    device->recording = false;
    device->recordpause = false;

    if (device->wav.isOpen()) {
        device->wav.seek(4);
        device->wav.write(integerToLittleEndian((unsigned int)(device->recordlength) - 8));
        device->wav.seek(40);
        device->wav.write(integerToLittleEndian((unsigned int)(device->recordlength) - 44));
        device->wav.close();
    } else if (device->raw.isOpen()) {
        device->raw.seek(4);
        device->raw.write(integerToLittleEndian((unsigned int)(device->recordlength) - 8));
        device->raw.seek(40);
        device->raw.write(integerToLittleEndian((unsigned int)(device->recordlength) - 44));
        device->raw.close();
    }
}


void Box::audioDevice_recordWrite(const int devid, QByteArrayView data)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    if (device->wav.isOpen())
        device->wav.write(data.data(), data.size());
    else if (device->raw.isOpen())
        device->raw.write(data.data(), data.size());

    device->recordlength += (qint64)data.size();
    emit audioDevice_RecordSize(devid, device->recordlength);
}


void Box::audioDevice_reset(const int devid)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    if (device->audioinput)
        device->audioinput->reset();

    if (device->audiooutput)
        device->audiooutput->reset();

    device->buffer = QByteArray();
    device->buffering = true;
}


void Box::audioDevice_setBusy(const int devid, const bool busy)
{
    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    device->busy = busy;
}


void Box::audioDevice_setVolume(const int devid, const float volume)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    device->volume = volume;

#if defined OS_ANDROID
    return;
#endif

    if (device->devname == "O:null")
        return;

    if (device->i_o == 'I')
        device->audioinput->setVolume(device->mute ? 0 : device->volume * device->volume);
    else if (device->i_o == 'O')
        device->audiooutput->setVolume(device->mute ? 0 : device->volume * device->volume);
}


void Box::audioDevice_write(const int devid, QByteArrayView data)
{
    if (m_remote)
        return;

    AudioDevice *device = G_BOX->audioDevices()->value(devid);

    if (!device)
        return;

    if (device->i_o != 'O')
        return;

    QMutexLocker locker(&device->mutex);

    if (device->direct) {
        if (device->devname != "O:null") {
#if defined OS_ANDROID
            android_audioWrite(device, data);
#else
            if (device->samplingbits == 32)
                device->iodevice->write(data.data(), data.size());
            else {
                QByteArrayView bdata = floatToBytes(data, device->samplingbits);
                device->iodevice->write(bdata.data(), bdata.size());
            }
#endif
        }

        return;
    }

    if (device->buffer.size() < 4 * device->processsize)
        device->buffering = true;

    device->buffer.append(data);
    emit audioDevice_Slave(device->samplerate, data);
}


QAudioDevice Box::audioDevice_fromName(const QString &devname)
{
    if (m_remote)
        return QAudioDevice();

    for (QAudioDevice &device : QMediaDevices::audioInputs())
        if (devname == "I:" + device.description().trimmed())
            return device;

    for (QAudioDevice &device : QMediaDevices::audioOutputs())
        if (devname == "O:" + device.description().trimmed())
            return device;

    return QAudioDevice();
}


void Box::videoDevice_close(const int devid)
{
    if (m_remote)
        return;

    QMutexLocker locker(&m_videoDevice_mutex);

    VideoDevice *device = G_BOX->videoDevices()->value(devid);

    if (!device)
        return;

    if (G_VERBOSE) qInfo() << qPrintable("BOX: Closing video device " + videoDevice_description(device->devname));

    disconnect(device->videosink, &QVideoSink::videoFrameChanged, this, &Box::videoDeviceReadyRead);
    device->camera->stop();
    delete device->camera;
    delete device->videosink;
    delete device->capture;
    delete device;

    G_BOX->videoDevices()->remove(devid);
}


QString Box::videoDevice_default()
{
    if (m_remote)
        return QString();

    return QMediaDevices::defaultVideoInput().description().trimmed();
}


QString Box::videoDevice_description(const QString &devname)
{
    if (m_remote)
        return remoteBox("videoDevice_description", devname);

    QCameraDevice device = videoDevice_fromName(devname);
    if (device.isNull())
        return devname;
    else
        return device.description().trimmed();
}


QList<int> Box::videoDevice_frameRates(const QString &devname)
{
    QList<int> list;

    if (m_remote)
        return list;

    QCameraDevice device = videoDevice_fromName(devname);
    if (device.isNull())
        return QList<int>();

    int item;

    for (QCameraFormat &format : device.videoFormats()) {
#if defined NOGUI
        if (format.pixelFormat() != QVideoFrameFormat::Format_Jpeg)
            continue;
#endif
        item = format.maxFrameRate();
        if (!list.contains(item))
            list << item;
    }

    return list;
}


bool Box::videoDevice_isOpen()
{
    if (m_remote)
        return false;

    return !G_BOX->videoDevices()->isEmpty();
}


bool Box::videoDevice_isOpen(const QString &devname)
{
    if (devname.isEmpty())
        return false;

    if (m_remote)
        return false;

    QList<VideoDevice *> devs = G_BOX->videoDevices()->values();
    for (VideoDevice *&dev : devs)
        if (dev->devname == devname)
            return true;

    return false;
}


QList<QString> Box::videoDevice_list()
{
    if (m_remote)
        return Settings::stringToListString(remoteBox("videoDevice_list"));

    QList<QString> list;

    for (QCameraDevice &device : QMediaDevices::videoInputs())
        list << device.description().trimmed();
    return list;
}


int Box::videoDevice_open(const QString &devname, const QString &mode)
//mode: resolution, framerate
{
    if (m_remote)
        return -1;

    QMutexLocker locker(&m_videoDevice_mutex);

    QString lmode = mode;
    QList<QString> amode = lmode.replace(" ", "").split(',');
    if (amode.size() < 2)
        return -1;

    QString sresolution = amode.at(0);
    int framerate = amode.at(1).toInt();

    if (!videoDevice_resolutions(devname).contains(sresolution))
        return -1;

    if (!videoDevice_frameRates(devname).contains(framerate))
        return -1;

    if (!getPermission("camera"))
        return -1;

    if (G_VERBOSE) qInfo() << qPrintable("BOX: Opening video device " + videoDevice_description(devname) + " " + mode);

    QSize resolution;
    qsizetype pos = sresolution.indexOf("x");
    if (pos > 0) {
        int w = sresolution.first(pos).toInt();
        int h = sresolution.sliced(pos + 1).toInt();
        resolution = QSize(w, h);
    } else
        resolution = QSize(0, 0);

    QCameraDevice device = videoDevice_fromName(devname);
    if (device.isNull())
        return -1;

    QCameraFormat selectedformat;

    for (QCameraFormat &format : device.videoFormats())
        if (format.resolution() == resolution && static_cast<int>(format.maxFrameRate()) == framerate && format.pixelFormat() == QVideoFrameFormat::Format_Jpeg)
            selectedformat = format;

    if (selectedformat.isNull()) {
        for (QCameraFormat &format : device.videoFormats())
            if (format.resolution() == resolution && static_cast<int>(format.maxFrameRate()) == framerate)
                selectedformat = format;
    }

    if (selectedformat.isNull())
        return -1;

#if defined NOGUI
    if (selectedformat.pixelFormat() != QVideoFrameFormat::Format_Jpeg)
        return -1;
#endif

    VideoDevice *videodevice = new VideoDevice(this);
    QMediaCaptureSession *capture = new QMediaCaptureSession(this);
    QVideoSink *videosink = new QVideoSink(this);
    QCamera *camera = new QCamera(device, this);
    int deviceid = G_BOX->id();
    G_BOX->videoDevices()->insert(deviceid, videodevice);

    videodevice->quality = -1;
    videodevice->id = deviceid;
    videodevice->devname = devname;
    videodevice->capture = capture;
    videodevice->videosink = videosink;
    videodevice->camera = camera;
    capture->setCamera(camera);
    capture->setVideoSink(videosink);
    videosink->setObjectName(QString::number(deviceid));
    camera->setCameraFormat(selectedformat);
    camera->start();
    connect(videosink, &QVideoSink::videoFrameChanged, this, &Box::videoDeviceReadyRead);

    return deviceid;
}


QString Box::videoDevice_orientation(const QString &devname)
{
    Q_UNUSED(devname)

#if defined NOGUI
    return "LANDSCAPE";
#else
    Qt::ScreenOrientation orientation = qApp->primaryScreen()->orientation();

    if (orientation == Qt::LandscapeOrientation || orientation == Qt::InvertedLandscapeOrientation)
        return "LANDSCAPE";
    else
        return "PORTRAIT";
#endif
}


QString Box::videoDevice_position(const QString &devname)
{
    if (m_remote)
        return QString();

    QCameraDevice device = videoDevice_fromName(devname);
    if (device.isNull())
        return QString();
    if (device.position() == QCameraDevice::FrontFace)
        return "FRONT";
    else if (device.position() == QCameraDevice::BackFace)
        return "BACK";
    else
        return "??";
}


QList<QString> Box::videoDevice_resolutions(const QString &devname)
{
    QList<QString> list;

    if (m_remote)
        return list;

    QCameraDevice device = videoDevice_fromName(devname);
    if (device.isNull())
        return list;

    QString item;
    for (QCameraFormat &format : device.videoFormats()) {
#if defined NOGUI
        if (format.pixelFormat() != QVideoFrameFormat::Format_Jpeg)
            continue;
#endif
        item = QString::number(format.resolution().width()) + "x" + QString::number(format.resolution().height());
        if (!list.contains(item))
            list << item;
    }

    return list;
}


void Box::videoDevice_setQuality(const int devid, const int quality)
{
    if (m_remote)
        return;

    VideoDevice *device = G_BOX->videoDevices()->value(devid);

    if (!device)
        return;

    device->quality = quality;
}


QByteArrayView Box::videoDevice_takeShot(const int devid)
{
    if (m_remote)
        return QByteArrayView();

    VideoDevice *device = G_BOX->videoDevices()->value(devid);

    if (!device)
        return QByteArrayView();

    QByteArray data;
    QBuffer buffer(&data);
    buffer.open(QIODevice::WriteOnly);
    device->capture->videoSink()->videoFrame().toImage().save(&buffer, "JPG");
    buffer.close();

    QByteArrayView output = G_BOX->mem()->alloc(data);

    return output;
}


QCameraDevice Box::videoDevice_fromName(const QString &devname)
{
    if (m_remote)
        return QCameraDevice();

    for (QCameraDevice &device : QMediaDevices::videoInputs())
        if (devname == device.description().trimmed())
            return device;

    return QCameraDevice();
}


void Box::serialPort_close(const int devid)
{
    if (m_remote)
        return;

    QMutexLocker locker(&m_serialPort_mutex);

    SerialPortDevice *device = G_BOX->serialPorts()->value(devid);

    if (!device)
        return;

#if defined SERIAL
    if (G_VERBOSE) qInfo() << qPrintable("BOX: Closing serial port " + serialPort_description(device->devname));

    disconnect(device->serialport);
    device->serialport->close();
    device->serialport->deleteLater();
    delete device;

    G_BOX->serialPorts()->remove(devid);

#elif defined OS_ANDROID
    if (G_VERBOSE) qInfo() << qPrintable("BOX: Closing serial port " + device->devname);

    QEventLoop loop;
    QThread *thread = device->worker->thread();
    connect(device->worker, &USBSerialWorker::stopped, thread, &QThread::quit);
    connect(thread, &QThread::finished, &loop, &QEventLoop::quit);
    device->worker->stop();
    loop.exec();
    thread->deleteLater();
    device->worker->deleteLater();
    device->worker = nullptr;

    alibserial_close(device->devname.toUtf8().data());
    delete device;

    G_BOX->serialPorts()->remove(devid);

#else
    Q_UNUSED(devid)
    return;
#endif
}


QString Box::serialPort_description(const QString &devname)
{
    if (devname.isEmpty())
        return QString();

    if (m_remote)
        return remoteBox("serialPort_description", devname);

#if defined SERIAL
    return QSerialPortInfo(devname).description().trimmed();

#elif defined OS_ANDROID
    return QString(alibserial_description(id.toUtf8().data()));

#else
    return QString();
#endif
}


int Box::serialPort_DTR(const int devid, const int newDTR)
{
    if (m_remote)
        return -1;

    SerialPortDevice *device = G_BOX->serialPorts()->value(devid);

    if (!device)
        return -1;

#if defined SERIAL
    QSerialPort *dev = device->serialport;

    if (newDTR != -1)
        dev->setDataTerminalReady(newDTR == 1);

    return dev->isDataTerminalReady() ? 1 : 0;

#elif defined OS_ANDROID
    return alibserial_dtr(device->devname.toUtf8().data(), newDTR);

#else
    Q_UNUSED(devid)
    Q_UNUSED(newDTR)
    return -1;
#endif
}


bool Box::serialPort_isOpen(const QString &devname)
{
    if (devname.isEmpty())
        return false;

    if (m_remote)
        return false;

#if defined SERIAL
    QList<SerialPortDevice *> devs = G_BOX->serialPorts()->values();
    for (SerialPortDevice *&dev : devs)
        if (dev->devname == devname)
            return true;
    return false;

#elif defined OS_ANDROID
    return alibserial_isopen(id.toUtf8().data()) != 0;

#else
    return false;
#endif
}


QList<QString> Box::serialPort_list()
{
    if (m_remote)
        return Settings::stringToListString(remoteBox("serialPort_list"));

    QList<QString> list;
#if defined SERIAL
    for (QSerialPortInfo &device : QSerialPortInfo::availablePorts())
        if (device.productIdentifier() > 0)
            list << device.portName();

#elif defined OS_ANDROID
    char **list_dev;
    ssize_t num_dev = alibserial_get_device_list(&list_dev);

    if (num_dev == 0)
        return list;

    for (ssize_t i = 0; i < num_dev; ++i) {
        list << QString(list_dev[i]);
        delete list_dev[i];
    }

    delete list_dev;
#endif

    return list;
}


QString Box::serialPort_manufacturer(const QString &devname)
{
    if (devname.isEmpty())
        return QString();

    if (m_remote)
        return QString();

#if defined SERIAL
    return QSerialPortInfo(devname).manufacturer();

#elif defined OS_ANDROID
    return QString(alibserial_manufacturer(id.toUtf8().data()));

#else
    return QString();
#endif
}


int Box::serialPort_open(const QString &devname, const QString &mode)
{// mode: baud-rate, parity, data-bits, stop-bits, flow-control
    if (m_remote)
        return -1;

    QMutexLocker locker(&m_serialPort_mutex);

    if (serialPort_isOpen(devname))
        return -1;

#if defined SERIAL
    QSerialPortInfo serialportinfo(devname);

    if (serialportinfo.isNull())
        return -1;

    QString lmode = mode;
    QList<QString> amode = lmode.replace(" ", "").toUpper().split(',');
    if (amode.size() != 5)
        return -1;

    if (G_VERBOSE) qInfo() << qPrintable("BOX: Opening serial port " + serialPort_description(devname) + " (" + mode + ")");

    QSerialPort *serialport = new QSerialPort(serialportinfo);

    serialport->setBaudRate(amode.at(0).toInt());

    if (amode.at(1) == "N")
        serialport->setParity(QSerialPort::NoParity);
    else if (amode.at(1) == "E")
        serialport->setParity(QSerialPort::EvenParity);
    else if (amode.at(1) == "O")
        serialport->setParity(QSerialPort::OddParity);
    else if (amode.at(1) == "S")
        serialport->setParity(QSerialPort::SpaceParity);
    else if (amode.at(1) == "M")
        serialport->setParity(QSerialPort::MarkParity);
    else {
        serialport->deleteLater();
        return -1;
    }

    if (amode.at(2) == "8")
        serialport->setDataBits(QSerialPort::Data8);
    else if (amode.at(2) == "7")
        serialport->setDataBits(QSerialPort::Data7);
    else if (amode.at(2) == "6")
        serialport->setDataBits(QSerialPort::Data6);
    else if (amode.at(2) == "5")
        serialport->setDataBits(QSerialPort::Data5);
    else {
        serialport->deleteLater();
        return -1;
    }

    if (amode.at(3) == "1")
        serialport->setStopBits(QSerialPort::OneStop);
    else if (amode.at(3) == "1.5")
        serialport->setStopBits(QSerialPort::OneAndHalfStop);
    else if (amode.at(3) == "2")
        serialport->setStopBits(QSerialPort::TwoStop);
    else {
        serialport->deleteLater();
        return -1;
    }

    if (amode.at(4) == "NO")
        serialport->setFlowControl(QSerialPort::NoFlowControl);
    else if (amode.at(4) == "HW")
        serialport->setFlowControl(QSerialPort::HardwareControl);
    else if (amode.at(4) == "SW")
        serialport->setFlowControl(QSerialPort::SoftwareControl);
    else {
        serialport->deleteLater();
        return -1;
    }

    if (!serialport->open(QIODevice::ReadWrite)) {
        if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening serial port " + serialPort_description(devname) + " " + mode);
        serialport->deleteLater();
        return -1;
    }

    SerialPortDevice *device = new SerialPortDevice(this);
    int deviceid = G_BOX->id();
    device->id = deviceid;
    device->devname = devname;
    device->serialport = serialport;
    device->mode = mode;
    G_BOX->serialPorts()->insert(deviceid, device);

    serialport->setRequestToSend(true);

    serialport->setObjectName(QString::number(deviceid));
    connect(serialport, &QSerialPort::readyRead, this, &Box::serialPortReadyRead);
    connect(serialport, &QSerialPort::errorOccurred, this, &Box::serialPortErrorOccurred);

    if (!m_rtstimer) {
        m_rtstimer = new QTimer(this);
        m_rtstimer->start(5000);
        connect(m_rtstimer, &QTimer::timeout, this, &Box::RTSTimer);
    }

    return deviceid;

#elif defined OS_ANDROID
    if (G_VERBOSE) qInfo() << qPrintable("BOX: Opening serial port " + devname + " " + mode);

    int r = alibserial_open(devname.toUtf8().data(), mode.toUtf8().data());
    if (r != 0)	{
        if (G_VERBOSE) qInfo() << qPrintable("BOX: Error opening serial port " + devname + " " + mode);
        return -1;
    }

    SerialPortDevice *device = new SerialPortDevice(this);
    int deviceid = G_BOX->id();
    device->id = deviceid;
    device->devname = devname;
    device->mode = mode;

    QEventLoop loop;
    QThread *thread = new QThread(this);
    device->worker = new USBSerialWorker(this, device);
    device->worker->setBufLen(1024);
    device->worker->moveToThread(thread);
    connect(thread, &QThread::started, device->worker, &USBSerialWorker::start);
    connect(device->worker, &USBSerialWorker::started, &loop, &QEventLoop::quit);
    thread->start();
    loop.exec();

    G_BOX->serialPorts()->insert(deviceid, device);

    serialPort_RTS(deviceid, 1);

    return deviceid;

#else
    Q_UNUSED(devname)
    Q_UNUSED(mode)
    return -1;
#endif
}


int Box::serialPort_RTS(const int devid, const int newRTS)
{
    if (m_remote)
        return -1;

    SerialPortDevice *device = G_BOX->serialPorts()->value(devid);

    if (!device)
        return -1;

#if defined SERIAL
    QSerialPort *dev = device->serialport;

    if (newRTS != -1)
        dev->setRequestToSend(newRTS == 1);

    return dev->isRequestToSend() ? 1 : 0;

#elif defined OS_ANDROID
    return alibserial_rts(device->devname.toUtf8().data(), newRTS);

#else
    Q_UNUSED(devid)
    Q_UNUSED(newRTS)
    return -1;
#endif
}


QString Box::serialPort_serialNumber(const QString &devname)
{
    if (devname.isEmpty())
        return QString();

    if (m_remote)
        return QString();

#if defined SERIAL
    return QSerialPortInfo(devname).serialNumber();

#elif defined OS_ANDROID
    return QString(alibserial_serialnumber(devname.toUtf8().data()));

#else
    return QString();
#endif
}


QString Box::serialPort_systemLocation(const QString &devname)
{
    if (devname.isEmpty())
        return QString();

    if (m_remote)
        return QString();

#if defined SERIAL

    return QSerialPortInfo(devname).systemLocation();

#elif defined OS_ANDROID
    return QString(alibserial_systemlocation(devname.toUtf8().data()));

#else
    return QString();
#endif
}


void Box::serialPort_write(const int devid, const QByteArray &data)
{
    if (m_remote)
        return;

    SerialPortDevice *device = G_BOX->serialPorts()->value(devid);

    if (!device)
        return;

#if defined SERIAL
    device->serialport->write(data);
    device->serialport->waitForBytesWritten();

#elif defined OS_ANDROID
    alibserial_write(device->devname.toUtf8().data(), (char *)data.data());

#else
    Q_UNUSED(devid)
    Q_UNUSED(data)
    return;
#endif
}


int Box::USB_attach_kernel_driver(const int usbhandleid, const int interface)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r =  libusb_attach_kernel_driver(device->handle, interface);

    if (r == LIBUSB_SUCCESS)
        device->driver_active = false;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    return 0;
#endif
}


int Box::USB_bulk_transfer(const int usbhandleid, const int endpoint, const QByteArray &data, const int len, const int timeout)
{
    if (m_remote) {
        QList<QString> param;
        param << QString::number(usbhandleid);
        param << QString::number(endpoint);
        param << QString(data.toBase64());
        param << QString::number(len);
        param << QString::number(timeout);

        return remoteBox("USB_bulk_transfer", Settings::listToString(param)).toInt();
    }

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r = libusb_bulk_transfer(device->handle, endpoint, (unsigned char *)data.data(), len, nullptr, timeout);

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(endpoint)
    Q_UNUSED(data)
    Q_UNUSED(len)
    Q_UNUSED(timeout)
    return -1;
#endif
}


void Box::USB_bulk_transfer_setBufLen(const int usbhandleid, const int buflen)
{
    if (m_remote)
        return;

    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return;

    device->buflen = buflen;

    if (device->worker)
        device->worker->setBufLen(buflen);
}


void Box::USB_bulk_transfer_start(const int usbhandleid, const int endpoint, const Box::USBMode mode, const int size)
{
    if (m_remote)
        return;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return;

    if (!device->handle)
        return;

    QEventLoop loop;
    QThread *thread = new QThread(this);
    device->worker = new USBWorker(this, device, endpoint, mode, size);
    device->worker->setBufLen(device->buflen);
    device->worker->moveToThread(thread);
    connect(thread, &QThread::started, device->worker, &USBWorker::start);
    connect(device->worker, &USBWorker::started, &loop, &QEventLoop::quit);
    thread->start();
    loop.exec();

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(endpoint)
    Q_UNUSED(mode)
#endif
}


void Box::USB_bulk_transfer_stop(const int usbhandleid)
{
    if (m_remote)
        return;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return;

    if (!device->worker)
        return;

    QEventLoop loop;
    QThread *thread = device->worker->thread();
    connect(device->worker, &USBWorker::stopped, thread, &QThread::quit);
    connect(thread, &QThread::finished, &loop, &QEventLoop::quit);
    device->worker->stop();
    loop.exec();
    thread->deleteLater();
    device->worker->deleteLater();
    device->worker = nullptr;
#else
    Q_UNUSED(usbhandleid)
#endif
}


int Box::USB_claim_interface(const int usbhandleid, const int interface)
{
    if (m_remote)
        return remoteBox("USB_claim_interface", Settings::listToString(QList<int>() << usbhandleid << interface)).toInt();

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return -1;

    if (!device->handle)
        return 1;

    int r = libusb_claim_interface(device->handle, interface);

    if (r == LIBUSB_SUCCESS)
        device->interface = interface;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    return 0;
#endif
}


int Box::USB_close(const int usbhandleid)
{
    if (m_remote)
        return remoteBox("USB_close", QString::number(usbhandleid)).toInt();

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return -1;

    if (device->parent != this)
        return -1;

    if (device->interface > -1) {
        libusb_release_interface(device->handle, device->interface);
        if (device->driver_active)
            libusb_attach_kernel_driver(device->handle, device->interface);
    }

    libusb_close(device->handle);
    delete device;

    G_BOX->usbDevices()->remove(usbhandleid);

    return 0;

#else
    Q_UNUSED(usbhandleid)
    return -1;
#endif
}


QByteArray Box::USB_control_transfer(const int usbhandleid, const int type, const int request, const int value, const int index, const QByteArray &data, const int len, const int timeout)
{
    if (m_remote) {
        QList<QString> param;
        param << QString::number(usbhandleid);
        param << QString::number(type);
        param << QString::number(request);
        param << QString::number(value);
        param << QString::number(index);
        param << QString(data.toBase64());
        param << QString::number(len);
        param << QString::number(timeout);

        return QByteArray::fromBase64(remoteBox("USB_control_transfer", Settings::listToString(param)).toUtf8());
    }

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return QByteArray();

    if (!device->handle)
        return QByteArray();

    QByteArray idata = data;
    idata.resize(len, 0);

    int r = libusb_control_transfer(device->handle, type, request, value, index, (unsigned char *)idata.data(), len, timeout);

    if (r < 1)
        return QByteArray();
    else
        return idata.first(len);

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(type)
    Q_UNUSED(request)
    Q_UNUSED(value)
    Q_UNUSED(index)
    Q_UNUSED(len)
    Q_UNUSED(data)
    Q_UNUSED(timeout)
    return QByteArray();
#endif
}


int Box::USB_detach_kernel_driver(const int usbhandleid, const int interface)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r = libusb_detach_kernel_driver(device->handle, interface);

    if (r == LIBUSB_SUCCESS)
        device->driver_active = true;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    return 0;
#endif
}


int Box::USB_get_device(const int usbhandleid)
{
    if (m_remote)
        return -1;

    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return -1;

    return device->deviceid;
}


QList<int> Box::USB_get_device_descriptor(const int usbdeviceid)
{
    if (m_remote)
        return Settings::stringToListInt(remoteBox("USB_get_device_descriptor", QString::number(usbdeviceid)));

    QList<int> desc;

#if defined USB
    libusb_device **list_dev;
    libusb_device *dev = nullptr;
    ssize_t num_dev = libusb_get_device_list(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i)
        if (usb_device_id(list_dev[i]) == usbdeviceid)
            dev = list_dev[i];

    if (!dev) {
        libusb_free_device_list(list_dev, 1);
        return desc;
    }

    struct libusb_device_descriptor descriptor;
    int r = libusb_get_device_descriptor(dev, &descriptor);
    libusb_free_device_list(list_dev, 1);

    if (r < 0)
        return desc;

    desc << descriptor.bLength;
    desc << descriptor.bDescriptorType;
    desc << descriptor.bcdUSB;
    desc << descriptor.bDeviceClass;
    desc << descriptor.bDeviceSubClass;
    desc << descriptor.bDeviceProtocol;
    desc << descriptor.bMaxPacketSize0;
    desc << descriptor.idVendor;
    desc << descriptor.idProduct;
    desc << descriptor.bcdDevice;
    desc << descriptor.iManufacturer;
    desc << descriptor.iProduct;
    desc << descriptor.iSerialNumber;
    desc << descriptor.bNumConfigurations;
#endif

    return desc;
}


QList<int> Box::USB_get_device_list()
{
    if (m_remote)
        return Settings::stringToListInt(remoteBox("USB_get_device_list"));

    QList<int> list;

#if defined USB
    libusb_device **list_dev;
    ssize_t num_dev = libusb_get_device_list(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i)
        list << usb_device_id(list_dev[i]);

    std::sort(list.begin(), list.end());

    libusb_free_device_list(list_dev, 1);
#endif

    return list;
}


QString Box::USB_get_string_descriptor_ascii(const int usbhandleid, const int index)
{
    if (m_remote)
        return remoteBox("USB_get_string_descriptor_ascii", Settings::listToString(QList<int>() << usbhandleid << index));

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return QString();

    if (!device->handle)
        return QString();

    unsigned char data[256];
    int r = libusb_get_string_descriptor_ascii(device->handle, index, data, 256);

    if (r > 0)
        return QString((const char *)data);
    else
        return QString();

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(index)
    return QString();
#endif
}


int Box::USB_kernel_driver_active(const int usbhandleid, const int interface)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    return libusb_kernel_driver_active(device->handle, interface);

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    return 0;
#endif
}


int Box::USB_open(const int usbdeviceid, const int interface)
{
    if (m_remote)
        return remoteBox("USB_open", Settings::listToString(QList<int>() << usbdeviceid << interface)).toInt();

#if defined USB
    QMutexLocker locker(&m_USBDevice_mutex);

    QList<int> keys = G_BOX->usbDevices()->keys();
    for (int &usbhandleid : keys)
        if (G_BOX->usbDevices()->value(usbhandleid)->deviceid == usbdeviceid)
            return usbhandleid;

    libusb_device **list_dev;
    libusb_device *dev = nullptr;
    ssize_t num_dev = libusb_get_device_list(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i)
        if (usb_device_id(list_dev[i]) == usbdeviceid)
            dev = list_dev[i];

    if (!dev) {
        libusb_free_device_list(list_dev, 1);
        return -1;
    }

    libusb_device_handle *handle;

    int r = libusb_open(dev, &handle);

    if (r != LIBUSB_SUCCESS)
        return r;

    USBDevice *usbdevice = new USBDevice(this);
    usbdevice->altsetting = 0;
    usbdevice->buflen = 0;
    usbdevice->busy = false;
    usbdevice->configuration = 0;
    usbdevice->deviceid = usbdeviceid;
    usbdevice->driver_active = false;
    usbdevice->handle = handle;
    usbdevice->interface = -1;
    usbdevice->parent = this;
    usbdevice->worker = nullptr;

    int usbhandleid = G_BOX->id();
    usbdevice->id = usbhandleid;
    G_BOX->usbDevices()->insert(usbhandleid, usbdevice);

    if (interface > -1)
        libusb_release_interface(handle, interface);

    int conf = 0;
    libusb_get_configuration(handle, &conf);
    if (conf == 0)
        libusb_set_configuration(handle, 1);

    if (interface > -1) {
        usbdevice->driver_active = false;
        if (libusb_kernel_driver_active(handle, interface) == 1)
            if (libusb_detach_kernel_driver(handle, interface) == LIBUSB_SUCCESS)
                usbdevice->driver_active = true;

        if (libusb_claim_interface(handle, interface) == LIBUSB_SUCCESS)
            usbdevice->interface = interface;
    }

    return usbhandleid;

#else
    Q_UNUSED(usbdeviceid)
    return -1;
#endif
}


int Box::USB_release_interface(const int usbhandleid, const int interface)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r = libusb_release_interface(device->handle, interface);

    if (r == LIBUSB_SUCCESS)
        device->interface = -1;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    return 0;
#endif
}


int Box::USB_reset_device(const int usbhandleid)
{
    if (m_remote)
        return remoteBox("USB_reset_device", QString::number(usbhandleid)).toInt();

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    return libusb_reset_device(device->handle);

#else
    Q_UNUSED(usbhandleid)
    return 0;
#endif
}


void Box::USB_setBusy(const int usbhandleid, const bool busy)
{
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return;

    device->busy = busy;
}


int Box::USB_set_configuration(const int usbhandleid, const int configuration)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r = libusb_set_configuration(device->handle, configuration);

    if (r == LIBUSB_SUCCESS)
        device->configuration = configuration;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(configuration)
    return 0;
#endif
}


int Box::USB_set_interface_alt_setting(const int usbhandleid, const int interface, const int altsetting)
{
    if (m_remote)
        return -1;

#if defined USB
    USBDevice *device = G_BOX->usbDevices()->value(usbhandleid);

    if (!device)
        return 0;

    if (!device->handle)
        return 0;

    int r = libusb_set_interface_alt_setting(device->handle, interface, altsetting);

    if (r == LIBUSB_SUCCESS)
        device->altsetting = altsetting;

    return r;

#else
    Q_UNUSED(usbhandleid)
    Q_UNUSED(interface)
    Q_UNUSED(altsetting)
    return 0;
#endif
}


bool Box::USBDevice_close(const QString &devname)
{
    if (m_remote)
        return remoteBox("USBDevice_close", devname) == "true";

#if defined USB
    if (devname.size() < 9)
        return false;

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);
    int order = 0;
    int count = 0;
    int usbdeviceid;

    if (devname.size() > 10)
        order = devname.sliced(10).toInt();

    libusb_device **list_dev;
    struct libusb_device_descriptor descriptor;
    ssize_t num_dev = usb_sortedlist(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i) {
        int r = libusb_get_device_descriptor(list_dev[i], &descriptor);
        if (r == LIBUSB_SUCCESS) {
            if (descriptor.idVendor == vid && descriptor.idProduct == pid) {
                if (order == count) {
                    usbdeviceid = usb_device_id(list_dev[i]);
                    QList<USBDevice *> devs = G_BOX->usbDevices()->values();
                    for (USBDevice *&dev : devs)
                        if (dev->deviceid == usbdeviceid) {
                            libusb_free_device_list(list_dev, 1);
                            return USB_close(dev->id);
                        }
                }
                ++count;
            }
        }
    }

    libusb_free_device_list(list_dev, 1);
#endif

    return false;
}


QString Box::USBDevice_description(const QString &devname)
{
    if (m_remote)
        return remoteBox("USBDevice_description", devname);

    if (devname.size() < 9)
        return QString();

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);

    return usb_description(vid, pid);
}


QList<QString> Box::USBDevice_list()
{
    if (m_remote)
        return Settings::stringToListString(remoteBox("USBDevice_list"));

    QList<QString> ret;

#if defined USB
    QString id;
    int r, count;
    libusb_device **list_dev;
    struct libusb_device_descriptor descriptor;
    ssize_t num_dev = usb_sortedlist(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i) {
        r = libusb_get_device_descriptor(list_dev[i], &descriptor);
        if (r == LIBUSB_SUCCESS) {
            id = QString::number(descriptor.idVendor, 16).rightJustified(4, '0').toUpper();
            id += ":";
            id += QString::number(descriptor.idProduct, 16).rightJustified(4, '0').toUpper();
            ret << id;
        }
    }

    libusb_free_device_list(list_dev, 1);

    for (qsizetype i = 0; i < num_dev; ++i) {
        if (ret.at(i).size() == 9 && i < num_dev - 1) {
            count = 1;
            for (qsizetype j = i + 1; j < num_dev; ++j)
                if (ret.at(i) == ret.at(j))
                    ret[j] += ":" + QString::number(count++);
            if (count > 1)
                ret[i] += ":0";
        }
    }
#endif

    return ret;
}


QString Box::USBDevice_manufacturer(const QString &devname)
{
    if (m_remote)
        return remoteBox("USBDevice_manufacturer", devname);

    if (devname.size() < 9)
        return QString();

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);

    return usb_manufacturer(vid, pid);
}


int Box::USBDevice_open(const QString &devname, const int interface)
{
    if (m_remote)
        return remoteBox("USBDevice_open", devname).toInt();

#if defined USB
    if (devname.size() < 9)
        return -1;

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);
    int order = 0;
    int count = 0;
    int usbdeviceid = -1;

    if (devname.size() > 10)
        order = devname.sliced(10).toInt();

    libusb_device **list_dev;
    struct libusb_device_descriptor descriptor;
    ssize_t num_dev = usb_sortedlist(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i) {
        int r = libusb_get_device_descriptor(list_dev[i], &descriptor);
        if (r == LIBUSB_SUCCESS) {
            if (descriptor.idVendor == vid && descriptor.idProduct == pid) {
                if (order == count) {
                    usbdeviceid = usb_device_id(list_dev[i]);
                    break;
                }
                ++count;
            }
        }
    }

    libusb_free_device_list(list_dev, 1);

    if (usbdeviceid < 0)
        return -1;

    return USB_open(usbdeviceid, interface);
#endif

    return -1;
}


QString Box::USBDevice_serialNumber(const QString &devname)
{
    if (m_remote)
        return remoteBox("USBDevice_serialNumber", devname);

    QString ret;

#if defined USB
    if (devname.size() < 9)
        return ret;

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);

    libusb_device_handle *handle = libusb_open_device_with_vid_pid(m_usbcontext, vid, pid);
    if (handle != NULL) {
        libusb_device *dev = libusb_get_device(handle);
        struct libusb_device_descriptor descriptor;
        int r = libusb_get_device_descriptor(dev, &descriptor);
        if (r == LIBUSB_SUCCESS) {
            unsigned char data[256];
            r = libusb_get_string_descriptor_ascii(handle, descriptor.iSerialNumber, data, 256);
            if (r > 0)
                ret = QString((const char *)data);
        }
        libusb_close(handle);
    }
#endif

    return ret;
}


bool Box::USBDevice_test(const QString &devname)
{
    if (m_remote)
        return remoteBox("USBDevice_test", devname) == "true";

#if defined USB
    if (devname.size() < 9)
        return false;

    int vid = devname.first(4).toInt(nullptr, 16);
    int pid = devname.sliced(5, 4).toInt(nullptr, 16);
    int order = 0;
    int count = 0;
    int usbdeviceid;

    if (devname.size() > 10)
        order = devname.sliced(10).toInt();

    libusb_device **list_dev;
    struct libusb_device_descriptor descriptor;
    libusb_device_handle *handle;
    ssize_t num_dev = usb_sortedlist(m_usbcontext, &list_dev);

    for (int i = 0; i < num_dev; ++i) {
        int r = libusb_get_device_descriptor(list_dev[i], &descriptor);
        if (r == LIBUSB_SUCCESS) {
            if (descriptor.idVendor == vid && descriptor.idProduct == pid) {
                if (order == count) {
                    usbdeviceid = usb_device_id(list_dev[i]);
                    QList<USBDevice *> devs = G_BOX->usbDevices()->values();
                    for (USBDevice *&dev : devs)
                        if (dev->deviceid == usbdeviceid) {
                            libusb_free_device_list(list_dev, 1);
                            return true;
                        }

                    libusb_open(list_dev[i], &handle);
                    if (handle != NULL) {
                        libusb_free_device_list(list_dev, 1);
                        libusb_close(handle);
                        return true;
                    }
                }
                ++count;
            }
        }
    }

    libusb_free_device_list(list_dev, 1);
#endif

    return false;
}


QString Box::usb_description(int vid, int pid)
{
    QFile file(":/resources/usb.ids");
    QByteArray id1 = QByteArray::number(vid, 16).rightJustified(4, '0');
    QByteArray id2 = QByteArray::number(pid, 16).rightJustified(4, '0');
    QString ret;
    QByteArray line;

    if (file.open(QFile::ReadOnly | QFile::Text)) {
        bool manuf = false;
        while (!file.atEnd()) {
            line = file.readLine();
            if (manuf) {
                if (line.startsWith("\t")) {
                    if (line.sliced(1, 4) == id2) {
                        file.close();
                        ret = line.sliced(7).replace("\n", "");
                        break;
                    }
                } else {
                    file.close();
                    break;
                }
            } else {
                if (line.startsWith(id1))
                    manuf = true;
            }
        }
        file.close();
    }

#if defined USB
    if (ret.isEmpty()) {
        libusb_device_handle *handle = libusb_open_device_with_vid_pid(m_usbcontext, vid, pid);
        if (handle != NULL) {
            libusb_device *dev = libusb_get_device(handle);
            struct libusb_device_descriptor descriptor;
            int r = libusb_get_device_descriptor(dev, &descriptor);
            if (r == LIBUSB_SUCCESS) {
                unsigned char data[256];
                r = libusb_get_string_descriptor_ascii(handle, descriptor.iProduct, data, 256);
                if (r > 0)
                    ret = QString((const char *)data);
            }
            libusb_close(handle);
        }
    }
#endif

    return ret;
}


QString Box::usb_manufacturer(int vid, int pid)
{
    QFile file(":/resources/usb.ids");
    QByteArray id1 = QByteArray::number(vid, 16).rightJustified(4, '0');
    QString ret;
    QByteArray line;

    if (file.open(QFile::ReadOnly | QFile::Text)) {
        while (!file.atEnd()) {
            line = file.readLine();
            if (line.startsWith(id1)) {
                file.close();
                ret = line.mid(6).replace("\n", "");
                break;
            }
        }
        file.close();
    }

#if defined USB
    if (ret.isEmpty()) {
        libusb_device_handle *handle = libusb_open_device_with_vid_pid(m_usbcontext, vid, pid);
        if (handle != NULL) {
            libusb_device *dev = libusb_get_device(handle);
            struct libusb_device_descriptor descriptor;
            int r = libusb_get_device_descriptor(dev, &descriptor);
            if (r == LIBUSB_SUCCESS) {
                unsigned char data[256];
                r = libusb_get_string_descriptor_ascii(handle, descriptor.iManufacturer, data, 256);
                if (r > 0)
                    ret = QString((const char *)data);
            }
            libusb_close(handle);
        }
    }
#endif

    return ret;
}


ssize_t Box::usb_sortedlist(libusb_context *ctx, libusb_device ***list)
{
    int devid;
    ssize_t num_dev = libusb_get_device_list(ctx, list);
    struct libusb_device_descriptor descriptor;
    QMap<int, libusb_device *> sortedlist;

    for (ssize_t i = 0; i < num_dev; ++i) {
        libusb_get_device_descriptor((*list)[i], &descriptor);
        devid = usb_device_id((*list)[i]);
        sortedlist.insert(devid, (*list)[i]);
    }

    int i = 0;
    for (libusb_device *dev : sortedlist)
        (*list)[i++] = dev;

    return num_dev;
}


int Box::usb_device_id(libusb_device *device)
{
#if defined OS_ANDROID
    return libusb_get_device_address(device);
#else
    uint8_t port_numbers[7];
    int ret = libusb_get_bus_number(device);

    int len = libusb_get_port_numbers(device, port_numbers, 7);

    for (int i = 0; i < len; ++i)
        ret = (ret << 4) | port_numbers[i];

    return ret;
#endif
}


float Box::DSP_avg(QByteArrayView input)
{
    if (input.size() == 0)
        return 0;

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    return dsp_avg_float(data, N);
}


QByteArrayView Box::DSP_compress(QByteArrayView input, const int cbits)
{
    if (input.size() == 0)
        return QByteArrayView();

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    float max = -1e8;
    float min = 1e8;
    float *vdata = data;

    for (int i = 0; i < N; ++i) {
        max = qMax(max, *vdata);
        min = qMin(min, *vdata++);
    }

    float range = max - min;

    int olen = 2 * SF + N * cbits / 8;
    char *output = G_BOX->mem()->alloc(olen);

    *(float *)output = min;
    *((float *)output + 1) = range;

    vdata = data;

    if (cbits == 8) {
        unsigned char c;
        unsigned char *voutput = (unsigned char *)(output + 2 * SF);
        for (int i = 0; i < N; ++i) {
            c = (unsigned char)((*vdata++ - min) * 255.0 / range);
            *voutput++ = c;
        }
    } else {
        unsigned short c;
        unsigned short *voutput = (unsigned short *)(output + 2 * SF);
        for (int i = 0; i < N; ++i) {
            c = (unsigned short)((*vdata++ - min) * 65535.0 / range);
            *voutput++ = c;
        }
    }

    return QByteArrayView(output, olen);
}


int Box::DSP_create()
{
    QMutexLocker locker(&m_DSP_mutex);

    Dsp *dsp = new Dsp();
    dsp->agc = -1;
    dsp->deemlast = 0;
    dsp->demlastI = 0;
    dsp->demlastQ = 0;
    dsp->fft_N = 0;
    dsp->fft_window = nullptr;
    dsp->filter_a = nullptr;
    dsp->filter_b = nullptr;
    dsp->filter_i = nullptr;
    dsp->filter_r = nullptr;
    dsp->nrlast = nullptr;
    dsp->nrlen = 0;
    dsp->normAvgI = 0;
    dsp->normAvgQ = 0;
    dsp->reslastI = 0;
    dsp->reslastQ = 0;
    dsp->intDSP = 0;
    dsp->resDSP = 0;
    int dspid = G_BOX->id();
    dsp->id = dspid;
    m_DSPs.insert(dspid, dsp);

    return dspid;
}


QByteArrayView Box::DSP_demodulate(const int dspid, QByteArrayView input, const int fs, const Band band)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF / 2);

    dsp_demodulate_float(dspid, data, N, fs, band);

    return output;
}


void Box::DSP_dump(QByteArrayView input, const QString &filename, const bool append)
{
    if (input.size() == 0)
        return;

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    dsp_dump_float(data, N, filename, append);
}


void Box::DSP_dump_c(QByteArrayView input, const QString &filename, const bool append)
{
    if (input.size() == 0)
        return;

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    dsp_dump_float_c(data, N / 2, filename, append);
}


QByteArrayView Box::DSP_FFT(const int dspid, QByteArrayView input, const int width, const FFTWindow window_type)
{
    if (input.size() == 0)
        return QByteArrayView();

    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return QByteArrayView();

    QByteArrayView vinput = G_BOX->mem()->alloc(input);

    int N = static_cast<int>(vinput.size() / SF);
    N = 1 << static_cast<int>(log2(N));

    FFTUpdateWindow(dsp, window_type, N);

    if (dsp->fft_N == -1)
        return QByteArrayView();

    COMPLEX *cinput = new COMPLEX[N];
    COMPLEX *coutput = new COMPLEX[N];
    float *finput = (float *)vinput.data();
    float *vfinput = finput;
    float avg = 0;

    for (int i = 0; i < N; ++i)
        avg += *vfinput++;

    avg /= N;

    for (int i = 0; i < N; ++i)
        cinput[i] = dsp->fft_window[i] * finput[i] - avg;

    fft(cinput, coutput, N, dsp->fft_twiddles);

    float *foutput = (float *)G_BOX->mem()->alloc(qMax(N / 2, width) * SF);
    float *vfoutput = foutput;
    float x, y;

    for (int i = 0; i < N / 2; ++i) {
        x = coutput[i].real();
        y = coutput[i].imag();
        *vfoutput++ = sqrt(x * x + y * y) / N;
    }

    delete[] cinput;
    delete[] coutput;

    float rx = static_cast<float>(N) / static_cast<float>(width) / 2;
    vfoutput = foutput;

    if (rx > 1)
        for (int i = 0; i < width; ++i)
            *vfoutput++ = foutput[static_cast<int>(rx * i)];
    else
        for (int i = width - 1; i >= 0; --i)
            *vfoutput++ = foutput[static_cast<int>(rx * i)];

    QByteArrayView output = QByteArrayView((char *)foutput, width * SF);

    return output;
}


QByteArrayView Box::DSP_FFT_c(const int dspid, QByteArrayView input, const int width, const FFTWindow window_type)
{
    if (input.size() == 0)
        return QByteArrayView();

    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return QByteArrayView();

    int N = static_cast<int>(input.size() / SF / 2);
    N = 1 << static_cast<int>(log2(N));

    FFTUpdateWindow(dsp, window_type, N);

    if (dsp->fft_N == -1)
        return QByteArrayView();

    COMPLEX *cinput = new COMPLEX[N];
    COMPLEX *coutput = new COMPLEX[N];
    float *finput = (float *)input.data();
    float *vfinput = finput;
    float avgr = 0;
    float avgi = 0;

    for (int i = 0; i < N; ++i) {
        avgr += *vfinput++;
        avgi += *vfinput++;
    }

    avgr /= N;
    avgi /= N;

    for (int i = 0; i < N; ++i)
        cinput[i] = dsp->fft_window[i] * COMPLEX(finput[2 * i] - avgr, finput[2 * i + 1] - avgi);

    fft(cinput, coutput, N, dsp->fft_twiddles);

    float *foutput = (float *)G_BOX->mem()->alloc(N * SF);
    float *vfoutput = foutput;
    float x, y;

    for (int i = N / 2; i < N; ++i) {
        x = coutput[i].real();
        y = coutput[i].imag();
        *vfoutput++ = sqrt(x * x + y * y) / N;
    }

    for (int i = 0; i < N / 2; ++i) {
        x = coutput[i].real();
        y = coutput[i].imag();
        *vfoutput++ = sqrt(x * x + y * y) / N;
    }

    delete[] cinput;
    delete[] coutput;

    if (width > 0 && width < N) {
        float rx = static_cast<float>(N) / static_cast<float>(width);
        float srx = sqrt(rx);
        float *poutput;
        float v;
        int X, j;
        vfoutput = foutput;

        for (int i = 0; i < width; ++i) {
            X = rx * i;
            v = 0;
            poutput = foutput + X;
            for (j = 0; j < rx; ++j)
                v += *poutput++;
            *vfoutput++ = v / srx;
        }

        N = width;
    }

    QByteArrayView output = QByteArrayView((char *)foutput, N * SF);

    return output;
}


QByteArrayView Box::DSP_filter(const int dspid, QByteArrayView input)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_filter_float(dspid, data, N);

    return output;
}


QByteArrayView Box::DSP_filter_c(const int dspid, QByteArrayView input)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_filter_float_c(dspid, data, N / 2);

    return output;
}


float Box::DSP_max(QByteArrayView input)
{
    if (input.size() == 0)
        return 0;

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    return dsp_max_float(data, N);
}


QByteArrayView Box::DSP_mirics_convert(QByteArrayView input, Box::MiricsFormat format, const int rate)
{
    qsizetype cnt = input.size();
    qsizetype max = cnt >> 10;
    qsizetype len, i;
    int j, k;
    unsigned int shift;
    const unsigned char *src = (const unsigned char *)input.data();
    short s;
    float div;
    float div2;

    switch (format) {
    case MF_252:
        len = cnt / 512 * 252;
        break;
    case MF_336:
        len = cnt / 512 * 336;
        break;
    case MF_384:
        len = cnt / 512 * 384;
        break;
    case MF_504:
        len = cnt / 512 * 504;
    }

    float *dst = (float *)G_BOX->mem()->alloc(static_cast<int>(len * SF));
    float *vdst = dst;

    switch (format) {
    case MF_252:
        for (i = 0; i < max; ++i) {
            div = 1.0 / 8192;
            src += 16;
            for (int j = 0; j < 252; ++j) {
                s = *src++ << 2;
                s |= *src++ << 10;
                *vdst++ = s * div;
                s = *src++ << 2;
                s |= *src++ << 10;
                *vdst++ = s * div;
            }
        }
        break;

    case MF_336:
        for (i = 0; i < max; ++i) {
            div = 1.0 / 8192;
            src += 16;
            for (int j = 0; j < 336; ++j) {
                s = (*src++ & 0xff) << 4;
                s |= (*src & 0x0f) << 12;
                *vdst++ = s * div;
                s = *src++ & 0xf0;
                s |= (*src++ & 0xff) << 8;
                *vdst++ = s * div;
            }
        }
        break;

    case MF_384:
        div = 1.0 / 12288;
        for (i = 0; i < max; ++i) {
            src += 16;
            for (j = 0; j < 6; ++j) {
                shift = src[163] << 24 | src[162] << 16 | src[161] << 8 | src[160];
                for (k = 0; k < 16; ++k) {
                    switch (shift & 0x03) {
                    case 0:
                        div2 = div / 4;
                        break;
                    case 1:
                        div2 = div / 2;
                        break;
                    default:
                        div2 = div;
                    }
                    s = ((src[0] & 0xff) << 6) | ((src[1] & 0x03) << 14); *vdst++ = s * div2;
                    s = ((src[1] & 0xfc) << 4) | ((src[2] & 0x0f) << 12); *vdst++ = s * div2;
                    s = ((src[2] & 0xf0) << 2) | ((src[3] & 0x3f) << 10); *vdst++ = s * div2;
                    s = ((src[3] & 0xc0) << 0) | ((src[4] & 0xff) <<  8); *vdst++ = s * div2;
                    s = ((src[5] & 0xff) << 6) | ((src[6] & 0x03) << 14); *vdst++ = s * div2;
                    s = ((src[6] & 0xfc) << 4) | ((src[7] & 0x0f) << 12); *vdst++ = s * div2;
                    s = ((src[7] & 0xf0) << 2) | ((src[8] & 0x3f) << 10); *vdst++ = s * div2;
                    s = ((src[8] & 0xc0) << 0) | ((src[9] & 0xff) <<  8); *vdst++ = s * div2;
                    shift >>= 2;
                    src += 10;
                }
                src += 4;
            }
            src += 24;
        }
        break;

    case MF_504:
        if (rate == 10080000)
            div = 1.0 / 128;
        else if (rate == 11088000)
            div = 1.0 / 192;
        else
            div = 1.0 / 320;

        for (int i = 0; i < max; ++i) {
            src += 16;
            for (int j = 0; j < 504; ++j) {
                *vdst++ = (signed char)*src++ * div;
                *vdst++ = (signed char)*src++ * div;
            }
        }
        break;

    default:
        break;
    }

    QByteArrayView output = QByteArrayView((char *)dst, len * SF);

    return output;
}


float Box::DSP_min(QByteArrayView input)
{
    if (input.size() == 0)
        return 0;

    int N = static_cast<int>(input.size() / SF);
    float *data = (float *)input.data();

    return dsp_min_float(data, N);
}


QByteArrayView Box::DSP_normalize(const int dspid, QByteArrayView input)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_normalize_float(dspid, data, N);

    return output;
}


QByteArrayView Box::DSP_normalize_c(const int dspid, QByteArrayView input)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_normalize_float_c(dspid, data, N / 2);

    return output;
}


QByteArrayView Box::DSP_NR(const int dspid, QByteArrayView input, const float ratio)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_NR_float(dspid, data, N, ratio);

    return output;
}


void Box::DSP_release(const int dspid)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    if (dsp->intDSP != 0) DSP_release(dsp->intDSP);
    if (dsp->resDSP != 0) DSP_release(dsp->resDSP);

    QMutexLocker locker(&m_DSP_mutex);

    if (dsp->filter_a) delete[] dsp->filter_a;
    if (dsp->filter_b) delete[] dsp->filter_b;
    if (dsp->filter_r) delete[] dsp->filter_r;
    if (dsp->filter_i) delete[] dsp->filter_i;
    if (dsp->fft_twiddles) delete[] dsp->fft_twiddles;
    if (dsp->fft_window) delete[] dsp->fft_window;
    if (dsp->nrlast) delete[] dsp->nrlast;

    delete dsp;

    m_DSPs.remove(dspid);
}


QByteArrayView Box::DSP_resample(const int dspid, QByteArrayView input, const int outputsize)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView idata = G_BOX->mem()->alloc(input);
    float *data = (float *)idata.data();
    int N = static_cast<int>(input.size() / SF);

    dsp_resample_float(dspid, data, N, outputsize);

    QByteArrayView output = QByteArrayView((char *)data, outputsize * SF);

    return output;
}


QByteArrayView Box::DSP_resample_c(const int dspid, QByteArrayView input, const int outputsize)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView idata = G_BOX->mem()->alloc(input);
    float *data = (float *)idata.data();
    int N = static_cast<int>(input.size() / SF);

    dsp_resample_float_c(dspid, data, N / 2, outputsize / 2);

    QByteArrayView output = QByteArrayView((char *)data, outputsize * SF);

    return output;
}


void Box::DSP_resetFilter(const int dspid)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    dsp->filter_order = -1;
}


QByteArrayView Box::DSP_scale(QByteArrayView input, const float scale)
{
    if (input.size() == 0)
        return QByteArrayView();

    QByteArrayView output = G_BOX->mem()->alloc(input);
    float *data = (float *)output.data();
    int N = static_cast<int>(output.size() / SF);

    dsp_scale_float(data, N, scale);

    return output;
}


void Box::DSP_setFilterParams(const int dspid, const int fs, const int f1, const int f2, const int order, const FilterType type, const Box::FilterType algorithm)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    if (f1 == 0 && fs <= 2 * f2) {
        dsp->filter_order = -1;
        return;
    }

    QMutexLocker locker(&dsp->mutex);

    if (algorithm == FT_FIR || algorithm == FT_IFIR) {
        // FIR - Hamming window

        int K;

        if (algorithm == FT_IFIR && fs / (f2 - f1) > 40) {
            K = 10;
            dsp->filter_type = FT_IFIR;
        } else {
            K = 1;
            dsp->filter_type = FT_FIR;
        }

        int old_order = dsp->filter_order;
        float avg_r = 0;
        float avg_i = 0;

        dsp->filter_order = order;

        if (dsp->filter_order < 0)
            dsp->filter_order = 0;

        int n2 = dsp->filter_order / 2;
        int n21 = n2 + 1;
        dsp->filter_order = 2 * n2;

        if (dsp->filter_b)
            delete[] dsp->filter_b;

        if (dsp->filter_r) {
            for (int i = 0; i < old_order; ++i)
                avg_r += dsp->filter_r[i];
            avg_r /= old_order;
            delete[] dsp->filter_r;
        }

        if (dsp->filter_i) {
            for (int i = 0; i < old_order; ++i)
                avg_i += dsp->filter_i[i];
            avg_i /= old_order;
            delete[] dsp->filter_i;
        }

        dsp->filter_b = new float[dsp->filter_order + 1];
        dsp->filter_r = new float[dsp->filter_order + 1];
        dsp->filter_i = new float[dsp->filter_order + 1];

        for (int i = 0; i <= dsp->filter_order; ++i) {
            dsp->filter_r[i] = avg_r;
            dsp->filter_i[i] = avg_i;
        }

        dsp->filter_b[n2] = 2 * K * (f2 - f1) / (double)fs;

        for (int i = 1; i < n21; ++i)
            dsp->filter_b[n2 + i] = 0;

        for (int i = K; i < n21; i += K)
            dsp->filter_b[n2 + i] = (sin(2 * i * M_PI * f2 / fs) - sin(2 * i * M_PI * f1 / fs)) / (i * M_PI / K);

        for (int i = 0; i < n2; ++i)
            dsp->filter_b[i] = dsp->filter_b[dsp->filter_order - i];

        float a = 25.0 / 46.0;

        dsp->filter_gain = 0;
        for (int i = 0; i <= dsp->filter_order; ++i) {
            dsp->filter_b[i] *= a - (1 - a) * cos(2 * M_PI * i / dsp->filter_order);
            dsp->filter_gain += dsp->filter_b[i];
        }

        ++dsp->filter_order;

        if (dsp->filter_type == FT_IFIR) {
            if (dsp->intDSP == 0)
                dsp->intDSP = DSP_create();

            DSP_setFilterParams(dsp->intDSP, fs, f1, f2, order / K, type, FT_FIR);
        }

        if (type == FT_REJECTBAND) {
            for (int i = 0; i < dsp->filter_order; ++i)
                dsp->filter_b[i] = -dsp->filter_b[i];
            dsp->filter_b[n2] = 1 + dsp->filter_b[n2];
        }

    } else {
        // IIR - Chebyshev type II

        dsp->filter_type = FT_IIR;

        const float ripple = -60;

        if (fs / 2 <= f2 - f1) {
            dsp->filter_order = -1;
            return;
        }

        COMPLEX *poles = new COMPLEX[2 * order];
        COMPLEX *zeros = new COMPLEX[2 * order];
        COMPLEX *zpoles = new COMPLEX[2 * order];
        COMPLEX *zzeros = new COMPLEX[2 * order];

        int freq = 0;
        if (f1 == 0)
            freq = f2;
        else if (f2 == fs / 2)
            freq = f1;
        else
            freq = (f1 + f2) / 2;

        float e = 1 / sqrt(pow(10, -ripple / 10) - 1);
        float a = 2 * tan(M_PI * freq / fs) * cosh(acosh(1 / e) / order);
        float sx = sinh(asinh(1 / e) / order);
        float sy = cosh(asinh(1 / e) / order);
        int j;
        float th;
        for (int i = 0; i < order; ++i) {
            j = i & 1 ? order - 1 - (i >> 1) : (i >> 1);
            th = (2 * j + order + 1) * M_PI / 2 / order;
            poles[i] = a / COMPLEX(sx * cos(th), sy * sin(th));
            zeros[i] = a / COMPLEX(0, -sin(th));
        }

        int npoles = order;
        int nzeros = order;

        if ((f1 == 0 && type == FT_REJECTBAND) || (f2 == fs / 2 && type == FT_PASSBAND)) { // HIGH PASS
            a = 2 * tan(M_PI * freq / fs);
            COMPLEX r = COMPLEX(a * a);
            for (int i = 0; i < nzeros; ++i)
                zeros[i] = r / zeros[i];
            for (int i = 0; i < npoles; ++i)
                poles[i] = r / poles[i];
            for (int i = nzeros; i < npoles; ++i)
                zeros[nzeros++] = 0;

        } else if (f1 > 0 && f2 < fs / 2 && type == FT_PASSBAND) { // PASS BAND
            float w1 = 2 * tan(M_PI * f1 / fs);
            float w2 = 2 * tan(M_PI * f2 / fs);
            float w0 = sqrt(w1 * w2);
            int np = npoles;
            COMPLEX p, d;
            for (int i = 0; i < np; ++i) {
                p = (w2 - w1) / w0 * poles[i];
                d = sqrt(p * p - 4 * w0 * w0);
                poles[i] = 0.5f * (p + d);
                poles[2 * np - i - 1] = 0.5f * (p - d);
                npoles++;
            }
            int nz = nzeros;
            for (int i = 0; i < nz; ++i) {
                p = (w2 - w1) / w0 * zeros[i];
                d = sqrt(p * p - 4 * w0 * w0);
                if (d.imag() > 0)
                    d = COMPLEX(d.real(), -d.imag());
                if (i & 1) {
                    zeros[i] = 0.5f * (p - d);
                    zeros[2 * nz - i - 1] = 0.5f * (p + d);
                } else {
                    zeros[i] = 0.5f * (p + d);
                    zeros[2 * nz - i - 1] = 0.5f * (p - d);
                }
                nzeros++;
            }
            for (int i = nzeros / 2; i < npoles / 2; ++i)
                zeros[nzeros++] = 0;

        } else if (f1 > 0 && f2 < fs / 2 && type == FT_REJECTBAND) { // NOTCH
            float w1 = 2 * tan(M_PI * f1 / fs);
            float w2 = 2 * tan(M_PI * f2 / fs);
            float w0 = sqrt(w1 * w2);
            int np = npoles;
            COMPLEX p, d;
            for (int i = 0; i < np; ++i) {
                p = (w2 - w1) * w0 / poles[i];
                d = sqrt(p * p - 4 * w0 * w0);
                poles[i] = 0.5f * (p + d);
                poles[2 * np - i - 1] = 0.5f * (p - d);
                npoles++;
            }
            int nz = nzeros;
            for (int i = 0; i < nz; ++i) {
                p = (w2 - w1) * w0 / zeros[i];
                d = sqrt(p * p - 4 * w0 * w0);
                if (d.imag() > 0)
                    d = COMPLEX(d.real(), -d.imag());
                if (i & 1) {
                    zeros[i] = 0.5f * (p - d);
                    zeros[2 * nz - i - 1] = 0.5f * (p + d);
                } else {
                    zeros[i] = 0.5f * (p + d);
                    zeros[2 * nz - i - 1] = 0.5f * (p - d);
                }
                nzeros++;
            }
            for (int i = nzeros / 2; i < npoles / 2; ++i) {
                zeros[nzeros++] = COMPLEX(0, w0);
                zeros[nzeros++] = COMPLEX(0, -w0);
            }

            COMPLEX tmp;
            for (int i = 0; i < nzeros / 2; i+= 2) {
                SWAP(zeros[i], zeros[nzeros - i - 2]);
                SWAP(zeros[i + 1], zeros[nzeros - i - 1]);
            }
        }

        for (int i = 0; i < npoles; ++i)
            zpoles[i] = -(poles[i] + 2.0f) / (poles[i] - 2.0f);
        int nzpoles = npoles;
        for (int i = 0; i < nzeros; ++i)
            zzeros[i] = -(zeros[i] + 2.0f) / (zeros[i] - 2.0f);
        int nzzeros = nzeros;
        for (int i = 0; i < npoles - nzeros; ++i)
            zzeros[nzzeros++] = -1;
        for (int i = 0; i < nzeros - npoles; ++i)
            zpoles[nzpoles++] = -1;

        if (dsp->filter_a) delete[] dsp->filter_a;
        if (dsp->filter_b) delete[] dsp->filter_b;

        dsp->filter_a = new float[2 * order];
        dsp->filter_b = new float[2 * order];

        for (int i = 0; i < nzpoles - 1; i += 2) {
            dsp->filter_a[i] = (zpoles[i] * zpoles[i + 1]).real();
            dsp->filter_a[i + 1] = -(zpoles[i] + zpoles[i + 1]).real();
            dsp->filter_b[i] = (zzeros[i] * zzeros[i + 1]).real();
            dsp->filter_b[i + 1] = -(zzeros[i] + zzeros[i + 1]).real();
        }
        if (nzpoles & 1) {
            dsp->filter_a[2 * order - 1] = -zpoles[nzpoles - 1].real();
            dsp->filter_b[2 * order - 1] = -zzeros[nzzeros - 1].real();
        }

        dsp->filter_order = 3 + 3 * ((nzpoles + 1) >> 1);

        if (dsp->filter_r) delete[] dsp->filter_r;
        if (dsp->filter_i) delete[] dsp->filter_i;

        dsp->filter_r = new float[dsp->filter_order];
        dsp->filter_i = new float[dsp->filter_order];

        for (int i = 0; i < dsp->filter_order; ++i) {
            dsp->filter_r[i] = 0;
            dsp->filter_i[i] = 0;
        }

        float w;
        if (type == FT_PASSBAND)
            w = M_PI * (f1 + f2) / fs;
        else {
            if (f1 > fs / 2 - f2)
                w = M_PI * f1 / fs;
            else
                w = M_PI * (f2 + fs / 2) / fs;
        }

        COMPLEX z = COMPLEX(cos(w), sin(w));
        COMPLEX resp = 1;
        for (int i = 0; i < qMin(nzzeros, nzpoles); ++i)
            resp *= (z - zzeros[i]) / (z - zpoles[i]);
        for (int i = npoles; i < nzzeros; ++i)
            resp *= (z - zzeros[i]);
        for (int i = nzeros; i < nzpoles; ++i)
            resp /= (z - zpoles[i]);
        dsp->filter_gain = abs(resp);

        delete[] poles;
        delete[] zeros;
        delete[] zpoles;
        delete[] zzeros;
    }
}


QByteArrayView Box::DSP_uncompress(QByteArrayView input, const int cbits)
{
    if (input.size() == 0)
        return QByteArrayView();

    char *d = (char *)input.data();

    float min = *(float *)d;
    float range = *(float *)(d + SF);

    float f;
    int olen = (static_cast<int>(input.size()) - 2 * SF) * 8 / cbits * SF;
    char *output = G_BOX->mem()->alloc(olen);
    float *voutput = (float *)output;

    if (cbits == 8) {
        unsigned char *vd = (unsigned char *)(d + 2 * SF);
        int N = static_cast<int>(input.size() - 2 * SF);
        for (int i = 0; i < N; ++i) {
            f = min + range * *vd++ / 255.0;
            *voutput++ = f;
        }
    } else {
        unsigned short *vd = (unsigned short *)(d + 2 * SF);
        int N = static_cast<int>((input.size() - 2 * SF) / 2);
        for (int i = 0; i < N; ++i) {
            f = min + range * *vd++ / 65535.0;
            *voutput++ = f;
        }
    }

    return QByteArrayView(output, olen);
}


float Box::dsp_avg_float(float *data, const int N)
{
    float *vdata = data;
    float avg = 0;

    for (int i = 0; i < N; ++i)
        avg += *vdata++;
    avg /= N;

    return avg;
}


void Box::dsp_deemphasis_float(const int dspid, float *data, const int N, const int fs, const int tau)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float a = 1.0 / (1.0 + 1.0e-6 * fs * tau);
    float v = dsp->deemlast;
    float *vdata = data;

    for (int i = 0; i < N; ++i) {
        v = a * *vdata + (1 - a) * v;
        *vdata++ = v;
    }

    dsp->deemlast = v;
}


void Box::dsp_demodulate_float(const int dspid, float *data, const int N, const int fs, const Band band)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float a, I, Q, iq, lastI, lastQ;
    float *vinput = data;
    float *voutput = data;

    switch (band) {
    case BAND_AM:
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            Q = *vinput++;
            *voutput++ = 20.0f * sqrtf(I * I + Q * Q);
        }
        break;
    case BAND_FM:
        lastI = dsp->demlastI;
        lastQ = dsp->demlastQ;
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            Q = *vinput++;
            iq = I * I + Q * Q;
            if (iq == 0)
                *voutput++ = 0;
            else
                *voutput++ = 4.5e-5 * fs * (I * (Q - lastQ) - Q * (I - lastI)) / iq;
            lastI = I;
            lastQ = Q;
        }
        dsp->demlastI = lastI;
        dsp->demlastQ = lastQ;
        break;
    case BAND_WFM:
        lastI = dsp->demlastI;
        lastQ = dsp->demlastQ;
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            Q = *vinput++;
            iq = I * I + Q * Q;
            if (iq == 0)
                *voutput++ = 0;
            else
                *voutput++ = 3e-6 * fs * (I * (Q - lastQ) - Q * (I - lastI)) / iq;
            lastI = I;
            lastQ = Q;
        }
        dsp->demlastI = lastI;
        dsp->demlastQ = lastQ;
        break;
    case BAND_USB:
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            Q = *vinput++;
            *voutput++ = 20.0f * (I - Q);
        }
        break;
    case BAND_LSB:
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            Q = *vinput++;
            *voutput++ = 20.0f * (I + Q);
        }
        break;
    case BAND_DSB:
        for (int i = 0; i < N; ++i) {
            I = *vinput++;
            vinput++;
            *voutput++ = 20.0f * I;
        }
        break;
    }
}


void Box::dsp_dump_float(float *data, const int N, const QString &filename, const bool append)
{
    QFile file(filename);

    if (!file.open(append ? QFile::Append : QFile::WriteOnly))
        return;

    float *vdata = data;

    for (int i = 0; i < N; ++i)
        file.write(QByteArray::number(*vdata++) + '\n');

    file.close();
}


void Box::dsp_dump_float_c(float *data, const int N, const QString &filename, const bool append)
{
    QFile file(filename);

    if (!file.open(append ? QFile::Append : QFile::WriteOnly))
        return;

    float *vdata = data;
    QByteArray line;

    for (int i = 0; i < N; ++i) {
        line = QByteArray::number(*vdata++) + ' ';
        line += QByteArray::number(*vdata++) + '\n';
        file.write(line);
    }

    file.close();
}


void Box::dsp_filter_float(const int dspid, float *data, const int N)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    QMutexLocker locker(&dsp->mutex);

    if (dsp->filter_order == -1)
        return;

    if (dsp->filter_type == FT_FIR || dsp->filter_type == FT_IFIR) {
        // FIR
        float *f_b = dsp->filter_b;
        float *f_r = dsp->filter_r;
        float gain = dsp->filter_gain;
        int order = dsp->filter_order;
        int orderm1 = order - 1;
        float v;

        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < orderm1; ++j)
                f_r[j] = f_r[j + 1];
            f_r[orderm1] = data[i] / gain;
            v = 0;
            for (int j = 0; j < order; ++j)
                v += f_r[j] * f_b[j];
            data[i] = v;
        }

        if (dsp->filter_type == FT_IFIR)
            dsp_filter_float(dsp->intDSP, data, N);

    } else {
        // IIR
        int i, j, k, xp, yp, zp, len;
        int n = (dsp->filter_order - 3) / 3;
        int nz = n / 2 - 1;
        float *f_a = dsp->filter_a;
        float *f_b = dsp->filter_b;
        float *f_r = dsp->filter_r;
        float gain = dsp->filter_gain;
        int orderm1 = dsp->filter_order - 1;
        float v;

        for (i = 0; i < N; ++i) {
            xp = 0;
            yp = 3;
            zp = 0;
            v = data[i] / gain;
            for (j = orderm1; j > 0; --j)
                f_r[j] = f_r[j - 1];
            for (j = 0; j < n; ++j) {
                len = ((j == n - 1) && (nz & 1)) ? 1 : 2;
                f_r[xp] = v;
                for (k = 0; k < len; k++)
                    v += f_r[xp + len - k] * f_b[zp + k] - f_r[yp + len - k] * f_a[zp + k];
                zp += len;
                f_r[yp] = v;
                xp = yp;
                yp += len + 1;
            }
            data[i] = v;
        }
    }
}


void Box::dsp_filter_float_c(const int dspid, float *data, const int N)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    QMutexLocker locker(&dsp->mutex);

    if (dsp->filter_order == -1)
        return;

    if (dsp->filter_type == FT_FIR || dsp->filter_type == FT_IFIR) {
        // FIR
        float *f_b = dsp->filter_b;
        float *f_r = dsp->filter_r;
        float *f_i = dsp->filter_i;
        float gain = dsp->filter_gain;
        int order = dsp->filter_order;
        int orderm1 = order - 1;
        float v1, v2;
        int i2;

        for (int i = 0; i < N; ++i) {
            i2 = i << 1;
            for (int j = 0; j < orderm1; ++j) {
                f_r[j] = f_r[j + 1];
                f_i[j] = f_i[j + 1];
            }
            f_r[orderm1] = data[i2] / gain;
            f_i[orderm1] = data[i2 + 1] / gain;
            v1 = 0;
            v2 = 0;
            for (int j = 0; j < order; ++j) {
                v1 += f_r[j] * f_b[j];
                v2 += f_i[j] * f_b[j];
            }
            data[i2] = v1;
            data[i2 + 1] = v2;
        }

        if (dsp->filter_type == FT_IFIR)
            dsp_filter_float_c(dsp->intDSP, data, N);

    } else if (dsp->filter_type == FT_IFIR) {
        // Interpolated FIR

        float *f_b = dsp->filter_b;
        float *f_r = dsp->filter_r;
        float *f_i = dsp->filter_i;
        float gain = dsp->filter_gain;
        int order = dsp->filter_order;
        int orderm1 = order - 1;
        float v1, v2;
        int i2;

        for (int i = 0; i < N; ++i) {
            i2 = i << 1;
            for (int j = 0; j < orderm1; ++j) {
                f_r[j] = f_r[j + 1];
                f_i[j] = f_i[j + 1];
            }
            f_r[orderm1] = data[i2] / gain;
            f_i[orderm1] = data[i2 + 1] / gain;
            v1 = 0;
            v2 = 0;
            for (int j = 0; j < order; ++j) {
                v1 += f_r[j] * f_b[j];
                v2 += f_i[j] * f_b[j];
            }
            data[i2] = v1;
            data[i2 + 1] = v2;
        }

    } else {
        // IIR
        int i, i2, j, k, xp, yp, zp, len;
        int n = (dsp->filter_order - 3) / 3;
        float *f_a = dsp->filter_a;
        float *f_b = dsp->filter_b;
        float *f_r = dsp->filter_r;
        float *f_i = dsp->filter_i;
        float gain = dsp->filter_gain;
        int orderm1 = dsp->filter_order - 1;
        float v1, v2;

        for (i = 0; i < N; ++i) {
            i2 = i << 1;
            xp = 0;
            yp = 3;
            zp = 0;
            v1 = data[i2] / gain;
            v2 = data[i2 + 1] / gain;
            for (j = orderm1; j > 0; --j) {
                f_r[j] = f_r[j - 1];
                f_i[j] = f_i[j - 1];
            }
            for (j = 0; j < n; ++j) {
                len = 2;
                f_r[xp] = v1;
                f_i[xp] = v2;
                for (k = 0; k < len; ++k) {
                    v1 += f_r[xp + len - k] * f_b[zp + k] - f_r[yp + len - k] * f_a[zp + k];
                    v2 += f_i[xp + len - k] * f_b[zp + k] - f_i[yp + len - k] * f_a[zp + k];
                }
                zp += len;
                f_r[yp] = v1;
                f_i[yp] = v2;
                xp = yp;
                yp += len + 1;
            }
            data[i2] = v1;
            data[i2 + 1] = v2;
        }
    }
}


float Box::dsp_max_float(float *data, const int N)
{
    float *vdata = data;
    float max = -1e6;

    for (int i = 0; i < N; ++i)
        max = qMax(max, *vdata++);

    return max;
}


float Box::dsp_min_float(float *data, const int N)
{
    float *vdata = data;
    float min = 1e6;

    for (int i = 0; i < N; ++i)
        min = qMin(min, *vdata++);

    return min;
}


void Box::dsp_normalize_float(const int dspid, float *data, const int N)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float *vdata = data;
    float agc = dsp->agc > 0 ? dsp->agc : 1;
    float avg = 0;
    float lev = 0;
    float a;

    for (int i = 0; i < N; ++i)
        avg += *vdata++;

    avg = 0.5 * avg / N + 0.5 * dsp->normAvgI;
    dsp->normAvgI = avg;

    vdata = data;
    for (int i = 0; i < N; ++i) {
        a = agc * (*vdata - avg);
        *vdata++ = a;
        lev += abs(a);
    }

    const float target = 0.2;
    if (dsp->agc > 0) {
        lev /= N;
        if (lev < target - 0.1)
            dsp->agc *= 1.1;
        else if (lev < target - 0.01)
            dsp->agc *= 1.01;
        else if (lev > target + 0.1)
            dsp->agc /= 1.1;
        else if (lev > target + 0.01)
            dsp->agc /= 1.01;
    }
}


void Box::dsp_normalize_float_c(const int dspid, float *data, const int N)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float *vdata = data;
    bool isagc = dsp->agc > 0;
    float agc = isagc ? dsp->agc : 1;
    float avgI = 0;
    float avgQ = 0;
    float lev = 0;
    float I, Q;

    for (int i = 0; i < N; ++i) {
        avgI += *vdata++;
        avgQ += *vdata++;
    }

    avgI = 0.1 * avgI / N + 0.9 * dsp->normAvgI;
    avgQ = 0.1 * avgQ / N + 0.9 * dsp->normAvgQ;
    dsp->normAvgI = avgI;
    dsp->normAvgQ = avgQ;

    vdata = data;
    for (int i = 0; i < N; ++i) {
        I = agc * (*vdata - avgI);
        *vdata++ = I;
        Q = agc * (*vdata - avgQ);
        *vdata++ = Q;
        if (isagc)
            lev += sqrt(I * I + Q * Q);
    }

    const float target = 0.2;
    if (isagc) {
        lev /= N;
        if (lev < target - 0.1)
            dsp->agc *= 1.1;
        else if (lev < target - 0.01)
            dsp->agc *= 1.01;
        else if (lev > target + 0.1)
            dsp->agc /= 1.1;
        else if (lev > target + 0.01)
            dsp->agc /= 1.01;
    }
}


void Box::dsp_NR_float(const int dspid, float *data, const int N, const float ratio)
{
    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    int r = 29 * ratio + 1;

    float *buf = new float[r];
    memcpy(buf, data + N - r, r * SF);

    float s;
    for (int i = N - 1; i >= 0; --i) {
        s = 0;
        for (int j = 0; j < r; ++j) {
            if (i - j >= 0)
                s += data[i - j];
            else if (i - j + dsp->nrlen >= 0)
                s += dsp->nrlast[i - j + dsp->nrlen];
            else
                s += data[i];
        }
        data[i] = s / r;
    }

    if (dsp->nrlast)
        delete[] dsp->nrlast;

    dsp->nrlast = buf;
    dsp->nrlen = r;
}


void Box::dsp_resample_float(const int dspid, float *&input, const int N1, const int N2)
{
    if (N1 == N2)
        return;

    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float *output;
    if (N2 > N1)
        output = (float *)G_BOX->mem()->alloc(N2 * SF);
    else
        output = input;

    float *voutput = output;
    float r = static_cast<float>(N1) / static_cast<float>(N2);
    float m = exp((1 / r - 1) / 2.8);
    int ir = 0;
    int pir = 0;

    for (int i = 0; i < N2; ++i) {
        ir = i * r;
        if (ir != pir) {
            dsp->reslastI = input[pir];
            pir = ir;
        }
        *voutput++ = dsp->reslastI * m;
    }
    dsp->reslastI = input[pir];

    if (r < 1) {
        if (dsp->resDSP == 0)
            dsp->resDSP = DSP_create();

        if (m_DSPs.value(dsp->resDSP)->agc != r) {
            DSP_setFilterParams(dsp->resDSP, 20000, 0, 10000 * r, 10, FT_PASSBAND);
            m_DSPs.value(dsp->resDSP)->agc = r;
        }

        dsp_filter_float(dsp->resDSP, output, N2);
    }

    input = output;

    return;
}


void Box::dsp_resample_float_c(const int dspid, float *&input, const int N1, const int N2)
{
    if (N1 == N2)
        return;

    Dsp *dsp = m_DSPs.value(dspid);

    if (!dsp)
        return;

    float *output;

    if (N2 > N1)
        output = (float *)G_BOX->mem()->alloc(2 * N2 * SF);
    else
        output = input;

    float *voutput = output;
    float r = static_cast<float>(N1) / static_cast<float>(N2);
    float m = exp((1 / r - 1) / 2.8);
    int ir;
    int pir = 0;

    for (int i = 0; i < N2; ++i) {
        ir = i * r;
        ir <<= 1;
        if (ir != pir) {
            dsp->reslastI = input[pir];
            dsp->reslastQ = input[pir + 1];
            pir = ir;
        }
        *voutput++ = dsp->reslastI * m;
        *voutput++ = dsp->reslastQ * m;
    }

    dsp->reslastI = input[pir];
    dsp->reslastQ = input[pir + 1];

    if (r < 1) {
        if (dsp->resDSP == 0)
            dsp->resDSP = DSP_create();

        if (m_DSPs.value(dsp->resDSP)->agc != r) {
            DSP_setFilterParams(dsp->resDSP, 20000, 0, 10000 * r, 10, FT_PASSBAND);
            m_DSPs.value(dsp->resDSP)->agc = r;
        }

        dsp_filter_float_c(dsp->resDSP, output, N2);
    }

    input = output;

    return;
}


void Box::dsp_scale_float(float *input, const int N, const float scale)
{
    float *vinput = input;

    for (int i = 0; i < N; ++i)
        *vinput++ *= scale;
}


int Box::dsp_SNR_float_c(const int dspid, float *data, const int N, const int samplerate, const int bandwidth)
{
    if (!m_DSPs.contains(dspid))
        return 0;

    QByteArrayView dd = DSP_FFT_c(dspid, QByteArrayView((char *)data, 2 * N * SF));

    if (dd.size() == 0)
        return 0;

    float *d = (float *)dd.data();

    int N1 = (N - 0.85 * N * bandwidth / samplerate) / 2;
    int N2 = (N + 0.85 * N * bandwidth / samplerate) / 2;

    float signal = 0;
    float *vd = d + N1;
    for (int i = N1; i < N2; ++i)
        signal += *vd++;
    signal /= (N2 - N1);

    N1 = 0.15 * N;
    N2 = 0.85 * N;
    std::sort(d + N1, d + N2, std::greater<float>());

    int N0 = N1 + 0.78 * (N2 - N1);
    float noise = 0;
    vd = d + N0;
    for (int i = N0; i < N2; ++i)
        noise += *vd++;
    noise /= (N2 - N0);

    return qBound(0.0, 40.0 * (log(signal / noise) - 2), 100.0);
}


int Box::SDR_create()
{
    QMutexLocker locker(&m_SDR_mutex);

    Sdr *sdr = new Sdr();
    sdr->busy = false;
    sdr->dspA = DSP_create();
    sdr->dspB = DSP_create();
    sdr->dspC = DSP_create();

    sdr->signallevel = new int[sdr->ksignallevel];
    for (int i = 0; i < sdr->ksignallevel; ++i)
        sdr->signallevel[i] = 0;

    int sdrid = G_BOX->id();
    sdr->id = sdrid;
    m_SDRs.insert(sdrid, sdr);

    return sdrid;
}


void Box::SDR_feed(const int sdrid, QByteArrayView input)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->future = QtConcurrent::run(sdr_process, this, sdr, input);
}


void Box::SDR_release(const int sdrid)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->future.waitForFinished();

    DSP_release(sdr->dspA);
    DSP_release(sdr->dspB);
    DSP_release(sdr->dspC);
    delete[] sdr->signallevel;

    delete sdr;

    m_SDRs.remove(sdrid);
}


void Box::SDR_setAFAGC(const int sdrid, const bool agc)
{
    if (m_remote)
        return;

    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    if (!m_DSPs.contains(sdr->dspA))
        return;

    m_DSPs.value(sdr->dspA)->agc = (agc ? 1 : -1);
}


void Box::SDR_setAudioMode(const int sdrid, const QString &audiomode)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    QString lmode = audiomode;
    QList<QString> amode = lmode.replace(" ", "").toUpper().split(',');
    if (amode.size() < 3)
        return;

    sdr->srate = amode.at(0).toInt();
    sdr->sbits = amode.at(1).toInt();
    sdr->cbits = amode.at(2).toInt();
    sdr->processsize = SF * (sdr->srate / m_refreshrate);

    setAFilter(sdr);
    setBFilter(sdr);
}


void Box::SDR_setBand(const int sdrid, const QString &band)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    if (band == "AM")
        sdr->band = BAND_AM;
    else if (band == "FM")
        sdr->band = BAND_FM;
    else if (band == "WFM")
        sdr->band = BAND_WFM;
    else if (band == "LSB")
        sdr->band = BAND_LSB;
    else if (band == "USB")
        sdr->band = BAND_USB;
    else if (band == "DSB")
        sdr->band = BAND_DSB;

    setAFilter(sdr);
}


void Box::SDR_setBusy(const int sdrid, const bool busy)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->busy = busy;
}


void Box::SDR_setFilter(const int sdrid, const int filter)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->bandwidth = filter;
    setCFilter(sdr);
}


void Box::SDR_setFMtau(const int sdrid, const int tau)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->tau = tau;
}


void Box::SDR_setSampleRate(const int sdrid, const int rate)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->rawsrate = rate;

    setBFilter(sdr);
    setCFilter(sdr);
}


void Box::SDR_setUnfiltered(const int sdrid, const bool unfiltered)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->unfiltered = unfiltered;
}


void Box::SDR_setVolume(const int sdrid, const float volume)
{
    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return;

    sdr->volume = volume;
}


int Box::SDR_signalLevel(const int sdrid)
{
    if (m_remote)
        return -1;

    Sdr *sdr = m_SDRs.value(sdrid);

    if (!sdr)
        return -1;

    int avg = 0;
    for (int i = 0; i < sdr->ksignallevel; ++i)
        avg += sdr->signallevel[i];

    return avg / sdr->ksignallevel;
}


int Box::file_channels(const int fileid, const int newval)
{
    File *file = m_files.value(fileid);

    if (!file)
        return 0;

    if (newval != -1)
        file->channels = newval;

    return file->channels;
}


void Box::file_close(const int fileid)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    if (file->t) {
        file->t->stop();
        file->t->deleteLater();
    }

    file->f->close();
    file->f->deleteLater();
    delete file;

    m_files.remove(fileid);
}


bool Box::file_delete(const QString filename)
{
    return QFile::remove(G_LOCALSETTINGS.localFilePath() + "/data/" + filename);
}


QList<QString> Box::file_list(const QString &mask)
{
    if (m_remote) {
        QString ret = remoteBox("file_list", mask);
        if (ret.isEmpty())
            return QList<QString>();
        else
            return ret.split(";");
    }

    QDir dir(G_LOCALSETTINGS.localFilePath() + "/data");
    QFileInfoList rawlist = dir.entryInfoList(QList<QString>() << mask, QDir::Files, QDir::Name);
    QList<QString> list;

    for (QFileInfo &f : rawlist)
        list.append(f.fileName() + ":" + QString::number(f.size()));

    return list;
}


int Box::file_openRead(const QString &filename)
{
    QFile *f = new QFile(G_LOCALSETTINGS.localFilePath() + "/data/" + filename);

    if (!f->open(QFile::ReadOnly)) {
        f->deleteLater();
        return -1;
    }

    File *file = new File();
    file->f = f;
    file->t = nullptr;
    file->srate = 0;
    file->sbits = 0;
    file->channels = 0;
    file->msec = 0;
    file->busy = false;
    int fileid = G_BOX->id();
    file->id = fileid;
    m_files.insert(fileid, file);

    QByteArray data = file->f->read(4);
    if (data == "RIFF") {
        file->f->seek(22);
        data = file->f->read(2);
        file->channels = littleIndianToShort(data);
        file->playmode = file->channels == 1 ? PM_MONO : PM_STEREO;
        file->f->seek(24);
        data = file->f->read(4);
        file->srate = littleIndianToInteger(data);
        file->f->seek(34);
        data = file->f->read(2);
        file->sbits = littleIndianToShort(data);
        file->header = 44;
        file->f->seek(file->header);
    } else {
        file->channels = 0;
        file->srate = 0;
        file->sbits = 0;
        file->header = 0;
    }

    return fileid;
}


int Box::file_openWrite(const QString &filename)
{
    QFile *f = new QFile(G_LOCALSETTINGS.localFilePath() + "/data/" + filename);

    if (!f->open(QFile::WriteOnly)) {
        f->deleteLater();
        return -1;
    }

    File *file = new File();
    file->f = f;
    file->t = nullptr;
    file->srate = 0;
    file->sbits = 0;
    file->channels = 0;
    file->msec = 0;
    file->busy = false;
    int fileid = G_BOX->id();
    file->id = fileid;
    m_files.insert(fileid, file);

    return fileid;
}


void Box::file_play(const int fileid, const PlayMode playmode)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    if (file->t) {
        file->t->stop();
        file->t->deleteLater();
    }

    if (playmode != PM_DEFAULT)
        file->playmode = playmode;

    int period = 1000 / m_refreshrate;

    file->t = new QTimer(this);
    file->t->setObjectName(QString::number(fileid));
    file->msec = QDateTime::currentMSecsSinceEpoch() - period;
    connect(file->t, &QTimer::timeout, this, &Box::filePlayChunk);
    file->t->start(period);
}


QByteArrayView Box::file_read(const int fileid, const int size)
{
    File *file = m_files.value(fileid);

    if (!file)
        return QByteArrayView();

    QByteArray odata = file->f->read(size);
    QByteArrayView output = G_BOX->mem()->alloc(odata);

    return output;
}


int Box::file_samplebits(const int fileid, const int newval)
{
    File *file = m_files.value(fileid);

    if (!file)
        return 0;

    if (newval != -1)
        file->sbits = newval;

    return file->sbits;
}


int Box::file_samplerate(const int fileid, const int newval)
{
    File *file = m_files.value(fileid);

    if (!file)
        return 0;

    if (newval != -1)
        file->srate = newval;

    return file->srate;
}


bool Box::file_save(const QString filename)
{
#if !defined NOGUI
    QString targetfilename = QFileDialog::getSaveFileName(nullptr, tr("Save File"), filename);

    if (!targetfilename.isEmpty())
        return QFile::copy(G_LOCALSETTINGS.localFilePath() + "/data/" + filename, targetfilename);
    else
        return false;
#else
    Q_UNUSED(filename)
    return false;
#endif
}


void Box::file_seek(const int fileid, const int position)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    file->f->seek(position);
}


void Box::file_setBusy(const int fileid, const bool busy)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    file->busy = busy;
}


void Box::file_stop(const int fileid)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    if (file->t) {
        file->t->stop();
        file->t->deleteLater();
        file->t = nullptr;
    }
}


void Box::file_write(const int fileid, const QByteArrayView &data)
{
    File *file = m_files.value(fileid);

    if (!file)
        return;

    file->f->write(data.data(), data.size());
}


QByteArray Box::HTTP_download(const QString &url)
{
    HttpSession httpsession;
    QEventLoop loop;
    QByteArray res;

    connect(&httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);

    httpsession.download(url);
    loop.exec();

    if (!httpsession.error())
        res = httpsession.data();

    return res;
}


QString Box::HTTP_get(const QString &url)
{
    HttpSession httpsession;
    QEventLoop loop;
    QByteArray res;

    connect(&httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);

    httpsession.get(url);
    loop.exec();

    if (!httpsession.error())
        res = httpsession.data();

    return QString(res);
}


QString Box::HTTP_post(const QString &url, const QString &command)
{
    HttpSession httpsession;
    QEventLoop loop;
    QByteArray res;

    connect(&httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);

    httpsession.post(url, command);
    loop.exec();

    if (!httpsession.error())
        res = httpsession.data();

    return QString(res);
}


QString Box::HTTP_postData(const QString &url, const QString &command, const QByteArray &data)
{
    HttpSession httpsession;
    QEventLoop loop;
    QByteArray res;

    connect(&httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);

    httpsession.postData(url, command, data);
    loop.exec();

    if (!httpsession.error())
        res = httpsession.data();

    return QString(res);
}


QByteArrayView Box::bytesToFloat(QByteArrayView input, const int inputbits, const float scale)
{
    int N = static_cast<int>(input.size() * 8 / inputbits);
    float *output = (float *)G_BOX->mem()->alloc(N * SF);
    float *voutput = output;
    float m;

    if (inputbits == 8) {
        unsigned char *vinput = (unsigned char *)input.data();
        for (int i = 0; i < N; ++i) {
            m = scale * (*vinput++ - 128) / 128.0;
            *voutput++ = m;
        }
    } else if (inputbits == 16) {
        short *vinput = (short *)input.data();
        for (int i = 0; i < N; ++i) {
            m = scale * *vinput++ / 32768.0;
            *voutput++ = m;
        }
    }

    return QByteArrayView((char *)output, N * SF);
}


QString Box::escape(const QString &data)
{
    return Settings::escape(data);
}


QByteArrayView Box::floatToBytes(QByteArrayView input, const int outputbits, const float scale)
{
    int N1 = static_cast<int>(input.size() / SF);
    int N2 = N1 * outputbits / 8;

    char *output = G_BOX->mem()->alloc(N2);
    float *vinput = (float *)input.data();

    if (outputbits == 8) {
        unsigned char c;
        unsigned char *voutput = (unsigned char*)output;
        for (int i = 0; i < N1; ++i) {
            c = qBound(0.0, 128.0 * scale * *vinput++ + 128, 255.0);
            *voutput++ = c;
        }
    } else if (outputbits == 16) {
        short m;
        short *voutput = (short *)output;
        for (int i = 0; i < N1; ++i) {
            m = qBound(-32768.0, 32768.0 * scale * *vinput++, 32767.0);
            *voutput++ = m;
        }
    }

    return QByteArrayView(output, N2);
}


QString Box::localFilePath()
{
    return G_LOCALSETTINGS.localFilePath();
}


QString Box::os()
{
    if (m_remote)
        return remoteBox("os");
    else
        return productType();
}


QString Box::param(const QString &param)
{
    return G_LOCALSETTINGS.get(param);
}


void Box::sleep(int ms)
{
    QThread::msleep(ms);
}


QObject *Box::timer()
{
    return static_cast<QObject *>(new QTimer(this));
}


QString Box::unescape(const QString &data)
{
    return Settings::unescape(data);
}


QByteArrayView Box::viewClone(QByteArrayView input, const int p1, const int p2)
{
    return G_BOX->mem()->alloc(viewSlice(input, p1, p2));
}


QByteArrayView Box::viewFromBytes(const QByteArray &input)
{
    return G_BOX->mem()->alloc(input);
}


int Box::viewSize(QByteArrayView input)
{
    return static_cast<int>(input.size());
}


QByteArrayView Box::viewSlice(QByteArrayView input, int p1, int p2)
{
    if (p1 == 0 && p2 == -1)
        return input;

    if (p2 == -1)
        return input.sliced(p1);

    qsizetype n1 = p1;
    qsizetype n2 = p2;

    if (n1 < 0)
        n1 = 0;

    if (n2 > input.size())
        n2 = input.size();

    if (n1 == 0 && n2 == input.size())
        return input;
    else
        return input.sliced(n1, n2 - n1);
}


QByteArray Box::viewToBytes(QByteArrayView input)
{
    return input.toByteArray();
}


QString Box::function(const QString &command, const QString &param)
{
    if (command == "audioDevice_list")
        return Settings::listToString(audioDevice_list(param));

    else if (command == "audioDevice_description")
        return audioDevice_description(param);

    else if (command == "videoDevice_list")
        return Settings::listToString(videoDevice_list());

    else if (command == "videoDevice_description")
        return videoDevice_description(param);

    else if (command == "serialPort_list")
        return Settings::listToString(serialPort_list());

    else if (command == "serialPort_description")
        return serialPort_description(param);

    else if (command == "USBDevice_list")
        return Settings::listToString(USBDevice_list());

    else if (command == "USBDevice_close")
        return QString(USBDevice_close(param) ? "true" : "false");

    else if (command == "USBDevice_description")
        return USBDevice_description(param);

    else if (command == "USBDevice_manufacturer")
        return USBDevice_manufacturer(param);

    else if (command == "USBDevice_serialNumber")
        return USBDevice_serialNumber(param);

    else if (command == "USBDevice_open")
        return QString::number(USBDevice_open(param));

    else if (command == "USBDevice_test")
        return QString(USBDevice_test(param) ? "true" : "false");

    else if (command == "USB_reset_device")
        return QString::number(USB_reset_device(param.toInt()));

    else if (command == "USB_get_device_list")
        return Settings::listToString(USB_get_device_list());

    else if (command == "USB_get_device_descriptor")
        return Settings::listToString(USB_get_device_descriptor(param.toInt()));

    else if (command == "USB_open") {
        QList<QString> list = Settings::stringToListString(param);
        int usbdeviceid = list.at(0).toInt();
        int interface = list.at(1).toInt();
        return QString::number(USB_open(usbdeviceid, interface));

    } else if (command == "USB_claim_interface") {
        QList<QString> list = Settings::stringToListString(param);
        int usbhandleid = list.at(0).toInt();
        int interface = list.at(1).toInt();
        return QString::number(USB_claim_interface(usbhandleid, interface));

    } else if (command == "USB_close")
        return QString::number(USB_close(param.toInt()));

    else if (command == "USB_get_string_descriptor_ascii") {
        QList<QString> list = Settings::stringToListString(param);
        int usbhandleid = list.at(0).toInt();
        int index = list.at(1).toInt();
        return USB_get_string_descriptor_ascii(usbhandleid, index);

    } else if (command == "USB_control_transfer") {
        QList<QString> list = Settings::stringToListString(param);
        int usbhandleid = list.at(0).toInt();
        int type = list.at(1).toInt();
        int request = list.at(2).toInt();
        int value = list.at(3).toInt();
        int index = list.at(4).toInt();
        QByteArray data = QByteArray::fromBase64(list.at(5).toUtf8());
        int len = list.at(6).toInt();
        int timeout = list.at(7).toInt();
        return QString(USB_control_transfer(usbhandleid, type, request, value, index, data, len, timeout).toBase64());

    } else if (command == "USB_bulk_transfer") {
        QList<QString> list = Settings::stringToListString(param);
        int usbhandleid = list.at(0).toInt();
        int endpoint = list.at(1).toInt();
        QByteArray data = QByteArray::fromBase64(list.at(2).toUtf8());
        int len = list.at(3).toInt();
        int timeout = list.at(4).toInt();
        return QString::number(USB_bulk_transfer(usbhandleid, endpoint, data, len, timeout));

    } else if (command == "file_list")
        return Settings::listToString(file_list(param));

    else if (command == "os")
        return os();

    else
        return QString();
}


void Box::setAppName(const QString &appname)
{
    m_appname = appname;
}


void Box::setSiteID(const QString &siteid)
{
    m_siteid = siteid;
}


#if defined OS_ANDROID

QList<QString> Box::android_audioDeviceList(const QString mode)
{
    QList<QString> list;
    char **values;

    ssize_t num_dev = alibaudio_get_device_list(mode.toUtf8().data(), &values);
    for (int i = 0; i < num_dev; ++i) {
        list << (mode == "INPUT" ? "I:" : "O:") + QString(values[i]);
        delete values[i];
    }

    delete values;

    return list;
}


int Box::android_audioDeviceId(const QString id)
{
    QString mode = id[0] == 'I' ? "INPUT" : "OUTPUT";
    QString name = id.mid(2);

    return alibaudio_get_device_id(mode.toUtf8().data(), name.toUtf8().data());
}


QString Box::android_audioDeviceDefaultInput()
{
    QList<QString> devices = android_audioDeviceList("INPUT");

    for (QString &device : devices)
        if (device.startsWith("I|Builtin Mic"))
            return device;

    return QString();
}


QString Box::android_audioDeviceDefaultOutput()
{
    QList<QString> devices = android_audioDeviceList("OUTPUT");

    for (QString &device : devices)
        if (device.startsWith("O|Builtin Speaker"))
            return device;

    return QString();
}


int Box::android_audioDeviceOpen(AudioDevice *audiodevice)
{
    int devid = android_audioDeviceId(audiodevice->devname);
    if (devid == -1)
        return -1;

    audiodevice->oboeinputcallback = nullptr;
    audiodevice->oboeerrorcallback = nullptr;

    if (audiodevice->samplingbits == 8)
        audiodevice->samplingbits = 16;

    oboe::AudioStreamBuilder streamBuilder;
    streamBuilder.setDeviceId(devid);
    streamBuilder.setDirection(audiodevice->i_o == 'I' ? oboe::Direction::Input : oboe::Direction::Output);
    streamBuilder.setSharingMode(oboe::SharingMode::Shared);
    streamBuilder.setSampleRate(audiodevice->samplerate);
    streamBuilder.setChannelCount(1);
    streamBuilder.setFormat(audiodevice->samplingbits == 32 ? oboe::AudioFormat::Float : oboe::AudioFormat::I16);

    if (audiodevice->i_o == 'I') {
        audiodevice->oboeinputcallback = new OboeInputCallBack(this, audiodevice);
        streamBuilder.setDataCallback(audiodevice->oboeinputcallback);
    }

    audiodevice->oboeerrorcallback = new OboeErrorCallBack(this, audiodevice);
    streamBuilder.setErrorCallback(audiodevice->oboeerrorcallback);

    oboe::Result res;

    res = streamBuilder.openStream(audiodevice->oboestream);
    if (res != oboe::Result::OK)
        return -1;

    res = audiodevice->oboestream->requestStart();
    if (res != oboe::Result::OK)
        return -1;

    return audiodevice->id;
}


void Box::android_audioDeviceClose(AudioDevice *audiodevice)
{
    if (audiodevice->oboestream) {
        audiodevice->oboestream->stop();
        audiodevice->oboestream->close();
        audiodevice->oboestream.reset();

        if (audiodevice->oboeinputcallback) {
            delete audiodevice->oboeinputcallback;
            audiodevice->oboeinputcallback = nullptr;
        }

        if (audiodevice->oboeerrorcallback) {
            delete audiodevice->oboeerrorcallback;
            audiodevice->oboeerrorcallback = nullptr;
        }
    }
}


void Box::android_audioWrite(AudioDevice *audiodevice, QByteArrayView data)
{
    if (audiodevice->samplingbits == 32) {
        QByteArrayView bdata = DSP_scale(data, audiodevice->volume);
        audiodevice->oboestream->write(bdata.data(), bdata.size() / audiodevice->oboestream->getBytesPerSample(), 1);
    } else {
        QByteArrayView bdata = floatToBytes(data, audiodevice->samplingbits, audiodevice->volume);
        audiodevice->oboestream->write(bdata.data(), bdata.size() / audiodevice->oboestream->getBytesPerSample(), 1);
    }
}

#endif


void Box::audioDeviceInputStateChanged(QAudio::State state)
{
    if (!sender())
        return;

    int audiodeviceid = static_cast<QAudioSource *>(sender())->objectName().toInt();

    AudioDevice *device = G_BOX->audioDevices()->value(audiodeviceid);

    if (!device)
        return;

    if (!device->audioinput)
        return;

    QAudioSource *audiodev = device->audioinput;
    QAudio::Error errorcode = audiodev->error();

    if (errorcode != QAudio::NoError) {
        QString error;
        if (errorcode == QAudio::OpenError)
            error = "Open Error";
        else if (errorcode == QAudio::IOError)
            error = "IO Error";
        else if (errorcode == QAudio::UnderrunError)
            error = "Underrun Error";
        else if (errorcode == QAudio::FatalError)
            error = "Fatal Error";

        if (state != QAudio::ActiveState)
            audiodev->resume();

        emit audioDevice_Error(audiodeviceid, error);
    }
}


void Box::audioDeviceOutputStateChanged(QAudio::State state)
{
    if (!sender())
        return;

    int audiodeviceid = static_cast<QAudioSink *>(sender())->objectName().toInt();

    AudioDevice *device = G_BOX->audioDevices()->value(audiodeviceid);

    if (!device)
        return;

    QAudioSink *audiodev = device->audiooutput;
    QAudio::Error errorcode = audiodev->error();

    if (errorcode != QAudio::NoError) {
        QString error;
        if (errorcode == QAudio::OpenError)
            error = "Open Error";
        else if (errorcode == QAudio::IOError)
            error = "IO Error";
        else if (errorcode == QAudio::UnderrunError)
            error = "Underrun Error";
        else if (errorcode == QAudio::FatalError)
            error = "Fatal Error";

        if (state != QAudio::ActiveState)
            audiodev->resume();

        emit audioDevice_Error(audiodeviceid, error);
    }

}


void Box::audioDeviceReadyRead()
{
    if (!sender())
        return;

    int audiodeviceid = static_cast<QIODevice *>(sender())->objectName().toInt();

    AudioDevice *device = G_BOX->audioDevices()->value(audiodeviceid);

    if (!device)
        return;

    QMutexLocker locker(&device->mutex);

    QByteArray data = device->iodevice->readAll();

    if (device->samplingbits == 32)
        device->buffer.append(data);
    else
        device->buffer.append(bytesToFloat(QByteArrayView(data), device->samplingbits).toByteArray());

    while(device->buffer.size() >= device->processsize) {
        QByteArrayView sdata = G_BOX->mem()->alloc(device->buffer.first(device->processsize));
        device->buffer = device->buffer.sliced(device->processsize);

        dsp_scale_float((float *)sdata.data(), static_cast<int>(sdata.size()) / SF, device->volume);

        if (!device->busy)
            emit audioDevice_Data(audiodeviceid, sdata);
    }

}


void Box::audioDevicetTimerTimeout()
{
    if (!sender())
        return;

    int audiodeviceid = static_cast<QTimer *>(sender())->objectName().toInt();

    AudioDevice *device = G_BOX->audioDevices()->value(audiodeviceid);

    if (!device)
        return;

    device->future = QtConcurrent::run(audio_process, this, device);
}


void Box::FFTUpdateWindow(Dsp *dsp, FFTWindow fft_window_type, const int N)
{
    if (fft_window_type == dsp->fft_window_type && N == dsp->fft_N)
        return;

    if (dsp->fft_N == -1)
        return;

    dsp->fft_N = -1;

    QFuture<void> future = QtConcurrent::run(fft_params, dsp, fft_window_type, N);
}


void Box::filePlayChunk()
{
    if (!sender())
        return;

    int fileid = static_cast<QTimer *>(sender())->objectName().toInt();

    File *file = m_files.value(fileid);

    if (!file)
        return;

    qint64 t = QDateTime::currentMSecsSinceEpoch();

    qsizetype chunk = static_cast<qsizetype>((t - file->msec) * (file->srate * file->channels * file->sbits / 8000));
    file->msec = t;

    QByteArray data = file->f->read(chunk);

    qsizetype n = data.size();
    if (n < chunk) {
        file->f->seek(file->header);
        data.append(file->f->read(chunk - n));
    }

    QByteArray fdata;
    if (file->sbits == 32)
        fdata = data;
    else
        fdata = bytesToFloat(QByteArrayView(data), file->sbits).toByteArray();

    QByteArrayView output;

    if ((file->channels == 2 && file->playmode != PM_MONO) || (file->channels == 1 && file->playmode == PM_STEREO)) {
        QByteArray mdata;
        float *ffdata = (float *)fdata.data();
        int N = static_cast<int>(fdata.size() / SF / 2);
        float f;

        for (int i = 0; i < N; ++i) {
            f = *ffdata++;
            f += *ffdata++;
            f /= 2;
            mdata.append((char *)&f, SF);
        }

        output = G_BOX->mem()->alloc(mdata);
    } else
        output = G_BOX->mem()->alloc(fdata);

    if (!file->busy)
        emit file_playData(fileid, output);
}


QByteArray Box::integerToLittleEndian(unsigned int x)
{
    QByteArray r;

    r.append(x & 0xff);
    r.append(x >> 8 & 0xff);
    r.append(x >> 16 & 0xff);
    r.append(x >> 24 & 0xff);

    return r;
}


bool Box::getPermission(const QString &permission)
{
#if QT_CONFIG(permissions)
    bool result = false;

    if (thread() != G_BOX->thread()) {
        QMetaObject::invokeMethod(G_BOX, "getPermission", Qt::BlockingQueuedConnection, qReturnArg(result), permission);
        return result;
    }

    QPermission perm;

    if (permission == "camera")
        perm = QCameraPermission();
    else if (permission == "microphone")
        perm = QMicrophonePermission();
    else if (permission == "bluetooth")
        perm = QBluetoothPermission();
    else if (permission == "location")
        perm = QLocationPermission();

    QEventLoop loop;

    qApp->requestPermission(perm, this, [&](const QPermission &permission) {
        result = permission.status() == Qt::PermissionStatus::Granted;
        loop.quit();
    });

    loop.exec();

    return result;

#else
    return true;
#endif
}


unsigned int Box::littleIndianToInteger(const QByteArray &x)
{
    return (unsigned char)x.at(0) + 256 * ((unsigned char)x.at(1) + 256 * ((unsigned char)x.at(2) + 256 * (unsigned char)x.at(3)));
}


unsigned short Box::littleIndianToShort(const QByteArray &x)
{
    return (unsigned char)x.at(0) + 256 * (unsigned char)x.at(1);
}


QString Box::remoteBox(const QString command, const QString param)
{
    QString ret;
    QString data = command + '\n' + param;
    Message message(Message::C_REMOTEBOX, data);
    message.setSiteID(m_siteid);
    int sequence = message.sequence();
    emit reqRemoteBox(message);

    QEventLoop loop;
    QTimer timer;
    connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);
    QMetaObject::Connection conn = connect(this, &Box::recRemoteBox, this, [&ret, sequence, &loop](const Message &message) {
        if (message.sequence() == sequence) {
            ret = message.data();
            loop.quit();
        }
    });
    timer.start(m_remotetimeout);
    loop.exec();
    disconnect(conn);

    return ret;
}


void Box::RTSTimer()
{
#if defined SERIAL
    if (G_BOX->serialPorts()->count() == 0) {
        m_rtstimer->stop();
        m_rtstimer->deleteLater();
        m_rtstimer = nullptr;
        return;
    }

    QList<SerialPortDevice *> devs = G_BOX->serialPorts()->values();
    for (SerialPortDevice *&dev : devs)
        dev->serialport->setRequestToSend(true);
#endif
}


void Box::setAFilter(Sdr *sdr)
{
    if (sdr->band == BAND_WFM && sdr->srate > 30000)
        DSP_setFilterParams(sdr->dspA, sdr->srate, 0, 15000, 6, FT_PASSBAND);
    else if (sdr->band == BAND_FM && sdr->srate > 10000)
        DSP_setFilterParams(sdr->dspA, sdr->srate, 0, 5000, 6, FT_PASSBAND);
    else
        DSP_resetFilter(sdr->dspA);
}


void Box::setBFilter(Sdr *sdr)
{
    DSP_setFilterParams(sdr->dspB, sdr->rawsrate, 0, sdr->srate / 2, 4, FT_PASSBAND);
}


void Box::setCFilter(Sdr *sdr)
{
    DSP_setFilterParams(sdr->dspC, sdr->rawsrate, 0, sdr->bandwidth / 2, 8, FT_PASSBAND);
}


void Box::serialPortErrorOccurred()
{
#if defined SERIAL
    if (!sender())
        return;

    QSerialPort *serialport = static_cast<QSerialPort *>(sender());

    emit serialPort_Error(serialport->objectName().toInt());
#endif
}


void Box::serialPortReadyRead()
{
#if defined SERIAL
    if (!sender())
        return;

    QSerialPort *serialport = static_cast<QSerialPort *>(sender());

    if (serialport->isReadable()) {
        QByteArray data = serialport->readAll();
        emit serialPort_Data(serialport->objectName().toInt(), data);
    }
#endif
}


QByteArray Box::shortToLittleIndian(unsigned short x)
{
    QByteArray r;

    r.append(x & 0xff);
    r.append(x >> 8 & 0xff);

    return r;
}


void Box::slaveDeviceReadyRead()
{
    if (!sender())
        return;

    int audiodeviceid = static_cast<QLocalSocket *>(sender())->objectName().toInt();

    AudioDevice *device = G_BOX->audioDevices()->value(audiodeviceid);

    if (!device)
        return;

    QMutexLocker locker(&device->mutex);

    QByteArray data;
    int samplerate;
    int size;

    while (true) {
        device->masterbuffer.append(device->iodevice->readAll());

        if (device->masterbuffer.size() < 2 * sizeof(int))
            break;

        samplerate = *reinterpret_cast<int *>(device->masterbuffer.data());
        size = *reinterpret_cast<int *>(device->masterbuffer.data() + sizeof(int));

        if (device->masterbuffer.size() < 2 * sizeof(int) + size)
            break;

        data.append(device->masterbuffer.sliced(2 * sizeof(int), size));
        device->masterbuffer.remove(0, 2 * sizeof(int) + size);
    }

    if (data.isEmpty())
        return;

    if (samplerate != device->samplerate)
        data = DSP_resample(device->dspid, QByteArrayView(data), static_cast<int>(data.size()) / SF * device->samplerate / samplerate).toByteArray();

    device->buffer.append(data);

    while(device->buffer.size() >= device->processsize) {
        QByteArrayView sdata = G_BOX->mem()->alloc(device->buffer.first(device->processsize));
        device->buffer = device->buffer.sliced(device->processsize);

        dsp_scale_float((float *)sdata.data(), static_cast<int>(sdata.size()) / SF, 2 * device->volume * device->volume);

        if (!device->busy)
            emit audioDevice_Data(audiodeviceid, sdata);
    }
}


void Box::videoDeviceReadyRead(const QVideoFrame &frame)
{
    if (!sender())
        return;

    int videodeviceid = static_cast<QVideoSink *>(sender())->objectName().toInt();

    VideoDevice *device = G_BOX->videoDevices()->value(videodeviceid);

    if (!device)
        return;

    QByteArray data;
    QBuffer buffer(&data);
    buffer.open(QIODevice::WriteOnly);
    frame.toImage().save(&buffer, "JPG", device->quality);
    buffer.close();
    QByteArrayView output = G_BOX->mem()->alloc(data);

    emit videoDevice_Data(videodeviceid, output);
}


HotPlugWorker::HotPlugWorker(Box *box)
{
    m_box = box;
    m_running = false;
}


HotPlugWorker::~HotPlugWorker()
{
    m_running = false;
}


void HotPlugWorker::start()
{
    if (m_running) {
        QTimer::singleShot(0, this, &HotPlugWorker::started);
        return;
    }

    m_running = true;

    QTimer::singleShot(0, this, &HotPlugWorker::worker);
}


void HotPlugWorker::stop()
{
    if (!m_running) {
        QTimer::singleShot(0, this, &HotPlugWorker::stopped);
        return;
    }

    emit m_stop();

    m_running = false;
}


void HotPlugWorker::worker()
{
    int prevdevnum = 0;
    int period = G_LOCALSETTINGS.get("system.devicediscovery").toInt();
    QEventLoop loop;

    emit started();

    connect(this, &HotPlugWorker::m_stop, &loop, &QEventLoop::quit);

    while (m_running) {
        int devnum = 0;
        devnum += m_box->audioDevice_list("ALL", true).count() << 12;
        devnum += m_box->videoDevice_list().count() << 8;

#if defined SERIAL
        devnum += m_box->serialPort_list().count() << 4;
#endif

#if defined USB
        libusb_device **list_dev;
        devnum += libusb_get_device_list(m_box->usb_context(), &list_dev);
        libusb_free_device_list(list_dev, 1);
#endif

        if (prevdevnum != devnum) {
            prevdevnum = devnum;
#if defined OS_ANDROID
            alibserial_init();
#endif
            emit m_box->hotPlug();
        }

        QTimer::singleShot(period, &loop, &QEventLoop::quit);
        loop.exec();
    }

    disconnect(this, &HotPlugWorker::m_stop, &loop, &QEventLoop::quit);

    emit stopped();
}


USBWorker::USBWorker(Box *box, Box::USBDevice *usbdevice, const int endpoint, const Box::USBMode mode, const int size)
{
    m_box = box;
    m_usbdevice = usbdevice;
    m_endpoint = endpoint;
    m_mode = mode;
    m_running = false;
    m_buf = nullptr;
    m_bufcnt = 0;
    m_buflen = 0;
    m_newbuflen = 0;
    m_size = size;
    m_psize = 0;
    m_error = false;

#if defined USB
    m_psize = libusb_get_max_alt_packet_size(libusb_get_device(usbdevice->handle), usbdevice->interface, usbdevice->altsetting, m_endpoint);
#endif

    if (m_psize <= 0)
        m_psize = 1024;

    connect(this, &USBWorker::error, this, [&]() {
        if (!m_error) {
            m_error = true;
            emit m_box->USB_Error(m_usbdevice->id);
        }
    });
}


USBWorker::~USBWorker()
{
    if (m_buf)
        delete m_buf;
}


void USBWorker::chunk(const char *data, const int len)
{
    if (m_buflen != m_newbuflen) {
        m_buflen = m_newbuflen;
        m_buf = (char *)realloc(m_buf, m_buflen);
        m_bufcnt = qMin(m_bufcnt, m_buflen);
    }

    if (m_buflen == 0)
        return;

    int inc, cnt = 0;

    while (cnt < len) {
        inc = qMin(m_buflen - m_bufcnt, len - cnt);
        memcpy(m_buf + m_bufcnt, data + cnt, inc);
        cnt += inc;
        m_bufcnt += inc;

        if (m_bufcnt == m_buflen) {
            if (!m_usbdevice->busy) {
                QByteArrayView output = G_BOX->mem()->alloc(m_buf, m_buflen);
                emit m_box->USB_Data(m_usbdevice->id, output);
            }
            m_bufcnt = 0;
        }
    }
}


void USBWorker::setBufLen(const int buflen)
{
    m_newbuflen = buflen;
}


void USBWorker::start()
{
    if (m_running) {
        QTimer::singleShot(0, this, &USBWorker::started);
        return;
    }

    m_running = true;

    QTimer::singleShot(0, this, &USBWorker::worker);
}


void USBWorker::stop()
{
    if (!m_running) {
        QTimer::singleShot(0, this, &USBWorker::stopped);
        return;
    }

    m_running = false;
}


void USBWorker::worker()
{
#if defined USB
    if (m_mode == Box::USB_BulkSync) {
        unsigned char *buf = (unsigned char *)malloc(m_size);
        int len;
        int r;

        emit started();

        while (m_running) {
            len = 0;
            r = libusb_bulk_transfer(m_usbdevice->handle, m_endpoint, buf, m_size, &len, 1000);

            if (r == LIBUSB_SUCCESS && len > 0)
                chunk((char *)buf, len);
            else
                emit error();
        }

        free(buf);

    } else if (m_mode == Box::USB_BulkAsync) {
        struct timeval tv = {0, 100000};
        struct libusb_transfer *xfr = libusb_alloc_transfer(0);
        xfr->flags = LIBUSB_TRANSFER_FREE_BUFFER;
        unsigned char *buf = (unsigned char *)malloc(m_size);

        libusb_fill_bulk_transfer(xfr, m_usbdevice->handle, m_endpoint, buf, m_size, usb_process, this, 0);
        libusb_submit_transfer(xfr);

        m_pendingtransfers = 1;

        emit started();

        while (m_running)
            libusb_handle_events_timeout_completed(m_box->usb_context(), &tv, NULL);

        while (m_pendingtransfers > 0)
            libusb_handle_events_timeout_completed(m_box->usb_context(), &tv, NULL);

    } else if (m_mode == Box::USB_Isochronous) {
        const int num = 8;
        unsigned char *buf;
        struct timeval tv = {0, 100000};
        struct libusb_transfer **xfr = new libusb_transfer *[num];

        for (int i = 0; i < num; ++i) {
            xfr[i] = libusb_alloc_transfer(m_size);
            xfr[i]->flags = LIBUSB_TRANSFER_FREE_BUFFER;
            buf = (unsigned char *)malloc(m_size * m_psize);
            libusb_fill_iso_transfer(xfr[i], m_usbdevice->handle, m_endpoint, buf, m_size * m_psize, m_size, usb_process, this, 0);
            libusb_set_iso_packet_lengths(xfr[i], m_psize);
            libusb_submit_transfer(xfr[i]);
        }

        m_pendingtransfers = num;

        emit started();

        while (m_running)
            libusb_handle_events_timeout_completed(m_box->usb_context(), &tv, NULL);

        while (m_pendingtransfers > 0)
            libusb_handle_events_timeout_completed(m_box->usb_context(), &tv, NULL);

        delete[] xfr;
    }

    emit stopped();
#endif
}


void audio_process(Box *box, Box::AudioDevice *dev)
{
    qint64 msecs;
    int emitsize;
    int period = 1000 / G_LOCALSETTINGS.get("system.refreshrate", "10").toInt();

    dev->processing = true;

    while (dev->processing) {
        msecs = QDateTime::currentMSecsSinceEpoch();
        emitsize = qMax(static_cast<int>((msecs - dev->msecs) * dev->samplerate / 250) & ~(SF - 1), 0);
        dev->msecs = msecs;

        if (dev->buffering) {
            if (dev->buffer.size() > 8 * dev->processsize)
                dev->buffering = false;
        }

        if (!dev->buffering && dev->buffer.size() >= emitsize) {
            QByteArrayView buffer = G_BOX->mem()->alloc(dev->buffer.first(emitsize));
            dev->buffer.remove(0, emitsize);
            if (!dev->busy)
                emit box->audioDevice_Processing(dev->id, buffer);

            if (dev->recording && !dev->recordpause && dev->wav.isOpen()) {
                if (dev->samplingbits == 32)
                    box->audioDevice_recordWrite(dev->id, buffer);
                else
                    box->audioDevice_recordWrite(dev->id, box->floatToBytes(buffer, dev->samplingbits));
            }

            if (dev->devname != "O:null") {
#if defined OS_ANDROID
                if (!dev->mute && dev->oboestream->getAvailableFrames().value() * dev->oboestream->getBytesPerFrame() < emitsize) {
                    box->android_audioWrite(dev, buffer);
#else
                if (dev->iodevice) {
                    if (dev->samplingbits == 32)
                        dev->iodevice->write(buffer.data(), buffer.size());
                    else {
                        QByteArrayView sbuffer = box->floatToBytes(buffer, dev->samplingbits);
                        dev->iodevice->write(sbuffer.data(), sbuffer.size());
                    }
#endif
                }
            }
        } else
            emit box->audioDevice_Processing(dev->id, QByteArrayView());

        QThread::msleep(qMax(10, period - QDateTime::currentMSecsSinceEpoch() + msecs));
    }
}


void fft(COMPLEX *x, COMPLEX *y, const int N, COMPLEX *twiddles, const int n, const int m)
{
    if (N == 4) {
        COMPLEX x0 = x[n];
        COMPLEX x1 = x[n + m];
        COMPLEX x2 = x[n + 2 * m];
        COMPLEX x3 = x[n + 3 * m];
        *y++ = x0 + x2 + x1 + x3;
        *y++ = x0 - x2 - (x1 - x3) * COMPLEX(0, 1);
        *y++ = x0 + x2 - x1 - x3;
        *y   = x0 - x2 + (x1 - x3) * COMPLEX(0, 1);
        return;
    }

    int N2 = N >> 1;

    COMPLEX *z = new COMPLEX[N];

    if (N <= 1024) {
        fft(x, z, N2, twiddles, n, 2 * m);
        fft(x, z + N2, N2, twiddles, n + m, 2 * m);
    } else {
        QFuture<void> future1 = QtConcurrent::run(fft, x, z, N2, twiddles, n, 2 * m);
        QFuture<void> future2 = QtConcurrent::run(fft, x, z + N2, N2, twiddles, n + m, 2 * m);
        future1.waitForFinished();
        future2.waitForFinished();
    }

    COMPLEX wk;
    COMPLEX *vy1 = y;
    COMPLEX *vy2 = y + N2;
    COMPLEX *vz1 = z;
    COMPLEX *vz2 = z + N2;
    for (int i = 0; i < N2; ++i) {
        wk = twiddles[N2 + i] * *vz2++;
        *vy1++ = *vz1 + wk;
        *vy2++ = *vz1++ - wk;
    }

    delete[] z;
}


void fft_params(Box::Dsp *dsp, Box::FFTWindow fft_window_type, const int N)
{
    if (dsp->fft_window)
        delete[] dsp->fft_window;

    dsp->fft_window = new float[N];

    float f;
    float kth;
    for (int i = 0; i < N; ++i) {
        kth = M_PI * i / N;
        switch (fft_window_type) {
        case Box::FFTW_HANN:
            f = 0.5 - 0.5 * cosf(2 * kth);
            break;
        case Box::FFTW_HAMMING:
            f = 0.54348 - 0.45652 * cosf(2 * kth);
            break;
        case Box::FFTW_BLACKMAN:
            f = 0.42659 - 0.49656 * cosf(2 * kth) + 0.07685 * cosf(4 * kth);
            break;
        case Box::FFTW_BLACKMAN_HARRIS_4:
            f = 0.35875 - 0.48829 * cosf(2 * kth) + 0.14128 * cosf(4 * kth) - 0.01168 * cosf(6 * kth);
            break;
        case Box::FFTW_BLACKMAN_HARRIS_7:
            f = 0.27105 - 0.43330 * cosf(2 * kth) + 0.21812 * cosf(4 * kth) - 0.06593 * cosf(6 * kth) + 0.03081 * cosf(8 * kth) - 0.00078 * cosf(10 * kth) - 0.00001 * cosf(12 * kth);
            break;
        default:
            f = 1;
        }
        dsp->fft_window[i] = f;
    }

    if (dsp->fft_twiddles)
        delete[] dsp->fft_twiddles;

    dsp->fft_twiddles = new COMPLEX[N];

    for (int n = N; n > 1; n /= 2)
        for (int i = 0; i < n / 2; ++i) {
            kth = -2 * i * M_PI / n;
            dsp->fft_twiddles[n / 2 + i] = COMPLEX(cosf(kth), sinf(kth));
        }

    dsp->fft_window_type = fft_window_type;
    dsp->fft_N = N;
}


void sdr_process(Box *box, Box::Sdr *sdr, QByteArrayView data)
{
    if (sdr->rawsrate == 0 || sdr->srate == 0 || sdr->bandwidth == 0 || data.size() == 0)
        return;

    int N1 = static_cast<int>(data.size() / SF / 2);
    int N2 = N1 * static_cast<float>(sdr->srate) / static_cast<float>(sdr->rawsrate);
    float *d = (float *)data.data();

    for (int i = 1; i < sdr->ksignallevel; ++i)
        sdr->signallevel[i - 1] = sdr->signallevel[i];

    sdr->signallevel[sdr->ksignallevel - 1] = box->dsp_SNR_float_c(sdr->dspC, d, 1024, sdr->rawsrate, sdr->bandwidth);

    box->dsp_normalize_float_c(sdr->dspC, d, N1);
    box->dsp_filter_float_c(sdr->dspC, d, N1);
    box->dsp_demodulate_float(sdr->dspC, d, N1, sdr->rawsrate, sdr->band);
    box->dsp_filter_float(sdr->dspB, d, N1);
    box->dsp_resample_float(sdr->dspB, d, N1, N2);
    if (!sdr->unfiltered) {
        box->dsp_filter_float(sdr->dspA, d, N2);
        if (sdr->band == box->BAND_WFM && sdr->tau != 0)
            box->dsp_deemphasis_float(sdr->dspA, d, N2, sdr->srate, sdr->tau);
    }
    box->dsp_normalize_float(sdr->dspA, d, N2);
    box->dsp_scale_float(d, N2, 2 * sdr->volume * sdr->volume);
    sdr->buffer.append((char *)d, N2 * SF);

    QByteArrayView output;

    while (sdr->buffer.size() >= sdr->processsize) {
        output = G_BOX->mem()->alloc(sdr->buffer.first(sdr->processsize));
        if (!sdr->busy)
            emit box->audioDevice_Data(sdr->id, output);

        sdr->buffer = sdr->buffer.sliced(sdr->processsize);
    }
}


void usb_process(struct libusb_transfer *xfr)
{
#if defined USB

    USBWorker *worker = static_cast<USBWorker *>(xfr->user_data);

    switch (xfr->status) {
        case LIBUSB_TRANSFER_CANCELLED:
            break;

        case LIBUSB_TRANSFER_STALL:
            libusb_submit_transfer(xfr);
            return;

        case LIBUSB_TRANSFER_ERROR:
        case LIBUSB_TRANSFER_NO_DEVICE:
        case LIBUSB_TRANSFER_TIMED_OUT:
        case LIBUSB_TRANSFER_OVERFLOW:
            emit worker->error();
            break;

        case LIBUSB_TRANSFER_COMPLETED: {
            if (xfr->type == LIBUSB_TRANSFER_TYPE_BULK)
                worker->chunk((char *)xfr->buffer, xfr->actual_length);

            else if (xfr->type == LIBUSB_TRANSFER_TYPE_ISOCHRONOUS) {
                int plen = xfr->iso_packet_desc[0].length;
                unsigned char *offsets = xfr->buffer;
                unsigned char *offsetd = xfr->buffer;

                for (int i = 0; i < xfr->num_iso_packets; ++i) {
                    if (xfr->iso_packet_desc[i].actual_length > 0) {
                        if (offsets != offsetd)
                            memcpy(offsetd, offsets, plen);
                        offsetd += plen;
                    }
                    offsets += plen;
                }

                worker->chunk((char *)xfr->buffer, static_cast<int>(offsetd - xfr->buffer));
            }

            if (worker->m_running) {
                libusb_submit_transfer(xfr);
                return;
            }

            break;
        }
    }

    libusb_free_transfer(xfr);
    --worker->m_pendingtransfers;
#endif
}


#if defined OS_ANDROID

USBSerialWorker::USBSerialWorker(Box *box, Box::SerialPortDevice *device)
{
    m_box = box;
    m_device = device;
    m_running = false;
}


USBSerialWorker::~USBSerialWorker()
{
    m_running = false;
}


void USBSerialWorker::setBufLen(const int buflen)
{
    m_buflen = buflen + 1;
}


void USBSerialWorker::start()
{
    if (m_running) {
        QTimer::singleShot(0, this, &USBSerialWorker::started);
        return;
    }

    m_running = true;

    QTimer::singleShot(0, this, &USBSerialWorker::worker);

    connect(this, &USBSerialWorker::error, [&]() {
        m_running = false;
        emit m_box->serialPort_Error(m_device->id);
    });
}


void USBSerialWorker::stop()
{
    if (!m_running) {
        QTimer::singleShot(0, this, &USBSerialWorker::stopped);
        return;
    }

    m_running = false;
}


void USBSerialWorker::worker()
{
    char *buf = nullptr;
    int buflen = 0;
    int len = 0;

    emit started();

    while (m_running) {
        if (m_buflen == 0) {
            QThread::msleep(100);
            continue;
        }

        if (buflen != m_buflen) {
            buflen = m_buflen;
            if (buf)
                delete[] buf;
            buf = new char[m_buflen];
        }

        if (!alibserial_isopen(m_device->devname.toUtf8().data()))
            emit error();

        len = alibserial_read(m_device->devname.toUtf8().data(), buf, buflen, 1000);

        if (len > 0) {
            QByteArrayView output = G_BOX->mem()->alloc(buf, len);
            emit m_box->serialPort_Data(m_device->id, output.toByteArray());
        }
    }

    if (buf)
        delete[] buf;

    emit stopped();
}


OboeInputCallBack::OboeInputCallBack(Box *box, Box::AudioDevice *audiodevice) : oboe::AudioStreamDataCallback()
{
    m_box = box;
    m_audiodevice = audiodevice;
}


OboeInputCallBack::~OboeInputCallBack()
{

}


oboe::DataCallbackResult OboeInputCallBack::onAudioReady(oboe::AudioStream *oboeStream, void *audioData, int32_t numFrames)
{
    if (m_audiodevice->samplingbits == 32)
        m_audiodevice->buffer.append((char *)audioData, numFrames * oboeStream->getBytesPerFrame());
    else
        m_audiodevice->buffer.append(m_box->bytesToFloat(QByteArrayView((char *)audioData, numFrames * oboeStream->getBytesPerFrame()), m_audiodevice->samplingbits).toByteArray());

    while(m_audiodevice->buffer.size() >= m_audiodevice->processsize) {
        QByteArrayView sdata = G_BOX->mem()->alloc(m_audiodevice->buffer.first(m_audiodevice->processsize));
        m_audiodevice->buffer = m_audiodevice->buffer.sliced(m_audiodevice->processsize);

        m_box->dsp_scale_float((float *)sdata.data(), static_cast<int>(sdata.size()) / SF, m_audiodevice->volume);

        if (!m_audiodevice->busy)
            emit m_box->audioDevice_Data(m_audiodevice->id, sdata);
    }

    return oboe::DataCallbackResult::Continue;
}


OboeErrorCallBack::OboeErrorCallBack(Box *box, Box::AudioDevice *audiodevice) : oboe::AudioStreamErrorCallback()
{
    m_box = box;
    m_audiodevice = audiodevice;
}


OboeErrorCallBack::~OboeErrorCallBack()
{

}


bool OboeErrorCallBack::onError(oboe::AudioStream *, oboe::Result)
{
    emit m_box->audioDevice_Error(m_audiodevice->id, "Oboe audio error");
    return true;
}

#endif
