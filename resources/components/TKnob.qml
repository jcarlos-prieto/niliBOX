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
    id: control

    property string name
    property real   tm: b_theme("TButton" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TButton" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TButton" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TButton" + status(), name + status(), "margin-right")
    property real   bw: b_theme("TButton" + status(), name + status(), "border-width")
    property color  kc: b_theme("TButton" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TButton" + status(), name + status(), "border-color")
    property color  tc: b_theme("TButton" + status(), name + status(), "text-color")
    property string is: b_theme("TComboBox.arrow" + status(), name + status(), "image")

    property string text: ""
    property real   textsize: -1
    property real   max: 1
    property real   min: 0
    property real   step: 0.1
    property real   anglestep: 20
    property bool   rounddial: false
    property real   angle: 0
    property real   value: min
    property bool   pressed: mousearea.pressed
    property bool   hovered: false
    property real   initangle
    property real   angle0
    property real   angle1
    property real   position0
    property real   position1
    property real   value1
    property bool   fast: false
    property real   diffvalue: 0
    property string tooltiptext
    property int    tooltipdelay: b_param("ui.tooltipdelay");
    property int    tooltiptimeout: b_param("ui.tooltiptimeout");

    signal clicked

    Rectangle {
        id: dial
        anchors.fill: parent
        anchors.topMargin: b_space * tm
        anchors.bottomMargin: b_space * bm
        anchors.leftMargin: b_space * lm
        anchors.rightMargin: b_space * rm
        color: kc
        border.color: bc
        border.width: bw == 0 ? 0 : Math.max(1, b_space * bw)
        radius: Math.min(height, width) / 2
    }

    Row {
        padding: 0
        spacing: dial.width / 40
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        visible: fast
        Image {
            id: arrow1
            width: dial.width / 8
            height: width
            mipmap: true
            cache: false
            source: is
            rotation: 180
            transformOrigin: Item.Center
        }
        Image {
            id: arrow2
            width: dial.width / 8
            height: width
            mipmap: true
            cache: false
            source: is
        }
    }
    Text {
        text: parent.text
        font.family: b_fontfamily
        font.pixelSize: parent.textsize == -1 ? 0.3 * dial.height : parent.textsize
        color: tc
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        renderType: Text.NativeRendering
    }
    MouseArea {
        id: mousearea
        anchors.fill: parent
        hoverEnabled: true
        onClicked: control.clicked();

        onDoubleClicked: {
            fast = !fast;
            if (!fast)
                timer.stop();
        }
        onPressed: {
            if (fast) {
                position0 = mouseX;
                position1 = position0;
                value1 = value;
                timer.start();
            } else {
                initangle = angle;
                angle0 = 180 / Math.PI * Math.atan2(mouseX - width / 2, mouseY - height / 2);
            }
        }
        onReleased: {
            if (fast)
                timer.stop();
        }
        onPositionChanged: {
            if (!pressed)
                return;
            if (fast)
                position1 = mouseX;
            else {
                var angle1 = 180 / Math.PI * Math.atan2(mouseX - width / 2, mouseY - height / 2);
                var diffangle = angle0 - angle1;
                if (Math.abs(diffangle) > 180) {
                    if (diffangle > 0)
                        diffangle -= 360;
                    else
                        diffangle += 360;
                }
                if (Math.abs(diffangle) > anglestep) {
                    var sign = diffangle > 0 ? 1 : -1;
                    var diffvalue = sign * step;
                    if (value + diffvalue < min)
                        value = min;
                    else if (value + diffvalue > max)
                        value = max;
                    else {
                        value += diffvalue;
                        angle += sign * anglestep;
                        angle0 = angle1 + diffangle - sign * anglestep;
                    }
                }
            }
        }
        onWheel: (wheel)=> {
                    var sign = - Math.sign(wheel.angleDelta.y);
                    var diffvalue = sign * step;
                    if (value + diffvalue < min)
                        value = min;
                    else if (value + diffvalue > max)
                        value = max;
                    else {
                        value += diffvalue;
                        angle += sign * anglestep;
                        angle0 += sign * anglestep;
                    }
                }
        onEntered: control.hovered = true
        onExited: control.hovered = false
    }
    Loader {
        sourceComponent: rounddial ? round : rect
        transform: Rotation {
            angle: control.angle
            origin.x: width / 2
            origin.y: height / 2
        }
    }
    Component {
        id: rect
        Rectangle {
            color: bc
            width: dial.width / 10
            height: dial.height / 3
            x: b_space * lm + (dial.width - width) / 2
            y: b_space * tm + dial.height - height
            antialiasing: true
        }
    }
    Component {
        id: round
        Rectangle {
            color: bc
            width: dial.width / 5
            height: width
            radius: dial.width / 10
            x: b_space * lm + (dial.width - width) / 2
            y: b_space * tm + dial.height - 1.5 * height
        }
    }
    Timer {
        id: timer
        interval: 50
        repeat: true
        running: false
        onTriggered: {
            diffvalue += (position1 - position0) / 50;
            var idiff = Math.trunc(diffvalue);
            if (idiff !== 0) {
                diffvalue = 0;
                if (value + step * idiff > max)
                    value = max;
                else if (value + step * idiff < min)
                    value = min;
                else {
                    value += step * idiff;
                    angle += anglestep * idiff;
                }
            }
        }
    }

    Timer {
        id: timertt
        repeat: false
        onTriggered: {
            if (interval === tooltipdelay) {
                var globalpos = mapToItem(null, mouse.mouseX, mouse.mouseY);
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
        id: mouse
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.NoButton
        onEntered: {
            control.hovered = true;
            if (control.tooltiptext.length === 0)
                return;

            timertt.interval = tooltipdelay;
            timertt.start();
        }
        onExited: {
            control.hovered = false;
            timertt.stop();
            tooltip.visible = false;
        }
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
