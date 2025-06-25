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

#include "common/siteinfo.h"


SiteInfo::SiteInfo()
{
    m_lastseen = 0;
}


SiteInfo::~SiteInfo()
{

}


Address SiteInfo::address() const
{
    return m_address;
}


Settings SiteInfo::config() const
{
    return m_config;
}


Settings SiteInfo::devices() const
{
    return m_devices;
}


Settings SiteInfo::drivers() const
{
    return m_drivers;
}


bool SiteInfo::isNull() const
{
    return m_lastseen == 0;
}


qint64 SiteInfo::lastseen() const
{
    return m_lastseen;
}


void SiteInfo::setAddress(const Address &address)
{
    m_address = address;
}


void SiteInfo::setConfig(const Settings &info)
{
    m_config.clear();
    m_config.loadSettings(info);
}


void SiteInfo::setDevices(const Settings &devices)
{
    m_devices.clear();
    m_devices.loadSettings(devices);
}


void SiteInfo::setDrivers(const Settings &drivers)
{
    m_drivers.clear();
    m_drivers.loadSettings(drivers);
}


void SiteInfo::setLastSeen(const qint64 datetime)
{
    m_lastseen = datetime;
}
