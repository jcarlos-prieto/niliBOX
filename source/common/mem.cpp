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
#include "common/mem.h"
#include <QDateTime>


Mem::Mem(QObject *parent) : QObject(parent)
{
    m_tmax = G_LOCALSETTINGS.get("system.memorygarbagecollection").toInt();
}


Mem::~Mem()
{
    qsizetype n = m_list.count();

    for (qsizetype i = 0; i < n; ++i)
        delete m_list.at(i).data;
}


char *Mem::alloc(const int size)
{
    if (size == 0)
        return nullptr;

    QMutexLocker locker(&m_mutex);

    qsizetype n = m_list.count();
    qsizetype c = -1;
    qint64 t = QDateTime::currentMSecsSinceEpoch();
    chunk ch;

    for (qsizetype i = 0; i < n; ++i) {
        ch = m_list.at(i);
        if (ch.timestamp < t) {
            if (ch.size == size) {
                ch.timestamp = t + m_tmax;
                m_list[i] = ch;
                return ch.data;
            } else if (c == -1) {
                c = i;
            } else {
                free(ch.data);
                ch.data = nullptr;
                ch.size = 0;
                m_list[i] = ch;
            }
        }
    }

    if (c > -1) {
        ch = m_list.at(c);
        ch.data = static_cast<char *>(realloc(ch.data, size));
        ch.size = size;
        ch.timestamp = t + m_tmax;
        m_list[c] = ch;
    } else {
        ch.data = static_cast<char *>(malloc(size));
        ch.size = size;
        ch.timestamp = t + m_tmax;
        m_list << ch;
    }

    return ch.data;
}


QByteArrayView Mem::alloc(const char *data, const int size)
{
    if (size == 0)
        return QByteArrayView();

    char *output = alloc(size);
    memcpy(output, data, size);

    return QByteArrayView(output, size);
}


QByteArrayView Mem::alloc(const QByteArray &data)
{
    if (data.size() == 0)
        return QByteArrayView();

    return alloc(data.data(), static_cast<int>(data.size()));
}


QByteArrayView Mem::alloc(const QByteArrayView &data)
{
    if (data.size() == 0)
        return QByteArrayView();

    return alloc(data.data(), static_cast<int>(data.size()));
}
