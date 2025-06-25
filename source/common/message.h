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

/* Message structure
 *
 * Signature:     2 bytes ("nB")
 * Packet length: 4 bytes - big indian
 * Sequence:      2 bytes - big indian
 * Command:       1 byte (enum)
 * Site ID:       8 bytes
 * Meta command:  1 byte - higher bit=origin (enum) - rest of bits=metacommand (enum)
 * Meta site ID:  8 bytes
 * Data:          Rest
 *
*/

#if !defined MESSAGE_H
#define MESSAGE_H

#include <QObject>

#define SIGNATURE "nB"


class Message : public QObject
{
    Q_OBJECT

public:
    enum Command {
                                        // ┌──── Used in main server. Do not change.
                                        // │
                                        // ▼
        C_NULL             = 0x00,      //   Null command
        C_CBACKDATA        = 0x01,      //   Encapsulated callback message    Client <--> Server
        C_TCPDATA          = 0x02,      // * Encapsulated TCP message         Server <--> Master server
        C_HTTPDATA         = 0x03,      //   Encapsulated HTTP message        Server <--> Master server
        C_PING             = 0x04,      //   Search for sites                 Server --> Server (broadcast)
        C_GETCONFIG        = 0x05,      //   Get configuration from one site  SettingsPanel <--> UI <--> Client // Client <--> Server
        C_GETDEVICES       = 0x06,      //   Get devices from one site        SettingsPanel <--> UI <--> Client // Client <--> Server
        C_GETDRIVERS       = 0x07,      //   Get drivers from one site        SettingsPanel <--> UI <--> Client // Client <--> Server
        C_GETCUSTOMDRIVERS = 0x08,      //   Get custom drivers from one site SettingsPanel <--> UI <--> Client // Client <--> Server
        C_GETCONFIGFULL    = 0x09,      //   Get full info of one site        ClientSession <--> UI <--> Client
        C_GETCONFIGNEAR    = 0x0a,      //   Get full info from a near site   SettingsPanel <--> UI <--> Client <--> Server
        C_GETSITESBASIC    = 0x0b,      //   Get basic list of near sites     SettingsPanel <--> UI <--> Client
        C_GETSITESFULL     = 0x0c,      //   Get full list of avail. sites    DevicesPanel <--> UI <--> Client
        C_SETCONFIG        = 0x0d,      //   Set full configuration           SettingsPanel <--> UI <--> Client <--> Server
        C_SETDEVICES       = 0x0e,      //   Set site's devices               SettingsPanel <--> UI <--> Client <--> Server
        C_GETDRIVERCONFIG  = 0x0f,      //   Get driver's configuration app   SettingsPanel <--> UI <--> Client <--> Server
        C_GETDRIVERCLIENT  = 0x10,      //   Get driver's client app          SettingsPanel <--> UI <--> Client <--> Server
        C_GETDRIVERSERVER  = 0x11,      //   Get driver's server app          ServerSession <--> Server
        C_REFRESH          = 0x12,      //   Ask the client to refresh info   SettingsPanel --> Client // DevicesPanel --> Client
        C_GETKNOWNSITES    = 0x13,      //   Get list of sites discovered     Client <--> Server
        C_SETLANGUAGE      = 0x14,      //   Ask UI to set language           SettingsPanel --> UI
        C_SETTHEME         = 0x15,      //   Ask UI to change theme           SettingsPanel --> UI
        C_OPENAPP          = 0x16,      //   Open an app                      DevicesPanel --> UI // Client --> UI
        C_CANCELAPP        = 0x17,      //   Cancel app opening               DevicesPanel --> UI
        C_OPENCONF         = 0x18,      //   Open an app config               SettingsPanel --> UI
        C_CANCELCONF       = 0x19,      //   Cancel app config opening        SettingsPanel --> UI
        C_OPENSESSION      = 0x1a,      //   Opens a client-server session    ClientSession <--> UI <--> Client <--> Server
        C_CLOSESESSION     = 0x1b,      //   Closes a client-server session   ClientSession <--> UI <--> Client <--> Server
        C_APPDATA          = 0x1c,      //   Communication server-client      ClientSession <--> UI <--> Client <--> Server <--> ServerSession
        C_APPDATABIN       = 0x1d,      //   Communication server-client(bin) ClientSession <--> UI <--> Client <--> Server <--> ServerSession
        C_APPWATCHDOG      = 0x1e,      //   Watchdog from server to client   ClientSession <--> UI <--> Client <--> Server <--> ServerSession
        C_CBACK            = 0x1f,      //   Callback initialization          Client <--> Server
        C_CBACKERROR       = 0x20,      //   Callback message error           Server --> Client
        C_PUBLICSITES      = 0x21,      //   Activates or deactivates global  DevicesPanel --> UI --> Client
        C_THP              = 0x22,	    // * Request for THP connection       Server <--> Master server
        C_TCP              = 0x23,      // * Request for TCP connection       Server <--> Master server
        C_TCPERROR         = 0x24,      // * TCP message error                Master server --> Server
        C_REMOTEBOX        = 0x25,      //   Gets remote device information   Box <--> App <--> ClientSession <--> UI <--> Client <--> Server
        C_VIRTUALDEV       = 0x26,      //   (Un)registers a virtual device
        C_TESTCBACK        = 0x27       //   Test callback connectivity       Socket client --> Socket server
    };
    Q_ENUM(Command)

    enum MessageOrigin {
        MO_server,
        MO_client
    };
    Q_ENUM(MessageOrigin)

    explicit       Message(QObject *parent = nullptr);
    explicit       Message(const Message &message, QObject *parent = nullptr);
    explicit       Message(const Command command, QObject *parent = nullptr);
    explicit       Message(const Command command, const QByteArray &data, QObject *parent = nullptr);
    explicit       Message(const Command command, const QString &data, QObject *parent = nullptr);
    virtual       ~Message();

    void           clear();
    Command        command() const;
    QByteArray     data() const;
    QByteArray     datagram() const;
    Command        metaCommand() const;
    QString        metaSiteID() const;
    MessageOrigin  origin() const;
    int            sequence() const;
    void           setCommand(const Command command);
    void           setData(const QByteArray &data);
    void           setData(const QString &data);
    void           setDatagram(QByteArray &datagram);
    void           setMessage(const Command command);
    void           setMessage(const Command command, const QString &data);
    void           setMetaCommand(const Command metacommand);
    void           setMetaSiteID(const QString &metasiteid);
    void           setOrigin(const MessageOrigin origin);
    void           setSequence(const int sequence);
    void           setSiteID(const QString &siteid);
    QString        siteID() const;

private:
    Command        m_command;
    QByteArray     m_data;
    static int     m_masterseq;
    Command        m_metacommand;
    QString        m_metasiteid;
    MessageOrigin  m_origin;
    int            m_sequence;
    QString        m_siteid;
};

Q_DECLARE_METATYPE(Message)

#endif // MESSAGE_H
