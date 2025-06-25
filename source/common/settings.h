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

#if !defined SETTINGS_H
#define SETTINGS_H

#include <QMap>
#include <QObject>


class Settings : public QMap<QString, QString>
{

public:
    explicit                Settings();
    virtual                ~Settings();

    void                    clear();
    void                    clear(const QString &rootkey);
    static QString          escape(const QString &name);
    Settings                extractSettings(const QString &rootkey) const;
    QString                 get(const QString &key, const QString &def = QString()) const;
    Settings                getSettings(const QString &rootkey) const;
    QString                 getString() const;
    QString                 getString(const QString &rootkey) const;
    QVariant                getVariant() const;
    QVariant                getVariant(const QString &rootkey) const;
    void                    init(const QString &key, const QString &value);
    static QString          listToString(const QList<QString> list);
    static QString          listToString(const QList<int> list);
    void                    loadFile(const QString &filename);
    void                    loadSettings(const Settings &settings, const QString &prefix = "");
    void                    loadString(const QString &string);
    QString                 localFilePath() const;
    void                    remove(const QString &key);
    QList<QString>          rootkeys() const;
    QList<QString>          rootkeys(const QString &rootkey) const;
    void                    set(const QString &key, const QString &value);
    void                    setLocalFile(const QString &localfile);
    static QList<int>       stringToListInt(const QString &string);
    static QList<QString>   stringToListString(const QString &string);
    static QString          unescape(const QString &name);

private:
    void                    save();

    QString                 m_localfilename;
};

Q_DECLARE_METATYPE(Settings)

#endif // SETTINGS_H
