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


GroupBox {
    id: control

    property string name
    property real   tm: b_theme("TFrame" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TFrame" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TFrame" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TFrame" + status(), name + status(), "margin-right")
    property real   tp: b_theme("TFrame" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TFrame" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TFrame" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TFrame" + status(), name + status(), "padding-right")
    property real   bw: b_theme("TFrame" + status(), name + status(), "border-width")
    property real   br: b_theme("TFrame" + status(), name + status(), "radius")
    property color  kc: b_theme("TFrame" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TFrame" + status(), name + status(), "border-color")

    topPadding: b_space * (tp + tm)
    bottomPadding: b_space * (bp + bm)
    leftPadding: b_space * (lp + lm)
    rightPadding: b_space * (rp + rm)

    background: Rectangle {
        anchors.fill: parent
        anchors.topMargin: b_space * tm
        anchors.bottomMargin: b_space * bm
        anchors.leftMargin: b_space * lm
        anchors.rightMargin: b_space * rm
        color: kc
        border.color: bc
        border.width: bw == 0 ? 0 : Math.max(1, b_space * bw)
        radius: b_space * br
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
