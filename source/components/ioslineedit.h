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

#if !defined IOSLINEEDIT_H
#define IOSLINEEDIT_H

#include <QLineEdit>


class LineEdit : public QLineEdit
{
    Q_OBJECT

public:
    explicit    LineEdit(QWidget *parent = nullptr);
    void        init(const QString &currentText);
};


class IosLineEdit : public QObject
{
    Q_OBJECT

public:
    explicit    IosLineEdit(QObject *parent = nullptr);
    virtual    ~IosLineEdit();

signals:
    void        editingFinished();
    void        init(const QString &currentText);
    void        shiftFocus();
    void        textChanged(const QString &text);

protected:
    LineEdit  *m_lineedit = nullptr;
};

#endif // IOSLINEEDIT_H
