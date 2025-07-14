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

#if !defined TLIST_H
#define TLIST_H

#include "ui/tpane.h"

class QTableWidget;
class QTableWidgetItem;


class TList : public TPane
{
    Q_OBJECT

public:
    explicit       TList(const QString &name, QWidget *parent = nullptr);
    virtual       ~TList();

    void           addRow(const QString &text);
    void           clear();
    bool           contains(const QString &text);
    QString        getRows(bool onlyselected = false);
    void           reload();
    void           removeRow(const QString &text);
    void           selectRow(const QString &text);
    void           setMultiSelection(const bool multi);
    void           setName(const QString &name);
    void           setType(const QString &type);
    void           setTypeName(const QString &type, const QString &name);
    QSize          sizeHint() const override;

private:
    void           clicked(QTableWidgetItem *item);
    void           paintEvent(QPaintEvent *event) override;
    void           resizeEvent(QResizeEvent *event) override;

    QTableWidget  *m_list;

signals:
    void           itemClicked(const QString &text);
};

#endif // TLIST_H
