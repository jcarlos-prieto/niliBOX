#!/bin/bash

# Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses>.

QTDIR="$HOME/Qt/6.7.3/gcc_64"

DRIVERS=(DIGIMODES DRIVERTEST ICOM_IC-PCR100 ICOM_IC-PCR1000 ICOM_IC-PCR1500 PLAYAUDIO RELAY REMOTEAUDIO RTL2832U-SDR SDRPLAY-RSP1A WEBCAM)
LANGS=(en es fr nl it de)
THEMES=(steel ocean colors dark)

find . -type f -name "*.rcc" -exec rm -f {} +

# COMPILE LOCALIZATION FOR MAIN APPLICATION
for lang in "${LANGS[@]}"; do
    echo "languages/$lang/trans.qm"
    "$QTDIR/bin/lrelease" "languages/_TS/$lang.ts" -qm "languages/$lang/trans.qm" >/dev/null 2>&1
done

# COMPILE LANGUAGE RESOURCE FILES FOR MAIN APPLICATION
for lang in "${LANGS[@]}"; do
    echo "languages/$lang.rcc"
    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "languages/$lang/collection.qrc" --output "languages/$lang.rcc" >/dev/null 2>&1
done

# COMPILE THEME RESOURCE FILES FOR MAIN APLICATION
for theme in "${THEMES[@]}"; do
    echo "themes/$theme.rcc"
    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "themes/$theme/collection.qrc" --output "themes/$theme.rcc" >/dev/null 2>&1
done

for driver in "${DRIVERS[@]}"; do
    # COMPILE LOCALIZATION FOR STANDARD DRIVERS
    for lang in "${LANGS[@]}"; do
        echo "drivers/$driver/client/languages/$lang/trans.qm"
        "$QTDIR/bin/lrelease" "languages/_TS/${driver}_client_${lang}.ts" -qm "drivers/$driver/client/languages/$lang/trans.qm" >/dev/null 2>&1

        echo "drivers/$driver/config/languages/$lang/trans.qm"
        "$QTDIR/bin/lrelease" "languages/_TS/${driver}_config_${lang}.ts" -qm "drivers/$driver/config/languages/$lang/trans.qm" >/dev/null 2>&1
    done

    # COMPILE DRIVER RESOURCE FILES FOR STANDARD DRIVERS
    echo "drivers/$driver/config.rcc"
    echo "drivers/$driver/client.rcc"
    echo "drivers/$driver/server.rcc"
    echo "drivers/$driver.rcc"

    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "drivers/$driver/config/collection.qrc" --output "drivers/$driver/config.rcc" >/dev/null 2>&1
    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "drivers/$driver/client/collection.qrc" --output "drivers/$driver/client.rcc" >/dev/null 2>&1
    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "drivers/$driver/server/collection.qrc" --output "drivers/$driver/server.rcc" >/dev/null 2>&1
    "$QTDIR/libexec/rcc" --binary --compress 9 --compress-algo zlib "drivers/$driver/collection.qrc" --output "drivers/$driver.rcc" >/dev/null 2>&1
done

DATE=$(date +"%Y.%m.%d")
for f in *.set; do
    sed -i "s/^\(.*\.version=\).*/\1$DATE/" "$f"
done

curl -s -o usb.ids http://www.linux-usb.org/usb.ids
