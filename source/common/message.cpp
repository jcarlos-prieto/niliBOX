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
#include <QRandomGenerator>

int Message::m_masterseq = static_cast<int>(65536 * QRandomGenerator::global()->generateDouble());

Message::Message(QObject *parent) : QObject(parent)
{
    clear();
}


Message::Message(const Message &message, QObject *parent) : QObject(parent)
{
    m_command = message.command();
    m_data = message.data();
    m_metacommand = message.metaCommand();
    m_metasiteid = message.metaSiteID();
    m_origin = message.origin();
    m_sequence = message.sequence();
    m_siteid = message.siteID();
}


Message::Message(const Command command, QObject *parent) : QObject(parent)
{
    clear();
    m_command = command;

}


Message::Message(const Command command, const QByteArray &data, QObject *parent) : QObject(parent)
{
    clear();
    m_command = command;
    m_data = data;
}


Message::Message(const Command command, const QString &data, QObject *parent) : QObject(parent)
{
    clear();
    m_command = command;
    m_data = data.toUtf8();

}


Message::~Message()
{

}


void Message::clear()
{
    m_command = Message::C_NULL;
    m_data = QByteArray();
    m_metacommand = Message::C_NULL;
    m_metasiteid = QString("0").repeated(G_IDSIZE);
    m_origin = MO_client;
    m_sequence = ++m_masterseq % 65536;
    m_siteid = QString("0").repeated(G_IDSIZE);
}


Message::Command Message::command() const
{
    return m_command;
}


QByteArray Message::data() const
{
    return m_data;
}


QByteArray Message::datagram() const
{
    qsizetype len = 10 + G_IDSIZE + m_data.length();

    QByteArray datagram;
    datagram.append(SIGNATURE);
    datagram.append((char)(len >> 24 & 0xff));
    datagram.append((char)(len >> 16 & 0xff));
    datagram.append((char)(len >> 8 & 0xff));
    datagram.append((char)(len & 0xff));
    datagram.append((char)(m_sequence >> 8 & 0xff));
    datagram.append((char)(m_sequence & 0xff));
    datagram.append(static_cast<unsigned char>(m_command));
    datagram.append(QByteArray::fromHex(m_siteid.toUtf8()));
    datagram.append(static_cast<unsigned char>(m_metacommand) | static_cast<unsigned char>(m_origin) << 7);
    datagram.append(QByteArray::fromHex(m_metasiteid.toUtf8()));
    datagram.append(m_data);

    return datagram;
}


Message::Command Message::metaCommand() const
{
    return m_metacommand;
}


QString Message::metaSiteID() const
{
    return m_metasiteid;
}


Message::MessageOrigin Message::origin() const
{
    return m_origin;
}


int Message::sequence() const
{
    return m_sequence;
}


void Message::setCommand(const Command command)
{
    m_command = command;
}


void Message::setData(const QByteArray &data)
{
    m_data = data;
}


void Message::setData(const QString &data)
{
    m_data = data.toUtf8();
}


void Message::setDatagram(QByteArray &datagram)
{
    int G2 = G_IDSIZE / 2;
    int lheader = 10 + G_IDSIZE;
    m_command = Message::C_NULL;
    m_data = QByteArray();

    if (!datagram.startsWith(SIGNATURE)) {
        qsizetype pos = datagram.indexOf(SIGNATURE);
        if (pos > -1)
            datagram.remove(0, pos);
        else
            datagram.clear();
    }

    if (datagram.size() >= lheader) {
        int len = ((static_cast<unsigned char>(datagram.at(2)) << 8 | static_cast<unsigned char>(datagram.at(3))) << 8 | static_cast<unsigned char>(datagram.at(4))) << 8 | static_cast<unsigned char>(datagram.at(5));
        if (datagram.size() >= len) {
            m_sequence = static_cast<int>(static_cast<unsigned char>(datagram.at(6)) << 8 | static_cast<unsigned char>(datagram.at(7)));
            m_command = static_cast<Command>(datagram.at(8));
            m_siteid = datagram.sliced(9, G2).toHex();
            m_metacommand = static_cast<Command>(datagram.at(9 + G2) & 0x7f);
            m_origin = static_cast<MessageOrigin>(datagram.at(9 + G2) >> 7 & 0x01);
            m_metasiteid = datagram.sliced(10 + G2, G2).toHex();
            m_data = datagram.sliced(lheader, len - lheader);
            datagram = datagram.sliced(len);
        }
    }
}


void Message::setMessage(const Command command)
{
    m_command = command;
    m_data.clear();
}


void Message::setMessage(const Command command, const QString &data)
{
    m_command = command;
    m_data = data.toUtf8();
}


void Message::setMetaCommand(const Command metacommand)
{
    m_metacommand = metacommand;
}


void Message::setMetaSiteID(const QString &metasiteid)
{
    m_metasiteid = metasiteid.leftJustified(G_IDSIZE, '0', true);
}


void Message::setOrigin(const Message::MessageOrigin origin)
{
    m_origin = origin;
}


void Message::setSequence(const int sequence)
{
    if (sequence == 0)
        m_sequence = ++m_masterseq % 65536;
    else
        m_sequence = sequence;
}


void Message::setSiteID(const QString &siteid)
{
    m_siteid = siteid.leftJustified(G_IDSIZE, '0', true);
}


QString Message::siteID() const
{
    return m_siteid;
}
