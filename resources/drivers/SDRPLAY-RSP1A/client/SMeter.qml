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


Item {
    property int count: 26
    property int saturateat: 20
    property int spacing: 2
    property int value: 0
    onValueChanged: update()

    id: smeter
    Row {
        spacing: smeter.spacing
        Repeater {
            id: array
            model: smeter.count
            Rectangle {
                width: (smeter.width - (smeter.count - 1) * smeter.spacing) / smeter.count
                height: smeter.height
                visible: false
                color: (index < smeter.saturateat ? "green" : "#C00000")
            }
        }
    }


    function update()
    {
        for (let i = 0; i < count; i++)
            array.itemAt(i).visible = (i < value);
    }
}
