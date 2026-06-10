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


BGridLayout::BGridLayout(QWidget *parent) : QGridLayout(parent)
{
    m_numcolumns = 1;
}


BGridLayout::~BGridLayout()
{

}


void BGridLayout::addWidget(QWidget *widget)
{
    QGridLayout::addWidget(widget, count() / m_numcolumns, count() % m_numcolumns, Qt::AlignLeft);
    connect(widget, &QWidget::destroyed, this, &BGridLayout::clean);
}


void BGridLayout::clean(QObject *widget)
{
    QList<QLayoutItem *> list;
    QLayoutItem *item;
    int n = count();

    for (int i = 0; i < n; i++) {
        item = takeAt(i);
        if (item->widget() != widget)
            list << item;
    }

    for (QLayoutItem *&item : list)
        addWidget(item->widget());
}


void BGridLayout::insertWidget(const int pos, QWidget *widget)
{
    int n = count();

    if (pos >= n) {
        addWidget(widget);
        return;
    }

    for (int i = count(); i > pos; i--)
        QGridLayout::addItem(takeAt(i - 1), i / m_numcolumns, i % m_numcolumns, Qt::AlignLeft);

    QGridLayout::addWidget(widget, pos / m_numcolumns, pos % m_numcolumns, Qt::AlignLeft);
    connect(widget, &QWidget::destroyed, this, &BGridLayout::clean);
}


QLayoutItem *BGridLayout::itemAt(const int pos)
{
    return itemAtPosition(pos / m_numcolumns, pos % m_numcolumns);
}


int BGridLayout::numColumns()
{
    return m_numcolumns;
}


void BGridLayout::setNumColumns(const int numcolumns)
{
    if (m_numcolumns == numcolumns)
        return;

    QList<QLayoutItem *> list;
    QLayoutItem *item;
    int n = count();

    for (int i = 0; i < n; i++)
        list << takeAt(i);

    m_numcolumns = numcolumns;

    for (QLayoutItem *&item : list)
        addWidget(item->widget());
}


QLayoutItem *BGridLayout::takeAt(const int pos)
{
    QLayoutItem *item = itemAt(pos);
    int n = count();

    for (int i = 0; i < n; i++)
        if (QGridLayout::itemAt(i) == item)
            return QGridLayout::takeAt(i);

    return nullptr;
}


DevicesPanel::DevicesPanel(QWidget *parent) : TPane("devices", parent)
{
    if (G_LOCALSETTINGS.get("system.masterserverport").isEmpty())
        m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver");
    else
        m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + ":" + G_LOCALSETTINGS.get("system.masterserverport");

    m_frame0 = new TPane("devices.header", this);
    m_pinbutton = new TButton("devices.header.pin", this);
    m_refreshbutton = new TButton("devices.header.refresh", this);
    m_closebutton = new TButton("devices.header.close", this);
    m_frame1 = new TPane("devices.body", this);
    m_frame10 = new TPane("devices.body", this);
    m_iconlocal = new TPane("devices.iconlocal", this);
    m_frame101 = new TFrame("devices.favorites", this);
    m_newfavorite = new TcFrame("devices.favorites.new", this);
    m_newfavoritepanel = new TPane("devices.favorites.new.container", this);
    m_lnewfavoriteid = new TLabel("devices.favorites.new.id.label", this);
    m_newfavoriteid = new TLineEdit("devices.favorites.new.id.field", this);
    m_frame10101 = new TPane("devices.favorites.new.buttons", this);
    m_newfavoriteinfobutton = new TButton("devices.favorites.new.info", this);
    m_newfavoriteacceptbutton = new TButton("devices.favorites.new.accept", this);
    m_newfavoritecancelbutton = new TButton("devices.favorites.new.cancel", this);
    m_frame1011 = new TPane("devices.local.buttons", this);
    m_frame1011_s = new QScrollArea(this);
    m_frame10110 = new TPane("devices.local.buttons", this);
    m_frame10111 = new TPane("devices.local.buttons", this);
    m_frame10112 = new TPane("devices.local.buttons", this);
    m_labelfavorites = new TLabel("devices.local.label", this);
    m_labellocal = new TLabel("devices.local.label", this);
    m_labelnear = new TLabel("devices.local.label", this);
    m_labelglobal = new TLabel("devices.local.label", this);
    m_frame11 = new TPane("devices.body", this);
    m_iconglobal = new TPane("devices.iconglobal", this);
    m_frame111 = new TFrame("devices.local", this);
    m_filter = new TcFrame("devices.global.filter", this);
    m_filterpanel = new TPane("devices.global.filter.container", this);
    m_lfilterdriver = new TLabel("devices.global.filter.driver.label", this);
    m_filterdriver = new TComboBox("devices.global.filter.driver.field", this);
    m_lfilterfamily = new TLabel("devices.global.filter.family.label", this);
    m_filterfamily = new TComboBox("devices.global.filter.family.field", this);
    m_lfiltertext = new TLabel("devices.global.filter.text.label", this);
    m_filtertext = new TLineEdit("devices.global.filter.text.field", this);
    m_frame1111 = new TPane("devices.global.buttons", this);
    m_frame1111_s = new QScrollArea(this);

    m_popup = new TPopup(this);

    m_appfavorites = new BGridLayout(m_frame10110);
    m_applocal = new BGridLayout(m_frame10111);
    m_appnear = new BGridLayout(m_frame10112);
    m_appglobal = new BGridLayout(m_frame1111);
    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout1 = new QHBoxLayout(m_frame1);
    m_layout10 = new QVBoxLayout(m_frame10);
    m_layout101 = new QVBoxLayout(m_frame101);
    m_layout1010 = new QFormLayout(m_newfavoritepanel);
    m_layout10101 = new QHBoxLayout(m_frame10101);
    m_layout1011 = new QVBoxLayout(m_frame1011);
    m_layout11 = new QVBoxLayout(m_frame11);
    m_layout111 = new QVBoxLayout(m_frame111);
    m_layout1110 = new QFormLayout(m_filterpanel);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);

    m_layout->addWidget(m_frame0);
    m_layout0->setAlignment(Qt::AlignRight);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_pinbutton);
    connect(m_pinbutton, &TButton::clicked, this, &DevicesPanel::pinButtonClicked);
    m_pinbutton->setToggle(true);
    m_pinbutton->setPressed(G_LOCALSETTINGS.get("ui.devicespanelpined") == "true");
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
    m_layout10->addWidget(m_iconlocal);
    m_layout10->itemAt(0)->setAlignment(Qt::AlignCenter);
    m_layout10->addWidget(m_frame101);
    m_layout10->setStretchFactor(m_frame101, 1);
    m_layout101->setContentsMargins(0, 0, 0, 0);
    m_layout101->setSpacing(0);
    m_layout101->setAlignment(Qt::AlignTop);
    m_layout101->addWidget(m_newfavorite);
    m_layout101->addWidget(m_frame1011_s);
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
    m_layout1011->setContentsMargins(0, 0, 0, 0);
    m_layout1011->setSpacing(0);
    m_layout1011->setAlignment(Qt::AlignTop);
    m_layout1011->addWidget(m_labelfavorites);
    m_layout1011->addWidget(m_frame10110);
    m_layout1011->addWidget(m_labellocal);
    m_layout1011->addWidget(m_frame10111);
    m_layout1011->addWidget(m_labelnear);
    m_layout1011->addWidget(m_frame10112);
    m_frame1011_s->setWidget(m_frame1011);
    m_frame1011_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1011_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1011_s->setFrameShape(QFrame::NoFrame);
    m_frame1011_s->setWidgetResizable(true);
    m_frame1011_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame1011_s, QScroller::LeftMouseButtonGesture);
    m_newfavorite->setContent(m_newfavoritepanel);
    connect(m_newfavoriteinfobutton, &TButton::clicked, this, &DevicesPanel::newFavoriteInfoButtonClicked);
    connect(m_newfavoriteacceptbutton, &TButton::clicked, this, &DevicesPanel::newFavoriteAcceptButtonClicked);
    connect(m_newfavoritecancelbutton, &TButton::clicked, this, &DevicesPanel::newFavoriteCancelButtonClicked);

    m_layout1->addWidget(m_frame11, 1);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_layout11->setAlignment(Qt::AlignTop);
    m_layout11->addWidget(m_iconglobal);
    m_layout11->itemAt(0)->setAlignment(Qt::AlignCenter);
    m_layout11->addWidget(m_frame111);
    m_layout11->setStretchFactor(m_frame111, 1);
    m_layout111->setContentsMargins(0, 0, 0, 0);
    m_layout111->setSpacing(0);
    m_layout111->setAlignment(Qt::AlignTop);
    m_layout111->addWidget(m_filter);
    m_layout111->addWidget(m_labelglobal);
    m_layout111->addWidget(m_frame1111_s);
    m_frame1111_s->setWidget(m_frame1111);
    m_frame1111_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1111_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1111_s->setFrameShape(QFrame::NoFrame);
    m_frame1111_s->setWidgetResizable(true);
    m_frame1111_s->setStyleSheet("background:transparent");
    QScroller::grabGesture(m_frame1111_s, QScroller::LeftMouseButtonGesture);
    m_appglobal->setContentsMargins(0, 0, 0, 0);
    m_appglobal->setSpacing(0);
    m_appglobal->setAlignment(Qt::AlignTop);
    m_layout1110->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout1110->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout1110->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout1110->setLabelAlignment(Qt::AlignLeft);
    m_layout1110->setContentsMargins(0, 0, 0, 0);
    m_layout1110->setSpacing(0);
    m_layout1110->addRow(m_lfiltertext, m_filtertext);
    m_layout1110->addRow(m_lfilterfamily, m_filterfamily);
    m_layout1110->addRow(m_lfilterdriver, m_filterdriver);
    connect(m_filtertext, &TLineEdit::textChanged, this, &DevicesPanel::filter);
    connect(m_filterfamily, &TComboBox::currentTextChanged, this, &DevicesPanel::filter);
    connect(m_filterdriver, &TComboBox::currentTextChanged, this, &DevicesPanel::filter);
    m_filter->setContent(m_filterpanel);

    m_numfavorites = 0;
    m_filtering = false;
    m_favloaded = false;
    m_prevsites.clear();
    m_labelfavorites->hide();
    m_labellocal->hide();
    m_labelnear->hide();
    m_labelglobal->hide();

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

    Message message(Message::C_PUBLICSITES, QString("true"));
    emit messageOut(message);

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

        BGridLayout *frame;

        m_buttons.clear();

        int n = m_appnear->count();
        for (int i = 0; i < n; ++i)
            m_buttons.append(static_cast<TbButton *>(m_appnear->itemAt(i)->widget()));

        n = m_applocal->count();
        for (int i = 0; i < n; ++i)
            m_buttons.append(static_cast<TbButton *>(m_applocal->itemAt(i)->widget()));

        n = m_appglobal->count();
        for (int i = 0; i < n; ++i)
            m_buttons.append(static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()));

        m_knownsites.clear();
        m_knownsites.loadString(message.data());

        QList<QString> siteids = m_knownsites.rootkeys();
        std::sort(siteids.begin(), siteids.end(), [&](QString &a, QString &b) {
            return m_knownsites.get(a + ".site.name") < m_knownsites.get(b + ".site.name");
        });

        int numlocal = 0, numnear = 0, numglobal = 0;

        for (QString &siteid : siteids) {
            Settings site;
            site = m_knownsites.extractSettings(siteid);

            int loc = site.get("site.location").toInt();
            if (loc == 1)
                frame = m_applocal;
            else if (loc == 2)
                frame = m_appnear;
            else
                frame = m_appglobal;

            Settings devices;
            devices = site.extractSettings("devices");

            QList<QString> deviceids = devices.rootkeys();
            std::sort(deviceids.begin(), deviceids.end(), [&](QString &a, QString &b) {
                return devices.get(a + ".name") < devices.get(b + ".name");
            });

            for (QString &deviceid : deviceids) {
                Settings device;
                device = devices.extractSettings(deviceid);
                QString id = siteid + deviceid;

                if (loc == 1)
                    numlocal++;
                else if (loc == 2)
                    numnear++;
                else
                    numglobal++;

                bool appexists = false;
                n = frame->count();
                TbButton *appbutton;
                QString text;
                for (int k = 0; k < n; ++k) {
                    appbutton = static_cast<TbButton *>(frame->itemAt(k)->widget());
                    text = site.get("site.name") + '\n' + device.get("name");
                    if (appbutton->id() == id && appbutton->text() == text) {
                        appbutton->setEnabled(device.get("locked") != "true");
                        m_buttons.removeOne(appbutton);
                        appexists = true;
                    }
                }

                if (!appexists) {
                    QString appbuttonname;
                    if (frame == m_appglobal)
                        appbuttonname = "devices.global.button";
                    else
                        appbuttonname = "devices.local.button";
                    TbButton *appbutton = new TbButton(appbuttonname, this);

                    appbutton->setID(id);
                    appbutton->setNumBlinds(2);
                    appbutton->setText(site.get("site.name") + '\n' + device.get("name"));
                    appbutton->setEnabled(device.get("locked") != "true");
                    appbutton->blind1()->setToolTip(tr("Info"));
                    appbutton->blind2()->setToolTip(tr("Add to favorites"));
                    bool ins = false;
                    n = frame->count();
                    for (int k = 0; k < n; ++k)
                        if (appbutton->text() < static_cast<TbButton *>(frame->itemAt(k)->widget())->text()) {
                            frame->insertWidget(k, appbutton);
                            ins = true;
                            break;
                        }
                    if (!ins)
                        frame->addWidget(appbutton);

                    connect(appbutton, &TbButton::clicked0, this, &DevicesPanel::openApp);
                    connect(appbutton, &TbButton::clicked1, this, &DevicesPanel::showInfo);
                    connect(appbutton, &TbButton::clicked2, this, [=]() {favoriteAdd(id);});
                }
            }
        }

        if (numlocal == 0)
            QTimer::singleShot(G_LOCALSETTINGS.get("ui.animationdelay").toInt(), [&]() {m_labellocal->hide();});
        else
            m_labellocal->show();

        if (numnear == 0)
            QTimer::singleShot(G_LOCALSETTINGS.get("ui.animationdelay").toInt(), [&]() {m_labelnear->hide();});
        else
            m_labelnear->show();

        if (numglobal == 0)
            QTimer::singleShot(G_LOCALSETTINGS.get("ui.animationdelay").toInt(), [&]() {m_labelglobal->hide();});
        else
            m_labelglobal->show();

        for (TbButton *&button : m_buttons)
            button->close();

        m_filtering = true;
        QString family;
        QString dispname;
        Settings drivers;

        QString c_family = m_filterfamily->currentText();
        QString c_driver = m_filterdriver->currentText();
        m_filterdriver->clear();
        m_filterdriver->addItem(tr("All"));
        drivers.loadSettings(m_standarddrivers);
        QList<QString> ids = drivers.rootkeys();
        for (QString &id : ids) {
            family = drivers.get(id + ".family");
            dispname = drivers.get(id + ".displayname");
            m_filterdriver->addItem(dispname, family);
        }
        m_filterfamily->setCurrentText(c_family);
        m_filterdriver->setCurrentText(c_driver);

        m_filtering = false;

        favoritesLoad();
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
        m_pinbutton->setToolTip(tr("Autostart"));
        m_refreshbutton->setToolTip(tr("Refresh"));
        m_iconlocal->setToolTip(tr("Local devices"));
        m_iconglobal->setToolTip(tr("Global devices"));
        m_filter->setToolTip(tr("Filter"));
        m_newfavorite->setToolTip(tr("Add favorite"));
        m_newfavoriteinfobutton->setToolTip(tr("Info"));
        m_newfavoriteacceptbutton->setToolTip(tr("Create"));
        m_newfavoritecancelbutton->setToolTip(tr("Cancel"));
        m_lnewfavoriteid->setText(tr("ID:"));
        m_lfiltertext->setText(tr("Filter:"));
        m_lfilterfamily->setText(tr("Family:"));
        m_lfilterdriver->setText(tr("Driver:"));
        m_labelfavorites->setText(tr("FAVORITES"));
        m_labellocal->setText(tr("LOCAL"));
        m_labelnear->setText(tr("NEAR"));
        m_labelglobal->setText(tr("REMOTE"));
        int lff = qMax(m_filterfamily->currentIndex(), 0);
        int lfd = qMax(m_filterdriver->currentIndex(), 0);
        m_filterfamily->clear();
        for (QString &family : G_FAMILIES)
            m_filterfamily->addItem(tr(family.toUtf8()), family);
        m_filterdriver->setItemText(0, tr("All"));
        m_filterfamily->setCurrentIndex(lff);
        m_filterdriver->setCurrentIndex(-1);
        m_filterdriver->setCurrentIndex(lfd);

        int n = m_applocal->count();
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

    for (BGridLayout *frame : {m_applocal, m_appnear, m_appfavorites}) {
        int n = frame->count();
        for (int i = 0; i < n; ++i) {
            TbButton *appbutton = static_cast<TbButton *>(frame->itemAt(i)->widget());
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

    m_numfavorites++;
    m_labelfavorites->setVisible(true);
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


void DevicesPanel::favoriteDelete(const QString &id)
{
    int n = m_appfavorites->count();
    for (int i = 0; i < n; ++i) {
        TbButton *appbutton = static_cast<TbButton *>(m_appfavorites->itemAt(i)->widget());
        if (appbutton->id() == id) {
            appbutton->setID("");
            appbutton->close();
            m_numfavorites--;
            if (m_numfavorites == 0)
                QTimer::singleShot(2 * G_LOCALSETTINGS.get("ui.animationdelay").toInt(), [&]() {m_labelfavorites->setVisible(false);});

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

    if (m_numfavorites == 0)
        m_labelfavorites->setVisible(false);

    m_favloaded = true;
}


void DevicesPanel::filter()
{
    if (m_filtering)
        return;

    m_filtering = true;

    int n = m_filterdriver->count();
    for (int i = 0; i < n; ++i)
        if (i == 0 || m_filterfamily->currentIndex() == 0 || m_filterfamily->currentData() == m_filterdriver->itemData(i))
            static_cast<QListView *>(m_filterdriver->view())->setRowHidden(i, false);
        else
            static_cast<QListView *>(m_filterdriver->view())->setRowHidden(i, true);

    if (static_cast<QListView *>(m_filterdriver->view())->isRowHidden(m_filterdriver->currentIndex()))
        m_filterdriver->setCurrentIndex(0);

    m_filterdriver->setMaxVisibleItems(m_filterdriver->count());

    QString family;
    QString dispname;
    Settings alldrivers;
    bool filter;
    n = m_appglobal->count();

    for (int i = 0; i < n; ++i) {
        filter = false;

        if (!m_filtertext->text().isEmpty())
            filter = !(static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->text().toUpper().contains(m_filtertext->text().toUpper());

        if (!filter && (m_filterfamily->currentIndex() > 0 || m_filterdriver->currentIndex() > 0)) {
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
            filter = filter || (m_filterfamily->currentIndex() > 0 && family != m_filterfamily->currentText());
            filter = filter || (m_filterdriver->currentIndex() > 0 && dispname != m_filterdriver->currentText());
        }

        (static_cast<TbButton *>(m_appglobal->itemAt(i)->widget()))->setVisible(!filter);
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


void DevicesPanel::pinButtonClicked()
{
    G_LOCALSETTINGS.set("ui.devicespanelpined", m_pinbutton->isPressed() ? "true" : "false");
}


void DevicesPanel::redraw() const
{
    m_pinbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_refreshbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);

    m_frame1->setMaximumHeight(internalGeometry().height());

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
    m_lfiltertext->setHeight(G_UNIT_L);
    m_lfilterdriver->setHeight(G_UNIT_L);
    m_lfilterfamily->setHeight(G_UNIT_L);
    m_filtertext->setHeight(G_UNIT_L);
    m_filterdriver->setHeight(G_UNIT_L);
    m_filterfamily->setHeight(G_UNIT_L);
    m_filterpanel->setHeight(qMax(m_lfiltertext->height(), m_filtertext->height()) +
                             qMax(m_lfilterdriver->height(), m_filterdriver->height()) +
                             qMax(m_lfilterfamily->height(), m_filterfamily->height()) +
                             2 * m_filterpanel->spacing());
    m_frame1011->setWidth(m_newfavorite->width());
    m_frame1111->setWidth(m_filter->width());

    m_labelfavorites->setHeight(G_UNIT_L);
    m_labellocal->setHeight(G_UNIT_L);
    m_labelnear->setHeight(G_UNIT_L);
    m_labelglobal->setHeight(G_UNIT_L);

    int numcolumns = m_frame10111->width() / 350 + 1;
    int width = (m_frame10111->width() - m_frame10111->horizontalGap() - (numcolumns - 1) * m_frame10111->spacing()) / numcolumns;

    m_appfavorites->setNumColumns(numcolumns);
    m_applocal->setNumColumns(numcolumns);
    m_appnear->setNumColumns(numcolumns);
    m_appglobal->setNumColumns(numcolumns);

    for (int i = 0; i < m_appfavorites->count(); i++)
        m_appfavorites->itemAt(i)->widget()->setFixedWidth(width);
    for (int i = 0; i < m_applocal->count(); i++)
        m_applocal->itemAt(i)->widget()->setFixedWidth(width);
    for (int i = 0; i < m_appnear->count(); i++)
        m_appnear->itemAt(i)->widget()->setFixedWidth(width);
    for (int i = 0; i < m_appglobal->count(); i++)
        m_appglobal->itemAt(i)->widget()->setFixedWidth(width);

    for (int i = 0; i < numcolumns - 1; i++) {
        m_appfavorites->setColumnStretch(i, 0);
        m_applocal->setColumnStretch(i, 0);
        m_appnear->setColumnStretch(i, 0);
        m_appglobal->setColumnStretch(i, 0);
    }

    m_appfavorites->setColumnStretch(numcolumns - 1, 1);
    m_applocal->setColumnStretch(numcolumns - 1, 1);
    m_appnear->setColumnStretch(numcolumns - 1, 1);
    m_appglobal->setColumnStretch(numcolumns - 1, 1);

    m_popup->redraw();
}


void DevicesPanel::refreshButtonClicked()
{
    Message message(Message::C_REFRESH);
    emit messageOut(message);
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
