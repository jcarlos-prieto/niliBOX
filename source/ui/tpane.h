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

#if !defined TPANE_H
#define TPANE_H

#include <QWidget>

#define VAL(x) (x == 0 ? 0 : (x > 0 ? 1 : -1) * qMax(static_cast<int>(abs(x) * G_UNIT_S + 0.5), 1))

class QBuffer;
class QLabel;


class TPane : public QWidget
{
    Q_OBJECT

public:
    explicit TPane(const QString &name, QWidget *parent = nullptr);
    virtual ~TPane();

    float    angle() const;
    QColor   backgroundColor() {return m_bk;};
    QColor   borderColor() {return m_bc;};
    void     enterEvent(QEnterEvent *event) override;
    QColor   foregroundColor() {return m_fc;};
    QSize    gap() const;
    QString  getStyle(const QString var);
    int      horizontalGap() const;
    QString  image() const;
    QRect    internalGeometry() const;
    bool     isActive() const;
    bool     isEnabled() const;
    bool     isHover() const;
    bool     isPressed() const;
    void     leaveEvent(QEvent *event) override;
    QMargins margins() const;
    void     mouseMoveEvent(QMouseEvent *event) override;
    void     mousePressEvent(QMouseEvent *event) override;
    void     mouseReleaseEvent(QMouseEvent *event) override;
    QString  name() const;
    void     paintEvent(QPaintEvent *event) override;
    QPixmap  pixmap() const;
    void     reload();
    void     resizeEvent(QResizeEvent *event) override;
    void     rotate(const float angle);
    void     setActive(const bool active);
    void     setAngle(const float angle);
    void     setEnabled(const bool enabled);
    void     setHeight(const float height);
    void     setHover(const bool pressed);
    void     setImage(const QString &image);
    void     setName(const QString &name);
    void     setPixmap (QPixmap pixmap);
    void     setPressed(const bool pressed);
    void     setSize(const QSizeF &size);
    void     setSize(const float width, const float height);
    void     setToolTip(const QString &text);
    void     setType(const QString &type);
    void     setTypeName(const QString &type, const QString &name);
    void     setWidth(const float width);
    QSize    sizeHint() const override;
    int      spacing() const;
    QString  type() const;
    int      verticalGap() const;

protected:
    QColor   m_bc;
    QColor   m_bk;
    float    m_bw;
    QColor   m_fc;
    float    m_ma1;
    float    m_ma2;
    float    m_ma3;
    float    m_ma4;
    float    m_pa1;
    float    m_pa2;
    float    m_pa3;
    float    m_pa4;
    float    m_ra1;
    float    m_ra2;
    float    m_ra3;
    float    m_ra4;
    float    m_sp;

private:
    void     drawRect(QPainter *p, const int x, const int y, const int w, const int h, const int r1, const int r2, const int r3, const int r4) const;

    bool     m_active;
    float    m_angle;
    bool     m_enabled;
    bool     m_hover;
    QString  m_image;
    QMovie  *m_movie;
    QBuffer *m_moviebuffer;
    QString  m_name;
    QPixmap  m_pixmap;
    bool     m_pressed;
    float    m_rangle;
    QSizeF   m_size;
    QLabel  *m_tooltip;
    int      m_tooltipdelay;
    int      m_tooltiptimeout;
    QTimer  *m_tooltiptimer;
    QString  m_type;

signals:
    void     dragged();
    void     pressed(TPane *);
    void     released(TPane *);
    void     resized();
};

#endif // TPANE_H
