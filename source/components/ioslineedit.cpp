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

#include "ioslineedit.h"
#include <QApplication>


LineEdit::LineEdit(QWidget *parent) : QLineEdit(parent)
{
    setMaximumSize(10, 10);
    move(-10, -10);
    lower();
}


void LineEdit::init(const QString &currentText)
{
    setText(currentText);
    show();
    setFocus();
}


IosLineEdit::IosLineEdit(QObject *parent) : QObject(parent)
{
    QWidget *parentwidget = nullptr;

    for (QWidget *&widget : qApp->allWidgets())
        if (widget->objectName() == "ui")
            parentwidget = widget;

    m_lineedit = new LineEdit(parentwidget);

    connect(m_lineedit, &LineEdit::textChanged, this, &IosLineEdit::textChanged);
    connect(m_lineedit, &LineEdit::editingFinished, this, &IosLineEdit::editingFinished);
    connect(m_lineedit, &LineEdit::destroyed, this, [&](){m_lineedit = nullptr;});
    connect(this, &IosLineEdit::init, m_lineedit, &LineEdit::init);
    connect(this, &IosLineEdit::init, this, &IosLineEdit::shiftFocus,Qt::QueuedConnection);
}


IosLineEdit::~IosLineEdit()
{
    if (m_lineedit) {
        m_lineedit->deleteLater();
        m_lineedit = nullptr;
    }
}
