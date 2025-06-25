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
#include "server/serversession.h"
#include <QResource>
#include <QTimer>


ServerSession::ServerSession(const QString &siteid, const QString &deviceid, QObject *parent) : QObject(parent)
{
    m_siteid = siteid;
    m_deviceid = deviceid;
    m_sessionid = newID();
    m_engine = nullptr;
    m_timer = nullptr;
    m_box = nullptr;
    m_watchdog = 0;

    QString id = siteid + deviceid;
    m_storage.setLocalFile("_Store_" + id + ".set");
    m_appwatchdog = G_LOCALSETTINGS.get("system.appwatchdog").toInt();
    m_appwatchdog2 = 3 * m_appwatchdog;
}


ServerSession::~ServerSession()
{
    if (m_timer)
        m_timer->deleteLater();

    if (m_engine)
        if (m_engine->globalObject().hasProperty("b_finish")) {
            QJSValue result = m_engine->globalObject().property("b_finish").call();
            if (result.isError())
                jsError(result);
        }

    QResource::unregisterResource(reinterpret_cast<const unsigned char *>(m_rcc.data()), "/" + m_temppath);
}


void ServerSession::debug(const QString &value) const
{
    qInfo() << qPrintable(value);
}


QObject *ServerSession::getBox()
{
    if (!m_box) {
        m_box = new Box(this);
        m_box->setSiteID(m_siteid);
        m_box->setAppName(m_appname);
        QJSEngine::setObjectOwnership(m_box, QJSEngine::CppOwnership);
        connect(m_box, &Box::hotPlug, this, &ServerSession::hotPlug);
    }

    return m_box;
}


QString ServerSession::getvar(const QString &key, const QString &value) const
{
    QString val = m_storage.get(key);

    if (val.isEmpty())
        return value;
    else
        return val;
}


void ServerSession::import(const QString &module, const QString &file) const
{
    QJSValue value = m_engine->importModule(":/" + m_temppath + "/" + file);
    m_engine->globalObject().setProperty(module, value);

    if (!m_engine->globalObject().hasProperty(module))
        qInfo() << qPrintable("SERVERSESSION: Error in JS module " + file + ": " + value.toString());
}


QString  ServerSession::param(const QString &value) const
{
    return G_LOCALSETTINGS.get(value);
}


void ServerSession::send(const QString &key, const QString &value)
{
    QString data = m_sessionid + key + "=" + value;
    Message message(Message::C_APPDATA, data);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ServerSession::sendbin(const QString &key, QByteArrayView value)
{
    QByteArray data = m_sessionid.toUtf8() + key.toUtf8() + "=" + value.toByteArray();
    Message message(Message::C_APPDATABIN, data);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ServerSession::setvar(const QString &key, const QString &value)
{
    m_storage.set(key, value);
}


QString ServerSession::deviceID() const
{
    return m_deviceid;
}


void ServerSession::messageIn(const Message &message)
{
    if (message.sequence() == m_messageseq) {
        switch (message.command()) {

            //** message.data() => configuration of the device
            case Message::C_GETDEVICES: {
                Settings settings;
                settings.loadString(message.data());
                m_deviceconfig = settings.extractSettings(m_deviceid + ".config");
                QString driver = settings.get(m_deviceid + ".driver");

                if (driver.isEmpty()) {
                    if (G_VERBOSE) qInfo() << qPrintable("SERVERSESSION: Error retrieving information for the device.");
                } else {
                    m_appname = G_LOCALSETTINGS.get("site.name") + " :: " + settings.get(m_deviceid + ".name");
                    Message lmessage(message);
                    lmessage.setMessage(Message::C_GETDRIVERSERVER, driver);
                    emit messageOut(lmessage);
                }

                return;
            }

            //** message.data() => binary byte array containing the rcc file for the server app
            case Message::C_GETDRIVERSERVER: {
                m_rcc = message.data();
                m_temppath = newID();

                qInfo() << qPrintable("SERVERSESSION: Loading server app from :/"  + m_temppath + "/main.js");

                if (!QResource::registerResource(reinterpret_cast<const unsigned char *>(m_rcc.data()), "/" + m_temppath)) {
                    qInfo() << qPrintable("SERVERSESSION: Error loading resource data");
                    emit error(this);
                    return;
                }

                QFile file(":/" + m_temppath + "/main.js");

                if (!file.open(QFile::ReadOnly)) {
                    qInfo() << qPrintable("SERVERSESSION: Error loading main.js");
                    emit error(this);
                    return;
                }

                QByteArray data = file.readAll();
                file.close();
                data = wrapQml(data);

                m_engine = new QJSEngine(this);
                m_engine->globalObject().setProperty("_this_", m_engine->newQObject(this));
                m_engine->globalObject().setProperty("Box", m_engine->newQMetaObject(G_BOX->metaObject()));
                QJSValue result = m_engine->evaluate(QString(data), "main.js");

                if (result.isError()) {
                    jsError(result);
                    emit error(this);
                } else {
                    QJSValue res = m_engine->globalObject().property("_start_").call(QJSValueList() << m_engine->toScriptValue<QVariant>(m_deviceconfig.getVariant()));
                    if (res.isError())
                        jsError(res);

                    m_installed = true;
                    emit started(this);
                }

                return;
            }

            default: {
                break;
            }
        }
    }

    if (message.data().startsWith(m_sessionid.toUtf8())) {
        switch (message.command()) {

            //** message.data() => session id + <key>=<value>\n<key>=<value>\n ...
            case Message::C_APPDATA: {
                Settings data;
                data.loadString(message.data().sliced(G_IDSIZE));
                receive(data);
                return;
            }

            //** message.data() => session id + <binary data>
            case Message::C_APPDATABIN: {
                receivebin(message.data().sliced(G_IDSIZE));
                return;
            }

            //** message.data() => session id
            case Message::C_APPWATCHDOG: {
                if (m_watchdog == 0) {
                    m_timer = new QTimer(this);
                    connect(m_timer, &QTimer::timeout, this, &ServerSession::heartbeat);
                    m_timer->start(m_appwatchdog);
                    heartbeat();
                }

                m_watchdog = QDateTime::currentMSecsSinceEpoch();
                return;
            }

            default: {
                break;
            }
        }
    }
}


QString ServerSession::sessionID() const
{
    return m_sessionid;
}


QString ServerSession::siteID() const
{
    return m_siteid;
}


void ServerSession::start()
{
    if (G_VERBOSE) qInfo() << qPrintable("SERVERSESSION: Installing server session " + m_sessionid + " for device " + m_deviceid);

    m_installed = false;

    QTimer::singleShot(G_LOCALSETTINGS.get("system.remotetimeout").toInt(), this, &ServerSession::installTimeout);

    Message message(Message::C_GETDEVICES);
    m_messageseq = message.sequence();
    emit messageOut(message);
}


void ServerSession::heartbeat()
{
    qint64 currtime = QDateTime::currentMSecsSinceEpoch();

    if (m_watchdog != 0) {
        if (currtime - m_watchdog > m_appwatchdog2) {
            qInfo() << qPrintable("SERVERSESSION: Session timeout");
            emit closed(this);
            return;
        }
    }

    Message message(Message::C_APPWATCHDOG, m_sessionid);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ServerSession::installTimeout()
{
    if (!m_installed) {
        qInfo() << qPrintable("SERVERSESSION: Unknown error installing the server app");
        emit error(this);
    }
}


void ServerSession::jsError(QJSValue error) const
{
    QString fileName = error.property("fileName").toString();

    qInfo() << qPrintable("SERVERSESSION: JS error in " + fileName
                   + " line:" + QString::number(error.property("lineNumber").toInt() - (fileName.indexOf("main.js") > -1 ? 7 : 0))
                   + ": " + error.property("message").toString());
}


void ServerSession::receive(const Settings &properties)
{
    QList<QString> keys = properties.keys();

    for (QString &key : keys)
        emit receiveSignal(key, properties.value(key));
}


void ServerSession::receivebin(const QByteArray &data)
{
    qsizetype pos = data.indexOf('=');

    if (pos < 0)
        return;

    QString key = QString(data.first(pos));
    QByteArrayView value = G_BOX->mem()->alloc(data.sliced(pos + 1));

    emit receivebinSignal(key, value);
}


QByteArray ServerSession::wrapQml(const QByteArray &data) const
{
    QByteArray ldata = data;
    ldata.replace("\r\n", "\n");

    QByteArray d;

    d += "let b_os = '" + productType().toUtf8() + "'\n";
    d += "let b_appname = '" + m_appname.toUtf8() + "'\n";
    d += "function b_getbox() {return _this_.getBox();}\n";
    d += "function b_send(k, v) {return _this_.send(k, String(v));}\n";
    d += "function b_sendbin(k, v) {return _this_.sendbin(k, v);}\n";
    d += "function b_setvar(k, v) {_this_.setvar(k, String(v));}\n";
    d += "function b_getvar(k, v) {return _this_.getvar(k, String(v));}\n";
    d += "function b_debug(v) {_this_.debug(v);}\n";
    d += "function b_param(v) {return _this_.param(v);}\n";
    d += "function b_import(m, f) {_this_.import(m, f);}\n";
    d += "function _start_(p) {\n";
    d += "if (typeof b_receive === 'function') _this_.receiveSignal.connect(b_receive);\n";
    d += "if (typeof b_receivebin === 'function') _this_.receivebinSignal.connect(b_receivebin);\n";
    d += "if (typeof b_hotplug === 'function') _this_.hotPlug.connect(b_hotplug);\n";
    d += "b_start(p);\n";
    d += "}\n";

    d += ldata;

    return d;
}
