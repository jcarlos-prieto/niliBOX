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

DRIVERS="DIGIMODES DRIVERTEST ICOM_IC-PCR100 ICOM_IC-PCR1000 ICOM_IC-PCR1500 PLAYAUDIO RELAY REMOTEAUDIO RTL2832U-SDR SDRPLAY-RSP1A WEBCAM"
LANGS="es fr nl it de"

# LOCALIZATION FOR MAIN APPLICATION
for lang in $LANGS; do
    echo ".. $lang"
    "$QTDIR/bin/lupdate" -no-obsolete -locations none -target-language "$lang" .. -ts "languages/_TS/$lang.ts" >/dev/null 2>&1
done

# LOCALIZATION FOR STANDARD DRIVERS
for driver in $DRIVERS; do
    for lang in $LANGS; do
        echo "drivers/$driver/client $lang"
        for f in drivers/$driver/client/*.qml; do
            [ -f "$f" ] && sed -i 's/b_translate/qsTr/g' "$f"
        done
        "$QTDIR/bin/lupdate" "drivers/$driver/client" -no-obsolete -locations none -target-language "$lang" -ts "languages/_TS/${driver}_client_${lang}.ts" >/dev/null 2>&1
        for f in drivers/$driver/client/*.qml; do
            [ -f "$f" ] && sed -i 's/qsTr/b_translate/g' "$f"
        done
        echo "drivers/$driver/config $lang"
        for f in drivers/$driver/config/*.qml; do
            [ -f "$f" ] && sed -i 's/b_translate/qsTr/g' "$f"
        done
        "$QTDIR/bin/lupdate" "drivers/$driver/config" -no-obsolete -locations none -target-language "$lang" -ts "languages/_TS/${driver}_config_${lang}.ts" >/dev/null 2>&1
        for f in drivers/$driver/config/*.qml; do
            [ -f "$f" ] && sed -i 's/qsTr/b_translate/g' "$f"
        done
    done
done
