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
#include "common/httpsession.h"
#include "common/socket.h"
#include "server/server.h"
#include "server/serversession.h"
#include <QDir>
#include <QNetworkInterface>
#include <QResource>
#include <QSslSocket>
#include <QTimer>
#include <QUdpSocket>

#if !defined NOGUI
#include <QSystemTrayIcon>
#include <QMenu>
#endif

#if !defined QT_NO_PROCESS
#include <QProcess>
#include <csignal>
#endif


Server::Server(QObject *parent) : QObject(parent)
{
    qInfo() << qPrintable("SERVER: Creating");

    m_running = false;

    if (QSslSocket::supportsSsl()) {
        qInfo() << qPrintable("SERVER: SSL supported");
        G_LOCALSETTINGS.set("system.protocol", "https://");
    } else {
        qInfo() << qPrintable("SERVER: SSL not supported");
        G_LOCALSETTINGS.set("system.protocol", "http://");
    }

    m_localdiscovery = G_LOCALSETTINGS.get("system.localdiscovery").toInt();
    m_localdiscovery2 = 2 * m_localdiscovery;
    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");

    QThreadPool::globalInstance()->setThreadPriority(QThread::TimeCriticalPriority);
}


Server::~Server()
{
    qInfo() << qPrintable("SERVER: Quitting");

    QList<QString> sessions = m_sessions.keys();
    for (QString &s : sessions)
        serverSessionClosed(m_sessions.value(s).serversession);

    HttpSession httpsession;
    QEventLoop loop;
    connect(&httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);
    httpsession.post(m_masterserver, "command=update");
    loop.exec();
}


bool Server::running()
{
    return m_running;
}


void Server::start()
{
    QTcpSocket socket;
    socket.connectToHost(G_LOCALHOST, G_LOCALSETTINGS.get("system.tcpport").toInt());

    if (socket.waitForConnected(100)) {
        socket.disconnectFromHost();
        qInfo() << qPrintable("SERVER: Already active");

        if (G_SERVERONLY) {
            emit started();
            return;
        }

        G_CLIENTONLY = true;
    }

    QTimer::singleShot(0, this, &Server::worker);
}


QString Server::checkSettings(const Settings &settings) const
{
    Q_UNUSED(settings)
    return "OK";
}


void Server::cleanKnownSites()
{
    QList<SiteInfo> sites = m_knownsites.values();

    for (SiteInfo &site : sites) {
        if (QDateTime::currentMSecsSinceEpoch() > site.lastseen()) {
            QString siteid = site.config().get("site.id");
            m_socket->removeSession(siteid);
            m_knownsites.remove(siteid);
            qInfo() << qPrintable("SERVER: Lost site " + siteid);
            QList<ActiveSession> sessions = m_sessions.values();
            for (ActiveSession &s : sessions)
                if (s.serversession->siteID() == siteid)
                    serverSessionClosed(s.serversession);
        }
    }
}


QByteArray Server::getDriverApp(const QString &drivername, const QString &app) const
{
    if (app.isEmpty()) {
        if (G_VERBOSE) qInfo() << qPrintable("SERVER: Retrieving driver config for driver " + drivername);
    } else {
        if (G_VERBOSE) qInfo() << qPrintable("SERVER: Retrieving " + app + " app for driver " + drivername);
    }

    QByteArray ret;

    //** Finds the location of the desired driver
    Settings settings;
    settings.loadFile(":/resources/drivers.set");
    settings.loadFile(G_LOCALSETTINGS.localFilePath() + "/custom/drivers.set");

    if (app.isEmpty())
        return settings.extractSettings(drivername).getString().toUtf8();

    QString driverlocation = settings.get(drivername + ".location");
    if (driverlocation.startsWith("custom"))
        driverlocation = G_LOCALSETTINGS.localFilePath() + "/" + driverlocation;
    else
        driverlocation = ":resources/" + driverlocation;

    if (driverlocation.endsWith(".rcc"))
        if (QFile(driverlocation).exists())
            QResource::registerResource(driverlocation, "/" + drivername);

    QString driverapplocation = driverlocation + "/" + app;
    if (!QDir(driverapplocation).exists())
        driverapplocation = ":/" + drivername + "/" + app + ".rcc";

    //** Compiles the resources if needed.
    if (!driverapplocation.isEmpty()) {
        if (!driverapplocation.endsWith(".rcc")) {
            compileRCC(driverapplocation);
            driverapplocation.append(".rcc");
        }

        //** Read the driver file.
        QFile file(driverapplocation);
        if (file.exists()) {
            if (file.open(QIODevice::ReadOnly)) {
                ret = file.readAll();
                file.close();
            }
        }
    }

    QResource::unregisterResource(driverlocation, "/" + drivername);
    return ret;
}


void Server::heartbeat1()
{
    Settings config;
    config.loadSettings(G_LOCALSETTINGS.getSettings("site"));

    Settings devices;
    devices.loadFile(G_LOCALSETTINGS.localFilePath() + "/devices.set");
    devices.clear("config");

    QList<QString> devkeys = devices.keys();

    for(QString &devkey : devkeys)
        if (devkey.contains("allowed")) {
            QString groups = devices.get(devkey);
            if (groups.contains("[all]"))
                devices.set(devkey, "[all]");
            else {
                QList<QString> lallowed;
                QList<QString> lgroups = groups.split(";");
                for (QString &group : lgroups) {
                    QList<QString> lmembers = config.get("site.groups." + group).split(";");
                    for (QString &member : lmembers)
                        if (!lallowed.contains(member))
                            lallowed << member;
                }
                devices.set(devkey, lallowed.join(";"));
            }
        }

    config.loadSettings(devices, "devices");

    QList<ActiveSession> lsessions = m_sessions.values();
    for (ActiveSession &session : lsessions)
        if (session.locked)
            devices.set(session.serversession->deviceID() + ".locked", "true");

    Settings drivers;
    drivers.loadFile(G_LOCALSETTINGS.localFilePath() + "/custom/drivers.set");
    config.loadSettings(drivers, "drivers");

    if (m_socket->UPnPPort() != 0)
        config.set("site.extport", QString::number(m_socket->UPnPPort()));
    else if (G_LOCALSETTINGS.get("site.nat") == "true")
        config.set("site.extport", G_LOCALSETTINGS.get("site.natport"));
    else
        config.set("site.extport", G_LOCALSETTINGS.get("system.tcpport"));

    QString ips;
    QList<QHostAddress> list = QNetworkInterface::allAddresses();
    for (QHostAddress &ip : list)
        if (!ip.isLoopback() && !ip.toString().contains("::") && !ip.toString().startsWith("169.254"))
            ips += ip.toString() + ":" + G_LOCALSETTINGS.get("system.tcpport") + ";";

    config.set("site.localip", ips);
    config.set("site.version", APP_VERSION);
    config.set("site.build", APP_BUILD);
    config.clear("site.groups");
    config.remove("site.nat");
    config.remove("site.natport");
    config.remove("site.remotesetup");
    config.remove("site.upnp");

    if (config.get("site.name").isEmpty())
        config.set("site.name", config.get("site.id"));

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, httpsession, &HttpSession::deleteLater);
    httpsession->postData(m_masterserver, "command=update", config.getString().toUtf8());
}


void Server::heartbeat2()
{
    cleanKnownSites();

    Message message(Message::C_PING, G_LOCALSETTINGS.get("system.tcpport"));
    m_socket->broadcast(message);
}


void Server::messageIn(const Message &message)
{
    Message lmessage(message);

    switch (message.command()) {

    //** message.data() => empty
    case Message::C_GETDEVICES: {
        Settings settings;
        settings.loadFile(G_LOCALSETTINGS.localFilePath() + "/devices.set");
        lmessage.setData(settings.getString());
        emit messageOut(lmessage);
        return;
    }

        //** message.data() => Driver name
    case Message::C_GETDRIVERSERVER: {
        QByteArray driverapp = getDriverApp(lmessage.data(), "server");
        if (!driverapp.isEmpty()) {
            lmessage.setData(driverapp);
            emit messageOut(lmessage);
        }
        return;
    }

    //** message.data() => session id + ...
    default: {
        m_socket->send(message);
    }
    }
}


void Server::postSaveSettings(const Settings &settings0, const Settings &settings) const
{
    Q_UNUSED(settings0)

    if (settings.get("site.upnp") == "true" && m_socket->UPnPPort() == 0)
        m_socket->setUPnP(true);
    else if (settings.get("site.upnp") != "true" && m_socket->UPnPPort() != 0)
        m_socket->setUPnP(false);
}


void Server::serverSessionClosed(ServerSession *serversession)
{
    QString sessionid = serversession->sessionID();

    ActiveSession actsession = m_sessions.value(sessionid);

    if (actsession.isNull()) {
        qInfo() << qPrintable("SERVER: Could not close the server session " + sessionid);
        return;
    }

    qInfo() << qPrintable("SERVER: Closing server session " + sessionid);

    Message message(Message::C_CLOSESESSION);
    message.setSequence(actsession.sequence);
    message.setSiteID(serversession->siteID());
    Address address(actsession.address);
    m_socket->send(message);
    bool locked = actsession.locked;
    m_sessions.remove(sessionid);

    QThread *thread = serversession->thread();
    connect(serversession, &ServerSession::destroyed, thread, &QThread::quit);
    connect(thread, &QThread::finished, thread, &QThread::deleteLater);
    serversession->deleteLater();

    if (locked)
        heartbeat1();
}


void Server::serverSessionError(ServerSession *serversession)
{
    QString sessionid = serversession->sessionID();

    ActiveSession asession = m_sessions.value(sessionid);

    if (asession.isNull())
        return;

    qInfo() << qPrintable("SERVER: Error opening server session " + sessionid);

    Message message(Message::C_OPENSESSION, QByteArray("ERRORSERVER"));
    message.setSequence(asession.sequence);
    message.setSiteID(serversession->siteID());
    Address address(asession.address);
    m_socket->send(message);
    m_sessions.remove(sessionid);
    serversession->deleteLater();
}


void Server::serverSessionInstalled(ServerSession *serversession) const
{
    QString sessionid = serversession->sessionID();

    ActiveSession actsession = m_sessions.value(sessionid);

    Message message(Message::C_OPENSESSION, "OK" + sessionid);
    message.setSequence(m_sessions.value(sessionid).sequence);
    message.setSiteID(serversession->siteID());
    m_socket->send(message);
}


void Server::socketMessageReceived(const Message &message, const Address &address)
{
    Message lmessage(message);

    switch (lmessage.command()) {

        //** message.data() => system.tcpport=<int>\n
        //   Receives a ping request or response from a near server.
        //   Stores the source of the request, including the tcp port used by
        //   the remote site and the additional information that was received.
    case Message::C_PING: {
        QString siteid = lmessage.siteID();
        SiteInfo siteinfo = m_knownsites.value(siteid);

        if (QDateTime::currentMSecsSinceEpoch() + m_localdiscovery2 - siteinfo.lastseen() < 100)
            return;

        QByteArray tcpport = lmessage.data();

        Settings settings;
        settings.set("system.tcpport", tcpport);
        settings.set("site.id", siteid);

        Address newaddress(address.host(), tcpport.toInt());

        siteinfo.setAddress(newaddress);
        siteinfo.setLastSeen(QDateTime::currentMSecsSinceEpoch() + m_localdiscovery2);
        siteinfo.setConfig(settings);

        m_knownsites.insert(siteid, siteinfo);

        return;
    }

    //** message.data() => empty
    //   Replies to a request from another site to get the configuration of the local site.
    case Message::C_GETCONFIG: {
        Settings settings;
        settings.loadSettings(G_LOCALSETTINGS.getSettings("site"));
        lmessage.setData(settings.getString());
        m_socket->send(lmessage, address, Socket::CM_SEARCHLOCAL);
        return;
    }

    //** message.data() => empty
    // Replies to a request to get the list of local devices.
    case Message::C_GETDEVICES: {
        Settings devices;
        devices.loadFile(G_LOCALSETTINGS.localFilePath() + "/devices.set");

        QList<ActiveSession> lsessions = m_sessions.values();
        for (ActiveSession &session : lsessions)
            if (session.locked)
                devices.set(session.serversession->deviceID() + ".locked", "true");

        QList<QString> devids = devices.rootkeys();
        for (QString &devid : devids) {

            if (devices.get(devid + ".mode") == "0" && !address.isLocal())
                devices.clear(devid);
        }

        lmessage.setData(devices.getString());
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => empty
    // Replies to a request to get the list of local drivers.
    case Message::C_GETDRIVERS: {
        Settings localdrivers;
        localdrivers.loadFile(":/resources/drivers.set");
        lmessage.setData(localdrivers.getString());
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => empty
    // Replies to a request to get the list of local custom drivers, if any.
    case Message::C_GETCUSTOMDRIVERS: {
        Settings customdrivers;
        customdrivers.loadFile(G_LOCALSETTINGS.localFilePath() +  "/custom/drivers.set");
        lmessage.setData(customdrivers.getString());
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => empty
    // Replies to a request to get the full configuration of the site.
    case Message::C_GETCONFIGNEAR: {
        Settings config;
        config.loadSettings(G_LOCALSETTINGS.getSettings("site"));

        Settings devices;
        devices.loadFile(G_LOCALSETTINGS.localFilePath() + "/devices.set");
        config.loadSettings(devices, "devices");

        Settings drivers;
        drivers.loadFile(G_LOCALSETTINGS.localFilePath() + "/custom/drivers.set");
        config.loadSettings(drivers, "drivers");

        lmessage.setData(config.getString());
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => site configuration string
    // Receives the new local configuration. This configuration is stored if it is correct.
    // Returns the result of the check.
    case Message::C_SETCONFIG: {
        if (G_VERBOSE) qInfo() << qPrintable("SERVER: Saving site configuration");
        Settings settings0;
        settings0.loadSettings(G_LOCALSETTINGS);

        G_LOCALSETTINGS.loadString(lmessage.data());
        postSaveSettings(settings0, G_LOCALSETTINGS);

        lmessage.setData(QByteArray("OK"));
        m_socket->send(lmessage);

        return;
    }

    //** message.data() => site configuration string
    // Receives the new list of local devices. This configuration is stored.
    // Returns the result of the check.
    case Message::C_SETDEVICES: {
        if (G_VERBOSE) qInfo() << qPrintable("SERVER: Saving devices configuration");
        QFile file(G_LOCALSETTINGS.localFilePath() + "/devices.set");
        if (file.open(QIODevice::WriteOnly | QIODevice::Text)) {
            file.write(lmessage.data(), lmessage.data().size());
            file.close();
            lmessage.setData(QByteArray("OK"));
            heartbeat1();
        } else
            lmessage.setData(QByteArray("ERROR1"));
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => Driver name
    //   Returns the binary for the config app for the given driver.
    case Message::C_GETDRIVERCONFIG: {
        QByteArray driverapp = getDriverApp(lmessage.data(), "config");

        if (!driverapp.isEmpty()) {
            lmessage.setData(driverapp);
            m_socket->send(lmessage);
        }
        return;
    }

    //** message.data() => Driver name
    //   Returns the binary for the client app for the given driver.
    case Message::C_GETDRIVERCLIENT: {
        QByteArray driverapp = getDriverApp(lmessage.data(), "client");

        if (!driverapp.isEmpty()) {
            lmessage.setData(driverapp);
            m_socket->send(lmessage);
        }
        return;
    }

    //** message.data() => empty
    //   Returns a list of sites discovered by the server.
    case Message::C_GETKNOWNSITES: {
        Settings knownsites;
        QList<SiteInfo> sites = m_knownsites.values();

        for (SiteInfo &site : sites)
            if (QDateTime::currentMSecsSinceEpoch() < site.lastseen())
                knownsites.set(site.config().get("site.id"), site.address().fullAddress());

        knownsites.set(G_SITEID, Address(G_LOCALHOST, 0).fullAddress());

        lmessage.setData(knownsites.getString());
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => deviceid=<Device ID>;version=<client app version>
    //   Opens a new session based on the local device received.
    case Message::C_OPENSESSION: {
        Settings clientsettings;
        clientsettings.loadString(lmessage.data());
        QString deviceid = clientsettings.get("deviceid").toUtf8();
        Settings devices;
        devices.loadFile(G_LOCALSETTINGS.localFilePath() + "/devices.set");
        QString driver = devices.get(deviceid + ".driver").toUtf8();
        Settings driverconfig;
        driverconfig.loadString(getDriverApp(driver, ""));

        if (verToInt(driverconfig.get("minimumversion")) > verToInt(clientsettings.get("version"))) {
            lmessage.setData(QByteArray("ERRORWRONGVERSION"));
            m_socket->send(lmessage);
            return;
        }

        QList<ActiveSession> lsessions = m_sessions.values();
        for (ActiveSession &session : lsessions)
            if (session.serversession->deviceID() == deviceid) {
                if (driverconfig.get("multiuser") != "true") {
                    lmessage.setData(QByteArray("ERRORSERVERINUSE"));
                    m_socket->send(lmessage);
                    return;
                }
            }

        ServerSession *serversession = new ServerSession(lmessage.siteID(), deviceid);
        QThread *thread = new QThread();
        serversession->moveToThread(thread);
        thread->start();

        if (G_VERBOSE) qInfo() << qPrintable("SERVER: Opening server session " + serversession->sessionID());

        ActiveSession asession;
        asession.address = address;
        asession.serversession = serversession;
        asession.sequence = lmessage.sequence();
        asession.locked = (driverconfig.get("multiuser") != "true");

        m_sessions.insert(serversession->sessionID(), asession);

        connect(serversession, &ServerSession::started, this, &Server::serverSessionInstalled);
        connect(serversession, &ServerSession::error, this, &Server::serverSessionError);
        connect(serversession, &ServerSession::closed, this, &Server::serverSessionClosed);
        connect(serversession, &ServerSession::messageOut, this, &Server::messageIn);
        connect(this, &Server::messageOut, serversession, &ServerSession::messageIn);

        serversession->start();

        if (asession.locked)
            heartbeat1();

        return;
    }

    //** message.data() => Session ID
    //   Closes the session which ID has been provided.
    case Message::C_CLOSESESSION: {
        QString sessionid = lmessage.data();
        if (m_sessions.contains(sessionid))
            serverSessionClosed(m_sessions.value(sessionid).serversession);
        return;
    }

    //** message.data() => <command>\n<param>
    //   Retrieves information from the local box
    case Message::C_REMOTEBOX: {
        QByteArray data = lmessage.data();
        qsizetype pos = data.indexOf('\n');
        if (pos < 0)
            return;

        QString ret = G_BOX->function(data.first(pos), data.sliced(pos + 1));
        lmessage.setData(ret);
        m_socket->send(lmessage);
        return;
    }

    //** message.data() => Virtual device name
    //   Unregister if device name starts with '*'
    case Message::C_VIRTUALDEV: {
        QString devname = lmessage.data();
        if (devname.startsWith("*"))
            G_BOX->virtualDevices()->removeOne(devname.sliced(1));
        else
            G_BOX->virtualDevices()->append(devname);

        // Informs all active session of the change
        QList<QString> sessionids = m_sessions.keys();
        for (QString &sessionid : sessionids) {
            lmessage.setSiteID(m_sessions.value(sessionid).serversession->siteID());
            lmessage.setData(sessionid);
            m_socket->send(lmessage);
        }
        return;
    }

    //** Otherwise forwards the message to the connected objects. This happens
    //   when a APPDATA or APPDATABIN command is received.
    default: {
        emit messageOut(lmessage);
        return;
    }
    }
}


void Server::worker()
{
    if (G_CLIENTONLY) {
        m_running = true;
        emit started();
        return;
    }

    qInfo() << qPrintable("SERVER: Starting server");

    G_SITEID = G_LOCALSETTINGS.get("site.id");

    m_knownsites.clear();
    m_sessions.clear();

    m_socket = new Socket(this);
    connect(m_socket, &Socket::UPnPInstalled, this, &Server::heartbeat1);

    for (int i = 0; i < 3; ++i) {
        m_socket->install(Socket::ST_server);
        if (m_socket->status() == Socket::SS_ok)
            break;
        QThread::msleep(G_LOCALSETTINGS.get("system.serverretry").toUInt());
    }

    if (m_socket->status() == Socket::SS_error) {
        qInfo() << qPrintable("SERVER: Server cannot start");
        m_socket->deleteLater();

        emit started();
        return;
    }

    connect(m_socket, &Socket::messageReceived, this, &Server::socketMessageReceived);

    m_timer1 = new QTimer(this);
    connect(m_timer1, &QTimer::timeout, this, &Server::heartbeat1);
    m_timer1->start(G_LOCALSETTINGS.get("system.masterserverupdate").toInt());
    heartbeat1();

    m_timer2 = new QTimer(this);
    connect(m_timer2, &QTimer::timeout, this, &Server::heartbeat2);
    m_timer2->start(m_localdiscovery);
    heartbeat2();

    m_running = true;
    emit started();

    qInfo() << qPrintable("SERVER: Server started");

#if !defined NOGUI && !defined QT_NO_PROCESS
    if (G_SERVERONLY) {
        QMetaObject::invokeMethod(qApp, [&]() {
            QAction *openAction = new QAction(tr("Open client"), this);
            connect(openAction, &QAction::triggered, this, [=]() {
                QProcess::startDetached(qApp->applicationFilePath());
            });

            QAction *closeAction = new QAction(tr("Close server"), this);
            connect(closeAction, &QAction::triggered, this, [=]() {
                raise(SIGINT);
            });

            QMenu *systemmenu = new QMenu("niliBOX");
            systemmenu->addAction(openAction);
            systemmenu->addSeparator();
            systemmenu->addAction(closeAction);
            systemmenu->setStyleSheet("QMenu::separator{height:1px;background:lightgrey;margin-left:5px;margin-right:5px}");

            QSystemTrayIcon *systemtray = new QSystemTrayIcon(this);

            systemtray->setIcon(QIcon(":/resources/icon.png"));
            systemtray->setToolTip(qApp->applicationName());
            systemtray->setContextMenu(systemmenu);
            systemtray->show();
        });
    }
#endif
}
