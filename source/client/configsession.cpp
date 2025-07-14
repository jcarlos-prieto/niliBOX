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
#include "client/configsession.h"
#include "common/common.h"
#include "ui/tbutton.h"
#include "ui/tcombobox.h"
#include "ui/tlineedit.h"
#include "ui/tlist.h"
#include "ui/tpopup.h"
#include <QDateTime>
#include <QFormLayout>
#include <QTimer>
#include <QVariantAnimation>

#if defined OS_IOS
#include "common/box.h"
#endif


ConfigSession::ConfigSession(QString id, QWidget *parent) : TPane("config", parent)
{
    m_id = id;
    m_siteid = m_id.first(G_IDSIZE);
    m_deviceid = m_id.last(G_IDSIZE);

    m_frame0 = new TPane("config.header", this);
    m_appcaption = new TLabel("config.header.caption", this);
    m_closebutton = new TButton("config.header.close", this);
    m_frame1 = new TPane("config.container.fields", this);
    m_ldevid = new TLabel("config.container.fields.name.label", this);
    m_devid = new TLineEdit("config.container.fields.name.field", this);
    m_lname = new TLabel("config.container.fields.name.label", this);
    m_name = new TLineEdit("config.container.fields.name.field", this);
    m_ldescription = new TLabel("config.container.fields.desc.label", this);
    m_description = new TLineEdit("config.container.fields.desc.field", this);
    m_frame11 = new TPane("config.container.fields.mode", this);
    m_lmode = new TLabel("config.container.fields.mode.label", this);
    m_allowed = new TButton("config.container.fields.mode.allowed", this);
    m_allowedlist = new TList("", this);
    m_mode = new TComboBox("config.container.fields.mode.field", this);
    m_frame2 = new TPane("config.container", this);
    m_app = new App(this);
    m_popup = new TPopup(this);

    m_devid->setEnabled(false);
    m_devid->setText(m_siteid + "&" + m_deviceid);

    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout1 = new QFormLayout(m_frame1);
    m_layout11 = new QHBoxLayout(m_frame11);
    m_layout2 = new QHBoxLayout(m_frame2);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout->addWidget(m_frame0);
    m_layout->addWidget(m_frame1);
    m_layout->addWidget(m_frame2);
    m_layout->setStretchFactor(m_frame2, 1);

    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_appcaption);
    m_layout0->addWidget(m_closebutton);
    m_layout0->setStretchFactor(m_appcaption, 1);
    connect(m_closebutton, &TButton::clicked, this, &ConfigSession::closeButtonClicked);

    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_layout1->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout1->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout1->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout1->setLabelAlignment(Qt::AlignLeft);
    m_layout1->addRow(m_ldevid, m_devid);
    m_layout1->addRow(m_lname, m_name);
    m_layout1->addRow(m_ldescription, m_description);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_layout11->addWidget(m_mode);
    m_layout11->addWidget(m_allowed);
    m_allowed->setToggle(true);
    m_layout1->addRow(m_lmode, m_frame11);

    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);
    m_layout2->addWidget(m_app);
    m_layout2->setAlignment(Qt::AlignTop);

    m_allowedlist->setFixedHeight(0);
    m_allowedlist->setMultiSelection(true);

    connect(m_name, &TLineEdit::textChanged, this, &ConfigSession::changedName);
    connect(m_description, &TLineEdit::textChanged, this, &ConfigSession::changedDescription);
    connect(m_mode, &TComboBox::activated, this, &ConfigSession::changedMode);
    connect(m_allowed, &TButton::clicked, this, &ConfigSession::allowedClicked);
    connect(m_allowedlist, &TList::itemClicked, this, &ConfigSession::allowedListClicked);

    m_animation = new QVariantAnimation(this);
    m_animation->setEasingCurve(static_cast<QEasingCurve::Type>(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation->setStartValue(0.0);
    m_animation->setEndValue(1.0);
    connect(m_animation, &QVariantAnimation::valueChanged, this, &ConfigSession::redraw);

    reload();

    connect(m_app, &App::installed, this, &ConfigSession::appInstalled);
    connect(m_app, &App::error, this, &ConfigSession::appError);
    connect(m_app, &App::sendSignal, this, &ConfigSession::send);
    connect(m_app, &App::resized, this, &ConfigSession::redraw);
    connect(m_app, &App::reqRemoteBox, this, &ConfigSession::messageOut);

    connect(m_popup, &TPopup::optionSelected, this, &ConfigSession::popupOptionSelected);
}


ConfigSession::~ConfigSession()
{

}


QString ConfigSession::errormessage() const
{
    return m_error;
}


QString ConfigSession::id() const
{
    return m_id;
}


QString ConfigSession::sessionID() const
{
    return m_sessionid;
}


QString ConfigSession::caption() const
{
    return m_caption;
}


void ConfigSession::install()
{
    if (G_VERBOSE) qInfo() << qPrintable("CONFIGSESSION: Installing config session for device " + m_id.first(G_IDSIZE) + "&" + m_id.last(G_IDSIZE));

    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    m_caption = G_CONFIG.get("devices." + m_deviceid + ".driver") + " :: " + G_CONFIG.get("devices." + m_deviceid + ".name");
    m_appcaption->setText(m_caption);
    m_sessionid = m_caption;
    m_name->setText(G_CONFIG.get("devices." + m_deviceid + ".name"));
    m_description->setText(G_CONFIG.get("devices." + m_deviceid + ".description"));

    QString mode = G_CONFIG.get("devices." + m_deviceid + ".mode");
    if (!mode.isEmpty())
        m_mode->setCurrentIndex(G_CONFIG.get("devices." + m_deviceid + ".mode").toInt());
    else
        m_mode->setCurrentIndex(1);
    changedMode();

    Message message(Message::C_GETDRIVERCONFIG, G_CONFIG.get("devices." + m_deviceid + ".driver"));
    message.setSiteID(m_siteid);
    m_messageseq = message.sequence();
    emit messageOut(message);

    loadAllowed();
}


void ConfigSession::messageIn(const Message &message)
{
    if (message.command() == Message::C_GETDRIVERCONFIG && message.sequence() == m_messageseq) {
        G_CONFIG.set("id", m_id);
        G_CONFIG.set("type", "config");
        Settings params = G_CONFIG.extractSettings("devices." + m_deviceid + ".config");
        m_app->install(message.data(), &G_CONFIG, params);

    } else if (message.command() == Message::C_REMOTEBOX) {
        m_app->receivebox(message);
    }
}


void ConfigSession::allowedClicked()
{
    loadAllowed();
    m_animation->setDirection(m_allowed->isPressed() ? QAbstractAnimation::Forward : QAbstractAnimation::Backward);
    m_animation->start();
}


void ConfigSession::allowedListClicked()
{
    G_CONFIG.set("devices." + m_deviceid + ".allowed", m_allowedlist->getRows(true));
}


void ConfigSession::appError()
{
    m_error = "ERRORCLIENT";
    emit error(this);
}


void ConfigSession::appInstalled()
{
    m_app->setFocus();

    QTimer::singleShot(200, this, &ConfigSession::redraw);

    emit installed(this);
}


void ConfigSession::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_closebutton->setToolTip(tr("Close"));
        m_ldevid->setText(tr("Device ID:"));
        m_lname->setText(tr("Name:"));
        m_ldescription->setText(tr("Description:"));
        m_lmode->setText(tr("Mode:"));
        int temp = m_mode->currentIndex();
        m_mode->clear();
        m_mode->addItem(tr("0 - Local"));
        m_mode->addItem(tr("1 - Near"));
        m_mode->addItem(tr("2 - Remote"));
        m_mode->addItem(tr("3 - Public"));
        m_mode->setCurrentIndex(temp);
        m_allowed->setText(tr("Allowed"));
    }
}


void ConfigSession::changedDescription()
{
    G_CONFIG.set("devices." + m_deviceid + ".description", m_description->text());
}


void ConfigSession::changedMode()
{
    G_CONFIG.set("devices." + m_deviceid + ".mode", QString::number(m_mode->currentIndex()));
    m_allowed->setEnabled(m_mode->currentIndex() > 1);
}


void ConfigSession::changedName()
{
    G_CONFIG.set("devices." + m_deviceid + ".name", m_name->text());

    m_caption = G_CONFIG.get("devices." + m_deviceid + ".driver") + " :: " + G_CONFIG.get("devices." + m_deviceid + ".name");
    m_appcaption->setText(m_caption);
}


void ConfigSession::closeButtonClicked()
{
    emit closed(this);
}


void ConfigSession::loadAllowed()
{
    m_allowedlist->clear();
    m_allowedlist->addRow("[all]");
    QList<QString> groups = G_CONFIG.rootkeys("site.groups");
    m_allowedlist->addRow(groups.join(";"));

    if (G_CONFIG.find("devices." + m_deviceid + ".allowed") == G_CONFIG.end())
        m_allowedlist->selectRow("[all]");
    else
        m_allowedlist->selectRow(G_CONFIG.get("devices." + m_deviceid + ".allowed"));

    allowedListClicked();
}


void ConfigSession::popupOptionSelected()
{
    if (m_popup->instance() == "ErrorRemote" && m_popup->selected() == tr("Accept")) {
        m_error = "ERRORWATCHDOG";
        emit error(this);
    }
}


void ConfigSession::redraw()
{
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_ldevid->setHeight(G_UNIT_L);
    m_devid->setHeight(G_UNIT_L);
    m_lname->setHeight(G_UNIT_L);
    m_name->setHeight(G_UNIT_L);
    m_ldescription->setHeight(G_UNIT_L);
    m_description->setHeight(G_UNIT_L);
    m_mode->setHeight(G_UNIT_L);
    m_allowed->setHeight(G_UNIT_L);

    m_frame2->setWidth(width() - m_layout->contentsMargins().left() - m_layout->contentsMargins().right());

    m_app->updateGlobalValues();

    float x;
    if (m_animation->state() == QVariantAnimation::Running) {
        x = m_animation->currentValue().toDouble();
    } else {
        if (m_allowed->isPressed())
            x = 1.0;
        else
            x = 0.0;
    }

    QPoint allowedpos = m_allowed->mapTo(this, QPoint(0, 0));
    m_allowedlist->setSize(m_allowed->width(), x * allowedpos.y() - G_UNIT_L - G_UNIT_S);
    m_allowedlist->move(allowedpos.x(), (1 - x) * allowedpos.y() + G_UNIT_L + G_UNIT_S);

    m_popup->redraw();
}


void ConfigSession::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}


void ConfigSession::send(const QString &key, const QString &value)
{
    G_CONFIG.set("devices." + m_deviceid + ".config." + key, value);
}
