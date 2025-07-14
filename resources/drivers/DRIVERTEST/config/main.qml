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

// DRIVERTEST - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls


Item {
    TLabel {
        id: tooltip
        name: "tooltip"
        height: 20
        z: 2
        font.pixelSize: 12
        visible: false
    }
    Flickable {
        width: 16 * b_unit
        height: b_height
        contentHeight: contentItem.childrenRect.height
        clip: true
        interactive: (contentHeight > height)
        TRow {
            TLabel {
                id: img
                name: "applogo"
                width: 3 * b_unit
                height: width
            }
            TLabel {
                height: b_unit
                anchors.verticalCenter: img.verticalCenter
                text: b_translate("Nothing to configure here")
            }
        }
    }


    function b_start(params)
    {

    }
}
