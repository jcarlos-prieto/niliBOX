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

#include "ui/ttextedit.h"
#include <QPlainTextEdit>


TTextEdit::TTextEdit(const QString &name, QWidget *parent) : TPane("", parent)
{
    m_textedit = new QPlainTextEdit(this);
    m_textedit->setFrameStyle(QFrame::NoFrame);
    m_textedit->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_textedit->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_textedit->setStyleSheet("background-color:transparent");

    setTypeName("TTextEdit", name);

    connect(m_textedit, &QPlainTextEdit::textChanged, this, &TTextEdit::textChanged);
}


TTextEdit::~TTextEdit()
{

}


void TTextEdit::reload()
{
    QString style;

    style = getStyle("text-color");
    QPalette p = m_textedit->palette();
    p.setColor(QPalette::Base, QColorConstants::Transparent);
    if (style.isEmpty())
        p.setColor(QPalette::Text, QColorConstants::Transparent);
    else
        p.setColor(QPalette::Text, QColor(style));
    m_textedit->setPalette(p);

    style = getStyle("text-weight");
    QFont f = font();
    if (style.compare("BOLD", Qt::CaseInsensitive) == 0)
        f.setBold(true);
    else
        f.setBold(false);
    m_textedit->setFont(f);

    TPane::reload();
    update();
}


void TTextEdit::setActive(const bool active)
{
    TPane::setActive(active);
    reload();
}


void TTextEdit::setEnabled(const bool enabled)
{
    TPane::setEnabled(enabled);
    reload();
}


void TTextEdit::setHover(const bool hover)
{
    TPane::setHover(hover);
    reload();
}


void TTextEdit::setLineWrap(bool wrap) const
{
    m_textedit->setLineWrapMode(wrap ? QPlainTextEdit::WidgetWidth : QPlainTextEdit::NoWrap);
}


void TTextEdit::setName(const QString &name)
{
    TPane::setName(name);
    reload();
}


void TTextEdit::setPressed(const bool pressed)
{
    TPane::setPressed(pressed);
    reload();
}


void TTextEdit::setReadOnly(const bool readonly) const
{
    m_textedit->setReadOnly(readonly);
}


void TTextEdit::setText(const QString &text)
{
    m_textedit->setPlainText(text);
    reload();
}


void TTextEdit::setType(const QString &type)
{
    TPane::setType(type);
    reload();
}


void TTextEdit::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    reload();
}


QSize TTextEdit::sizeHint() const
{
    return m_textedit->sizeHint() + gap();
}


QString TTextEdit::text() const
{
    return m_textedit->toPlainText();
}


void TTextEdit::paintEvent(QPaintEvent *event)
{
    TPane::paintEvent(event);
    m_textedit->setContentsMargins(0, 0, 0, 0);
    m_textedit->setGeometry(internalGeometry());
}


void TTextEdit::resizeEvent(QResizeEvent *event)
{
    update();
    TPane::resizeEvent(event);
}
