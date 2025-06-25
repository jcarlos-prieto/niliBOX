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

// DIGIMODES - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property bool busy
    property bool scroll
    property int  audiodeviceid
    property bool audiosettingsactive
    property int  dspid
    property int  graphtype
    property var  box
    property var  remotebox
    property var  devicename
    property bool refreshing

    id: main
    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);

                       if (audiosettingsactive) {
                           if (!audiosettingsset.contains(audiosettingsset.mapFromGlobal(p)) && !audiosettingsbutton.contains(audiosettingsbutton.mapFromGlobal(p))) {
                               audiosettingsactive = false;
                               audiosettingsbutton.checked = false;
                           }
                       }

                       if (!remotedevice.contains(remotedevice.mapFromGlobal(p))) remotedevice.popup.close();
                       if (!localdevice.contains(localdevice.mapFromGlobal(p))) localdevice.popup.close();
                       if (!mode.contains(mode.mapFromGlobal(p))) mode.popup.close();
                       if (!bauds.contains(bauds.mapFromGlobal(p))) bauds.popup.close();
                       if (!slot.contains(slot.mapFromGlobal(p))) slot.popup.close();
                       if (!cFiles.contains(cFiles.mapFromGlobal(p))) cFiles.popup.close();
                   }
    }
    TLabel {
        id: tooltip
        name: "tooltip"
        height: 20
        z: 2
        font.pixelSize: 12
        visible: false
        renderType: Text.NativeRendering
    }
    TColumn {
        id: all
        TGroupBox {
            id: topbuttons
            width: 16 * b_unit
            TRow {
                TButton {
                    id: playbutton
                    name: "playbutton"
                    checkable: true
                    width: b_unit
                    height: b_unit
                    tooltiptext: b_translate("Start / Stop")
                    onClicked: setPlay()
                }
                Rectangle {
                    id: outputdevice
                    height: b_unit
                    width: 11 * b_unit - 13 * parent.spacing - topbuttons.rightPadding - topbuttons.leftPadding
                    color: "transparent"
                }
                TButton {
                    id: settingsbutton
                    name: "settingsbutton"
                    height: b_unit
                    width: b_unit
                    checkable: true
                    tooltiptext: b_translate("Settings")
                    onClicked: setSettingsButton(checked);
                }
                TButton {
                    id: timebutton
                    name: "timebutton"
                    height: b_unit
                    width: b_unit
                    checkable: true
                    tooltiptext: b_translate("Time graph")
                    onClicked: setTimeButton(checked);
                }
                TButton {
                    id: freqbutton
                    name: "freqbutton"
                    height: b_unit
                    width: b_unit
                    checkable: true
                    tooltiptext: b_translate("Frequency graph")
                    onClicked: setFreqButton(checked);
                }
                TButton {
                    id: textbutton
                    name: "textbutton"
                    height: b_unit
                    width: b_unit
                    checkable: true
                    tooltiptext: b_translate("Text")
                    onClicked: setTextButton(checked);
                }
                TButton {
                    id: toolsbutton
                    name: "toolsbutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Tools")
                    onClicked: setToolsButton(checked);
                }
            }
        }
        Flickable {
            width: 16 * b_unit
            height: b_height - topbuttons.height - parent.spacing
            contentHeight: contentItem.childrenRect.height
            clip: true
            interactive: scroll && (contentHeight > height)
            onDraggingChanged: {if (!dragging && (b_os === "ios" || b_os === "android")) flick(-horizontalVelocity, -verticalVelocity);}
            TColumn {
                TRow {
                    TLabel {
                        id: device
                        height: gain.height
                        width: 14.65 * b_unit
                        font.pixelSize: 0.5 * b_unit
                        clip: true
                    }
                    TColumn {
                        id: gain
                        TLabel {
                            id: gainlabel
                            height: 0.3 * b_unit
                            font.pixelSize: height
                            horizontalAlignment: Text.AlignHCenter
                            text: b_translate("GAIN")
                        }
                        TKnob {
                            id: kGain
                            width: b_unit
                            height: width
                            min: -20
                            max: 20
                            step: 2
                            anglestep: 15
                            value: -1
                            anchors.horizontalCenter: gainlabel.horizontalCenter
                            onAngleChanged: setGain(value);
                            onPressedChanged: scroll = !pressed;
                        }
                    }
                }
                TGroupBox {
                    id: devices
                    width: 16 * b_unit
                    height: remoterow.height + localrow.height + 3 * cmodes.spacing
                    z: 1
                    TColumn {
                        id: cmodes
                        TRow {
                            id: remoterow
                            TLabel {
                                id: input
                                height: b_unit
                                width: Math.max(tminput.width, tmoutput.width) + leftPadding + rightPadding
                                text: b_translate("INPUT")
                                anchors.bottom: remotegain.bottom
                                TextMetrics {
                                    id: tminput
                                    font: input.font
                                    text: input.text
                                }
                            }
                            TComboBox {
                                id: remotedevice
                                width: devices.availableWidth - input.width - remotegain.width - 2 * remoterow.spacing
                                height: b_unit
                                anchors.bottom: remotegain.bottom
                                model: ListModel {
                                    id: remotedevicemodel
                                }
                                onActivated: setRemoteDevice()
                            }
                            TColumn {
                                id: remotegain
                                TLabel {
                                    id: remotelabel
                                    height: 0.3 * b_unit
                                    font.pixelSize: height
                                    horizontalAlignment: Text.AlignHCenter
                                    text: b_translate("GAIN")
                                }
                                TKnob {
                                    id: kRemoteGain
                                    width: b_unit
                                    height: width
                                    min: 0
                                    max: 100
                                    step: 5
                                    anglestep: 17
                                    value: -1
                                    anchors.horizontalCenter: remotelabel.horizontalCenter
                                    onAngleChanged: setRemoteGain(value);
                                    onPressedChanged: scroll = !pressed;
                                }
                            }
                        }
                        TRow {
                            id: localrow
                            TLabel {
                                id: output
                                height: b_unit
                                width: Math.max(tminput.width, tmoutput.width) + leftPadding + rightPadding
                                text: b_translate("OUTPUT")
                                anchors.bottom: localgain.bottom
                                TextMetrics {
                                    id: tmoutput
                                    font: output.font
                                    text: output.text
                                }
                            }
                            TComboBox {
                                id: localdevice
                                width: devices.availableWidth - output.width - localgain.width - audiosettingsbutton.width - 3 * localrow.spacing
                                height: b_unit
                                anchors.bottom: localgain.bottom
                                model: ListModel {
                                    id: localdevicemodel
                                }
                                onActivated: setLocalDevice()
                            }
                            TButton {
                                id: audiosettingsbutton
                                name: "audiosettingsbutton"
                                width: b_unit
                                height: b_unit
                                anchors.bottom: localgain.bottom
                                checkable: true
                                tooltiptext: b_translate("Audio settings")
                                onClicked: audiosettingsactive = !audiosettingsactive
                            }
                            TColumn {
                                id: localgain
                                TLabel {
                                    id: locallabel
                                    height: 0.3 * b_unit
                                    font.pixelSize: height
                                    horizontalAlignment: Text.AlignHCenter
                                    text: b_translate("GAIN")
                                }
                                TKnob {
                                    id: kLocalGain
                                    width: b_unit
                                    height: width
                                    min: 0
                                    max: 100
                                    step: 5
                                    anglestep: 16
                                    value: -1
                                    anchors.horizontalCenter: locallabel.horizontalCenter
                                    onAngleChanged: setLocalGain(value);
                                    onPressedChanged: scroll = !pressed;
                                }
                            }
                        }
                    }
                    SetAudioSettings {
                        id: audiosettingsset
                        name: "audiosettings"
                        x: audiosettingsbutton.x - width - localrow.spacing
                        y: audiosettingsbutton.y + localrow.y
                        width: audiosettingsactive ? 4 * b_unit : 0
                        height: 3.2 * b_unit
                        implicitHeight: 0
                        gain: false
                        Behavior on width {
                            id: aaudiosettingsset
                            PropertyAnimation {
                                duration: b_param("ui.animationdelay")
                                easing.type: Easing.InOutQuad
                                onRunningChanged: aaudiosettingsset.enabled = !aaudiosettingsset.enabled;
                            }
                        }
                        onSrateChanged: setPlay();
                        onSbitsChanged: setPlay();
                    }
                }
                TGroupBox {
                    id: gsettings
                    width: 16 * b_unit
                    height: settingsbutton.checked ? 4 * b_unit + 6 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: asettings
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: asettings.enabled = !asettings.enabled;
                        }
                    }
                    TGrid {
                        columns: 4
                        spacing: b_space
                        TLabel {
                            height: b_unit
                            text: b_translate("Mode:")
                        }
                        TComboBox {
                            id: mode
                            height: b_unit
                            width: 4 * b_unit
                            model: ListModel {
                                id: modemodel
                            }
                            onActivated: setMode(currentText)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("Matched filter:")
                        }
                        TCheck {
                            id: mfilter
                            height: b_unit
                            width: b_unit
                            onClicked: setMFilter(checked)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("Bauds:")
                        }
                        TComboBox {
                            id: bauds
                            height: b_unit
                            width: 4 * b_unit
                            model: ListModel {
                                id: baudsmodel
                            }
                            onActivated: setBauds(currentText)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("High-pass filter:")
                        }
                        TCheck {
                            id: hpfilter
                            height: b_unit
                            width: b_unit
                            onClicked: setHPFilter(checked)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("TDMA slot:")
                        }
                        TComboBox {
                            id: slot
                            height: b_unit
                            width: 4 * b_unit
                            model: ListModel {
                                ListElement {text: "1"}
                                ListElement {text: "2"}
                                ListElement {text: "1 + 2"}
                            }
                            onActivated: setSlot(currentText)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("Symbol PLL lock:")
                        }
                        TCheck {
                            id: pll
                            height: b_unit
                            width: b_unit
                            onClicked: setPLL(checked)
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("DMR key:")
                        }
                        TRow {
                            spacing: b_space
                            TLineEdit {
                                id: dmrkey
                                height: b_unit
                                width: 2 * b_unit - 2 * b_space
                                horizontalAlignment: TextInput.AlignRight
                                validator: IntValidator {bottom: 0; top: 255;}
                                onEditingFinished: setDMRKey(text)
                            }
                            TButton {
                                name: "buttonup"
                                height: b_unit
                                width: b_unit
                                tooltiptext: b_translate("Up")
                                onClicked: {
                                    let key = parseInt(dmrkey.text);
                                    if (key < 255)
                                        setDMRKey(key + 1);
                                }
                            }
                            TButton {
                                name: "buttondown"
                                height: b_unit
                                width: b_unit
                                tooltiptext: b_translate("Down")
                                onClicked: {
                                    let key = parseInt(dmrkey.text);
                                    if (key > 0)
                                        setDMRKey(key - 1);
                                }
                            }
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("Speech quality:")
                        }
                        TRow {
                            TLineEdit {
                                id: speechq
                                height: b_unit
                                width: b_unit
                                horizontalAlignment: TextInput.AlignRight
                                validator: IntValidator {bottom: 1; top: 64;}
                                onEditingFinished: setSpeechQ(text)
                            }
                            TButton {
                                name: "buttonup"
                                height: b_unit
                                width: b_unit
                                tooltiptext: b_translate("Up")
                                onClicked: {
                                    let key = parseInt(speechq.text);
                                    if (key < 64)
                                        setSpeechQ(key + 1);
                                }
                            }
                            TButton {
                                name: "buttondown"
                                height: b_unit
                                width: b_unit
                                tooltiptext: b_translate("Down")
                                onClicked: {
                                    let key = parseInt(speechq.text);
                                    if (key > 0)
                                        setSpeechQ(key - 1);
                                }
                            }
                        }
                    }
                }
                TGroupBox {
                    id: gtime
                    width: 16 * b_unit
                    height: timebutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: atime
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: atime.enabled = !atime.enabled;
                        }
                    }
                    TRow {
                        spacing: b_space
                        TLabel {
                            width: 0.3 * b_unit
                            height: 3.5 * b_unit
                            font.pixelSize: width
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            text: b_translate("TIME")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: graphtime
                            width: 14.1 * b_unit - 5 * b_space
                            height: 3.5 * b_unit
                        }
                    }
                }
                TGroupBox {
                    id: gfreq
                    width: 16 * b_unit
                    height: freqbutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: afreq
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: afreq.enabled = !afreq.enabled;
                        }
                    }
                    TRow {
                        spacing: b_space
                        TLabel {
                            width: 0.3 * b_unit
                            height: 3.5 * b_unit
                            font.pixelSize: width
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            text: b_translate("FREQUENCY")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: graphfreq
                            width: 14.1 * b_unit - 5 * b_space
                            height: 3.5 * b_unit
                            filled: true
                            logarithmic: true
                            logmin: 85
                            maintain: 5
                            children: [
                                TLabel {
                                    id: cgraphfreq
                                    anchors.fill: parent
                                    font.pixelSize: 0.4 * b_unit
                                    color: parent.signalcolor
                                    horizontalAlignment: Text.AlignRight
                                    verticalAlignment: Text.AlignTop
                                },
                                MouseArea {
                                    id: audiofilter
                                    property real pos1: box ? b_getvar("audiofilterpos1", 0) : 0
                                    property real pos2: box ? b_getvar("audiofilterpos2", 1) : 0
                                    property real pos: 0
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onPressed: {
                                        if (Math.abs(mouseX - pos1 * width) < Math.abs(mouseX - pos2 * width)) {
                                            pos1 = mouseX / width;
                                            pos = 1;
                                        } else {
                                            pos2 = mouseX / width;
                                            pos = 2;
                                        }
                                        update();
                                    }
                                    onExited: cgraphfreq.text = "";
                                    onPositionChanged: {
                                        let mx = mouseX / width;
                                        if (mx < 0) mx = 0;
                                        if (mx > 1) mx = 1;
                                        cgraphfreq.text = playbutton.checked ? Math.trunc(audiosettingsset.srate / 2 * mx).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz" : "";
                                        if (pressed) {
                                            if (pos === 1) {
                                                if (mx < pos2)
                                                    pos1 = Math.max(0, mx);
                                            } else {
                                                if (mx > pos1)
                                                    pos2 = Math.min(1, mx);
                                            }
                                            update();
                                            updateAudioFilter();
                                        }
                                    }
                                    onWidthChanged: update()
                                    onHeightChanged: update()
                                    Rectangle {
                                        id: rect1
                                        x: 0
                                        y: 0
                                        width: 0
                                        height: parent.height
                                        color: "#40ffffff"
                                    }
                                    Rectangle {
                                        id: rect2
                                        x: 0
                                        y: 0
                                        width: 0
                                        height: parent.height
                                        color: "#40ffffff"
                                    }
                                    function update()
                                    {
                                        if (!bAudioFilter.checked) {
                                            rect1.x = 0;
                                            rect1.width = 0;
                                            rect2.x = 0;
                                            rect2.width = 0;
                                            return;
                                        }
                                        if (bAudioFilterPass.checked) {
                                            rect1.x = 0;
                                            rect1.width = pos1 * width;
                                            rect2.x = pos2 * width;
                                            rect2.width = width - pos2 * width;
                                        } else {
                                            rect1.x = pos1 * width;
                                            rect1.width = pos2 * width - pos1 * width;
                                            rect2.x = 0;
                                            rect2.width = 0;
                                        }
                                        b_setvar("audiofilterpos1", pos1);
                                        b_setvar("audiofilterpos2", pos2);
                                    }
                                }
                            ]
                        }
                        TColumn {
                            spacing: b_space
                            TButton {
                                id: bAudioFilter
                                width: 1.5 * b_unit
                                height: 0.7 * b_unit
                                anchors.horizontalCenter: parent.horizontalCenter
                                checkable: true
                                text: b_translate("FILTER")
                                onClicked: setAudioFilter(checked);
                            }
                            TButton {
                                id: bAudioFilterPass
                                width: 1.5 * b_unit
                                height: 0.7 * b_unit
                                checkable: true
                                text: b_translate("PASS")
                                onClicked: setAudioFilterType("PASSBAND");
                            }
                            TButton {
                                id: bAudioFilterReject
                                width: 1.5 * b_unit
                                height: 0.7 * b_unit
                                checkable: true
                                text: b_translate("REJECT")
                                onClicked: setAudioFilterType("REJECTBAND");
                            }
                        }
                    }
                }
                TRow {
                    id: htext
                    TLabel {
                        id: synctypelabel
                        width: 8 * b_unit - bclear.width - 1.5 * htext.spacing
                        height: b_unit
                        font.pixelSize: 0.4 * height
                    }
                    TLabel {
                        id: inlvllabel
                        width: 8 * b_unit - bclear.width - 1.5 * htext.spacing
                        height: b_unit
                        font.pixelSize: 0.4 * height
                    }
                    TButton {
                        id: bcopy
                        name: "copybutton"
                        width: b_unit
                        height: textbutton.checked ? b_unit : 0
                        tooltiptext: b_translate("Copy to clipboard")
                        onClicked: copyText();
                    }
                    TButton {
                        id: bclear
                        name: "clearbutton"
                        width: b_unit
                        height: textbutton.checked ? b_unit : 0
                        tooltiptext: b_translate("Clear")
                        onClicked: clearText();
                    }
                    TextArea {
                        id: tempcopy
                        visible: false
                    }
                }
                TGroupBox {
                    id: gtext
                    width: 16 * b_unit
                    height: textbutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: atext
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: atext.enabled = !atext.enabled;
                        }
                    }
                    Flickable {
                        id: scrolltext
                        width: 16 * b_unit - 4 * b_space
                        height: gtext.height - 2 * gtext.padding
                        contentHeight: boxtext.implicitHeight
                        clip: true
                        interactive: true
                        flickableDirection: Flickable.VerticalFlick
                        TLabel {
                            id: boxtext
                            font.family: "Courier"
                            font.pixelSize: 0.35 * b_unit
                            onPressedChanged: scroll = !pressed;
                        }
                    }
                }
                TGroupBox {
                    id: tools
                    width: 16 * b_unit
                    height: toolsbutton.checked ? (3.5 * b_unit + 14 * b_space) : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: atools
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: atools.enabled = !atools.enabled;
                        }
                    }
                    TRow {
                        spacing: b_space
                        TLabel {
                            width: 0.3 * b_unit
                            height: tools.height - 3 * b_space
                            font.pixelSize: width
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            text: b_translate("TOOLS")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGroupBox {
                            width: 4.5 * b_unit + 4 * b_space
                            height: tools.height - 3 * b_space
                            padding: 2 * b_space
                            TColumn {
                                spacing: 2 * b_space
                                TLabel {
                                    height: 0.35 * b_unit
                                    font.pixelSize: height
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("RECORD")
                                }
                                TRow {
                                    spacing: 2 * b_space
                                    TButton {
                                        id: bRecordPlay
                                        name: "recordstopbutton"
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        enabled: playbutton.checked
                                        checkable: true
                                        tooltiptext: b_translate("Record / Stop")
                                        onClicked: setRecord(checked)
                                    }
                                    TButton {
                                        id: bRecordPause
                                        name: "pausebutton"
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        checkable: true
                                        enabled: bRecordPlay.checked
                                        tooltiptext: b_translate("Pause")
                                        onClicked: setRecordPause(checked)
                                    }
                                    TButton {
                                        id: bRecordSQL
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        checkable: true
                                        text: b_translate("SQL")
                                        tooltiptext: b_translate("Squelch")
                                        onClicked: setRecordSQL(checked)
                                    }
                                }
                                Rectangle {
                                    width: b_unit
                                    height: 0.2 * b_unit
                                    color: "transparent"
                                }
                                TRow {
                                    TLabel {
                                        id: tFiles
                                        width: 1.5 * b_unit
                                        height: 0.35 * b_unit
                                        font.pixelSize: height
                                        text: b_translate("FILES")
                                    }
                                    TLabel {
                                        id: tRecordTime
                                        width: 3 * b_unit
                                        height: 0.35 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignRight
                                        color: bRecordPlay.checked ? tFiles.color : "transparent"
                                    }
                                }
                                TComboBox {
                                    id: cFiles
                                    name: "cfiles"
                                    width: 4.5 * b_unit + b_space
                                    height: b_unit
                                    font.pixelSize: 0.28 * height
                                    model: ListModel {
                                        id: cFilesItems
                                    }
                                }
                                TRow {
                                    spacing: b_space
                                    TButton {
                                        id: bRecordSave
                                        name: "savebutton"
                                        width: 2.25 * b_unit
                                        height: 0.7 * b_unit
                                        enabled: cFiles.currentText.length > 0
                                        tooltiptext: b_translate("Save")
                                        onClicked: recordFileSave()
                                    }
                                    TButton {
                                        id: bRecordDelete
                                        name: "deletebutton"
                                        width: 2.25 * b_unit
                                        height: 0.7 * b_unit
                                        enabled: cFiles.currentText.length > 0
                                        tooltiptext: b_translate("Delete")
                                        onClicked: recordFileDelete()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Rectangle {
            height: b_unit
            width: b_unit
            color: "transparent"
        }
    }


    function b_start(params)
    {
        box = b_getbox();
        dspid = box.DSP_create();
        remotebox = b_getbox("remote");
        audiodeviceid = -1;
        graphtype = 0;
        scroll = true;

        refreshDevices();
        b_send("modes");
        b_send("rates");

        setSettingsButton(b_getvar("settingsbutton", "false") === "true")
        setTimeButton(b_getvar("timebutton", "false") === "true")
        setFreqButton(b_getvar("freqbutton", "false") === "true")
        setTextButton(b_getvar("textbutton", "false") === "true")
        setToolsButton(b_getvar("toolsbutton", "false") === "true")
        setSrate(b_getvar("srate", 32000));
        setSBits(b_getvar("sbits", 32));
        setAudioFilterType(b_getvar("audiofiltertype", "PASSBAND"));
        setAudioFilter(b_getvar("audiofilter", "false") === "true");
        setRemoteDevice();
        setLocalDevice();
        updateRecordFiles();
        box.audioDevice_Processing.connect(paintAudio);
    }


    function b_finish()
    {
        box.audioDevice_Processing.disconnect(paintAudio);
        box.audioDevice_close(audiodeviceid);
    }


    function b_receive(key, value)
    {
        if (key === "text") {
            paintText(value);

        } else if (key === "synctype") {
            synctypelabel.text = value;

        } else if (key === "inlvl") {
            inlvllabel.text = "INLVL: " + value + "%";

        } else if (key === "busy") {
            busy = value === "true";

            if (!busy) {
                graphtime.setData();
                graphfreq.setData();
            }

            if (bRecordPlay.checked && bRecordSQL.checked && !bRecordPause.checked)
                box.audioDevice_recordPause(audiodeviceid, !busy);
            
        } else if (key === "device") {
            devicename = value;
            setDevice();

        } else if (key === "modes") {
            modemodel.clear();
            let modelist = value.split(",");
            for (let i = 0; i < modelist.length; i++)
                modemodel.append({text: modelist[i]});
            setMode(b_getvar("mode", "Auto"));

        } else if (key === "rates") {
            baudsmodel.clear();
            let rateslist = value.split(",");
            for (let i = 0; i < rateslist.length; i++)
                baudsmodel.append({text: rateslist[i]});
            setBauds(b_getvar("bauds", 4800));
        }
    }


    function b_receivebin(key, value)
    {
        if (key === "audio") {
            receiveAudioData(value);
        }
    }


    function b_change(type)
    {
        if (type === "language")
            setDevice();
    }
    
    
    function b_hotplug()
    {
        refreshDevices();
    }


    function setDevice()
    {
        if (devicename === "LIBMBE") {
            device.color = "red";
            device.text = b_translate("Software emulation - Testing purposes only")
            gain.visible = false;
        } else {
            device.color = input.color;
            device.text = b_translate("Device: ") + devicename;
            gain.visible = true;
        }
        setGain(b_getvar("gain", 0));
        setMode(b_getvar("mode", "Auto"));
        setBauds(b_getvar("bauds", 4800));
        setSlot(b_getvar("slot", 1));
        setDMRKey(b_getvar("dmrkey", 0));
        setMFilter(b_getvar("mfilter", "true") === "true")
        setHPFilter(b_getvar("hpfilter", "false") === "true")
        setPLL(b_getvar("pll", "true") === "true")
        setSpeechQ(b_getvar("speechq", 3));
    }


    function setRemoteDevice()
    {
        let remotedevicename = b_getvar("remotedevice");
        b_setvar("remotedevice", remotedevice.currentValue);
        b_send("device", remotedevice.currentValue);
        kRemoteGain.value = -1;
        setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
        
        if (playbutton.checked && remotedevicename !== remotedevice.currentValue) {
            playbutton.checked = false;
            setPlay();
            playbutton.checked = true;
            setPlay();
        }
    }


    function setLocalDevice()
    {
        let localdevicename = b_getvar("localdevice");
        b_setvar("localdevice", localdevice.currentValue);
        kLocalGain.value = -1;
        setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));

        if (playbutton.checked && localdevicename !== localdevice.currentValue) {
            playbutton.checked = false;
            setPlay();
            playbutton.checked = true;
            setPlay();
        }
    }


    function setSrate(value)
    {
        audiosettingsset.srate = value;
    }


    function setSBits(value)
    {
        audiosettingsset.sbits = value;
    }


    function setMode(value)
    {
        mode.currentIndex = Math.max(0, mode.find(value));
        b_setvar("mode", value);
        b_send("mode", value);
    }


    function setBauds(value)
    {
        bauds.currentIndex = Math.max(0, bauds.find(value));
        b_setvar("bauds", value);
        b_send("bauds", value);
    }


    function setSlot(value)
    {
        slot.currentIndex = Math.max(0, slot.find(value));
        b_setvar("slot", value);
        b_send("slot", slot.currentIndex + 1);
    }


    function setDMRKey(value)
    {
        dmrkey.text = value;
        b_setvar("dmrkey", value);
        b_send("dmrkey", value);
    }


    function setMFilter(value)
    {
        mfilter.checked = value;
        b_setvar("mfilter", value);
        b_send("mfilter", value);
    }


    function setHPFilter(value)
    {
        hpfilter.checked = value;
        b_setvar("hpfilter", value);
        b_send("hpfilter", value);
    }


    function setPLL(value)
    {
        pll.checked = value;
        b_setvar("pll", value);
        b_send("pll", value);
    }


    function setSpeechQ(value)
    {
        speechq.text = value;
        b_setvar("speechq", value);
        b_send("speechq", value);
    }


    function setPlay()
    {
        if (playbutton.checked) {
            b_send("stop");
            b_send("play");
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = box.audioDevice_open(localdevice.currentValue, audiosettingsset.srate + "," + audiosettingsset.sbits + ",0");
            setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
            setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
            updateAudioFilter();
            clearText();
        } else {
            b_send("stop");
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = -1;
            synctypelabel.text = "";
            inlvllabel.text = "";
            if (bRecordPlay.checked) {
                bRecordPlay.checked = false;
                bRecordSQL.checked = false;
                setRecord(false);
            }
        }
    }


    function setSettingsButton(checked)
    {
        settingsbutton.checked = checked;
        b_setvar("settingsbutton", checked);
    }


    function setTimeButton(checked)
    {
        timebutton.checked = checked;
        b_setvar("timebutton", checked);
    }


    function setFreqButton(checked)
    {
        freqbutton.checked = checked;
        b_setvar("freqbutton", checked);
    }


    function setTextButton(checked)
    {
        textbutton.checked = checked;
        b_setvar("textbutton", checked);
    }


    function setToolsButton(checked)
    {
        toolsbutton.checked = checked;
        b_setvar("toolsbutton", checked);
    }


    function setGain(value)
    {
        if (kGain.value === -1) {
            kGain.value = value;
            kGain.angle = 180 + value / kGain.step * kGain.anglestep;
        }
        kGain.text = value + "dB";
        b_send("gain", value);
        b_setvar("gain", value);
    }


    function setRemoteGain(value)
    {
        if (kRemoteGain.value === -1) {
            kRemoteGain.value = value;
            kRemoteGain.angle = value / kRemoteGain.step * kRemoteGain.anglestep;
        }
        b_send("volume", value / 100);
        b_setvar("remotegain." + box.escape(remotedevice.currentValue), value);
    }


    function setLocalGain(value)
    {
        if (kLocalGain.value === -1) {
            kLocalGain.value = value;
            kLocalGain.angle = value / kLocalGain.step * kLocalGain.anglestep;
        }
        b_setvar("localgain." + box.escape(localdevice.currentValue), value);
        box.audioDevice_setVolume(audiodeviceid, value / 100);
    }


    function refreshDevices()
    {
        if (refreshing)
            return;
        refreshing = true;
        
        remotedevicemodel.clear();
        localdevicemodel.clear();

        let i = 0;
        let remotedevicelist = remotebox.audioDevice_list("INPUT");
        for (i = 0; i < remotedevicelist.length; i++)
            remotedevicemodel.append({value: remotedevicelist[i], text: remotebox.audioDevice_description(remotedevicelist[i])});

        let localdevicelist = box.audioDevice_list("OUTPUT");
        for (i = 0; i < localdevicelist.length; i++)
            localdevicemodel.append({value: localdevicelist[i], text: box.audioDevice_description(localdevicelist[i])});

        remotedevice.currentIndex = Math.max(0, remotedevice.find(box.audioDevice_description(b_getvar("remotedevice", ""))));
        localdevice.currentIndex = Math.max(0, localdevice.find(box.audioDevice_description(b_getvar("localdevice", ""))));

        b_send("device", remotedevice.currentValue);
        
        setLocalDevice();
        setRemoteDevice();
        
        refreshing = false;
    }


    function receiveAudioData(data)
    {
        if (audiosettingsset.srate !== 8000)
            data = box.DSP_resample(dspid, data, box.viewSize(data) * audiosettingsset.srate / 32000);

        if (bAudioFilter.checked)
            data = box.DSP_filter(dspid, data);

        box.audioDevice_write(audiodeviceid, data);
    }


    function paintAudio(id, data)
    {
        if (id !== audiodeviceid)
            return;

        if (timebutton.checked)
            graphtime.setData(box.viewSlice(data, 0, 4 * Math.ceil(graphtime.width)));

        if (freqbutton.checked) {
            let fft = box.DSP_FFT(dspid, data, Math.ceil(graphfreq.width));
            graphfreq.setData(fft);
        }
    }


    function paintText(data)
    {
        data = data.replace(/\0/g, "");

        if (boxtext.text.length === 0)
            boxtext.text = data;
        else
            boxtext.text += "\n" + data;

        if (boxtext.height > scrolltext.height)
            scrolltext.ScrollBar.vertical.position = (boxtext.height - scrolltext.height) / boxtext.height;
    }


    function copyText()
    {
        tempcopy.text = boxtext.text;
        tempcopy.selectAll();
        tempcopy.copy();
        tempcopy.text = "";
    }


    function clearText()
    {
        boxtext.text = "";
    }


    function setAudioFilter(value)
    {
        bAudioFilter.checked = value;
        b_setvar("audiofilter", value);
        bAudioFilterPass.enabled = value;
        bAudioFilterReject.enabled = value;
        audiofilter.update();
        updateAudioFilter();
    }


    function setAudioFilterType(value)
    {
        bAudioFilterPass.checked = (value === "PASSBAND");
        bAudioFilterReject.checked = (value === "REJECTBAND");
        b_setvar("audiofiltertype", value);
        audiofilter.update();
        updateAudioFilter();
    }


    function updateAudioFilter()
    {
        if (audiosettingsset.srate === 0)
            return;

        box.DSP_setFilterParams(dspid,
                                audiosettingsset.srate,
                                audiosettingsset.srate / 2 * audiofilter.pos1,
                                audiosettingsset.srate / 2 * audiofilter.pos2,
                                20,
                                bAudioFilterPass.checked ? Box.FT_PASSBAND : Box.FT_REJECTBAND);
    }


    function setRecord(value)
    {
        if (value) {
            let filename = "_Save_" + new Date().toLocaleString(Qt.locale("de_DE"), "yyyy.MM.dd HH.mm.ss@") + "DMR.wav";
            updateRecordSize(audiodeviceid, 44);
            box.audioDevice_recordStart(audiodeviceid, filename);
            box.audioDevice_RecordSize.connect(updateRecordSize);
            if (bRecordSQL.checked && !busy)
                box.audioDevice_recordPause(audiodeviceid, true);
            updateRecordFiles();
        } else {
            box.audioDevice_recordStop(audiodeviceid);
            box.audioDevice_RecordSize.disconnect(updateRecordSize);
            bRecordPause.checked = false;
            updateRecordFiles();
        }
    }


    function setRecordPause(value)
    {
        if (!bRecordSQL.checked || (bRecordSQL.checked && busy))
            box.audioDevice_recordPause(audiodeviceid, value);
    }


    function setRecordSQL(value)
    {
        if (bRecordPlay.checked && !bRecordPause.checked) {
            if (value & !busy)
                box.audioDevice_recordPause(audiodeviceid, true);
            else if (!value)
                box.audioDevice_recordPause(audiodeviceid, false);
        }
    }


    function updateRecordSize(id, size)
    {
        let time = new Date((size - 44) * 8000 / audiosettingsset.sbits / audiosettingsset.srate);
        tRecordTime.text = time.toISOString().substr(11, 10);

        if (cFiles.count === 0)
            return;

        let disp = cFilesItems.get(cFiles.count - 1).text;
        let n = disp.indexOf(" (");
        if (n > -1)
            disp = disp.substr(0, n);

        disp += " (";

        if (size < 1024000)
            disp += Math.ceil(size / 1024) + "KB)";
        else if (size < 10485760)
            disp += Math.ceil(size / 104857.6) / 10 + "MB)";
        else
            disp += Math.ceil(size / 1048576) + "MB)";

        cFilesItems.get(cFiles.count - 1).text = disp;

    }


    function recordFileSave()
    {
        let file = cFiles.currentText;
        let n = file.indexOf(" (");
        if (n > -1)
            file = file.substr(0, n);
        file = "_Save_" + file.replace("\n", "@") + ".wav";
        box.file_save(file);
    }


    function recordFileDelete()
    {
        let file = cFiles.currentText;
        let n = file.indexOf(" (");
        if (n > -1)
            file = file.substr(0, n);
        file = "_Save_" + file.replace("\n", "@") + ".wav";
        box.file_delete(file);
        updateRecordFiles();
    }


    function updateRecordFiles()
    {
        let files = box.file_list("_Save_*.wav");

        cFilesItems.clear();

        for (let i = 0; i < files.length; i++) {
            let file = files[i].split(":");
            let disp = file[0].replace("_Save_", "").replace("@", "\n").replace(".wav", "") + " (";
            let size = parseInt(file[1]);

            if (size < 1024000)
                disp += Math.ceil(size / 1024) + "KB)";
            else if (size < 10485760)
                disp += Math.ceil(size / 104857.6) / 10 + "MB)";
            else
                disp += Math.ceil(size / 1048576) + "MB)";

            cFilesItems.append({text: disp});
        }
        cFiles.currentIndex = files.length - 1;
    }
}
