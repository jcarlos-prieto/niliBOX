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

#include "ui/tbutton.h"


TButton::TButton(const QString &name, QWidget *parent) : TLabel("", parent)
{
    m_toggle = false;

    setTypeName("TButton", name);
}


TButton::~TButton()
{

}


bool TButton::isToggle() const
{
    return m_toggle;
}


void TButton::mousePressEvent(QMouseEvent *event)
{
    Q_UNUSED(event)

    if (!isEnabled())
        return;

    setPressed(!isPressed());

    emit clicked(this);
}


void TButton::mouseReleaseEvent(QMouseEvent *event)
{
    Q_UNUSED(event)

    if (!isEnabled())
        return;

    if (!m_toggle)
        setPressed(!isPressed());
}


void TButton::setToggle(const bool toggle)
{
    m_toggle = toggle;
    reload();
}
