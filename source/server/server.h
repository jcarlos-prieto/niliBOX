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

#if !defined SERVER_H
#define SERVER_H

#include "common/common.h"
#include "common/message.h"
#include "common/siteinfo.h"

class QTimer;
class ServerSession;
class Socket;


class Server : public QObject
{
    Q_OBJECT

public:
    explicit                      Server(QObject *parent = nullptr);
    virtual                      ~Server();

    bool                          running();
    void                          start();

private:
    struct ActiveSession {
        Address        address;
        bool           locked;
        int            sequence;
        ServerSession *serversession;

        ActiveSession()
        {
            sequence = -1;
        }

        bool isNull()
        {
            return sequence == -1;
        }
    };

    QString                       checkSettings(const Settings &settings) const;
    void                          cleanKnownSites();
    QByteArray                    getDriverApp(const QString &drivername, const QString &app) const;
    void                          heartbeat1();
    void                          heartbeat2();
    void                          messageIn(const Message &message);
    void                          postSaveSettings(const Settings &settings0, const Settings &settings) const;
    void                          serverSessionClosed(ServerSession *serversession);
    void                          serverSessionError(ServerSession *serversession);
    void                          serverSessionInstalled(ServerSession *serversession) const;
    void                          socketMessageReceived(const Message &message, const Address &address);
    void                          worker();

    QHash<QString, SiteInfo>      m_knownsites;
    int                           m_localdiscovery;
    int                           m_localdiscovery2;
    QString                       m_masterserver;
    bool                          m_running;
    QHash<QString, ActiveSession> m_sessions;
    Socket                       *m_socket;
    QTimer                       *m_timer1;
    QTimer                       *m_timer2;

signals:
    void                          messageOut(const Message &message);
    void                          started();
};

#endif // SERVER_H
