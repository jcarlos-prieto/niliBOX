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

#include "common/common.h"
#include "common/message.h"
#include "common/session.h"
#include <QLocalSocket>
#include <QTcpSocket>
#include <QTimer>

Session::Session(Session *master, QObject *parent) : QObject(parent)
{
    m_address = Address();
    m_buffer_in = QByteArray();
    m_metasiteid = QString();
    m_localsocket = nullptr;
    m_master = master;
    m_tcpsocket = nullptr;
    m_type = ST_SELF;

    if (m_master)
        connect(m_master, &Session::messageReceived, this, &Session::processMessage);
    else
        connect(this, &Session::messageReceived, this, &Session::processMessage);
}


Session::~Session()
{

}


Address Session::address() const
{
    if (m_master)
        return m_master->address();

    return m_address;
}


QLocalSocket *Session::localSocket() const
{
    if (m_master)
        return m_master->localSocket();

    return m_localsocket;
}


Session *Session::master() const
{
    return m_master;
}


QString Session::metaSiteID() const
{
    return m_metasiteid;
}


void Session::setLocalSocket(QLocalSocket *localsocket)
{
    if (m_master) {
        m_master->setLocalSocket(localsocket);
        return;
    }

    if (!localsocket)
        return;

    if (m_tcpsocket) {
        m_tcpsocket->deleteLater();
        m_tcpsocket = nullptr;
    }

    m_localsocket = localsocket;
    m_localsocket->setParent(this);

    m_address.setHostAndPort(G_LOCALHOST, static_cast<int>(localsocket->socketDescriptor()));

    connect(m_localsocket, &QLocalSocket::readyRead, this, [&]() {
        Message message;
        while (m_localsocket->bytesAvailable() > 0) {
            m_buffer_in.append(m_localsocket->readAll());
            while (!m_buffer_in.isEmpty()) {
                message.setDatagram(m_buffer_in);
                if (message.command() == Message::C_NULL)
                    break;
                else
                    emit messageReceived(message);
            }
        }
    });
}


void Session::setMetaSiteID(const QString &client)
{
    m_metasiteid = client;
}


void Session::setSiteID(const QString &siteid)
{
    m_siteid = siteid;
}


void Session::setTcpSocket(QTcpSocket *tcpsocket)
{
    if (m_master) {
        m_master->setTcpSocket(tcpsocket);
        return;
    }

    if (!tcpsocket)
        return;

    if (m_localsocket) {
        m_localsocket->deleteLater();
        m_localsocket = nullptr;
    }

    m_tcpsocket = tcpsocket;
    m_tcpsocket->setParent(this);
    m_tcpsocket->setSocketOption(QAbstractSocket::LowDelayOption, 1);

    m_address.setHostAndPort(tcpsocket->peerAddress(), tcpsocket->peerPort());

    connect(m_tcpsocket, &QTcpSocket::readyRead, this, [&]() {
        Message message;
        while (m_tcpsocket->bytesAvailable() > 0) {
            m_buffer_in.append(m_tcpsocket->readAll());
            while (!m_buffer_in.isEmpty() > 0) {
                message.setDatagram(m_buffer_in);
                if (message.command() == Message::C_NULL)
                    break;
                else
                    emit messageReceived(message);
            }
        }
    });
}


void Session::setType(const SessionType &type)
{
    m_type = type;
}


QString Session::siteID()
{
    return m_siteid;
}


QTcpSocket *Session::tcpSocket() const
{
    if (m_master)
        return m_master->tcpSocket();

    return m_tcpsocket;
}


Session::SessionType Session::type() const
{
    return m_type;
}


bool Session::write(const Message &message)
{
    if (m_master)
        return m_master->write(message);

    bool ok = false;

    if (m_localsocket) {
        if (m_localsocket->state() == QLocalSocket::ConnectedState) {
            ok = m_localsocket->write(message.datagram()) > -1;
            if (ok)
                m_localsocket->flush();
        }
    } else if (m_tcpsocket) {
        if (m_tcpsocket->state() == QTcpSocket::ConnectedState) {
            ok = m_tcpsocket->write(message.datagram()) > -1;
            if (ok)
                m_tcpsocket->flush();
        }
    }

    return ok;
}


void Session::processMessage(const Message &message)
{
    if (m_siteid == message.siteID() || m_siteid.isEmpty())
        emit readyMessage(this, message);
}
