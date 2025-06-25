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

#include "common/address.h"
#include <QEventLoop>
#include <QHostInfo>
#include <QNetworkInterface>
#include <QTimer>


Address::Address()
{
    m_host = QHostAddress("");
    m_port = 0;
}


Address::Address(const QString &fulladdress)
{
    setFulladdress(fulladdress);
}


Address::Address(const QString &hostname, const int port)
{
    QEventLoop loop;
    QHostInfo::lookupHost(hostname, [this, port, &loop](QHostInfo hostinfo) {
        if (!hostinfo.addresses().isEmpty())
            setHostAndPort(hostinfo.addresses().at(0), port);
        if (loop.isRunning())
            loop.quit();
    });

    loop.exec();
}


Address::Address(const QHostAddress &host, const int port)
{
    setHostAndPort(host, port);
}


Address::~Address()
{

}


QString Address::fullAddress() const
{
    return m_fulladdress;
}


QHostAddress Address::host() const
{
    return m_host;
}


bool Address::isInSubnet(const QHostAddress &addr1, const QHostAddress &addr2, const QHostAddress &nmask)
{
    Q_IPV6ADDR addr1v6 = addr1.toIPv6Address();
    Q_IPV6ADDR addr2v6 = addr2.toIPv6Address();
    Q_IPV6ADDR nmaskv6 = nmask.toIPv6Address();

    bool match = true;

    for (int i = 0; i < 16 && match; ++i)
        match = ((addr1v6[i] & nmaskv6[i]) == (addr2v6[i] & nmaskv6[i]));

    return match;
}


bool Address::isLocal() const
{
    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
    for (QNetworkInterface &interface : interfaces) {
        QList<QNetworkAddressEntry> addressentries = interface.addressEntries();
        for (QNetworkAddressEntry &addressentry : addressentries)
            if (addressentry.ip() == m_host)
                return true;
    }
    return false;
}


int Address::port() const
{
    return m_port;
}


void Address::setFulladdress(const QString &fulladdress)
{
    m_fulladdress = fulladdress;

    qsizetype pos = m_fulladdress.lastIndexOf(":");

    QHostAddress host;
    int port;

    if (pos < 0) {
        host.setAddress(m_fulladdress);
        port = 0;
    } else {
        host.setAddress(m_fulladdress.first(pos));
        port = m_fulladdress.sliced(pos + 1).toInt();
    }

    setHostAndPort(host, port);
}


void Address::setHost(const QHostAddress &host)
{
    setHostAndPort(host, m_port);
}


void Address::setHostAndPort(const QHostAddress &host, const int port)
{
    m_host = host;
    m_port = port;

    bool ok;
    unsigned int ipv4 = m_host.toIPv4Address(&ok);

    if (ok)
        m_host = QHostAddress(ipv4);

    m_fulladdress = "";
    m_fulladdress.append(m_host.toString());
    m_fulladdress.append(":");
    m_fulladdress.append(QString::number(m_port));
}


void Address::setHostname(const QString &hostname)
{
    QHostInfo hostinfo = QHostInfo::fromName(hostname);
    if (!hostinfo.addresses().isEmpty())
        setHostAndPort(hostinfo.addresses().at(0), m_port);
}


void Address::setPort(const int port)
{
    setHostAndPort(m_host, port);
}
