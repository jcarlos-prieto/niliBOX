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

#if !defined TBUTTON_H
#define TBUTTON_H

#include "ui/tlabel.h"


class TButton : public TLabel
{
    Q_OBJECT

public:
    explicit TButton(const QString &name = "", QWidget *parent = nullptr);
    virtual ~TButton();

    bool     isToggle() const;
    void     mousePressEvent(QMouseEvent *event) override;
    void     mouseReleaseEvent(QMouseEvent *event) override;
    void     setToggle(const bool toggle);

private:
    bool     m_toggle;

signals:
    void     clicked(TButton *);
};

#endif // TBUTTON_H
