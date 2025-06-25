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

#include "common/common.h"
#include "ui/tlist.h"
#include <QTableWidget>
#include <QHeaderView>


TList::TList(const QString &name, QWidget *parent) : TPane("", parent)
{
    m_list = new QTableWidget(this);
    m_list->setFrameStyle(QFrame::NoFrame);
    m_list->horizontalHeader()->hide();
    m_list->verticalHeader()->hide();
    m_list->horizontalHeader()->setStretchLastSection(true);
    m_list->setShowGrid(false);
    m_list->setColumnCount(1);

    connect(m_list, &QTableWidget::itemClicked, this, &TList::clicked);

    setTypeName("TList", name);
}


TList::~TList()
{

}


void TList::addRow(const QString &text)
{
    QList<QString> rows = text.split(";");

    for (QString &row : rows) {
        if (!row.isEmpty()) {
            QTableWidgetItem *item = new QTableWidgetItem(row);
            item->setFlags(Qt::ItemIsSelectable | Qt::ItemIsEnabled);
            m_list->insertRow(0);
            m_list->setItem(0, 0, item);
        }
    }

    m_list->sortItems(0);
}


void TList::clear()
{
    m_list->setRowCount(0);
}


bool TList::contains(const QString &text)
{
    return m_list->findItems(text, Qt::MatchExactly).count() > 0;
}


QString TList::getRows(bool onlyselected)
{
    QString rows;

    for (int i = 0; i < m_list->rowCount(); ++i) {
        QTableWidgetItem *item = m_list->item(i, 0);
        if (!onlyselected || (onlyselected && item->isSelected()))
            rows.append(item->text() + ";");
    }

    rows.chop(1);

    return rows;
}


void TList::reload()
{
    TPane::reload();
    update();
    m_list->setFont(font());

    QString style;
    style += "QTableWidget{";
    style += "background-color:transparent;";
    style += "outline:0;";
    style += "color:" + getStyleFromTheme(type(), name(), "****", "text-color") + "}";

    style += "QTableWidget::item:selected{";
    style += "background-color:" + getStyleFromTheme(type(), name(), "Y***", "foreground-color") + "}";

    m_list->setStyleSheet(style);
}


void TList::removeRow(const QString &text)
{
    QList<QString> rows = text.split(";");
    int n;

    for (QString &row : rows) {
        n = m_list->rowCount();
        for (int i = 0; i < n; ++i)
            if (m_list->item(i, 0)->text() == row) {
                m_list->removeRow(i);
                break;
            }
    }
}


void TList::selectRow(const QString &text)
{
    if (text.isEmpty())
        m_list->clearSelection();
    else {
        QList<QString> rows = text.split(";");
        int n;
        for (QString &row : rows) {
            n = m_list->rowCount();
            for (int i = 0; i < n; ++i)
                if (m_list->item(i, 0)->text() == row) {
                    m_list->selectRow(i);
                    break;
                }
        }
    }
}


void TList::setMultiSelection(const bool multi)
{
    if (multi)
        m_list->setSelectionMode(QAbstractItemView::MultiSelection);
    else
        m_list->setSelectionMode(QAbstractItemView::SingleSelection);
}


void TList::setName(const QString &name)
{
    TPane::setName(name);
    reload();
}


void TList::setType(const QString &type)
{
    TPane::setType(type);
    reload();
}


void TList::setTypeName(const QString &type, const QString &name)
{
    TPane::setTypeName(type, name);
    reload();
}


QSize TList::sizeHint() const
{
    return m_list->sizeHint() + gap();
}


void TList::clicked(QTableWidgetItem *item)
{
    emit itemClicked(item->text());
}


void TList::paintEvent(QPaintEvent *event)
{
    TPane::paintEvent(event);
    m_list->setGeometry(internalGeometry());
    m_list->verticalHeader()->setDefaultSectionSize(G_UNIT_L);
}


void TList::resizeEvent(QResizeEvent *event)
{
    TPane::resizeEvent(event);
    update();
}
