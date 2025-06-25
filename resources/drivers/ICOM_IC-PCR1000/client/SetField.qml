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
    property string text: ""
    property string thirdbutton: ""
    signal setText
    signal deleteText
    signal thirdButton

    id: setfield
    clip: true
    TRow {
        id: fieldrow
        TLineEdit {
            id: fSet
            width: setfield.availableWidth - 2 * setfield.availableHeight - 2 * fieldrow.spacing - (thirdbutton.length === 0 ? 0 : 2 * b_unit + fieldrow.spacing)
            height: setfield.availableHeight
            text: setfield.text
            onActiveFocusChanged: cursorPosition = 0;
        }
        TButton {
            id: bSet
            name: setfield.name + ".enter"
            height: setfield.availableHeight
            width: height
            onClicked: {
                setfield.text = fSet.text;
                setText();
            }
        }
        TButton {
            id: bDel
            name: setfield.name + ".delete"
            height: setfield.availableHeight
            width: height
            onClicked: {
                setfield.text = "";
                deleteText();
            }
        }
        TButton {
            id: bThird
            height: setfield.availableHeight
            width: thirdbutton.length === 0 ? 0 : 2 * b_unit
            font.pixelSize: 0.3 * height
            text: setfield.height > b_unit / 2 ? thirdbutton : ""
            onClicked: thirdButton()
        }
    }
}						
