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


TButton {
    property bool playing: false
    property bool up: true

    id: control
    background: Rectangle {
        id: border
        anchors.fill: parent
        anchors.topMargin: b_space * tm
        anchors.bottomMargin: b_space * bm
        anchors.leftMargin: b_space * lm
        anchors.rightMargin: b_space * rm
        color: kc
        border.color: bc
        border.width: bw === 0 ? 0 : Math.max(1, b_space * bw)
        radius: b_space * br
    }
    contentItem: Loader {
        anchors.fill: parent
        anchors.topMargin: b_space * tp
        anchors.bottomMargin: b_space * bp
        anchors.leftMargin: b_space * lp
        anchors.rightMargin: b_space * rp
        sourceComponent: playing ? animated : static
    }
    Component {
        id: static
        Image {
            source: is
            rotation: up ? 180 : 0
        }
    }
    Component {
        id: animated
        AnimatedImage {
            source: is
            rotation: up ? 180 : 0
        }
    }
}
