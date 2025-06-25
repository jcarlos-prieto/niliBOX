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
#include "ui/tpopup.h"
#include <QGraphicsOpacityEffect>
#include <QPropertyAnimation>
#include <QVBoxLayout>


TPopup::TPopup(QWidget *parent) : TPane("", parent)
{

    m_instance.clear();
    m_text.clear();
    m_buttons.clear();
    m_active = false;

    m_box = new TPane("", this);
    m_contentbox = new TPane("", this);
    m_iconbox = new TPane("", this);
    m_textbox = new TLabel("", this);
    m_buttonsbox = new TPane("", this);

    m_textbox->setWordWrap(true);
    setName("TPopup");

    m_layout = new QVBoxLayout(this);
    m_vlayout = new QVBoxLayout(m_box);
    m_hlayout = new QHBoxLayout(m_contentbox);
    m_blayout = new QHBoxLayout(m_buttonsbox);

    m_layout->setAlignment(Qt::AlignCenter);
    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout->addWidget(m_box);
    m_hlayout->setAlignment(Qt::AlignLeft);
    m_hlayout->setContentsMargins(0, 0, 0, 0);
    m_hlayout->setSpacing(0);
    m_hlayout->addWidget(m_iconbox);
    m_hlayout->addWidget(m_textbox);
    m_blayout->setContentsMargins(0, 0, 0, 0);
    m_blayout->setSpacing(0);
    m_vlayout->setContentsMargins(0, 0, 0, 0);
    m_vlayout->setSpacing(0);
    m_vlayout->addWidget(m_contentbox);
    m_vlayout->addWidget(m_buttonsbox);
    m_vlayout->setStretchFactor(m_contentbox, 1);

    m_animation = new QPropertyAnimation(this);
    m_opacity = new QGraphicsOpacityEffect(this);
    setGraphicsEffect(m_opacity);

    m_animation->setTargetObject(m_opacity);
    m_animation->setPropertyName("opacity");
    m_animation->setEasingCurve((QEasingCurve::Type)(G_LOCALSETTINGS.get("ui.animationtype").toInt()));
    m_animation->setDuration(G_LOCALSETTINGS.get("ui.animationdelay").toInt());
    m_animation->setStartValue(0.0f);
    m_animation->setEndValue(1.0f);
    connect(m_animation, &QPropertyAnimation::finished, this, &TPopup::animationFinished);
}

TPopup::~TPopup()
{

}


void TPopup::close() const
{
    m_animation->setDirection(QAbstractAnimation::Backward);
    m_animation->start();
}


void TPopup::exec()
{
    m_active = true;
    raise();
    redraw();
    m_animation->setDirection(QAbstractAnimation::Forward);
    m_animation->start();
}


QString TPopup::instance() const
{
    return m_instance;
}


bool TPopup::isActive() const
{
    return m_active;
}


void TPopup::redraw()
{
    if (m_active)
        resize(parentWidget()->size());
    else
        resize(0, 0);

    m_iconbox->setFixedSize(2 * G_UNIT_L, 2 * G_UNIT_L);
    m_box->setFixedWidth(qMax(0, qMin(width() - static_cast<int>(G_UNIT_L), m_iconbox->width() + m_textbox->sizeHint().width() + m_box->spacing()) + m_box->horizontalGap()));
    m_box->setFixedHeight(qMax(0, qMin(height() - static_cast<int>(G_UNIT_L) - m_box->spacing(), static_cast<int>(G_UNIT_L) + qMax(m_textbox->heightForWidth(m_textbox->width()), m_iconbox->height()) + m_contentbox->spacing()) + m_box->verticalGap()));
    m_textbox->setFixedWidth(qMax(0, m_box->width() - m_iconbox->width() - m_box->horizontalGap() - m_box->spacing()));

    QList<TButton *> buttons = findChildren<TButton *>();
    for (TButton *&button : buttons) {
        button->setMaximumWidth(4 * G_UNIT_L);
        button->setFixedHeight(G_UNIT_L);
    }
}


QString TPopup::selected() const
{
    return m_selected;
}


void TPopup::setButtons(const QList<QString> &buttons)
{
    m_buttons = buttons;

    int n = m_blayout->count();
    for (int i = 0; i < n; ++i)
        (static_cast<TPane *>(m_blayout->itemAt(i)->widget()))->deleteLater();

    if (m_buttons.count() > 0) {
        for (QString &name : m_buttons) {
            TButton *button = new TButton("TPopup.button", this);
            button->setText(name);
            m_blayout->addWidget(button);
            connect(button, &TButton::clicked, this, &TPopup::buttonClicked);
        }
    }

    redraw();
}


void TPopup::setIcon(const IconType &icon)
{
    if (icon == TPopup::I_Information)
        m_iconbox->setName("TPopup.icon.info");
    else if (icon == TPopup::I_Question)
        m_iconbox->setName("TPopup.icon.ques");
    else if (icon == TPopup::I_Warning)
        m_iconbox->setName("TPopup.icon.warn");
    else if (icon == TPopup::I_Critical)
        m_iconbox->setName("TPopup.icon.crit");

    redraw();
}


void TPopup::setInstance(const QString &instance)
{
    m_instance = instance;
}


void TPopup::setName(const QString &name)
{
    TPane::setName(name);
    m_box->setName(name + ".box");
    m_textbox->setName(name + ".text");
    m_buttonsbox->setName(name + ".buttons");
    reload();
}


void TPopup::setText(const QString &text)
{
    m_text = text;
    m_textbox->setText(m_text);
    redraw();
}


void TPopup::setType(const QString &type)
{
    TPane::setType(type);
    m_box->setType(type + ".box");
    m_textbox->setType(type + ".text");
    m_buttonsbox->setType(type + ".buttons");
    reload();
}


void TPopup::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    m_box->setTypeName(type + ".box", name + ".box");
    m_textbox->setTypeName(type + ".text", name + ".text");
    m_buttonsbox->setTypeName(type + ".buttons", name + ".buttons");
    reload();
}


void TPopup::animationFinished()
{
    if (m_animation->direction() == QAbstractAnimation::Backward) {
        emit optionSelected();
        m_active = false;
    }

    redraw();
}


void TPopup::buttonClicked(TButton *button)
{
    m_selected = button->text();
    close();
}


void TPopup::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event)
    redraw();
}
