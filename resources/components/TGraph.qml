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
import niliBOX.Graph


Graph {
    property string name
    property string bc: b_theme("TGraph", name, "background-color")
    property string sc: b_theme("TGraph", name, "signalcolor")
    property string sf1: b_theme("TGraph", name, "signalfillcolor1")
    property string sf2: b_theme("TGraph", name, "signalfillcolor2")
    property string sf3: b_theme("TGraph", name, "signalfillcolor3")

    signalcolor: sc == "transparent" ? "#F0F0F0" : sc
    backgroundcolor: bc == "transparent" ? "#202040" : bc
    signalfillcolor1: sf1 == "transparent" ? "#F00000" : sf1
    signalfillcolor2: sf2 == "transparent" ? "#00F000" : sf2
    signalfillcolor3: sf3 == "transparent" ? "#0000F0" : sf3
}
