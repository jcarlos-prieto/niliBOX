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

#if !defined CLIENTSESSION_H
#define CLIENTSESSION_H

#include "common/message.h"
#include "ui/tpane.h"

class App;
class QHBoxLayout;
class QVBoxLayout;
class Settings;
class TButton;
class TLabel;
class TPopup;


class ClientSession : public TPane
{
    Q_OBJECT

public:
    explicit       ClientSession(QString id, QWidget *parent = nullptr);
    virtual       ~ClientSession();

    QString        caption() const;
    QString        errormessage() const;
    QString        id() const;
    void           install();
    void           messageIn(const Message &message);
    QString        sessionID() const;

private:
    void           appError();
    void           appInstalled();
    void           applicationStatusChanged(Qt::ApplicationState state);
    void           changeEvent(QEvent *event) override;
    void           closeButtonClicked();
    void           heartbeat();
    void           popupOptionSelected();
    void           redraw();
    void           resizeEvent(QResizeEvent *event) override;
    void           send(const QString &key, const QString &value);
    void           sendbin(const QString &key, const QByteArray &value);
    void           virtualDevice(const QString &devname);

    App           *m_app;
    int            m_appwatchdog;
    int            m_appwatchdog2;
    TLabel        *m_appcaption;
    QString        m_caption;
    TButton       *m_closebutton;
    Settings      *m_config;
    QString        m_deviceid;
    QString        m_error;
    TPane         *m_frame0;
    TPane         *m_frame1;
    QString        m_id;
    QVBoxLayout   *m_layout;
    QHBoxLayout	  *m_layout0;
    QHBoxLayout	  *m_layout1;
    int            m_messageseq;
    TPopup        *m_popup;
    QString        m_sessionid;
    QString        m_siteid;
    QTimer        *m_timer;
    qint64         m_watchdog;

signals:
    void           closed(ClientSession *clientsession);
    void           error(ClientSession *clientsession);
    void           installed(ClientSession *clientsession);
    void           messageOut(const Message &message);
};

#endif // CLIENTSESSION_H
