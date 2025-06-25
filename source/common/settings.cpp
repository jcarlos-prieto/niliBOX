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
#include "common/settings.h"
#include <QDir>
#include <QSaveFile>
#include <QSettings>
#include <QTimer>


Settings::Settings() : QMap<QString, QString>()
{
    QSettings::setDefaultFormat(QSettings::IniFormat);
    m_localfilename.clear();
}


Settings::~Settings()
{

}


void Settings::clear()
{
    QMap::clear();
    save();
}


void Settings::clear(const QString &rootkey)
{
    QList<QString> ks = keys();

    for (QString &k : ks)
        if (k.contains(rootkey))
            remove(k);

    save();
}


QString Settings::escape(const QString &name)
{
    QString lname = name;

    return lname.replace(".", "%dot%").replace("=", "%equ%").replace("\n", "%cr%");
}


Settings Settings::extractSettings(const QString &rootkey) const
{
    Settings s;
    QList<QString> ks = keys();
    QString key;

    for (QString &k : ks)
        if (k.startsWith(rootkey)) {
            key = k;
            key.replace(rootkey + ".", "");
            s.insert(key, value(k));
        }

    return s;
}


QString Settings::get(const QString &key, const QString &def) const
{
    return value(key, def);
}


Settings Settings::getSettings(const QString &rootkey) const
{
    Settings s;
    QList<QString> ks = keys();

    for (QString &k : ks)
        if (k.startsWith(rootkey))
            s.insert(k, value(k));

    return s;
}


QString Settings::getString() const
{
    QString s;
    QList<QString> ks = keys();

    for (QString &k : ks)
        s.append(k).append('=').append(value(k)).append('\n');

    if (s.size() > 0)
        s.remove(s.size() - 1, 1);

    return s;
}


QString Settings::getString(const QString &rootkey) const
{
    QString s;
    QList<QString> ks = keys();

    for (QString &k : ks)
        if (k.startsWith(rootkey))
            s.append(k).append('=').append(value(k)).append('\n');

    if (s.size() > 0)
        s.remove(s.size() - 1, 1);

    return s;
}


QVariant Settings::getVariant() const
{
    QMap<QString, QVariant> vmap;
    QList<QString> ks = keys();

    for (QString &k : ks)
        vmap.insert(k, QVariant(value(k)));

    return QVariant::fromValue(vmap);
}


QVariant Settings::getVariant(const QString &rootkey) const
{
    QMap<QString, QVariant> vmap;
    QList<QString> ks = keys();

    for (QString &k : ks)
        if (k.startsWith(rootkey))
            vmap.insert(k, QVariant(value(k)));

    return QVariant::fromValue(vmap);
}


QString Settings::listToString(const QList<QString> list)
{
    QString string;

    for (const QString &item : list)
        string += item + '\n';

    if (string.size() > 0)
        string = string.first(string.size() - 1);

    return string;
}


QString Settings::listToString(const QList<int> list)
{
    QString string;

    for (const int item : list)
        string += QString::number(item) + '\n';

    if (string.size() > 0)
        string = string.first(string.size() - 1);

    return string;
}


void Settings::init(const QString &key, const QString &value)
{
    if (!contains(key))
        insert(key, value);

    save();
}


void Settings::loadFile(const QString &filename)
{
    QFile file(filename);

    if (file.open(QFile::ReadOnly | QFile::Text)) {
        loadString(file.readAll());
        file.close();
    }
}


void Settings::loadSettings(const Settings &settings, const QString &prefix)
{
    QList<QString> ks = settings.keys();

    for (QString &k : ks)
        if (prefix.isEmpty())
            insert(k, settings.value(k));
        else
            insert(prefix + "." + k, settings.value(k));

    save();
}


QString Settings::localFilePath() const
{
    QSettings tempsettings;

    if (G_HOME.isEmpty())
        return QFileInfo(tempsettings.fileName()).absolutePath() + "/" + qApp->applicationName();
    else
        return G_HOME;
}


void Settings::loadString(const QString &string)
{
    if (string.isEmpty())
        return;

    QString lstring = string;

    lstring.replace("\r\n", "\n").replace("\xEF\xBB\xBF", "");

    QList<QString> list = lstring.split('\n');
    QString line;

    for (QString &item : list) {
        line = item.trimmed();
        if (line.startsWith("#"))
            continue;

        qsizetype pos = line.indexOf('=');
        if (pos == -1)
            continue;

        QString key = line.first(pos).trimmed();
        QString value = line.sliced(pos + 1);
        insert(key, value);
    }

    save();
}


void Settings::remove(const QString &key)
{
    QMap::remove(key);
    save();
}


QList<QString> Settings::rootkeys() const
{
    QList<QString> ret;
    QList<QString> ks = keys();
    qsizetype pos;

    for (QString &k : ks) {
        pos = k.indexOf('.');
        if (pos > -1)
            k = k.first(pos);
        if (!ret.contains(k))
            ret.append(k);
    }

    std::sort(ret.begin(), ret.end());

    return ret;
}


QList<QString> Settings::rootkeys(const QString &rootkey) const
{
    qsizetype rootlen = rootkey.size() + 1;
    QList<QString> ret;
    QList<QString> ks = keys();
    qsizetype pos;

    for (QString &k : ks)
        if (k.startsWith(rootkey + '.')) {
            k = k.sliced(rootlen);
            pos = k.indexOf('.');
            if (pos > -1)
                k = k.first(pos);
            if (!ret.contains(k))
                ret.append(k);
        }

    std::sort(ret.begin(), ret.end());

    return ret;
}


void Settings::set(const QString &key, const QString &value)
{
    insert(key, value);
    save();
}


void Settings::setLocalFile(const QString &localfile)
{
    Settings();

    m_localfilename = localFilePath() + "/" + localfile;
    loadFile(m_localfilename);
}


QList<int> Settings::stringToListInt(const QString &string)
{
    QList<QString> slist = string.split('\n');
    QList<int> list;

    for (QString &s : slist)
        list << s.toInt();

    return list;
}


QList<QString> Settings::stringToListString(const QString &string)
{
    return string.split('\n');
}


QString Settings::unescape(const QString &name)
{
    QString lname = name;

    return lname.replace("%equ%", "=").replace("%dot%", ".").replace("%cr%", "\n");
}


void Settings::save()
{
    if (m_localfilename.isEmpty())
        return;

    if (!QDir(localFilePath()).exists())
        QDir(localFilePath()).mkpath(localFilePath());

    QSaveFile file(m_localfilename);

    if (file.open(QFile::WriteOnly | QFile::Text)) {
        file.write(getString().toUtf8());
        file.commit();
    }
}
