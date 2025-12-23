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

#if defined NOGUI

#include "common/box.h"
#include "common/common.h"
#include "server/server.h"
#include <QThread>
#include <csignal>


QCoreApplication *papp;
Server           *server;
QThread          *serverthread;


void signalHandler(int signal)
{
    if (signal == SIGINT) {
        printf(" SIGINT\n");
        QMetaObject::invokeMethod(papp, &QCoreApplication::quit, Qt::QueuedConnection);
    }
}


int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);

    papp = &app;

    if (!init())
        return 0;

    QEventLoop loop;

    serverthread = new QThread();
    server = new Server();
    server->moveToThread(serverthread);
    QObject::connect(serverthread, &QThread::started, server, &Server::start);
    QObject::connect(server, &Server::started, &loop, &QEventLoop::quit);
    serverthread->start();
    loop.exec();

    if (!server->running()) {
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, &loop, &QEventLoop::quit);
        server->deleteLater();
        loop.exec();
        return 1;
    }

    G_BOX = new Box();

    std::signal(SIGINT, signalHandler);

    QObject::connect(&app, &QCoreApplication::aboutToQuit, &app, [&]() {
        G_BOX->deleteLater();
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, &loop, &QEventLoop::quit);
        server->deleteLater();
        loop.exec();
    });

    return app.exec();
}

#else

#include "common/box.h"
#include "client/client.h"
#include "common/common.h"
#include "server/server.h"
#include "ui/ui.h"
#include <QThread>
#include <csignal>


QApplication     *papp;
Client           *client;
QThread          *clientthread;
Server           *server;
QThread          *serverthread;
UI               *ui;


void signalHandler(int signal)
{
    if (signal == SIGINT) {
        printf(" SIGINT\n");
        QMetaObject::invokeMethod(papp, &QApplication::quit, Qt::QueuedConnection);
    }
}


int main(int argc, char *argv[])
{
    if (!isGraphicsAvailable()) {
        qInfo() << qPrintable("\nERROR: No graphic environment available");
        qInfo() << qPrintable("Use the headless version instead\n");
        return 1;
    }

    QApplication app(argc, argv);

    papp = &app;

    if (!init())
        return 0;

    QEventLoop loop;

    serverthread = new QThread();
    server = new Server();
    server->moveToThread(serverthread);
    QObject::connect(serverthread, &QThread::started, server, &Server::start);
    QObject::connect(server, &Server::started, &loop, &QEventLoop::quit);
    serverthread->start();
    loop.exec();

    if (!server->running()) {
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, &loop, &QEventLoop::quit);
        server->deleteLater();
        loop.exec();
        return 1;
    }

    G_BOX = new Box();

    clientthread = new QThread();
    client = new Client();
    client->moveToThread(clientthread);
    QObject::connect(clientthread, &QThread::started, client, &Client::start);
    QObject::connect(client, &Client::started, &loop, &QEventLoop::quit);
    clientthread->start();
    loop.exec();

    ui = new UI();
    ui->start();

    QObject::connect(ui, &UI::messageOut, client, &Client::messageIn);
    QObject::connect(client, &Client::messageOut, ui, &UI::messageIn);

    std::signal(SIGINT, signalHandler);

#if !defined OS_ANDROID && !defined OS_IOS
    QObject::connect(&app, &QCoreApplication::aboutToQuit, &app, [&]() {
        G_BOX->deleteLater();
        QObject::connect(client, &Client::destroyed, clientthread, &QThread::quit);
        QObject::connect(clientthread, &QThread::finished, clientthread, &QThread::deleteLater);
        QObject::connect(clientthread, &QThread::destroyed, server, &Server::deleteLater);
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, &loop, &QEventLoop::quit);
        client->deleteLater();
        loop.exec();
    });
#endif

    return app.exec();
}

#endif
