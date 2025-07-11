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

#if !defined BOX_H
#define BOX_H

#include "common/common.h"
#include "common/message.h"
#include "common/mem.h"
#include "libusb/libusb.h"
#include <QAudioDevice>
#include <QCameraDevice>
#include <QFile>
#include <QHostAddress>
#include <QMutex>
#include <QPermission>
#include <QtConcurrentRun>
#include <QThread>
#include <complex>

#if defined OS_ANDROID
#include "source/liboboe/include/oboe/Oboe.h"
class OboeInputCallBack;
class OboeErrorCallBack;
#endif

class Data;
class HotPlugWorker;
class QAudioSink;
class QAudioSource;
class QCamera;
class QLocalSocket;
class QMediaCaptureSession;
class QMediaDevices;
class QSerialPort;
class QVideoSink;
class USBWorker;

#if defined OS_ANDROID
class USBSerialWorker;
#endif

#define SWAP(a, b) tmp = (a); (a) = (b); (b) = tmp;
#define COMPLEX std::complex<float>


class Box : public QObject
{
    Q_OBJECT

public:
    enum FFTWindow {
        FFTW_NONE,
        FFTW_HANN,
        FFTW_HAMMING,
        FFTW_BLACKMAN,
        FFTW_BLACKMAN_HARRIS_4,
        FFTW_BLACKMAN_HARRIS_7
    };
    Q_ENUM(FFTWindow)

    enum Band {
        BAND_AM,
        BAND_FM,
        BAND_WFM,
        BAND_LSB,
        BAND_USB,
        BAND_DSB
    };
    Q_ENUM(Band)

    enum FilterType {
        FT_PASSBAND,
        FT_REJECTBAND,
        FT_IIR,
        FT_FIR,
        FT_IFIR
    };
    Q_ENUM(FilterType)

    enum PlayMode {
        PM_DEFAULT,
        PM_MONO,
        PM_STEREO
    };
    Q_ENUM(PlayMode)

    enum USBMode {
        USB_BulkSync,
        USB_BulkAsync,
        USB_Isochronous
    };
    Q_ENUM(USBMode)

    enum USBDescriptor {
        USB_bLength,
        USB_bDescriptorType,
        USB_bcdUSB,
        USB_bDeviceClass,
        USB_bDeviceSubClass,
        USB_bDeviceProtocol,
        USB_bMaxPacketSize0,
        USB_idVendor,
        USB_idProduct,
        USB_bcdDevice,
        USB_iManufacturer,
        USB_iProduct,
        USB_iSerialNumber,
        USB_bNumConfigurations
    };
    Q_ENUM(USBDescriptor)

    enum MiricsFormat {
        MF_252,
        MF_336,
        MF_384,
        MF_504
    };
    Q_ENUM(MiricsFormat)

    struct AudioDevice { // Reordered to minimize padding
#if defined OS_ANDROID
        std::shared_ptr<oboe::AudioStream>  oboestream;

        OboeInputCallBack                  *oboeinputcallback;
        OboeErrorCallBack                  *oboeerrorcallback;
#endif
        QAudioSource                       *audioinput;
        QAudioSink                         *audiooutput;
        QIODevice                          *iodevice;
        void                               *parent;
        QTimer                             *timer;
        QFuture<void>                       future;
        QFile                               raw;
        QFile                               wav;
        QByteArray                          buffer;
        QByteArray                          masterbuffer;
        QString                             devname;
        QMutex                              mutex;
        qint64                              msecs;
        qint64                              recordlength;
        int                                 compressedbits;
        int                                 dspid;
        int                                 id;
        int                                 processsize;
        int                                 samplerate;
        int                                 samplingbits;
        float                               volume;
        bool                                buffering;
        bool                                busy;
        bool                                direct;
        bool                                mute;
        bool                                processing;
        bool                                recording;
        bool                                recordpause;
        char                                i_o;

        AudioDevice(void *parent = nullptr)
        {
            this->parent = parent;
        }
    };

    struct VideoDevice {
        QCamera                            *camera;
        QMediaCaptureSession               *capture;
        QString                             devname;
        int                                 id;
        void                               *parent;
        int                                 quality;
        QVideoSink                         *videosink;

        VideoDevice(void *parent = nullptr)
        {
            this->parent = parent;
        }
    };

    struct SerialPortDevice {
        QString                             devname;
        int                                 id;
        void                               *parent;
        QSerialPort                        *serialport;
        QString                             mode;
#if defined OS_ANDROID
        USBSerialWorker                    *worker;
#endif

        SerialPortDevice(void *parent = nullptr)
        {
            this->parent = parent;
        }
    };

    struct USBDevice {
        int                                 altsetting;
        int                                 buflen;
        bool                                busy;
        int                                 configuration;
        int                                 deviceid;
        bool                                driver_active;
        libusb_device_handle               *handle;
        int                                 id;
        int                                 interface;
        void                               *parent;
        USBWorker                          *worker;

        USBDevice(void *parent = nullptr)
        {
            this->parent = parent;
        }
    };

    struct Dsp {
        float                               agc;
        float                               deemlast;
        float                               demlastI;
        float                               demlastQ;
        int                                 fft_N;
        COMPLEX                            *fft_twiddles;
        float                              *fft_window;
        int                                 fft_window_type;
        float                               filter_gain;
        int                                 filter_order;
        FilterType                          filter_type;
        float                              *filter_a;
        float                              *filter_b;
        float                              *filter_i;
        float                              *filter_r;
        int                                 id;
        int                                 intDSP;
        QMutex                              mutex;
        float                              *nrlast;
        int                                 nrlen;
        float                               normAvgI;
        float                               normAvgQ;
        int                                 resDSP;
        float                               reslastI;
        float                               reslastQ;
    };

    struct Sdr {
        Band                                band;
        int                                 bandwidth;
        QByteArray                          buffer;
        bool                                busy;
        int                                 cbits;
        int                                 dspA;
        int                                 dspB;
        int                                 dspC;
        QFuture<void>                       future;
        int                                 id;
        const int                           ksignallevel = 10;
        int                                 processsize;
        int                                 rawsrate;
        int                                 sbits;
        int                                *signallevel;
        int                                 srate;
        int                                 tau;
        bool                                unfiltered;
        float                               volume;
    };

    struct File {
        bool                                busy;
        int                                 channels;
        QFile                              *f;
        int                                 header;
        int                                 id;
        qint64                              msec;
        PlayMode                            playmode;
        int                                 sbits;
        int                                 srate;
        QTimer                             *t;
    };

    struct USBCache {
        QList<int>                          descriptor;
        QString                             description;
        QString                             manufacturer;
        QString                             serialnumber;
    };

    explicit                               Box(QObject *parent = nullptr, bool remote = false);
    virtual                               ~Box();

    Q_INVOKABLE void                       audioDevice_close(const int devid);
    Q_INVOKABLE QString                    audioDevice_defaultInput();
    Q_INVOKABLE QString                    audioDevice_defaultOutput();
    Q_INVOKABLE QString                    audioDevice_description(const QString &devname);
    Q_INVOKABLE bool                       audioDevice_isOpen();
    Q_INVOKABLE bool                       audioDevice_isOpen(const QString &devname);
    Q_INVOKABLE QList<QString>             audioDevice_list(const QString &mode = "ALL", bool raw = false);
    Q_INVOKABLE QString                    audioDevice_mode(const QString &devname);
    Q_INVOKABLE void                       audioDevice_mute(const int devid, const bool mute);
    Q_INVOKABLE int                        audioDevice_open(const QString &devname, const QString &mode, const bool direct = false);
    Q_INVOKABLE void                       audioDevice_recordPause(const int devid, const bool pause);
    Q_INVOKABLE void                       audioDevice_recordStart(const int devid, const QString filename, const int rawsamplerate = 0);
    Q_INVOKABLE void                       audioDevice_recordStop(const int devid);
    Q_INVOKABLE void                       audioDevice_recordWrite(const int devid, QByteArrayView data);
    Q_INVOKABLE void                       audioDevice_reset(const int devid);
    Q_INVOKABLE void                       audioDevice_setBusy(const int devid, const bool busy);
    Q_INVOKABLE void                       audioDevice_setVolume(const int devid, const float volume);
    Q_INVOKABLE void                       audioDevice_write(const int devid, QByteArrayView data);
    QAudioDevice                           audioDevice_fromName(const QString &devname);

    Q_INVOKABLE void                       videoDevice_close(const int devid);
    Q_INVOKABLE QList<QString>             videoDevice_configurations(const QString &devname);
    Q_INVOKABLE QString                    videoDevice_default();
    Q_INVOKABLE QString                    videoDevice_description(const QString &devname);
    Q_INVOKABLE QList<int>                 videoDevice_frameRates(const QString &devname);
    Q_INVOKABLE bool                       videoDevice_isOpen();
    Q_INVOKABLE bool                       videoDevice_isOpen(const QString &devname);
    Q_INVOKABLE QList<QString>             videoDevice_list();
    Q_INVOKABLE int                        videoDevice_open(const QString &devname, const QString &mode);
    Q_INVOKABLE QString                    videoDevice_orientation(const QString &devname);
    Q_INVOKABLE QString                    videoDevice_position(const QString &devname);
    Q_INVOKABLE QList<QString>             videoDevice_resolutions(const QString &devname);
    Q_INVOKABLE bool                       videoDevice_setConfiguration(const int devid, const QString &mode);
    Q_INVOKABLE void                       videoDevice_setQuality(const int devid, const int quality);
    Q_INVOKABLE QByteArrayView             videoDevice_takeShot(const int devid);
    Q_INVOKABLE QList<int>                 videoDevice_videoFormats(const QString &devname);
    QCameraDevice                          videoDevice_fromName(const QString &devname);

    Q_INVOKABLE void                       serialPort_close(const int devid);
    Q_INVOKABLE QString                    serialPort_description(const QString &devname);
    Q_INVOKABLE int                        serialPort_DTR(const int devid, const int newDTR = -1);
    Q_INVOKABLE bool                       serialPort_isOpen(const QString &devname);
    Q_INVOKABLE QList<QString>             serialPort_list();
    Q_INVOKABLE QString                    serialPort_manufacturer(const QString &devname);
    Q_INVOKABLE int                        serialPort_open(const QString &devname, const QString &mode);
    Q_INVOKABLE int                        serialPort_RTS(const int devid, const int newRTS = -1);
    Q_INVOKABLE QString                    serialPort_serialNumber(const QString &devname);
    Q_INVOKABLE QString                    serialPort_systemLocation(const QString &devname);
    Q_INVOKABLE void                       serialPort_write(const int devid, const QByteArray &data);

    Q_INVOKABLE int                        USB_attach_kernel_driver(const int usbhandleid, const int interface);
    Q_INVOKABLE int                        USB_bulk_transfer(const int usbhandleid, const int endpoint, const QByteArray &data, const int len, const int timeout);
    Q_INVOKABLE void                       USB_bulk_transfer_setBufLen(const int usbhandleid, const int buflen);
    Q_INVOKABLE void                       USB_bulk_transfer_start(const int usbhandleid, const int endpoint, const Box::USBMode mode = USB_BulkSync, const int size = 65536);
    Q_INVOKABLE void                       USB_bulk_transfer_stop(const int usbhandleid);
    Q_INVOKABLE int                        USB_claim_interface(const int usbhandleid, const int interface);
    Q_INVOKABLE int                        USB_close(const int usbhandleid);
    Q_INVOKABLE QByteArray                 USB_control_transfer(const int usbhandleid, const int type, const int request, const int value, const int index, const QByteArray &data, const int len, const int timeout);
    Q_INVOKABLE int                        USB_detach_kernel_driver(const int usbhandleid, const int interface);
    Q_INVOKABLE int                        USB_get_device(const int usbhandleid);
    Q_INVOKABLE QList<int>                 USB_get_device_descriptor(const int usbdeviceid);
    Q_INVOKABLE QList<int>                 USB_get_device_list();
    Q_INVOKABLE QString                    USB_get_string_descriptor_ascii(const int usbhandleid, const int index);
    Q_INVOKABLE int                        USB_kernel_driver_active(const int usbhandleid, const int interface);
    Q_INVOKABLE int                        USB_open(const int usbdeviceid, const int interface = -1);
    Q_INVOKABLE int                        USB_release_interface(const int usbhandleid, const int interface);
    Q_INVOKABLE int                        USB_reset_device(const int usbhandleid);
    Q_INVOKABLE void                       USB_setBusy(const int usbhandleid, const bool busy);
    Q_INVOKABLE int                        USB_set_configuration(const int usbhandleid, const int configuration);
    Q_INVOKABLE int                        USB_set_interface_alt_setting(const int usbhandleid, const int interface, const int altsetting);
    Q_INVOKABLE bool                       USBDevice_close(const QString &devname);
    Q_INVOKABLE QString                    USBDevice_description(const QString &devname);
    Q_INVOKABLE QList<QString>             USBDevice_list();
    Q_INVOKABLE QString                    USBDevice_manufacturer(const QString &devname);
    Q_INVOKABLE int                        USBDevice_open(const QString &devname, const int interface = -1);
    Q_INVOKABLE QString                    USBDevice_serialNumber(const QString &devname);
    Q_INVOKABLE bool                       USBDevice_test(const QString &devname);
    libusb_context                        *usb_context() {return m_usbcontext;}
    QString                                usb_description(int vid, int pid);
    QString                                usb_manufacturer(int vid, int pid);
    ssize_t                                usb_sortedlist(libusb_context *ctx, libusb_device ***list);
    int                                    usb_device_id(libusb_device *device);

    Q_INVOKABLE float                      DSP_avg(QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_compress(QByteArrayView input, const int cbits);
    Q_INVOKABLE int                        DSP_create();
    Q_INVOKABLE QByteArrayView             DSP_demodulate(const int dspid, QByteArrayView input, const int fs, const Box::Band band);
    Q_INVOKABLE void                       DSP_dump(QByteArrayView input, const QString &filename, const bool append = false);
    Q_INVOKABLE void                       DSP_dump_c(QByteArrayView input, const QString &filename, const bool append = false);
    Q_INVOKABLE QByteArrayView             DSP_FFT(const int dspid, QByteArrayView input, const int width = -1, const Box::FFTWindow window_type = FFTW_BLACKMAN_HARRIS_4);
    Q_INVOKABLE QByteArrayView             DSP_FFT_c(const int dspid, QByteArrayView input, const int width = -1, const Box::FFTWindow window_type = FFTW_BLACKMAN_HARRIS_4);
    Q_INVOKABLE QByteArrayView             DSP_filter(const int dspid, QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_filter_c(const int dspid, QByteArrayView input);
    Q_INVOKABLE float                      DSP_max(QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_mirics_convert(QByteArrayView input, Box::MiricsFormat format, const int rate);
    Q_INVOKABLE float                      DSP_min(QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_normalize(const int dspid, QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_normalize_c(const int dspid, QByteArrayView input);
    Q_INVOKABLE QByteArrayView             DSP_NR(const int dspid, QByteArrayView input, const float ratio);
    Q_INVOKABLE void                       DSP_release(const int dspid);
    Q_INVOKABLE QByteArrayView             DSP_resample(const int dspid, QByteArrayView input, const int outputsize);
    Q_INVOKABLE QByteArrayView             DSP_resample_c(const int dspid, QByteArrayView input, const int outputsize);
    Q_INVOKABLE void                       DSP_resetFilter(const int dspid);
    Q_INVOKABLE QByteArrayView             DSP_scale(QByteArrayView input, const float scale);
    Q_INVOKABLE void                       DSP_setFilterParams(const int dspid, const int fs, const int f1, const int f2, const int order, const Box::FilterType type, const Box::FilterType algorithm = FT_IIR);
    Q_INVOKABLE QByteArrayView             DSP_uncompress(QByteArrayView input, const int cbits);
    float                                  dsp_avg_float(float *data, const int N);
    void                                   dsp_deemphasis_float(const int dspid, float *data, const int N, const int fs, const int tau);
    void                                   dsp_demodulate_float(const int dspid, float *data, const int N, const int fs, const Box::Band band);
    void                                   dsp_dump_float(float *data, const int N, const QString &filename, const bool append = false);
    void                                   dsp_dump_float_c(float *data, const int N, const QString &filename, const bool append = false);
    void                                   dsp_filter_float(const int dspid, float *data, const int N);
    void                                   dsp_filter_float_c(const int dspid, float *data, const int N);
    float                                  dsp_max_float(float *data, const int N);
    float                                  dsp_min_float(float *data, const int N);
    void                                   dsp_normalize_float(const int dspid, float *data, const int N);
    void                                   dsp_normalize_float_c(const int dspid, float *data, const int N);
    void                                   dsp_NR_float(const int dspid, float *data, const int N, const float ratio);
    void                                   dsp_resample_float(const int dspid, float *&input, const int N1, const int N2);
    void                                   dsp_resample_float_c(const int dspid, float *&input, const int N1, const int N2);
    void                                   dsp_scale_float(float *input, const int N, const float scale);
    int                                    dsp_SNR_float_c(const int dspid, float *data, const int N, const int samplerate, const int bandwidth);

    Q_INVOKABLE int                        SDR_create();
    Q_INVOKABLE void                       SDR_feed(const int sdrid, QByteArrayView input);
    Q_INVOKABLE void                       SDR_release(const int sdrid);
    Q_INVOKABLE void                       SDR_setAFAGC(const int sdrid, const bool agc);
    Q_INVOKABLE void                       SDR_setAudioMode(const int sdrid, const QString &audiomode);
    Q_INVOKABLE void                       SDR_setBand(const int sdrid, const QString &band);
    Q_INVOKABLE void                       SDR_setBusy(const int sdrid, const bool busy);
    Q_INVOKABLE void                       SDR_setFilter(const int sdrid, const int filter);
    Q_INVOKABLE void                       SDR_setFMtau(const int sdrid, const int tau);
    Q_INVOKABLE void                       SDR_setSampleRate(const int sdrid, const int rate = 0);
    Q_INVOKABLE void                       SDR_setUnfiltered(const int sdrid, const bool unfiltered);
    Q_INVOKABLE void                       SDR_setVolume(const int sdrid, const float volume);
    Q_INVOKABLE int                        SDR_signalLevel(const int sdrid);

    Q_INVOKABLE int                        file_channels(const int fileid, const int newval = -1);
    Q_INVOKABLE void                       file_close(const int fileid);
    Q_INVOKABLE bool                       file_delete(const QString filename);
    Q_INVOKABLE QList<QString>             file_list(const QString &mask);
    Q_INVOKABLE int                        file_openRead(const QString &filename);
    Q_INVOKABLE int                        file_openWrite(const QString &filename);
    Q_INVOKABLE void                       file_play(const int fileid, const Box::PlayMode playmode = PM_DEFAULT);
    Q_INVOKABLE QByteArrayView             file_read(const int fileid, const int size);
    Q_INVOKABLE int                        file_samplebits(const int fileid, const int newval = -1);
    Q_INVOKABLE int                        file_samplerate(const int fileid, const int newval = -1);
    Q_INVOKABLE bool                       file_save(const QString filename);
    Q_INVOKABLE void                       file_seek(const int fileid, const int position);
    Q_INVOKABLE void                       file_setBusy(const int fileid, const bool busy);
    Q_INVOKABLE void                       file_stop(const int fileid);
    Q_INVOKABLE void                       file_write(const int fileid, const QByteArrayView &data);

    Q_INVOKABLE QByteArray                 HTTP_download(const QString &url);
    Q_INVOKABLE QString                    HTTP_get(const QString &url);
    Q_INVOKABLE QString                    HTTP_post(const QString &url, const QString &command);
    Q_INVOKABLE QString                    HTTP_postData(const QString &url, const QString &command, const QByteArray &data);

    Q_INVOKABLE QByteArrayView             bytesToFloat(QByteArrayView input, const int inputbits, const float scale = 1.0);
    Q_INVOKABLE QString                    escape(const QString &data);
    Q_INVOKABLE QByteArrayView             floatToBytes(QByteArrayView input, const int outputbits, const float scale = 1.0);
    Q_INVOKABLE QString                    localFilePath();
    Q_INVOKABLE QString                    os();
    Q_INVOKABLE QString                    param(const QString &param);
    Q_INVOKABLE void                       sleep(int ms);
    Q_INVOKABLE QObject                   *timer();
    Q_INVOKABLE QString                    unescape(const QString &data);
    Q_INVOKABLE QByteArrayView             viewClone(QByteArrayView input, const int p1 = 0, const int p2 = -1);
    Q_INVOKABLE QByteArrayView             viewFromBytes(const QByteArray &input);
    Q_INVOKABLE int                        viewSize(QByteArrayView input);
    Q_INVOKABLE QByteArrayView             viewSlice(QByteArrayView input, const int p1, const int p2 = -1);
    Q_INVOKABLE QByteArray                 viewToBytes(QByteArrayView input);

    QHash<int, AudioDevice *>             *audioDevices() {return &m_audiodevices;}
    QString                                function(const QString &command, const QString &param);
    int                                    id() {return m_id++;}
    Mem                                   *mem() {return &m_mem;}
    QHash<int, SerialPortDevice *>        *serialPorts() {return &m_serialports;}
    void                                   setAppName(const QString &appname);
    void                                   setSiteID(const QString &siteid);
    QHash<int, USBDevice *>               *usbDevices() {return &m_usbdevices;}
    QHash<int, VideoDevice *>             *videoDevices() {return &m_videodevices;}
    QList<QString>                        *virtualDevices() {return &m_virtualdevices;}

#if defined OS_ANDROID
    QList<QString>                         android_audioDeviceList(const QString mode);
    int                                    android_audioDeviceId(const QString id);
    QString                                android_audioDeviceDefaultInput();
    QString                                android_audioDeviceDefaultOutput();
    int                                    android_audioDeviceOpen(AudioDevice *audiodevice);
    void                                   android_audioDeviceClose(AudioDevice *audiodevice);
    void                                   android_audioWrite(AudioDevice *audiodevice, QByteArrayView data);
#endif

private:
    void                                   audioDeviceInputStateChanged(QAudio::State state);
    void                                   audioDeviceOutputStateChanged(QAudio::State state);
    void                                   audioDeviceReadyRead();
    void                                   audioDevicetTimerTimeout();
    void                                   FFTUpdateWindow(Dsp *dsp, Box::FFTWindow fft_window_type, const int N);
    void                                   filePlayChunk();
    Q_INVOKABLE bool                       getPermission(const QString &permission);
    QByteArray                             integerToLittleEndian(unsigned int x);
    unsigned int                           littleIndianToInteger(const QByteArray &x);
    unsigned short                         littleIndianToShort(const QByteArray &x);
    QString                                remoteBox(const QString command, const QString param = "");
    void                                   RTSTimer();
    void                                   setAFilter(Sdr *sdr);
    void                                   setBFilter(Sdr *sdr);
    void                                   setCFilter(Sdr *sdr);
    void                                   serialPortErrorOccurred();
    void                                   serialPortReadyRead();
    QByteArray                             shortToLittleIndian(unsigned short x);
    void                                   slaveDeviceReadyRead();
    void                                   videoDeviceReadyRead(const QVideoFrame &frame);

    QString                                m_appname;
    QHash<int, AudioDevice *>              m_audiodevices;
    QMutex                                 m_audioDevice_mutex;
    QHash<int, Dsp *>                      m_DSPs;
    QMutex                                 m_DSP_mutex;
    QFile                                  m_file;
    QHash<int, File *>                     m_files;
    HotPlugWorker                         *m_hotplugworker;
    int                                    m_id;
    QMediaDevices                         *m_mediadevices;
    Mem                                    m_mem;
    bool                                   m_remote;
    int                                    m_remotetimeout;
    QTimer                                *m_rtstimer;
    QHash<int, Sdr *>                      m_SDRs;
    QMutex                                 m_SDR_mutex;
    int                                    m_refreshrate;
    QHash<int, SerialPortDevice *>         m_serialports;
    QMutex                                 m_serialPort_mutex;
    QString                                m_siteid;
    libusb_context                        *m_usbcontext;
    QHash<int, USBDevice *>                m_usbdevices;
    QMutex                                 m_USBDevice_mutex;
    QHash<int, VideoDevice *>              m_videodevices;
    QMutex                                 m_videoDevice_mutex;
    QList<QString>                         m_virtualdevices;

signals:
    void                                   audioDevice_Data(const int audiodeviceid, QByteArrayView data);
    void                                   audioDevice_Error(const int audiodeviceid, const QString &error);
    void                                   audioDevice_Processing(const int audiodeviceid, QByteArrayView data);
    void                                   audioDevice_RecordSize(const int audiodeviceid, const qint64 size);
    void                                   audioDevice_Slave(const int samplerate, QByteArrayView data);
    void                                   file_playData(const int fileid, QByteArrayView data);
    void                                   hotPlug();
    void                                   recRemoteBox(const Message &message);
    void                                   reqRemoteBox(const Message &message);
    void                                   serialPort_Data(const int serialportid, const QByteArray &data);
    void                                   serialPort_Error(const int serialportid);
    void                                   USB_Data(const int usbdeviceid, QByteArrayView data);
    void                                   USB_Error(const int usbdeviceid);
    void                                   videoDevice_Data(const int videodeviceid, QByteArrayView data);
    void                                   videoDevice_Error(const int videodeviceid);
};


class HotPlugWorker : public QObject
{
    Q_OBJECT

public:
    explicit                               HotPlugWorker(Box *box);
    virtual                               ~HotPlugWorker();

    void                                   start();
    void                                   stop();

private:
    Box                                   *m_box;
    bool                                   m_running;

    void                                   worker();

signals:
    void                                   m_stop();
    void                                   started();
    void                                   stopped();
};


class USBWorker : public QObject
{
    Q_OBJECT

public:
    explicit                               USBWorker(Box *box, Box::USBDevice *usbdevice, const int endpoint, const Box::USBMode mode, const int size);
    virtual                               ~USBWorker();

    void                                   chunk(const char *data, const int len);
    void                                   setBufLen(const int buflen);
    void                                   start();
    void                                   stop();

    int                                    m_pendingtransfers;
    bool                                   m_running;

private:
    Box                                   *m_box;
    char                                  *m_buf;
    int                                    m_bufcnt;
    int                                    m_buflen;
    int                                    m_endpoint;
    bool                                   m_error;
    Box::USBMode                           m_mode;
    int                                    m_newbuflen;
    int                                    m_size;
    int                                    m_psize;
    Box::USBDevice                        *m_usbdevice;

    void                                   worker();

signals:
    void                                   error();
    void                                   started();
    void                                   stopped();
    void                                   USBWorker_data(QByteArrayView data);
};

#if defined OS_ANDROID

class USBSerialWorker : public QObject
{
    Q_OBJECT

public:
    explicit                               USBSerialWorker(Box *box, Box::SerialPortDevice *device);
    virtual                               ~USBSerialWorker();

    void                                   setBufLen(const int buflen);
    void                                   start();
    void                                   stop();
    void                                   worker();

private:
    Box                                   *m_box;
    int                                    m_buflen;
    Box::SerialPortDevice                 *m_device;
    bool                                   m_running;

signals:
    void                                   error();
    void                                   started();
    void                                   stopped();
    void                                   USBSerialWorker_data(QByteArrayView data);
};


class OboeInputCallBack : public oboe::AudioStreamDataCallback
{
public:
    explicit                               OboeInputCallBack(Box *box, Box::AudioDevice *audiodevice);
    virtual                               ~OboeInputCallBack();

    oboe::DataCallbackResult               onAudioReady(oboe::AudioStream *oboeStream, void *audioData, int32_t numFrames) override;

private:
    Box                                   *m_box;
    Box::AudioDevice                      *m_audiodevice;
};


class OboeErrorCallBack : public oboe::AudioStreamErrorCallback
{
public:
    explicit                              OboeErrorCallBack(Box *box, Box::AudioDevice *audiodevice);
    virtual                              ~OboeErrorCallBack();

    bool onError(oboe::AudioStream *, oboe::Result) override;

private:
    Box                                   *m_box;
    Box::AudioDevice                      *m_audiodevice;
};

#endif

void                                      audio_process(Box *box, Box::AudioDevice *dev);
void                                      fft(COMPLEX *x, COMPLEX *y, const int N, COMPLEX *twiddles, const int n = 0, const int m = 1);
void                                      fft_params(Box::Dsp *dsp, Box::FFTWindow fft_window_type, const int N);
void                                      hotplug(Box *box);
void                                      sdr_process(Box *box, Box::Sdr *sdr, QByteArrayView data);
void                                      usb_process(struct libusb_transfer *xfr);

#endif // BOX_H
