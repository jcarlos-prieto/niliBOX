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

#if !defined TBBUTTON_H
#define TBBUTTON_H

#include "ui/tbutton.h"

class QVariantAnimation;


class TbButton : public TButton
{
    Q_OBJECT

public:
    explicit             TbButton(const QString &name, QWidget *parent = nullptr);
    virtual             ~TbButton();

    QString              id() const;
    TButton             *blind1() const;
    TButton             *blind2() const;
    TPane               *frame() const;
    int                  numBlinds() const;
    void                 close();
    void                 mouseMoveEvent(QMouseEvent *event) override;
    void                 mousePressEvent(QMouseEvent *event) override;
    void                 mouseReleaseEvent(QMouseEvent *event) override;
    void                 resizeEvent(QResizeEvent *event) override;
    void                 setFrame(TPane *frame);
    void                 setID(const QString &id);
    void                 setName(const QString &name);
    void                 setNumBlinds(const int numblinds);
    void                 setType(const QString &type);
    void                 setTypeName(const QString &type, const QString &name);

private:
    void                 animation1Finished() const;
    void                 animation1ValueChanged();
    void                 animation2ValueChanged();
    void                 buttonClicked(TButton *button);
    void                 redraw();

    QVariantAnimation   *m_animation1;
    QVariantAnimation   *m_animation2;
    TButton             *m_blind1;
    TButton             *m_blind2;
    TPane               *m_frame;
    QString              m_id;
    int                  m_numblinds;
    bool                 m_sliding;
    bool                 m_toclose;
    float                m_x0;
    float                m_x1;
    float                m_x2;

signals:
    void                 clicked0(const QString &id);
    void                 clicked1(const QString &id);
    void                 clicked2(const QString &id);
};

#endif // TBBUTTON_H
