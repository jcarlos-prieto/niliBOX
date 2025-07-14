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

#if !defined CLIENT_H
#define CLIENT_H

#include "common/common.h"
#include "common/message.h"
#include "common/siteinfo.h"

class HttpSession;
class QTimer;
class Socket;


class Client : public QObject
{
    Q_OBJECT

public:
    explicit                   Client(QObject *parent = nullptr);
    virtual                   ~Client();

    void                       start();

private:
    void                       cleanKnownSites();
    void                       heartbeat1();
    void                       heartbeat2();
    void                       httpSessionFinished1(HttpSession *httpsession);
    void                       httpSessionFinished2(HttpSession *httpsession);
    void                       processMessageIn(const Message &message);
    void                       socketMessageReceived(const Message &message, const Address &address);
    void                       worker();

    QList<QString>             m_favorites;
    bool                       m_getpublicsites;
    QHash<QString, SiteInfo>   m_knownsites;
    Settings                   m_localdrivers;
    int                        m_localtimeout;
    int                        m_localtimeout2;
    QString                    m_masterserver;
    bool                       m_openingapp;
    int                        m_remotetimeout;
    int                        m_remotetimeout2;
    Socket                    *m_socket;
    QTimer                    *m_timer1;
    QTimer                    *m_timer2;

signals:
    void                       messageIn(const Message &message);
    void                       messageOut(const Message &message);
    void                       started();
};

#endif // CLIENT_H
