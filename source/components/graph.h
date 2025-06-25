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

#if !defined GRAPH_H
#define GRAPH_H

#include <QImage>
#include <QMutex>
#include <QQuickItem>


class Graph : public QQuickItem
{
    Q_OBJECT
    QML_ELEMENT

    Q_PROPERTY(QByteArrayView  data              READ data               WRITE setData              NOTIFY dataChanged)
    Q_PROPERTY(QString         backgroundcolor   READ backgroundColor    WRITE setBackgroundColor   NOTIFY backgroundColorChanged)
    Q_PROPERTY(QString         signalcolor       READ signalColor        WRITE setSignalColor       NOTIFY signalcolorChanged)
    Q_PROPERTY(QString         signalfillcolor1  READ signalFillColor1   WRITE setSignalFillColor1  NOTIFY signalFillColor1Changed)
    Q_PROPERTY(QString         signalfillcolor2  READ signalFillColor2   WRITE setSignalFillColor2  NOTIFY signalFillColor2Changed)
    Q_PROPERTY(QString         signalfillcolor3  READ signalFillColor3   WRITE setSignalFillColor3  NOTIFY signalFillColor3Changed)
    Q_PROPERTY(bool            filled            READ filled             WRITE setFilled            NOTIFY filledChanged)
    Q_PROPERTY(bool            logarithmic       READ logarithmic        WRITE setLogarithmic       NOTIFY logarithmicChanged)
    Q_PROPERTY(bool            spectrogram       READ spectrogram        WRITE setSpectrogram       NOTIFY spectrogramChanged)
    Q_PROPERTY(bool            average           READ average            WRITE setAverage           NOTIFY averageChanged)
    Q_PROPERTY(float           logmax            READ logmax             WRITE setLogmax            NOTIFY logmaxChanged)
    Q_PROPERTY(float           logmin            READ logmin             WRITE setLogmin            NOTIFY logminChanged)
    Q_PROPERTY(int             delay             READ delay              WRITE setDelay             NOTIFY delayChanged)
    Q_PROPERTY(int             maintain          READ maintain           WRITE setMaintain          NOTIFY maintainChanged)

public:
    explicit                   Graph(QQuickItem *parent = nullptr);
    virtual                   ~Graph();

    Q_INVOKABLE bool           average() const;
    Q_INVOKABLE QString        backgroundColor() const;
    Q_INVOKABLE QByteArrayView data() const;
    Q_INVOKABLE int            delay() const;
    Q_INVOKABLE bool           filled() const;
    Q_INVOKABLE bool           logarithmic() const;
    Q_INVOKABLE float          logmax() const;
    Q_INVOKABLE float          logmin() const;
    Q_INVOKABLE int            maintain() const;
    Q_INVOKABLE void           reset();
    Q_INVOKABLE void           setAverage(const bool average);
    Q_INVOKABLE void           setBackgroundColor(const QString &backgroundcolor);
    Q_INVOKABLE void           setData(QByteArrayView data = QByteArrayView());
    Q_INVOKABLE void           setDelay(const int delay);
    Q_INVOKABLE void           setFilled(const bool filled);
    Q_INVOKABLE void           setLogarithmic(const bool logarithmic);
    Q_INVOKABLE void           setLogmax(const float logmax);
    Q_INVOKABLE void           setLogmin(const float logmin);
    Q_INVOKABLE void           setMaintain(const int maintain);
    Q_INVOKABLE void           setSignalColor(const QString &signalcolor);
    Q_INVOKABLE void           setSignalFillColor1(const QString &signalfillcolor1);
    Q_INVOKABLE void           setSignalFillColor2(const QString &signalfillcolor2);
    Q_INVOKABLE void           setSignalFillColor3(const QString &signalfillcolor3);
    Q_INVOKABLE void           setSpectrogram(const bool spectrogram);
    Q_INVOKABLE QString        signalColor() const;
    Q_INVOKABLE QString        signalFillColor1() const;
    Q_INVOKABLE QString        signalFillColor2() const;
    Q_INVOKABLE QString        signalFillColor3() const;
    Q_INVOKABLE bool           spectrogram() const;

private:
    QSGNode                   *updatePaintNode(QSGNode *oldnode, UpdatePaintNodeData *) override;
    void                       cleanImage();

    int                        m_average;
    int                        m_counter;
    QColor                     m_backgroundcolor;
    QByteArray                 m_data;
    int                        m_delay;
    int                        m_downcount;
    bool                       m_filled;
    QImage                     m_image;
    bool                       m_logarithmic;
    float                      m_logmax;
    float                      m_logmin;
    int                        m_maintain;
    QMutex                     m_mutex;
    int                        m_reset;
    QColor                     m_signalcolor;
    QColor                     m_signalfillcolor1;
    QColor                     m_signalfillcolor2;
    QColor                     m_signalfillcolor3;
    bool                       m_spectrogram;
    QVector<int>               m_value;

signals:
    void                       averageChanged(int average);
    void                       backgroundColorChanged(const QString &backgroundcolor);
    void                       dataChanged(QByteArrayView data);
    void                       delayChanged(int delay);
    void                       filledChanged(bool filled);
    void                       logarithmicChanged(bool logarithmic);
    void                       logmaxChanged(float logmax);
    void                       logminChanged(float logmin);
    void                       maintainChanged(int maintain);
    void                       signalFillColor1Changed(const QString &signalfillcolor1);
    void                       signalFillColor2Changed(const QString &signalfillcolor2);
    void                       signalFillColor3Changed(const QString &signalfillcolor3);
    void                       signalcolorChanged(const QString &signalcolor);
    void                       spectrogramChanged(bool spectrogram);
};

#endif // GRAPH_H
