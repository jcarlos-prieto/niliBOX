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

#include "client/app.h"
#include "common/box.h"
#include "common/common.h"
#include "ui/tpane.h"
#include <QLocalServer>
#include <QLocalSocket>
#include <QQmlContext>
#include <QQmlEngine>
#include <QQuickItem>
#include <QResource>
#include <QTimer>
#include <QTranslator>
#include <QSurfaceFormat>


App::App(QWidget *parent) : QQuickWidget(parent)
{
    m_translator = nullptr;
    m_box = nullptr;
    m_rbox = nullptr;
    m_x = "";
}


App::~App()
{
    qInfo() << qPrintable("APP: Unloading " + m_app);

    if (rootObject())
        QMetaObject::invokeMethod(rootObject(), "b_finish");

    if (m_translator)
        qApp->removeTranslator(m_translator);

    emit virtualDevice("*[" + m_appname + "]");

    QResource::unregisterResource(reinterpret_cast<const unsigned char *>(m_rcc.data()), "/" + m_id + m_type);
}


QString App::conn()
{
    return G_CONN.value(m_siteid, "SELF");
}


void App::debug(const QString &value)
{
    qInfo() << qPrintable(value);
}


QObject *App::getBox(const QString &param)
{
    if (param.compare("REMOTE", Qt::CaseInsensitive) == 0) {
        if (!m_rbox) {
            m_rbox = new Box(this, true);
            m_rbox->setSiteID(m_siteid);
            m_rbox->setAppName(m_appname);
            QQmlEngine::setObjectOwnership(m_rbox, QQmlEngine::CppOwnership);
            connect(m_rbox, &Box::reqRemoteBox, this, &App::reqRemoteBox);
            connect(this, &App::recRemoteBox, m_rbox, &Box::recRemoteBox);
            connect(m_rbox, &Box::hotPlug, this, &App::hotPlug);
        }
        return m_rbox;
    } else {
        if (!m_box) {
            m_box = new Box(this);
            m_box->setSiteID(m_siteid);
            m_box->setAppName(m_appname);
            QQmlEngine::setObjectOwnership(m_box, QQmlEngine::CppOwnership);
            connect(m_box, &Box::audioDevice_Slave, this, &App::audioSlave);
            connect(m_box, &Box::hotPlug, this, &App::hotPlug);
        }
        return m_box;
    }
}


QString App::getvar(const QString &key, const QString &value)
{
    QString val = m_storage.get(key);

    if (val.isEmpty())
        return value;
    else
        return val;
}


void App::import(const QString &module, const QString &file) const
{
    QJSValue value = engine()->importModule(":/" + m_id + m_type + "/" + file);

    engine()->globalObject().setProperty(module, value);
    if (!engine()->globalObject().hasProperty(module))
        qInfo() << qPrintable("APP: Error in JS module " + file + ": " + value.toString());
}


QString App::param(const QString &value) const
{
    return G_LOCALSETTINGS.get(value);
}


void App::send(const QString &key, const QString &value)
{
    emit sendSignal(key, value);
}


void App::sendbin(const QString &key, QByteArrayView value)
{
    emit sendbinSignal(key, value.toByteArray());
}


void App::setvar(const QString &key, const QString &value)
{
    m_storage.set(key, value);
}


QString App::theme(const QString &type, const QString &name, const QString &var)
{
    QString status;
    status.append(type.contains(":active") ? "Y" : type.contains(":!active") ? "N" : "*");
    status.append(type.contains(":enabled") ? "Y" : type.contains(":!enabled") ? "N" : "*");
    status.append(type.contains(":hover") ? "Y" : type.contains(":!hover") ? "N" : "*");
    status.append(type.contains(":pressed") ? "Y" : type.contains(":!pressed") ? "N" : "*");

    QString stype;
    qsizetype pos = type.indexOf(":");
    if (pos > -1)
        stype = type.first(pos);
    else
        stype = type;

    QString sname;
    pos = name.indexOf(":");
    if (pos > -1)
        sname = name.first(pos);
    else
        sname = name;

    QString ret = getStyleFromTheme(stype, sname, status, var, m_theme, m_id + m_type);

    if (var == "image") {
        if (ret.isEmpty() || ret == "none")
            return "qrc:/none.png";
        else
            for (QString &path : m_paths)
                if (QFile::exists(path + ret)) {
                    ret.prepend(path).prepend("qrc");
                    return ret;
                }
    }

    if (var.contains("color") && ret.isEmpty())
        return "transparent";

    if (var.startsWith("margin-") && ret.isEmpty())
        ret = getStyleFromTheme(stype, sname, status, "margin", m_theme);
    else if (var.startsWith("padding-") && ret.isEmpty())
        ret = getStyleFromTheme(stype, sname, status, "padding", m_theme);
    else if (var.startsWith("radius-") && ret.isEmpty())
        ret = getStyleFromTheme(stype, sname, status, "radius", m_theme);

    if (ret == "round")
        ret = "1000";
    else if (ret.isEmpty())
        ret = "0";

    return ret;
}


void App::install(const QByteArray &rcc, Settings *config, const Settings &params)
{
    m_rcc = rcc;
    m_config = config;
    m_params = new Settings(params);
    m_id = m_config->get("id");
    m_siteid = m_id.first(G_IDSIZE);
    m_devid = m_id.last(G_IDSIZE);
    m_type = m_config->get("type");
    m_storage.setLocalFile("_Store_" + m_id + ".set");

    if (!QResource::registerResource(reinterpret_cast<const unsigned char *>(m_rcc.data()), "/" + m_id + m_type)) {
        qInfo() << qPrintable("APP: Error loading resource data");
        emit error();
        return;
    }

    QFile file(":/" + m_id + m_type + "/main.qml");
    if (!file.open(QFile::ReadOnly)) {
        qInfo() << qPrintable("APP: Error loading main.qml");
        emit error();
        return;
    }

    QString drivername = m_config->get("devices." + m_devid + ".driver");
    m_app = drivername + " " + m_config->get("type");
    m_appname = m_config->get("site.name") + " :: " + m_config->get("devices." + m_devid + ".name");

    qInfo() << qPrintable("APP: Loading " + m_app);

    engine()->globalObject().setProperty("_this_", engine()->newQObject(this));
    engine()->globalObject().setProperty("Box", engine()->newQMetaObject(G_BOX->metaObject()));
    engine()->addImportPath(":/");

    QByteArray main = file.readAll();
    file.close();
    main = wrapQml(main);

    connect(rootObject(), &QQuickItem::heightChanged, this, &App::QMLObjectSizeChanged);
    connect(rootObject(), &QQuickItem::widthChanged, this, &App::QMLObjectSizeChanged);
    connect(qApp, &QApplication::applicationStateChanged, this, &App::applicationStatusChanged);

    QQmlComponent *comp = new QQmlComponent(engine());
    comp->setData(main, QUrl("qrc:///" + m_id + m_type));
    QCoreApplication::processEvents();

    if (comp->isError()) {
        qInfo() << qPrintable("APP: Error in main.qml");
        comp->deleteLater();
        QList<QQmlError> errors = comp->errors();
        for (QQmlError &error : errors)
            qInfo() << qPrintable(error.toString());
        emit error();
        return;
    }

    setContent(comp->url(), comp, comp->create());
    comp->deleteLater();
    QCoreApplication::processEvents();

    if (status() != QQuickWidget::Ready) {
        qInfo() << qPrintable("APP: Error loading main.qml");
        emit error();
        return;
    }

    loadTheme();
    loadTranslator();

    if (m_type == "client" && m_config->get("drivers." + drivername + ".virtualdevice") == "true") {
        emit virtualDevice("[" + m_appname + "]");
        m_localserver = new QLocalServer(this);
        QString servername = localSocketName(m_appname, 10);
        QLocalServer::removeServer(servername);
        m_localserver->listen(servername);
        connect(m_localserver, &QLocalServer::newConnection, this, [&]() {
            if (m_localserver->hasPendingConnections())
                m_slaves.append(m_localserver->nextPendingConnection());
        });
    }

    QMetaObject::invokeMethod(rootObject(), "_start_", m_params->getVariant());

    emit installed();
}


void App::loadTheme()
{
    QString themename = G_LOCALSETTINGS.get("ui.theme");
    themename.replace(".rcc", "");
    qsizetype pos = themename.lastIndexOf("/");
    if (pos > -1)
        themename = themename.sliced(pos + 1);

    m_paths.clear();
    m_paths << ":/" + m_id + m_type + "/themes/" + themename + "/";
    m_paths << ":/" + m_id + m_type + "/";
    m_paths << ":/theme/";

    m_theme.clear();
    m_theme.loadSettings(G_THEME);

    Settings theme;
    theme.loadFile(":/" + m_id + m_type + "/themes/" + themename + "/style.set");
    QList<QString> ktheme = theme.keys();
    QString newkey;

    for (QString &inikey : ktheme) {
        pos = inikey.indexOf(":");
        if (pos > -1) {
            newkey = inikey.first(pos);
            for (QString &key : QList<QString>({"active", "enabled", "hover", "pressed"})) {
                if (inikey.contains(":" + key))
                    newkey.append("Y");
                else if (inikey.contains(":!" + key))
                    newkey.append("N");
                else
                    newkey.append("*");
            }
        } else
            newkey = inikey + "****";
        m_theme.set(newkey, theme.get(inikey));
    }

    setClearColor(static_cast<TPane *>(parentWidget())->backgroundColor());

    m_x = m_x == "/" ? "" : "/";
    updateGlobalValues();

    if (rootObject())
        QMetaObject::invokeMethod(rootObject(), "b_change", QVariant("theme"));
}


void App::loadTranslator()
{
    QString locale = G_LOCALSETTINGS.get("ui.language");
    locale.replace(".rcc", "");
    qsizetype pos = locale.lastIndexOf("/");
    if (pos > -1)
        locale = locale.sliced(pos + 1);

    m_translator = new QTranslator();

    if (m_translator->load(":/" + m_id + m_type + "/languages/" + locale + "/trans.qm")) {
        if (G_VERBOSE) qInfo() << qPrintable("APP: Installing translator for '" + locale + "' on " + m_app);
        qApp->installTranslator(m_translator);
        G_TRANS << m_translator;
        engine()->retranslate();
    }

    if (rootObject())
        QMetaObject::invokeMethod(rootObject(), "b_change", QVariant("language"));
}


void App::receive(const QString &key, const QString &value)
{
    emit receiveSignal(key, value);
}


void App::receivebin(const QByteArray &data)
{
    qsizetype pos = data.indexOf('=');
    if (pos < 0)
        return;

    QString key = QString(data.first(pos));
    QByteArrayView value = G_BOX->mem()->alloc(data.sliced(pos + 1));

    emit receivebinSignal(key, value);
}


void App::receivebox(const Message &message)
{
    emit recRemoteBox(message);
}


void App::updateGlobalValues()
{
    if (!rootObject())
        return;

    rootObject()->setProperty("b_unit", G_APPUNIT_L);
    rootObject()->setProperty("b_space", G_APPUNIT_S);
    rootObject()->setProperty("b_width", parentWidget()->width());
    rootObject()->setProperty("b_height", parentWidget()->height());
    rootObject()->setProperty("b_fontsize", G_APPUNIT_F);
    rootObject()->setProperty("b_fontfamily", parentWidget()->font().family());
    rootObject()->setProperty("b_appname", m_appname);
    rootObject()->setProperty("b_os", productType());
    rootObject()->setProperty("_x_", m_x);
}


void App::applicationStatusChanged(Qt::ApplicationState state)
{
#if defined OS_IOS || defined OS_ANDROID
    if (state == Qt::ApplicationActive) {
        if (rootObject()->metaObject()->indexOfMethod("b_active()") > -1)
            QMetaObject::invokeMethod(rootObject(), "b_active");

    } else if (state == Qt::ApplicationSuspended) {
        if (rootObject()->metaObject()->indexOfMethod("b_inactive()") > -1)
            QMetaObject::invokeMethod(rootObject(), "b_inactive");
    }
#else
    Q_UNUSED(state)
#endif
}


void App::audioSlave(const int samplerate, QByteArrayView data)
{
    if (m_slaves.isEmpty())
        return;

    qsizetype size = data.size();
    QByteArray out;

    out.append(reinterpret_cast<const char *>(&samplerate), sizeof(int));
    out.append(reinterpret_cast<const char *>(&size), sizeof(int));
    out.append(data);

    for (QList<QLocalSocket *>::Iterator e = m_slaves.begin(); e != m_slaves.end(); ) {
        if ((*e)->state() == QLocalSocket::ConnectedState) {
            (*e)->write(out);
            ++e;
        } else {
            (*e)->deleteLater();
            e = m_slaves.erase(e);
        }
    }
}


void App::QMLObjectSizeChanged()
{
    if (rootObject()) {
        setFixedSize(rootObject()->size().toSize());
        emit resized();
    }
}


QByteArray App::wrapQml(const QByteArray &data)
{
    QByteArray ldata = data;
    ldata.replace("\r\n", "\n");

    qsizetype pos = ldata.indexOf('{');
    if (pos < 0)
        return QByteArray();

    QByteArray d = ldata.first(pos + 1) + '\n';

    d += "property real b_unit\n";
    d += "property real b_space\n";
    d += "property real b_width\n";
    d += "property real b_height\n";
    d += "property real b_fontsize\n";
    d += "property string b_fontfamily\n";
    d += "property string b_appname\n";
    d += "property string b_os\n";
    d += "property string _x_: ''\n";
    d += "function b_getbox(p) {return _this_.getBox(p);}\n";
    d += "function b_send(k, v) {return _this_.send(k, String(v));}\n";
    d += "function b_sendbin(k, v) {return _this_.sendbin(k, v);}\n";
    d += "function b_setvar(k, v) {_this_.setvar(k, String(v));}\n";
    d += "function b_getvar(k, v) {return _this_.getvar(k, String(v));}\n";
    d += "function b_debug(v) {_this_.debug(v);}\n";
    d += "function b_param(v) {return _this_.param(v);}\n";
    d += "function b_import(m, f) {_this_.import(m, f);}\n";
    d += "function b_translate(t) {return qsTranslate('main', t);}\n";
    d += "function b_theme(t, n, v) {_x_; return _this_.theme(t, n, v) + (v === 'image' ? _x_ : '');}\n";
    d += "function b_conn() {return _this_.conn();}\n";
    d += "function b_mouse(v) {_mouse_.cursorShape = v;}\n";
    d += "function _start_(p) {\n";
    d += "if (typeof b_receive === 'function') _this_.receiveSignal.connect(b_receive);\n";
    d += "if (typeof b_receivebin === 'function') _this_.receivebinSignal.connect(b_receivebin);\n";
    d += "if (typeof b_hotplug === 'function') _this_.hotPlug.connect(b_hotplug);\n";
    d += "b_start(p);\n";
    d += "}\n";
    d += "width: b_width\n";
    d += "height: b_height\n";
    d += "MouseArea {id:_mouse_;anchors.fill:parent;acceptedButtons: Qt.NoButton;z:99}\n";

    d += ldata.sliced(pos + 1);

    return d;
}
