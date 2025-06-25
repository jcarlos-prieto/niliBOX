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

#include "ui/tlabel.h"
#include <QDesktopServices>
#include <QEvent>
#include <QLabel>


TLabel::TLabel(const QString &name, QWidget *parent) : TPane("", parent)
{
    m_label = new QLabel(this);
    m_label->setStyleSheet("background-color:transparent");

    connect(m_label, &QLabel::linkActivated, this, [](const QString &link) {
        QDesktopServices::openUrl(QUrl(link));
    });

    setTypeName("TLabel", name);

    m_fontratio = 1.0;
    m_text = "";
    m_linkcolor = "";

    reload();
    setFont(font());
}


TLabel::~TLabel()
{

}


float TLabel::fontratio() const
{
    return m_fontratio;
}


int TLabel::heightForWidth(int w) const
{
    return m_label->heightForWidth(w - horizontalGap()) + verticalGap();
}


void TLabel::paintEvent(QPaintEvent *event)
{
    TPane::paintEvent(event);

    m_label->setContentsMargins(0, 0, 0, 0);
    m_label->setGeometry(internalGeometry());
}


void TLabel::reload()
{
    QString style;

    style = getStyle("text-color");
    QPalette p;
    p.setColor(QPalette::Base, QColorConstants::Transparent);
    if (style.isEmpty())
        m_tc = QColorConstants::Transparent;
    else
        m_tc = QColor(style);
    p.setColor(QPalette::WindowText, m_tc);
    m_label->setPalette(p);

    m_linkcolor = getStyle("link-color");
    if (!m_linkcolor.isEmpty()) {
        QString ntext = m_text;
        ntext.replace("<a", "<a style='color:" + m_linkcolor + "'");
        m_label->setText(ntext);
    }

    style = getStyle("text-weight").toUpper();
    QFont f = font();
    if (style == "BOLD")
        f.setBold(true);
    else
        f.setBold(false);
    m_label->setFont(f);

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
    else if (style == "CENTER")
        setAlignment(Qt::AlignCenter);
    else if (style == "BASELINE")
        setAlignment(Qt::AlignBaseline);
    else
        setAlignment(Qt::AlignCenter);

    style = getStyle("text-font");
    if (style.isEmpty())
        m_fontratio = 1;
    else
        m_fontratio = style.toFloat();

    TPane::reload();
    update();
}


void TLabel::setActive(const bool active)
{
    if (isActive() == active)
        return;

    TPane::setActive(active);
    reload();
}


void TLabel::setAlignment(Qt::Alignment alignment)
{
    m_label->setAlignment(alignment);
}


void TLabel::setEnabled(const bool enabled)
{
    if (isEnabled() == enabled)
        return;

    TPane::setEnabled(enabled);
    reload();
}


void TLabel::setFontRatio(const float ratio)
{
    if (ratio == m_fontratio)
        return;

    m_fontratio = ratio;

    QFont f = font();
    f.setPixelSize(m_fontratio * f.pixelSize());
    m_label->setFont(f);
}


void TLabel::setHover(const bool hover)
{
    if (isHover() == hover)
        return;

    TPane::setHover(hover);
    reload();
}


void TLabel::setName(const QString &name)
{
    TPane::setName(name);
    reload();
}


void TLabel::setPressed(const bool pressed)
{
    if (isPressed() == pressed)
        return;

    TPane::setPressed(pressed);
    reload();
}


void TLabel::setSelectable(const bool selectable)
{
    if (selectable)
        m_label->setTextInteractionFlags(Qt::TextSelectableByMouse);
    else
        m_label->setTextInteractionFlags(Qt::NoTextInteraction);
}


void TLabel::setText(const QString &text)
{
    m_text = text;
    QString ntext = text;
    if (!m_linkcolor.isEmpty())
        ntext.replace("<a", "<a style='color:" + m_linkcolor + "'");

    m_label->setText(ntext);
    m_label->adjustSize();
    setMinimumSize(m_label->size() + gap());
}


void TLabel::setType(const QString &type)
{
    TPane::setType(type);
    reload();
}


void TLabel::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    reload();
}


void TLabel::setWordWrap(const bool wrap)
{
    m_label->setWordWrap(wrap);
}


QSize TLabel::sizeHint() const
{
    return m_label->sizeHint() + gap();
}


QString TLabel::text() const
{
    return m_text;
}


void TLabel::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::FontChange) {
        QFont f = font();
        f.setPixelSize(m_fontratio * f.pixelSize());
        m_label->setFont(f);
    } else if (event->type() == QEvent::PaletteChange)
        reload();
}
