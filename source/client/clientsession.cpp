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

#include "client/app.h"
#include "client/clientsession.h"
#include "common/common.h"
#include "ui/tbutton.h"
#include "ui/tpopup.h"
#include <QDateTime>
#include <QTimer>
#include <QVBoxLayout>


ClientSession::ClientSession(QString id, QWidget *parent) : TPane("app", parent)
{
    m_id = id;
    m_siteid = m_id.first(G_IDSIZE);
    m_deviceid = m_id.last(G_IDSIZE);

    m_config = new Settings();

    m_frame0 = new TPane("app.header", this);
    m_appcaption = new TLabel("app.header.caption", this);
    m_closebutton = new TButton("app.header.close", this);
    m_frame1 = new TPane("app.container", this);
    m_app = new App(this);
    m_popup = new TPopup(this);

    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout1 = new QHBoxLayout(m_frame1);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout->addWidget(m_frame0);
    m_layout->addWidget(m_frame1);
    m_layout->setStretchFactor(m_frame1, 1);

    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_appcaption);
    m_layout0->addWidget(m_closebutton);
    m_layout0->setStretchFactor(m_appcaption, 1);
    connect(m_closebutton, &TButton::clicked, this, &ClientSession::closeButtonClicked);

    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_layout1->addWidget(m_app);
    m_layout1->setAlignment(Qt::AlignTop);

    reload();

    connect(m_app, &App::installed, this, &ClientSession::appInstalled);
    connect(m_app, &App::error, this, &ClientSession::appError);
    connect(m_app, &App::sendSignal, this, &ClientSession::send);
    connect(m_app, &App::sendbinSignal, this, &ClientSession::sendbin);
    connect(m_app, &App::resized, this, &ClientSession::redraw);
    connect(m_app, &App::reqRemoteBox, this, &ClientSession::messageOut);
    connect(m_app, &App::virtualDevice, this, &ClientSession::virtualDevice);

    connect(m_popup, &TPopup::optionSelected, this, &ClientSession::popupOptionSelected);

    m_appwatchdog = G_LOCALSETTINGS.get("system.appwatchdog").toInt();
    m_appwatchdog2 = 3 * m_appwatchdog;
    m_watchdog = 0;

}


ClientSession::~ClientSession()
{

}


QString ClientSession::caption() const
{
    return m_caption;
}


QString ClientSession::errormessage() const
{
    return m_error;
}


QString ClientSession::id() const
{
    return m_id;
}


void ClientSession::install()
{
    if (G_VERBOSE) qInfo() << qPrintable("CLIENTSESSION: Installing client session for device " + m_id.first(G_IDSIZE) + "&" + m_id.last(G_IDSIZE));

    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    Settings clientsettings;
    clientsettings.set("deviceid", m_deviceid);
    clientsettings.set("version", APP_VERSION);

    Message message(Message::C_OPENSESSION, clientsettings.getString());
    message.setSiteID(m_siteid);
    m_messageseq = message.sequence();
    emit messageOut(message);

    connect(qApp, &QApplication::applicationStateChanged, this, &ClientSession::applicationStatusChanged);
}


void ClientSession::messageIn(const Message &message)
{
    //** message.data() => <value>
    //   Receives value from remote box.
    if (message.command() == Message::C_REMOTEBOX) {
        m_app->receivebox(message);
        return;
    }

    if (message.sequence() == m_messageseq) {
        switch (message.command()) {

            //** message.data() => 'OK' + Session ID or error type.
            //   After the server session has been created, starts with the creation of
            //   the client side. The first step is to request the full configuration of
            //   the site.
            case Message::C_OPENSESSION: {
                if (message.data().startsWith("OK")) {
                    m_sessionid = message.data().sliced(2);
                    Message lmessage(Message::C_GETCONFIGFULL, m_siteid);
                    lmessage.setSequence(0);
                    m_messageseq = lmessage.sequence();
                    emit messageOut(lmessage);
                } else {
                    m_error = message.data();
                    emit error(this);
                }
                return;
            }

            //** message.data() => Full configuration of the site.
            //   After this, the binary resource file for the client app is requested.
            case Message::C_GETCONFIGFULL: {
                m_config->loadString(message.data());

                QString appname = m_config->get("site.name") + "\n" + m_config->get("devices." + m_deviceid + ".name");
                m_caption = appname;
                appname.replace("\n", " :: ");
                m_appcaption->setText(appname);

                QString driver = m_config->get("devices." + m_deviceid + ".driver");
                Message lmessage(Message::C_GETDRIVERCLIENT, driver);
                lmessage.setSequence(0);
                m_messageseq = lmessage.sequence();
                lmessage.setSiteID(m_siteid);
                emit messageOut(lmessage);
                return;
            }

            //** message.data() => Binary resource file for the client app.
            //   The binary file is loaded into the client app.
            case Message::C_GETDRIVERCLIENT: {
                m_config->set("id", m_id);
                m_config->set("type", "client");
                m_app->install(message.data(), m_config, Settings());
                return;
            }

            default: {
                break;
            }
        }
    }

    if (!m_sessionid.isEmpty() && message.data().startsWith(m_sessionid.toUtf8())) {
        switch (message.command()) {

            //** message.data() => <session id> + <key>=<value>\n<key>=<value>\n...
            //   Receives data for the app.
            case Message::C_APPDATA: {
                Settings properties;
                properties.loadString(message.data().sliced(G_IDSIZE));
                QList<QString> keys = properties.keys();

                for (QString &key : keys)
                    m_app->receive(key, properties.value(key));

                return;
            }

            //** message.data() => <session id> + <key>=<binarydata>
            //   Receives data for the app.
            case Message::C_APPDATABIN: {
                m_app->receivebin(message.data().sliced(G_IDSIZE));
                return;
            }

            //** message.data() => session id
            case Message::C_APPWATCHDOG: {
                m_watchdog = QDateTime::currentMSecsSinceEpoch();
                return;
            }

            //** message.data() => empty
            case Message::C_VIRTUALDEV: {
                emit m_app->hotPlug();
                return;
            }

            default: {
                break;
            }
        }
    }
}


QString ClientSession::sessionID() const
{
    return m_sessionid;
}


void ClientSession::appError()
{
    m_error = "ERRORCLIENT";
    emit error(this);
}


void ClientSession::appInstalled()
{
    m_app->setFocus();

    QTimer::singleShot(200, this, &ClientSession::redraw);

    m_watchdog = QDateTime::currentMSecsSinceEpoch();
    m_timer = new QTimer(this);
    connect(m_timer, &QTimer::timeout, this, &ClientSession::heartbeat);
    m_timer->start(m_appwatchdog);
    heartbeat();

    emit installed(this);
}


void ClientSession::applicationStatusChanged(Qt::ApplicationState state)
{
#if defined OS_IOS || defined OS_ANDROID
    if (state == Qt::ApplicationActive)
        m_watchdog = QDateTime::currentMSecsSinceEpoch();
#else
    Q_UNUSED(state)
#endif
}


void ClientSession::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange)
        m_closebutton->setToolTip(tr("Close"));
}


void ClientSession::closeButtonClicked()
{
    emit closed(this);
}


void ClientSession::heartbeat()
{
    if (m_popup->isActive())
        return;

    qint64 currtime = QDateTime::currentMSecsSinceEpoch();

    if (m_watchdog > 0) {
        if (currtime - m_watchdog > m_appwatchdog2) {
            m_popup->setInstance("ErrorRemote");
            m_popup->setText(tr("The server side is no longer available."));
            m_popup->setIcon(TPopup::I_Critical);
            m_popup->setButtons(QList<QString>() << tr("Accept"));
            m_popup->exec();
            return;
        }
    }

    Message message(Message::C_APPWATCHDOG, m_sessionid);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ClientSession::popupOptionSelected()
{
    if (m_popup->instance() == "ErrorRemote" && m_popup->selected() == tr("Accept")) {
        m_error = "ERRORWATCHDOG";
        emit error(this);
    }
}


void ClientSession::redraw()
{
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_frame0->setHeight(G_UNIT_L);
    m_frame1->setWidth(width() - m_layout->contentsMargins().left() - m_layout->contentsMargins().right());

    m_app->updateGlobalValues();

    m_popup->redraw();
}


void ClientSession::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}


void ClientSession::send(const QString &key, const QString &value)
{
    QString data = m_sessionid + key + "=" + value + "\n";
    Message message(Message::C_APPDATA, data);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ClientSession::sendbin(const QString &key, const QByteArray &value)
{
    QByteArray data = (m_sessionid + key).toUtf8() + "=" + value;
    Message message(Message::C_APPDATABIN, data);
    message.setSiteID(m_siteid);
    emit messageOut(message);
}


void ClientSession::virtualDevice(const QString &devname)
{
    Message message(Message::C_VIRTUALDEV, devname);
    message.setSiteID(G_SITEID);
    emit messageOut(message);
}
