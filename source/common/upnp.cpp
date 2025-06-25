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
#include "common/upnp.h"
#include <QNetworkInterface>
#include <QRandomGenerator>
#include <QTimer>
#include <QUdpSocket>


UPnP::UPnP(QObject *parent) : QObject(parent)
{
    m_tcpportint = G_LOCALSETTINGS.get("system.tcpport").toInt();
    m_tcpport = 0;
    m_upnpurl = "";
    m_service = "";

    G_LOCALSETTINGS.set("system.upnpport", QString::number(m_tcpport));

    int port = 0;
    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();

    for (QNetworkInterface &interface : interfaces) {
        if (interface.flags().testFlag(QNetworkInterface::IsUp)
            && !interface.flags().testFlag(QNetworkInterface::IsLoopBack)
            && interface.flags().testFlag(QNetworkInterface::IsRunning)
            && interface.flags().testFlag(QNetworkInterface::CanBroadcast)) {
            QList<QNetworkAddressEntry> addressentries = interface.addressEntries();
            for (QNetworkAddressEntry &addressentry : addressentries) {
                QUdpSocket *ssdpsocket = new QUdpSocket(this);
                ssdpsocket->bind(addressentry.ip(), port, QUdpSocket::ReuseAddressHint);
                connect(ssdpsocket, &QUdpSocket::readyRead, this, &UPnP::UPnP2);
                m_ssdpsockets.append(ssdpsocket);
                port = ssdpsocket->localPort();
            }
        }
    }
}


UPnP::~UPnP()
{
    if (G_VERBOSE) qInfo() << qPrintable("UPNP: Closing UPnP lease handler");

    for (QUdpSocket *&ssdpsocket : m_ssdpsockets)
        ssdpsocket->close();

    uninstall();
}


void UPnP::install()
{
    if (G_VERBOSE) qInfo() << qPrintable("UPNP: Installing UPnP lease handler");

    if (m_tcpport != 0)
        return;

    m_timer = new QTimer(this);
    connect(m_timer, &QTimer::timeout, this, &UPnP::UPnP1);
    m_timer->start(G_LOCALSETTINGS.get("system.upnprefresh").toInt());

    UPnP1();
}


int UPnP::port() const
{
    return m_tcpport;
}


void UPnP::uninstall()
{
    if (G_VERBOSE) qInfo() << qPrintable("UPNP: Uninstalling UPnP lease handler");

    if (m_tcpport == 0)
        return;

    m_timer->stop();

    UPnP6();
}


void UPnP::UPnP1()
{
    QByteArray data;

    if (G_VERBOSE) qInfo() << qPrintable("UPNP: Sending SSDP request");
    for (QUdpSocket *&ssdpsocket : m_ssdpsockets) {
        if (ssdpsocket->localAddress().protocol() == QAbstractSocket::IPv4Protocol) {
            data =  "M-SEARCH * HTTP/1.1\r\n";
            data += "HOST: " + SSDPMULTICASTIPV4.toString().toUtf8() + ":" + QByteArray::number(SSDPPORT) + "\r\n";
            data += "ST: upnp:rootdevice\r\n";
            data += "MAN: \"ssdp:discover\"\r\n";
            data += "MX: 5\r\n";
            data += "\r\n";
            ssdpsocket->writeDatagram(data, SSDPMULTICASTIPV4, SSDPPORT);
        } else {
            data =  "M-SEARCH * HTTP/1.1\r\n";
            data += "HOST: [" + SSDPMULTICASTIPV6.toString().toUtf8() + "]:" + QByteArray::number(SSDPPORT) + "\r\n";
            data += "ST: upnp:rootdevice\r\n";
            data += "MAN: \"ssdp:discover\"\r\n";
            data += "MX: 5\r\n";
            data += "\r\n";
            ssdpsocket->writeDatagram(data, SSDPMULTICASTIPV6, SSDPPORT);
        }

        ssdpsocket->waitForBytesWritten();
    }
}


void UPnP::UPnP2()
{
    QUdpSocket *ssdpsocket = static_cast<QUdpSocket *>(sender());
    QByteArray data;

    if (ssdpsocket->state() != QUdpSocket::BoundState)
        return;

    qsizetype pos;

    while (ssdpsocket->hasPendingDatagrams()) {
        data.resize(ssdpsocket->pendingDatagramSize());
        if (ssdpsocket->readDatagram(data.data(), data.size(), &m_upnprouteraddress) > 0) {
            if (data.toUpper().startsWith("HTTP/1.1 200 OK")) {
                pos = data.toUpper().indexOf("LOCATION:");
                if (pos > -1) {
                    data = data.sliced(pos + 9);
                    pos = data.indexOf("\r\n");
                    if (pos > -1) {
                        data = data.first(pos).trimmed();
                        HttpSession *httpsession = new HttpSession(this);
                        connect(httpsession, &HttpSession::finished, this, &UPnP::UPnP3);
                        httpsession->get(QString(data));
                        break;
                    }
                }
            }
        }

        if (ssdpsocket->state() != QUdpSocket::BoundState)
            break;
    }
}


void UPnP::UPnP3(HttpSession *httpsession)
{
    QByteArray data = httpsession->data();

    QByteArray urlbase;
    qsizetype pos1 = data.toUpper().indexOf("<URLBASE>");
    qsizetype pos2 = data.toUpper().indexOf("</URLBASE>");

    if (pos1 > -1 && pos2 > -1)
        urlbase = data.sliced(pos1 + 9, pos2 - pos1 - 9);
    else {
        pos1 = httpsession->query().lastIndexOf("/");
        if (pos1 > -1)
            urlbase = httpsession->query().first(pos1).toUtf8();
        else
            urlbase = httpsession->query().toUtf8();
    }

    if (!urlbase.endsWith("/"))
        urlbase += "/";

    httpsession->deleteLater();

    pos1 = data.toUpper().indexOf("URN:SCHEMAS-UPNP-ORG:SERVICE:WANIPCONNECTION");
    if (pos1 > -1) {
        data = data.sliced(pos1);
        pos2 = data.toUpper().indexOf("</SERVICETYPE>");
        if (pos2 > -1) {
            m_service = data.first(pos2);
            pos1 = data.toUpper().indexOf("<CONTROLURL>");
            pos2 = data.toUpper().indexOf("</CONTROLURL>");
            if (pos1 > -1 && pos2 > -1) {
                m_upnpurl = data.sliced(pos1 + 12, pos2 - pos1 - 12).trimmed();
                if (m_upnpurl.startsWith("/"))
                    m_upnpurl = m_upnpurl.sliced(1);
                if (!m_upnpurl.toUpper().startsWith("HTTP"))
                    m_upnpurl = urlbase + m_upnpurl;

                QEventLoop loop;
                connect(this, &UPnP::next, &loop, &QEventLoop::quit);
                m_active = false;
                int i = 1;

                while (i < 5 && ! m_active) {
                    m_tcpport = m_tcpportint + i;
                    UPnP4(m_upnpurl, m_service);
                    loop.exec();
                    ++i;
                }

                disconnect(this, &UPnP::next, &loop, &QEventLoop::quit);
            }
        }
    }
}


void UPnP::UPnP4(const QByteArray &upnpurl, const QByteArray &service)
{
    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
    for (QNetworkInterface &interface : interfaces) {
        QList<QNetworkAddressEntry> addressentries = interface.addressEntries();
        for (QNetworkAddressEntry &addressentry : addressentries)
            if (addressentry.prefixLength() > 0 && Address::isInSubnet(m_upnprouteraddress, addressentry.ip(), addressentry.netmask()))
                m_upnplocaladdress = addressentry.ip();
    }

    QByteArray soapbody = "";
    soapbody += "<?xml version=\"1.0\"?>";
    soapbody += "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">";
    soapbody += "<soap:Body>";
    soapbody += "<u:AddPortMapping xmlns:u=\"" + service + "\">";
    soapbody += "<NewRemoteHost></NewRemoteHost>";
    soapbody += "<NewExternalPort>" + QByteArray::number(m_tcpport) + "</NewExternalPort>";
    soapbody += "<NewProtocol>TCP</NewProtocol>";
    soapbody += "<NewInternalPort>" + QByteArray::number(m_tcpportint) + "</NewInternalPort>";
    soapbody += "<NewInternalClient>" + m_upnplocaladdress.toString().toUtf8() + "</NewInternalClient>";
    soapbody += "<NewEnabled>1</NewEnabled>";
    soapbody += "<NewPortMappingDescription>niliBOX-" + G_SITEID.toUtf8() + "</NewPortMappingDescription>";
    soapbody += "<NewLeaseDuration>0</NewLeaseDuration>";
    soapbody += "</u:AddPortMapping>";
    soapbody += "</soap:Body>";
    soapbody += "</soap:Envelope>";

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, &UPnP::UPnP5);
    QByteArray soapaction = service + "#AddPortMapping";
    httpsession->postSOAP(upnpurl, soapaction, soapbody);
}


void UPnP::UPnP5(HttpSession *httpsession)
{
    bool error = httpsession->error() || httpsession->data().toUpper().contains("ERROR");
    httpsession->deleteLater();

    if (!error) {
        m_active = true;
        if (G_LOCALSETTINGS.get("system.upnpport").toInt() != m_tcpport) {
            qInfo() << qPrintable("UPNP: Set UPnP lease on external port " + QString::number(m_tcpport));
            G_LOCALSETTINGS.set("system.upnpport", QString::number(m_tcpport));
            emit installed();
        } else
            if (G_VERBOSE) qInfo() << qPrintable("UPNP: Refreshed UPnP lease on external port " + QString::number(m_tcpport));
    }

    emit next();
}


void UPnP::UPnP6()
{
    QByteArray soapbody = "";
    soapbody += "<?xml version=\"1.0\"?>";
    soapbody += "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">";
    soapbody += "<soap:Body>";
    soapbody += "<u:DeletePortMapping xmlns:u=\"" + m_service + "\">";
    soapbody += "<NewRemoteHost></NewRemoteHost>";
    soapbody += "<NewExternalPort>" + QByteArray::number(m_tcpport) + "</NewExternalPort>";
    soapbody += "<NewProtocol>TCP</NewProtocol>";
    soapbody += "</u:DeletePortMapping>";
    soapbody += "</soap:Body>";
    soapbody += "</soap:Envelope>";

    HttpSession *httpsession = new HttpSession(this);
    connect(httpsession, &HttpSession::finished, this, &UPnP::UPnP7);
    QByteArray soapaction = m_service + "#DeletePortMapping";
    httpsession->postSOAP(m_upnpurl, soapaction, soapbody);

    QEventLoop loop;
    connect(this, &UPnP::next, &loop, &QEventLoop::quit);
    loop.exec();
}


void UPnP::UPnP7(HttpSession *httpsession)
{
    bool error = httpsession->error() || httpsession->data().toUpper().contains("ERROR");
    httpsession->deleteLater();

    if (!error) {
        qInfo() << qPrintable("UPNP: Unset UPnP lease on external port " + QString::number(m_tcpport));
        G_LOCALSETTINGS.set("system.upnpport", "0");
        m_tcpport = 0;
        m_active = false;
        emit installed();
    }

    emit next();
}
