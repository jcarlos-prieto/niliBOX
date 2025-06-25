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

#if !defined INFOPANEL_H
#define INFOPANEL_H

#include "common/message.h"
#include "ui/tpane.h"

class QHBoxLayout;
class QScrollArea;
class QVBoxLayout;
class TButton;
class TComboBox;
class TLabel;
class TcFrame;


class InfoPanel : public TPane
{
    Q_OBJECT

public:
    explicit       InfoPanel(QWidget *parent = nullptr);
    virtual       ~InfoPanel();

    void           install();
    void           messageIn(const Message &message) const;

private:
    void           changeEvent(QEvent *event) override;
    void           closeButtonClicked();
    void           copyButtonClicked() const;
    void           logoButtonClicked() const;
    void           panelToggle(TcFrame *cpanel) const;
    void           redraw() const;
    void           refreshLogs() const;
    void           resizeEvent(QResizeEvent *event) override;
    void           verboseButtonClicked() const;

    TPane         *m_about;
    TcFrame       *m_cframe1;
    TcFrame       *m_cframe2;
    TcFrame       *m_cframe3;
    TButton       *m_closebutton;
    TButton       *m_copybutton;
    TPane         *m_debug;
    TPane         *m_frame0;
    TPane         *m_frame1;
    QVBoxLayout   *m_layout;
    QHBoxLayout   *m_layout0;
    QVBoxLayout   *m_layout1;
    QHBoxLayout   *m_layout10;
    QHBoxLayout   *m_layout11;
    QVBoxLayout   *m_layout12;
    QHBoxLayout   *m_layout120;
    TLabel        *m_licensetext;
    TPane         *m_license;
    QScrollArea   *m_license_s;
    TComboBox     *m_listfiles;
    TLabel        *m_log;
    QScrollArea   *m_log_s;
    TPane         *m_logo;
    TPane         *m_options;
    float          m_origlicwidth;
    TButton       *m_refreshbutton;
    int            m_UIratio2;
    TButton        *m_verbosebutton;
    TLabel         *m_version;

signals:
    void           closed();
    void           installed();
    void           messageOut(const Message &message);
};

#endif // INFOPANEL_H
