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

#if !defined CONFIGSESSION_H
#define CONFIGSESSION_H

#include "common/message.h"
#include "common/settings.h"
#include "ui/tpane.h"

class App;
class QFormLayout;
class QHBoxLayout;
class QVBoxLayout;
class QVariantAnimation;
class TButton;
class TComboBox;
class TLabel;
class TLineEdit;
class TList;
class TPopup;


class ConfigSession : public TPane
{
    Q_OBJECT

public:
    explicit             ConfigSession(QString id, QWidget *parent = nullptr);
    virtual             ~ConfigSession();

    QString              errormessage() const;
    QString              id() const;
    QString              sessionID() const;
    QString              caption() const;
    void                 install();
    void                 messageIn(const Message &message);

private:
    void                 allowedClicked();
    void                 allowedListClicked();
    void                 appError();
    void                 appInstalled();
    void                 changeEvent(QEvent *event) override;
    void                 changedDescription();
    void                 changedMode();
    void                 changedName();
    void                 closeButtonClicked();
    void                 loadAllowed();
    void                 popupOptionSelected();
    void                 redraw();
    void                 resizeEvent(QResizeEvent *event) override;
    void                 send(const QString &key, const QString &value);

    TButton             *m_allowed;
    TList               *m_allowedlist;
    QVariantAnimation   *m_animation;
    App                 *m_app;
    TLabel              *m_appcaption;
    QString              m_caption;
    TButton             *m_closebutton;
    Settings             m_config;
    TLineEdit           *m_description;
    QString              m_deviceid;
    TLineEdit           *m_devid;
    QString              m_error;
    TPane               *m_frame0;
    TPane               *m_frame1;
    TPane               *m_frame11;
    TPane               *m_frame2;
    QString              m_id;
    QVBoxLayout         *m_layout;
    QHBoxLayout         *m_layout0;
    QFormLayout         *m_layout1;
    QHBoxLayout         *m_layout11;
    QHBoxLayout         *m_layout2;
    TLabel              *m_ldescription;
    TLabel              *m_ldevid;
    TLabel              *m_lmode;
    TLabel              *m_lname;
    int                  m_messageseq;
    TComboBox           *m_mode;
    TLineEdit           *m_name;
    TPopup              *m_popup;
    QString              m_sessionid;
    QString              m_siteid;

signals:
    void                 closed(ConfigSession *configsession);
    void                 error(ConfigSession *configsession);
    void                 installed(ConfigSession *configsession);
    void                 messageOut(const Message &message);
};

#endif // CONFIGSESSION_H
