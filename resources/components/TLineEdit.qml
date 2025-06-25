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
import niliBOX.IosLineEdit


TextField {
    id: control

    property string name
    property real   tp: b_theme("TLineEdit" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TLineEdit" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TLineEdit" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TLineEdit" + status(), name + status(), "padding-right")
    property real   bw: b_theme("TLineEdit" + status(), name + status(), "border-width")
    property real   br: b_theme("TLineEdit" + status(), name + status(), "radius")
    property color  kc: b_theme("TLineEdit" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TLineEdit" + status(), name + status(), "border-color")
    property color  tc: b_theme("TLineEdit" + status(), name + status(), "text-color")

    topPadding: b_space * tp
    bottomPadding: b_space * bp
    leftPadding: b_space * lp
    rightPadding: b_space * rp
    color: tc
    verticalAlignment: Text.AlignVCenter
    font.family: b_fontfamily
    font.pixelSize: Math.max(b_fontsize / b_unit * control.height, 0.1)
    EnterKey.type: Qt.EnterKeyDone
    onEditingFinished: parent.forceActiveFocus();
    renderType: Text.NativeRendering

    MouseArea {
        anchors.fill: parent
        hoverEnabled: true
        visible: (Qt.platform.os === "ios" || Qt.platform.os === "android") && !parent.activeFocus
        onClicked: {
            control.forceActiveFocus();
            if (Qt.platform.os === "ios")
                backend.init(parent.text);
        }

        IosLineEdit {
            id: backend
            onTextChanged: control.text = text
            onEditingFinished: control.parent.forceActiveFocus()
            onShiftFocus: control.forceActiveFocus()
        }
    }

    background: Rectangle {
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
