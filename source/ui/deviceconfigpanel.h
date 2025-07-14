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

#if !defined DEVICECONFIGPANEL_H
#define DEVICECONFIGPANEL_H

#include "common/message.h"
#include "ui/tcframe.h"

class App;
class QFormLayout;
class QVariantAnimation;
class Settings;
class TComboBox;
class TLineEdit;
class TList;
class TTextEdit;

class DeviceConfigPanel : public TcFrame
{
    Q_OBJECT

public:
    explicit           DeviceConfigPanel(const QString &siteid, const QString &deviceid, Settings *config, QWidget *parent = nullptr);
    virtual           ~DeviceConfigPanel();

    void               commit() const;
    void               deleteButtonClicked();
    void               install();
    void               messageIn(const Message &message) const;

private:
    void               appInstalled();
    void               changeEvent(QEvent *event) override;
    void               configAppPropertyChanged(const QString &key, const QString &value);
    void               changedMode();
    void               allowedClicked();
    void               allowedListClicked();
    void               loadAllowed();
    void               redraw();
    void               resizeEvent(QResizeEvent *event) override;

    App               *m_app;
    QString            m_devid;
    QString            m_id;
    QString            m_siteid;
    QFormLayout       *m_layout2;
    QHBoxLayout       *m_layout1;
    QHBoxLayout       *m_layout21;
    QVBoxLayout       *m_layout0;
    QVBoxLayout       *m_layout3;
    QVariantAnimation *m_animation;
    Settings          *m_config;
    TButton           *m_deletebutton;
    TButton           *m_allowed;
    TComboBox         *m_mode;
    TLabel            *m_ldescription;
    TLabel            *m_ldeviceid;
    TLabel            *m_ldrivername;
    TLabel            *m_lmode;
    TLabel            *m_lname;
    TLineEdit         *m_deviceid;
    TLineEdit         *m_drivername;
    TLineEdit         *m_name;
    TList             *m_allowedlist;
    TPane             *m_frame0;
    TPane             *m_frame1;
    TPane             *m_frame21;
    TPane             *m_frame2;
    TPane             *m_frame3;
    TTextEdit         *m_description;
    int                m_messageseq;

signals:
    void               messageOut(const Message &message);
    void               installed();
};

#endif // DEVICECONFIGPANEL_H
