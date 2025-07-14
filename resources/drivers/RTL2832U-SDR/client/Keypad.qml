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
    property int w: (availableWidth - 3 * b_space) / 4

    id: keypad
    clip: true
    signal key(var key)
    TRow {
        spacing: b_space
        TColumn {
            spacing: b_space
            TRow {
                spacing: b_space
                TButton {
                    id: keypad_7
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "7"
                    onClicked: key(Qt.Key_7)
                }
                TButton {
                    id: keypad_8
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "8"
                    onClicked: key(Qt.Key_8)
                }
                TButton {
                    id: keypad_9
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "9"
                    onClicked: key(Qt.Key_9)
                }
            }
            TRow {
                spacing: b_space
                TButton {
                    id: keypad_4
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "4"
                    onClicked: key(Qt.Key_4)
                }
                TButton {
                    id: keypad_5
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "5"
                    onClicked: key(Qt.Key_5)
                }
                TButton {
                    id: keypad_6
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "6"
                    onClicked: key(Qt.Key_6)
                }
            }
            TRow {
                spacing: b_space
                TButton {
                    id: keypad_1
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "1"
                    onClicked: key(Qt.Key_1)
                }
                TButton {
                    id: keypad_2
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "2"
                    onClicked: key(Qt.Key_2)
                }
                TButton {
                    id: keypad_3
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "3"
                    onClicked: key(Qt.Key_3)
                }
            }
            TRow {
                spacing: b_space
                TButton {
                    id: keypad_0
                    height: w
                    width: 2.1 * w
                    text: keypad.height === 0 ? "" : "0"
                    onClicked: key(Qt.Key_0)
                }
                TButton {
                    id: keypad_dot
                    height: w
                    width: w
                    text: keypad.height === 0 ? "" : "."
                    onClicked: key(Qt.Key_Period)
                }
            }
        }
        TColumn {
            spacing: b_space
            TButton {
                id: keypad_esc
                height: w
                width: w
                font.pixelSize: 0.3 * height
                text: keypad.height === 0 ? "" : "ESC"
                onClicked: key(Qt.Key_Escape)
            }
            TButton {
                id: keypad_back
                name: keypad.name + ".back"
                height: w
                width: w
                onClicked: key(Qt.Key_Backspace)
            }
            TButton {
                id: keypad_enter
                name: keypad.name + ".enter"
                height: 2.1 * w
                width: w
                onClicked: key(Qt.Key_Enter)
            }
        }
    }
}
