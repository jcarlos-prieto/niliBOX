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

#include "ui/tlineedit.h"
#include <QLineEdit>
#include <QMouseEvent>
#include <QLayout>


TLineEdit::TLineEdit(const QString &name, QWidget *parent) : TPane("", parent)
{
    m_lineedit = new QLineEdit(this);
    m_lineedit->setFrame(false);
    m_lineedit->setAttribute(Qt::WA_MacShowFocusRect, 0);
    m_lineedit->setStyleSheet("background-color:transparent");
    connect(m_lineedit, &QLineEdit::textChanged, this, &TLineEdit::textChanged);

    setTypeName("TLineEdit", name);
}


TLineEdit::~TLineEdit()
{

}


void TLineEdit::reload()
{
    QString style;

    style = getStyle("text-color");
    QPalette p = m_lineedit->palette();
    p.setColor(QPalette::Base, QColorConstants::Transparent);
    if (style.isEmpty())
        p.setColor(QPalette::Text, QColorConstants::Transparent);
    else
        p.setColor(QPalette::Text, QColor(style));
    m_lineedit->setPalette(p);

    style = getStyle("text-weight");
    QFont f = font();
    if (style.compare("BOLD", Qt::CaseInsensitive) == 0)
        f.setBold(true);
    else
        f.setBold(false);
    m_lineedit->setFont(f);

    style = getStyle("text-align").toUpper();
    if (style == "LEFT")
        setAlignment(Qt::AlignLeft);
    else if (style == "RIGHT")
        setAlignment(Qt::AlignRight);
    else if (style == "HCENTER")
        setAlignment(Qt::AlignHCenter);
    else if (style == "JUSTIFY")
        setAlignment(Qt::AlignJustify);
    else if (style == "TOP")
        setAlignment(Qt::AlignTop);
    else if (style == "BOTTOM")
        setAlignment(Qt::AlignBottom);
    else if (style == "RIGHT")
        setAlignment(Qt::AlignRight);
    else if (style == "VCENTER")
        setAlignment(Qt::AlignVCenter);
    else if (style == "BASELINE")
        setAlignment(Qt::AlignBaseline);
    else
        setAlignment(Qt::AlignCenter);

    TPane::reload();
    update();
}


void TLineEdit::setActive(const bool active)
{
    TPane::setActive(active);
    reload();
}


void TLineEdit::setAlignment(Qt::Alignment alignment) const
{
    m_lineedit->setAlignment(alignment);
}


void TLineEdit::setEnabled(const bool enabled)
{
    if (isEnabled() == enabled)
        return;

    m_lineedit->setReadOnly(!enabled);
    TPane::setEnabled(enabled);
    reload();
}


void TLineEdit::setHover(const bool hover)
{
    TPane::setHover(hover);
    reload();
}


void TLineEdit::setName(const QString &name)
{
    TPane::setName(name);
    reload();
}


void TLineEdit::setPressed(const bool pressed)
{
    TPane::setPressed(pressed);
    reload();
}


void TLineEdit::setText(const QString &text)
{
    m_lineedit->setText(text);
    reload();
}


void TLineEdit::setType(const QString &type)
{
    TPane::setType(type);
    reload();
}


void TLineEdit::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    reload();
}


void TLineEdit::setValidator(const QValidator *validator) const
{
    m_lineedit->setValidator(validator);
}


QSize TLineEdit::sizeHint() const
{
    return m_lineedit->sizeHint() + gap();
}


QString TLineEdit::text() const
{
    return m_lineedit->text();
}


void TLineEdit::paintEvent(QPaintEvent *event)
{
    TPane::paintEvent(event);
    m_lineedit->setContentsMargins(0, 0, 0, 0);
    m_lineedit->setGeometry(internalGeometry());
}
