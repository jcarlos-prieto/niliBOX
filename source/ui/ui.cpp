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
#include "client/configsession.h"
#include "common/common.h"
#include "common/httpsession.h"
#include "ui/devicespanel.h"
#include "ui/infopanel.h"
#include "ui/settingspanel.h"
#include "ui/tbbutton.h"
#include "ui/tcframe.h"
#include "ui/tcheck.h"
#include "ui/tcombobox.h"
#include "ui/tframe.h"
#include "ui/tlineedit.h"
#include "ui/tlist.h"
#include "ui/tpopup.h"
#include "ui/ttextedit.h"
#include "ui/ui.h"
#include <QFontDatabase>
#include <QPropertyAnimation>
#include <QResource>
#include <QScrollArea>
#include <QScroller>
#include <QTranslator>
#include <QVBoxLayout>


UI::UI(QWidget *parent) : QWidget(parent)
{
    if (G_SERVERONLY)
        return;

    qInfo() << qPrintable("UI: Creating");

    (new QQuickWidget(this))->deleteLater();

    int gapi = QQuickWindow::graphicsApi();
    QString sgapi = "Unknown";

    if (gapi == 1)
        sgapi = "Software";
    else if (gapi == 2)
        sgapi = "OpenVG";
    else if (gapi == 3)
        sgapi = "OpenGL";
    else if (gapi == 4)
        sgapi = "Direct3D11";
    else if (gapi == 5)
        sgapi = "Vulkan";
    else if (gapi == 6)
        sgapi = "Metal";

    qInfo() << qPrintable("UI: Using graphics API " + sgapi);

    setObjectName("ui");

    G_TOUCH = false;
    QList<const QInputDevice *> inputdevs = QInputDevice::devices();
    for (const QInputDevice *&dev : inputdevs)
        G_TOUCH = G_TOUCH || (dev->type() == QInputDevice::DeviceType::Stylus) || (dev->type() == QInputDevice::DeviceType::TouchScreen);

    if (G_TOUCH)
        qInfo() << qPrintable("UI: Touch device is present");
    else
        qInfo() << qPrintable("UI: Touch device is not present");

    setAttribute(Qt::WA_AlwaysStackOnTop);

    m_UIminunit = G_LOCALSETTINGS.get("ui.minunit").toFloat();
    m_UImaxunit = G_LOCALSETTINGS.get("ui.maxunit").toFloat();
    m_UIratio1 = G_LOCALSETTINGS.get("ui.ratio1").toFloat();
    m_UIratio2 = G_LOCALSETTINGS.get("ui.ratio2").toFloat();
    m_UIratio = G_LOCALSETTINGS.get("ui.ratio").toFloat();
    m_animationdelay = G_LOCALSETTINGS.get("ui.animationdelay").toInt();

    if (G_TOUCH)
        m_UImaxunit *= 0.8;

    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");

    m_animation0 = new QPropertyAnimation(this);
    m_animation1 = new QPropertyAnimation(this);
    m_animation2 = new QPropertyAnimation(this);
    m_animation3 = new QPropertyAnimation(this);
    m_animation4 = new QPropertyAnimation(this);
    m_frame0 = new TPane("main", this);
    m_logo = new TPane("main.logo", this);
    m_loading = new TLabel("main.loading", this);
    m_frame1 = new TPane("left", this);
    m_frame10 = new TPane("left.buttons", this);
    m_frame11 = new TPane("left.options", this);
    m_devicesbutton = new TButton("left.options.devices", this);
    m_settingsbutton = new TButton("left.options.settings", this);
    m_infobutton = new TButton("left.options.info", this);
    m_frame2 = new TPane("slider", this);
    m_openclose = new TButton("slider.button", this);
    m_arrow = new TButton("slider.arrow", this);
    m_pinbutton = new TButton("slider.pin", this);
    m_frame10_s = new QScrollArea(this);

    m_layout1 = new QVBoxLayout(m_frame1);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_layout11 = new QHBoxLayout(m_frame11);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_layout2 = new QVBoxLayout(m_frame2);
    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);
    m_appbuttons = new QVBoxLayout(m_frame10);
    m_appbuttons->setContentsMargins(0, 0, 0, 0);
    m_appbuttons->setSpacing(0);

    m_frame0->raise();
    m_frame1->raise();
    m_frame2->raise();

    m_dpi = G_LOCALSETTINGS.get("ui.dpi").toFloat();

    QList<QString> minsize = G_LOCALSETTINGS.get("ui.minsize").split(",");
    setMinimumSize(minsize.at(0).toUInt(), minsize.at(1).toUInt());

    bool newscreen = false;
    if (G_LOCALSETTINGS.get("ui.geometry").isEmpty())
        newscreen = true;
    else {
        QList<QString> geometry = G_LOCALSETTINGS.get("ui.geometry").split(",");
        if (geometry.at(0) == "max") {
            QList<QScreen *> screens = qApp->screens();
            for (QScreen *&screen : screens)
                if (screen->name() == geometry.at(1)) {
                    m_screen = screen;
                    QRect ag = m_screen->availableGeometry();
                    int w = qMin(600, ag.width());
                    int h = qMin(800, ag.height());
                    int x = ag.left() + (ag.width() - w) / 2;
                    int y = ag.top() + (ag.height() - h) / 2;
                    resize(w, h);
                    move(x, y);
                    setWindowState(Qt::WindowMaximized);
                }
        } else {
            int x = geometry.at(0).toInt();
            int y = geometry.at(1).toInt();
            int w = geometry.at(2).toInt();
            int h = geometry.at(3).toInt();
            m_screen = qApp->screenAt(QPoint(x, y));
            if (!m_screen)
                newscreen = true;
            else {
                resize(w, h);
                move(x, y);
            }
        }
    }

    if (newscreen) {
        m_screen = qApp->primaryScreen();
        QRect ag = m_screen->availableGeometry();
        int w = qMin(600, static_cast<int>(0.8 * ag.width()));
        int h = qMin(800, static_cast<int>(0.8 * ag.height()));
        if (w > h / 8 * 6)
            w = h / 8 * 6;
        if (h > w / 6 * 8)
            h = w / 6 * 8;
        int x = ag.left() + (ag.width() - w) / 2;
        int y = ag.top() + (ag.height() - h) / 2;
        resize(w, h);
        move(x, y);
    }

    if (m_screen->devicePixelRatio() > 1)
        qInfo() << qPrintable("UI: Pixel ratio " + QString::number(m_screen->devicePixelRatio()));

    connect(qApp, &QApplication::primaryScreenChanged, this, &UI::redraw);

#if defined OS_IOS
    m_topmargin = m_screen->geometry().y();
#else
    m_topmargin = 0;
#endif

    m_frame0->setGeometry(0, m_topmargin, width(), height() - m_topmargin);
    m_frame1->setGeometry(0, 0, 0, 0);
    m_frame2->setGeometry(0, 0, 0, 0);
    m_animation0->setTargetObject(m_frame0);
    m_animation0->setPropertyName("size");
    m_animation0->setEasingCurve(static_cast<QEasingCurve::Type>(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    connect(m_frame0, &TPane::resized, this, &UI::redraw);
    connect(m_frame0, &TPane::pressed, this, [&]() {if (m_open && !m_pinned) openCloseButtonClicked();});

    m_logo->setParent(m_frame0);
    m_loading->setParent(m_frame0);

    G_FAMILIES = {"All", "Audio", "Automation", "Radio", "Test", "Video"};
    tr("All");
    tr("Audio");
    tr("Automation");
    tr("Radio");
    tr("Test");
    tr("Video");

    m_loading->setActive(true);
    m_pendingapps.clear();
    m_langname.clear();
    m_themename.clear();
    m_openingapp = true;
    m_splash = true;

    setLanguage();
    setTheme();
    show();
}


UI::~UI()
{

}


void UI::messageIn(const Message &message)
{
    //** message.data() => site id + device id
    if (message.command() == Message::C_OPENAPP)
        appOpen(message.data());

    else
        emit messageFwIn(message);
}


void UI::start()
{
    if (G_SERVERONLY) {
        emit started();
        return;
    }

    qInfo() << qPrintable("UI: Starting UI");

    QString title = qApp->applicationName();

    if (G_CLIENTONLY)
        title.append(" (client)");

    setWindowTitle(title);
    setWindowIcon(QIcon(":/resources/icon.png"));

    changeEvent(new QEvent(QEvent::LanguageChange));

    m_layout1->addWidget(m_frame10_s);
    m_layout1->addWidget(m_frame11);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_frame10_s->setWidget(m_frame10);
    m_frame10_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame10_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame10_s->setFrameShape(QFrame::NoFrame);
    m_frame10_s->setWidgetResizable(true);
    m_frame10_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame10_s, QScroller::LeftMouseButtonGesture);
    m_appbuttons->setAlignment(Qt::AlignTop);
    m_appbuttons->setContentsMargins(0, 0, 0, 0);
    m_appbuttons->setSpacing(0);
    m_layout11->addWidget(m_devicesbutton);
    m_layout11->addWidget(m_settingsbutton);
    m_layout11->addWidget(m_infobutton);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);

    m_animation1->setTargetObject(m_frame1);
    m_animation1->setPropertyName("size");
    m_animation1->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    connect(m_frame1, &TPane::resized, this, &UI::redraw);
    m_open = false;

    connect(m_settingsbutton, &TButton::clicked, this, &UI::settingsButtonClicked);
    connect(m_devicesbutton, &TButton::clicked, this, &UI::devicesButtonClicked);
    connect(m_infobutton, &TButton::clicked, this, &UI::infoButtonClicked);

    m_layout2->addWidget(m_pinbutton);
    m_layout2->addWidget(m_openclose);
    m_layout2->setStretchFactor(m_openclose, 1);
    m_layout2->setAlignment(Qt::AlignTop);
    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);

    m_animation2->setTargetObject(m_frame2);
    m_animation2->setPropertyName("size");
    m_animation2->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    connect(m_frame2, &TPane::resized, this, &UI::redraw);
    m_pinned = false;

    connect(m_openclose, &TButton::clicked, this, &UI::openCloseButtonClicked);

    m_arrow->setParent(m_openclose);
    connect(m_arrow, &TButton::clicked, this, &UI::openCloseButtonClicked);

    m_pinbutton->setToggle(true);
    connect(m_pinbutton, &TButton::clicked, this, &UI::pinButtonClicked);

    m_animation3->setPropertyName("pos");
    m_animation3->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation3->setDuration(m_animationdelay);
    connect(m_animation3, &QPropertyAnimation::finished, this, &UI::animation3Finished);

    m_animation4->setPropertyName("pos");
    m_animation4->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation4->setDuration(m_animationdelay);
    connect(m_animation4, &QPropertyAnimation::finished, this, &UI::animation4Finished);

    m_frame1->show();
    m_frame2->show();
    stopSplash();

    emit started();
}


bool UI::appExists(const QString &id) const
{
    int n = m_appbuttons->count();
    for (int i = 0; i < n; ++i)
        if ((static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget())->id()) == id)
            return true;

    return false;
}


void UI::animation2Finished()
{
    qInfo() << qPrintable("UI: UI started");

    m_openingapp = false;

    if (!m_pendingapps.isEmpty()) {
        appOpen(m_pendingapps.first());
        m_pendingapps.removeFirst();
    }
}


void UI::animation3Finished()
{
    if (m_currapp->frame()->x() != 0) {
        m_currapp->setID("");
        m_currapp->frame()->deleteLater();
        m_currapp->close();

        int n = m_appbuttons->count();

        if (n > 0) {
            QObject *panel = m_frame0->children().at(m_frame0->children().count() - 2);
            QString classname = panel->metaObject()->className();
            QString sessionid;
            if (classname == "ClientSession")
                sessionid = static_cast<ClientSession *>(panel)->sessionID();
            else if (classname == "DevicesPanel")
                sessionid = "DEVICES";
            else if (classname == "SettingsPanel")
                sessionid = "SETTINGS";
            else if (classname == "InfoPanel")
                sessionid = "INFORMATION";
            else
                return;

            for (int i = 0; i < n; ++i) {
                TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
                appbutton->setActive(appbutton->id() == sessionid);
            }
        }
    }

    m_openingapp = false;

    if (!m_pendingapps.isEmpty()) {
        appOpen(m_pendingapps.first());
        m_pendingapps.removeFirst();
    }
}


void UI::animation4Finished()
{
    if (static_cast<TPane *>(m_animation4->targetObject())->x() > 20)
        m_animation4->targetObject()->deleteLater();
}


void UI::appButtonAdd(const QString &id, TPane *panel)
{
    TbButton *appbutton = new TbButton("left.button", this);

    connect(appbutton, &TbButton::clicked0, this, &UI::appShow);
    connect(appbutton, &TbButton::clicked1, this, &UI::appButtonDelete);

    appbutton->setID(id);
    appbutton->setFrame(panel);
    appbutton->setNumBlinds(1);
    appbutton->blind1()->setToolTip(tr("Close"));
    m_appbuttons->addWidget(appbutton);

    redraw();
    appShow(id);
}


void UI::appButtonDelete(const QString &id)
{
    int n = m_appbuttons->count();

    for (int i = 0; i < n; ++i)
        if ((static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget()))->id() == id) {
            m_currapp = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
            m_animation3->setTargetObject(m_currapp->frame());
            m_animation3->setStartValue(QPoint(0, 0));
            m_animation3->setEndValue(QPoint(m_frame0->width(), 0));
            m_animation3->start();
            break;
        }
}


void UI::appClose(const QString &id)
{
    int n = m_appbuttons->count();

    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
        if (appbutton->id() == id) {
            Message message(Message::C_CLOSESESSION, id);
            message.setSiteID(static_cast<ClientSession *>(appbutton->frame())->id().first(G_IDSIZE));
            emit messageOut(message);
            break;
        }
    }

    appButtonDelete(id);
}


void UI::appOpen(const QString &id)
{
    if (m_openingapp) {
        m_pendingapps.append(id);
        return;
    }

    m_openingapp = true;

    ClientSession *clientsession = new ClientSession(id, m_frame0);
    clientsession->resize(m_frame0->size());
    connect(clientsession, &ClientSession::installed, this, &UI::clientSessionInstalled);
    connect(clientsession, &ClientSession::error, this, &UI::clientSessionError);
    connect(clientsession, &ClientSession::closed, this, &UI::clientSessionClosed);
    connect(clientsession, &ClientSession::messageOut, this, &UI::messageFwOut);
    connect(this, &UI::messageFwIn, clientsession, &ClientSession::messageIn);
    clientsession->install();

    Message message(Message::C_OPENAPP, QByteArray("START"));
    emit messageOut(message);
}


void UI::appShow(const QString &id)
{
    int n = m_appbuttons->count();

    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
        if (appbutton->id() == id) {
            appbutton->setActive(true);
            m_currapp = appbutton;
            m_animation3->setTargetObject(m_currapp->frame());
            m_animation3->setStartValue(QPoint(m_frame0->width(), 0));
            m_animation3->setEndValue(QPoint(0, 0));
            m_currapp->frame()->move(m_frame0->width(), 0);
            m_currapp->frame()->raise();
            m_currapp->frame()->show();
            m_animation3->start();
        } else
            appbutton->setActive(false);
    }

    if (!m_pinned && m_open)
        openCloseButtonClicked();
}


void UI::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_settingsbutton->setToolTip(tr("Settings"));
        m_devicesbutton->setToolTip(tr("Devices"));
        m_infobutton->setToolTip(tr("Information"));
        m_pinbutton->setToolTip(tr("Pin left panel"));
        m_openclose->setToolTip(tr("Open / Close"));

        int n = m_appbuttons->count();

        for (int i = 0; i < n; ++i) {
            TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
            if (QString("DEVICES.SETTINGS.INFORMATION").contains(appbutton->id())) {
                tr("DEVICES");
                tr("SETTINGS");
                tr("INFORMATION");
                appbutton->setText(tr(appbutton->id().toUtf8()));
                appbutton->setToolTip(tr(appbutton->id().toUtf8()));
                appbutton->blind1()->setToolTip(tr("Close"));
            }
        }
    }

    QWidget::changeEvent(event);
}


void UI::clientSessionClosed(ClientSession *clientsession)
{
    appClose(clientsession->sessionID());
}


void UI::clientSessionError(ClientSession *clientsession)
{
    Message message1(Message::C_OPENAPP, clientsession->errormessage());
    emit messageFwIn(message1);

    if (clientsession->errormessage() == "ERRORCLIENT") {
        Message message2(Message::C_CLOSESESSION, clientsession->sessionID());
        message2.setSiteID(clientsession->id().first(G_IDSIZE));
        emit messageOut(message2);
    }

    appButtonDelete(clientsession->sessionID());

    m_openingapp = false;

    if (!m_pendingapps.isEmpty()) {
        appOpen(m_pendingapps.first());
        m_pendingapps.removeFirst();
    }
}


void UI::clientSessionInstalled(ClientSession *session)
{
    TbButton *appbutton = new TbButton("left.button", this);

    connect(appbutton, &TbButton::clicked0, this, &UI::appShow);
    connect(appbutton, &TbButton::clicked1, this, &UI::appClose);

    appbutton->setID(session->sessionID());
    appbutton->setText(session->caption());
    appbutton->setFrame(session);
    appbutton->setNumBlinds(1);
    appbutton->blind1()->setToolTip(tr("Close"));
    m_appbuttons->addWidget(appbutton);

    redraw();
    appShow(session->sessionID());

    Message message(Message::C_OPENAPP, QByteArray("OK"));
    emit messageFwIn(message);
    emit messageOut(message);
}


void UI::closeEvent(QCloseEvent *event)
{
    Q_UNUSED(event)

    if (G_SERVERONLY)
        return;

    qInfo() << qPrintable("UI: Quitting");

    if (windowState() == Qt::WindowMaximized)
        G_LOCALSETTINGS.set("ui.geometry", "max,"
                                               + qApp->screenAt(QPoint(x() + width() / 2, y() + height() / 2))->name());
    else
        G_LOCALSETTINGS.set("ui.geometry", QString::number(x())
                                               + "," + QString::number(y())
                                               + "," + QString::number(width())
                                               + "," + QString::number(height()));

    deleteLater();
}


void UI::confClose(const QString &id)
{
    TPane *settingsframe = nullptr;
    int n = m_appbuttons->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
        if (appbutton->id() == "SETTINGS") {
            settingsframe = appbutton->frame();
            break;
        }
    }

    if (!settingsframe)
        return;

    QList<ConfigSession *>sessions = settingsframe->findChildren<ConfigSession *>();
    ConfigSession *configsession = nullptr;
    for (ConfigSession *&session : sessions)
        if (session->id() == id) {
            configsession = session;
            break;
        }

    if (!configsession)
        return;

    m_animation4->setTargetObject(configsession);
    m_animation4->setStartValue(QPoint(configsession->x(), configsession->y()));
    m_animation4->setEndValue(QPoint(m_frame0->width(), configsession->y()));
    m_animation4->start();
}


void UI::confOpen(const QString &id)
{
    m_openingapp = true;

    SettingsPanel *settingsframe = nullptr;
    int n = m_appbuttons->count();

    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
        if (appbutton->id() == "SETTINGS") {
            settingsframe = static_cast<SettingsPanel *>(appbutton->frame());
            break;
        }
    }

    if (!settingsframe)
        return;

    ConfigSession *configsession = new ConfigSession(id, settingsframe);
    configsession->resize(m_frame0->size());
    connect(configsession, &ConfigSession::installed, this, &UI::configSessionInstalled);
    connect(configsession, &ConfigSession::error, this, &UI::configSessionError);
    connect(configsession, &ConfigSession::closed, this, &UI::configSessionClosed);
    connect(configsession, &ConfigSession::closed, settingsframe, &SettingsPanel::refreshName);
    connect(configsession, &ConfigSession::messageOut, this, &UI::messageFwOut);
    connect(this, &UI::messageFwIn, configsession, &ConfigSession::messageIn);
    settingsframe->redraw();
    configsession->install();
}


void UI::configSessionClosed(ConfigSession *session)
{
    confClose(session->id());
}


void UI::configSessionError(ConfigSession *session)
{
    Message message1(Message::C_OPENAPP, session->errormessage());
    emit messageFwIn(message1);

    Message message2(Message::C_CLOSESESSION, session->sessionID());
    message2.setSiteID(session->id().first(G_IDSIZE));
    emit messageOut(message2);

    appButtonDelete(session->sessionID());

    m_openingapp = false;

    if (!m_pendingapps.isEmpty()) {
        appOpen(m_pendingapps.first());
        m_pendingapps.removeFirst();
    }
}


void UI::configSessionInstalled(ConfigSession *session)
{
    m_animation4->setTargetObject(session);
    m_animation4->setStartValue(QPoint(m_frame0->width(), session->y()));
    m_animation4->setEndValue(QPoint((static_cast<SettingsPanel *>(session->parentWidget()))->spacing(), session->y()));
    session->move(m_frame0->width(), session->y());
    session->raise();
    session->show();
    m_animation4->start();

    Message message(Message::C_OPENCONF, QByteArray("OK"));
    emit messageFwIn(message);
}


void UI::devicesButtonClicked()
{
    if (appExists("DEVICES"))
        appShow("DEVICES");
    else {
        DevicesPanel *devicespanel = new DevicesPanel(m_frame0);
        connect(devicespanel, &DevicesPanel::closed, this, &UI::devicesPanelClosed);
        connect(devicespanel, &DevicesPanel::messageOut, this, &UI::messageFwOut);
        connect(this, &UI::messageFwIn, devicespanel, &DevicesPanel::messageIn);

        devicespanel->install();
        appButtonAdd("DEVICES", devicespanel);
        changeEvent(new QEvent(QEvent::LanguageChange));
    }
}


void UI::devicesPanelClosed()
{
    appButtonDelete("DEVICES");
}


void UI::infoButtonClicked()
{
    if (appExists("INFORMATION"))
        appShow("INFORMATION");
    else {
        InfoPanel *infopanel = new InfoPanel(m_frame0);
        connect(infopanel, &InfoPanel::closed, this, &UI::infoPanelClosed);
        connect(infopanel, &InfoPanel::messageOut, this, &UI::messageFwOut);
        connect(this, &UI::messageFwIn, infopanel, &InfoPanel::messageIn);

        infopanel->install();
        appButtonAdd("INFORMATION", infopanel);
        changeEvent(new QEvent(QEvent::LanguageChange));
    }
}


void UI::infoPanelClosed()
{
    appButtonDelete("INFORMATION");
}


void UI::messageFwOut(const Message &message)
{
    switch (message.command()) {

    //** message.data() => empty
    case Message::C_SETLANGUAGE:
        setLanguage();
        return;

        //** message.data() => empty
    case Message::C_SETTHEME:
        setTheme();
        return;

        //** message.data() => site id + device id
    case Message::C_OPENAPP:
        appOpen(message.data());
        return;

        //** message.data => site id + device id
    case Message::C_CANCELAPP:
        m_openingapp = false;
        return;

        //** message.data() => site id + device id
    case Message::C_OPENCONF:
        confOpen(message.data());
        return;

        //** message.data => site id + device id
    case Message::C_CANCELCONF:
        m_openingapp = false;
        return;

    default:
        emit messageOut(message);
        return;
    }
}


void UI::moveEvent(QMoveEvent *event)
{
    QWidget::moveEvent(event);
    redraw();
}


void UI::notice(const QByteArray notice)
{
    if (notice.isEmpty())
        return;

    QByteArray ver, mes;
    qsizetype pos = notice.indexOf('\n');

    if (pos < 0) {
        ver = notice.trimmed();
        mes = "";
    } else {
        ver = notice.first(pos).trimmed();
        mes = notice.sliced(pos + 1).trimmed();
    }

    QString text = "";

    if (verToInt(ver) > verToInt(APP_VERSION))
        text += tr("New version") + " " + ver + " --- <a href=\"https://nilibox.com/DOWNLOADS\" style=\"text-decoration:none\">" + tr("Download here!") + "</a>";

    if (!mes.isEmpty() && ver != APP_VERSION)
        text += "<br><br>";

    if (!mes.isEmpty())
        text += mes;

    m_loading->setText(text);
}


void UI::openCloseButtonClicked()
{
    m_open = !m_open;

    m_animation1->setStartValue(QSize(0, height()));
    m_animation1->setEndValue(QSize(m_UIratio1 * G_UNIT_L, height()));
    m_animation1->setDuration(m_animationdelay);
    m_animation1->setDirection(m_open ? QAbstractAnimation::Forward : QAbstractAnimation::Backward);
    connect(m_animation1, &QPropertyAnimation::finished, this, &UI::redraw);
    m_animation1->start();
}


void UI::pinButtonClicked()
{
    m_pinned = !m_pinned;

    m_animation0->setStartValue(QSize(width() - m_frame2->width(), height()));
    m_animation0->setEndValue(QSize(width() - m_frame1->width() - m_frame2->width(), height()));
    m_animation0->setDuration(m_animationdelay);
    m_animation0->setDirection(m_pinned ? QAbstractAnimation::Forward : QAbstractAnimation::Backward);
    connect(m_animation0, &QPropertyAnimation::finished, this, &UI::redraw);
    m_animation0->start();
}


void UI::redraw()
{
    QFont tfont = font();
    tfont.setPointSizeF(10);

    float dpi;

    QScreen *screen = qApp->screenAt(pos() + QPoint(width() / 2, height() / 2));
    if (screen != m_screen && screen)
        m_screen = screen;
    G_PIXELRATIO = m_screen->devicePixelRatio();

    if (m_dpi < 1)
        dpi = m_screen->physicalDotsPerInchX();
    else {
        if (G_TOUCH)
            dpi = m_dpi * sqrt(G_PIXELRATIO);
        else
            dpi = m_dpi;
    }

    float lmin = m_UIminunit * dpi / 25.4;
    float lmax = m_UImaxunit * dpi / 25.4;

    G_UNIT_L = qBound(lmin, m_UIratio * width(), lmax);
    G_UNIT_S = 0.10 * G_UNIT_L;
    G_UNIT_F = 0.45 * G_UNIT_L;

    m_loading->setGeometry(G_UNIT_S, 0.85 * m_frame0->height(), m_frame0->width() - G_UNIT_S, 0.15 * m_frame0->height());

    if (m_splash) {
        m_frame0->setGeometry(0, m_topmargin, width(), height() - m_topmargin);
        m_logo->resize(qMin(m_logo->pixmap().width(), static_cast<int>(0.7 * m_frame0->width())), qMin(m_logo->pixmap().height(), static_cast<int>(0.7 * m_frame0->height())));
        m_logo->move((m_frame0->width() - m_logo->width()) / 2, (m_frame0->height() - m_logo->height()) / 2);
        return;
    }

    int width2;
    if (m_animation2->state() == QAbstractAnimation::Stopped)
        width2 = G_UNIT_L;
    else
        width2 = m_frame2->width();

    int w2 = qMax(0, width2 - m_frame2->horizontalGap());

    int width1;
    float r;

    if (m_animation1->state() == QAbstractAnimation::Stopped) {
        if (m_open) {
            width1 = m_UIratio1 * G_UNIT_L;
            r = 180;
            m_pinbutton->setFixedWidth(w2);
        } else {
            width1 = 0;
            r = 0;
            m_pinbutton->setFixedWidth(0);
        }
    } else {
        width1 = m_frame1->width();
        r = 180 * m_animation1->currentTime() / m_animation1->totalDuration();
        m_pinbutton->setFixedWidth(0);
    }

    int width0;

    if (m_animation0->state() == QAbstractAnimation::Stopped) {
        if (m_pinned) {
            width0 = width() - width1 - width2;
            m_openclose->setVisible(false);
        } else {
            width0 = width() - width2;
            m_openclose->setVisible(true);
        }
    } else {
        width0 = m_frame0->width();
        m_openclose->setVisible(true);
    }

    m_frame0->setGeometry(width() - width0, m_topmargin, width0, height() - m_topmargin);
    m_frame1->setGeometry(0, m_topmargin, width1, height() - m_topmargin);
    m_frame2->setGeometry(width1, m_topmargin, width2, height() - m_topmargin);
    m_frame11->setHeight(1.5 * G_UNIT_L);
    m_pinbutton->setFixedHeight(w2);
    m_arrow->setGeometry(0, height() / 2 -  1.5 * width2, w2, w2);
    m_arrow->rotate(r);
    m_logo->resize(qMin(m_logo->pixmap().width(), static_cast<int>(0.7 * m_frame0->width())), qMin(m_logo->pixmap().height(), static_cast<int>(0.7 * m_frame0->height())));
    m_logo->move((m_frame0->width() - m_logo->width()) / 2, (m_frame0->height() - m_logo->height()) / 2);

    tfont.setPixelSize(G_UNIT_F);

    if (tfont.pixelSize() != font().pixelSize()) {
        setFont(tfont);
        QList<QWidget *>widgets = findChildren<QWidget *>();
        for (QWidget *&widget : widgets) {
            tfont = widget->font();
            tfont.setPixelSize(G_UNIT_F);
            widget->setFont(tfont);
        }
    }

    G_APPUNIT_L = qBound(0.0, (m_frame0->width() - 2 * m_appPadding * G_UNIT_S - 2) / m_UIratio2, lmax);
    G_APPUNIT_S = 0.10 * G_APPUNIT_L;
    G_APPUNIT_F = 0.45 * G_APPUNIT_L;

    for (int i = 0; i < m_appbuttons->count(); ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appbuttons->itemAt(i)->widget());
        appbutton->setWidth(width1 - m_frame1->horizontalGap());
        if (!appbutton->id().isEmpty() && m_animation3->state() == QAbstractAnimation::Stopped)
            appbutton->frame()->setSize(m_frame0->size());
    }
}


void UI::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);
    redraw();
}


void UI::setLanguage()
{
    m_langname = G_LOCALSETTINGS.get("ui.language");
    QString locale = m_langname;
    locale = locale.replace(".rcc", "");
    qsizetype pos = locale.lastIndexOf("/");
    if (pos > -1)
        locale = locale.sliced(pos + 1);

    QLocale::setDefault(QLocale(locale));

    if (m_langname.startsWith("custom"))
        m_langname = G_LOCALSETTINGS.localFilePath() + "/" + m_langname;
    else
        m_langname = ":/resources/" + m_langname;

    QString langpath;

    if (m_langname.endsWith(".rcc")) {
        langpath = ":/language";
        QResource::registerResource(m_langname, "/language");
    } else
        langpath = m_langname;

    if (G_VERBOSE) qInfo() << qPrintable("UI: Loading language from " + m_langname);

    for (QTranslator *&trans : G_TRANS) {
        qApp->removeTranslator(trans);
        trans->deleteLater();
    }

    G_TRANS.clear();

    QTranslator *translator = new QTranslator();

    if (translator->load(langpath + "/trans.qm")) {
        qApp->installTranslator(translator);
        G_TRANS << translator;
    }

    QList<App *>apps = findChildren<App *>();
    for (App *&app : apps)
        app->loadTranslator();

    if (m_langname.endsWith(".rcc"))
        QResource::unregisterResource(m_langname, "/language");
}


void UI::setTheme()
{
    QString filepath;

    if (!m_themename.isEmpty()) {
        if (m_themename.startsWith("custom"))
            filepath = G_LOCALSETTINGS.localFilePath() + "/" + m_themename;
        else
            filepath = ":/resources/" + m_themename;

        QResource::unregisterResource(filepath, "/theme");
    }

    m_themename = G_LOCALSETTINGS.get("ui.theme");

    if (m_themename.startsWith("custom"))
        filepath = G_LOCALSETTINGS.localFilePath() + "/" + m_themename;
    else
        filepath = ":/resources/" + m_themename;

    if (!filepath.endsWith(".rcc")) {
        compileRCC(filepath);
        filepath.append(".rcc");
        m_themename.append(".rcc");
    }

    QResource::registerResource(filepath, "/theme");

    if (G_VERBOSE) qInfo() << qPrintable("UI: Loading theme from " + filepath);

    G_THEME.clear();
    Settings theme;
    theme.loadFile(":/theme/style.set");
    QList<QString> ktheme = theme.keys();
    QString newkey;
    qsizetype pos;

    for (QString &inikey : ktheme) {
        pos = inikey.indexOf(":");
        if (pos > -1) {
            newkey = inikey.first(pos);
            for (QString &key : QList<QString>({"active", "enabled", "hover", "pressed"})) {
                if (inikey.contains(":" + key))
                    newkey.append("Y");
                else if (inikey.contains(":!" + key))
                    newkey.append("N");
                else
                    newkey.append("*");
            }
        } else
            newkey = inikey + "****";
        G_THEME.set(newkey, theme.get(inikey).replace(" ", "").replace("\t", ""));
    }

    G_STYLECACHE.clear();

    m_appPadding = getStyleFromTheme("TPane", "app", "****", "padding").toFloat();

    redraw();

    QList<TPane *> widgets = findChildren<TPane *>();
    QString classname;
    for (TPane *&widget : widgets) {
        classname = widget->metaObject()->className();

        if (classname == "TbButton")
            static_cast<TbButton *>(widget)->reload();
        else if (classname == "TButton")
            static_cast<TButton *>(widget)->reload();
        else if (classname == "TcFrame")
            static_cast<TcFrame *>(widget)->reload();
        else if (classname == "TCheck")
            static_cast<TCheck *>(widget)->reload();
        else if (classname == "TComboBox")
            static_cast<TComboBox *>(widget)->reload();
        else if (classname == "TFrame")
            static_cast<TFrame *>(widget)->reload();
        else if (classname == "TLabel")
            static_cast<TLabel *>(widget)->reload();
        else if (classname == "TLineEdit")
            static_cast<TLineEdit *>(widget)->reload();
        else if (classname == "TList")
            static_cast<TList *>(widget)->reload();
        else if (classname == "TPane")
            static_cast<TPane *>(widget)->reload();
        else if (classname == "TPopup")
            static_cast<TPopup *>(widget)->reload();
        else if (classname == "TTextEdit")
            static_cast<TTextEdit *>(widget)->reload();
        else
            widget->reload();
    }

    QList<App *> apps = findChildren<App *>();
    for (App *&app : apps)
        app->loadTheme();
}


void UI::settingsButtonClicked()
{
    if (appExists("SETTINGS"))
        appShow("SETTINGS");
    else {
        SettingsPanel *settingspanel = new SettingsPanel(m_frame0);
        connect(settingspanel, &SettingsPanel::closed, this, &UI::settingsPanelClosed);
        connect(settingspanel, &SettingsPanel::messageOut, this, &UI::messageFwOut);
        connect(this, &UI::messageFwIn, settingspanel, &SettingsPanel::messageIn);

        settingspanel->install();
        appButtonAdd("SETTINGS", settingspanel);
        changeEvent(new QEvent(QEvent::LanguageChange));
    }
}


void UI::settingsPanelClosed()
{
    appButtonDelete("SETTINGS");
}


void UI::stopSplash()
{
    m_loading->setActive(false);
    m_splash = false;

    m_animation2->setStartValue(QSize(0, height()));
    m_animation2->setEndValue(QSize(G_UNIT_L, height()));
    m_animation2->setDuration(m_animationdelay);
    m_animation2->setDirection(QAbstractAnimation::Forward);
    connect(m_animation2, &QPropertyAnimation::finished, this, &UI::animation2Finished);
    m_animation2->start();

#if defined OS_LINUX
    if (!QFile::exists(G_LOCALSETTINGS.localFilePath() + "/init")) {
        m_loading->setText(tr("Initialization script has not been run.<br>Please run 'sudo ./init.sh' from the niliBOX directory<br>and restart the computer."));
        return;
    }
#endif

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, [=]() {
        notice(httpsession->data());
        httpsession->deleteLater();
    });
    httpsession->post(m_masterserver, "command=getnotice");
}
