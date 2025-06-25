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
#include "common/httpsession.h"
#include "ui/devicespanel.h"
#include "ui/tbbutton.h"
#include "ui/tcframe.h"
#include "ui/tcombobox.h"
#include "ui/tframe.h"
#include "ui/tlineedit.h"
#include "ui/tpopup.h"
#include <QFormLayout>
#include <QListView>
#include <QMessageBox>
#include <QPropertyAnimation>
#include <QScrollArea>
#include <QScroller>
#include <QTimer>


DevicesPanel::DevicesPanel(QWidget *parent) : TPane("devices", parent)
{
    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");

    m_frame0 = new TPane("devices.header", this);
    m_refreshbutton = new TButton("devices.header.refresh", this);
    m_closebutton = new TButton("devices.header.close", this);
    m_frame1 = new TPane("devices.body", this);
    m_frame10 = new TPane("devices.body", this);
    m_iconfavorites = new TPane("devices.iconfavorites", this);
    m_frame101 = new TFrame("devices.favorites", this);
    m_newfavorite = new TcFrame("devices.favorites.new", this);
    m_newfavoritepanel = new TPane("devices.favorites.new.container", this);
    m_lnewfavoriteid = new TLabel("devices.favorites.new.id.label", this);
    m_newfavoriteid = new TLineEdit("devices.favorites.new.id.field", this);
    m_frame10101 = new TPane("devices.favorites.new.buttons", this);
    m_newfavoriteinfobutton = new TButton("devices.favorites.new.info", this);
    m_newfavoriteacceptbutton = new TButton("devices.favorites.new.accept", this);
    m_newfavoritecancelbutton = new TButton("devices.favorites.new.cancel", this);
    m_frame1011 = new TPane("devices.favorites.buttons", this);
    m_frame1011_s = new QScrollArea(this);
    m_frame11 = new TPane("devices.body", this);
    m_iconlocal = new TPane("devices.iconlocal", this);
    m_frame111 = new TFrame("devices.local", this);
    m_localfilter = new TcFrame("devices.local.filter", this);
    m_localfilterpanel = new TPane("devices.local.filter.container", this);
    m_llocalfilterdriver = new TLabel("devices.local.filter.driver.label", this);
    m_localfilterdriver = new TComboBox("devices.local.filter.driver.field", this);
    m_llocalfilterfamily = new TLabel("devices.local.filter.family.label", this);
    m_localfilterfamily = new TComboBox("devices.local.filter.family.field", this);
    m_llocalfiltertext = new TLabel("devices.local.filter.text.label", this);
    m_localfiltertext = new TLineEdit("devices.local.filter.text.field", this);
    m_frame1111 = new TPane("devices.local.buttons", this);
    m_frame1111_s = new QScrollArea(this);
    m_frame2 = new TPane("", this);
    m_iconglobal = new TButton("devices.iconglobal", this);
    m_frame21 = new TFrame("devices.global", this);
    m_globalfilter = new TcFrame("devices.global.filter", this);
    m_globalfilterpanel = new TPane("devices.global.filter.container", this);
    m_lglobalfilterdriver = new TLabel("devices.global.filter.driver.label", this);
    m_globalfilterdriver = new TComboBox("devices.global.filter.driver.field", this);
    m_lglobalfilterfamily = new TLabel("devices.global.filter.family.label", this);
    m_globalfilterfamily = new TComboBox("devices.global.filter.family.field", this);
    m_lglobalfiltertext = new TLabel("devices.global.filter.text.label", this);
    m_globalfiltertext = new TLineEdit("devices.global.filter.text.field", this);
    m_frame211 = new TPane("devices.global.buttons", this);
    m_frame211_s = new QScrollArea(this);

    m_animation = new QPropertyAnimation(this);
    m_popup = new TPopup(this);

    m_appfavorites = new QVBoxLayout(m_frame1011);
    m_applocal = new QVBoxLayout(m_frame1111);
    m_appglobal = new QGridLayout(m_frame211);
    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout1 = new QHBoxLayout(m_frame1);
    m_layout10 = new QVBoxLayout(m_frame10);
    m_layout101 = new QVBoxLayout(m_frame101);
    m_layout1010 = new QFormLayout(m_newfavoritepanel);
    m_layout10101 = new QHBoxLayout(m_frame10101);
    m_layout11 = new QVBoxLayout(m_frame11);
    m_layout111 = new QVBoxLayout(m_frame111);
    m_layout1110 = new QFormLayout(m_localfilterpanel);
    m_layout2 = new QVBoxLayout(m_frame2);
    m_layout21 = new QVBoxLayout(m_frame21);
    m_layout210 = new QFormLayout(m_globalfilterpanel);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);

    m_layout->addWidget(m_frame0);
    m_layout0->setAlignment(Qt::AlignRight);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_refreshbutton);
    connect(m_refreshbutton, &TButton::clicked, this, &DevicesPanel::refreshButtonClicked);
    m_layout0->addWidget(m_closebutton);
    connect(m_closebutton, &TButton::clicked, this, &DevicesPanel::closeButtonClicked);

    m_layout->addWidget(m_frame1);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);

    m_layout1->addWidget(m_frame10, 1);
    m_layout10->setContentsMargins(0, 0, 0, 0);
    m_layout10->setSpacing(0);
    m_layout10->setAlignment(Qt::AlignTop);
    m_layout10->addWidget(m_iconfavorites);
    m_layout10->itemAt(0)->setAlignment(Qt::AlignCenter);
    m_layout10->addWidget(m_frame101);
    m_layout10->setStretchFactor(m_frame101, 1);
    m_layout101->setContentsMargins(0, 0, 0, 0);
    m_layout101->setSpacing(0);
    m_layout101->setAlignment(Qt::AlignTop);
    m_layout101->addWidget(m_newfavorite);
    m_layout101->addWidget(m_frame1011_s);
    m_frame1011_s->setWidget(m_frame1011);
    m_frame1011_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1011_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1011_s->setFrameShape(QFrame::NoFrame);
    m_frame1011_s->setWidgetResizable(true);
    m_frame1011_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame1011_s, QScroller::LeftMouseButtonGesture);
    m_appfavorites->setContentsMargins(0, 0, 0, 0);
    m_appfavorites->setSpacing(0);
    m_appfavorites->setAlignment(Qt::AlignTop);
    m_layout1010->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout1010->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout1010->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout1010->setLabelAlignment(Qt::AlignLeft);
    m_layout1010->setContentsMargins(0, 0, 0, 0);
    m_layout1010->setSpacing(0);
    m_layout1010->addRow(m_lnewfavoriteid, m_newfavoriteid);
    m_layout1010->addWidget(m_frame10101);
    m_layout10101->setContentsMargins(0, 0, 0, 0);
    m_layout10101->setSpacing(0);
    m_layout10101->addWidget(m_newfavoriteinfobutton);
    m_layout10101->addWidget(m_newfavoriteacceptbutton);
    m_layout10101->addWidget(m_newfavoritecancelbutton);
    m_newfavorite->setContent(m_newfavoritepanel);
    connect(m_newfavoriteinfobutton, &TButton::clicked, this, &DevicesPanel::newFavoriteInfoButtonClicked);
    connect(m_newfavoriteacceptbutton, &TButton::clicked, this, &DevicesPanel::newFavoriteAcceptButtonClicked);
    connect(m_newfavoritecancelbutton, &TButton::clicked, this, &DevicesPanel::newFavoriteCancelButtonClicked);

    m_layout1->addWidget(m_frame11, 1);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_layout11->setAlignment(Qt::AlignTop);
    m_layout11->addWidget(m_iconlocal);
    m_layout11->itemAt(0)->setAlignment(Qt::AlignCenter);
    m_layout11->addWidget(m_frame111);
    m_layout11->setStretchFactor(m_frame111, 1);
    m_layout111->setContentsMargins(0, 0, 0, 0);
    m_layout111->setSpacing(0);
    m_layout111->setAlignment(Qt::AlignTop);
    m_layout111->addWidget(m_localfilter);
    m_layout111->addWidget(m_frame1111_s);
    m_frame1111_s->setWidget(m_frame1111);
    m_frame1111_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1111_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1111_s->setFrameShape(QFrame::NoFrame);
    m_frame1111_s->setWidgetResizable(true);
    m_frame1111_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame1111_s, QScroller::LeftMouseButtonGesture);
    m_applocal->setContentsMargins(0, 0, 0, 0);
    m_applocal->setSpacing(0);
    m_applocal->setAlignment(Qt::AlignTop);
    m_layout1110->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout1110->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout1110->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout1110->setLabelAlignment(Qt::AlignLeft);
    m_layout1110->setContentsMargins(0, 0, 0, 0);
    m_layout1110->setSpacing(0);
    m_layout1110->addRow(m_llocalfiltertext, m_localfiltertext);
    m_layout1110->addRow(m_llocalfilterfamily, m_localfilterfamily);
    m_layout1110->addRow(m_llocalfilterdriver, m_localfilterdriver);
    connect(m_localfiltertext, &TLineEdit::textChanged, this, &DevicesPanel::filterLocal);
    connect(m_localfilterfamily, &TComboBox::currentTextChanged, this, &DevicesPanel::filterLocal);
    connect(m_localfilterdriver, &TComboBox::currentTextChanged, this, &DevicesPanel::filterLocal);
    m_localfilter->setContent(m_localfilterpanel);

    m_layout->addWidget(m_iconglobal);
    m_layout->itemAt(2)->setAlignment(Qt::AlignCenter);
    m_iconglobal->setToggle(true);
    connect(m_iconglobal, &TButton::clicked, this, &DevicesPanel::iconGlobalClicked);

    m_layout->addWidget(m_frame2);
    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);
    m_layout2->setAlignment(Qt::AlignTop);
    m_layout2->addWidget(m_frame21);
    m_layout2->setStretchFactor(m_frame21, 1);
    m_layout21->setContentsMargins(0, 0, 0, 0);
    m_layout21->setSpacing(0);
    m_layout21->setAlignment(Qt::AlignTop);
    m_layout21->addWidget(m_globalfilter);
    m_layout21->addWidget(m_frame211_s);
    m_frame211_s->setWidget(m_frame211);
    m_frame211_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame211_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame211_s->setFrameShape(QFrame::NoFrame);
    m_frame211_s->setWidgetResizable(true);
    m_frame211_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame211_s, QScroller::LeftMouseButtonGesture);
    m_appglobal->setContentsMargins(0, 0, 0, 0);
    m_appglobal->setSpacing(0);
    m_appglobal->setAlignment(Qt::AlignTop);
    m_layout210->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout210->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout210->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout210->setLabelAlignment(Qt::AlignLeft);
    m_layout210->setContentsMargins(0, 0, 0, 0);
    m_layout210->setSpacing(0);
    m_layout210->addRow(m_lglobalfiltertext, m_globalfiltertext);
    m_layout210->addRow(m_lglobalfilterfamily, m_globalfilterfamily);
    m_layout210->addRow(m_lglobalfilterdriver, m_globalfilterdriver);
    connect(m_globalfiltertext, &TLineEdit::textChanged, this, &DevicesPanel::filterGlobal);
    connect(m_globalfilterfamily, &TComboBox::currentTextChanged, this, &DevicesPanel::filterGlobal);
    connect(m_globalfilterdriver, &TComboBox::currentTextChanged, this, &DevicesPanel::filterGlobal);
    m_globalfilter->setContent(m_globalfilterpanel);

    m_filtering = false;
    m_favloaded = false;
    m_prevsites.clear();

    m_animation->setTargetObject(m_frame1);
    m_animation->setStartValue(0);
    m_animation->setPropertyName("maximumHeight");
    m_animation->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    connect(m_animation, &QPropertyAnimation::valueChanged, this, &DevicesPanel::redraw);

    m_timer = new QTimer(this);
    m_timer->setInterval(6 * G_LOCALSETTINGS.get("system.remotetimeout").toInt());
    m_timer->setSingleShot(true);
    connect(m_timer, &QTimer::timeout, this, &DevicesPanel::openAppTimeout);
}


DevicesPanel::~DevicesPanel()
{
    Message message(Message::C_PUBLICSITES, QString("false"));
    emit messageOut(message);
}


void DevicesPanel::install()
{
    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    QTimer *timer = new QTimer(this);
    connect(timer, &QTimer::timeout, this, &DevicesPanel::getDevices);
    timer->start(G_LOCALSETTINGS.get("system.clientupdate").toInt());
    getDevices();

    emit installed();
    m_openingid.clear();
}


void DevicesPanel::messageIn(const Message &message)
{
    switch (message.command()) {

        //** message.data() => Configuration for standard drivers.
        case Message::C_GETDRIVERS: {
            m_standarddrivers.loadString(message.data());

            Message lmessage(Message::C_GETSITESFULL);
            emit messageOut(lmessage);

            return;
        }

        //** message.data() => Full configuration for all known sites.
        //   Builds the entire list of local and remotes sites.
        //   Too long, I know.
        case Message::C_GETSITESFULL: {
            if (m_prevsites == message.data())
                return;

            m_prevsites = message.data();

            Settings driverslocal;
            Settings driversglobal;
            bool islocal;

            m_buttons.clear();

            int n = m_applocal->count();
            for (int i = 0; i < n; ++i)
                m_buttons.append(static_cast<TbButton *>(m_applocal->itemAt(i)->widget()));

            n = m_appglobal->count();
            for (int i = 0; i < n; ++i)
                m_buttons.append(static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()));

            int numcols = m_frame211->width() / 350 + 1;

            m_knownsites.clear();
            m_knownsites.loadString(message.data());

            QList<QString> siteids = m_knownsites.rootkeys();
            std::sort(siteids.begin(), siteids.end(), [&](QString &a, QString &b) {
                return m_knownsites.get(a + ".site.name") < m_knownsites.get(b + ".site.name");
            });

            int p = 0;

            for (QString &siteid : siteids) {
                Settings site;
                site = m_knownsites.extractSettings(siteid);

                Settings devices;
                devices = site.extractSettings("devices");

                QList<QString> deviceids = devices.rootkeys();
                std::sort(deviceids.begin(), deviceids.end(), [&](QString &a, QString &b) {
                    return devices.get(a + ".name") < devices.get(b + ".name");
                });

                if (site.get("site.islocal") == "true") {
                    islocal = true;
                    driverslocal.loadSettings(site.extractSettings("drivers"));
                } else {
                    islocal = false;
                    driversglobal.loadSettings(site.extractSettings("drivers"));
                }

                for (QString &deviceid : deviceids) {
                    Settings device;
                    device = devices.extractSettings(deviceid);
                    QString id = siteid + deviceid;

                    bool appexists = false;
                    if (islocal) {
                        n = m_applocal->count();
                        for (int k = 0; k < n; ++k) {
                            TbButton *appbutton = static_cast<TbButton *>(m_applocal->itemAt(k)->widget());
                            if (appbutton->id() == id) {
                                appbutton->setText(site.get("site.name") + '\n' + device.get("name"));
                                appbutton->setEnabled(device.get("locked") != "true");
                                m_buttons.removeOne(appbutton);
                                appexists = true;
                            }
                        }
                    } else {
                        n = m_appglobal->count();
                        for (int k = 0; k < n; ++k) {
                            TbButton *appbutton = static_cast<TbButton *>(m_appglobal->itemAt(k)->widget());
                            if (appbutton->id() == id) {
                                appbutton->setEnabled(device.get("locked") != "true");
                                m_buttons.removeOne(appbutton);
                                appexists = true;
                                ++p;
                            }
                        }
                    }

                    n = m_appfavorites->count();
                    for (int k = 0; k < n; ++k) {
                        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(k)->widget());
                        if (appbutton->id() == id)
                            appbutton->setEnabled(device.get("locked") != "true");
                    }

                    if (!appexists) {
                        QString appbuttonname;
                        if (islocal)
                            appbuttonname = "devices.local.button";
                        else
                            appbuttonname = "devices.global.button";
                        TbButton *appbutton = new TbButton(appbuttonname, this);
                        appbutton->setID(id);
                        appbutton->setNumBlinds(2);
                        appbutton->setText(site.get("site.name") + '\n' + device.get("name"));
                        appbutton->setEnabled(device.get("locked") != "true");
                        appbutton->blind1()->setToolTip(tr("Info"));
                        appbutton->blind2()->setToolTip(tr("Add to favorites"));
                        if (islocal) {
                            bool ins = false;
                            n = m_applocal->count();
                            for (int k = 0; k < n; ++k)
                                if (appbutton->text() < static_cast<TbButton *>(m_applocal->itemAt(k)->widget())->text()) {
                                    m_applocal->insertWidget(k, appbutton);
                                    ins = true;
                                    break;
                                }
                            if (!ins)
                                m_applocal->addWidget(appbutton);
                        } else {
                            m_appglobal->addWidget(appbutton, p / numcols, p % numcols);
                            ++p;
                        }

                        connect(appbutton, &TbButton::clicked0, this, &DevicesPanel::openApp);
                        connect(appbutton, &TbButton::clicked1, this, &DevicesPanel::showInfo);
                        connect(appbutton, &TbButton::clicked2, this, [=]() {favoriteAdd(id);});
                    }
                }
            }

            m_filtering = true;
            QString family;
            QString dispname;

            QString c_family = m_localfilterfamily->currentText();
            QString c_driver = m_localfilterdriver->currentText();
            m_localfilterdriver->clear();
            m_localfilterdriver->addItem(tr("All"));
            driverslocal.loadSettings(m_standarddrivers);
            QList<QString> ids = driverslocal.rootkeys();
            for (QString &id : ids) {
                family = driverslocal.get(id + ".family");
                dispname = driverslocal.get(id + ".displayname");
                if (m_localfilterdriver->findText(dispname) < 0)
                    m_localfilterdriver->addItem(dispname, family);
            }
            m_localfilterfamily->setCurrentText(c_family);
            m_localfilterdriver->setCurrentText(c_driver);

            c_family = m_globalfilterfamily->currentText();
            c_driver = m_globalfilterdriver->currentText();
            m_globalfilterdriver->clear();
            m_globalfilterdriver->addItem(tr("All"));
            driversglobal.loadSettings(m_standarddrivers);
            ids = driversglobal.rootkeys();
            for (QString &id : ids) {
                family = driversglobal.get(id + ".family");
                dispname = driversglobal.get(id + ".displayname");
                if (m_globalfilterdriver->findText(dispname) < 0)
                    m_globalfilterdriver->addItem(dispname, family);
            }
            m_globalfilterfamily->setCurrentText(c_family);
            m_globalfilterdriver->setCurrentText(c_driver);

            m_filtering = false;

            for (TbButton *&button : m_buttons)
                button->close();

            favoritesLoad();
            reorderGlobal();
            redraw();

            emit installed();

            return;
        }

        //** message.data() => Reply code: OK or ERROR+error type
        //   Handles the reply to a request to open an app.
        case Message::C_OPENAPP: {
            if (m_openingid.isEmpty())
                return;

            if (message.data() == "OK") {
                m_timer->stop();
                m_popup->close();

            } else {
                m_popup->setInstance("OpenApp");
                if (message.data() == "ERRORSERVER")
                    m_popup->setText(tr("Error loading server side"));
                else if (message.data() == "ERRORCLIENT")
                    m_popup->setText(tr("Error loading client side"));
                else if (message.data() == "ERRORSERVERINUSE")
                    m_popup->setText(tr("The device is in use"));
                else if (message.data() == "ERRORWRONGVERSION")
                    m_popup->setText(tr("Driver not supported by this version"));
                m_popup->setIcon(TPopup::I_Critical);
                m_popup->setButtons(QList<QString>() << tr("Accept"));

            }

            m_openingid.clear();

            return;
        }

        default: {
            break;
        }
    }
}


void DevicesPanel::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_closebutton->setToolTip(tr("Close"));
        m_refreshbutton->setToolTip(tr("Refresh"));
        m_iconfavorites->setToolTip(tr("Favorites"));
        m_iconlocal->setToolTip(tr("Local devices"));
        m_iconglobal->setToolTip(tr("Global devices"));
        m_globalfilter->setToolTip(tr("Filter"));
        m_localfilter->setToolTip(tr("Filter"));
        m_newfavorite->setToolTip(tr("Add favorite"));
        m_newfavoriteinfobutton->setToolTip(tr("Info"));
        m_newfavoriteacceptbutton->setToolTip(tr("Create"));
        m_newfavoritecancelbutton->setToolTip(tr("Cancel"));
        m_lnewfavoriteid->setText(tr("ID:"));
        m_llocalfiltertext->setText(tr("Filter:"));
        m_llocalfilterfamily->setText(tr("Family:"));
        m_llocalfilterdriver->setText(tr("Driver:"));
        m_lglobalfiltertext->setText(tr("Filter:"));
        m_lglobalfilterfamily->setText(tr("Family:"));
        m_lglobalfilterdriver->setText(tr("Driver:"));
        int lff = qMax(m_localfilterfamily->currentIndex(), 0);
        int gff = qMax(m_globalfilterfamily->currentIndex(), 0);
        int lfd = qMax(m_localfilterdriver->currentIndex(), 0);
        int gfd = qMax(m_globalfilterdriver->currentIndex(), 0);
        m_localfilterfamily->clear();
        m_globalfilterfamily->clear();
        for (QString &family : G_FAMILIES) {
            m_localfilterfamily->addItem(tr(family.toUtf8()), family);
            m_globalfilterfamily->addItem(tr(family.toUtf8()), family);
        }
        m_localfilterdriver->setItemText(0, tr("All"));
        m_globalfilterdriver->setItemText(0, tr("All"));
        m_localfilterfamily->setCurrentIndex(lff);
        m_globalfilterfamily->setCurrentIndex(gff);
        m_localfilterdriver->setCurrentIndex(-1);
        m_globalfilterdriver->setCurrentIndex(-1);
        m_localfilterdriver->setCurrentIndex(lfd);
        m_globalfilterdriver->setCurrentIndex(gfd);

        int n = m_appfavorites->count();
        for (int i = 0; i < n; ++i) {
            (static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget()))->blind1()->setToolTip(tr("Remove from favorites"));
            (static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget()))->blind2()->setToolTip(tr("Autostart"));
        }

        n = m_applocal->count();
        for (int i = 0; i < n; ++i) {
            (static_cast<TbButton *>(m_applocal->itemAt(i)->widget()))->blind1()->setToolTip(tr("Info"));
            (static_cast<TbButton *>(m_applocal->itemAt(i)->widget()))->blind2()->setToolTip(tr("Add to favorites"));
        }

        n = m_appglobal->count();
        for (int i = 0; i < n; ++i) {
            (static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->blind1()->setToolTip(tr("Info"));
            (static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->blind2()->setToolTip(tr("Add to favorites"));
        }
    }
}


void DevicesPanel::closeButtonClicked()
{
    emit closed();
    favoriteSave();
}


void DevicesPanel::favoriteAdd(const QString &id, const bool active)
{
    QString caption = "";

    int n = m_applocal->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_applocal->itemAt(i)->widget());
        if (appbutton->id() == id)
            caption = appbutton->text();
    }

    if (caption.isEmpty()) {
        n = m_appglobal->count();
        for (int i = 0; i < n; ++i) {
            TbButton *appbutton = static_cast<TbButton *>(m_appglobal->itemAt(i)->widget());
            if (appbutton->id() == id)
                caption = appbutton->text();
        }
    }

    if (!caption.isEmpty()) {
        favoriteCreate(id, caption, active);
        favoriteSave();
    }
}


void DevicesPanel::favoriteCreate(const QString &id, const QString &caption, const bool active)
{
    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i)
        if ((static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget()))->id() == id)
            return;

    TbButton *appbutton = new TbButton("devices.favorites.button", this);
    appbutton->setID(id);
    appbutton->setNumBlinds(2);
    appbutton->setText(caption);
    appbutton->blind1()->setToolTip(tr("Remove from favorites"));
    appbutton->blind2()->setToolTip(tr("Autostart"));
    appbutton->setActive(active);
    m_appfavorites->addWidget(appbutton);
    connect(appbutton, &TbButton::clicked0, this, &DevicesPanel::openApp);
    connect(appbutton, &TbButton::clicked1, this, &DevicesPanel::favoriteDelete);
    connect(appbutton, &TbButton::clicked2, this, &DevicesPanel::favoriteDefault);
}


void DevicesPanel::favoriteDefault(const QString &id) const
{
    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget());
        if (appbutton->id() == id)
            appbutton->setActive(!appbutton->isActive());
    }

    favoriteSave();
}


void DevicesPanel::favoriteDelete(const QString &id) const
{
    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget());
        if (appbutton->id() == id) {
            appbutton->setID("");
            appbutton->close();
        }
    }

    favoriteSave();
}


void DevicesPanel::favoriteSave() const
{
    Settings favorites;

    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget());
        if (!appbutton->id().isEmpty()) {
            favorites.set("ui.favdid." + QString::number(i), appbutton->id());
            favorites.set("ui.favcap." + QString::number(i), Settings::escape(appbutton->text()));
            if (appbutton->isActive())
                favorites.set("ui.favdef." + QString::number(i), "true");
        }
    }
    G_LOCALSETTINGS.clear("ui.favdid");
    G_LOCALSETTINGS.clear("ui.favcap");
    G_LOCALSETTINGS.clear("ui.favdef");
    G_LOCALSETTINGS.loadSettings(favorites);

    redraw();
}


void DevicesPanel::favoritesLoad()
{
    if (m_favloaded)
        return;

    Settings favorites = G_LOCALSETTINGS.extractSettings("ui.favdid");
    QList<QString> lfavorites = favorites.rootkeys();
    int i = 0;

    for (QString &favorite : lfavorites) {
        QString id = favorites.get(favorite);
        bool active = (G_LOCALSETTINGS.get("ui.favdef." + QString::number(i)) == "true");
        QString caption = Settings::unescape(G_LOCALSETTINGS.get("ui.favcap." + QString::number(i++)));
        favoriteCreate(id, caption, active);
    }

    m_favloaded = true;
}


void DevicesPanel::filterGlobal()
{
    if (m_filtering)
        return;

    m_filtering = true;

    int n = m_globalfilterdriver->count();
    for (int i = 0; i < n; ++i)
        if (i == 0 || m_globalfilterfamily->currentIndex() == 0 || m_globalfilterfamily->currentData() == m_globalfilterdriver->itemData(i))
            static_cast<QListView *>(m_globalfilterdriver->view())->setRowHidden(i, false);
        else
            static_cast<QListView *>(m_globalfilterdriver->view())->setRowHidden(i, true);

    if (static_cast<QListView *>(m_globalfilterdriver->view())->isRowHidden(m_globalfilterdriver->currentIndex()))
        m_globalfilterdriver->setCurrentIndex(0);

    m_globalfilterdriver->setMaxVisibleItems(m_globalfilterdriver->count());

    QString family;
    QString dispname;
    Settings alldrivers;
    bool filter;
    n = m_appglobal->count();

    for (int i = 0; i < n; ++i) {
        filter = false;

        if (!m_globalfiltertext->text().isEmpty())
            filter = !(static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->text().toUpper().contains(m_globalfiltertext->text().toUpper());

        if (!filter && (m_globalfilterfamily->currentIndex() > 0 || m_globalfilterdriver->currentIndex() > 0)) {
            QString id = (static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->id();
            QString driverid = m_knownsites.get(id.first(G_IDSIZE) + ".devices." + id.last(G_IDSIZE) + ".driver");
            family = m_standarddrivers.get(driverid + ".family");
            dispname = m_standarddrivers.get(driverid + ".displayname");
            if (family.isEmpty()) {
                alldrivers = m_knownsites.extractSettings(id.first(G_IDSIZE) + ".drivers");
                alldrivers.loadSettings(m_standarddrivers);
                family = alldrivers.get(driverid + ".family");
                dispname = alldrivers.get(driverid + ".displayname");
            }
            filter = filter || (m_globalfilterfamily->currentIndex() > 0 && family != m_globalfilterfamily->currentText());
            filter = filter || (m_globalfilterdriver->currentIndex() > 0 && dispname != m_globalfilterdriver->currentText());
        }

        (static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->setVisible(!filter);
    }

    reorderGlobal();

    m_filtering = false;
}


void DevicesPanel::filterLocal()
{
    if (m_filtering)
        return;

    m_filtering = true;

    int n = m_localfilterdriver->count();
    for (int i = 0; i < n; ++i)
        if (i == 0 || m_localfilterfamily->currentIndex() == 0 || m_localfilterfamily->currentData() == m_localfilterdriver->itemData(i))
            static_cast<QListView *>(m_localfilterdriver->view())->setRowHidden(i, false);
        else
            static_cast<QListView *>(m_localfilterdriver->view())->setRowHidden(i, true);

    if (static_cast<QListView *>(m_localfilterdriver->view())->isRowHidden(m_localfilterdriver->currentIndex()))
        m_localfilterdriver->setCurrentIndex(0);

    m_localfilterdriver->setMaxVisibleItems(m_localfilterdriver->count());

    QString family;
    QString dispname;
    Settings alldrivers;
    bool filter;
    n = m_applocal->count();

    for (int i = 0; i < n; ++i) {
        filter = false;

        if (!m_localfiltertext->text().isEmpty())
            filter = !(static_cast<TbButton *>(m_applocal->itemAt(i)->widget()))->text().toUpper().contains(m_localfiltertext->text().toUpper());

        if (!filter && (m_localfilterfamily->currentIndex() > 0 || m_localfilterdriver->currentIndex() > 0)) {
            QString id = (static_cast<TbButton *>(m_applocal->itemAt(i)->widget()))->id();
            QString driverid = m_knownsites.get(id.first(G_IDSIZE) + ".devices." + id.last(G_IDSIZE) + ".driver");
            family = m_standarddrivers.get(driverid + ".family");
            dispname = m_standarddrivers.get(driverid + ".displayname");
            if (family.isEmpty()) {
                alldrivers = m_knownsites.extractSettings(id.first(G_IDSIZE) + ".drivers");
                alldrivers.loadSettings(m_standarddrivers);
                family = alldrivers.get(driverid + ".family");
                dispname = alldrivers.get(driverid + ".displayname");
            }
            filter = filter || (m_localfilterfamily->currentIndex() > 0 && family != m_localfilterfamily->currentText());
            filter = filter || (m_localfilterdriver->currentIndex() > 0 && dispname != m_localfilterdriver->currentText());
        }

        (static_cast<TbButton *>(m_applocal->itemAt(i)->widget()))->setVisible(!filter);
    }

    m_filtering = false;
}


void DevicesPanel::getDevices()
{
    Message message(Message::C_GETDRIVERS);
    emit messageOut(message);
}


void DevicesPanel::httpSessionFinished(HttpSession *httpsession)
{
    QByteArray data = httpsession->data();

    if (data.startsWith("ERROR") || data.isEmpty()) {
        m_popup->setInstance("OpenApp");
        m_popup->setText(tr("Site not found"));
        m_popup->setIcon(TPopup::I_Critical);
        m_popup->setButtons(QList<QString>() << tr("Accept"));
        m_popup->exec();
        httpsession->deleteLater();
        return;
    }

    Settings site;
    site.loadString(httpsession->data());

    Settings devs = site.extractSettings("devices");
    QList<QString> devids = devs.rootkeys();

    QString id = m_newfavoriteid->text().replace("&", "").trimmed();
    QString siteid = id.first(G_IDSIZE);
    QString deviceid = id.mid(G_IDSIZE);
    bool found = false;

    for (QString &devid : devids)
        if (devid == deviceid || deviceid.isEmpty()) {
            found = true;
            favoriteCreate(siteid + devid, site.get("site.name") + '\n' + devs.get(devid + ".name"));
            redraw();
        }

    if (!found) {
        m_popup->setInstance("OpenApp");
        m_popup->setText(tr("Device not found"));
        m_popup->setIcon(TPopup::I_Critical);
        m_popup->setButtons(QList<QString>() << tr("Accept"));
        m_popup->exec();
    }

    httpsession->deleteLater();
}


void DevicesPanel::iconGlobalClicked()
{
    m_animation->setEndValue(height());
    m_animation->setDirection(m_iconglobal->isPressed() ? QAbstractAnimation::Backward : QAbstractAnimation::Forward);
    m_animation->start();

    QString val = m_iconglobal->isPressed() ? "true" : "false";

    Message message(Message::C_PUBLICSITES, val);
    emit messageOut(message);
}


void DevicesPanel::messageFwOut(const Message &message)
{
    emit messageOut(message);
}


void DevicesPanel::moveEvent(QMoveEvent *event)
{
    TPane::moveEvent(event);
    redraw();
}


void DevicesPanel::newFavoriteAcceptButtonClicked()
{
    m_newfavorite->setCollapsed(true);

    if (m_newfavoriteid->text().isEmpty())
        return;

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, &DevicesPanel::httpSessionFinished);
    httpsession->post(m_masterserver, "command=getremotesite&siteid=" + m_newfavoriteid->text().first(G_IDSIZE));
}


void DevicesPanel::newFavoriteCancelButtonClicked() const
{
    m_newfavoriteid->setText("");
    m_newfavorite->setCollapsed(true);
}


void DevicesPanel::newFavoriteInfoButtonClicked() const
{
    QString text;
    text += tr("Add a remote site or device") + "\n";
    text += "<site ID>\n";
    text += "<site ID>&<Device ID>\n";

    m_popup->setText(text);
    m_popup->setIcon(TPopup::I_Information);
    m_popup->setButtons(QList<QString>() << tr("Close"));
    m_popup->exec();
}


void DevicesPanel::openApp(const QString &id)
{
    m_popup->setInstance("OpenApp");
    m_popup->setText(tr("LOADING..."));
    m_popup->setIcon(TPopup::I_Information);
    m_popup->setButtons(QList<QString>());
    m_popup->exec();

    m_timer->start();
    m_openingid = id;
    Message message(Message::C_OPENAPP, m_openingid);
    emit messageOut(message);
}


void DevicesPanel::openAppTimeout()
{
    m_popup->setInstance("OpenApp");
    m_popup->setText(tr("The server side is not responding"));
    m_popup->setIcon(TPopup::I_Critical);
    m_popup->setButtons(QList<QString>() << tr("Accept"));
    Message message(Message::C_CANCELAPP, m_openingid);
    emit messageOut(message);
    m_openingid = "";
}


void DevicesPanel::redraw() const
{
    m_refreshbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);

    if (m_animation->state() == QAbstractAnimation::Running)
        m_frame2->setMaximumHeight(internalGeometry().height() - m_frame1->maximumHeight());
    else {
        if (m_iconglobal->isPressed()) {
            m_frame1->setMaximumHeight(0);
            m_frame2->setMaximumHeight(internalGeometry().height());
        } else {
            m_frame1->setMaximumHeight(internalGeometry().height());
            m_frame2->setMaximumHeight(0);
        }
    }

    m_iconfavorites->setSize(G_UNIT_L, G_UNIT_L);
    m_iconlocal->setSize(G_UNIT_L, G_UNIT_L);
    m_iconglobal->setSize(G_UNIT_L, G_UNIT_L);
    m_lnewfavoriteid->setHeight(G_UNIT_L);
    m_newfavoriteid->setHeight(G_UNIT_L);
    m_newfavoriteinfobutton->setSize(G_UNIT_L, G_UNIT_L);
    m_newfavoriteacceptbutton->setHeight(G_UNIT_L);
    m_newfavoritecancelbutton->setHeight(G_UNIT_L);
    m_newfavoritepanel->setHeight(qMax(m_lnewfavoriteid->height(), m_newfavoriteid->height()) +
                                 qMax(m_newfavoriteacceptbutton->height(), m_newfavoritecancelbutton->height()) +
                                 m_newfavoritepanel->spacing());
    m_llocalfiltertext->setHeight(G_UNIT_L);
    m_llocalfilterdriver->setHeight(G_UNIT_L);
    m_llocalfilterfamily->setHeight(G_UNIT_L);
    m_localfiltertext->setHeight(G_UNIT_L);
    m_localfilterdriver->setHeight(G_UNIT_L);
    m_localfilterfamily->setHeight(G_UNIT_L);
    m_localfilterpanel->setHeight(qMax(m_llocalfiltertext->height(), m_localfiltertext->height()) +
                                 qMax(m_llocalfilterdriver->height(), m_localfilterdriver->height()) +
                                 qMax(m_llocalfilterfamily->height(), m_localfilterfamily->height()) +
                                 2 * m_localfilterpanel->spacing());
    m_lglobalfiltertext->setHeight(G_UNIT_L);
    m_lglobalfilterdriver->setHeight(G_UNIT_L);
    m_lglobalfilterfamily->setHeight(G_UNIT_L);
    m_globalfiltertext->setHeight(G_UNIT_L);
    m_globalfilterdriver->setHeight(G_UNIT_L);
    m_globalfilterfamily->setHeight(G_UNIT_L);
    m_globalfilterpanel->setHeight(qMax(m_lglobalfiltertext->height(), m_globalfiltertext->height()) +
                                  qMax(m_lglobalfilterdriver->height(), m_globalfilterdriver->height()) +
                                  qMax(m_lglobalfilterfamily->height(), m_globalfilterfamily->height()) +
                                  2 * m_globalfilterpanel->spacing());
    m_frame1011->setWidth(m_newfavorite->width());
    m_frame1111->setWidth(m_localfilter->width());
    m_frame211->setWidth(m_globalfilter->width());

    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget());
        appbutton->setWidth(m_frame1011->width() - m_frame1011->horizontalGap());
    }

    n = m_applocal->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_applocal->itemAt(i)->widget());
        appbutton->setWidth(m_frame1111->width() - m_frame1111->horizontalGap());
    }

    reorderGlobal();
    m_popup->redraw();
}


void DevicesPanel::refreshButtonClicked()
{
    Message message(Message::C_REFRESH);
    emit messageOut(message);
}


void DevicesPanel::reorderGlobal() const
{
    QList<TbButton *> list;

    int n = m_appglobal->count();
    int numcols = m_frame211->width() / 350 + 1;

    for (int i = 0; i < n; ++i)
        if (m_appglobal->itemAt(i)->widget()->isVisible())
            list << static_cast<TbButton *>(m_appglobal->itemAt(i)->widget());

    n = static_cast<int>(list.count());

    std::sort(list.begin(), list.end(), [](const TbButton *a, const TbButton *b) {
        return a->text() < b->text();
    });

    for (int i = 0; i < n; ++i)
        m_appglobal->addWidget(list.at(i), i / numcols, i % numcols);
}


void DevicesPanel::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}


void DevicesPanel::showInfo(const QString &id) const
{
    Settings site = m_knownsites.extractSettings(id.first(G_IDSIZE));
    Settings device = site.extractSettings("devices." + id.last(G_IDSIZE));
    Settings drivers = site.extractSettings("drivers");
    drivers.loadSettings(m_standarddrivers);
    QString driver = device.get("driver");
    QString info = "";

    info += "<b>" + tr("SITE") + "</b>";
    info += "<table>";
    info += "<tr><td>" + tr("ID:") + "</td><td>" + site.get("site.id") + "</td></tr>";
    info += "<tr><td>" + tr("Name:") + "</td><td>" + site.get("site.name") + "</td></tr>";
    info += "<tr><td>" + tr("Description:") + "</td><td>" + site.get("site.description") + "</td></tr>";
    info += "<tr><td>" + tr("Town:") + "</td><td>" + site.get("site.town") + "</td></tr>";
    info += "<tr><td>" + tr("Country:") + "</td><td>" + site.get("site.country") + "</td></tr>";
    info += "<tr><td>" + tr("Email:") + "</td><td><a href='mailto:" + site.get("site.email") + "'>" + site.get("site.email") + "</a></td></tr>";
    info += "<tr><td>" + tr("Web site:") + "</td><td><a href='" + site.get("site.website") + "'>" + site.get("site.website") + "</a></td></tr>";
    info += "</table><br><br>";
    info += "<b>" + tr("DEVICE") + "</b>";
    info += "<table>";
    info += "<tr><td>" + tr("ID:") + "</td><td>" + id.first(G_IDSIZE) + "&" + id.last(G_IDSIZE) + "</td></tr>";
    info += "<tr><td>" + tr("Name:") + "</td><td>" + device.get("name") + "</td></tr>";
    info += "<tr><td>" + tr("Driver:") + "</td><td>" + device.get("driver") + "</td></tr>";
    info += "<tr><td>" + tr("Description:") + "</td><td>" + device.get("description") + "</td></tr>";
    info += "</table><br><br>";
    info += "<b>" + tr("DRIVER") + "</b>";
    info += "<table>";
    info += "<tr><td>" + tr("Name:") + "</td><td>" + drivers.get(driver + ".displayname") + "</td></tr>";
    info += "<tr><td>" + tr("Family:") + "</td><td>" + drivers.get(driver + ".family") + "</td></tr>";
    info += "<tr><td>" + tr("Description:") + "</td><td>" + drivers.get(driver + ".description") + "</td></tr>";
    info += "<tr><td>" + tr("Version:") + "</td><td>" + drivers.get(driver + ".version") + "</td></tr>";
    info += "<tr><td>" + tr("Author:") + "</td><td>" + drivers.get(driver + ".author") + "</td></tr>";
    info += "</table><br>";

    m_popup->setInstance("");
    m_popup->setText(info);
    m_popup->setIcon(TPopup::I_Information);
    m_popup->setButtons(QList<QString>() << tr("Close"));
    m_popup->exec();
}
