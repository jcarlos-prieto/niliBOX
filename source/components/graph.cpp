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
#include "components/graph.h"
#include <QSGImageNode>
#include <QSGSimpleRectNode>
#include <QSGVertexColorMaterial>


Graph::Graph(QQuickItem *parent) : QQuickItem(parent)
{
    setFlag(QQuickItem::ItemHasContents);

    m_backgroundcolor = QColor(64, 64, 64);
    m_counter = 0;
    m_data = QByteArray();
    m_maintain = 0;
    m_delay = 0;
    m_filled = false;
    m_logarithmic = false;
    m_spectrogram = false;
    m_image = QImage(1, 1, QImage::Format_ARGB32);
    m_signalcolor = QColor(240, 240, 240);
    m_signalfillcolor1 = QColor(240, 240, 240);
    m_signalfillcolor2 = QColor(128, 128, 128);
    m_signalfillcolor3 = QColor(0, 0, 0);
    m_logmax = 0;
    m_logmin = 100;
    m_average = false;
    m_reset = 0;
}


Graph::~Graph()
{

}


bool Graph::average() const
{
    return m_average;
}


QString Graph::backgroundColor() const
{
    return m_backgroundcolor.name();
}


QByteArrayView Graph::data() const
{
    return QByteArrayView(m_data);
}


int Graph::delay() const
{
    return m_delay;
}


bool Graph::filled() const
{
    return m_filled;
}


bool Graph::logarithmic() const
{
    return m_logarithmic;
}


float Graph::logmax() const
{
    return m_logmax;
}


float Graph::logmin() const
{
    return m_logmin;
}


int Graph::maintain() const
{
    switch (m_maintain) {
        case 40: return 1;
        case 20: return 2;
        case 16: return 3;
        case 8: return 4;
        case 5: return 5;
        case 4: return 6;
        case 3: return 7;
        case 2: return 8;
        case 1: return 9;
        default: return 0;
    }
}


void Graph::reset()
{
    m_reset = 10;
}


void Graph::setAverage(const bool average)
{
    m_average = average;
    emit averageChanged(average);
    update();
}


void Graph::setBackgroundColor(const QString &backgroundcolor)
{
    m_backgroundcolor = QColor(backgroundcolor);
    emit backgroundColorChanged(backgroundcolor);
    update();
}


void Graph::setData(QByteArrayView data)
{
    m_data = data.toByteArray();
    emit dataChanged(data);
    update();
}


void Graph::setDelay(const int delay)
{
    m_delay = delay;

    emit delayChanged(delay);
    update();
}


void Graph::setFilled(const bool filled)
{
    m_filled = filled;
    emit filledChanged(filled);
    update();
}


void Graph::setLogarithmic(const bool logarithmic)
{
    m_logarithmic = logarithmic;
    emit logarithmicChanged(logarithmic);
    update();
}


void Graph::setLogmax(const float logmax)
{
    m_logmax = logmax;
    emit logmaxChanged(logmax);
    update();
}


void Graph::setLogmin(const float logmin)
{
    m_logmin = logmin;
    emit logminChanged(logmin);
    update();
}


void Graph::setMaintain(const int maintain)
{
    switch (maintain) {
        case 0: m_maintain = 0; break;
        case 1: m_maintain = 40; break;
        case 2: m_maintain = 20; break;
        case 3: m_maintain = 16; break;
        case 4: m_maintain = 8; break;
        case 5: m_maintain = 5; break;
        case 6: m_maintain = 4; break;
        case 7: m_maintain = 3; break;
        case 8: m_maintain = 2; break;
        case 9: m_maintain = 1; break;
        default: m_maintain = 0;
    }

    emit maintainChanged(maintain);
    update();
}


void Graph::setSignalColor(const QString &signalcolor)
{
    m_signalcolor = QColor(signalcolor);
    emit signalcolorChanged(signalcolor);
    update();
}


void Graph::setSignalFillColor1(const QString &signalfillcolor1)
{
    m_signalfillcolor1 = QColor(signalfillcolor1);
    emit signalFillColor1Changed(signalfillcolor1);
    update();
}


void Graph::setSignalFillColor2(const QString &signalfillcolor2)
{
    m_signalfillcolor2 = QColor(signalfillcolor2);
    emit signalFillColor2Changed(signalfillcolor2);
    update();
}


void Graph::setSignalFillColor3(const QString &signalfillcolor3)
{
    m_signalfillcolor3 = QColor(signalfillcolor3);
    emit signalFillColor3Changed(signalfillcolor3);
    update();
}


void Graph::setSpectrogram(const bool spectrogram)
{
    m_spectrogram = spectrogram;
    emit spectrogramChanged(spectrogram);
    update();
}


QString Graph::signalColor() const
{
    return m_signalcolor.name();
}


QString Graph::signalFillColor1() const
{
    return m_signalfillcolor1.name();
}


QString Graph::signalFillColor2() const
{
    return m_signalfillcolor2.name();
}


QString Graph::signalFillColor3() const
{
    return m_signalfillcolor3.name();
}


bool Graph::spectrogram() const
{
    return m_spectrogram;
}


void Graph::cleanImage()
{
    m_image = QImage(width(), height(), QImage::Format_ARGB32);
    m_image.fill(Qt::transparent);
}


QSGNode *Graph::updatePaintNode(QSGNode *oldNode, UpdatePaintNodeData *)
{
    QSGNode *node = oldNode;

    if (!node) {
        node = new QSGNode();

        QSGSimpleRectNode *node0 = new QSGSimpleRectNode(); // Background
        node->appendChildNode(node0);
        node0->setFlag(QSGNode::OwnedByParent);

        QSGGeometryNode *node1 = new QSGGeometryNode(); // Signal fill
        node1->setGeometry(new QSGGeometry(QSGGeometry::defaultAttributes_ColoredPoint2D(), 0));
        node1->setFlag(QSGNode::OwnsGeometry);
        node1->setMaterial(new QSGVertexColorMaterial());
        node1->setFlag(QSGNode::OwnsMaterial);
        node1->geometry()->setDrawingMode(QSGGeometry::DrawTriangleStrip);
        node1->geometry()->setLineWidth(G_PIXELRATIO);
        node->appendChildNode(node1);
        node1->setFlag(QSGNode::OwnedByParent);

        QSGGeometryNode *node2 = new QSGGeometryNode(); // Signal
        node2->setGeometry(new QSGGeometry(QSGGeometry::defaultAttributes_Point2D(), 0));
        node2->setFlag(QSGNode::OwnsGeometry);
        node2->setMaterial(new QSGFlatColorMaterial());
        node2->setFlag(QSGNode::OwnsMaterial);
        node2->geometry()->setDrawingMode(QSGGeometry::DrawLineStrip);
        node2->geometry()->setLineWidth(G_PIXELRATIO);
        node->appendChildNode(node2);
        node2->setFlag(QSGNode::OwnedByParent);

        QSGImageNode *node3 = window()->createImageNode(); // Spectrogram
        node3->setOwnsTexture(true);
        cleanImage();
        node3->setTexture(window()->createTextureFromImage(m_image));
        node->appendChildNode(node3);
    }

    QSGSimpleRectNode *node0 = static_cast<QSGSimpleRectNode *>(node->childAtIndex(0));
    QSGGeometryNode *node1 = static_cast<QSGGeometryNode *>(node->childAtIndex(1));
    QSGGeometryNode *node2 = static_cast<QSGGeometryNode *>(node->childAtIndex(2));
    QSGImageNode *node3 = static_cast<QSGImageNode *>(node->childAtIndex(3));

    static_cast<QSGFlatColorMaterial *>(node2->material())->setColor(m_signalcolor);

    int w = static_cast<int>(m_data.size()) / SF;
    float h = height();
    float v, v1, v2, s, s0, s1, s2, s3, I;
    int X, Y;

    node0->setRect(0, 0, width(), height());
    node0->setColor(m_backgroundcolor);

    if (w == 0) {
        cleanImage();

        if (m_spectrogram) {
            node3->setTexture(window()->createTextureFromImage(m_image));
            node3->markDirty(QSGNode::DirtyGeometry);
        } else {
            node1->geometry()->allocate(1);
            node2->geometry()->allocate(1);
            node1->markDirty(QSGNode::DirtyGeometry);
            node2->markDirty(QSGNode::DirtyGeometry);
        }

        return node;
    }

    if (m_maintain > 0 && m_value.size() != w)
        m_value.fill(h - 1, w);

    float *d = reinterpret_cast<float *>(m_data.data());

    v = d[0];

    if (m_logarithmic)
        Y = v == 0 ? h : -h * (20 * log10(v) + m_logmax) / (m_logmin - m_logmax);
    else
        Y = h / 2 * (1 - v);

    if (m_maintain > 0) {
        if (m_reset == 0) {
            m_value[0] = qMin(static_cast<float>(m_value.at(0) + m_maintain), h);
            if (m_value.at(0) < Y)
                Y = m_value.at(0);
        }
        m_value[0] = Y;
    }

    if (m_filled) {
        if (node1->geometry()->vertexCount() != 2 * w)
            node1->geometry()->allocate(2 * w);

        s = Y / h;
        s1 = 1 - s;
        s2 = s;
        node1->geometry()->vertexDataAsColoredPoint2D()[0].set(0, h, 0, 255, 0, 0);
        node1->geometry()->vertexDataAsColoredPoint2D()[1].set(0 , Y,
                                                               s1 * m_signalfillcolor1.red() + s2 * m_signalfillcolor2.red(),
                                                               s1 * m_signalfillcolor1.green() + s2 * m_signalfillcolor2.green(),
                                                               s1 * m_signalfillcolor1.blue() + s2 * m_signalfillcolor2.blue(),
                                                               s1 * m_signalfillcolor1.alpha() + s2 * m_signalfillcolor2.alpha());
    }

    if (m_spectrogram) {
        node3->setRect(boundingRect());

        if (m_image.width() != w || m_image.height() != h)
            m_image = m_image.scaled(w, h);

        if (++m_counter > m_delay) {
            for (int i = m_image.height() - 1; i > 0; --i)
                memcpy(m_image.bits() + i * m_image.bytesPerLine(), m_image.bits() + (i - 1) * m_image.bytesPerLine(), m_image.bytesPerLine());
            m_counter = 0;
        }

        if (m_counter == 0 && h > 0 && w > 0) {
            s = Y / h;
            if (s < 0.3333333333) {
                s1 = 1.0 - 3.0 * s;
                s2 = 1.0 - s1;
                s3 = 0;
                s0 = 0;
            } else if (s < 0.6666666667) {
                s1 = 0;
                s2 = 2.0 - 3.0 * s;
                s3 = 1.0 - s2;
                s0 = 0;
            } else {
                s1 = 0;
                s2 = 0;
                s3 = 3.0 - 3.0 * s;
                s0 = 1.0 - s3;
            }
            m_image.setPixelColor(0, 0, QColor(
                                            s1 * m_signalfillcolor1.red() + s2 * m_signalfillcolor2.red() + s3 * m_signalfillcolor3.red() + s0 * m_backgroundcolor.red(),
                                            s1 * m_signalfillcolor1.green() + s2 * m_signalfillcolor2.green() + s3 * m_signalfillcolor3.green() + s0 * m_backgroundcolor.green(),
                                            s1 * m_signalfillcolor1.blue() + s2 * m_signalfillcolor2.blue() + s3 * m_signalfillcolor3.blue() + s0 * m_backgroundcolor.blue(),
                                            s1 * m_signalfillcolor1.alpha() + s2 * m_signalfillcolor2.alpha() + s3 * m_signalfillcolor3.alpha() + s0 * m_backgroundcolor.alpha()));
        }
    } else {
        if (node2->geometry()->vertexCount() != w)
            node2->geometry()->allocate(w);
        node2->geometry()->vertexDataAsPoint2D()[0].set(0, Y);
    }

    v2 = v;

    for (int i = 1; i < w; ++i) {
        v = d[i];

        I = (float)i / (float)(w - 1) * width();

        if (m_average) {
            v1 = v2;
            v2 = v;
            v = (v1 + v2) / 2;
        }

        if (m_logarithmic)
            Y = v == 0 ? h : qMax(0.0, qMin(h, -h * (20 * log10(v) + m_logmax) / (m_logmin - m_logmax)));
        else
            Y = h / 2 * (1 - v);

        if (m_maintain > 0) {
            if (m_reset == 0) {
                m_value[i] = qMin(static_cast<float>(m_value.at(i) + m_maintain), h);
                if (m_value.at(i) < Y)
                    Y = m_value.at(i);
            }
            m_value[i] = Y;
        }

        if (m_filled) {
            s = Y / h;
            s1 = 1 - s;
            s2 = s;
            node1->geometry()->vertexDataAsColoredPoint2D()[2 * i].set(I, h,
                                                                       m_signalfillcolor2.red(),
                                                                       m_signalfillcolor2.green(),
                                                                       m_signalfillcolor2.blue(),
                                                                       m_signalfillcolor2.alpha());
            node1->geometry()->vertexDataAsColoredPoint2D()[2 * i + 1].set(I, Y,
                                                                           s1 * m_signalfillcolor1.red() + s2 * m_signalfillcolor2.red(),
                                                                           s1 * m_signalfillcolor1.green() + s2 * m_signalfillcolor2.green(),
                                                                           s1 * m_signalfillcolor1.blue() + s2 * m_signalfillcolor2.blue(),
                                                                           s1 * m_signalfillcolor1.alpha() + s2 * m_signalfillcolor2.alpha());
        }

        if (m_spectrogram) {
            if (m_counter == 0 && h > 0 && w > 0) {
                s = Y / h;
                if (s < 0.3333333333) {
                    s1 = 1.0 - 3.0 * s;
                    s2 = 1.0 - s1;
                    s3 = 0;
                    s0 = 0;
                } else if (s < 0.6666666667) {
                    s1 = 0;
                    s2 = 2.0 - 3.0 * s;
                    s3 = 1.0 - s2;
                    s0 = 0;
                } else {
                    s1 = 0;
                    s2 = 0;
                    s3 = 3.0 - 3.0 * s;
                    s0 = 1.0 - s3;
                }
                m_image.setPixelColor(I, 0, QColor(
                                                s1 * m_signalfillcolor1.red() + s2 * m_signalfillcolor2.red() + s3 * m_signalfillcolor3.red() + s0 * m_backgroundcolor.red(),
                                                s1 * m_signalfillcolor1.green() + s2 * m_signalfillcolor2.green() + s3 * m_signalfillcolor3.green() + s0 * m_backgroundcolor.green(),
                                                s1 * m_signalfillcolor1.blue() + s2 * m_signalfillcolor2.blue() + s3 * m_signalfillcolor3.blue() + s0 * m_backgroundcolor.blue(),
                                                s1 * m_signalfillcolor1.alpha() + s2 * m_signalfillcolor2.alpha() + s3 * m_signalfillcolor3.alpha() + s0 * m_backgroundcolor.alpha()));
            }
        } else
            node2->geometry()->vertexDataAsPoint2D()[i].set(I, Y);
    }

    if (m_spectrogram)
        node3->setTexture(window()->createTextureFromImage(m_image));

    node1->markDirty(QSGNode::DirtyGeometry);
    node2->markDirty(QSGNode::DirtyGeometry);
    node3->markDirty(QSGNode::DirtyGeometry);

    if (m_reset > 0)
        --m_reset;

    return node;
}
