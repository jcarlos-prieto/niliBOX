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


AbstractButton {
    id: control

    property string name
    property real   tm: b_theme("TButton" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TButton" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TButton" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TButton" + status(), name + status(), "margin-right")
    property real   tp: b_theme("TButton" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TButton" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TButton" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TButton" + status(), name + status(), "padding-right")
    property real   bw: b_theme("TButton" + status(), name + status(), "border-width")
    property real   br: b_theme("TButton" + status(), name + status(), "radius")
    property real   ia: b_theme("TButton" + status(), name + status(), "angle")
    property color  kc: b_theme("TButton" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TButton" + status(), name + status(), "border-color")
    property color  tc: b_theme("TButton" + status(), name + status(), "text-color")
    property string tw: b_theme("TButton" + status(), name + status(), "text-weight")
    property string is: b_theme("TButton" + status(), name + status(), "image")

    property string tooltiptext
    property int    tooltipdelay: b_param("ui.tooltipdelay");
    property int    tooltiptimeout: b_param("ui.tooltiptimeout");

    font.family: b_fontfamily
    font.pixelSize: Math.max(b_fontsize / b_unit * control.height, 0.1)
    font.weight: tw == "bold" ? Font.Bold : Font.Normal
    focusPolicy: Qt.NoFocus

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

    contentItem: Text {
        anchors.fill: parent
        anchors.topMargin: b_space * (tp + tm)
        anchors.bottomMargin: b_space * (bp + bm)
        anchors.leftMargin: b_space * (lp + lm)
        anchors.rightMargin: b_space * (rp + rm)
        color: tc
        text: control.text
        font: control.font
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        renderType: Text.NativeRendering

        Image {
            anchors.fill: parent
            anchors.leftMargin: 1
            mipmap: true
            cache: false
            fillMode: Image.PreserveAspectFit
            source: is
            rotation: ia
            transformOrigin: Item.Center
        }
    }

    Timer {
        id: timertt
        repeat: false
        onTriggered: {
            if (interval === tooltipdelay) {
                var globalpos = mapToItem(null, mousett.mouseX, mousett.mouseY);
                tooltip.text = control.tooltiptext
                tooltip.x = globalpos.x + b_space;
                tooltip.y = globalpos.y - b_space - tooltip.height;
                if (tooltip.x + tooltip.width > b_width)
                    tooltip.x = globalpos.x - b_space - tooltip.width;
                if (tooltip.y < 0)
                    tooltip.y = globalpos.y + 32 + b_space;
                tooltip.visible = true;

                interval = control.tooltiptimeout;
                start();
            } else
                tooltip.visible = false;
        }
    }

    MouseArea {
        id: mousett
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.NoButton
        onEntered: {
            b_mouse(Qt.PointingHandCursor);

            if (control.tooltiptext.length === 0 || b_os === "ios" || b_os === "android")
                return;

            timertt.interval = tooltipdelay;
            timertt.start();
        }
        onExited: {
            timertt.stop();
            tooltip.visible = false;
            b_mouse(Qt.ArrowCursor);
        }
    }

    function status()
    {
        let s =
            (control.enabled ? ":enabled" : ":!enabled") +
            (control.hovered ? ":hover" : ":!hover") +
            (control.checked || control.pressed ? ":pressed" : ":!pressed");
        return s;
    }
}
