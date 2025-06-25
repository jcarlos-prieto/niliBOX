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


Slider {
    id: control

    property string name
    property real   tm: b_theme("TButton" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TButton" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TButton" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TButton" + status(), name + status(), "margin-right")
    property real   br: b_theme("TButton" + status(), name + status(), "radius")
    property color  kc: b_theme("TButton" + ":enabled:hover:pressed", name + ":enabled:hover:pressed", "foreground-color")
    property color  bc: b_theme("TButton" + status(), name + status(), "border-color")
    property color  bc1: b_theme("TButton" + ":enabled:!hover:!pressed", name + ":enabled:!hover:!pressed", "border-color")
    property color  bc2: b_theme("TButton" + ":enabled:hover:!pressed", name + ":enabled:hover:!pressed", "border-color")

    topPadding: b_space * tm
    bottomPadding: b_space * bm
    leftPadding: b_space * lm
    rightPadding: b_space * rm
    focusPolicy: Qt.NoFocus

    background: Rectangle {
        width: control.width - 2 * b_space
        height: control.availableHeight / 4
        x: b_space
        y: control.topPadding + control.availableHeight / 2 - height / 2
        radius: b_space * br / 4
        color: bc1

        Rectangle {
            width: control.visualPosition * parent.width
            height: parent.height
            radius: b_space * br / 4
            color: bc2
        }
    }

    handle: Rectangle {
        implicitWidth: control.height / 1.5
        implicitHeight: implicitWidth
        x: control.leftPadding + control.visualPosition * (control.availableWidth - width)
        y: control.topPadding + control.availableHeight / 2 - height / 2
        radius: b_space * br / 1.5
        color: kc
        border.color: bc
    }

    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.NoButton
        hoverEnabled: true
        onEntered: b_mouse(Qt.PointingHandCursor)
        onExited: b_mouse(Qt.ArrowCursor)
    }

    function status()
    {
        let s =
            (control.enabled ? ":enabled" : ":!enabled") +
            (control.hovered ? ":hover" : ":!hover") +
            (control.pressed ? ":pressed" : ":!pressed");
        return s;
    }
}
