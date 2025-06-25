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
#include "ui/tcombobox.h"
#include <QItemDelegate>
#include <QAbstractItemView>
#include <QMouseEvent>


TComboBox::TComboBox(const QString &name, QWidget *parent) : TLabel("", parent)
{
    m_combobox = new QComboBox(this);
    m_combobox->setItemDelegate(new QItemDelegate(this));
    m_combobox->setAttribute(Qt::WA_MacShowFocusRect, 0);

    connect(m_combobox, &QComboBox::currentTextChanged, this, &TComboBox::currentTextChanged);
    connect(m_combobox, &QComboBox::currentIndexChanged, this, &TComboBox::currentIndexChanged);
    connect(m_combobox, &QComboBox::activated, this, &TComboBox::activated);

    m_arrow = new TPane("", this);
    m_arrow->setTypeName("TComboBox.arrow", name + ".arrow");
    connect(m_arrow, &TPane::pressed, m_combobox, &QComboBox::showPopup);
    setTypeName("TComboBox", name);

    m_combobox->installEventFilter(this);
    m_combobox->view()->window()->installEventFilter(this);
    m_combobox->view()->viewport()->installEventFilter(this);
}


TComboBox::~TComboBox()
{

}


void TComboBox::reload()
{
    TLabel::reload();
    update();
    m_combobox->setFont(font());

    QString style;
    style += "QComboBox{";
    style += "border:0;";
    style += "background-color:transparent;";
    style += "padding-left:" + QString::number(VAL(m_ma1) + VAL(m_pa1)) + "px;";
    style += "color:" + m_tc.name() + "}";

    style += "QComboBox::down-arrow{image:none}";

    style += "QComboBox QWidget{";
    style += "outline:0;";
    style += "background-color:" + m_fc.name() + ";";
    style += "color:" + m_tc.name() + ";";
    style += "selection-background-color:" + getStyleFromTheme(type(), name(), "Y***", "foreground-color") + "}";

    style += "QComboBox QAbstractItemView{";
    style += "border-style:solid;";
    style += "border-width:" + QString::number(VAL(m_bw)) + "px;";
    style += "border-color:" + m_bc.name() + "}";

    m_combobox->setStyleSheet(style);
}


void TComboBox::setActive(const bool active)
{
    TLabel::setActive(active);
    reload();
}


void TComboBox::setEnabled(const bool enabled)
{
    TLabel::setEnabled(enabled);
    m_combobox->setEnabled(enabled);
    reload();
}


void TComboBox::setHover(const bool hover)
{
    TLabel::setHover(hover);
    reload();
}


void TComboBox::setName(const QString &name)
{
    TLabel::setName(name);
    m_arrow->setName(name + ".arrow");
    reload();
}


void TComboBox::setPressed(const bool pressed)
{
    TLabel::setPressed(pressed);
    reload();
}


void TComboBox::setType(const QString &type)
{
    TLabel::setType(type);
    m_arrow->setType(type + ".arrow");
    reload();
}


void TComboBox::setTypeName(const QString &type, const QString &name)
{
    TLabel::setTypeName(type, name);
    m_arrow->setTypeName(type + ".arrow", name + ".arrow");
    reload();
}


QSize TComboBox::sizeHint() const
{
    return m_combobox->sizeHint() + gap();
}


bool TComboBox::eventFilter(QObject *obj, QEvent *event)
{
    if (event->type() == QEvent::MouseButtonPress || event->type() == QEvent::MouseButtonRelease || event->type() == QEvent::MouseMove) {
        QMouseEvent *mouseevent = static_cast<QMouseEvent *>(event);

        QPoint clickpos = mouseevent->position().toPoint();

        if (event->type() == QEvent::MouseButtonPress) {
            m_click = clickpos;
            if (!m_combobox->view()->isVisible())
                m_combobox->showPopup();
        }

        if (obj == m_combobox->view()->viewport() && event->type() == QEvent::MouseButtonRelease) {
            m_combobox->setCurrentIndex(m_combobox->view()->currentIndex().row());
            return false;
        }

        QPoint viewpos;
        if (obj == m_combobox->view()->window() || event->type() == QEvent::MouseButtonPress)
            viewpos = static_cast<QWidget*>(obj)->mapToGlobal(QPoint(0, 0)) / devicePixelRatioF();
        else
            viewpos = QPoint(0, 0);

        QModelIndex index = m_combobox->view()->indexAt(clickpos - viewpos);
        if (index.isValid())
            m_combobox->view()->setCurrentIndex(index);
        m_combobox->view()->update();

        if (event->type() == QEvent::MouseButtonRelease && m_click == clickpos)
            m_combobox->hidePopup();

        return true;
    }

    return false;
}


void TComboBox::paintEvent(QPaintEvent *event)
{
    TLabel::paintEvent(event);

    QRect geom = internalGeometry();
    m_combobox->setGeometry(0, VAL(m_bw), width(), height() - 2 * VAL(m_bw));
    m_combobox->setIconSize(QSize(height(), height()));
    m_arrow->setGeometry(geom.width() - geom.height() + VAL(m_ma1) + VAL(m_pa1), geom.top(), geom.height(), geom.height());
    int n = model()->rowCount();
    m_combobox->setMaxVisibleItems(n);
    for (int i = 0; i < n; ++i)
        m_combobox->model()->setData(m_combobox->model()->index(i, 0), size(), Qt::SizeHintRole);
}


void TComboBox::resizeEvent(QResizeEvent *event)
{
    TLabel::resizeEvent(event);
    update();
}
