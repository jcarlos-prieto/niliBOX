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

#if !defined SERVERSESSION_H
#define SERVERSESSION_H

#include "common/message.h"
#include "common/settings.h"
#include <QJSEngine>

class Box;
class QTimer;


class ServerSession : public QObject
{
    Q_OBJECT

public:
    explicit             ServerSession(const QString &siteid, const QString &deviceid, QObject *parent = nullptr);
    virtual             ~ServerSession();

    Q_INVOKABLE void     debug(const QString &value) const;
    Q_INVOKABLE QObject *getBox();
    Q_INVOKABLE QString  getvar(const QString &key, const QString &value) const;
    Q_INVOKABLE void     import(const QString &module, const QString &file) const;
    Q_INVOKABLE QString  param(const QString &value) const;
    Q_INVOKABLE void     send(const QString &key, const QString &value);
    Q_INVOKABLE void     sendbin(const QString &key, QByteArrayView value);
    Q_INVOKABLE void     setvar(const QString &key, const QString &value);

    QString              deviceID() const;
    void                 messageIn(const Message &message);
    QString              sessionID() const;
    QString              siteID() const;
    void                 start();

private:
    void                 heartbeat();
    void                 installTimeout();
    void                 jsError(QJSValue error) const;
    void                 receive(const Settings &properties);
    void                 receivebin(const QByteArray &data);
    QByteArray           wrapQml(const QByteArray &data) const;

    QString              m_appname;
    int                  m_appwatchdog;
    int                  m_appwatchdog2;
    Box                 *m_box;
    Settings             m_deviceconfig;
    QString              m_deviceid;
    QJSEngine           *m_engine;
    bool                 m_installed;
    int                  m_messageseq;
    QObject             *m_qmlobject;
    QByteArray           m_rcc;
    QString              m_sessionid;
    QString              m_siteid;
    Settings             m_storage;
    QString              m_temppath;
    QTimer              *m_timer;
    qint64               m_watchdog;

signals:
    void                 closed(ServerSession *serversession);
    void                 error(ServerSession *serversession);
    void                 hotPlug();
    void                 messageOut(const Message &message);
    void                 receiveSignal(const QString &key, const QString &value);
    void                 receivebinSignal(const QString &key, const QByteArrayView value);
    void                 started(ServerSession *serversession);
};

#endif // SERVERSESSION_H
