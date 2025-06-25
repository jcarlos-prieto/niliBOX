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

#if !defined VIDEOFRAME_H
#define VIDEOFRAME_H

#include <QQuickItem>
#include <QVideoFrame>


class VideoFrame : public QQuickItem
{
    Q_OBJECT
    QML_ELEMENT

    Q_PROPERTY(QByteArrayView  data     READ data   WRITE setData     NOTIFY dataChanged)
    Q_PROPERTY(bool            mirror   READ mirror WRITE setMirror   NOTIFY mirrorChanged)

public:
    explicit VideoFrame(QQuickItem *parent = nullptr);
    virtual ~VideoFrame();

    Q_INVOKABLE QByteArrayView       data() const;
    Q_INVOKABLE bool                 mirror() const;
    Q_INVOKABLE void                 setData(QByteArrayView data = QByteArrayView());
    Q_INVOKABLE void                 setMirror(const bool mirror);

private:
    QSGNode                         *updatePaintNode(QSGNode *oldnode, UpdatePaintNodeData *) override;

    QByteArray                       m_data;
    bool                             m_mirror;

signals:
    void                             dataChanged(QByteArrayView data);
    void                             formatChanged(const QString &format);
    void                             mirrorChanged(bool mirror);
};

#endif // VIDEOFRAME_H
