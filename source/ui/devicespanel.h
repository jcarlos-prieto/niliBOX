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
#include <QGridLayout>

class HttpSession;
class QFormLayout;
class QHBoxLayout;
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


class BGridLayout : public QGridLayout
{
public:
    explicit             BGridLayout(QWidget *parent = nullptr);
    virtual             ~BGridLayout();

    void                 addWidget(QWidget *widget);
    void                 clean(QObject *widget);
    void                 insertWidget(const int pos, QWidget *widget);
    QLayoutItem         *itemAt(const int pos);
    int                  numColumns();
    void                 setNumColumns(const int numcolumns);
    QLayoutItem         *takeAt(const int pos);

private:
    int                  m_numcolumns;
};


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
    void                 favoriteDelete(const QString &id);
    void                 favoriteSave() const;
    void                 favoritesLoad();
    void                 filter();
    void                 getDevices();
    void                 httpSessionFinished(HttpSession *httpsession);
    void                 messageFwOut(const Message &message);
    void                 moveEvent(QMoveEvent *event) override;
    void                 newFavoriteAcceptButtonClicked();
    void                 newFavoriteCancelButtonClicked() const;
    void                 newFavoriteInfoButtonClicked() const;
    void                 openApp(const QString &id);
    void                 openAppTimeout();
    void                 pinButtonClicked();
    void                 redraw() const;
    void                 refreshButtonClicked();
    void                 resizeEvent(QResizeEvent *event) override;
    void                 showInfo(const QString &id) const;

    BGridLayout         *m_appfavorites;
    BGridLayout         *m_appglobal;
    BGridLayout         *m_applocal;
    BGridLayout         *m_appnear;
    QList<TbButton *>    m_buttons;
    TButton             *m_closebutton;
    bool                 m_favloaded;
    TcFrame             *m_filter;
    TComboBox           *m_filterdriver;
    TComboBox           *m_filterfamily;
    bool                 m_filtering;
    TPane               *m_filterpanel;
    TLineEdit           *m_filtertext;
    TPane               *m_frame0;
    TPane               *m_frame1;
    TPane               *m_frame10;
    TFrame              *m_frame101;
    TPane               *m_frame10101;
    TPane               *m_frame1011;
    QScrollArea         *m_frame1011_s;
    TPane               *m_frame10110;
    TPane               *m_frame10111;
    TPane               *m_frame10112;
    TPane               *m_frame11;
    TFrame              *m_frame111;
    TPane               *m_frame1111;
    QScrollArea         *m_frame1111_s;
    TPane               *m_iconglobal;
    TPane               *m_iconlocal;
    Settings             m_knownsites;
    TLabel              *m_labelfavorites;
    TLabel              *m_labellocal;
    TLabel              *m_labelnear;
    TLabel              *m_labelglobal;
    QVBoxLayout         *m_layout;
    QHBoxLayout         *m_layout0;
    QHBoxLayout         *m_layout1;
    QVBoxLayout         *m_layout10;
    QVBoxLayout         *m_layout101;
    QFormLayout         *m_layout1010;
    QVBoxLayout         *m_layout1011;
    QHBoxLayout         *m_layout10101;
    QVBoxLayout         *m_layout11;
    QVBoxLayout         *m_layout111;
    QFormLayout         *m_layout1110;
    TLabel              *m_lfilterdriver;
    TLabel              *m_lfilterfamily;
    TLabel              *m_lfiltertext;
    TLabel              *m_lnewfavoriteid;
    QString              m_masterserver;
    TcFrame             *m_newfavorite;
    TButton             *m_newfavoriteacceptbutton;
    TButton             *m_newfavoritecancelbutton;
    TButton             *m_newfavoriteinfobutton;
    TLineEdit           *m_newfavoriteid;
    TPane               *m_newfavoritepanel;
    int                  m_numfavorites;
    QString              m_openingid;
    TButton             *m_pinbutton;
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
