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

#if !defined APP_H
#define APP_H

#include "common/message.h"
#include "common/settings.h"
#include <QQuickWidget>

class Box;
class QLocalServer;
class QLocalSocket;
class QTranslator;


class App : public QQuickWidget
{
    Q_OBJECT

public:
    explicit              App(QWidget *parent = nullptr);
    virtual              ~App();

    Q_INVOKABLE QString   conn();
    Q_INVOKABLE void      debug(const QString &value);
    Q_INVOKABLE QObject  *getBox(const QString &param = "");
    Q_INVOKABLE QString   getvar(const QString &key, const QString &value);
    Q_INVOKABLE void      import(const QString &module, const QString &file) const;
    Q_INVOKABLE QString   param(const QString &value) const;
    Q_INVOKABLE void      send(const QString &key, const QString &value);
    Q_INVOKABLE void      sendbin(const QString &key, QByteArrayView value);
    Q_INVOKABLE void      setvar(const QString &key, const QString &value);
    Q_INVOKABLE QString   theme(const QString &type, const QString &name, const QString &var);

    void                  install(const QByteArray &rcc, Settings *config, const Settings &params);
    void                  loadTheme();
    void                  loadTranslator();
    void                  receive(const QString &key, const QString &value);
    void                  receivebin(const QByteArray &data);
    void                  receivebox(const Message &message);
    void                  updateGlobalValues();

private:
    void                  applicationStatusChanged(Qt::ApplicationState state);
    void                  audioSlave(const int samplerate, QByteArrayView data);
    void                  QMLObjectSizeChanged();
    QByteArray            wrapQml(const QByteArray &data);

    QString               m_app;
    QString               m_appname;
    Box                  *m_box;
    Settings             *m_config;
    QString               m_devid;
    QString               m_id;
    QLocalServer         *m_localserver;
    Settings             *m_params;
    QList<QString>        m_paths;
    QQuickItem           *m_qmlobject;
    Box                  *m_rbox;
    QByteArray            m_rcc;
    QString               m_siteid;
    QList<QLocalSocket *> m_slaves;
    Settings           	  m_storage;
    Settings              m_theme;
    QTranslator          *m_translator;
    QString               m_type;
    QString               m_x;

signals:
    void                  error();
    void                  hotPlug();
    void                  installed();
    void                  recRemoteBox(const Message &message);
    void                  reqRemoteBox(const Message &message);
    void                  resized();
    void                  sendSignal(const QString &key, const QString &value);
    void                  sendbinSignal(const QString &key, const QByteArray &value);
    void                  receiveSignal(const QString &key, const QString &value);
    void                  receivebinSignal(const QString &key, const QByteArrayView value);
    void                  virtualDevice(const QString &devname);
};

#endif // APP_H
