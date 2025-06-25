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

#include "client/client.h"
#include "common/httpsession.h"
#include "common/socket.h"
#include <QDir>
#include <QNetworkInformation>
#include <QTimer>


Client::Client(QObject *parent) : QObject(parent)
{
    m_socket = nullptr;

    if (G_SERVERONLY)
        return;

    qInfo() << qPrintable("CLIENT: Creating");

    m_localtimeout = G_LOCALSETTINGS.get("system.localdiscovery").toInt();
    m_localtimeout2 = 2 * m_localtimeout;
    m_remotetimeout = G_LOCALSETTINGS.get("system.remotediscovery").toInt();
    m_remotetimeout2 = 2 * m_remotetimeout;
    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");
    m_getpublicsites = false;
    m_openingapp = false;

    connect(this, &Client::messageIn, this, &Client::processMessageIn);
}


Client::~Client()
{
    qInfo() << qPrintable("CLIENT: Quitting");
}


void Client::start()
{
    QTimer::singleShot(0, this, &Client::worker);
}


void Client::cleanKnownSites()
{
    QList<SiteInfo> sites = m_knownsites.values();

    for (SiteInfo &site : sites)
        if (QDateTime::currentMSecsSinceEpoch() > site.lastseen()) {
            QString siteid = site.config().get("site.id");
            m_socket->removeSession(siteid);
            m_knownsites.remove(siteid);
            if (site.config().get("site.islocal") == "true")
                qInfo() << qPrintable("CLIENT: Lost site " + siteid);
        }
}


void Client::heartbeat1()
{
    if (!m_getpublicsites)
        return;

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, &Client::httpSessionFinished1);
    httpsession->post(m_masterserver, "command=getpublicsites");
}


void Client::heartbeat2()
{
    cleanKnownSites();

    if (m_localdrivers.isEmpty()) {
        Message message(Message::C_GETDRIVERS);
        message.setSiteID(G_SITEID);
        Address address(G_LOCALHOST, 0);
        m_socket->send(message, address, Socket::CM_SEARCHLOCAL);
    }

    Message message(Message::C_GETKNOWNSITES);
    message.setSiteID(G_SITEID);
    Address address(G_LOCALHOST, 0);
    m_socket->send(message, address, Socket::CM_SEARCHLOCAL);
}


void Client::httpSessionFinished1(HttpSession *httpsession)
{
    if (!httpsession)
        return;

    Settings sites;
    sites.loadString(httpsession->data());

    SiteInfo siteinfo;
    QList<QString> siteids = sites.rootkeys();

    if (siteids.count() != m_knownsites.count())
        if (G_VERBOSE) qInfo() << qPrintable("CLIENT: Received list of " + QString::number(siteids.count()) + " public sites");

    for (QString &siteid : siteids) {
        bool update = true;
        SiteInfo site = m_knownsites.value(siteid);
        if (!site.isNull())
            if (site.config().get("site.islocal") == "true")
                update = false;

        if (update) {
            Settings site = sites.extractSettings(siteid);
            siteinfo.setConfig(site.getSettings("site"));
            siteinfo.setDrivers(site.extractSettings("drivers"));
            siteinfo.setDevices(site.extractSettings("devices"));
            siteinfo.setLastSeen(QDateTime::currentMSecsSinceEpoch() + m_remotetimeout2);
            siteinfo.setAddress(Address(QHostAddress(site.get("site.ip")), 0));
            m_knownsites.insert(siteid, siteinfo);
        }
    }

    httpsession->deleteLater();
}


void Client::httpSessionFinished2(HttpSession *httpsession)
{
    if (!httpsession)
        return;

    Settings settings;
    settings.loadString(httpsession->data());

    Message message(Message::C_GETCONFIGFULL, httpsession->data());
    message.setSiteID(settings.get("site.id"));
    message.setSequence(httpsession->sequence());
    emit messageOut(message);

    httpsession->deleteLater();
}


void Client::processMessageIn(const Message &message)
{
    Message lmessage(message);

    switch (lmessage.command()) {

        //** message.data() => empty
        case Message::C_GETDRIVERS: {
            lmessage.setData(m_localdrivers.getString());
            emit messageOut(lmessage);
            return;
        }

        //** message.data() => site ID
        case Message::C_GETCONFIGFULL: {
            QString siteid = lmessage.data();
            SiteInfo site = m_knownsites.value(siteid);

            if (!site.isNull()) {
                Settings siteinfo;
                siteinfo.loadSettings(site.config());
                siteinfo.loadSettings(site.devices(), "devices");
                siteinfo.loadSettings(site.drivers(), "drivers");
                siteinfo.loadSettings(m_localdrivers, "drivers");
                lmessage.setData(siteinfo.getString());
                emit messageOut(lmessage);
            } else {
                HttpSession *httpsession = new HttpSession(this);
                connect(httpsession, &HttpSession::finished, this, &Client::httpSessionFinished2);
                httpsession->post(m_masterserver, "command=getremotesite&siteid=" + siteid, lmessage.sequence());
            }

            return;
        }

        //** message.data() => empty
        case Message::C_GETSITESBASIC: {
            Settings nearsites;
            QList<SiteInfo> sites = m_knownsites.values();

            for (SiteInfo &site : sites) {
                Settings siteinfo;
                siteinfo.loadSettings(site.config());
                QString siteid = siteinfo.get("site.id");
                if (siteid == G_SITEID || ((siteinfo.get("site.remotesetup") != "0" && siteinfo.get("site.islocal") == "true") && QDateTime::currentMSecsSinceEpoch() < site.lastseen()))
                    nearsites.loadSettings(siteinfo, siteid);
            }

            lmessage.setData(nearsites.getString());
            emit messageOut(lmessage);
            return;
        }

        //** message.data() => empty
        case Message::C_GETSITESFULL: {
            Settings allsites;
            QList<SiteInfo> sites = m_knownsites.values();

            for (SiteInfo &site : sites) {
                Settings siteinfo;
                siteinfo.loadSettings(site.config().getSettings("site"));
                QString siteid = siteinfo.get("site.id");
                if ((siteid == G_SITEID || siteinfo.get("site.remotesetup") != "0") && QDateTime::currentMSecsSinceEpoch() < site.lastseen()) {
                    allsites.loadSettings(siteinfo, siteid);
                    siteinfo.clear();
                    siteinfo.loadSettings(site.devices());
                    siteinfo.clear(".config.");
                    allsites.loadSettings(siteinfo, siteid + ".devices");
                    siteinfo.clear();
                    siteinfo.loadSettings(site.drivers());
                    allsites.loadSettings(siteinfo, siteid + ".drivers");
                }
            }

            lmessage.setData(allsites.getString());
            emit messageOut(lmessage);
            return;
        }

        //** message.data() => empty
        case Message::C_REFRESH: {
            heartbeat1();
            return;
        }

        //** message.data() => true | false
        case Message::C_PUBLICSITES: {
            m_getpublicsites = message.data() == "true";
            heartbeat1();
            return;
        }

        //** message.data() => empty
        case Message::C_OPENSESSION: {
            QString siteid = message.siteID();
            Address address = m_knownsites.value(siteid).address();
            if (m_socket->send(message, address, Socket::CM_SEARCHGLOBAL))
                return;
            if (G_VERBOSE) qInfo() << qPrintable("CLIENT: Error sending to site " + siteid);

            Message lmessage(message);
            lmessage.setData(QByteArray("ERRORSERVER"));
            emit messageOut(lmessage);
            return;
        }

        //** message.data() => "START", "OK", "ERROR"
        case Message::C_OPENAPP: {
            m_openingapp = message.data() == "START";
            return;
        }

        //** If none of the above, then sends the message to the concerned server
        default: {
            if (m_socket->send(message))
                return;

            QString siteid = message.siteID();
            m_socket->removeSession(siteid);
            if (G_VERBOSE) qInfo() << qPrintable("CLIENT: Error sending to site " + siteid);
            return;
        }
    }
}


void Client::socketMessageReceived(const Message &message, const Address &address)
{
    switch (message.command()) {

        //** message.data() => site info
        //   message.ID() = site id
        //   Receives basic info from a near server. The information is stored in
        //   "knownsites". Then sends a request for available devices on that server.
        case Message::C_GETCONFIG: {
        QString siteid = message.siteID();
            Settings info;

            info.loadString(message.data());

            bool newsite = true;
            SiteInfo site = m_knownsites.value(siteid);
            if (!site.isNull())
                if (site.config().get("site.islocal") == "true")
                    newsite = false;

            if (newsite)
                qInfo() << qPrintable("CLIENT: Discovered site " + siteid);

            info.set("site.islocal", "true");

            SiteInfo siteinfo = m_knownsites.value(siteid);
            siteinfo.setConfig(info);
            siteinfo.setAddress(address);
            siteinfo.setLastSeen(QDateTime::currentMSecsSinceEpoch() + m_localtimeout2);
            m_knownsites.insert(siteid, siteinfo);

            Message lmessage(message);
            lmessage.setMessage(Message::C_GETDEVICES);
            m_socket->send(lmessage);
            return;
        }

        //** message.data() => site devices
        //   message.ID() = site id
        //   Receives devices info from a near server. The information is stored in
        //   "knownsites". Then sends a request for custom drivers on that server.
        case Message::C_GETDEVICES: {
            SiteInfo siteinfo = m_knownsites.value(message.siteID());
            if (!siteinfo.isNull()) {
                Settings info;
                info.loadString(message.data());
                siteinfo.setDevices(info);
                m_knownsites.insert(message.siteID(), siteinfo);

                Message lmessage(message);
                lmessage.setMessage(Message::C_GETCUSTOMDRIVERS);
                m_socket->send(lmessage);

                if (!m_favorites.isEmpty()) {
                    QList<QString> devices = info.rootkeys();
                    QString deviceid;
                    for (QString &device : devices) {
                        deviceid = message.siteID() + device;
                        if (m_favorites.contains(deviceid)) {
                            qInfo() << qPrintable("CLIENT: Opening automatic app " + deviceid);
                            m_favorites.removeOne(deviceid);
                            lmessage.setMessage(Message::C_OPENAPP, deviceid);
                            emit messageOut(lmessage);
                        }
                    }
                }
            }
            return;
        }

        //** message.data() => local drivers
        //   Stores the local drivers
        case Message::C_GETDRIVERS: {
            m_localdrivers.loadString(message.data());
            qInfo() << qPrintable("CLIENT: Received list of " + QString::number(m_localdrivers.rootkeys().count()) + " drivers");
            return;
        }

        //** message.data() => site custom drivers
        //   message.ID() = site id
        //   Receives custom drivers from a near server. The information is stored in
        //   "knownsites".
        case Message::C_GETCUSTOMDRIVERS: {
            SiteInfo siteinfo = m_knownsites.value(message.siteID());
            if (!siteinfo.isNull()) {
                Settings info;
                info.loadString(message.data());
                siteinfo.setDrivers(info);
                m_knownsites.insert(message.siteID(), siteinfo);
            }
            return;
        }

        //** message.data() => sites discovered by the local server
        //   The format is <siteid>=<address>;<siteid>=<address>;...
        //   Sends a request for config to all the known sites.
        case Message::C_GETKNOWNSITES: {
            Settings sites;
            sites.loadString(message.data());
            QList<QString> siteids = sites.rootkeys();
            for (QString &siteid : siteids) {
                Message lmessage(Message::C_GETCONFIG);
                lmessage.setSiteID(siteid);
                Address address;
                address.setFulladdress(sites.get(siteid));
                m_socket->send(lmessage, address, Socket::CM_SEARCHLOCAL);
            }
            return;
        }

        //** In case of the application being suspended or inactive (iOS and Android),
        //   captures the watchdog from the server and simulates that the client is alive.
        //   It does the same if a module is loading, to avoid server timeouts in slow computers.
        case Message::C_APPWATCHDOG: {
#if defined OS_IOS || defined OS_ANDROID
            if (qApp->applicationState() != Qt::ApplicationActive) {
                m_socket->send(message);
                return;
            }
#endif
            if (m_openingapp) {
                m_socket->send(message);
                return;
            }
        }

        default: {
            emit messageOut(message);
            return;
        }
    }
}


void Client::worker()
{
    if (G_SERVERONLY) {
        emit started();
        return;
    }

    qInfo() << qPrintable("CLIENT: Starting client");

    G_SITEID = G_LOCALSETTINGS.get("site.id");
    G_CLIENTID = newID();

    m_socket = new Socket(this);
    m_socket->install(Socket::ST_client);

    if (m_socket->status() != Socket::SS_ok) {
        emit started();
        return;
    }

    connect(m_socket, &Socket::messageReceived, this, &Client::socketMessageReceived);

    m_knownsites.clear();

    m_timer1 = new QTimer(this);
    connect(m_timer1, &QTimer::timeout, this, &Client::heartbeat1);
    m_timer1->start(m_remotetimeout);
    heartbeat1();

    m_timer2 = new QTimer(this);
    connect(m_timer2, &QTimer::timeout, this, &Client::heartbeat2);
    m_timer2->start(m_localtimeout);
    heartbeat2();

    Settings def;
    def.loadSettings(G_LOCALSETTINGS.extractSettings("ui.favdef"));
    QList<QString> keys = def.rootkeys();
    for (QString &key : keys)
        if (G_LOCALSETTINGS.get("ui.favdef." + key) == "true")
            m_favorites.append(G_LOCALSETTINGS.get("ui.favdid." + key));

    emit started();

    qInfo() << qPrintable("CLIENT: Client started");
}
