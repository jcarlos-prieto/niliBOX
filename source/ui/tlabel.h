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

#if !defined TLABEL_H
#define TLABEL_H

#include "ui/tpane.h"

class QLabel;


class TLabel : public TPane
{
    Q_OBJECT

public:
    explicit TLabel(const QString &name, QWidget *parent = nullptr);
    virtual ~TLabel();

    float    fontratio() const;
    int      heightForWidth(int w) const override;
    void     paintEvent(QPaintEvent *event) override;
    void     reload();
    void     setActive(const bool active);
    void     setAlignment(Qt::Alignment alignment);
    void     setEnabled(const bool enabled);
    void     setFontRatio(const float ratio);
    void     setHover(const bool hover);
    void     setName(const QString &name);
    void     setPressed(const bool pressed);
    void     setSelectable(const bool selectable);
    void     setText(const QString &text);
    void     setType(const QString &type);
    void     setTypeName(const QString &type, const QString &name);
    void     setWordWrap(const bool wrap);
    QSize    sizeHint() const override;
    QString  text() const;

protected:
    QColor   m_tc;

private:
    void     changeEvent(QEvent *event) override;

    float    m_fontratio;
    QLabel  *m_label;
    QString  m_linkcolor;
    QString  m_text;
};

#endif // TLABEL_H
