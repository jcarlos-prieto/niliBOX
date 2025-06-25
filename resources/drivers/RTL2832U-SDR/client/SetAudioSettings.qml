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

import QtQuick
import QtQuick.Controls
import niliBOX.Controls


TGroupBox {
    property var srates: [8000, 11025, 16000, 22050, 32000, 44100, 48000]
    property int srate: -1
    property int sbits: -1
    property int cbits: -1
    property int ogain: -1
    property bool gain: true
    onSrateChanged: _srate();
    onSbitsChanged: _sbits();
    onCbitsChanged: _cbits();
    onOgainChanged: _ogain();

    id: set
    clip: true
    TRow {
        id: fieldrow
        TColumn {
            spacing: b_space
            TLabel {
                width: 2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("FREQ.")
            }
            TKnob {
                id: kSrate
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: 0
                max: 6
                step: 1
                anglestep: 50
                value: -1
                onPressedChanged: scroll = !pressed;
                onValueChanged: srate = srates[value];
            }
            TLabel {
                width: 2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                visible: gain
                text: b_translate("GAIN")
            }
            TKnob {
                id: kGain
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: 0
                max: 100
                step: 5
                anglestep: 17
                value: -1
                visible: gain
                onPressedChanged: scroll = !pressed;
                onValueChanged: ogain = value;
            }
        }
        TColumn {
            TLabel {
                width: 1.5 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("BITS")
            }
            TButton {
                id: b32
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "32 bit"
                onClicked: sbits = 32;
            }
            TButton {
                id: b16
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "16 bit"
                onClicked: sbits = 16;
            }
            TButton {
                id: b8
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "8 bit"
                onClicked: sbits = 8;
            }
        }
        TColumn {
            TLabel {
                width: 1.5 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("COMP.")
            }
            TButton {
                id: c0
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "---"
                onClicked: cbits = 0;
            }
            TButton {
                id: c16
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "16 bit"
                onClicked: cbits = 16;
            }
            TButton {
                id: c8
                width: 1.5 * b_unit
                height: 0.7 * b_unit
                text: "8 bit"
                onClicked: cbits = 8;
            }
        }
    }


    function _srate()
    {
        kSrate.text = parseInt(srate / 1000) + "kHz";

        if (kSrate.value === -1) {
            kSrate.value = srates.indexOf(srate);
            kSrate.angle = 20 + (kSrate.value - kSrate.min) / kSrate.step * kSrate.anglestep;
        }

        b_setvar("srate", srate);
    }


    function _sbits()
    {
        b32.checked = sbits === 32;
        b16.checked = sbits === 16;
        b8.checked = sbits === 8;

        b_setvar("sbits", sbits);
    }


    function _cbits()
    {
        c0.checked = cbits === 0;
        c16.checked = cbits === 16;
        c8.checked = cbits === 8;

        b_setvar("cbits", cbits);
    }
    
    
    function _ogain()
    {
        if (kGain.value === -1) {
            kGain.value = ogain;
            kGain.angle = (kGain.value - kGain.min) / kGain.step * kGain.anglestep;
        }

        b_setvar("ogain", ogain);
    }
}
