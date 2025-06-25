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

// RELAY - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property int number
    property var names


    TGrid {
        id: gbuttons
        columns: 4
        Repeater {
            id: grid
            model: number
            TButton {
                id: control
                checkable: true
                width: 4 * b_unit - gbuttons.spacing
                height: width;
                font.pixelSize: 0.5 * b_unit
                text: names ? names[index] : ""
                clip: true
                onReleased: {
                    if (checked)
                        b_send("seton", index + 1);
                    else
                        b_send("setoff", index + 1);
                }
            }
        }
    }


    function b_start(params)
    {
        b_send("number");
    }


    function b_receive(key, value)
    {
        if (key === "number") {
            number = value;
            b_send("names");
            for (let i = 1; i <= number; i++)
                b_send("getstatus", i);

        } else if (key === "names") {
            names = value.split(";");

        } else if (key === "status") {
            let vals = value.split(";");
            if (vals[1] === "on")
                grid.itemAt(vals[0] - 1).checked = true;
            else if (vals[1] === "off")
                grid.itemAt(vals[0] - 1).checked = false;
        }
    }
}
