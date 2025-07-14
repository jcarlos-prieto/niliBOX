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

#include "components/videoframe.h"
#include <QSGImageNode>


VideoFrame::VideoFrame(QQuickItem *parent) : QQuickItem(parent)
{
    setFlag(QQuickItem::ItemHasContents);
    m_data = QByteArray();
}


VideoFrame::~VideoFrame()
{

}


QByteArrayView VideoFrame::data() const
{
    return QByteArrayView(m_data);
}


bool VideoFrame::mirror() const
{
    return m_mirror;
}


void VideoFrame::setData(QByteArrayView data)
{
    m_data = data.toByteArray();
    emit dataChanged(data);
    update();
}


void VideoFrame::setMirror(const bool mirror)
{
    m_mirror = mirror;
    emit mirrorChanged(mirror);
    update();
}


QSGNode *VideoFrame::updatePaintNode(QSGNode *oldNode, UpdatePaintNodeData *)
{
    QSGNode *node = oldNode;

    if (!node) {
        node = new QSGNode();
        QSGImageNode *nodei = window()->createImageNode();
        nodei->setOwnsTexture(true);
        node->appendChildNode(nodei);
    }

    QSGImageNode *nodei = static_cast<QSGImageNode *>(node->childAtIndex(0));

    QImage image;

    if (m_data.isEmpty()) {
        image = QImage(width(), height(), QImage::Format_RGB888);
        image.fill(QColor(128, 160, 128));
    } else {
        image = QImage::fromData(m_data);
        if (m_mirror)
            image = image.mirrored(false, true);
    }

    nodei->setTexture(window()->createTextureFromImage(image));
    nodei->setRect(boundingRect());
    nodei->markDirty(QSGNode::DirtyGeometry);

    return node;
}
