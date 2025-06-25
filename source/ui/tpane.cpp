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
#include "ui/tpane.h"
#include <QLayout>
#include <QLabel>
#include <QMovie>
#include <QPainter>
#include <QTimer>


TPane::TPane(const QString &name, QWidget *parent) : QWidget(parent)
{
    m_type = "TPane";
    m_name = name;
    m_hover = false;
    m_active = false;
    m_enabled = true;
    m_image = "";
    m_angle = 0;
    m_rangle = 0;
    m_movie = nullptr;
    m_moviebuffer = nullptr;
    m_pressed = false;
    m_size = QSizeF(-1, -1);

    m_bc = QColorConstants::Transparent;
    m_bk = QColorConstants::Transparent;
    m_fc = QColorConstants::Transparent;
    m_bw = 0.0;
    m_ma1 = 0.0;
    m_ma2 = 0.0;
    m_ma3 = 0.0;
    m_ma4 = 0.0;
    m_pa1 = 0.0;
    m_pa2 = 0.0;
    m_pa3 = 0.0;
    m_pa4 = 0.0;
    m_ra1 = 0.0;
    m_ra2 = 0.0;
    m_ra3 = 0.0;
    m_ra4 = 0.0;
    m_sp = 0.0;

    m_tooltip = new QLabel(this);
    m_tooltip->setVisible(false);
    m_tooltip->setFixedHeight(20);
    m_tooltip->setWindowFlags(Qt::ToolTip);
    m_tooltipdelay = G_LOCALSETTINGS.get("ui.tooltipdelay").toInt();
    m_tooltiptimeout = G_LOCALSETTINGS.get("ui.tooltiptimeout").toInt();
    m_tooltiptimer = new QTimer(this);
    m_tooltiptimer->setSingleShot(true);

    reload();
}


TPane::~TPane()
{

}


float TPane::angle() const
{
    return m_angle;
}


void TPane::enterEvent(QEnterEvent *event)
{
    QWidget::enterEvent(event);

    if (G_TOUCH)
        return;
    else
        setHover(true);

    if (m_tooltip->text().isEmpty())
        return;

    m_tooltiptimer->start(m_tooltipdelay);
    connect(m_tooltiptimer, &QTimer::timeout, this, [&]() {
        m_tooltip->move(QCursor::pos() + QPoint(G_UNIT_S, -G_UNIT_S - m_tooltip->height()));
        m_tooltip->setVisible(true);
        m_tooltiptimer->start(m_tooltiptimeout);
        connect(m_tooltiptimer, &QTimer::timeout, this, [&]() {
            m_tooltip->setVisible(false);
        });
    });
}


QSize TPane::gap() const
{
    return QSize(horizontalGap(), verticalGap());
}


QString TPane::getStyle(const QString var)
{
    QByteArray status;
    status.append(m_active ? "Y" : "N").append(m_enabled ? "Y" : "N").append(m_hover ? "Y" : "N").append(m_pressed ? "Y" : "N");

    return getStyleFromTheme(m_type, m_name, status, var);
}


int TPane::horizontalGap() const
{
    return VAL(m_ma1) + VAL(m_ma3) + VAL(m_pa1) + VAL(m_pa3);
}


QString TPane::image() const
{
    return m_image;
}


QRect TPane::internalGeometry() const
{
    return QRect(VAL(m_ma1) + VAL(m_pa1), VAL(m_ma2) + VAL(m_pa2), width() - horizontalGap() + 1, height() - verticalGap() + 1);
}


bool TPane::isActive() const
{
    return m_active;
}


bool TPane::isEnabled() const
{
    return m_enabled;
}


bool TPane::isHover() const
{
    return m_hover;
}


bool TPane::isPressed() const
{
    return m_pressed;
}


void TPane::leaveEvent(QEvent *event)
{
    QWidget::leaveEvent(event);

    if (!G_TOUCH)
        setHover(false);

    if (m_tooltip->text().isEmpty())
        return;

    m_tooltiptimer->stop();
    m_tooltiptimer->disconnect();
    m_tooltip->setVisible(false);
}


QMargins TPane::margins() const
{
    return QMargins(VAL(m_ma1) + VAL(m_pa1), VAL(m_ma2) + VAL(m_pa2), VAL(m_ma3) + VAL(m_pa3), VAL(m_ma4) + VAL(m_pa4));
}


void TPane::mouseMoveEvent(QMouseEvent *event)
{
    QWidget::mouseMoveEvent(event);
    emit dragged();
}


void TPane::mousePressEvent(QMouseEvent *event)
{
    QWidget::mousePressEvent(event);
    emit pressed(this);

    if (G_TOUCH)
        setHover(true);
}


void TPane::mouseReleaseEvent(QMouseEvent *event)
{
    QWidget::mouseReleaseEvent(event);
    emit released(this);

    if (G_TOUCH)
        setHover(false);
}


QString TPane::name() const
{
    return m_name;
}


void TPane::paintEvent(QPaintEvent *event)
{
    QWidget::paintEvent(event);

    int bw = VAL(m_bw);
    int sp = VAL(m_sp);
    int ra1 = VAL(m_ra1);
    int ra2 = VAL(m_ra2);
    int ra3 = VAL(m_ra3);
    int ra4 = VAL(m_ra4);
    int ma1 = VAL(m_ma1);
    int ma2 = VAL(m_ma2);
    int ma3 = VAL(m_ma3);
    int ma4 = VAL(m_ma4);

    if (m_size.width() != -1)
        QWidget::setFixedWidth(m_size.width() + ma1 + ma3);

    if (m_size.height() != -1)
        QWidget::setFixedHeight(m_size.height() + ma2 + ma4);

    QImage img(size(), QImage::Format_ARGB32_Premultiplied);
    img.fill(m_bk);

    QPainter painter;
    painter.begin(&img);
    painter.setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    painter.setPen(Qt::NoPen);

    if (bw != 0) {
        painter.setBrush(QBrush(m_bc));
        drawRect(&painter, ma1, ma2, width() - ma1 - ma3, height() - ma2 - ma4, ra1, ra2, ra3, ra4);
        painter.setBrush(QBrush(m_bk));
        painter.setCompositionMode(QPainter::CompositionMode_Source);
        drawRect(&painter, ma1 + bw, ma2 + bw, width() - ma1 - ma3 - 2 * bw, height() - ma2 - ma4 - 2 * bw, ra1 - bw, ra2 - bw, ra3 - bw, ra4 - bw);
        painter.setCompositionMode(QPainter::CompositionMode_SourceOver);
    }

    if (m_bk != m_fc) {
        painter.setBrush(QBrush(m_fc));
        drawRect(&painter, ma1 + bw, ma2 + bw, width() - ma1 - ma3 - 2 * bw, height() - ma2 - ma4 - 2 * bw, ra1 - bw, ra2 - bw, ra3 - bw, ra4 - bw);
    }

    QRect geom = internalGeometry();

    if (!m_pixmap.isNull()) {
        QPixmap pixmap(m_pixmap.scaled(geom.width(), geom.height(), Qt::KeepAspectRatio, Qt::SmoothTransformation));
        QTransform transform;
        if (m_angle + m_rangle != 0) {
            transform.translate(width() / 2, height() / 2);
            if (m_angle + m_rangle == 180)
                transform.scale(-1, -1);
            else
                transform.rotate(m_angle + m_rangle);
            transform.translate(-width() / 2, -height() / 2);
        }
        transform.translate((width() - pixmap.width()) / 2, (height() - pixmap.height()) / 2);
        painter.setTransform(transform);
        painter.drawPixmap(0, 0, pixmap);
    }

    painter.end();

    painter.begin(this);
    painter.setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    painter.drawImage(0, 0, img);
    painter.end();

    if (layout()) {
        layout()->setContentsMargins(geom.left(), geom.top(), width() - geom.right(), height() - geom.bottom());
        if (layout()->spacing() != sp)
            layout()->setSpacing(sp);
    }
}


QPixmap TPane::pixmap() const
{
    return m_pixmap;
}


void TPane::reload()
{
    QString style;
    style = getStyle("background-color");
    if (style.isEmpty())
        m_bk = QColorConstants::Transparent;
    else
        m_bk = QColor(style);

    style = getStyle("border-color");
    if (style.isEmpty())
        m_bc = QColorConstants::Transparent;
    else
        m_bc = QColor(style);

    style = getStyle("foreground-color");
    if (style.isEmpty())
        m_fc = QColorConstants::Transparent;
    else
        m_fc = QColor(style);

    style = getStyle("border-width");
    if (style.isEmpty())
        m_bw = 0;
    else
        m_bw = style.toDouble();

    style = getStyle("radius").replace("round", "10000", Qt::CaseInsensitive);
    if (style.isEmpty())
        m_ra1 = m_ra2 = m_ra3 = m_ra4 = 0;
    else
        m_ra1 = m_ra2 = m_ra3 = m_ra4 = style.toDouble();

    style = getStyle("radius-topleft").replace("round", "10000", Qt::CaseInsensitive);
    if (!style.isEmpty())
        m_ra1 = style.toDouble();

    style = getStyle("radius-topright").replace("round", "10000", Qt::CaseInsensitive);
    if (!style.isEmpty())
        m_ra2 = style.toDouble();

    style = getStyle("radius-bottomright").replace("round", "10000", Qt::CaseInsensitive);
    if (!style.isEmpty())
        m_ra3 = style.toDouble();

    style = getStyle("radius-bottomleft").replace("round", "10000", Qt::CaseInsensitive);
    if (!style.isEmpty())
        m_ra4 = style.toDouble();

    style = getStyle("margin");
    if (style.isEmpty())
        m_ma1 = m_ma2 = m_ma3 = m_ma4 = 0;
    else
        m_ma1 = m_ma2 = m_ma3 = m_ma4 = style.toDouble();

    style = getStyle("margin-left");
    if (!style.isEmpty())
        m_ma1 = style.toDouble();

    style = getStyle("margin-top");
    if (!style.isEmpty())
        m_ma2 = style.toDouble();

    style = getStyle("margin-right");
    if (!style.isEmpty())
        m_ma3 = style.toDouble();

    style = getStyle("margin-bottom");
    if (!style.isEmpty())
        m_ma4 = style.toDouble();

    style = getStyle("padding");
    if (style.isEmpty())
        m_pa1 = m_pa2 = m_pa3 = m_pa4 = 0;
    else
        m_pa1 = m_pa2 = m_pa3 = m_pa4 = style.toDouble();

    style = getStyle("padding-left");
    if (!style.isEmpty())
        m_pa1 = style.toDouble();

    style = getStyle("padding-top");
    if (!style.isEmpty())
        m_pa2 = style.toDouble();

    style = getStyle("padding-right");
    if (!style.isEmpty())
        m_pa3 = style.toDouble();

    style = getStyle("padding-bottom");
    if (!style.isEmpty())
        m_pa4 = style.toDouble();

    style = getStyle("spacing");
    if (style.isEmpty())
        m_sp = 0;
    else
        m_sp = style.toDouble();

    style = getStyle("image");
    setImage(style);

    style = getStyle("angle");
    if (!style.isEmpty())
        setAngle(style.toDouble());
    else
        setAngle(0);

    style = getStyle("cursor");
    if (style.compare("POINTER", Qt::CaseInsensitive) == 0)
        setCursor(Qt::PointingHandCursor);
    else
        unsetCursor();

    style.clear();
    style += "QLabel{background-color:" + getStyleFromTheme(type(), "tooltip", "****", "background-color") + ";";
    style += "color:" + getStyleFromTheme(type(), "tooltip", "****", "text-color") + ";";
    style += "border-width:" + QString::number(VAL(getStyleFromTheme(type(), "tooltip", "****", "border-width").toFloat())) + "px;";
    style += "border-color:" + getStyleFromTheme(type(), "tooltip", "****", "border-color") + ";";
    style += "border-style:solid;font-size:12px;";
    style += "padding-top:" + QString::number(static_cast<int>(getStyleFromTheme(type(), "tooltip", "****", "padding-top").toFloat() * G_UNIT_S)) + "px;";
    style += "padding-bottom:" + QString::number(static_cast<int>(getStyleFromTheme(type(), "tooltip", "****", "padding-bottom").toFloat() * G_UNIT_S)) + "px;";
    style += "padding-right:" + QString::number(static_cast<int>(getStyleFromTheme(type(), "tooltip", "****", "padding-right").toFloat() * G_UNIT_S)) + "px;";
    style += "padding-left:" + QString::number(static_cast<int>(getStyleFromTheme(type(), "tooltip", "****", "padding-left").toFloat() * G_UNIT_S)) + "px}";

    m_tooltip->setStyleSheet(style);

    update();

    if (layout() && !isVisible()) {
        QRect geom = internalGeometry();
        layout()->setContentsMargins(geom.left(), geom.top(), width() - geom.right(), height() - geom.bottom());
        layout()->setSpacing(VAL(m_sp));
    }
}


void TPane::resizeEvent(QResizeEvent *event)
{
    QWidget::resizeEvent(event);
    emit resized();
}


void TPane::rotate(const float angle)
{
    m_rangle = angle;
    update();
}


void TPane::setActive(const bool active)
{
    m_active = active;
    reload();
}


void TPane::setAngle(const float angle)
{
    m_angle = angle;
    update();
}


void TPane::setEnabled(const bool enabled)
{
    m_enabled = enabled;
    reload();
}


void TPane::setHeight(const float height)
{
    m_size.setHeight(height);
    QWidget::setFixedHeight(height + VAL(m_ma2) + VAL(m_ma4));
}


void TPane::setHover(const bool hover)
{
    m_hover = hover;
    reload();
}


void TPane::setImage(const QString &image)
{
    m_image = image;

    if (m_image.endsWith(".gif", Qt::CaseInsensitive)) {
        if (m_movie) {
            m_movie->stop();
            m_movie->deleteLater();
            m_movie = nullptr;
        }

        m_movie = new QMovie(":/theme/" + m_image, "", this);
        m_movie->start();

        connect(m_movie, &QMovie::frameChanged, this, [&](){
            if (isHidden())
                m_movie->stop();
            else {
                m_pixmap = m_movie->currentPixmap();
                update();
            }
        });

    } else if (m_image.isEmpty()) {
        m_pixmap = QPixmap();
        if (m_movie) {
            m_movie->stop();
            m_movie->deleteLater();
            m_movie = nullptr;
        }

    } else
        m_pixmap = QPixmap(":/theme/" + m_image);
}


void TPane::setName(const QString &name)
{
    if (m_name == name)
        return;

    m_name = name;
    reload();
}


void TPane::setPixmap(QPixmap pixmap)
{
    m_pixmap = pixmap;
    update();
}


void TPane::setPressed(const bool pressed)
{
    m_pressed = pressed;
    reload();
}


void TPane::setSize(const QSizeF &size)
{
    m_size = size;
    QWidget::setFixedSize(m_size.width() + VAL(m_ma1) + VAL(m_ma3), m_size.height() + VAL(m_ma2) + VAL(m_ma4));
}


void TPane::setSize(const float width, const float height)
{
    m_size = QSizeF(width, height);
    QWidget::setFixedSize(qMax(0.0, width + VAL(m_ma1) + VAL(m_ma3)), qMax(0.0, height + VAL(m_ma2) + VAL(m_ma4)));
}


void TPane::setToolTip(const QString &text)
{
    m_tooltip->setText(text);
    setAccessibleName(text);
    setAccessibleDescription(text);
}


void TPane::setType(const QString &type)
{
    if (m_type == type)
        return;

    m_type = type;
    reload();
}


void TPane::setTypeName(const QString &type, const QString &name)
{
    if (m_type == type && m_name == name)
        return;

    m_type = type;
    m_name = name;
    reload();
}


void TPane::setWidth(const float width)
{
    if (width < 0)
        return;

    m_size.setWidth(width);
    QWidget::setFixedWidth(width + VAL(m_ma1) + VAL(m_ma3));
}


QSize TPane::sizeHint() const
{
    return m_size.toSize() + gap();
}


int TPane::spacing() const
{
    return VAL(m_sp);
}


QString TPane::type() const
{
    return m_type;
}


int TPane::verticalGap() const
{
    return VAL(m_ma2) + VAL(m_ma4) + VAL(m_pa2) + VAL(m_pa4);
}


void TPane::drawRect(QPainter *p, const int x, const int y, const int w, const int h, const int r1, const int r2, const int r3, const int r4) const
{
    int s = qMin(w, h) / 2;
    int rr1 = r1 < 0 ? 0 : qMin(r1, s);
    int rr2 = r2 < 0 ? 0 : qMin(r2, s);
    int rr3 = r3 < 0 ? 0 : qMin(r3, s);
    int rr4 = r4 < 0 ? 0 : qMin(r4, s);

    if (rr1 == 0 && rr2 == 0 && rr3 == 0 && rr4 == 0)
        p->drawRect(x, y, w, h);
    else if (rr1 == rr2 && rr1 == rr3 && rr1 == rr4)
        p->drawRoundedRect(x, y, w, h, rr1, rr1);
    else {
        int w2 = w / 2 + 1;
        int h2 = h / 2 + 1 ;
        p->setClipRect(x, y, w2, h2);
        if (rr1 == 0)
            p->drawRect(x, y, w, h);
        else
            p->drawRoundedRect(x, y, w, h, rr1, rr1);
        p->setClipRect(x + w / 2, y, w2, h2);
        if (rr2 == 0)
            p->drawRect(x, y, w, h);
        else
            p->drawRoundedRect(x, y, w, h, rr2, rr2);
        p->setClipRect(x + w / 2, y + h / 2, w2, h2);
        if (r3 == 0)
            p->drawRect(x, y, w, h);
        else
            p->drawRoundedRect(x, y, w, h, rr3, rr3);
        p->setClipRect(x, y + h / 2, w2, h2);
        if (r4 == 0)
            p->drawRect(x, y, w, h);
        else
            p->drawRoundedRect(x, y, w, h, rr4, rr4);
        p->setClipping(false);
    }
}
