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

#if !defined SOCKET_H
#define SOCKET_H

#include "common/address.h"
#include "common/message.h"
#include <QMutex>

class HttpSession;
class QLocalServer;
class QTcpServer;
class QUdpSocket;
class Session;
class UPnP;
class QTimer;


class Socket : public QObject
{
    Q_OBJECT

public:
    enum SocketType {
        ST_server,
        ST_client
    };
    Q_ENUM(SocketType)

    enum SocketStatus {
        SS_ok,
        SS_error
    };
    Q_ENUM(SocketStatus)

    enum ConnectionMode {
        CM_NOSEARCH,
        CM_SEARCHGLOBAL,
        CM_SEARCHLOCAL
    };
    Q_ENUM(ConnectionMode)

    explicit                   Socket(QObject *parent = nullptr);
    virtual                   ~Socket();

    void                       broadcast(const Message &message);
    void                       install(const SocketType &type);
    void                       removeSession(const QString &siteid);
    bool                       send(const Message &message, const Address &address = Address(), const ConnectionMode mode = CM_NOSEARCH);
    SocketStatus               status() const;
    void                       setUPnP(bool set);
    void                       uninstall();
    int                        UPnPPort() const;

private:
    void                       addSession(const QString siteid, Session *session);
    Session                   *findSession(const QString &siteid, const Address &address, const ConnectionMode mode);
    void                       localSessionReadyMessage(Session *session, const Message &message);
    void                       localServerNewConnection();
    void                       processMessage(const Message &message, Session *session = nullptr);
    void                       receiveUDP(QUdpSocket *socket);
    void                       serverKeepAliveHandle(HttpSession *httpsession);
    void                       serverKeepAliveSend() const;
    void                       TCPSessionReadyMessage(Session *session, const Message &message);
    void                       TCPServerNewConnection();
    bool                       tryCBACK(const QString &siteid);
    bool                       tryDIRECT(const QString &siteid);
    bool                       tryHTTP(const QString &siteid);
    bool                       tryLOCAL(const QString &siteid, const Address address);
    bool                       trySELF(const QString &siteid, const Address address);
    bool                       tryTCP(const QString &siteid);
    bool                       tryTHP(const QString &siteid);
    void                       UDP4SocketReadyRead();
    void                       UDP6SocketReadyRead();

    bool                       m_active;
    QList<QHostAddress>        m_bcasthelp;
    HttpSession               *m_httpsession;
    HttpSession               *m_httpsession2;
    Address                    m_localhost;
    QLocalServer              *m_localserver;
    QByteArray                 m_localsocketbuffer;
    int                        m_localtimeout;
    Address                    m_masteraddress;
    QString                    m_masterserver;
    QMutex                     m_mutex;
    int                        m_remotetimeout;
    QHash<QString, Session *>  m_sessions;
    SocketStatus               m_status;
    int                        m_tcpport;
    QTcpServer                *m_tcpserver;
    SocketType                 m_type;
    QString                    m_typestr;
    QUdpSocket                *m_udpserver4;
    QUdpSocket                *m_udpserver6;
    UPnP                      *m_upnp;
    int                        m_upnpport;

signals:
    void                       CBACKInitReceived();
    void                       TCPInitReceived();
    void                       UPnPInstalled();
    void                       installed();
    void                       messageReceived(const Message &message, const Address &address);
    void                       test(bool success);
    void                       uninstalled();
    void ee();
};

#endif // SOCKET_H
