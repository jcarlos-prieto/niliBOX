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

#if !defined TCOMBOBOX_H
#define TCOMBOBOX_H

#include "ui/tlabel.h"
#include <QComboBox>


class TComboBox : public TLabel
{
    Q_OBJECT

public:
    explicit             TComboBox(const QString &name, QWidget *parent = nullptr);
    virtual             ~TComboBox();

    void                 reload();
    void                 setActive(const bool active);
    void                 setEnabled(const bool enabled);
    void                 setHover(const bool hover);
    void                 setName(const QString &name);
    void                 setPressed(const bool pressed);
    void                 setType(const QString &type);
    void                 setTypeName(const QString &type, const QString &name);
    QSize                sizeHint() const override;

    void                 addItem(const QIcon &icon, const QString &text, const QVariant &userData = QVariant()) {m_combobox->addItem(icon, text, userData);};
    void                 addItem(const QString &text, const QVariant &userData = QVariant()) {m_combobox->addItem(text, userData);};
    void                 addItems(const QList<QString> &texts) {m_combobox->addItems(texts);};
    void                 clear() {m_combobox->clear();};
    int                  count() const {return m_combobox->count();};
    QVariant             currentData(int role = Qt::UserRole) const {return m_combobox->currentData(role);};
    int                  currentIndex() const {return m_combobox->currentIndex();};
    QString              currentText() const {return m_combobox->currentText();};
    int                  findData(const QVariant &data, int role = Qt::UserRole, Qt::MatchFlags flags = static_cast<Qt::MatchFlags>(Qt::MatchExactly|Qt::MatchCaseSensitive)) const {return m_combobox->findData(data, role, flags);};
    int                  findText(const QString &text, Qt::MatchFlags flags = Qt::MatchExactly|Qt::MatchCaseSensitive) const {return m_combobox->findText(text, flags);};
    QVariant             itemData(int index, int role = Qt::UserRole) const {return m_combobox->itemData(index, role);};
    QAbstractItemModel  *model() const {return m_combobox->model();};
    void                 removeItem(int index) {m_combobox->removeItem(index);};
    void                 setCurrentIndex(int index) {m_combobox->setCurrentIndex(index);};
    void                 setCurrentText(const QString &text) {m_combobox->setCurrentText(text);};
    void                 setItemData(int index, const QVariant &value, int role = Qt::UserRole) {m_combobox->setItemData(index, value, role);};
    void                 setItemText(int index, const QString &text) {m_combobox->setItemText(index, text);};
    void                 setMaxVisibleItems(int maxItems) {m_combobox->setMaxVisibleItems(maxItems);};
    QAbstractItemView   *view() const {return m_combobox->view();};

    bool                 eventFilter(QObject *obj, QEvent *event) override;
    void                 paintEvent(QPaintEvent *event) override;
    void                 resizeEvent(QResizeEvent *event) override;

    QComboBox           *m_combobox;
    TPane               *m_arrow;

private:
    QPoint               m_click;

signals:
    void                 activated(int index);
    void                 currentIndexChanged(int index);
    void                 currentTextChanged(const QString &text);
};

#endif // TCOMBOBOX_H
