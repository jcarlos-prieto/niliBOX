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
#include "common/common.h"
#include "ui/deviceconfigpanel.h"
#include "ui/tbutton.h"
#include "ui/tcombobox.h"
#include "ui/tlineedit.h"
#include "ui/tlist.h"
#include "ui/ttextedit.h"
#include <QFormLayout>
#include <QVariantAnimation>


DeviceConfigPanel::DeviceConfigPanel(const QString &siteid, const QString &deviceid, Settings *config, QWidget *parent) : TcFrame("deviceconf", parent)
{
    m_siteid = siteid;
    m_devid = deviceid;
    m_id = m_siteid + m_devid;
    m_config = config;

    setText(m_config->get("devices." + deviceid + ".name"));

    m_frame0 = new TPane("deviceconf.container", this);
    m_frame1 = new TPane("deviceconf.container.header", this);
    m_deletebutton = new TButton("deviceconf.container.header.delete", this);
    m_frame2 = new TPane("deviceconf.container.fields", this);
    m_ldeviceid = new TLabel("deviceconf.container.fields.deviceid.label", this);
    m_deviceid = new TLineEdit("deviceconf.container.fields.deviceid.field", this);
    m_ldrivername = new TLabel("deviceconf.container.fields.drivername.label", this);
    m_drivername = new TLineEdit("deviceconf.container.fields.drivername.field", this);
    m_lname = new TLabel("deviceconf.container.fields.name.label", this);
    m_name = new TLineEdit("deviceconf.container.fields.name.field", this);
    m_ldescription = new TLabel("deviceconf.container.fields.desc.label", this);
    m_description = new TTextEdit("deviceconf.container.fields.desc.field", this);
    m_frame21 = new TPane("deviceconf.container.fields.mode", this);
    m_lmode = new TLabel("deviceconf.container.fields.mode.label", this);
    m_allowed = new TButton("deviceconf.container.fields.mode.allowed", this);
    m_allowedlist = new TList("", this);
    m_mode = new TComboBox("deviceconf.container.fields.mode.field", this);
    m_frame3 = new TPane("deviceconf.container.conf", this);
    m_app = new App(this);

    m_layout0 = new QVBoxLayout(m_frame0);
    m_layout1 = new QHBoxLayout(m_frame1);
    m_layout2 = new QFormLayout(m_frame2);
    m_layout21 = new QHBoxLayout(m_frame21);
    m_layout3 = new QVBoxLayout(m_frame3);

    m_layout0->addWidget(m_frame1);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_layout1->setAlignment(Qt::AlignRight);
    m_layout1->addWidget(m_deletebutton);
    QObject::connect(m_deletebutton, &TButton::clicked, this, &DeviceConfigPanel::deleteButtonClicked);

    m_layout0->addWidget(m_frame2);
    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);
    m_layout2->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout2->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout2->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout2->setLabelAlignment(Qt::AlignLeft);
    m_layout2->addRow(m_ldeviceid, m_deviceid);
    m_layout2->addRow(m_ldrivername, m_drivername);
    m_layout2->addRow(m_lname, m_name);
    QObject::connect(m_name, &TLineEdit::textChanged, this, &DeviceConfigPanel::setText);
    m_layout2->addRow(m_ldescription, m_description);
    m_layout21->addWidget(m_mode);
    QObject::connect(m_mode, &TComboBox::currentIndexChanged, this, &DeviceConfigPanel::changedMode);
    m_layout21->addWidget(m_allowed);
    m_allowed->setToggle(true);
    QObject::connect(m_allowed, &TButton::clicked, this, &DeviceConfigPanel::allowedClicked);
    QObject::connect(m_allowedlist, &TList::itemClicked, this, &DeviceConfigPanel::allowedListClicked);
    m_layout2->addRow(m_lmode, m_frame21);

    m_layout0->addWidget(m_frame3);
    m_layout3->setContentsMargins(0, 0, 0, 0);
    m_layout3->setSpacing(0);
    m_layout3->addWidget(m_app);
    QObject::connect(m_app, &App::installed, this, &DeviceConfigPanel::appInstalled);
    QObject::connect(m_app, &App::sendSignal, this, &DeviceConfigPanel::configAppPropertyChanged);
    QObject::connect(m_app, &App::sendbinSignal, this, &DeviceConfigPanel::configAppPropertyChanged);
    QObject::connect(m_app, &App::resized, this, &DeviceConfigPanel::redraw);
    QObject::connect(m_app, &App::reqRemoteBox, this, &DeviceConfigPanel::messageOut);

    m_deviceid->setEnabled(false);
    m_drivername->setEnabled(false);
    m_allowedlist->setFixedHeight(0);
    m_allowedlist->setMultiSelection(true);

    m_animation = new QVariantAnimation(this);
    m_animation->setEasingCurve(static_cast<QEasingCurve::Type>(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation->setStartValue(0.0);
    m_animation->setEndValue(1.0);
    QObject::connect(m_animation, &QVariantAnimation::valueChanged, this, &DeviceConfigPanel::redraw);

    setContent(m_frame0);
    redraw();
}


DeviceConfigPanel::~DeviceConfigPanel()
{

}


void DeviceConfigPanel::commit() const
{
    if (m_config->getSettings("devices." + m_devid).count() == 0)
        return;

    m_config->set("devices." + m_devid + ".name", m_name->text());
    m_config->set("devices." + m_devid + ".description", m_description->text());
    m_config->set("devices." + m_devid + ".mode", QString::number(m_mode->currentIndex()));
    m_config->remove("devices." + m_devid + ".locked");
}


void DeviceConfigPanel::deleteButtonClicked()
{
    m_config->clear("devices." + m_devid);
    smash();
}


void DeviceConfigPanel::install()
{
    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    m_deviceid->setText(m_siteid + "&" + m_devid);
    m_drivername->setText(m_config->get("drivers." + m_config->get("devices." + m_devid + ".driver") + ".displayname"));
    m_name->setText(m_config->get("devices." + m_devid + ".name"));
    m_description->setText(m_config->get("devices." + m_devid + ".description"));

    if (m_config->contains("devices." + m_devid + ".mode"))
        m_mode->setCurrentIndex(m_config->get("devices." + m_devid + ".mode").toInt());
    else
        m_mode->setCurrentIndex(1);

    Message message(Message::C_GETDRIVERCONFIG, m_config->get("devices." + m_devid + ".driver"));
    message.setSiteID(m_siteid);
    m_messageseq = message.sequence();
    emit messageOut(message);

    loadAllowed();
}


void DeviceConfigPanel::messageIn(const Message &message) const
{
    if (message.command() == Message::C_GETDRIVERCONFIG && message.sequence() == m_messageseq) {
        m_config->set("id", m_id);
        m_config->set("type", "config");
        Settings params = m_config->extractSettings("devices." + m_devid + ".config");
        m_app->install(message.data(), m_config, params);
    }
}


void DeviceConfigPanel::appInstalled()
{
    redraw();
    emit installed();
}


void DeviceConfigPanel::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_deletebutton->setToolTip(tr("Remove device"));
        m_ldeviceid->setText(tr("ID:"));
        m_lname->setText(tr("Name:"));
        m_ldescription->setText(tr("Description:"));
        m_ldrivername->setText(tr("Driver:"));
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


void DeviceConfigPanel::configAppPropertyChanged(const QString &key, const QString &value)
{
    m_config->set("devices." + m_devid + ".config." + key, value);
}


void DeviceConfigPanel::changedMode()
{
    m_allowed->setEnabled(m_mode->currentIndex() > 1);
}


void DeviceConfigPanel::allowedClicked()
{
    loadAllowed();
    m_animation->setDirection(m_allowed->isPressed() ? QAbstractAnimation::Forward : QAbstractAnimation::Backward);
    m_animation->start();
}


void DeviceConfigPanel::allowedListClicked()
{
    m_config->set("devices." + m_devid + ".allowed", m_allowedlist->getRows(true));
}


void DeviceConfigPanel::loadAllowed()
{
    m_allowedlist->clear();
    m_allowedlist->addRow("[all]");
    QList<QString> groups = m_config->rootkeys("site.groups");
    m_allowedlist->addRow(groups.join(";"));

    if (m_config->find("devices." + m_devid + ".allowed") == m_config->end())
        m_allowedlist->selectRow("[all]");
    else
        m_allowedlist->selectRow(m_config->get("devices." + m_devid + ".allowed"));

    allowedListClicked();
}


void DeviceConfigPanel::redraw()
{
    m_app->updateGlobalValues();
    m_app->adjustSize();

    m_deletebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_frame1->setHeight(m_deletebutton->height());
    m_ldeviceid->setHeight(G_UNIT_L);
    m_deviceid->setHeight(G_UNIT_L);
    m_ldrivername->setHeight(G_UNIT_L);
    m_drivername->setHeight(G_UNIT_L);
    m_lname->setHeight(G_UNIT_L);
    m_name->setHeight(G_UNIT_L);
    m_ldescription->setHeight(2 * G_UNIT_L);
    m_description->setHeight(2 * G_UNIT_L);
    m_mode->setHeight(G_UNIT_L);
    m_allowed->setHeight(G_UNIT_L);
    m_frame2->setHeight(qMax(m_ldeviceid->height(), m_deviceid->height()) +
                       qMax(m_ldrivername->height(), m_drivername->height()) +
                       qMax(m_lname->height(), m_name->height()) +
                       qMax(m_ldescription->height(), m_description->height()) +
                       qMax(m_lmode->height(), m_mode->height()) +
                       4 * m_frame2->spacing());
    m_frame3->setHeight(m_app->height() + m_frame3->spacing());
    m_frame0->setHeight(m_frame1->height() + m_frame2->height() + m_frame3->height() + 2 * m_frame0->spacing());

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
}


void DeviceConfigPanel::resizeEvent(QResizeEvent *event)
{
    TcFrame::resizeEvent(event);
    redraw();
}
