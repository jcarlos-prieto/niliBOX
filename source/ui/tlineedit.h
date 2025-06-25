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

#if !defined TLINEEDIT_H
#define TLINEEDIT_H

#include "ui/tpane.h"

class QLineEdit;
class QValidator;


class TLineEdit : public TPane
{
    Q_OBJECT

public:
    explicit    TLineEdit(const QString &name, QWidget *parent = nullptr);
    virtual    ~TLineEdit();

    void        reload();
    void        setActive(const bool active);
    void        setAlignment(Qt::Alignment alignment) const;
    void        setEnabled(const bool enabled);
    void        setHover(const bool hover);
    void        setName(const QString &name);
    void        setPressed(const bool pressed);
    void        setText(const QString &text);
    void        setType(const QString &type);
    void        setTypeName(const QString &type, const QString &name);
    void        setValidator(const QValidator *validator) const;
    QSize       sizeHint() const override;
    QString     text() const;

private:
    void        paintEvent(QPaintEvent *event) override;

    QLineEdit  *m_lineedit;

signals:
    void        textChanged(const QString &text);
};

#endif // TLINEEDIT_H
