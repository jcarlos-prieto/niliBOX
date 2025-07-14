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


ComboBox {
    id: control

    property string name
    property real   h
    property real   b: bw == 0 ? 0 : Math.max(1, parseInt(b_space * bw + 0.5))
    property real   tm: b_theme("TComboBox" + status(), name + status(), "margin-top")
    property real   bm: b_theme("TComboBox" + status(), name + status(), "margin-bottom")
    property real   lm: b_theme("TComboBox" + status(), name + status(), "margin-left")
    property real   rm: b_theme("TComboBox" + status(), name + status(), "margin-right")
    property real   tp: b_theme("TComboBox" + status(), name + status(), "padding-top")
    property real   bp: b_theme("TComboBox" + status(), name + status(), "padding-bottom")
    property real   lp: b_theme("TComboBox" + status(), name + status(), "padding-left")
    property real   rp: b_theme("TComboBox" + status(), name + status(), "padding-right")
    property real   bw: b_theme("TComboBox" + status(), name + status(), "border-width")
    property real   br: b_theme("TComboBox" + status(), name + status(), "radius")
    property real   ia: b_theme("TComboBox.arrow" + status(), name + ".arrow" + status(), "angle")
    property color  kc: b_theme("TComboBox" + status(), name + status(), "foreground-color")
    property color  bc: b_theme("TComboBox" + status(), name + status(), "border-color")
    property color  tc: b_theme("TComboBox" + status(), name + status(), "text-color")
    property color  hc: b_theme("TComboBox:active", name + ":active", "foreground-color")
    property color  ikc: b_theme("TComboBox.arrow" + status(), name + ".arrow" + status(), "foreground-color")
    property string is: b_theme("TComboBox.arrow" + status(), name + ".arrow" + status(), "image")

    signal activated

    textRole: "text"
    valueRole: "value"
    font.family: b_fontfamily
    font.pixelSize: Math.max(b_fontsize / b_unit * control.height, 0.1)

    background: Rectangle {
        anchors.fill: parent
        anchors.topMargin: b_space * tm
        anchors.bottomMargin: b_space * bm
        anchors.leftMargin: b_space * lm
        anchors.rightMargin: b_space * rm
        color: control.kc
        border.color: control.bc
        border.width: control.b
        radius: b_space * br
    }

    contentItem: Text {
        anchors.fill: parent
        anchors.topMargin: b_space * (tp + tm)
        anchors.bottomMargin: b_space * (bp + bm)
        anchors.leftMargin: b_space * (lp + lm)
        anchors.rightMargin: is.startsWith("qrc") ? 1.2 * control.height : 0
        text: control.displayText
        font: control.font
        elide: Text.ElideRight
        color: control.tc
        verticalAlignment: Text.AlignVCenter
        renderType: Text.NativeRendering
    }

    indicator: Rectangle {
        height: control.height
        width: control.is.startsWith("qrc") ? 1.2 * height : 0
        x: control.width - width
        color:control. ikc
        border.width: 0
        Image {
            anchors.fill: parent
            anchors.topMargin: b_space * (tp + tm)
            anchors.bottomMargin: b_space * (bp + bm)
            anchors.leftMargin: b_space * (lp + lm)
            anchors.rightMargin: b_space * (rp + rm)
            mipmap: true
            cache: false
            fillMode: Image.PreserveAspectFit
            source: control.is
            rotation: control.ia
            transformOrigin: Item.Center
        }
    }

    popup: Popup {
        id: customPopup
        background: Rectangle {
            color: control.kc
            border.color: control.bc
            border.width: control.b
        }
        contentItem: ListView {
            id: list
            clip: true
            interactive: false
            implicitHeight: contentHeight
            model: control.delegateModel
            currentIndex: control.highlightedIndex
            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onMouseYChanged: list.currentIndex = Math.min(list.count - 1, parseInt(mouseY / control.height));
                onReleased: {
                    control.currentIndex = list.currentIndex;
                    control.activated();
                    customPopup.visible = false;
                }
            }
        }
    }

    delegate: ItemDelegate {
        height: control.height
        width: control.width
        anchors.horizontalCenter: parent.horizontalCenter
        contentItem: Text {
            anchors.fill: parent
            anchors.leftMargin: b_space * (lp + lm) / 2
            text: model.text
            color: index === list.currentIndex ? "#F0F0F0" : control.tc
            font: control.font
            verticalAlignment: Text.AlignVCenter
            renderType: Text.NativeRendering
        }
        background: Rectangle {
            anchors.fill: parent
            color: index === list.currentIndex ? control.hc : control.kc
        }
    }

    TextMetrics {
        id: textMetrics
    }

    MouseArea {
        anchors.fill: parent
        hoverEnabled: true
        onEntered: b_mouse(Qt.PointingHandCursor);
        onExited: b_mouse(Qt.ArrowCursor);
        onPressed: customPopup.visible = !customPopup.visible;
        onMouseYChanged: list.currentIndex = Math.min(list.count - 1, parseInt(mouseY / control.height) - 1);
        onReleased: {
            if (list.currentIndex > -1) {
                control.currentIndex = list.currentIndex;
                control.activated();
                customPopup.visible = false;
            }
        }
    }

    onCountChanged: updateWidth();
    onFontChanged: updateWidth();
    onWidthChanged: updatePopup();
    onHeightChanged: updatePopup();

    function updateWidth()
    {
        textMetrics.font = control.font;
        let l = 0;
        for (var i = 0; i < model.count; i++) {
            textMetrics.text = model.get(i).text;
            l = Math.max(textMetrics.width, l);
        }
    }

    function updatePopup()
    {
        popup.y = control.height - b;
        popup.width = control.width;
        popup.padding = b;
        popup.topPadding = b; // iOS
        h = parseInt(control.height * model.count + 2 * b);
    }

    function status()
    {
        updatePopup();

        let s =
            (control.enabled ? ":enabled" : ":!enabled") +
            (control.hovered ? ":hover" : ":!hover") +
            (control.pressed ? ":pressed" : ":!pressed");
        return s;
    }
}
