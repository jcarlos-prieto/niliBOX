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


Label {
    id: control

    property string name
    property real   tp: b_theme("TLabel" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TLabel" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TLabel" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TLabel" + status(), name + status(), "padding-right")
    property real   bw: b_theme("TLabel" + status(), name + status(), "border-width")
    property real   br: b_theme("TLabel" + status(), name + status(), "radius")
    property real   ia: b_theme("TLabel" + status(), name + status(), "angle")
    property color  kc: b_theme("TLabel" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TLabel" + status(), name + status(), "border-color")
    property color  tc: b_theme("TLabel" + status(), name + status(), "text-color")
    property string tw: b_theme("TLabel" + status(), name + status(), "text-weight")
    property string is: b_theme("TLabel" + status(), name + status(), "image")
    property bool   pressed: mousearea.pressed

    topPadding: b_space * tp
    bottomPadding: b_space * bp
    leftPadding: b_space * lp
    rightPadding: b_space * rp
    color: tc
    verticalAlignment: Text.AlignVCenter
    font.family: b_fontfamily
    font.pixelSize: Math.max(b_fontsize / b_unit * control.height, 0.1)
    font.weight: tw == "bold" ? Font.Bold : Font.Normal
    renderType: Text.NativeRendering

    background: Rectangle {
        color: kc
        border.color: bc
        border.width: bw == 0 ? 0 : Math.max(1, b_space * bw)
        radius: b_space * br
    }

    MouseArea {
        id: mousearea
        property bool hovered
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.NoButton
        onEntered: hovered = true
        onExited: hovered = false
        onPositionChanged: b_mouse(control.linkAt(mouse.x, mouse.y) ? Qt.PointingHandCursor : Qt.ArrowCursor);
    }

    Image {
        anchors.fill: parent
        mipmap: true
        cache: false
        source: is
        rotation: ia
        transformOrigin: Item.Center
    }

    function status()
    {
        let s =
            (control.enabled ? ":enabled" : ":!enabled") +
            (mousearea.hovered ? ":hover" : ":!hover") +
            (mousearea.pressed ? ":pressed" : ":!pressed");
        return s;
    }
}
