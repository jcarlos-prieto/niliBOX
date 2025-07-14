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

#if !defined MEM_H
#define MEM_H

#include <QMutex>
#include <QObject>

typedef struct {
    char    *data;
    int      size;
    qint64   timestamp;
} chunk;


class Mem : public QObject
{
    Q_OBJECT

public:
    explicit        Mem(QObject *parent = nullptr);
    virtual        ~Mem();

    char           *alloc(const int size);
    QByteArrayView  alloc(const char *data, const int size);
    QByteArrayView  alloc(const QByteArray &data);
    QByteArrayView  alloc(const QByteArrayView &data);

private:
    QList<chunk>    m_list;
    QMutex          m_mutex;
    int             m_tmax;
};

#endif // MEM_H
