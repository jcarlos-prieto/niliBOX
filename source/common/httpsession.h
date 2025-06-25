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

#if !defined HTTPSESSION_H
#define HTTPSESSION_H

#include <QObject>

class QNetworkAccessManager;


class HttpSession : public QObject
{
    Q_OBJECT

public:
    explicit                HttpSession(QObject *parent = nullptr);
    virtual                ~HttpSession();

    QByteArray              data() const;
    void                    download(const QString &url, const int sequence = 0);
    bool                    error() const;
    void                    get(const QString &url, int sequence = 0);
    void                    post(const QString &url, const QString &command, const int sequence = 0);
    void                    postData(const QString &url, const QString &command, const QByteArray &data, const int sequence = 0);
    void                    postSOAP(const QString &url, const QByteArray &soapaction, const QByteArray &soapbody, const int sequence = 0);
    QString                 query() const;
    int                     sequence() const;
    void                    setTimeout(const int timeout);
    int                     timeout() const;

private:
    QString                 m_command;
    QByteArray              m_data;
    bool                    m_error;
    QNetworkAccessManager  *m_manager;
    int                     m_sequence;
    QString                 m_siteid;
    int                     m_timeout;

signals:
    void finished(HttpSession *httpsession);
};

#endif // HTTPSESSION_H
