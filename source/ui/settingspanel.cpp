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
#include "client/configsession.h"
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
#include <QFormLayout>
#include <QListView>
#include <QPropertyAnimation>
#include <QResource>
#include <QScrollArea>
#include <QScroller>
#include <QTimer>
#include <QScrollBar>
#include <QDir>


SettingsPanel::SettingsPanel(QWidget *parent) : TPane("settings", parent)
{
    m_masterserver = G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver") + G_LOCALSETTINGS.get("system.masterserverport");

    m_frame0 = new TPane("settings.header", this);
    m_frame01 = new TPane("settings.header", this);
    m_sitelist = new TComboBox("settings.header.sitelist", this);
    m_refreshbutton = new TButton("settings.header.refresh", this);
    m_savebutton = new TButton("settings.header.save", this);
    m_closebutton = new TButton("settings.header.close", this);
    m_frame1 = new QScrollArea(this);
    m_frame11 = new TPane("settings.body", this);
    m_cframe1 = new TcFrame("settings.body.interface", this);
    m_settings1 = new TPane("settings.body.interface.container", this);
    m_llanguage = new TLabel("settings.body.interface.language.label", this);
    m_language = new TComboBox("settings.body.interface.language.field", this);
    m_ltheme = new TLabel("settings.body.interface.theme.label", this);
    m_theme = new TComboBox("settings.body.interface.theme.field", this);
    m_cframe2 = new TcFrame("settings.body.site", this);
    m_settings2 = new TPane("settings.body.site.container", this);
    m_lsiteid = new TLabel("settings.body.site.id.label", this);
    m_siteid = new TLineEdit("settings.body.site.id.field", this);
    m_lsitename = new TLabel("settings.body.site.name.label", this);
    m_sitename = new TLineEdit("settings.body.site.name.field", this);
    m_lsitedescription = new TLabel("settings.body.site.desc.label", this);
    m_sitedescription = new TTextEdit("settings.body.site.desc.field", this);
    m_ltown = new TLabel("settings.body.site.town.label", this);
    m_town = new TLineEdit("settings.body.site.town.field", this);
    m_lcountry = new TLabel("settings.body.site.country.label", this);
    m_country = new TLineEdit("settings.body.site.country.field", this);
    m_lemail = new TLabel("settings.body.site.email.label", this);
    m_email = new TLineEdit("settings.body.site.email.field", this);
    m_lwebsite = new TLabel("settings.body.site.website.label", this);
    m_website = new TLineEdit("settings.body.site.website.field", this);
    m_lremotesetup = new TLabel("settings.body.site.remote.label", this);
    m_remotesetup = new TComboBox("settings.body.site.remote.field", this);
    m_lupnp = new TLabel("settings.body.site.upnp.label", this);
    m_upnp = new TCheck("settings.body.site.upnp.field", this);
    m_lnat = new TLabel("settings.body.site.nat.label", this);
    m_nat = new TCheck("settings.body.site.nat.field", this);
    m_natgroup = new TPane("settings.body", this);
    m_lnatport = new TLabel("settings.body.site.natport.label", this);
    m_natport = new TLineEdit("settings.body.site.natport.field", this);
    m_cframe3 = new TcFrame("settings.body.devices", this);
    m_settings3 = new TPane("settings.body.devices.container", this);
    m_newdevice = new TcFrame("settings.body.devices.new", this);
    m_newdevicepanel = new TPane("settings.body.devices.new.container", this);
    m_lnewdevicefamily = new TLabel("settings.body.devices.new.family.label", this);
    m_newdevicefamily = new TComboBox("settings.body.devices.new.family.field", this);
    m_lnewdevicedriver = new TLabel("settings.body.devices.new.driver.label", this);
    m_newdevicedriver = new TComboBox("settings.body.devices.new.driver.field", this);
    m_lnewdeviceversion = new TLabel("settings.body.devices.new.version.label", this);
    m_newdeviceversion = new TLabel("settings.body.devices.new.version.field", this);
    m_lnewdeviceauthor = new TLabel("settings.body.devices.new.author.label", this);
    m_newdeviceauthor = new TLabel("settings.body.devices.new.author.field", this);
    m_lnewdevicedescription = new TLabel("settings.body.devices.new.desc.label", this);
    m_newdevicedescription = new TLabel("settings.body.devices.new.desc.field", this);
    m_newdevicebuttons = new TPane("settings.body.devices.new.buttons", this);
    m_newdeviceacceptbutton = new TButton("settings.body.devices.new.accept", this);
    m_newdevicecancelbutton = new TButton("settings.body.devices.new.cancel", this);
    m_cframe4 = new TcFrame("settings.body.security", this);
    m_settings4 = new TPane("settings.body.security.container", this);
    m_groups = new TFrame("settings.body.security.groups", this);
    m_lgroups = new TLabel("settings.body.security.groups.label", this);
    m_groupsheader = new TPane("settings.body.security.groups.header", this);
    m_groupname = new TLineEdit("settings.body.security.groups.name", this);
    m_groupaddbutton = new TButton("settings.body.security.groups.add", this);
    m_groupdeletebutton = new TButton("settings.body.security.groups.delete", this);
    m_grouplist = new TList("settings.body.security.groups.list", this);
    m_members = new TFrame("settings.body.security.members", this);
    m_lmembers = new TLabel("settings.body.security.members.label", this);
    m_membersheader = new TPane("settings.body.security.members.header", this);
    m_membername = new TLineEdit("settings.body.security.members.name", this);
    m_memberaddbutton = new TButton("settings.body.security.members.add", this);
    m_memberdeletebutton = new TButton("settings.body.security.members.delete", this);
    m_memberlist = new TList("settings.body.security.members.list", this);
    m_popup = new TPopup(this);

    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout01 = new QHBoxLayout(m_frame01);
    m_layout11 = new QVBoxLayout(m_frame11);
    m_layout1 = new QFormLayout(m_settings1);
    m_layout2 = new QFormLayout(m_settings2);
    m_layout21 = new QHBoxLayout(m_natgroup);
    m_layout3 = new QVBoxLayout(m_settings3);
    m_layout31 = new QFormLayout(m_newdevicepanel);
    m_layout314 = new QHBoxLayout(m_newdevicebuttons);
    m_layout4 = new QHBoxLayout(m_settings4);
    m_layout41 = new QVBoxLayout(m_groups);
    m_layout411 = new QHBoxLayout(m_groupsheader);
    m_layout42 = new QVBoxLayout(m_members);
    m_layout421 = new QHBoxLayout(m_membersheader);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout->addWidget(m_frame0);
    m_layout->addWidget(m_frame1);
    m_layout->setStretchFactor(m_frame1, 1);

    m_layout0->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout0->setAlignment(Qt::AlignRight);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_frame01);
    m_layout0->addWidget(m_closebutton);
    m_layout01->setAlignment(Qt::AlignLeft);
    m_layout01->setContentsMargins(0, 0, 0, 0);
    m_layout01->setSpacing(0);
    m_layout01->addWidget(m_sitelist);
    m_layout01->addWidget(m_refreshbutton);
    m_layout01->addWidget(m_savebutton);
    connect(m_closebutton, &TButton::clicked, this, &SettingsPanel::closeButtonClicked);
    connect(m_refreshbutton, &TButton::clicked, this, &SettingsPanel::refreshButtonClicked);
    connect(m_savebutton, &TButton::clicked, this, &SettingsPanel::saveButtonClicked);
    m_sitelist->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
    connect(m_sitelist, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedSite);

    m_frame1->setWidget(m_frame11);
    m_frame1->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_frame1->setFrameShape(QFrame::NoFrame);
    m_frame1->setStyleSheet("background:transparent");

    m_layout11->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout11->setAlignment(Qt::AlignTop);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_layout11->addWidget(m_cframe1);
    m_layout11->addWidget(m_cframe2);
    m_layout11->addWidget(m_cframe3);
    m_layout11->addWidget(m_cframe4);

    connect(m_cframe1, &TcFrame::headerClicked, this, &SettingsPanel::panelToggle);
    connect(m_cframe1, &TcFrame::resized, this, &SettingsPanel::redraw);
    connect(m_language, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedLanguage);
    connect(m_theme, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedTheme);
    m_layout1->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout1->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout1->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout1->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout1->setLabelAlignment(Qt::AlignLeft);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);
    m_layout1->addRow(m_llanguage, m_language);
    m_layout1->addRow(m_ltheme, m_theme);
    m_cframe1->setContent(m_settings1);

    connect(m_cframe2, &TcFrame::headerClicked, this, &SettingsPanel::panelToggle);
    connect(m_cframe2, &TcFrame::resized, this, &SettingsPanel::redraw);
    m_layout2->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout2->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout2->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout2->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout2->setLabelAlignment(Qt::AlignLeft);
    m_layout2->setContentsMargins(0, 0, 0, 0);
    m_layout2->setSpacing(0);
    m_layout2->addRow(m_lsiteid, m_siteid);
    m_layout2->addRow(m_lsitename, m_sitename);
    m_layout2->addRow(m_lsitedescription, m_sitedescription);
    m_layout2->addRow(m_ltown, m_town);
    m_layout2->addRow(m_lcountry, m_country);
    m_layout2->addRow(m_lemail, m_email);
    m_layout2->addRow(m_lwebsite, m_website);
    m_layout2->addRow(m_lremotesetup, m_remotesetup);
    m_layout2->addRow(m_lupnp, m_upnp);
    m_layout2->addRow(m_lnat, m_natgroup);
    m_layout21->setAlignment(Qt::AlignLeft);
    m_layout21->addWidget(m_nat);
    m_layout21->addWidget(m_lnatport);
    m_layout21->addWidget(m_natport);
    setTabOrder(m_siteid, m_sitename);
    setTabOrder(m_sitename, m_sitedescription);
    setTabOrder(m_sitedescription, m_town);
    setTabOrder(m_town, m_country);
    setTabOrder(m_country, m_email);
    setTabOrder(m_email, m_website);
    setTabOrder(m_website, m_remotesetup);
    setTabOrder(m_remotesetup, m_upnp);
    setTabOrder(m_upnp, m_nat);
    setTabOrder(m_nat, m_natport);
    connect(m_sitename, &TLineEdit::textChanged, this, &SettingsPanel::validateSiteName);
    connect(m_nat, &TCheck::clicked, this, &SettingsPanel::changedNAT);
    m_natport->setValidator(new QIntValidator(1, 65535, this));
    m_natport->setAlignment(Qt::AlignRight);
    connect(m_remotesetup, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedRemote);
    m_siteid->setEnabled(false);
    m_cframe2->setContent(m_settings2);

    connect(m_cframe3, &TcFrame::headerClicked, this, &SettingsPanel::panelToggle);
    connect(m_cframe3, &TcFrame::resized, this, &SettingsPanel::redraw);
    m_layout3->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout3->setContentsMargins(0, 0, 0, 0);
    m_layout3->setSpacing(0);
    m_layout3->addWidget(m_newdevice);
    connect(m_newdevice, &TcFrame::resized, this, &SettingsPanel::redraw);
    connect(m_newdevicefamily, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedFamily);
    connect(m_newdevicedriver, &TComboBox::currentIndexChanged, this, &SettingsPanel::changedDriver);
    m_layout31->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout31->setAlignment(Qt::AlignTop);
    m_layout31->setRowWrapPolicy(QFormLayout::DontWrapRows);
    m_layout31->setFieldGrowthPolicy(QFormLayout::AllNonFixedFieldsGrow);
    m_layout31->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
    m_layout31->setLabelAlignment(Qt::AlignLeft);
    m_layout31->setContentsMargins(0, 0, 0, 0);
    m_layout31->setSpacing(0);
    m_layout31->addRow(m_lnewdevicefamily, m_newdevicefamily);
    m_layout31->addRow(m_lnewdevicedriver, m_newdevicedriver);
    m_layout31->addRow(m_lnewdeviceversion, m_newdeviceversion);
    m_layout31->addRow(m_lnewdeviceauthor, m_newdeviceauthor);
    m_layout31->addRow(m_lnewdevicedescription, m_newdevicedescription);
    m_layout31->addWidget(m_newdevicebuttons);
    m_layout314->setContentsMargins(0, 0, 0, 0);
    m_layout314->setSpacing(0);
    m_layout314->addWidget(m_newdeviceacceptbutton);
    m_layout314->addWidget(m_newdevicecancelbutton);
    connect(m_newdeviceacceptbutton, &TButton::clicked, this, &SettingsPanel::newDeviceAcceptButtonClicked);
    connect(m_newdevicecancelbutton, &TButton::clicked, this, &SettingsPanel::newDeviceCancelButtonClicked);
    m_newdevice->setContent(m_newdevicepanel);
    m_cframe3->setContent(m_settings3);

    connect(m_cframe4, &TcFrame::headerClicked, this, &SettingsPanel::panelToggle);
    connect(m_cframe4, &TcFrame::resized, this, &SettingsPanel::redraw);
    m_layout4->setSizeConstraint(QLayout::SetMinAndMaxSize);
    m_layout4->setContentsMargins(0, 0, 0, 0);
    m_layout4->setSpacing(0);
    m_layout4->addWidget(m_groups);
    m_layout4->addWidget(m_members);
    connect(m_grouplist, &TList::itemClicked, this, &SettingsPanel::groupClicked);
    connect(m_memberlist, &TList::itemClicked, this, &SettingsPanel::memberClicked);
    m_layout41->setContentsMargins(0, 0, 0, 0);
    m_layout41->setSpacing(0);
    m_layout41->addWidget(m_lgroups);
    m_layout41->addWidget(m_groupsheader);
    m_layout41->addWidget(m_grouplist);
    m_layout411->setContentsMargins(0, 0, 0, 0);
    m_layout411->setSpacing(0);
    m_layout411->addWidget(m_groupname);
    m_layout411->addWidget(m_groupaddbutton);
    m_layout411->addWidget(m_groupdeletebutton);
    connect(m_groupaddbutton, &TButton::clicked, this, &SettingsPanel::groupAddButtonClicked);
    connect(m_groupdeletebutton, &TButton::clicked, this, &SettingsPanel::groupDeleteButtonClicked);
    m_layout42->setContentsMargins(0, 0, 0, 0);
    m_layout42->setSpacing(0);
    m_layout42->addWidget(m_lmembers);
    m_layout42->addWidget(m_membersheader);
    m_layout42->addWidget(m_memberlist);
    m_layout421->setContentsMargins(0, 0, 0, 0);
    m_layout421->setSpacing(0);
    m_layout421->addWidget(m_membername);
    m_layout421->addWidget(m_memberaddbutton);
    m_layout421->addWidget(m_memberdeletebutton);
    connect(m_memberaddbutton, &TButton::clicked, this, &SettingsPanel::memberAddButtonClicked);
    connect(m_memberdeletebutton, &TButton::clicked, this, &SettingsPanel::memberDeleteButtonClicked);
    m_cframe4->setContent(m_settings4);

    QScroller::grabGesture(m_frame1, QScroller::TouchGesture);

    if (!G_TOUCH) {
        connect(m_frame11, &TPane::pressed, this, [&]() {
            QScroller::grabGesture(m_frame1, QScroller::LeftMouseButtonGesture);
            QScroller::scroller(m_frame1)->handleInput(QScroller::InputPress, m_frame1->mapFromGlobal(QCursor::pos()));
        });
        connect(QScroller::scroller(m_frame1), &QScroller::stateChanged, this, [&](QScroller::State state) {
            if (state == QScroller::Inactive) {
                QScroller::grabGesture(m_frame1, QScroller::TouchGesture);
            }
        });
    }

    connect(m_popup, &TPopup::optionSelected, this, &SettingsPanel::popupOptionSelected);

    loadLanguages();
    loadThemes();

    m_UIratio2 = G_LOCALSETTINGS.get("ui.ratio2").toInt();
    m_loading = false;
    m_closing = false;

    m_timer = new QTimer(this);
    m_timer->setInterval(6 * G_LOCALSETTINGS.get("system.remotetimeout").toInt());
    m_timer->setSingleShot(true);
    connect(m_timer, &QTimer::timeout, this, &SettingsPanel::deviceOpenTimeout);
}


SettingsPanel::~SettingsPanel()
{
    m_closing = true;
}


void SettingsPanel::install()
{
    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    m_initstatus = "";
    m_sitelist->clear();

    QTimer *timer = new QTimer(this);
    connect(timer, &QTimer::timeout, this, &SettingsPanel::heartbeat);
    timer->start(G_LOCALSETTINGS.get("system.clientupdate").toInt());

    m_cframe1->setCollapsed(false);

    emit installed();
    m_openingid.clear();
}


void SettingsPanel::messageIn(const Message &message)
{
    //** message.data() => Full configuration for the current site.
    if (message.command() == Message::C_GETCONFIGNEAR && message.sequence() == m_messageseq) {
        G_CONFIG.clear();
        G_CONFIG.loadString(message.data());
        G_CONFIG.loadSettings(m_standarddrivers, "drivers");

        //--- Process of the site configuration
        m_loading = true;
        if (G_VERBOSE) qInfo() << qPrintable("SETTINGSPANEL: Loading settings for " + G_CONFIG.get("site.id"));
        m_siteid->setText(G_CONFIG.get("site.id"));
        m_sitename->setText(G_CONFIG.get("site.name"));
        validateSiteName();
        m_sitedescription->setText(G_CONFIG.get("site.description"));
        m_town->setText(G_CONFIG.get("site.town"));
        m_country->setText(G_CONFIG.get("site.country"));
        m_email->setText(G_CONFIG.get("site.email"));
        m_website->setText(G_CONFIG.get("site.website"));
        m_remotesetup->setCurrentIndex(G_CONFIG.get("site.remotesetup").toInt());
        m_upnp->setPressed(G_CONFIG.get("site.upnp") == "true");
        m_nat->setPressed(G_CONFIG.get("site.nat") == "true");
        m_natport->setText(G_CONFIG.get("site.natport"));
        m_lnatport->setVisible(m_nat->isPressed());
        m_natport->setVisible(m_nat->isPressed());
        m_loading = false;

        //-- Process of the drivers configuration
        QList<QString> drivernames = G_CONFIG.rootkeys("drivers");
        if (G_VERBOSE) qInfo() << qPrintable("SETTINGSPANEL: Received list of " + QString::number(drivernames.count()) + " drivers");

        m_newdevicedriver->clear();
        for (QString &drivername : drivernames) {
            Settings driver;
            driver = G_CONFIG.extractSettings("drivers." + drivername);
            driver.set("driver", drivername);
            QString text = G_CONFIG.get("drivers." + drivername + ".displayname");
            m_newdevicedriver->addItem(text, QVariant::fromValue(driver));
        }

        m_newdevicedriver->model()->sort(0);
        m_newdevicedriver->setCurrentIndex(0);

        //-- Process of the devices configuration
        QList<TbButton *> devicebuttons = findChildren<TbButton *>();
        for (TbButton *&devicebutton : devicebuttons)
            devicebutton->close();

        QList<QString> deviceids = G_CONFIG.rootkeys("devices");
        if (G_VERBOSE) qInfo() << qPrintable("SETTINGSPANEL: Received list of " + QString::number(deviceids.count()) + " devices");

        for (QString &deviceid : deviceids) {
            TbButton *button = new TbButton("settings.body.devices.device", this);
            button->setText(G_CONFIG.get("devices." + deviceid + ".driver") + "\n" + G_CONFIG.get("devices." + deviceid + ".name"));
            button->setNumBlinds(1);
            button->setID(m_currentsiteid + deviceid);
            connect(button, &TbButton::clicked0, this, &SettingsPanel::deviceOpen);
            connect(button, &TbButton::clicked1, this, &SettingsPanel::deviceDelete);
            QString text = button->text();
            bool added = false;
            int n = m_layout3->count();
            for (int i = 1; i < n; ++i) {
                if (text < static_cast<TbButton *>(m_layout3->itemAt(i)->widget())->text()) {
                    m_layout3->insertWidget(i, button);
                    added = true;
                    break;
                }
            }
            if (!added)
                m_layout3->addWidget(button);
        }

        //-- Process of groups
        groupLoad();

        m_initstatus = status();

        redraw();

        return;
    }

    switch (message.command()) {

        //** message.data() => Configuration of the standard drivers.
        case Message::C_GETDRIVERS: {
            m_standarddrivers.loadString(message.data());
            return;
        }

        //** message.data() => Basic configuration from the near sites.
        case Message::C_GETSITESBASIC: {
            if (m_loading)
                return;

            m_loading = true;
            m_ids.clear();
            int n = m_sitelist->count();
            for (int i = 0; i < n; ++i)
                m_ids.append(m_sitelist->itemData(i).toString());

            bool firstrefresh = (m_sitelist->count() == 0);

            Settings settings;
            settings.loadString(message.data());

            QList<QString> sites = settings.rootkeys();
            for (QString &siteid : sites) {
                Settings site = settings.extractSettings(siteid);
                QString id = site.get("site.id");
                int itemnum = m_sitelist->findData(id);
                QString itemtext;

                if (site.get("site.name").isEmpty())
                    itemtext = tr("No name");
                else
                    itemtext = site.get("site.name");

                if (id == G_SITEID)
                    itemtext += tr(" (Local)");

                if (itemnum == -1)
                    m_sitelist->addItem(itemtext, id);
                else {
                    m_sitelist->setItemText(itemnum, itemtext);
                    m_sitelist->setItemData(itemnum, id);
                    m_ids.removeOne(id);
                }
            }

            if (!m_popup->isActive())
                for (QString &id : m_ids) {
                    if (m_siteid->text() == id) {
                        m_initstatus = "";
                        m_popup->setInstance("ErrorRemote");
                        m_popup->setText(tr("The server side is no longer available."));
                        m_popup->setIcon(TPopup::I_Critical);
                        m_popup->setButtons(QList<QString>() << tr("Cancel"));
                        m_popup->exec();
                    } else
                        m_sitelist->removeItem(m_sitelist->findData(QVariant(id)));
                }

            m_loading = false;

            m_sitelist->model()->sort(0);

            if (firstrefresh) {
                m_sitelist->setCurrentIndex(-1);
                m_sitelist->setCurrentIndex(m_sitelist->findData(G_SITEID));
            }
            return;
        }

        //** message.data() => Result of saving the configuration.
        case Message::C_SETCONFIG: {
            if (message.data() == "OK") {
                m_initstatus = status();
                G_LOCALSETTINGS.setLocalFile("config.set");
                Message lmessage(message);
                lmessage.setMessage(Message::C_SETDEVICES, G_CONFIG.extractSettings("devices").getString());
                emit messageOut(lmessage);
                emit settingsSaved();
            } else {
                m_popup->setInstance("ErrorSaving");
                m_popup->setText(tr("Error saving the new settings."));
                m_popup->setIcon(TPopup::I_Critical);
                m_popup->setButtons(QList<QString>() << tr("Accept"));
                m_popup->exec();
            }

            return;
        }

        //** message.data() => empty
        case Message::C_SETDEVICES: {
            refreshButtonClicked();
            return;
        }

        //** message.data() => Reply code: OK or ERROR+error type
        //   Handles the reply to a request to open an app config.
        case Message::C_OPENCONF: {
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
            emit messageFwIn(message);
            return;
        }
    }
}


void SettingsPanel::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_closebutton->setToolTip(tr("Close"));
        m_refreshbutton->setToolTip(tr("Refresh"));
        m_savebutton->setToolTip(tr("Save"));
        m_sitelist->setToolTip(tr("Local sites"));
        m_newdevice->setToolTip(tr("Add new device"));
        m_newdeviceacceptbutton->setToolTip(tr("Create"));
        m_newdevicecancelbutton->setToolTip(tr("Cancel"));
        m_cframe1->setText(tr("INTERFACE"));
        m_llanguage->setText(tr("Language:"));
        m_ltheme->setText(tr("Theme:"));
        m_cframe2->setText(tr("SITE"));
        m_lsiteid->setText(tr("Site ID:"));
        m_lsitename->setText(tr("Site name:"));
        m_lsitedescription->setText(tr("Description:"));
        m_ltown->setText(tr("Town:"));
        m_lcountry->setText(tr("Country:"));
        m_lemail->setText(tr("Email address:"));
        m_lwebsite->setText(tr("Web site:"));
        m_lupnp->setText(tr("Use uPnP:"));
        m_lnat->setText(tr("Use external NAT:"));
        m_lnatport->setText(tr("Port:"));
        m_loading = true;
        int temp = m_remotesetup->currentIndex();
        m_remotesetup->clear();
        m_remotesetup->addItem(tr("0 - Local"));
        m_remotesetup->addItem(tr("1 - Near"));
        m_remotesetup->setCurrentIndex(temp);
        m_loading = false;
        m_lremotesetup->setText(tr("Remote setup:"));
        m_cframe3->setText(tr("DEVICES"));
        m_lnewdevicefamily->setText(tr("Family:"));
        m_lnewdevicedriver->setText(tr("Driver:"));
        m_lnewdeviceversion->setText(tr("Version:"));
        m_lnewdeviceauthor->setText(tr("Author:"));
        m_lnewdevicedescription->setText(tr("Description:"));
        m_cframe4->setText(tr("SECURITY"));
        m_lgroups->setText(tr("GROUPS"));
        m_lmembers->setText(tr("MEMBERS"));
        m_groupaddbutton->setToolTip(tr("Add group"));
        m_groupdeletebutton->setToolTip(tr("Delete group"));
        m_memberaddbutton->setToolTip(tr("Add member"));
        m_memberdeletebutton->setToolTip(tr("Delete member"));
        m_newdevicefamily->clear();
        for (QString &family : G_FAMILIES)
            m_newdevicefamily->addItem(tr(family.toUtf8()), family);

        validateSiteName();
    }
}


void SettingsPanel::changedDriver()
{
    if (m_newdevicedriver->currentIndex() == -1)
        return;

    Settings driver = m_newdevicedriver->currentData().value<Settings>();

    m_newdeviceversion->setText(driver.get("version"));
    m_newdeviceauthor->setText(driver.get("author"));
    m_newdevicedescription->setText(driver.get("description"));

    redraw();
}


void SettingsPanel::changedFamily() const
{
    int n = m_newdevicedriver->count();
    for (int i = 0; i < n; ++i){
        Settings driver;
        driver = m_newdevicedriver->itemData(i).value<Settings>();
        if (m_newdevicefamily->currentData().toString() == driver.get("family") || m_newdevicefamily->currentIndex() == 0)
            static_cast<QListView *>(m_newdevicedriver->view())->setRowHidden(i, false);
        else
            static_cast<QListView *>(m_newdevicedriver->view())->setRowHidden(i, true);
    }

    if (static_cast<QListView *>(m_newdevicedriver->view())->isRowHidden(m_newdevicedriver->currentIndex())) {
        n = m_newdevicedriver->count();
        for (int i = 0; i < n; ++i)
            if (!static_cast<QListView *>(m_newdevicedriver->view())->isRowHidden(i)) {
                m_newdevicedriver->setCurrentIndex(i);
                break;
            }
    }
}


void SettingsPanel::changedLanguage()
{
    if (m_loading)
        return;

    G_LOCALSETTINGS.set("ui.language", m_language->currentData().toString());
    Message message;
    message.setMessage(Message::C_SETLANGUAGE);
    emit messageOut(message);
}


void SettingsPanel::changedNAT() const
{
    if (m_loading)
        return;

    m_lnatport->setVisible(m_nat->isPressed());
    m_natport->setVisible(m_nat->isPressed());
}


void SettingsPanel::changedRemote() const
{
    if (m_loading)
        return;

    if (m_remotesetup->currentIndex() == 0 && G_SITEID != m_siteid->text()) {
        m_popup->setInstance("NoSetup");
        m_popup->setText(tr("You will lose the connection to this site if you save changes.<br><br>Do you want to keep near setup disabled?"));
        m_popup->setIcon(TPopup::I_Warning);
        m_popup->setButtons(QList<QString>() << tr("Yes") << tr("No"));
        m_popup->exec();
    }
}


void SettingsPanel::changedSite()
{
    if (m_loading)
        return;

    if (m_initstatus != status() && !m_initstatus.isEmpty()) {
        m_popup->setInstance("Site");
        m_popup->setText(tr("The settings have been modified.<br><br>Do you want to save the changes?"));
        m_popup->setIcon(TPopup::I_Question);
        m_popup->setButtons(QList<QString>() << tr("Save") << tr("Discard") << tr("Cancel"));
        m_popup->exec();
    } else
        loadSite();
}


void SettingsPanel::changedTheme()
{
    if (m_loading)
        return;

    G_LOCALSETTINGS.set("ui.theme", m_theme->currentData().toString());
    Message message;
    message.setMessage(Message::C_SETTHEME);
    emit messageOut(message);
}


void SettingsPanel::closeButtonClicked()
{
    if (m_initstatus != status()) {
        m_popup->setInstance("Close");
        m_popup->setText(tr("The settings have been modified.<br><br>Do you want to save the changes?"));
        m_popup->setIcon(TPopup::I_Question);
        QList<QString> options;
        if (m_savebutton->isEnabled())
            options << tr("Save");
        options << tr("Discard") << tr("Cancel");
        m_popup->setButtons(options);
        m_popup->exec();
    } else
        emit closed();
}


void SettingsPanel::deviceDelete(const QString &id)
{
    G_CONFIG.clear("devices." + id.last(G_IDSIZE));

    int n = m_layout3->count();
    for (int i = 1; i < n; ++i) {
        TbButton *button = static_cast<TbButton *>(m_layout3->itemAt(i)->widget());
        if (button->id() == id) {
            button->close();
            break;
        }
    }
}


void SettingsPanel::deviceOpen(const QString &id)
{
    m_popup->setInstance("OpenApp");
    m_popup->setText(tr("LOADING..."));
    m_popup->setIcon(TPopup::I_Information);
    m_popup->setButtons(QList<QString>());
    m_popup->exec();

    m_timer->start();

    m_openingid = id;
    Message message(Message::C_OPENCONF, m_openingid);
    emit messageOut(message);
}


void SettingsPanel::deviceOpenTimeout()
{
    if (!m_openingid.isEmpty()) {
        m_popup->setInstance("OpenApp");
        m_popup->setText(tr("The server side is not responding"));
        m_popup->setIcon(TPopup::I_Critical);
        m_popup->setButtons(QList<QString>() << tr("Accept"));
        Message message(Message::C_CANCELCONF, m_openingid);
        emit messageOut(message);
        m_openingid = "";
    }
}


void SettingsPanel::groupAddButtonClicked()
{
    QString name = m_groupname->text();

    if (name.isEmpty())
        return;

    if (m_grouplist->contains(name))
        return;

    if (name.startsWith("[")) {
        m_popup->setInstance("Group");
        m_popup->setText(tr("The group name cannot start by") + " [");
        m_popup->setIcon(TPopup::I_Warning);
        m_popup->setButtons(QList<QString>() << tr("Accept"));
        m_popup->exec();
        return;
    }

    m_grouplist->addRow(name);
    m_grouplist->selectRow(name);
    G_CONFIG.insert("site.groups." + name, "");
    memberLoad();
}


void SettingsPanel::groupClicked(const QString &text)
{
    m_groupname->setText(text);
    memberLoad();
}


void SettingsPanel::groupDeleteButtonClicked()
{
    QString name = m_groupname->text();

    if (name.isEmpty())
        return;

    if (!m_grouplist->contains(name))
        return;

    m_grouplist->removeRow(name);
    m_grouplist->selectRow("");
    m_groupname->setText("");
    G_CONFIG.remove("site.groups." + name);
    memberLoad();
}


void SettingsPanel::groupLoad()
{
    m_grouplist->clear();

    QList<QString> members = G_CONFIG.rootkeys("site.groups");

    m_grouplist->addRow(members.join(";"));

    m_groupname->setText("");
    m_grouplist->selectRow("");
}


void SettingsPanel::heartbeat()
{
    Message message(Message::C_GETSITESBASIC);
    emit messageOut(message);

    if (m_standarddrivers.isEmpty()) {
        message.setCommand(Message::C_GETDRIVERS);
        emit messageOut(message);
    }
}


void SettingsPanel::loadLanguages()
{
    m_loading = true;

    Settings langset;
    langset.loadFile(":/resources/languages.set");
    langset.loadFile(G_LOCALSETTINGS.localFilePath() + "/custom/languages.set");

    QList<QString> langlist = langset.rootkeys();

    m_language->clear();
    for (QString &name : langlist) {
        QString displayname = langset.get(name + ".displayname");
        QString location = langset.get(name + ".location");
        QString langpath;
        if (location.startsWith("custom"))
            langpath = G_LOCALSETTINGS.localFilePath() + "/" + location;
        else
            langpath = ":/resources/" + location;
        if (langpath.endsWith(".rcc")) {
            if (!QFile::exists(":/" + name + "/flag.png"))
                QResource::registerResource(langpath, "/" + name);
            m_language->addItem(QIcon(":/" + name + "/flag.png"), displayname, location);
        } else
            m_language->addItem(QIcon(langpath + "/flag.png"), displayname, location);
    }

    m_loading = false;
    m_language->setCurrentIndex(m_language->findData(G_LOCALSETTINGS.get("ui.language")));
}


void SettingsPanel::loadSite()
{
    m_currentsiteid = m_sitelist->currentData().toByteArray();
    if (m_currentsiteid.isEmpty())
        return;

    Message message(Message::C_GETCONFIGNEAR);
    message.setSiteID(m_currentsiteid);
    m_messageseq = message.sequence();
    emit messageOut(message);

    QList<ConfigSession *>sessions = findChildren<ConfigSession *>();
    for (ConfigSession *&session : sessions)
        session->deleteLater();
}


void SettingsPanel::loadThemes()
{
    m_loading = true;

    Settings themeset;
    themeset.loadFile(":/resources/themes.set");
    themeset.loadFile(G_LOCALSETTINGS.localFilePath() + "/custom/themes.set");

    QList<QString> themelist = themeset.rootkeys();

    m_theme->clear();
    for (QString &name : themelist) {
        QString displayname = themeset.get(name + ".displayname");
        QString location = themeset.get(name + ".location");
        m_theme->addItem(tr(displayname.toUtf8()), location);
    }

    m_loading = false;
    m_theme->setCurrentIndex(m_theme->findData(G_LOCALSETTINGS.get("ui.theme")));
}


void SettingsPanel::memberAddButtonClicked()
{
    QString name = m_membername->text();

    if (name.isEmpty())
        return;

    if (m_memberlist->contains(name))
        return;

    m_memberlist->addRow(name);
    m_memberlist->selectRow(name);
    memberUpdate();
}


void SettingsPanel::memberClicked(const QString &text)
{
    m_membername->setText(text);
}


void SettingsPanel::memberDeleteButtonClicked()
{
    QString name = m_membername->text();

    if (name.isEmpty())
        return;

    if (!m_memberlist->contains(name))
        return;

    m_memberlist->removeRow(name);
    m_memberlist->selectRow("");
    m_membername->setText("");
    memberUpdate();
}


void SettingsPanel::memberLoad()
{
    m_memberlist->clear();

    QString group = m_groupname->text();

    if (group.isEmpty())
        return;

    if (!G_CONFIG.contains("site.groups." + group))
        return;

    m_memberlist->addRow(G_CONFIG.value("site.groups." + group));

    m_membername->setText("");
    m_memberlist->selectRow("");
}


void SettingsPanel::memberUpdate()
{
    G_CONFIG.insert("site.groups." + m_groupname->text(), m_memberlist->getRows());
}


void SettingsPanel::newDeviceAcceptButtonClicked()
{
    if (m_newdevicedriver->currentIndex() == -1)
        return;

    m_newdevice->setCollapsed(true);

    QString deviceid = newID();
    G_CONFIG.set("devices." + deviceid + ".driver", m_newdevicedriver->currentData().value<Settings>().get("driver"));
    G_CONFIG.set("devices." + deviceid + ".name", tr("New device"));

    TbButton *button = new TbButton("settings.body.devices.device", this);
    button->setText(G_CONFIG.get("devices." + deviceid + ".driver") + "\n" + G_CONFIG.get("devices." + deviceid + ".name"));
    button->setNumBlinds(1);
    button->setID(m_currentsiteid + deviceid);
    connect(button, &TbButton::clicked0, this, &SettingsPanel::deviceOpen);
    connect(button, &TbButton::clicked1, this, &SettingsPanel::deviceDelete);
    QString text = button->text();
    bool added = false;
    int n = m_layout3->count();
    for (int i = 1; i < n; ++i)
        if (text < static_cast<TbButton *>(m_layout3->itemAt(i)->widget())->text()) {
            m_layout3->insertWidget(i, button);
            added = true;
            break;
        }

    if (!added)
        m_layout3->addWidget(button);

    deviceOpen(button->id());
}


void SettingsPanel::newDeviceCancelButtonClicked() const
{
    m_newdevice->setCollapsed(true);
}


void SettingsPanel::panelToggle(TcFrame *cpanel) const
{
    if (cpanel != m_cframe1)
        m_cframe1->setCollapsed(true);
    if (cpanel != m_cframe2)
        m_cframe2->setCollapsed(true);
    if (cpanel != m_cframe3)
        m_cframe3->setCollapsed(true);
    if (cpanel != m_cframe4)
        m_cframe4->setCollapsed(true);
}


void SettingsPanel::popupOptionSelected()
{
    if (m_popup->instance() == "Close" && m_popup->selected() == tr("Save")) {
        saveButtonClicked();
        emit closed();
    } else if (m_popup->instance() == "Close" && m_popup->selected() == tr("Discard")) {
        emit closed();
    } else if (m_popup->instance() == "Site" && m_popup->selected() == tr("Save")) {
        int newindex = m_sitelist->currentIndex();
        m_sitelist->setCurrentIndex(m_sitelist->findData(m_currentsiteid));
        QEventLoop loop;
        connect(this, &SettingsPanel::settingsSaved, &loop, &QEventLoop::quit);
        saveButtonClicked();
        loop.exec();
        m_sitelist->setCurrentIndex(newindex);
        loadSite();
    } else if (m_popup->instance() == "Site" && m_popup->selected() == tr("Discard")) {
        loadSite();
    } else if (m_popup->instance() == "Site" && m_popup->selected() == tr("Cancel")) {
        m_sitelist->setCurrentIndex(m_sitelist->findData(m_currentsiteid));
    } else if (m_popup->instance() == "ErrorRemote" && m_popup->selected() == tr("Cancel")) {
        m_sitelist->removeItem(m_sitelist->findData(QVariant(m_siteid->text())));
        loadSite();
    } else if (m_popup->instance() == "NoSetup" && m_popup->selected() == tr("No"))
        m_remotesetup->setCurrentIndex(1);
}


void SettingsPanel::redraw()
{
    if (m_closing)
        return;

    m_frame11->setWidth(qMin(width() - horizontalGap(), static_cast<int>(m_UIratio2 * G_UNIT_L)));
    m_settings3->setMinimumWidth(0);
    m_newdevicepanel->setMinimumWidth(0);
    m_newdevicebuttons->setMinimumWidth(0);
    m_sitelist->setMaximumWidth(m_UIratio2 * G_UNIT_L - m_frame0->horizontalGap() + 1);
    m_sitelist->setHeight(G_UNIT_L);
    m_refreshbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_savebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_llanguage->setHeight(G_UNIT_L);
    m_language->setHeight(G_UNIT_L);
    m_ltheme->setHeight(G_UNIT_L);
    m_theme->setHeight(G_UNIT_L);
    m_lsiteid->setHeight(G_UNIT_L);
    m_siteid->setHeight(G_UNIT_L);
    m_lsitename->setHeight(G_UNIT_L);
    m_sitename->setHeight(G_UNIT_L);
    m_lsitedescription->setHeight(2 * G_UNIT_L);
    m_sitedescription->setHeight(2 * G_UNIT_L);
    m_ltown->setHeight(G_UNIT_L);
    m_town->setHeight(G_UNIT_L);
    m_lcountry->setHeight(G_UNIT_L);
    m_country->setHeight(G_UNIT_L);
    m_lemail->setHeight(G_UNIT_L);
    m_email->setHeight(G_UNIT_L);
    m_lwebsite->setHeight(G_UNIT_L);
    m_website->setHeight(G_UNIT_L);
    m_lremotesetup->setHeight(G_UNIT_L);
    m_remotesetup->setHeight(G_UNIT_L);
    m_lupnp->setHeight(G_UNIT_L);
    m_upnp->setSize(G_UNIT_L, G_UNIT_L);
    m_lnat->setHeight(G_UNIT_L);
    m_nat->setSize(G_UNIT_L, G_UNIT_L);
    m_lnatport->setHeight(G_UNIT_L);
    m_natport->setSize(3 * G_UNIT_L, G_UNIT_L);
    m_lnewdevicefamily->setHeight(G_UNIT_L);
    m_newdevicefamily->setHeight(G_UNIT_L);
    m_lnewdevicedriver->setHeight(G_UNIT_L);
    m_newdevicedriver->setHeight(G_UNIT_L);
    m_lnewdeviceversion->setHeight(G_UNIT_L);
    m_newdeviceversion->setHeight(G_UNIT_L);
    m_lnewdeviceauthor->setHeight(m_newdeviceauthor->sizeHint().height());
    m_lnewdevicedescription->setHeight(m_newdevicedescription->sizeHint().height());
    m_newdevicedescription->setHeight(m_newdevicedescription->sizeHint().height());
    m_newdeviceacceptbutton->setHeight(G_UNIT_L);
    m_newdevicecancelbutton->setHeight(G_UNIT_L);
    m_newdevicebuttons->setHeight(qMax(m_newdeviceacceptbutton->height(), m_newdevicecancelbutton->height()));
    m_lgroups->setHeight(G_UNIT_L);
    m_groupname->setHeight(G_UNIT_L);
    m_groupaddbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_groupdeletebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_grouplist->setHeight(8 * G_UNIT_L);
    m_lmembers->setHeight(G_UNIT_L);
    m_membername->setHeight(G_UNIT_L);
    m_memberaddbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_memberdeletebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_memberlist->setHeight(8 * G_UNIT_L);

    QList<ConfigSession *>sessions = findChildren<ConfigSession *>();
    for (ConfigSession *&session : sessions)
        session->setGeometry(spacing(), m_frame1->y(), qMin(m_UIratio2 * G_UNIT_L, static_cast<float>(m_frame11->width())), m_frame1->height());

    m_popup->redraw();
}


void SettingsPanel::refreshButtonClicked()
{
    Message message(Message::C_REFRESH);
    emit messageOut(message);
}


void SettingsPanel::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}


void SettingsPanel::refreshName(ConfigSession *session)
{
    int n = m_layout3->count();
    for (int i = 1; i < n; ++i) {
        TbButton *button = static_cast<TbButton *>(m_layout3->itemAt(i)->widget());
        if (button->id() == session->id())
            button->setText(session->caption().replace(" :: ", "\n"));
    }
}


void SettingsPanel::saveButtonClicked()
{
    m_savebutton->setFocus();

    if (G_VERBOSE) qInfo() << qPrintable("SETTINGSPANEL: Saving settings for " + m_siteid->text());

    Settings settings;
    settings.set("site.id", m_siteid->text());
    settings.set("site.name", m_sitename->text());
    settings.set("site.description", m_sitedescription->text().replace('\n', "<br>"));
    settings.set("site.town", m_town->text());
    settings.set("site.country", m_country->text());
    settings.set("site.email", m_email->text());
    settings.set("site.website", m_website->text());
    settings.set("site.remotesetup", QString::number(m_remotesetup->currentIndex()));
    settings.set("site.upnp", m_upnp->isPressed() ? "true" : "false");
    settings.set("site.nat", m_nat->isPressed() ? "true" : "false");
    settings.set("site.natport", m_natport->text());

    QList<QString> groups = G_CONFIG.rootkeys("site.groups");
    for (QString &group : groups)
        settings.set("site.groups." + group, G_CONFIG.value("site.groups." + group));

    Message messageout;
    messageout.setMessage(Message::C_SETCONFIG, settings.getString());
    messageout.setSiteID(m_siteid->text());
    emit messageOut(messageout);

    QList<QString> ids;
    int n = m_layout3->count();
    for (int i = 1; i < n; ++i)
        ids << static_cast<TbButton *>(m_layout3->itemAt(i)->widget())->id();

    QDir dir(G_LOCALSETTINGS.localFilePath());
    QList<QString> storefiles = dir.entryList(QList<QString>() << "_Store_*.set");
    QString id;
    for (QString &storefile : storefiles) {
        id = storefile.mid(7, 32);
        if (!ids.contains(id) && id.startsWith(G_SITEID))
            dir.remove(storefile);
    }
}


QString SettingsPanel::status() const
{
    QString status = "";

    status += m_siteid->text();
    status += m_sitename->text();
    status += m_sitedescription->text();
    status += m_town->text();
    status += m_country->text();
    status += m_email->text();
    status += m_website->text();
    status += (char)(m_remotesetup->currentIndex());
    status += m_upnp->isPressed() ? "true" : "false";
    status += m_nat->isPressed() ? "true" : "false";
    status += m_natport->text();
    status += G_CONFIG.getString("devices");
    status += G_CONFIG.getString("site.groups");

    return status;
}


void SettingsPanel::validateSiteName()
{
    if (m_sitename->text().isEmpty()) {
        m_lsitename->setText(tr("Site name:"));
        m_savebutton->setEnabled(true);
        return;
    }

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, [=]() {
        if (httpsession->data() == "ERROR") {
            m_lsitename->setText(tr("Site name:") + " <a style='color:red'>" + tr("[IN USE]") + "</a>");
            m_savebutton->setEnabled(false);
        } else {
            m_lsitename->setText(tr("Site name:"));
            m_savebutton->setEnabled(true);
        }
        httpsession->deleteLater();
    });
    httpsession->post(m_masterserver, "command=checksitename&name='" + m_sitename->text() + "'&siteid=" + m_currentsiteid);
}
