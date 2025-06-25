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
#include "ui/tbutton.h"
#include "ui/tcframe.h"
#include <QPropertyAnimation>
#include <QVBoxLayout>


TcFrame::TcFrame(const QString name, QWidget *parent) : TPane("", parent)
{
    m_todelete = false;

    m_header = new TButton("", this);
    m_title = new TLabel("", this);
    m_arrow = new TPane("", this);
    m_body = new TPane("", this);

    setTypeName("TcFrame", name);
    setActive(false);

    connect(m_header, &TButton::clicked, this, &TcFrame::headerButtonClicked);

    m_animation1 = new QPropertyAnimation(this);
    m_animation1->setTargetObject(m_header);
    m_animation1->setPropertyName("maximumHeight");
    m_animation1->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation1->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation1->setStartValue(0);
    m_animation1->setEndValue(0);
    connect(m_animation1, &QPropertyAnimation::valueChanged, this, &TcFrame::redraw);
    connect(m_animation1, &QPropertyAnimation::finished, this, &TcFrame::animation1Finished);

    m_animation2 = new QPropertyAnimation(this);
    m_animation2->setTargetObject(m_body);
    m_animation2->setPropertyName("maximumHeight");
    m_animation2->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation2->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation2->setStartValue(0);
    m_animation2->setEndValue(0);
    connect(m_animation2, &QPropertyAnimation::valueChanged, this, &TcFrame::animation2Updated);
    connect(m_animation2, &QPropertyAnimation::finished, this, &TcFrame::animation2Finished);

    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_header);
    m_layout1 = new QVBoxLayout(m_body);

    m_layout->setAlignment(Qt::AlignTop);
    m_layout->addWidget(m_header);
    m_layout->addWidget(m_body);
    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout0->addWidget(m_title);
    m_layout0->addWidget(m_arrow);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);

    m_header->setMaximumHeight(0);
    m_body->setMaximumHeight(0);
    animateHeader();
}


TcFrame::~TcFrame()
{

}


bool TcFrame::isCollapsed() const
{
    return !isActive();
}


void TcFrame::setCollapsed(const bool collapsed)
{
    if (!isActive() == collapsed)
        return;

    if (!collapsed) {
        setActive(true);
        m_header->setActive(true);
        m_body->setActive(true);
    }

    m_animation2->setEndValue(m_frame->height() + m_body->verticalGap());
    m_animation2->setDirection(!collapsed ? QAbstractAnimation::Forward : QAbstractAnimation::Backward);
    m_animation2->start();
}


void TcFrame::setContent(TPane *frame)
{
    m_frame = frame;
    m_layout1->addWidget(m_frame);
    connect(m_frame, &TPane::resized, this, &TcFrame::redraw);
}


void TcFrame::setName(const QString &name)
{
    TPane::setName(name);
    m_header->setName(name + ".header");
    m_title->setName(name + ".header.title");
    m_arrow->setName(name + ".header.arrow");
    m_body->setName(name + ".body");
}


void TcFrame::setText(const QString &text)
{
    m_title->setText(text);
}


void TcFrame::setToolTip(const QString &tooltip)
{
    m_title->setToolTip(tooltip);
}


void TcFrame::setType(const QString &type)
{
    TPane::setType(type);
    m_header->setType(type + ".header");
    m_title->setType(type + ".header.title");
    m_arrow->setType(type + ".header.arrow");
    m_body->setType(type + ".body");
}


void TcFrame::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    m_header->setTypeName(type + ".header", name + ".header");
    m_title->setTypeName(type + ".header.title", name + ".header.title");
    m_arrow->setTypeName(type + ".header.arrow", name + ".header.arrow");
    m_body->setTypeName(type + ".body", name + ".body");
}


QSize TcFrame::sizeHint() const
{
    return m_header->size() + QSize(0, m_body->maximumHeight());
}


void TcFrame::smash()
{
    m_todelete = true;

    if (!isCollapsed())
        setCollapsed(true);
    else
        animateHeader();
}


QString TcFrame::text()
{
    return m_title->text();
}


void TcFrame::animateHeader() const
{
    m_animation1->setEndValue(G_UNIT_L);
    m_animation1->setDirection(m_todelete ? QAbstractAnimation::Backward : QAbstractAnimation::Forward);
    m_animation1->start();
}


void TcFrame::animation1Finished()
{
    if (m_todelete)
        deleteLater();
}


void TcFrame::animation2Finished()
{
    if (m_animation2->direction() == QAbstractAnimation::Backward) {
        setActive(false);
        m_header->setActive(false);
        m_body->setActive(false);
    }

    if (m_todelete)
        animateHeader();
}


void TcFrame::animation2Updated()
{
    m_animation2->setEndValue(m_frame->height() + m_body->verticalGap());
    redraw();
}


void TcFrame::headerButtonClicked()
{
    setCollapsed(isActive());
    emit headerClicked(this);
}


void TcFrame::redraw()
{
    if (m_animation1->state() == QAbstractAnimation::Running) {
        m_header->setHeight(m_header->maximumHeight());
    } else
        m_header->setHeight(G_UNIT_L);

    m_arrow->setFixedWidth(m_header->height());

    if (m_animation2->state() == QAbstractAnimation::Running)
        m_arrow->rotate(180 * m_animation2->currentValue().toInt() / m_animation2->endValue().toInt());
    else if (isActive())
        m_body->setMaximumHeight(m_frame->height() + m_body->verticalGap());

    setFixedHeight(m_header->maximumHeight() + m_body->maximumHeight());

    emit resized();
}
