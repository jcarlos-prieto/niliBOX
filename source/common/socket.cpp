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

#include "common/httpsession.h"
#include "common/session.h"
#include "common/socket.h"
#include "common/upnp.h"
#include <QDateTime>
#include <QLocalServer>
#include <QLocalSocket>
#include <QNetworkDatagram>
#include <QNetworkInformation>
#include <QNetworkInterface>
#include <QRandomGenerator>
#include <QTcpServer>
#include <QTcpSocket>
#include <QThread>
#include <QTimer>
#include <QUdpSocket>

#define SEPARATOR "!@@@@#@@@@!"


Socket::Socket(QObject *parent) : QObject(parent)
{
    m_active = false;
    m_tcpport = G_LOCALSETTINGS.get("system.tcpport").toInt();
    m_localhost = Address(G_LOCALHOST, 0);
    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");
    m_masteraddress = Address(G_LOCALSETTINGS.get("system.masterserver"), G_LOCALSETTINGS.get("system.masterservertcpport").toInt());
    m_localtimeout = G_LOCALSETTINGS.get("system.localtimeout").toInt();
    m_remotetimeout = G_LOCALSETTINGS.get("system.remotetimeout").toInt();
    m_upnp = nullptr;
    m_httpsession = new HttpSession(this);
    m_httpsession2 = new HttpSession(this);
    m_httpsession2->setTimeout(G_LOCALSETTINGS.get("system.masterserverkeepalive").toUInt());
    connect(m_httpsession2, &HttpSession::finished, this, &Socket::serverKeepAliveHandle);
}


Socket::~Socket()
{
    uninstall();
}


void Socket::broadcast(const Message &message)
{
    if (!m_active)
        return;

    Message lmessage(message);
    lmessage.setSiteID(m_type == ST_server ? G_SITEID : G_CLIENTID);

    QUdpSocket socket;

    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
    for (QNetworkInterface &interface : interfaces) {
        if (!(interface.flags() & QNetworkInterface::IsUp) ||
            !(interface.flags() & QNetworkInterface::IsRunning) ||
            !(interface.flags() & QNetworkInterface::CanBroadcast))
            continue;

        QList<QNetworkAddressEntry> addressentries = interface.addressEntries();
        for (QNetworkAddressEntry &addressentry : addressentries) {
            QHostAddress broadcastaddress = addressentry.broadcast();
            if (broadcastaddress.isNull())
                continue;
            socket.writeDatagram(lmessage.datagram(), broadcastaddress, m_tcpport);
        }
    }

    for (QHostAddress &address : m_bcasthelp)
        socket.writeDatagram(lmessage.datagram(), address, m_tcpport);
}


void Socket::install(const SocketType &type)
{
    if (m_active)
        return;

    m_type = type;

    if (m_type == ST_server)
        m_typestr = "SRV";
    else
        m_typestr = "CLI";

    m_sessions.clear();
    m_status = Socket::SS_error;

    if (m_type == ST_server) {
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Opening server socket");

        m_localserver = new QLocalServer(this);
        m_localserver->setSocketOptions(QLocalServer::WorldAccessOption);
        connect(m_localserver, &QLocalServer::newConnection, this, &Socket::localServerNewConnection);
        QLocalServer::removeServer("niliBOX");
        if (m_localserver->listen("niliBOX")) {
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Installed local listener");
        } else {
            qInfo() << qPrintable("SOCKET-" + m_typestr + ": Could not install local listener");
            m_localserver->deleteLater();
            return;
        }

        m_tcpserver = new QTcpServer(this);
        connect(m_tcpserver, &QTcpServer::newConnection, this, &Socket::TCPServerNewConnection);

        if (m_tcpserver->listen(QHostAddress::Any, m_tcpport)) {
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Installed TCP listener on port " + QString::number(m_tcpport));
        } else {
            qInfo() << qPrintable("SOCKET-" + m_typestr + ": Could not install TCP listener on port " + QString::number(m_tcpport));
            m_tcpserver->deleteLater();
            return;
        }

        if (G_LOCALSETTINGS.get("site.upnp") == "true") {
            m_upnp = new UPnP(this);
            connect(m_upnp, &UPnP::installed, this, &Socket::UPnPInstalled);
            m_upnp->install();
        }

        m_udpserver4 = new QUdpSocket(this);
        m_udpserver6 = new QUdpSocket(this);

        bool udpserver = false;
        if (m_udpserver4->bind(QHostAddress::AnyIPv4, m_tcpport, QUdpSocket::ReuseAddressHint)) {
            connect(m_udpserver4, &QUdpSocket::readyRead, this, &Socket::UDP4SocketReadyRead);
            udpserver = true;
        }

        if (m_udpserver6->bind(QHostAddress::AnyIPv6, m_tcpport, QUdpSocket::ReuseAddressHint)) {
            connect(m_udpserver6, &QUdpSocket::readyRead, this, &Socket::UDP6SocketReadyRead);
            udpserver = true;
        }

        if (udpserver) {
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Installed UDP listener on port " + QString::number(m_tcpport));
        } else {
            qInfo() << qPrintable("SOCKET-" + m_typestr + ": Could not install UDP listener on port " + QString::number(m_tcpport));
            m_tcpserver->deleteLater();
            if (m_upnp) m_upnp->deleteLater();
            m_localserver->deleteLater();
            m_udpserver4->deleteLater();
            m_udpserver6->deleteLater();
            return;
        }

        serverKeepAliveSend();

    } else if (m_type == ST_client)
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Opening client socket");

    m_status = SS_ok;
    m_active = true;
    emit installed();
}


void Socket::removeSession(const QString &siteid)
{
    Session *session = m_sessions.value(siteid);

    if (!session)
        return;

    m_sessions.remove(siteid);

    session->deleteLater();

    QList<QString> ids = m_sessions.keys();
    for (QString &id : ids) {
        session = m_sessions.value(id);
        if (session->master())
            if (session->master()->siteID() == siteid)
                removeSession(id);
    }
}


bool Socket::send(const Message &message, const Address &address, const ConnectionMode mode)
{
    if (!m_active)
        return false;

    QString siteid = message.siteID();

    Session *session = findSession(siteid, address, mode);

    if (!session)
        return false;

    Message lmessage(message);
    lmessage.setSiteID(m_type == ST_server ? G_SITEID : G_CLIENTID);
    lmessage.setOrigin(m_type == ST_server ? Message::MO_server : Message::MO_client);

    switch (session->type()) {
    case Session::ST_CBACKCLI:
        lmessage.setMetaCommand(Message::C_CBACKDATA);
        lmessage.setMetaSiteID(siteid);
        return session->write(lmessage);

    case Session::ST_CBACKSRV:
        lmessage.setMetaCommand(Message::C_CBACKDATA);
        lmessage.setMetaSiteID(session->metaSiteID());
        return session->write(lmessage);

    case Session::ST_TCP:
        lmessage.setMetaCommand(Message::C_TCPDATA);
        lmessage.setMetaSiteID(siteid);
        return session->write(lmessage);

    case Session::ST_HTTP:
        if (session->metaSiteID().isEmpty())
            m_httpsession->postData(m_masterserver, "command=httpdata&siteid=" + siteid, lmessage.datagram());
        else {
            lmessage.setMetaSiteID(siteid);
            m_httpsession->postData(m_masterserver, "command=httpdata&siteid=" + session->metaSiteID(), lmessage.datagram());
        }

        if (m_httpsession->data() == "ERROR") {
            removeSession(siteid);
            return false;
        } else
            return true;

    default:
        if (lmessage.command() == Message::C_CBACK && session->type() == Session::ST_LOCAL) {
            session->setType(Session::ST_CBACKSRV);
            QString client = lmessage.metaSiteID();
            session->setMetaSiteID(client);
        }

        return session->write(lmessage);
    }
}


Socket::SocketStatus Socket::status() const
{
    return m_status;
}


void Socket::setUPnP(bool set)
{
    if (set) {
        if (!m_upnp) {
            m_upnp = new UPnP(this);
            connect(m_upnp, &UPnP::installed, this, &Socket::UPnPInstalled);
        }
        m_upnp->install();
    } else
        m_upnp->uninstall();
}


void Socket::uninstall()
{
    if (!m_active)
        return;

    m_active = false;

    if (m_type == ST_server) {
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Closing server socket");

        m_tcpserver->deleteLater();
        m_localserver->deleteLater();
        m_udpserver4->deleteLater();
        m_udpserver6->deleteLater();

        if (m_upnp)
            m_upnp->deleteLater();

    } else if (m_type == ST_client)
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Closing client socket");

    QList<QString> siteids = m_sessions.keys();
    for (QString &siteid : siteids)
        removeSession(siteid);

    emit uninstalled();
}


int Socket::UPnPPort() const
{
    if (m_upnp)
        return m_upnp->port();
    else
        return 0;
}


void Socket::addSession(const QString siteid, Session *session)
{
    session->setSiteID(siteid);

    Session *s = m_sessions.value(siteid);

    if (s == session)
        return;

    if (s)
        removeSession(siteid);

    m_sessions.insert(siteid, session);
}


Session *Socket::findSession(const QString &siteid, const Address &address, const ConnectionMode mode)
{
    Session *session = m_sessions.value(siteid);

    if (session && address.port() != 0) {
        if (session->address().port() != address.port()) {
            removeSession(siteid);
            session = nullptr;
        }
    }

    if (session && mode != CM_NOSEARCH) {
        bool valid = false;

        switch (session->type()) {
        case Session::ST_SELF:
            if (session->localSocket())
                if (session->localSocket()->state() == QLocalSocket::ConnectedState)
                    valid = true;
            break;

        case Session::ST_LOCAL:
        case Session::ST_DIRECT:
        case Session::ST_CBACKSRV:
        case Session::ST_THP:
            if (session->tcpSocket())
                if (session->tcpSocket()->state() == QTcpSocket::ConnectedState)
                    valid = true;
            break;

        case Session::ST_CBACKCLI: {
            Message message(Message::C_TESTCBACK);
            message.setSiteID(G_SITEID);
            message.setMetaSiteID(siteid);

            QEventLoop loop;
            connect(this, &Socket::test, this, [&valid, &loop](bool success) {
                valid = success;
                loop.quit();
            });

            send(message);
            loop.exec();
            break;
        }

        case Session::ST_TCP:
            valid = true;
            break;

        case Session::ST_HTTP:
            QEventLoop loop;
            connect(m_httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);
            m_httpsession->post(m_masterserver, "command=http&siteid=" + siteid + "&client=" + G_CLIENTID);
            loop.exec();
            disconnect(m_httpsession);

            if (m_httpsession->data() == "OK")
                valid = true;

            break;
        }

        if (!valid) {
            removeSession(siteid);
            session = nullptr;
        }
    }

    if (!session && mode != CM_NOSEARCH) {
        bool success = false;

        if (!success)
            success = trySELF(siteid, address);

        if (!success)
            success = tryLOCAL(siteid, address);

        if (!success && mode != CM_SEARCHLOCAL)
            success = tryDIRECT(siteid);

        if (!success && mode != CM_SEARCHLOCAL)
            success = tryCBACK(siteid);

        if (!success && mode != CM_SEARCHLOCAL)
            success = tryTHP(siteid);

        if (!success && mode != CM_SEARCHLOCAL)
            success = tryTCP(siteid);

        if (!success && mode != CM_SEARCHLOCAL)
            success = tryHTTP(siteid);

        if (success)
            session = m_sessions.value(siteid);
    }

    return session;
}


void Socket::localSessionReadyMessage(Session *session, const Message &message)
{
    QString siteid = message.siteID();

    if (!m_sessions.contains(siteid)) {
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Accepted SELF connection from " + siteid);
        session->setType(Session::ST_SELF);
        G_CONN.insert(siteid, "SELF");
    }

    processMessage(message, session);
}


void Socket::localServerNewConnection()
{
    while (m_localserver->hasPendingConnections()) {
        Session *session = new Session();
        session->setLocalSocket(m_localserver->nextPendingConnection());
        connect(session, &Session::readyMessage, this, &Socket::localSessionReadyMessage);
    }
}


void Socket::processMessage(const Message &message, Session *session)
{
    Message lmessage(message);
    QString siteid = lmessage.siteID();

    addSession(siteid, session);

    switch (lmessage.metaCommand()) {
    case Message::C_CBACKDATA:
        lmessage.setMetaCommand(Message::C_NULL);
        if (lmessage.origin() == Message::MO_client) {
            lmessage.setSiteID(lmessage.metaSiteID());
            if (!send(lmessage)) {
                removeSession(lmessage.siteID());
                lmessage.setCommand(Message::C_CBACKERROR);
                lmessage.setData(lmessage.siteID());
                lmessage.setSiteID(G_CLIENTID);
                send(lmessage);
            }
        } else {
            lmessage.setSiteID(lmessage.metaSiteID());
            send(lmessage);
        }
        return;

    case Message::C_TCPDATA:
        lmessage.setMetaCommand(Message::C_NULL);
        emit messageReceived(lmessage, Address());
        return;

    case Message::C_HTTPDATA:
        lmessage.setMetaCommand(Message::C_NULL);
        lmessage.setSiteID(lmessage.metaSiteID());
        emit messageReceived(lmessage, Address());
        return;

    default:
        break;
    }

    switch (lmessage.command()) {
    case Message::C_CBACK:
        if (m_type == ST_server) {
            lmessage.setSiteID(lmessage.metaSiteID());
            lmessage.setMetaSiteID(siteid);
            send(lmessage);
        } else {
            siteid = lmessage.metaSiteID();
            Session *newsession = new Session(session);
            newsession->setType(Session::ST_CBACKCLI);
            connect(newsession, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
            addSession(siteid, newsession);
            G_CONN.insert(siteid, "CBACK");
            emit CBACKInitReceived();
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established CBACK connection with site " + siteid);
        }
        return;

    case Message::C_TCP:
        if (lmessage.data().startsWith("OK")) {
            siteid = lmessage.data().sliced(2);
            Session *newsession = new Session(session);
            newsession->setType(Session::ST_TCP);
            connect(newsession, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
            addSession(siteid, newsession);
            G_CONN.insert(siteid, "TCP");
            emit TCPInitReceived();
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established TCP connection with site " + siteid);
        }
        return;

    case Message::C_CBACKERROR:
    case Message::C_TCPERROR:
        removeSession(message.data());
        return;

    case Message::C_TESTCBACK: {
        if (lmessage.origin() == Message::MO_client) {
            QString siteid = lmessage.metaSiteID();
            Session *session = m_sessions.value(siteid);

            bool success = false;
            if (session)
                if (session->tcpSocket())
                    if (session->tcpSocket()->state() == QTcpSocket::ConnectedState)
                        success = true;

            if (success)
                lmessage.setData(QByteArray("OK"));
            else {
                lmessage.setData(QByteArray("ERROR"));
                removeSession(siteid);
            }

            send(lmessage);
        } else
            emit test(lmessage.data() == "OK");
    }

    default:
        emit messageReceived(lmessage, session->address());
        return;
    }
}


void Socket::receiveUDP(QUdpSocket *socket)
{
    if (socket->state() != QAbstractSocket::BoundState)
        return;

    while (socket->hasPendingDatagrams()) {
        QNetworkDatagram datagram = socket->receiveDatagram();
        if (datagram.isValid()) {
            QByteArray data = datagram.data();
            Message message;
            message.setDatagram(data);
            if (message.command() != Message::C_NULL) {
                Address address(datagram.senderAddress(), datagram.senderPort());
                emit messageReceived(message, address);

                // Little trick to help the discovery when UDP broadcast is not bidirectional
                // (case of virtual machines sharing network interface with the host)
                if (!address.isLocal() && !m_bcasthelp.contains(address.host()))
                    m_bcasthelp.append(address.host());
            }
        }


        if (socket->state() != QUdpSocket::BoundState)
            break;
    }
}


void Socket::serverKeepAliveHandle(HttpSession *httpsession)
{
    if (httpsession->error()) {
        QTimer::singleShot(G_LOCALSETTINGS.get("system.masterserverretry").toUInt(), this, &Socket::serverKeepAliveSend);
        return;
    }

    serverKeepAliveSend();

    QByteArray hdata = httpsession->data();
    QList<QByteArray> ldata;
    QByteArray data;

    qsizetype start = 0;
    qsizetype index = 0;

    while ((index = hdata.indexOf(SEPARATOR, start)) != -1) {
        ldata << hdata.mid(start, index - start);
        start = index + QByteArray(SEPARATOR).length();
    }

    ldata.append(hdata.mid(start));

    while (!ldata.isEmpty()) {
        data = ldata.takeFirst();

        if (data.startsWith("DIRECT\n")) {
            QString siteid = data.mid(7);

            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Received DIRECT request from " + siteid);

        } else if (data.startsWith("CBACK\n")) {
            QString siteid = data.mid(6, G_IDSIZE);
            QString client = data.mid(7 + G_IDSIZE, G_IDSIZE);
            Address address(data.mid(8 + 2 * G_IDSIZE));

            Message message(Message::C_CBACK);
            message.setSiteID(siteid);
            message.setMetaSiteID(client);
            send(message, address, CM_SEARCHLOCAL);

            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Received CBACK request from " + siteid);

        } else if (data.startsWith("THP\n")) {
            QString siteid = data.mid(4, G_IDSIZE);

            tryTHP(siteid);

        } else if (data.startsWith("TCP\n")) {
            QString siteid = data.mid(4, G_IDSIZE);

            tryTCP(siteid);

        } else if (data.startsWith("HTTP\n")) {
            QString siteid = data.mid(5, G_IDSIZE);
            QString client = data.mid(6 + G_IDSIZE, G_IDSIZE);

            Session *session = new Session();
            session->setType(Session::ST_HTTP);
            session->setMetaSiteID(siteid);
            addSession(client, session);

            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established HTTP connection with site " + siteid);

        } else if (data.startsWith("HTTPDATA\n")) {
            QByteArray datagram = data.mid(9);

            Message message;
            while (!datagram.isEmpty()) {
                message.setDatagram(datagram);
                if (message.origin() == Message::MO_client)
                    emit messageReceived(message, Address());
                else {
                    message.setMetaCommand(Message::C_HTTPDATA);
                    message.setSiteID(message.metaSiteID());
                    send(message);
                }
            }
        } else
            data.clear();
    }
}


void Socket::serverKeepAliveSend() const
{
    m_httpsession2->post(m_masterserver, "command=keepalive");
}


void Socket::TCPSessionReadyMessage(Session *session, const Message &message)
{
    QString siteid = message.siteID();

    if (!m_sessions.contains(siteid)) {
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Accepted connection from " + siteid + " at " + session->address().fullAddress());
        session->setType(Session::ST_LOCAL);
        G_CONN.insert(siteid, "LOCAL");
    }

    processMessage(message, session);
}


bool Socket::tryCBACK(const QString &siteid)
{
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying CBACK connection with site " + siteid);

    QByteArray data;

    QEventLoop loop;
    connect(m_httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);
    m_httpsession->post(m_masterserver, "command=cback&siteid=" + siteid + "&client=" + G_CLIENTID);
    loop.exec();
    disconnect(m_httpsession);

    if (!m_httpsession->error()) {
        data = m_httpsession->data();
        if (data == "OK") {
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Waiting for CBACK connection from site " + siteid);
            bool success = false;
            QTimer::singleShot(m_remotetimeout, &loop, &QEventLoop::quit);
            QMetaObject::Connection conn = connect(this, &Socket::CBACKInitReceived, this, [&success, &loop]() {
                success = true;
                loop.quit();
            });
            loop.exec();
            disconnect(conn);

            return success;
        }
    }

    return false;
}


bool Socket::tryDIRECT(const QString &siteid)
{
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying DIRECT connection with site " + siteid);

    QByteArray data;

    QEventLoop loop;
    connect(m_httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);
    m_httpsession->post(m_masterserver, "command=direct&siteid=" + siteid);
    loop.exec();
    disconnect(m_httpsession);

    if (!m_httpsession->error()) {
        data = m_httpsession->data();
        QList<QByteArray> ldata = data.split('\n');
        if (ldata[0] == "DIRECT" && ldata.count() == 2) {
            QList<QByteArray> addresses = ldata.at(1).split(';');
            QList<QTcpSocket *> tcpsockets;
            QTcpSocket *found = nullptr;
            QTimer::singleShot(m_remotetimeout, &loop, &QEventLoop::quit);

            for (QByteArray &baddress : addresses) {
                Address address(baddress);
                if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying " + address.fullAddress());
                QTcpSocket *tcpsocket = new QTcpSocket(this);
                tcpsockets.append(tcpsocket);
                tcpsocket->connectToHost(address.host(), address.port());
                connect(tcpsocket, &QTcpSocket::connected, this, [&]() {
                    if (!found)
                        found = qobject_cast<QTcpSocket *>(sender());
                    loop.quit();
                });
            }

            loop.exec();

            for (QTcpSocket *tcpsocket : tcpsockets)
                if (tcpsocket != found)
                    tcpsocket->deleteLater();

            if (found) {
                Session *session = new Session();
                session->setType(Session::ST_DIRECT);
                session->setTcpSocket(found);
                connect(session, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
                addSession(siteid, session);
                if (G_VERBOSE)  qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established DIRECT connection with site " + siteid + " at " + session->address().fullAddress());
                G_CONN.insert(siteid, "DIRECT");
                return true;
            }
        }
    }

    return false;
}


bool Socket::tryHTTP(const QString &siteid)
{
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Requesting HTTP connection with site " + siteid);

    QEventLoop loop;
    connect(m_httpsession, &HttpSession::finished, &loop, &QEventLoop::quit);
    m_httpsession->post(m_masterserver, "command=http&siteid=" + siteid + "&client=" + G_CLIENTID);
    loop.exec();
    disconnect(m_httpsession);

    if (!m_httpsession->error()) {
        QByteArray data = m_httpsession->data();
        if (data == "OK") {
            if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established HTTP connection with site " + siteid);
            Session *session = new Session();
            session->setType(Session::ST_HTTP);
            addSession(siteid, session);
            G_CONN.insert(siteid, "HTTP");
            return true;
        }
    }

    return false;
}


bool Socket::tryLOCAL(const QString &siteid, const Address address)
{
    if (address.port() == 0)
        return false;

    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying LOCAL connection with site " + siteid);

    QEventLoop loop;
    QTimer timer;
    connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);

    QTcpSocket *tcpsocket = new QTcpSocket(this);
    timer.start(m_localtimeout);
    connect(tcpsocket, &QTcpSocket::connected, &loop, &QEventLoop::quit);
    tcpsocket->connectToHost(address.host(), address.port());
    loop.exec();
    timer.stop();
    disconnect(tcpsocket);

    if (tcpsocket->state() == QTcpSocket::ConnectedState) {
        Session *session = new Session();
        session->setType(Session::ST_LOCAL);
        session->setTcpSocket(tcpsocket);
        connect(session, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
        addSession(siteid, session);
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established LOCAL connection with site " + siteid + " at " + session->address().fullAddress());
        G_CONN.insert(siteid, "LOCAL");
        return true;
    } else {
        tcpsocket->deleteLater();
        return false;
    }
}


bool Socket::trySELF(const QString &siteid, const Address address)
{
    if (!QNetworkInterface::allAddresses().contains(address.host()))
        return false;

    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying SELF connection with site " + siteid);

    QEventLoop loop;
    QTimer timer;
    connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);

    QLocalSocket *localsocket = new QLocalSocket(this);
    timer.start(m_localtimeout);
    connect(localsocket, &QLocalSocket::connected, &loop, &QEventLoop::quit);
    localsocket->connectToServer("niliBOX");
    loop.exec();
    timer.stop();
    disconnect(localsocket);

    if (localsocket->state() == QLocalSocket::ConnectedState) {
        Session *session = new Session();
        session->setType(Session::ST_SELF);
        session->setLocalSocket(localsocket);
        connect(session, &Session::readyMessage, this, &Socket::localSessionReadyMessage);
        addSession(siteid, session);
        if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established SELF connection with site " + siteid + " at " + session->address().fullAddress());
        G_CONN.insert(siteid, "SELF");
        return true;
    } else {
        localsocket->deleteLater();
        return false;
    }
}


bool Socket::tryTCP(const QString &siteid)
{
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Requesting TCP connection with site " + siteid);

    bool success = false;
    QEventLoop loop;
    QTimer timer;
    connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);
    timer.start(m_remotetimeout);
    Message message = Message(Message::C_TCP, siteid);

    QMetaObject::Connection conn = connect(this, &Socket::TCPInitReceived, this, [&success, &loop]() {
        success = true;
        if (loop.isRunning())
            loop.quit();
    });

    send(message, m_masteraddress, CM_SEARCHLOCAL);
    loop.exec();
    disconnect(conn);

    return success;
}


bool Socket::tryTHP(const QString &siteid)
{
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Requesting THP connection with site " + siteid);
    Message message = Message(Message::C_THP, siteid);
    message.setSiteID(G_SITEID);

    QTcpSocket *tcpsocket0 = new QTcpSocket();
    tcpsocket0->bind(0, QTcpSocket::ShareAddress | QTcpSocket::ReuseAddressHint);
    quint16 port = tcpsocket0->localPort();

    QEventLoop loop;
    QTimer timer;
    connect(&timer, &QTimer::timeout, &loop, &QEventLoop::quit);
    QMetaObject::Connection conn = connect(tcpsocket0, &QTcpSocket::connected, &loop, &QEventLoop::quit);
    tcpsocket0->connectToHost(m_masteraddress.host(), m_masteraddress.port());
    timer.start(m_remotetimeout);
    loop.exec();
    timer.stop();
    disconnect(conn);
    if (tcpsocket0->state() != QTcpSocket::ConnectedState) {
        tcpsocket0->deleteLater();
        return false;
    }

    QByteArray res = "ERROR";
    conn = connect(tcpsocket0, &QTcpSocket::readyRead, &loop, &QEventLoop::quit);
    tcpsocket0->write(message.datagram());
    tcpsocket0->waitForBytesWritten();
    timer.start(m_remotetimeout);
    loop.exec();
    timer.stop();
    disconnect(conn);
    QByteArray data = tcpsocket0->readAll();
    message.setDatagram(data);
    res = message.data();

    if (res == "ERROR") {
        tcpsocket0->deleteLater();
        return false;
    }

    tcpsocket0->disconnectFromHost();
    tcpsocket0->deleteLater();

    Address remoteaddress = Address(res);
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Trying THP connection with address " + remoteaddress.fullAddress());

    QTcpSocket *tcpsocket;
    int success = false;

    for (int i = 0; i < 2 && !success; ++i) {
        bool s = (i == 0 && m_type == ST_server) || (i == 1 && m_type == ST_client);

        if (s) {
            timer.start(0.1 * m_remotetimeout);
            loop.exec();
            timer.stop();
        }

        tcpsocket = new QTcpSocket(this);
        tcpsocket->bind(port, QTcpSocket::ShareAddress | QTcpSocket::ReuseAddressHint);
        connect(tcpsocket, &QTcpSocket::connected, &loop, &QEventLoop::quit);
        timer.start((s ? 0.4 : 0.5) * m_remotetimeout);
        tcpsocket->connectToHost(remoteaddress.host(), remoteaddress.port());
        loop.exec();
        timer.stop();
        disconnect(tcpsocket);

        if (tcpsocket->state() == QTcpSocket::ConnectedState)
            if (!success) {
                success = true;
                remoteaddress.setPort(remoteaddress.port());
                break;
            }

        tcpsocket->deleteLater();
    }

    if (!success)
        return false;

    Session *session = new Session();
    session->setType(Session::ST_THP);
    session->setTcpSocket(tcpsocket);
    connect(session, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
    addSession(siteid, session);
    if (G_VERBOSE) qInfo() << qPrintable("SOCKET-" + m_typestr + ": Established THP connection with site " + siteid + " at " + remoteaddress.fullAddress());

    G_CONN.insert(siteid, "THP");

    return true;
}


void Socket::TCPServerNewConnection()
{
    while (m_tcpserver->hasPendingConnections()) {
        Session *session = new Session();
        session->setTcpSocket(m_tcpserver->nextPendingConnection());
        connect(session, &Session::readyMessage, this, &Socket::TCPSessionReadyMessage);
    }
}


void Socket::UDP4SocketReadyRead()
{
    receiveUDP(m_udpserver4);
}


void Socket::UDP6SocketReadyRead()
{
    receiveUDP(m_udpserver6);
}
