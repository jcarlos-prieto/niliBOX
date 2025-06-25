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
    property int offset: -1
    property int refer: -1
    property int zoom: -1
    property int fft: -2
    onOffsetChanged: _offset();
    onReferChanged: _refer();
    onZoomChanged: _zoom();
    onFftChanged: _FFT();

    id: setband
    clip: true
    TRow {
        id: fieldrow
        TColumn {
            TLabel {
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("OFFSET")
            }
            TKnob {
                id: kOffset
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: 90
                max: 180
                step: 10
                anglestep: 20
                value: -1
                onPressedChanged: scroll = !pressed;
                onValueChanged: offset = value;
            }
            TLabel {
                id: tOffset
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
        }
        TColumn {
            TLabel {
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("REFER.")
            }
            TKnob {
                id: kRefer
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: 0
                max: 80
                step: 10
                anglestep: 20
                value: -1
                onPressedChanged: scroll = !pressed;
                onValueChanged: refer = value;
            }
            TLabel {
                id: tRefer
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
        }
        TColumn {
            TLabel {
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("ZOOM")
            }
            TKnob {
                id: kZoom
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: 0
                max: 4
                step: 1
                anglestep: 40
                value: -1
                onPressedChanged: scroll = !pressed;
                onValueChanged: zoom = value;
            }
            TLabel {
                id: tZoom
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
        }
        TColumn {
            TLabel {
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                text: b_translate("FFT")
            }
            TKnob {
                id: kFFT
                height: b_unit
                width: height
                anchors.horizontalCenter: parent.horizontalCenter
                min: -1
                max: 7
                step: 1
                anglestep: 40
                value: -2
                onPressedChanged: scroll = !pressed;
                onValueChanged: fft = value;
            }
            TLabel {
                id: tFFT
                width: 1.2 * b_unit
                height: 0.3 * b_unit
                font.pixelSize: height
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }
        }
    }


    function _offset(value)
    {
        tOffset.text = -offset + " dB";
        if (kOffset.value === -1) {
            kOffset.value = offset;
            kOffset.angle = (offset - kOffset.min) / kOffset.step * kOffset.anglestep;
        }
        bandscope.reset();
        b_setvar("offset", offset);
        bandscope.logmin = offset;
        updatedBGrid();
    }


    function _refer(value)
    {
        tRefer.text = -refer + " dB";
        if (kRefer.value === -1) {
            kRefer.value = refer;
            kRefer.angle = (refer - kRefer.min) / kRefer.step * kRefer.anglestep;
        }
        bandscope.reset();
        b_setvar("refer", refer);
        bandscope.logmax = refer;
        updatedBGrid();
    }


    function _zoom(value)
    {
        tZoom.text = "x " + (1 << zoom);
        if (kZoom.value === -1) {
            kZoom.value = zoom;
            kZoom.angle = (zoom - kZoom.min) / kZoom.step * kZoom.anglestep;
        }

        bandscope.reset();
        b_setvar("zoom", zoom);
        b_send("zoom", zoom);
    }


    function _FFT(value)
    {
        if (fft === -1)
            tFFT.text = "AUTO";
        else
            tFFT.text = (1 << fft) + "K";
        if (kFFT.value === -2) {
            kFFT.value = fft;
            kFFT.angle = (fft - kFFT.min) / kFFT.step * kFFT.anglestep;
        }
        bandscope.reset();
        b_setvar("fft", fft);
        b_send("fft", fft);
    }
}
