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

#if !defined ADDRESS_H
#define ADDRESS_H

#include <QDebug>
#include <QHostAddress>


class Address
{

public:
    explicit       Address();
    explicit       Address(const QString &fulladdress);
    explicit       Address(const QString &hostname, const int port);
    explicit       Address(const QHostAddress &host, const int port);
    virtual       ~Address();

    QString        fullAddress() const;
    QHostAddress   host() const;
    static bool    isInSubnet(const QHostAddress &addr1, const QHostAddress &addr2, const QHostAddress &nmask);
    bool           isLocal() const;
    int            port() const;
    void           setFulladdress(const QString &fulladdress);
    void           setHost(const QHostAddress &host);
    void           setHostAndPort(const QHostAddress &host, const int port);
    void           setHostname(const QString &hostname);
    void           setPort(const int port);


private:
    QString        m_fulladdress;
    QHostAddress   m_host;
    int            m_port;
};


inline QDebug operator<<(QDebug debug, const Address &address)
{
    QDebugStateSaver saver(debug);
    debug.noquote() << address.fullAddress();
    return debug;
}

#endif // ADDRESS_H
