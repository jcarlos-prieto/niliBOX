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

#if !defined DEVICESPANEL_H
#define DEVICESPANEL_H

#include "common/message.h"
#include "common/settings.h"
#include "ui/tpane.h"

class HttpSession;
class QFormLayout;
class QGridLayout;
class QHBoxLayout;
class QPropertyAnimation;
class QScrollArea;
class QVBoxLayout;
class TButton;
class TComboBox;
class TFrame;
class TLabel;
class TLineEdit;
class TPopup;
class TbButton;
class TcFrame;


class DevicesPanel : public TPane
{
    Q_OBJECT

public:
    explicit             DevicesPanel(QWidget *parent = nullptr);
    virtual             ~DevicesPanel();

    void                 install();
    void                 messageIn(const Message &message);

private:
    void                 changeEvent(QEvent *event) override;
    void                 closeButtonClicked();
    void                 favoriteAdd(const QString &id, const bool active = false);
    void                 favoriteCreate(const QString &id, const QString &caption, const bool active = false);
    void                 favoriteDefault(const QString &id) const;
    void                 favoriteDelete(const QString &id) const;
    void                 favoriteSave() const;
    void                 favoritesLoad();
    void                 filterGlobal();
    void                 filterLocal();
    void                 getDevices();
    void                 httpSessionFinished(HttpSession *httpsession);
    void                 iconGlobalClicked();
    void                 messageFwOut(const Message &message);
    void                 moveEvent(QMoveEvent *event) override;
    void                 newFavoriteAcceptButtonClicked();
    void                 newFavoriteCancelButtonClicked() const;
    void                 newFavoriteInfoButtonClicked() const;
    void                 openApp(const QString &id);
    void                 openAppTimeout();
    void                 redraw() const;
    void                 refreshButtonClicked();
    void                 reorderGlobal() const;
    void                 resizeEvent(QResizeEvent *event) override;
    void                 showInfo(const QString &id) const;

    QPropertyAnimation  *m_animation;
    QVBoxLayout         *m_appfavorites;
    QGridLayout         *m_appglobal;
    QVBoxLayout         *m_applocal;
    QList<TbButton *>    m_buttons;
    TButton             *m_closebutton;
    bool                 m_favloaded;
    bool                 m_filtering;
    TPane               *m_frame0;
    TPane               *m_frame1;
    TPane               *m_frame10;
    TFrame              *m_frame101;
    TPane               *m_frame10101;
    TPane               *m_frame1011;
    QScrollArea         *m_frame1011_s;
    TPane               *m_frame11;
    TFrame              *m_frame111;
    TPane               *m_frame1111;
    QScrollArea         *m_frame1111_s;
    TPane               *m_frame2;
    TFrame              *m_frame21;
    TPane               *m_frame211;
    QScrollArea         *m_frame211_s;
    TcFrame             *m_globalfilter;
    TComboBox           *m_globalfilterdriver;
    TComboBox           *m_globalfilterfamily;
    TPane               *m_globalfilterpanel;
    TLineEdit           *m_globalfiltertext;
    TPane               *m_iconfavorites;
    TButton             *m_iconglobal;
    TPane               *m_iconlocal;
    Settings             m_knownsites;
    QVBoxLayout         *m_layout;
    QHBoxLayout         *m_layout0;
    QHBoxLayout         *m_layout1;
    QVBoxLayout         *m_layout10;
    QVBoxLayout         *m_layout101;
    QFormLayout         *m_layout1010;
    QHBoxLayout         *m_layout10101;
    QVBoxLayout         *m_layout11;
    QVBoxLayout         *m_layout111;
    QFormLayout         *m_layout1110;
    QVBoxLayout         *m_layout2;
    QVBoxLayout         *m_layout21;
    QFormLayout         *m_layout210;
    TLabel              *m_lglobalfilterdriver;
    TLabel              *m_lglobalfilterfamily;
    TLabel              *m_lglobalfiltertext;
    TLabel              *m_llocalfilterdriver;
    TLabel              *m_llocalfilterfamily;
    TLabel              *m_llocalfiltertext;
    TLabel              *m_lnewfavoriteid;
    TcFrame             *m_localfilter;
    TComboBox           *m_localfilterdriver;
    TComboBox           *m_localfilterfamily;
    TPane               *m_localfilterpanel;
    TLineEdit           *m_localfiltertext;
    QString              m_masterserver;
    TcFrame             *m_newfavorite;
    TButton             *m_newfavoriteacceptbutton;
    TButton             *m_newfavoritecancelbutton;
    TButton             *m_newfavoriteinfobutton;
    TLineEdit           *m_newfavoriteid;
    TPane               *m_newfavoritepanel;
    QString              m_openingid;
    TPopup              *m_popup;
    QString              m_prevsites;
    TButton             *m_refreshbutton;
    Settings             m_standarddrivers;
    QTimer              *m_timer;

signals:
    void                 closed();
    void                 installed();
    void                 messageOut(const Message &message);
};

#endif // DEVICESPANEL_H
