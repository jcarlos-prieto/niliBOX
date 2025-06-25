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

#if !defined SETTINGSPANEL_H
#define SETTINGSPANEL_H

#include "common/message.h"
#include "common/settings.h"
#include "ui/tpane.h"

class ConfigSession;
class QFormLayout;
class QHBoxLayout;
class QScrollArea;
class QVBoxLayout;
class TButton;
class TCheck;
class TComboBox;
class TFrame;
class TLabel;
class TLineEdit;
class TList;
class TPopup;
class TTextEdit;
class TcFrame;


class SettingsPanel : public TPane
{
    Q_OBJECT

public:
    explicit       SettingsPanel(QWidget *parent = nullptr);
    virtual       ~SettingsPanel();

    void           install();
    void           messageIn(const Message &message);
    void           redraw();
    void           refreshName(ConfigSession *session);

private:
    void           changeEvent(QEvent *event) override;
    void           changedDriver();
    void           changedFamily() const;
    void           changedLanguage();
    void           changedNAT() const;
    void           changedRemote() const;
    void           changedSite();
    void           changedTheme();
    void           closeButtonClicked();
    void           deviceDelete(const QString &id);
    void           deviceOpen(const QString &id);
    void           deviceOpenTimeout();
    void           groupAddButtonClicked();
    void           groupClicked(const QString &text);
    void           groupDeleteButtonClicked();
    void           groupLoad();
    void           heartbeat();
    void           loadLanguages();
    void           loadSite();
    void           loadThemes();
    void           memberAddButtonClicked();
    void           memberClicked(const QString &text);
    void           memberDeleteButtonClicked();
    void           memberLoad();
    void           memberUpdate();
    void           newDeviceAcceptButtonClicked();
    void           newDeviceCancelButtonClicked() const;
    void           panelToggle(TcFrame *) const;
    void           popupOptionSelected();
    void           refreshButtonClicked();
    void           resizeEvent(QResizeEvent *event) override;
    void           saveButtonClicked();
    QString        status() const;
    void           validateSiteName();

    TcFrame       *m_cframe1;
    TcFrame       *m_cframe2;
    TcFrame       *m_cframe3;
    TcFrame       *m_cframe4;
    TButton       *m_closebutton;
    bool           m_closing;
    Settings       m_config;
    TLineEdit     *m_country;
    QString        m_currentsiteid;
    TLineEdit     *m_email;
    TPane         *m_frame0;
    TPane         *m_frame01;
    QScrollArea   *m_frame1;
    TPane         *m_frame11;
    TButton       *m_groupaddbutton;
    TButton       *m_groupdeletebutton;
    TList         *m_grouplist;
    TLineEdit     *m_groupname;
    TFrame        *m_groups;
    TPane         *m_groupsheader;
    QList<QString> m_ids;
    QString        m_initstatus;
    TComboBox     *m_language;
    QVBoxLayout   *m_layout;
    QHBoxLayout   *m_layout0;
    QHBoxLayout   *m_layout01;
    QFormLayout   *m_layout1;
    QVBoxLayout	  *m_layout11;
    QFormLayout	  *m_layout2;
    QHBoxLayout	  *m_layout21;
    QVBoxLayout	  *m_layout3;
    QFormLayout	  *m_layout31;
    QHBoxLayout	  *m_layout314;
    QHBoxLayout	  *m_layout4;
    QVBoxLayout	  *m_layout41;
    QHBoxLayout	  *m_layout411;
    QVBoxLayout	  *m_layout42;
    QHBoxLayout	  *m_layout421;
    TLabel        *m_lcountry;
    TLabel        *m_lemail;
    TLabel        *m_lgroups;
    TLabel        *m_llanguage;
    TLabel        *m_lmembers;
    TLabel        *m_lnat;
    TLabel        *m_lnatport;
    TLabel        *m_lnewdeviceauthor;
    TLabel        *m_lnewdevicedescription;
    TLabel        *m_lnewdevicedriver;
    TLabel        *m_lnewdevicefamily;
    TLabel        *m_lnewdeviceversion;
    bool           m_loading;
    TLabel        *m_lremotesetup;
    TLabel        *m_lsitedescription;
    TLabel        *m_lsiteid;
    TLabel        *m_lsitename;
    TLabel        *m_ltheme;
    TLabel        *m_ltown;
    TLabel        *m_lupnp;
    TLabel        *m_lwebsite;
    QString        m_masterserver;
    TButton       *m_memberaddbutton;
    TButton       *m_memberdeletebutton;
    TList         *m_memberlist;
    TLineEdit     *m_membername;
    TFrame        *m_members;
    TPane         *m_membersheader;
    int            m_messageseq;
    TCheck        *m_nat;
    TPane         *m_natgroup;
    TLineEdit     *m_natport;
    TcFrame       *m_newdevice;
    TButton       *m_newdeviceacceptbutton;
    TLabel        *m_newdeviceauthor;
    TPane         *m_newdevicebuttons;
    TButton       *m_newdevicecancelbutton;
    TLabel        *m_newdevicedescription;
    TComboBox     *m_newdevicedriver;
    TComboBox     *m_newdevicefamily;
    TPane         *m_newdevicepanel;
    TLabel        *m_newdeviceversion;
    QString        m_openingid;
    TPopup        *m_popup;
    TButton       *m_refreshbutton;
    TComboBox     *m_remotesetup;
    TButton       *m_savebutton;
    TPane         *m_settings1;
    TPane         *m_settings2;
    TPane         *m_settings3;
    TPane         *m_settings4;
    TTextEdit     *m_sitedescription;
    TLineEdit     *m_siteid;
    TComboBox     *m_sitelist;
    TLineEdit     *m_sitename;
    Settings       m_standarddrivers;
    TComboBox     *m_theme;
    TLineEdit     *m_town;
    int            m_UIratio2;
    TCheck        *m_upnp;
    TLineEdit     *m_website;
    QTimer        *m_timer;

signals:
    void           closed();
    void           installed();
    void           messageFwIn(const Message &message);
    void           messageOut(const Message &message);
    void           settingsSaved();
};

#endif // SETTINGSPANEL_H
