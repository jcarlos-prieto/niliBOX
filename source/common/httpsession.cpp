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
#include "common/httpsession.h"
#include <QHttpPart>
#include <QNetworkProxy>
#include <QNetworkReply>
#include <QTimer>


HttpSession::HttpSession(QObject *parent) : QObject(parent)
{
    m_error = false;
    m_manager = new QNetworkAccessManager(this);
    m_siteid = G_LOCALSETTINGS.get("site.id");
    m_timeout = G_LOCALSETTINGS.get("system.remotetimeout").toUInt();

    QNetworkProxyQuery npq(QUrl(G_LOCALSETTINGS.get("system.protocol") + G_LOCALSETTINGS.get("system.masterserver" + G_LOCALSETTINGS.get("system.masterserverport"))));
    QList<QNetworkProxy> proxies = QNetworkProxyFactory::systemProxyForQuery(npq);
    if (proxies.count() > 0)
        m_manager->setProxy(proxies.at(0));
}

HttpSession::~HttpSession()
{

}


QByteArray HttpSession::data() const
{
    return m_data;
}


void HttpSession::download(const QString &url, const int sequence)
{
    m_sequence = sequence;
    m_command = url;

    if (G_VERBOSE) qInfo() <<qPrintable( "HTTPSESSION: Downloading file from " + url);

    QNetworkReply *reply = m_manager->get(QNetworkRequest(QUrl(url)));

    QTimer timer;
    timer.start(m_timeout);
    connect(&timer, &QTimer::timeout, this, [=]() {
        if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: HTTP timeout");
        m_error = true;
        reply->deleteLater();
        emit finished(this);
    });

    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            m_data = reply->readAll();
            m_error = false;
            QString filepath = G_LOCALSETTINGS.localFilePath() + "/" + QUrl(url).path().sliced(1);
            QFile file(filepath);
            if (file.open(QFile::WriteOnly)) {
                file.write(m_data);
                file.close();
            } else {
                m_error = true;
                if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: Error updating file " + filepath);
            }
        } else {
            if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: Download Error: " + reply->errorString());
            m_error = true;
        }
        reply->deleteLater();
        emit finished(this);
    });
}


bool HttpSession::error() const
{
    return m_error;
}


void HttpSession::get(const QString &url, const int sequence)
{
    m_sequence = sequence;
    m_command = url;

    if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: Getting data from " + url);

    QNetworkReply *reply = m_manager->get(QNetworkRequest(QUrl(url)));

    QTimer timer;
    timer.start(m_timeout);
    connect(&timer, &QTimer::timeout, this, [=]() {
        if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: HTTP timeout");
        m_error = true;
        reply->deleteLater();
        emit finished(this);
    });

    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            m_data = reply->readAll();
            m_error = false;
        } else {
            if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: GET Error: " + reply->errorString());
            m_error = true;
        }
        reply->deleteLater();
        emit finished(this);
    });
}


void HttpSession::post(const QString &url, const QString &command, const int sequence)
{
    QString lcommand = command;

    if (!lcommand.contains("&id="))
        lcommand += "&id=" + m_siteid;

    m_sequence = sequence;
    m_command = url + " " + lcommand;

    QNetworkRequest request;
    request.setUrl(QUrl(url));
    request.setTransferTimeout(m_timeout);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/x-www-form-urlencoded");

    QNetworkReply *reply = m_manager->post(request, lcommand.toUtf8());

    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            m_data = reply->readAll();
            m_error = false;
        } else {
            if (!command.contains("keepalive"))
                if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: POST Error: " + reply->errorString());
            m_error = true;
        }
        reply->deleteLater();
        emit finished(this);
    });
}


void HttpSession::postData(const QString &url, const QString &command, const QByteArray &data, const int sequence)
{
    QString lcommand = command;

    if (!lcommand.contains("&id="))
        lcommand += "&id=" + m_siteid;

    m_sequence = sequence;
    m_command = lcommand;

    QHttpMultiPart *multipart = new QHttpMultiPart(QHttpMultiPart::MixedType, this);
    QHttpPart querypart;
    querypart.setHeader(QNetworkRequest::ContentTypeHeader, "application/x-www-form-urlencoded");
    querypart.setBody(lcommand.toUtf8());
    multipart->append(querypart);
    QHttpPart datapart;
    datapart.setHeader(QNetworkRequest::ContentTypeHeader, "application/octet-stream");
    datapart.setBody(data);
    multipart->append(datapart);

    QNetworkRequest request;
    request.setUrl(QUrl(url));
    request.setTransferTimeout(m_timeout);

    QNetworkReply *reply = m_manager->post(request, multipart);

    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            m_data = reply->readAll();
            m_error = false;
        } else {
            if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: POSTDATA Error: " + reply->errorString());
            m_error = true;
        }
        multipart->deleteLater();
        reply->deleteLater();
        emit finished(this);
    });
}


void HttpSession::postSOAP(const QString &url, const QByteArray &soapaction, const QByteArray &soapbody, const int sequence)
{
    m_sequence = sequence;
    m_command = url;

    QNetworkRequest request;
    request.setUrl(QUrl(url));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "text/xml;charset=\"utf-8\"");
    request.setRawHeader("SoapAction", "\"" + soapaction + "\"");

    QNetworkReply *reply = m_manager->post(request, soapbody);

    QTimer timer;
    timer.start(m_timeout);
    connect(&timer, &QTimer::timeout, this, [=]() {
        if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: HTTP timeout");
        m_error = true;
        reply->deleteLater();
        emit finished(this);
    });

    connect(reply, &QNetworkReply::finished, this, [=]() {
        if (reply->error() == QNetworkReply::NoError) {
            m_data = reply->readAll();
            m_error = false;
        } else {
            if (G_VERBOSE) qInfo() << qPrintable("HTTPSESSION: POSTSOAP Error: " + reply->errorString());
            m_error = true;
        }
        reply->deleteLater();
        emit finished(this);
    });
}


QString HttpSession::query() const
{
    return m_command;
}


int HttpSession::sequence() const
{
    return m_sequence;
}


void HttpSession::setTimeout(const int timeout)
{
    m_timeout = timeout;
}


int HttpSession::timeout() const
{
    return m_timeout;
}
