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


Row {
    id: control

    property string name
    property real   tm: b_theme("TPane" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TPane" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TPane" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TPane" + status(), name + status(), "margin-right")
    property real   tp: b_theme("TPane" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TPane" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TPane" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TPane" + status(), name + status(), "padding-right")
    property real   sp: b_theme("TPane" + status(), name + status(), "spacing")

    topPadding: b_space * (tp + tm)
    bottomPadding: b_space * (bp + bm)
    leftPadding: b_space * (lp + lm)
    rightPadding: b_space * (rp + rm)
    spacing: b_space * sp

    function status()
    {
        let s =
            (control.enabled ? ":enabled" : ":!enabled") +
            (control.hovered ? ":hover" : ":!hover") +
            (control.pressed ? ":pressed" : ":!pressed");
        return s;
    }
}
