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

#include "common/common.h"
#include "server/server.h"
#include <QThread>
#include <csignal>


QCoreApplication *app;
QEventLoop       *loop;
Server           *server;
QThread          *serverthread;


void signalHandler(int signal)
{
    if (signal == SIGINT) {
        printf("SIGINT\n");
        QMetaObject::invokeMethod(app, "quit", Qt::QueuedConnection);
    }
}


int main(int argc, char *argv[])
{
    app = new QCoreApplication(argc, argv);
    loop = new QEventLoop();

    if (!init())
        return 0;

    serverthread = new QThread();
    server = new Server();
    server->moveToThread(serverthread);
    QObject::connect(serverthread, &QThread::started, server, &Server::start);
    QObject::connect(server, &Server::started, loop, &QEventLoop::quit);
    serverthread->start();
    loop->exec();

    if (!server->running()) {
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, loop, &QEventLoop::quit);
        server->deleteLater();
        loop->exec();
        delete loop;
        delete app;
        return 1;
    }

    std::signal(SIGINT, signalHandler);

    QObject::connect(app, &QCoreApplication::aboutToQuit, app, [&]() {
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, loop, &QEventLoop::quit);
        server->deleteLater();
        loop->exec();
        delete loop;
    });

    return app->exec();
}

#else

#include "client/client.h"
#include "common/common.h"
#include "server/server.h"
#include "ui/ui.h"
#include <QThread>
#include <csignal>


QApplication     *app;
Client           *client;
QThread          *clientthread;
QEventLoop       *loop;
Server           *server;
QThread          *serverthread;
UI               *ui;


void signalHandler(int signal)
{
    if (signal == SIGINT) {
        printf("SIGINT\n");
        QMetaObject::invokeMethod(app, "quit", Qt::QueuedConnection);
    }
}


int main(int argc, char *argv[])
{
    if (!isGraphicsAvailable()) {
        qInfo() << qPrintable("\nERROR: No graphic environment available");
        qInfo() << qPrintable("Use the headless version instead\n");
        return 0;
    }

    app = new QApplication(argc, argv);
    loop = new QEventLoop();

    if (!init())
        return 0;

    ui = new UI();

    serverthread = new QThread();
    server = new Server();
    server->moveToThread(serverthread);
    QObject::connect(serverthread, &QThread::started, server, &Server::start);
    QObject::connect(server, &Server::started, loop, &QEventLoop::quit);
    serverthread->start();
    loop->exec();

    if (!server->running()) {
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, loop, &QEventLoop::quit);
        server->deleteLater();
        loop->exec();
        delete ui;
        delete loop;
        delete app;
        return 1;
    }

    clientthread = new QThread();
    client = new Client();
    client->moveToThread(clientthread);
    QObject::connect(clientthread, &QThread::started, client, &Client::start);
    QObject::connect(client, &Client::started, loop, &QEventLoop::quit);
    clientthread->start();
    loop->exec();

    ui->start();

    std::signal(SIGINT, signalHandler);

    QObject::connect(ui, &UI::messageOut, client, &Client::messageIn);
    QObject::connect(client, &Client::messageOut, ui, &UI::messageIn);

    QObject::connect(app, &QCoreApplication::aboutToQuit, app, [&]() {
        QObject::connect(client, &Client::destroyed, clientthread, &QThread::quit);
        QObject::connect(clientthread, &QThread::finished, clientthread, &QThread::deleteLater);
        QObject::connect(clientthread, &QThread::destroyed, server, &Server::deleteLater);
        QObject::connect(server, &Server::destroyed, serverthread, &QThread::quit);
        QObject::connect(serverthread, &QThread::finished, serverthread, &QThread::deleteLater);
        QObject::connect(serverthread, &QThread::destroyed, loop, &QEventLoop::quit);
        client->deleteLater();
        loop->exec();
        delete loop;
    });

    return app->exec();
}

#endif
