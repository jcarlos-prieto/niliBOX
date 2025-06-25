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

#if !defined COMMON_H
#define COMMON_H

#if !defined NOGUI
#include <QApplication>
#else
#include <QCoreApplication>
#endif

#include "common/settings.h"
#include <QFile>
#include <QHostAddress>
#include <QMutex>
#include <QTimer>

class Box;


//--- Global variables
extern float                     G_APPUNIT_F;      // Common font size in apps
extern float                     G_APPUNIT_L;      // Size of basic unit in apps
extern float                     G_APPUNIT_S;      // Size of small unit in apps
extern Box                      *G_BOX;            // Shared box object
extern QString                   G_CLIENTID;       // The Client ID
extern bool                      G_CLIENTONLY;     // Started as client
extern Settings                  G_CONFIG;         // Temporary device settings
extern QHash<QString, QString>   G_CONN;           // Connection type per site id. Debug purpose
extern QFile                     G_CONSOLE;        // Name of the console device
extern QList <QString>           G_FAMILIES;       // List of driver families
extern QString                   G_HOME;           // Home directory
extern int                       G_IDSIZE;         // Size in bytes of the site and device id
extern QHostAddress              G_LOCALHOST;      // Localhost address
extern Settings                  G_LOCALSETTINGS;  // Local settings repository
extern QFile                     G_LOGFILE;        // Name of the log file
extern QMutex                    G_MUTEX;          // Mutex for log output
extern float                     G_PIXELRATIO;     // Pixel ratio. 2.0 on retina displays, 1.0 on others
extern bool                      G_SERVERONLY;     // Start server only
extern QString                   G_SITEID;         // The Site ID
extern QHash<QString, QString>   G_STYLECACHE;     // Styles cache
extern Settings                  G_THEME;          // Theme settings
extern bool                      G_TOUCH;          // A touch screen is present
extern QList <QTranslator *>     G_TRANS;          // List of active translators
extern float                     G_UNIT_F;         // Common font size
extern float                     G_UNIT_L;         // Size of basic unit
extern float                     G_UNIT_S;         // Size of small unit
extern bool                      G_VERBOSE;        // Show Info
extern bool                      G_WARNINGS;       // Show warnings (manual variable)
extern int                       SF;               // sizeof(float)


//--- Miscelaneous functions
void                             compileRCC(const QString path);
QString                          getStyleFromTheme(const QString &type, const QString &name, const QString &status, const QString &var, const Settings &theme = G_THEME, const QString &prefix = "");
bool                             init();
bool                             isGraphicsAvailable();
QString                          localSocketName(const QString &seed, int len);
void                             messageBox(const QString &msg);
void                             messageOutput(QtMsgType type, const QMessageLogContext &, const QString &_msg);
QString                          newID();
QString                          productType();
QString                          siteID();
int                              verToInt(QString ver);

#endif // COMMON_H
