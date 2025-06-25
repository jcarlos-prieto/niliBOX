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

#if !defined UI_H
#define UI_H

#include "common/message.h"
#include <QWidget>

class ClientSession;
class ConfigSession;
class QHBoxLayout;
class QPropertyAnimation;
class QScrollArea;
class QVBoxLayout;
class TButton;
class TLabel;
class TPane;
class TbButton;

class UI : public QWidget
{
    Q_OBJECT

public:
    explicit             UI(QWidget *parent = nullptr);
    virtual             ~UI();

    void                 messageIn(const Message &message);
    void                 start();

private:
    bool                 appExists(const QString &id) const;
    void                 animation2Finished();
    void                 animation3Finished();
    void                 animation4Finished();
    void                 appButtonAdd(const QString &id, TPane *panel);
    void                 appButtonDelete(const QString &id);
    void                 appClose(const QString &id);
    void                 appOpen(const QString &id);
    void                 appShow(const QString &id);
    void                 changeEvent(QEvent *event) override;
    void                 clientSessionClosed(ClientSession *clientsession);
    void                 clientSessionError(ClientSession *clientsession);
    void                 clientSessionInstalled(ClientSession *session);
    void                 closeEvent(QCloseEvent *event) override;
    void                 confClose(const QString &id);
    void                 confOpen(const QString &id);
    void                 configSessionClosed(ConfigSession *clientsession);
    void                 configSessionError(ConfigSession *clientsession);
    void                 configSessionInstalled(ConfigSession *session);
    void                 devicesButtonClicked();
    void                 devicesPanelClosed();
    void                 infoButtonClicked();
    void                 infoPanelClosed();
    void                 messageFwOut(const Message &message);
    void                 moveEvent(QMoveEvent *event) override;
    void                 notice(const QByteArray notice);
    void                 openCloseButtonClicked();
    void                 pinButtonClicked();
    void                 redraw();
    void                 resizeEvent(QResizeEvent *event) override;
    void                 setLanguage();
    void                 setTheme();
    void                 settingsButtonClicked();
    void                 settingsPanelClosed();
    void                 stopSplash();

    QPropertyAnimation  *m_animation0;
    QPropertyAnimation  *m_animation1;
    QPropertyAnimation  *m_animation2;
    QPropertyAnimation  *m_animation3;
    QPropertyAnimation  *m_animation4;
    int                  m_animationdelay;
    QVBoxLayout         *m_appbuttons;
    float                m_appPadding;
    TButton             *m_arrow;
    TbButton            *m_currapp;
    TButton             *m_devicesbutton;
    float                m_dpi;
    TPane               *m_frame0;
    TPane               *m_frame10;
    QScrollArea         *m_frame10_s;
    TPane               *m_frame11;
    TPane               *m_frame1;
    TPane               *m_frame2;
    TButton             *m_infobutton;
    QString              m_langname;
    QVBoxLayout         *m_layout1;
    QHBoxLayout         *m_layout11;
    QVBoxLayout         *m_layout2;
    TLabel              *m_loading;
    TPane               *m_logo;
    QString              m_masterserver;
    bool                 m_open;
    TButton             *m_openclose;
    bool                 m_openingapp;
    QList<QString>       m_pendingapps;
    TButton             *m_pinbutton;
    bool                 m_pinned;
    QScreen             *m_screen;
    TButton             *m_settingsbutton;
    bool                 m_splash;
    QString              m_themename;
    float                m_topmargin;
    float                m_UIratio;
    float                m_UImaxunit;
    float                m_UIminunit;
    float                m_UIratio1;
    float                m_UIratio2;

signals:
    void                 messageFwIn(const Message &message);
    void                 messageOut(const Message &message);
    void                 started();
};

#endif // UI_H
