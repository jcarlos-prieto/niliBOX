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

#if !defined SESSION_H
#define SESSION_H

#include "common/address.h"
#include "common/common.h"
#include <QMutex>
#include <QObject>
#include <QTimer>

class Message;
class QLocalSocket;
class QTcpSocket;


class Session : public QObject
{
    Q_OBJECT

public:
    enum SessionType {
        ST_SELF,
        ST_LOCAL,
        ST_DIRECT,
        ST_CBACKCLI,
        ST_CBACKSRV,
        ST_THP,
        ST_TCP,
        ST_HTTP
    };
    Q_ENUM(SessionType)

    explicit       Session(Session *master = nullptr, QObject *parent = nullptr);
    virtual       ~Session();

    Address        address() const;
    QLocalSocket  *localSocket() const;
    Session       *master() const;
    QString        metaSiteID() const;
    void           setLocalSocket(QLocalSocket *localsocket);
    void           setMetaSiteID(const QString &client);
    void           setSiteID(const QString &siteid);
    void           setTcpSocket(QTcpSocket *tcpsocket);
    void           setType(const SessionType &type);
    QString        siteID();
    QTcpSocket    *tcpSocket() const;
    SessionType    type() const;
    bool           write(const Message &message);

private:
    Address        m_address;
    QByteArray     m_buffer_in;
    QLocalSocket  *m_localsocket;
    QString        m_metasiteid;
    QString        m_siteid;
    Session       *m_master;
    QTcpSocket    *m_tcpsocket;
    SessionType    m_type;
    QString        m_zero = QString("0").repeated(G_IDSIZE);

    void           processMessage(const Message &message);

signals:
    void           messageReceived(const Message &message);
    void           readyMessage(Session *session, const Message &message);
};

#endif // SESSION_H
