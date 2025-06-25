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
#include "ui/tbbutton.h"
#include <QMouseEvent>
#include <QVariantAnimation>


TbButton::TbButton(const QString &name, QWidget *parent) : TButton("", parent)
{
    m_blind1 = new TButton("", this);
    m_blind2 = new TButton("", this);

    setTypeName("TbButton", name);
    setActive(false);

    m_blind1->resize(0, 0);
    m_blind2->resize(0, 0);

    connect(m_blind1, &TButton::clicked, this, &TbButton::buttonClicked);
    connect(m_blind2, &TButton::clicked, this, &TbButton::buttonClicked);

    m_sliding = false;
    m_toclose = false;
    m_x0 = 0;
    m_x1 = 0;
    m_x2 = 0;
    m_numblinds = 0;

    m_animation1 = new QVariantAnimation(this);
    m_animation1->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation1->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation1->setDirection(QAbstractAnimation::Forward);
    connect(m_animation1, &QVariantAnimation::valueChanged, this, &TbButton::animation1ValueChanged);
    connect(m_animation1, &QVariantAnimation::finished, this, &TbButton::animation1Finished);

    m_animation2 = new QVariantAnimation(this);
    m_animation2->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation2->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation2->setDirection(QAbstractAnimation::Forward);
    connect(m_animation2, &QVariantAnimation::valueChanged, this, &TbButton::animation2ValueChanged);
    m_animation2->setStartValue(0.0);
    m_animation2->setEndValue(1.5 * G_UNIT_L);
    m_animation2->start();

    hide();
}


TbButton::~TbButton()
{

}


QString TbButton::id() const
{
    return m_id;
}


TButton *TbButton::blind1() const
{
    return m_blind1;
}


TButton *TbButton::blind2() const
{
    return m_blind2;
}


TPane *TbButton::frame() const
{
    return m_frame;
}


int TbButton::numBlinds() const
{
    return m_numblinds;
}


void TbButton::close()
{
    m_toclose = true;

    if (m_x0 == 0)
        animation1Finished();
}


void TbButton::mouseMoveEvent(QMouseEvent *event)
{
    TButton::mouseMoveEvent(event);

    if (!m_sliding)
        return;

    m_x2 = event->position().x();
    redraw();
}


void TbButton::mousePressEvent(QMouseEvent *event)
{
    if (m_animation1->state() == QAbstractAnimation::Running)
        return;

    m_sliding = true;

    if (event->position().x() < width() - m_numblinds * m_x0)
        TButton::mousePressEvent(event);

    m_x1 = m_x0 + event->position().x();
    m_x2 = 0;
}


void TbButton:: mouseReleaseEvent(QMouseEvent *event)
{
    if (m_animation1->state() == QAbstractAnimation::Running)
        return;

    m_sliding = false;

    if (event->position().x() < width() - m_numblinds * m_x0) {
        TButton::mouseReleaseEvent(event);
        if (m_x2 == 0 || abs(m_x2 - m_x1) < 5) {
            buttonClicked(this);
            return;
        }
    }

    setPressed(false);

    if (m_x0 != 0 && m_x0 != height()) {
        m_animation1->setStartValue(m_x2);
        if (m_x0 < height() / 2)
            m_animation1->setEndValue(m_x1);
        else
            m_animation1->setEndValue(m_x1 - height());
        m_animation1->start();
    }
}


void TbButton::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}


void TbButton::setFrame(TPane *frame)
{
    m_frame = frame;
}


void TbButton::setID(const QString &id)
{
    m_id = id;
}


void TbButton::setName(const QString &name)
{
    TButton::setName(name);
    m_blind1->setName(name + ".blind1");
    m_blind2->setName(name + ".blind2");
}


void TbButton::setNumBlinds(const int numblinds)
{
    m_numblinds = numblinds;
}


void TbButton::setType(const QString &type)
{
    TButton::setType(type);
    m_blind1->setType(type + ".blind1");
    m_blind2->setType(type + ".blind2");
}


void TbButton::setTypeName(const QString &type, const QString &name)
{
    TButton::setTypeName(type, name);
    m_blind1->setTypeName(type + ".blind1", name + ".blind1");
    m_blind2->setTypeName(type + ".blind2", name + ".blind2");
}


void TbButton::animation1Finished() const
{
    if (!m_toclose)
        return;

    m_animation2->setDirection(QAbstractAnimation::Backward);
    connect(m_animation2, &QVariantAnimation::finished, this, &TbButton::deleteLater);
    m_animation2->setEndValue(1.5 * G_UNIT_L);
    m_animation2->start();
}


void TbButton::animation1ValueChanged()
{
    if (m_animation1->state() != QAbstractAnimation::Running)
        return;

    m_x2 = m_animation1->currentValue().toInt();
    redraw();
}


void TbButton::animation2ValueChanged()
{
    if (m_animation2->state() != QAbstractAnimation::Running)
        return;

    setFixedHeight(m_animation2->currentValue().toInt());
    show();
}


void TbButton::buttonClicked(TButton *button)
{
    if (button == this) {
        if (isEnabled())
            emit clicked0(m_id);
        return;
    } else if (button == m_blind1)
        emit clicked1(m_id);
    else if (button == m_blind2)
        emit clicked2(m_id);

    m_animation1->setStartValue(m_x2);
    m_animation1->setEndValue(m_x1);
    m_animation1->start();
}


void TbButton::redraw()
{
    if (m_animation2->state() != QAbstractAnimation::Running)
        setFixedHeight(1.5 * G_UNIT_L);

    if (m_numblinds == 0 || m_x2 == 0)
        return;

    QRectF geom = internalGeometry();

    m_x0 = m_x1 - m_x2;
    if (m_x0 < 0.0)
        m_x0 = 0.0;
    else if (m_x0 > geom.height() - 1)
        m_x0 = geom.height() - 1;

    if (m_numblinds > 0)
        m_blind1->setGeometry(geom.right() - (geom.height() + m_x0) / 2, geom.top(), m_x0, geom.height() - 1);

    if (m_numblinds > 1)
        m_blind2->setGeometry(geom.right() - (geom.height() + m_x0), geom.top(), m_x0, geom.height() - 1);
}
