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

#if !defined SITEINFO_H
#define SITEINFO_H

#include "common/address.h"
#include "common/settings.h"


class SiteInfo
{

public:
    explicit SiteInfo();
    virtual ~SiteInfo();

    Address  address() const;
    Settings config() const;
    Settings devices() const;
    Settings drivers() const;
    bool     isNull() const;
    qint64   lastseen() const;
    void     setAddress(const Address &address);
    void     setConfig(const Settings &info);
    void     setDevices(const Settings &devices);
    void     setDrivers(const Settings &drivers);
    void     setLastSeen(const qint64 datetime);

private:
    Address  m_address;
    Settings m_config;
    Settings m_devices;
    Settings m_drivers;
    qint64   m_lastseen;
};

#endif // SITEINFO_H
