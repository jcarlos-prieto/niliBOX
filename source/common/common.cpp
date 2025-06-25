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

#include "common/box.h"
#include "common/common.h"
#include <QCommandLineParser>
#include <QCryptographicHash>
#include <QDir>
#include <QLoggingCategory>
#include <QNetworkInterface>
#include <QProcess>
#include <QQmlEngine>
#include <QRandomGenerator>
#include <QUuid>
#include <iostream>

#if !defined NOGUI
#include "components/ioslineedit.h"
#include "components/graph.h"
#include "components/videoframe.h"
#endif

#if !defined NOGUI && defined OS_WINDOWS
#include <QFontDatabase>
#include <QMessageBox>
#endif

#if defined OS_ANDROID
#include <QJniObject>
#endif

#if defined OS_IOS
extern "C" NSString *getIdentifierForVendor();
#endif

float                   G_APPUNIT_F = 0.0;
float                   G_APPUNIT_L = 0.0;
float                   G_APPUNIT_S = 0.0;
Box                    *G_BOX = nullptr;
QString                 G_CLIENTID = "";
bool                    G_CLIENTONLY = false;
Settings                G_CONFIG;
QHash<QString, QString> G_CONN;
QFile                   G_CONSOLE;
QList <QString>         G_FAMILIES;
QString                 G_HOME;
int                     G_IDSIZE = 16;
QHostAddress            G_LOCALHOST = QHostAddress::LocalHost;
Settings                G_LOCALSETTINGS;
QFile                   G_LOGFILE;
QMutex                  G_MUTEX;
float                   G_PIXELRATIO = 1.0;
bool                    G_SERVERONLY;
QString                 G_SITEID = "";
QHash<QString, QString> G_STYLECACHE;
Settings                G_THEME;
bool                    G_TOUCH;
QList <QTranslator *>   G_TRANS;
float                   G_UNIT_F = 0.0;
float                   G_UNIT_L = 0.0;
float                   G_UNIT_S = 0.0;
bool                    G_VERBOSE;
bool                    G_WARNINGS = false;
int                     SF = sizeof(float);


void compileRCC(const QString path)
{
#if !defined QT_NO_PROCESS
    QString driverapplocationrcc = path + ".rcc";

    if (QDir(path).exists()) {
        QDir dir(path + "/languages");
        QList<QString> tss = dir.entryList(QList<QString>(), QDir::Dirs | QDir::NoDotAndDotDot);

        for (QString &ts : tss) {
            if (G_VERBOSE) qInfo() << qPrintable("COMMON: Compiling language file " + path + "/languages/" + ts + "/trans.ts");
            if (QFile(qApp->applicationDirPath() + "/lrelease.exe").exists())
                QProcess::execute(qApp->applicationDirPath() + "/lrelease.exe", QList<QString>() << "-silent" << path + "/languages/" + ts + "/trans.ts");
            else if (QFile(qApp->applicationDirPath() + "/lrelease").exists())
                QProcess::execute(qApp->applicationDirPath() + "/lrelease", QList<QString>() << "-silent" << path + "/languages/" + ts + "/trans.ts");
            else {
                if (G_VERBOSE) qInfo() << qPrintable("COMMON: Language compiler not found.");
            }
        }

        if (G_VERBOSE) qInfo() << qPrintable("COMMON: Packaging resources at " + path);

        if (QFile(qApp->applicationDirPath() + "/rcc.exe").exists())
            QProcess::execute(qApp->applicationDirPath() + "/rcc.exe", QList<QString>() << "-binary" << path + "/collection.qrc" << "-o" << driverapplocationrcc);
        else if (QFile(qApp->applicationDirPath() + "/rcc").exists())
            QProcess::execute(qApp->applicationDirPath() + "/rcc", QList<QString>() << "-binary" << path + "/collection.qrc" << "-o" << driverapplocationrcc);
        else
            if (G_VERBOSE) qInfo() << qPrintable("COMMON: Resource compiler not found.");
    }
#else
    Q_UNUSED(path)
    if (G_VERBOSE) qInfo() << qPrintable("COMMON: Compilers not available on this platform");
#endif
}


QString getStyleFromTheme(const QString &type, const QString &name, const QString &status, const QString &var, const Settings &theme, const QString &prefix)
{
    QString k = prefix + type + name + status + var;
    QString ret = G_STYLECACHE.value(k);

    if (!ret.isEmpty())
        return ret;

    QString styles, val = "";
    QList<QString> lstyles;
    QString key;
    qsizetype n;

    for (int i = 0; i < 32; ++i) {
        key = (i & 16 ? type : name);
        if (key.isEmpty())
            continue;
        key.append(i & 1 ? '*' : status.at(0)).append(i & 2 ? '*' : status.at(1)).append(i & 4 ? '*' : status.at(2)).append(i & 8 ? '*' : status.at(3));
        styles = theme.get(key);

        if (!styles.isEmpty()) {
            lstyles = styles.split(';');
            for (QString &style : lstyles) {
                style = style;
                n = style.indexOf(":");
                if (n < 0)
                    continue;
                if (var.compare(style.first(n).trimmed(), Qt::CaseInsensitive) == 0) {
                    val = style.sliced(n + 1).trimmed();
                    G_STYLECACHE.insert(k, val);
                    return val;
                }
            }
        }
    }

    G_STYLECACHE.insert(k, val);
    return val;
}


bool init()
{
    QLoggingCategory::setFilterRules("qt.network.ssl=false");

    qApp->setOrganizationName("nilibox");
    qApp->setOrganizationDomain("nilibox.com");
    qApp->setApplicationName("niliBOX");

    QCommandLineParser parser;

    QCommandLineOption setversion(QList<QString>() << "v" << "version", "Show version");
    QCommandLineOption sethelp(QList<QString>() << "h" << "help", "Show help");
    QCommandLineOption setserver(QList<QString>() << "server", "Start server only");
    QCommandLineOption setverbose(QList<QString>() << "verbose", "Start in verbose mode");
    QCommandLineOption sethome(QList<QString>() << "home", "Set the home folder", "directory");

    parser.addOption(setversion);
    parser.addOption(sethelp);
    parser.addOption(setserver);
    parser.addOption(setverbose);
    parser.addOption(sethome);

    if (!parser.parse(qApp->arguments())) {
        messageBox(parser.helpText().removeLast());
        return false;
    }

    parser.process(qApp->arguments());

    if (parser.isSet("help")) {
        messageBox(parser.helpText().removeLast());
        return false;
    }

    if (parser.isSet("version")) {
        QString ver;
        ver += qApp->applicationName() + "\n";
        ver += QString("Version ") + APP_VERSION  +"\n";
        ver += QString("Build ") + APP_BUILD  +"\n";
        ver += QString("Running on ") + QSysInfo::prettyProductName() + " - " + QSysInfo::currentCpuArchitecture();
        messageBox(ver);
        return false;
    }

#if defined NOGUI
    G_SERVERONLY = true;
#else
    G_SERVERONLY = parser.isSet("server");
#endif

    G_VERBOSE = parser.isSet("verbose");
    G_HOME = parser.value("home");

    G_LOCALSETTINGS.setLocalFile("config.set");

    G_VERBOSE = G_VERBOSE || (G_LOCALSETTINGS.get("system.verbose") == "true" ? true : false);

#if defined OS_WINDOWS
    FILE *nul = freopen("NUL:", "w", stderr);
#else
    FILE *nul = freopen("/dev/null", "w", stderr);
#endif

    Q_UNUSED(nul)

    std::cerr.setstate(std::ios_base::failbit);

    qInstallMessageHandler(messageOutput);

    qRegisterMetaType<Message>();
    qmlRegisterType<Box>("niliBOX.Box", 1, 0, "Box");

#if !defined NOGUI
    qmlRegisterType<IosLineEdit>("niliBOX.IosLineEdit", 1, 0, "IosLineEdit");
    qmlRegisterType<Graph>("niliBOX.Graph", 1, 0, "Graph");
    qmlRegisterType<VideoFrame>("niliBOX.VideoFrame", 1, 0, "VideoFrame");
#endif

    // (times in ms)
    G_LOCALSETTINGS.init("site.id", siteID());                                        // Site ID
    G_LOCALSETTINGS.set("site.os", QSysInfo::prettyProductName());                    // Name of the operating system
    G_LOCALSETTINGS.init("site.remotesetup", "1");                                    // Setup mode
    G_LOCALSETTINGS.init("system.appwatchdog", "2000");                               // Watchdog timer between app server and client
    G_LOCALSETTINGS.init("system.clientupdate", "1000");                              // Period to update site configuration at UI from client
    G_LOCALSETTINGS.init("system.devicediscovery", "2000");                           // Period to scan changes in devices
    G_LOCALSETTINGS.init("system.dummyaudio", "[null]");                              // Name of dummy audio output device
    G_LOCALSETTINGS.init("system.localdiscovery", "3000");                            // Period to scan local network for sites
    G_LOCALSETTINGS.init("system.localtimeout", "200");                               // Timeout to consider a local tcp request failed
    G_LOCALSETTINGS.init("system.masterserver", "server.nilibox.com");                // Master server
    G_LOCALSETTINGS.init("system.masterserverkeepalive", "120000");                   // Timeout to refresh a master server keep alive request
    G_LOCALSETTINGS.init("system.masterserverretry", "10000");                        // Delay to retry a keep alive packet with master server
    G_LOCALSETTINGS.init("system.masterservertcpport", "18081");                      // Master server TCP listening port
    G_LOCALSETTINGS.init("system.masterserverupdate", "60000");                       // Period to update configuration on master server
    G_LOCALSETTINGS.init("system.memorygarbagecollection", "3000");                   // Memory garbage collection period
    G_LOCALSETTINGS.init("system.refreshrate", "10");                                 // Refresh rate for graphs
    G_LOCALSETTINGS.init("system.remotediscovery", "5000");                           // Period to update global sites from master server
    G_LOCALSETTINGS.init("system.remotetimeout", "2000");                             // Timeout to consider a remote request failed
    G_LOCALSETTINGS.init("system.serverretry", "3000");                               // Time to wait after the server installation has failed
    G_LOCALSETTINGS.init("system.tcpport", "18081");                                  // TCP listening port
    G_LOCALSETTINGS.init("system.upnprefresh", "600000");                             // Refresh rate of uPnP leases
    G_LOCALSETTINGS.init("system.verbose", "false");                                  // Verbose mode
    G_LOCALSETTINGS.init("ui.animationdelay", "400");                                 // Duration of the window animations in ms.
    G_LOCALSETTINGS.init("ui.animationtype", "3");                                    // Animation type
    G_LOCALSETTINGS.init("ui.dpi", "96");                                             // Default screen dpi
    G_LOCALSETTINGS.init("ui.language", "languages/en.rcc");                          // Language of the interface
    G_LOCALSETTINGS.init("ui.maxunit", "10");                                         // Maximum size of basic unit in mm.
    G_LOCALSETTINGS.init("ui.minsize", "160,240");                                    // Minimum size of the UI
    G_LOCALSETTINGS.init("ui.minunit", "5");                                          // Minimum size of basic unit in mm.
    G_LOCALSETTINGS.init("ui.pinned", "false");                                       // UI pin set
    G_LOCALSETTINGS.init("ui.ratio", "0.06");                                         // Relative length of the unit with respect to the total window size
    G_LOCALSETTINGS.init("ui.ratio1", "6");                                           // Relative size of panel 1 with respect to basic unit
    G_LOCALSETTINGS.init("ui.ratio2", "16");                                          // Relative size of config and device panel with respect to basic unit
    G_LOCALSETTINGS.init("ui.theme", "themes/steel.rcc");                             // Theme of the interface
    G_LOCALSETTINGS.init("ui.tooltipdelay", "1000");                                  // Tooltip delay
    G_LOCALSETTINGS.init("ui.tooltiptimeout", "5000");                                // Tooltip timeout

    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("ui.ratio2") == "20")
        G_LOCALSETTINGS.set("ui.ratio2", "16");
    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("ui.minsize") == "240,240")
        G_LOCALSETTINGS.set("ui.minsize", "160,240");
    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("system.localtimeout") == "200")
        G_LOCALSETTINGS.set("system.localtimeout", "500");
    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("system.remotetimeout") == "3000")
        G_LOCALSETTINGS.set("system.remotetimeout", "2000");
    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("system.appwatchdog") == "3000")
        G_LOCALSETTINGS.set("system.appwatchdog", "2000");
    if (QString(APP_VERSION) >= "1.2.0" && G_LOCALSETTINGS.get("system.remotediscovery") == "60000")
        G_LOCALSETTINGS.set("system.remotediscovery", "5000");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.audiochunksize");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("site.datapath");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.debug");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.serverupdate");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.localdiscoverytimeout");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.remotediscoverytimeout");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.devicetimeout");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.idletimeout");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.serverheartbeat");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("system.usbnumpackets");
    if (QString(APP_VERSION) >= "1.2.0")
        G_LOCALSETTINGS.remove("site.getpublicsites");

#if defined OS_LINUX
    if (!QFile::exists(G_LOCALSETTINGS.localFilePath() + "/init")) {
        qInfo() << qPrintable("THE INITIALIZATION SCRIPT HAS NOT BEEN RUN");
        qInfo() << qPrintable("PLEASE RUN 'sudo ./init.sh' FROM THE niliBOX DIRECTORY");
        qInfo() << qPrintable("AND RESTART THE COMPUTER\n");
    }
#endif

    QDir(G_LOCALSETTINGS.localFilePath()).mkpath("data");

    qInfo() << qPrintable(qApp->applicationName());
    qInfo() << qPrintable("Version " + QString(APP_VERSION));
    qInfo() << qPrintable("Build " + QString(APP_BUILD));

    if (G_VERBOSE) {
        qInfo() << qPrintable("Loading settings:");
        QList<QString> lsettings = G_LOCALSETTINGS.getString().split('\n');
        std::sort(lsettings.begin(), lsettings.end());
        for (QString &setting : lsettings)
            qInfo() << qPrintable("    " + setting);
    }

    qInfo() << qPrintable("Running on " + QSysInfo::prettyProductName() + " - " + QSysInfo::currentCpuArchitecture());
    qInfo() << qPrintable("Application path: " + qApp->applicationFilePath());
    qInfo() << qPrintable("Home data path:   " + G_LOCALSETTINGS.localFilePath());

    if (G_SERVERONLY)
        qInfo() << qPrintable("Starting in SERVER mode");

    QThreadPool::globalInstance()->setMaxThreadCount(256);

    G_BOX = new Box();

    return true;
}


bool isGraphicsAvailable()
{
#if !defined OS_LINUX
    return true;
#else
    return std::getenv("DISPLAY") || std::getenv("WAYLAND_DISPLAY");
#endif

}


QString localSocketName(const QString &seed, int len)
{
    QByteArray hash = QCryptographicHash::hash(seed.toUtf8(), QCryptographicHash::Sha1);

    return "nB" + hash.toHex().first(len - 2);
}


void messageBox(const QString &msg)
{
#if !defined NOGUI && defined OS_WINDOWS
    QMessageBox msgbox;
    QFont font = QFontDatabase::systemFont(QFontDatabase::FixedFont);
    font.setPixelSize(11);
    msgbox.setFont(font);
    msgbox.setText(msg);
    msgbox.exec();
#else
    qDebug() << qPrintable(msg);
#endif
}


void messageOutput(QtMsgType type, const QMessageLogContext &, const QString &msg)
{
    G_MUTEX.lock();

    if (!G_LOGFILE.isOpen()) {
        QString filename = G_LOCALSETTINGS.localFilePath() + "/_Log_" + QDateTime::currentDateTime().toString("yyyyMMddhhmmss") + ".log";
        G_LOGFILE.setFileName(filename);
        G_LOGFILE.open(QIODevice::WriteOnly | QIODevice::Text);

        QDir *dir = new QDir(G_LOCALSETTINGS.localFilePath());
        bool cont = true;

        while (cont) {
            QList<QString> logfiles = dir->entryList(QList<QString>() << "*.log", QDir::Files, QDir::Name);
            if (logfiles.count() > 5) {
                cont = false;
                for (QString &logfile : logfiles)
                    if (QFile::remove(G_LOCALSETTINGS.localFilePath() + "/" + logfile)) {
                        cont = true;
                        break;
                    }
            } else
                cont = false;
        }
    }

    if (!G_SERVERONLY)
        if (!G_CONSOLE.isOpen()) {
            G_CONSOLE.open(stdout, QIODevice::WriteOnly | QIODevice::Text);
            G_CONSOLE.write("\n");
        }

    QString time = QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm:ss.zzz");

    switch (type) {
    case QtDebugMsg:
        std::cout << QString("%1 DEBUG: %2\n").arg(time, msg).toUtf8().data();
        std::cout.flush();
        if (G_LOGFILE.isOpen()) {
            G_LOGFILE.write(QString("%1 DEBUG: %2\n").arg(time, msg).toUtf8());
            G_LOGFILE.flush();
        }
        break;

    case QtInfoMsg:
        std::cout << QString("%1 %2\n").arg(time, msg).toUtf8().data();
        std::cout.flush();
        if (G_LOGFILE.isOpen()) {
            G_LOGFILE.write(QString("%1 %2\n").arg(time, msg).toUtf8());
            G_LOGFILE.flush();
        }
        break;

    case QtWarningMsg:
        if (G_WARNINGS) {
            std::cout << QString("%1 WARNING: %2\n").arg(time, msg).toUtf8().data();
            std::cout.flush();
            if (G_LOGFILE.isOpen()) {
                G_LOGFILE.write(QString("%1 WARNING: %2\n").arg(time, msg).toUtf8());
                G_LOGFILE.flush();
            }
        }
        break;

    case QtCriticalMsg:
        std::cout << QString("%1 CRITICAL: %2\n").arg(time, msg).toUtf8().data();
        std::cout.flush();
        if (G_LOGFILE.isOpen()) {
            G_LOGFILE.write(QString("%1 CRITICAL: %2\n").arg(time, msg).toUtf8());
            G_LOGFILE.flush();
        }
        break;

    case QtFatalMsg:
        std::cout << QString("%1 FATAL: %2\n").arg(time, msg).toUtf8().data();
        std::cout.flush();
        if (G_LOGFILE.isOpen()) {
            G_LOGFILE.write(QString("%1 FATAL: %2\n").arg(time, msg).toUtf8());
            G_LOGFILE.flush();
        }
        abort();
    default:
        break;
    }

    G_MUTEX.unlock();
}


QString newID()
{
    QUuid id;
    return id.createUuid().toString().replace("{", "").replace("}", "").replace("-", "").last(G_IDSIZE);
}


QString productType()
{
    QString os = QSysInfo::productType();

    if (os == "windows" || os == "macos" || os == "android" || os == "ios")
        return os;
    else
        return "linux";
}


QString siteID()
{
#if defined OS_ANDROID
    QJniObject context = QNativeInterface::QAndroidApplication::context();
    QJniObject contentResolver = context.callObjectMethod("getContentResolver", "()Landroid/content/ContentResolver;");
    QJniObject androidId = QJniObject::callStaticObjectMethod("android/provider/Settings$Secure",
                                                              "getString",
                                                              "(Landroid/content/ContentResolver;Ljava/lang/String;)Ljava/lang/String;",
                                                              contentResolver.object(),
                                                              QJniObject::getStaticObjectField<jstring>("android/provider/Settings$Secure", "ANDROID_ID").object());
    return androidId.toString();
#elif OS_IOS
    NSString *idForVendor = getIdentifierForVendor();
    QString iosid = QString::fromNSString(idForVendor);
    return iosid.replace("-", "").last(16).toLower();
#else
    QList<QString> macaddr;
    QList<QNetworkInterface> interfaces = QNetworkInterface::allInterfaces();
    QString mac;

    for (QNetworkInterface &interface : interfaces) {
        mac = interface.hardwareAddress();
        if (!mac.isEmpty())
            macaddr.append(mac);
    }

    mac = "";

    if (macaddr.count() > 0) {
        std::sort(macaddr.begin(), macaddr.end());
        mac = macaddr.last().replace(":", "").last(8);
    }

    if (mac.isEmpty() || mac.count('0') > 5)
        mac = QSysInfo::machineUniqueId().replace("-", "").last(8);

    quint32 seed = mac.toUInt(nullptr, 16);
    QRandomGenerator r(seed);
    QString id = "";

    for (int i = 0; i < G_IDSIZE; ++i)
        id.append(QString::number(static_cast<int>(16 * r.generateDouble()), 16));

    return id;
#endif
}


int verToInt(QString ver)
{
    QList<QString> lver = ver.split(".");

    while (lver.count() < 3)
        lver.append("0");

    return 10000 * lver.at(0).toInt() + 100 * lver.at(1).toInt() + lver.at(2).toInt();
}
