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

#if !defined UPNP_H
#define UPNP_H

#include "common/socket.h"

class QTcpSocket;
class QTimer;

#define SSDPMULTICASTIPV4 QHostAddress("239.255.255.250")
#define SSDPMULTICASTIPV6 QHostAddress("ff02::c")
#define SSDPPORT 1900


class UPnP : public QObject
{
    Q_OBJECT

public:
    explicit             UPnP(QObject *parent = nullptr);
    virtual             ~UPnP();

    void                 install();
    int                  port() const;
    void                 uninstall();

private:
    void                 UPnP1();
    void                 UPnP2();
    void                 UPnP3(HttpSession *httpsession);
    void                 UPnP4(const QByteArray &upnpurl, const QByteArray &service);
    void                 UPnP5(HttpSession *httpsession);
    void                 UPnP6();
    void                 UPnP7(HttpSession *httpsession);

    bool                 m_active;
    QByteArray           m_service;
    QList<QUdpSocket *>  m_ssdpsockets;
    int                  m_tcpport;
    int                  m_tcpportint;
    QTcpSocket          *m_tcpsocket;
    QTimer              *m_timer;
    QHostAddress         m_upnplocaladdress;
    QHostAddress         m_upnprouteraddress;
    QByteArray           m_upnpurl;

signals:
    void                 installed();
    void                 next();
};

#endif // UPNP_H
