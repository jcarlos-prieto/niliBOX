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

#if !defined TCFRAME_H
#define TCFRAME_H

#include "ui/tpane.h"

class QHBoxLayout;
class QPropertyAnimation;
class QVBoxLayout;
class TButton;
class TLabel;


class TcFrame : public TPane
{
    Q_OBJECT

public:
    explicit             TcFrame(const QString name, QWidget *parent = nullptr);
    virtual             ~TcFrame();

    bool                 isCollapsed() const;
    void                 setCollapsed(const bool collapsed);
    void                 setContent(TPane *frame);
    void                 setName(const QString &name);
    void                 setText(const QString &text);
    void                 setToolTip(const QString &tooltip);
    void                 setType(const QString &type);
    void                 setTypeName(const QString &type, const QString &name);
    QSize                sizeHint() const override;
    void                 smash();
    QString              text();

private:
    void                 animateHeader() const;
    void                 animation1Finished();
    void                 animation2Finished();
    void                 animation2Updated();
    void                 headerButtonClicked();
    void                 redraw();

    QPropertyAnimation  *m_animation1;
    QPropertyAnimation  *m_animation2;
    TPane               *m_arrow;
    TPane               *m_body;
    TPane               *m_frame;
    TButton             *m_header;
    QHBoxLayout         *m_layout0;
    QVBoxLayout         *m_layout1;
    QVBoxLayout         *m_layout;
    TLabel              *m_title;
    bool                 m_todelete;

signals:
    void                 headerClicked(TcFrame *collapsablepanel);
};

#endif // TCFRAME_H
