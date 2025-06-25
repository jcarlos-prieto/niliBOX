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

#if !defined TTEXTEDIT_H
#define TTEXTEDIT_H

#include "ui/tpane.h"

class QPlainTextEdit;


class TTextEdit : public TPane
{
    Q_OBJECT

public:
    explicit          TTextEdit(const QString &name, QWidget *parent = nullptr);
    virtual          ~TTextEdit();

    void              reload();
    void              setActive(const bool active);
    void              setEnabled(const bool enabled);
    void              setHover(const bool hover);
    void              setLineWrap(bool wrap = true) const;
    void              setName(const QString &name);
    void              setPressed(const bool pressed);
    void              setReadOnly(const bool readonly) const;
    void              setText(const QString &text);
    void              setType(const QString &type);
    void              setTypeName(const QString &type, const QString &name);
    QSize             sizeHint() const override;
    QString           text() const;

private:
    void              paintEvent(QPaintEvent *event) override;
    void              resizeEvent(QResizeEvent *event) override;

    QPlainTextEdit   *m_textedit;

signals:
    void              textChanged();
};

#endif // TTEXTEDIT_H
