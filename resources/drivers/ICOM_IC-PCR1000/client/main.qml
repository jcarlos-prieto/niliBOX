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

// ICOM_IC-PCR1000 - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property bool   bankactive
    property bool   busy
    property bool   delbankallactive
    property bool   audiosettingsactive
    property bool   scroll
    property bool   editing
    property bool   keypadactive
    property bool   memactive
    property bool   powering
    property bool   scanwait
    property bool   stepactive
    property int    audiodeviceid
    property int    dspid
    property int    editingdecimaldigit
    property int    maxbank
    property int    maxmem
    property int    scanfrombank
    property int    scanfromfreq
    property int    scantobank
    property int    scantofreq
    property string outputdevicemode
    property var    box
    property var    bscopearray
    property var    dtcscodes
    property var    editingfreq
    property var    maxfreq
    property var    stdsteps
    property var    steps
    property var    tsqlfreqs

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

                       if (keypadactive) {
                           if (!keypad.contains(keypad.mapFromGlobal(p)) && !lFrequency.contains(lFrequency.mapFromGlobal(p)))
                           keypadactive = false;
                       }

                       if (stepactive) {
                           if (!stepset.contains(stepset.mapFromGlobal(p)) && !bStep.contains(bStep.mapFromGlobal(p))) {
                               stepactive = false;
                               bStep.checked = false;
                           }
                       }

                       if (bankactive) {
                           if (!bankset.contains(bankset.mapFromGlobal(p)) && !bBank.contains(bBank.mapFromGlobal(p))) {
                               bankactive = false;
                               bBank.checked = false;
                           }
                       }

                       if (memactive) {
                           if (!memset.contains(memset.mapFromGlobal(p)) && !bMem.contains(bMem.mapFromGlobal(p))) {
                               memactive = false;
                               bMem.checked = false;
                           }
                       }

                       if (!outputdevice.contains(outputdevice.mapFromGlobal(p))) outputdevice.popup.close();
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
        focus: true
        Keys.onPressed: keyPressed(event.key);
        TGroupBox {
            id: topbuttons
            width: 16 * b_unit
            height: b_unit + 2 * toprow.spacing
            z: 1
            TRow {
                id: toprow
                PowerButton {
                    id: bPower
                    width: b_unit
                    height: b_unit
                    status: -1
                    enabled: !powering
                    tooltiptext: b_translate("Power on/off")
                    onClicked: setPower(status)
                }
                TComboBox {
                    id: outputdevice
                    width: 8 * b_unit - 8 * parent.spacing - topbuttons.rightPadding - topbuttons.leftPadding
                    height: b_unit
                    model: ListModel {
                        id: outputdevicemodel
                    }
                    onActivated: setOutputDevice(currentValue);
                }
                TButton {
                    id: audiosettingsbutton
                    name: "audiosettingsbutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Audio settings")
                    onClicked: audiosettingsactive = !audiosettingsactive
                }
                TButton {
                    id: bandscopebutton
                    name: "bandscopebutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Bandscope")
                    onClicked: setBandscopeButton(checked);
                }
                TButton {
                    id: bandspectrogrambutton
                    name: "bandspectrogrambutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Band Spectrogram")
                    onClicked: setBandSpectrogramButton(checked);
                }
                TButton {
                    id: timebutton
                    name: "timebutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Time graph")
                    onClicked: setTimeButton(checked);
                }
                TButton {
                    id: freqbutton
                    name: "freqbutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Frequency graph")
                    onClicked: setFreqButton(checked);
                }
                TButton {
                    id: spectrogrambutton
                    name: "spectrogrambutton"
                    width: b_unit
                    height: b_unit
                    checkable: true
                    tooltiptext: b_translate("Spectrogram")
                    onClicked: setSpectrogramButton(checked);
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
            SetAudioSettings {
                id: audiosettingsset
                name: "keypad"
                x: audiosettingsbutton.x - width - toprow.spacing
                y: audiosettingsbutton.y
                width: audiosettingsactive ? 5.6 * b_unit : 0
                height: 3.2 * b_unit
                implicitHeight: 0
                Behavior on width {
                    id: aaudiosettingsset
                    PropertyAnimation {
                        duration: box ? box.param("ui.animationdelay") : 0
                        easing.type: Easing.InOutQuad
                        onRunningChanged: aaudiosettingsset.enabled = !aaudiosettingsset.enabled;
                    }
                }
                onSrateChanged: {
                    b_send("srate", srate);
                    graphtime.setData();
                    graphfreq.setData();
                    spectrogram.setData();
                }
                onSbitsChanged: {
                    b_send("sbits", sbits);
                    graphtime.setData();
                    graphfreq.setData();
                    spectrogram.setData();
                }
                onCbitsChanged: b_send("cbits", cbits);
                onOgainChanged: setOgain(ogain);
            }
        }
        Flickable {
            width: 16 * b_unit
            height: b_height - topbuttons.height - parent.spacing
            contentHeight: contentItem.childrenRect.height
            clip: true
            interactive: scroll && (contentHeight > height)
            onDraggingChanged: {if (!dragging && (b_os === "ios" || b_os === "android")) flick(-horizontalVelocity, -verticalVelocity);}
            onContentHeightChanged: main.heightChanged();
            TColumn {
                TGroupBox {
                    width: 16 * b_unit
                    z: 1
                    TRow {
                        spacing: b_space
                        TColumn {
                            TGroupBox {
                                name: "display"
                                width: 9 * b_unit
                                height: 3.6 * b_unit
                                z: 1
                                TColumn {
                                    spacing: b_space
                                    TRow {
                                        TColumn {
                                            spacing: b_space
                                            TLabel {
                                                id: lBusy
                                                name: "displaytext"
                                                width: 2.8 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                                text: b_translate("BUSY")
                                                opacity: 0
                                            }
                                            TRow {
                                                id: rarrows
                                                Image {
                                                    id: lLeft
                                                    width: height
                                                    height: 0.4 * b_unit
                                                    mipmap: true
                                                    source: "triangle.png"
                                                    rotation: 90
                                                    transformOrigin: Item.Center
                                                    opacity: 0
                                                    Timer {
                                                        id: lLeftTimer
                                                        interval: 1000
                                                        repeat: false
                                                        running: false
                                                        onTriggered: lLeft.opacity = 0
                                                    }
                                                }
                                                Image {
                                                    id: lRight
                                                    width: 0.4 * b_unit
                                                    height: width
                                                    mipmap: true
                                                    source: "triangle.png"
                                                    rotation: -90
                                                    transformOrigin: Item.Center
                                                    opacity: 0
                                                    Timer {
                                                        id: lRightTimer
                                                        interval: 1000
                                                        repeat: false
                                                        running: false
                                                        onTriggered: lLeft.opacity = 0
                                                    }
                                                }
                                            }
                                        }
                                        TLabel {
                                            id: lFrequency
                                            name: "displaytext"
                                            width: 6 * b_unit
                                            height: 0.9 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignRight
                                            MouseArea {
                                                anchors.fill: parent
                                                hoverEnabled: true
                                                onPressed: keypadactive = !keypadactive;
                                                onEntered: b_mouse(Qt.PointingHandCursor)
                                                onExited: b_mouse(Qt.ArrowCursor)
                                            }
                                        }
                                    }
                                    TRow {
                                        TColumn {
                                            spacing: b_space
                                            TLabel {
                                                id: lField1
                                                name: "displaytext"
                                                width: 6 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField2
                                                name: "displaytext"
                                                width: 6 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField3
                                                name: "displaytext"
                                                width: 6 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                        }
                                        TColumn {
                                            spacing: 0.8 * b_space
                                            TLabel {
                                                id: lField4
                                                name: "displaytext"
                                                width: 3 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField5
                                                name: "displaytext"
                                                width: 3 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField6
                                                name: "displaytext"
                                                width: 3 * b_unit
                                                height: 0.4 * b_unit
                                                font.pixelSize: height
                                            }
                                        }
                                    }
                                    TColumn {
                                        spacing: 0
                                        anchors.left: parent.left
                                        Rectangle {
                                            width: 8.8 * b_unit
                                            height: 0.2 * b_unit
                                            color: "transparent"
                                            Image {
                                                x: kSquelch.value < 128 ? 0 : (kSquelch.value - 128) / 128 * 8.8 * b_unit - width / 2
                                                width: 0.2 * b_unit
                                                height: width
                                                mipmap: true
                                                visible: kSquelch.value > 127 && !bMonitor.checked
                                                source: "triangle.png"
                                            }
                                        }
                                        SMeter {
                                            id: smeter
                                            width: 8.7 * b_unit
                                            height: 0.2 * b_unit
                                            count: 26
                                            saturateat: 20
                                            value: 0
                                        }
                                        Rectangle {
                                            width: 8.7 * b_unit
                                            height: 0.05 * b_unit
                                            color: "transparent"
                                        }
                                        Rectangle {
                                            width: 8.7 * b_unit
                                            height: 0.05 * b_unit
                                            color: lField1.color
                                        }
                                        Rectangle {
                                            width: 8.7 * b_unit
                                            height: 0.05 * b_unit
                                            color: "transparent"
                                        }
                                        TRow {
                                            spacing: 0
                                            TLabel {
                                                name: "smeternum"
                                                width: 1.32 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "1"
                                            }
                                            TLabel {
                                                name: "smeternum"
                                                width: 1.32 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "3"
                                            }
                                            TLabel {
                                                name: "smeternum"
                                                width: 1.32 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "5"
                                            }
                                            TLabel {
                                                name: "smeternum"
                                                width: 1.32 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "7"
                                            }
                                            TLabel {
                                                name: "smeternum"
                                                width: 1.32 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "9"
                                            }
                                            TLabel {
                                                name: "smeternumred"
                                                width: 0.8 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "20"
                                            }
                                            TLabel {
                                                name: "smeternumred"
                                                width: 0.8 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "40"
                                            }
                                            TLabel {
                                                name: "smeternumred"
                                                width: 0.8 * b_unit
                                                height: 0.35 * b_unit
                                                font.pixelSize: height
                                                text: "60"
                                            }
                                        }
                                    }
                                }
                                Keypad {
                                    id: keypad
                                    name: "keypad"
                                    x: lFrequency.x + lFrequency.width - 5 * b_unit
                                    y: lFrequency.y + lFrequency.height + b_space
                                    width: 5 * b_unit
                                    height: keypadactive ? width : 0
                                    implicitHeight: 0
                                    Behavior on height {
                                        id: akeypad
                                        PropertyAnimation {
                                            duration: b_param("ui.animationdelay")
                                            easing.type: Easing.InOutQuad
                                            onRunningChanged: akeypad.enabled = !akeypad.enabled;
                                        }
                                    }
                                    onKey: (key)=> keyPressed(key);
                                }
                            }
                            TGroupBox {
                                name: "knobs"
                                width: 9 * b_unit
                                height: 2.1 * b_unit + 4 * b_space
                                TRow {
                                    spacing: b_space
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("AF GAIN")
                                        }
                                        TKnob {
                                            id: kAFGain
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: 255
                                            step: 8
                                            anglestep: 10
                                            value: -1
                                            onValueChanged: setAFGain(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bMute
                                            name: "mutebutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            tooltiptext: b_translate("Mute")
                                            onClicked: setMute(checked);
                                        }
                                    }
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("SQL")
                                        }
                                        TKnob {
                                            id: kSquelch
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: 255
                                            step: 8
                                            anglestep: 10
                                            value: -1
                                            onValueChanged: setSquelch(value);
                                            tooltiptext: b_translate("Squelch")
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bMonitor
                                            name: "monitorbutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            tooltiptext: b_translate("Monitor")
                                            onClicked: setMonitor(checked);
                                        }
                                    }
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("IF SHIFT")
                                        }
                                        TKnob {
                                            id: kIFShift
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: 255
                                            step: 8
                                            anglestep: 10
                                            value: -1
                                            onValueChanged: setIFShift(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bCenter
                                            name: "centerbutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            tooltiptext: b_translate("Center")
                                            onClicked: centerIFShift();
                                        }
                                    }
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("STEP")
                                        }
                                        TKnob {
                                            id: kStep
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: 25
                                            step: 1
                                            anglestep: 20
                                            value: -1
                                            onValueChanged: setStep(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bStep
                                            name: "setbutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            tooltiptext: b_translate("Configure steps")
                                            onPressed: stepactive = !stepactive
                                        }
                                    }
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("BANK")
                                        }
                                        TKnob {
                                            id: kBank
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: maxbank
                                            step: 1
                                            anglestep: 20
                                            value: -1
                                            onValueChanged: setBank(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bBank
                                            name: "setbutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            tooltiptext: b_translate("Set bank")
                                            onPressed: bankactive = !bankactive
                                        }
                                    }
                                    TColumn {
                                        spacing: 1.9 * b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            text: b_translate("MEM")
                                        }
                                        TKnob {
                                            id: kMem
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: maxmem
                                            step: 1
                                            anglestep: 20
                                            value: -1
                                            onClicked: setMem(value);
                                            onValueChanged: setMem(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TButton {
                                            id: bMem
                                            name: "setbutton"
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            tooltiptext: b_translate("Set memory")
                                            onPressed: memactive = !memactive
                                        }
                                    }
                                }
                                SetField {
                                    id: stepset
                                    name: "keypad"
                                    x: 4.5 * b_unit
                                    y: bBank.y + bBank.height + b_space
                                    width: 8 * b_unit
                                    height: stepactive ? 1.2 * b_unit : 0
                                    implicitHeight: 0
                                    Behavior on height {
                                        id: astepset
                                        PropertyAnimation {
                                            duration: b_param("ui.animationdelay")
                                            easing.type: Easing.InOutQuad
                                            onRunningChanged: astepset.enabled = !astepset.enabled;
                                        }
                                    }
                                    onSetText: {
                                        b_setvar("steps", text);
                                        steps = text.split(",");
                                        setStep(Math.min(kStep.value, steps.length));
                                    }
                                    onDeleteText: {
                                        b_setvar("steps", "");
                                        text = stdsteps;
                                        steps = stdsteps.split(",");
                                        setStep(Math.min(kStep.value, steps.length));
                                    }
                                }
                                SetField {
                                    id: bankset
                                    name: "keypad"
                                    x: 6 * b_unit
                                    y: bBank.y + bBank.height + b_space
                                    width: 8 * b_unit
                                    height: bankactive ? 1.2 * b_unit : 0
                                    thirdbutton: b_translate("ERASE<br>MEMORIES")
                                    implicitHeight: 0
                                    Behavior on height {
                                        id: abankset
                                        PropertyAnimation {
                                            duration: b_param("ui.animationdelay")
                                            easing.type: Easing.InOutQuad
                                            onRunningChanged: abankset.enabled = !abankset.enabled;
                                        }
                                    }
                                    onSetText: {
                                        b_setvar("bank" + kBank.value, text);
                                        setBank(kBank.value);
                                    }
                                    onDeleteText: {
                                        b_setvar("bank" + kBank.value, "");
                                        setBank(kBank.value);
                                    }
                                    onThirdButton: {
                                        for (let i = 0; i <= maxmem; i++)
                                            b_setvar("bank" + kBank.value + ".mem" + i, "");
                                        setMem(kMem.value);
                                    }
                                }
                                SetField {
                                    id: memset
                                    name: "keypad"
                                    x: 7.5 * b_unit
                                    y: bMem.y + bMem.height + b_space
                                    width: 8 * b_unit
                                    height: memactive ? 1.2 * b_unit : 0
                                    implicitHeight: 0
                                    Behavior on height {
                                        id: amemset
                                        PropertyAnimation {
                                            duration: b_param("ui.animationdelay")
                                            easing.type: Easing.InOutQuad
                                            onRunningChanged: amemset.enabled = !amemset.enabled;
                                        }
                                    }
                                    onSetText: {
                                        b_setvar("bank" + kBank.value + ".mem" + kMem.value, text + "!@!" + kFrequency.value + "!@!" + lField4.text + "!@!" + lField5.text);
                                        setMem(kMem.value);
                                    }
                                    onDeleteText: {
                                        b_setvar("bank" + kBank.value + ".mem" + kMem.value, "");
                                        setMem(kMem.value);
                                    }
                                }
                            }
                        }
                        TColumn {
                            spacing: 0.27 * b_unit
                            TKnob {
                                id: kFrequency
                                width: 3.6 * b_unit
                                height: width
                                rounddial: true
                                min: 0
                                max: maxfreq ? maxfreq : 0
                                step: steps ? steps[kStep.value < 0 ? 0 : kStep.value] : 0
                                anglestep: 20
                                value: -1
                                onValueChanged: {
                                    if (!editing)
                                        setFrequency(value);
                                }
                                onPressedChanged: scroll = !pressed;
                            }
                            TRow {
                                spacing: b_space
                                TColumn {
                                    width: 1.7 * b_unit
                                    TButton {
                                        id: bAM
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("AM")
                                        onClicked: setBand("AM");
                                    }
                                    TButton {
                                        id: bLSB
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("LSB")
                                        onClicked: setBand("LSB");
                                    }
                                    TButton {
                                        id: bUSB
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("USB")
                                        onClicked: setBand("USB");
                                    }
                                }
                                TColumn {
                                    width: 1.7 * b_unit
                                    TButton {
                                        id: bCW
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("CW")
                                        onClicked: setBand("CW");
                                    }
                                    TButton {
                                        id: bFM
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("FM")
                                        onClicked: setBand("FM");
                                    }
                                    TButton {
                                        id: bWFM
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("WFM")
                                        onClicked: setBand("WFM");
                                    }
                                }
                            }
                        }
                        TColumn {
                            width: 3.4 * b_unit
                            TLabel {
                                id: image
                                name: "applogo"
                                width: 3 * b_unit
                                height: 2 * b_unit
                            }
                            TRow {
                                spacing: b_space
                                TColumn {
                                    TButton {
                                        id: bFilter1
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("2.8 kHz")
                                        onClicked: setFilter("2.8 kHz");
                                    }
                                    TButton {
                                        id: bFilter2
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("6 kHz")
                                        onClicked: setFilter("6 kHz");
                                    }
                                    TButton {
                                        id: bFilter3
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("15 kHz")
                                        onClicked: setFilter("15 kHz");
                                    }
                                    TButton {
                                        id: bFilter4
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("50 kHz")
                                        onClicked: setFilter("50 kHz");
                                    }
                                    TButton {
                                        id: bFilter5
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("230 kHz")
                                        onClicked: setFilter("230 kHz");
                                    }
                                }
                                TColumn {
                                    TButton {
                                        id: bVSC
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("VSC")
                                        onClicked: setVSC(checked);
                                    }
                                    TButton {
                                        id: bAFC
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        enabled: bFM.checked && (bFilter2.checked || bFilter3.checked)
                                        text: b_translate("AFC")
                                        onClicked: setAFC(checked);
                                    }
                                    TButton {
                                        id: bNB
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("NB")
                                        onClicked: setNB(checked);
                                    }
                                    TButton {
                                        id: bATT
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("ATT")
                                        onClicked: setATT(checked);
                                    }
                                    TButton {
                                        id: bAGC
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("AGC")
                                        onClicked: setAGC(checked);
                                    }
                                }
                            }
                        }
                    }
                }
                TGroupBox {
                    width: 16 * b_unit
                    height: bandscopebutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: abandscope
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: abandscope.enabled = !abandscope.enabled;
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
                            text: b_translate("BANDSCOPE")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: bandscope
                            width: 14.1 * b_unit - 5 * b_space
                            height: 3.5 * b_unit
                            filled: true
                            maintain: 5
                            children: [
                                TLabel {
                                    id: cbandscope
                                    anchors.fill: parent
                                    font.pixelSize: 0.4 * b_unit
                                    color: parent.signalcolor
                                    horizontalAlignment: Text.AlignRight
                                    verticalAlignment: Text.AlignTop
                                },
                                Rectangle {
                                    width: 1
                                    height: parent.height
                                    color: "transparent"
                                    border.color: b_theme("TGraph", "", "axiscolor")
                                    border.width: 1
                                    x: parent.width / 2
                                    y: 0
                                },
                                MouseArea {
                                    property real initpos: 0
                                    property real initfreq: 0
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onReleased: {
                                        if (mouseX === initpos) {
                                            let f = kFrequency.value + (mouseX - width / 2) / width * kSpan.bandwidth;
                                            f = steps[kStep.value] * Math.round(f / steps[kStep.value]);
                                            if (!editing && f !== kFrequency.value) {
                                                setFrequency(f);
                                                cbandscope.text = bPower.status === 0 ? "" : Math.trunc((f + (mouseX - width / 2) / width * kSpan.bandwidth) / 1000).toLocaleString(Qt.locale("de_DE"), "f", 0) + " kHz";
                                            }
                                        }
                                    }
                                    onPressed: {
                                        initpos = mouseX;
                                        initfreq = kFrequency.value;
                                    }
                                    onExited: cbandscope.text = "";
                                    onPositionChanged: {
                                        cbandscope.text = bPower.status === 0 ? "" : Math.trunc((kFrequency.value + (mouseX - width / 2) / width * kSpan.bandwidth) / 1000).toLocaleString(Qt.locale("de_DE"), "f", 0) + " kHz";
                                        if (pressed) {
                                            let f = initfreq + (initpos - mouseX) / width * kSpan.bandwidth;
                                            f = steps[kStep.value] * Math.round(f / steps[kStep.value]);
                                            if (!editing && f !== kFrequency.value) {
                                                setFrequency(f);
                                                cbandscope.text = bPower.status === 0 ? "" : Math.trunc((f + (mouseX - width / 2) / width * kSpan.bandwidth) / 1000).toLocaleString(Qt.locale("de_DE"), "f", 0) + " kHz";
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                        TColumn {
                            TLabel {
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                                text: b_translate("SPAN")
                            }
                            TKnob {
                                id: kSpan
                                property int bandwidth: 0
                                height: b_unit
                                width: height
                                anchors.horizontalCenter: parent.horizontalCenter
                                min: 1
                                max: 5
                                step: 1
                                anglestep: 40
                                value: -1
                                onValueChanged: setSpan(value);
                                onPressedChanged: scroll = !pressed;
                            }
                            TLabel {
                                id: tSpan
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }
                        }
                    }
                }
                TGroupBox {
                    width: 16 * b_unit
                    height: bandspectrogrambutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: abandspectrogram
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: abandspectrogram.enabled = !abandspectrogram.enabled;
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
                            text: b_translate("BAND SPECTROGRAM")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: bandspectrogram
                            width: 14.1 * b_unit - 5 * b_space
                            height: 3.5 * b_unit
                            spectrogram: true
                            maintain: 5
                            children: [
                                TLabel {
                                    id: cbandspectrogram
                                    anchors.fill: parent
                                    font.pixelSize: 0.4 * b_unit
                                    color: parent.signalcolor
                                    horizontalAlignment: Text.AlignRight
                                    verticalAlignment: Text.AlignTop
                                },
                                MouseArea {
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onExited: cbandspectrogram.text = "";
                                    onPositionChanged: bPower.status === 0 ? "" : cbandspectrogram.text = Math.trunc((kFrequency.value + (mouseX - width / 2) / width * kSpan.bandwidth) / 1000).toLocaleString(Qt.locale("de_DE"), "f", 0) + " kHz";
                                }
                            ]
                        }
                        TColumn {
                            TLabel {
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                                text: b_translate("DELAY")
                            }
                            TKnob {
                                id: kBandSampling
                                height: b_unit
                                width: height
                                anchors.horizontalCenter: parent.horizontalCenter
                                min: 0
                                max: 10
                                step: 1
                                anglestep: 35
                                value: -1
                                onValueChanged: setBandSampling(value);
                                onPressedChanged: scroll = !pressed;
                            }
                            TLabel {
                                id: tBandSampling
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }
                        }
                    }
                }
                TGroupBox {
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
                    width: 16 * b_unit
                    height: freqbutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: afrequency
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: afrequency.enabled = !afrequency.enabled;
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
                            logmin: 100
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
                                        cgraphfreq.text = bPower.status === 0 ? "" : Math.trunc(audiosettingsset.srate / 2 * mx).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz";
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
                TGroupBox {
                    width: 16 * b_unit
                    height: spectrogrambutton.checked ? 3.5 * b_unit + 3 * b_space : 0
                    padding: b_space
                    clip: true
                    implicitHeight: 0
                    Behavior on height {
                        id: aspectrogram
                        PropertyAnimation {
                            duration: b_param("ui.animationdelay")
                            easing.type: Easing.InOutQuad
                            onRunningChanged: aspectrogram.enabled = !aspectrogram.enabled;
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
                            text: b_translate("SPECTROGRAM")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: spectrogram
                            width: 14.1 * b_unit - 5 * b_space
                            height: 3.5 * b_unit
                            spectrogram: true
                            logarithmic: true
                            maintain: 3
                            children: [
                                TLabel {
                                    id: cspectrogram
                                    anchors.fill: parent
                                    font.pixelSize: 0.4 * b_unit
                                    color: parent.signalcolor
                                    horizontalAlignment: Text.AlignRight
                                    verticalAlignment: Text.AlignTop
                                },
                                MouseArea {
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onExited: cspectrogram.text = "";
                                    onPositionChanged: bPower.status === 0 ? "" : cspectrogram.text = Math.trunc(audiosettingsset.srate / 2 * mouseX / width).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz";
                                }
                            ]
                        }
                        TColumn {
                            TLabel {
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                                text: b_translate("DELAY")
                            }
                            TKnob {
                                id: kSampling
                                width: height
                                height: b_unit
                                anchors.horizontalCenter: parent.horizontalCenter
                                min: 0
                                max: 10
                                step: 1
                                anglestep: 35
                                value: -1
                                onValueChanged: setSampling(value);
                                onPressedChanged: scroll = !pressed;
                            }
                            TLabel {
                                id: tSampling
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }
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
                            width: 1.5 * b_unit + 2 * b_space
                            height: tools.height - 3 * b_space
                            padding: b_space
                            TColumn {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 2 * b_space
                                TButton {
                                    id: bDSP
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: b_translate("DSP")
                                    tooltiptext: b_translate("Digital signal processor")
                                    onClicked: setDSP(checked);
                                }
                                TButton {
                                    id: bANF
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    enabled: bDSP.checked
                                    checkable: true
                                    text: b_translate("ANF")
                                    tooltiptext: b_translate("Adaptive notch filter")
                                    onClicked: setANF(checked);
                                }
                                TLabel {
                                    width: 1.5 * b_unit - b_space
                                    height: 0.3 * b_unit
                                    font.pixelSize: height
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    enabled: bDSP.checked
                                    text: b_translate("NR")
                                }
                                TKnob {
                                    id: kNR
                                    width: height
                                    height: b_unit
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    min: 0
                                    max: 16
                                    step: 1
                                    anglestep: 20
                                    value: -1
                                    enabled: bDSP.checked
                                    tooltiptext: b_translate("Noise reduction")
                                    onValueChanged: setNR(value);
                                    onPressedChanged: scroll = !pressed;
                                }
                            }
                        }
                        TGroupBox {
                            width: 3 * b_unit + 3 * b_space
                            height: tools.height - 3 * b_space
                            padding: b_space
                            TColumn {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 2 * b_space
                                TRow {
                                    spacing: 2 * b_space
                                    TColumn {
                                        spacing: 2 * b_space
                                        TButton {
                                            id: bTSQL
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            checkable: true
                                            text: b_translate("TSQL")
                                            tooltiptext: b_translate("Tone SQL")
                                            onClicked: setTSQL(checked);
                                        }
                                        TKnob {
                                            id: kTSQL
                                            width: b_unit
                                            height: width
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 1
                                            max: tsqlfreqs ? tsqlfreqs.length : 1
                                            step: 1
                                            anglestep: 20
                                            value: -1
                                            onValueChanged: setTSQLfreq(value);
                                            tooltiptext: b_translate("TSQL frequency")
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TLabel {
                                            id: tTSQL
                                            width: 1.5 * b_unit - b_space
                                            height: 0.35 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            verticalAlignment: Text.AlignVCenter
                                        }
                                    }
                                    TColumn {
                                        spacing: 2 * b_space
                                        TButton {
                                            id: bDTCS
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            checkable: true
                                            text: b_translate("DTCS")
                                            tooltiptext: b_translate("Digital Tone Coded Squelch")
                                            onClicked: setDTCS(checked)
                                        }
                                        TKnob {
                                            id: kDTCS
                                            width: height
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 1
                                            max: dtcscodes ? dtcscodes.length : 1
                                            step: 1
                                            anglestep: 20
                                            value: -1
                                            onValueChanged: setDTCScode(value);
                                            tooltiptext: b_translate("DTCS code")
                                            onPressedChanged: scroll = !pressed;
                                        }
                                        TLabel {
                                            id: tDTCS
                                            width: 1.5 * b_unit - b_space
                                            height: 0.35 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            verticalAlignment: Text.AlignVCenter
                                        }
                                    }
                                }
                                TButton {
                                    id: bReverseAction
                                    width: 3 * b_unit
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: b_translate("REV. ACTION")
                                    onClicked: setReverseAction(checked)
                                }
                                TButton {
                                    id: bReversePolarity
                                    width: 3 * b_unit
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: b_translate("REV. POLARITY")
                                    onClicked: setReversePolarity(checked)
                                }
                            }
                        }
                        TGroupBox {
                            id: scan
                            width: 4.5 * b_unit + 4 * b_space
                            height: tools.height - 3 * b_space
                            padding: 2 * b_space
                            TColumn {
                                spacing: 2 * b_space
                                TRow {
                                    spacing: 2 * b_space
                                    TLabel {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        font.pixelSize: 0.35 * b_unit
                                        horizontalAlignment: Text.AlignHCenter
                                        verticalAlignment: Text.AlignVCenter
                                        text: b_translate("SCAN")
                                    }
                                    TButton {
                                        id: bScanPlay
                                        name: "playstopbutton"
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        enabled: bPower.status === 1
                                        checkable: true
                                        tooltiptext: b_translate("Start / Stop")
                                        onClicked: setScan(checked)
                                    }
                                    TButton {
                                        id: bScanPause
                                        name: "pausebutton"
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        checkable: true
                                        enabled: bScanPlay.checked
                                        tooltiptext: b_translate("Pause")
                                        onClicked: scanNext()
                                    }
                                }
                                TRow {
                                    spacing: 2 * b_space
                                    TColumn {
                                        spacing: 2 * b_space
                                        TButton {
                                            id: bScanFreq
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            checkable: true
                                            text: b_translate("FREQ.")
                                            onClicked: setScanFreq(checked)
                                        }
                                        TButton {
                                            id: bScanBank
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            checkable: true
                                            text: b_translate("BANK")
                                            onClicked: setScanBank(checked)
                                        }
                                    }
                                    TColumn {
                                        spacing: 2 * b_space
                                        TButton {
                                            id: bScanEdge
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            checkable: true
                                            text: b_translate("EDGE")
                                            onClicked: setScanEdge(checked)
                                        }
                                        TButton {
                                            id: bScanLevel
                                            width: 1.5 * b_unit - b_space
                                            height: 0.7 * b_unit
                                            checkable: true
                                            text: b_translate("LEVEL")
                                            onClicked: setScanLevel(checked)
                                        }
                                    }
                                    TColumn {
                                        spacing: b_space
                                        TLabel {
                                            width: 1.5 * b_unit - b_space
                                            height: 0.3 * b_unit
                                            font.pixelSize: height
                                            horizontalAlignment: Text.AlignHCenter
                                            verticalAlignment: Text.AlignVCenter
                                            text: b_translate("DELAY")
                                        }
                                        TKnob {
                                            id: kScanDelay
                                            width: b_unit
                                            height: width
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: 0
                                            max: 10
                                            step: 1
                                            anglestep: 35
                                            value: -1
                                            onValueChanged: setScanDelay(value);
                                            onPressedChanged: scroll = !pressed;
                                        }
                                    }
                                }
                                TRow {
                                    spacing: 2 * b_space
                                    TButton {
                                        id: bScanFrom
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        text: b_translate("FROM")
                                        onClicked: setScanFrom(bScanFreq.checked ? kFrequency.value : kBank.value);
                                    }
                                    TLabel {
                                        id: tScanFrom
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        font.pixelSize: 0.35 * b_unit
                                        anchors.verticalCenter: bScanFrom.verticalCenter
                                    }
                                }
                                TRow {
                                    spacing: 2 * b_space
                                    TButton {
                                        id: bScanTo
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        text: b_translate("TO")
                                        onClicked: setScanTo(bScanFreq.checked ? kFrequency.value : kBank.value);
                                    }
                                    TLabel {
                                        id: tScanTo
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        font.pixelSize: 0.35 * b_unit
                                        anchors.verticalCenter: bScanTo.verticalCenter
                                    }
                                }
                            }
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
                                        enabled: bPower.status === 1
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
            height: 2 * b_unit
            width: b_unit
            color: "transparent"
        }
        Timer {
            id: scantimer
            running: false
            repeat: false
            interval: 1000 * kScanDelay.value
            onTriggered: scanNext()
        }
        Timer {
            id: bandscopetimer
            running: bPower.status === 1
            repeat: true
            interval: 100
            onTriggered: {
                let len = bandscope.width;
                let vbscopearray = new Uint8Array(bscopearray);
                let r = vbscopearray.length / len;
                let fbscopearray = new Float32Array(len);

                for (let i = 0; i < len; i++)
                    fbscopearray[i] = (vbscopearray[parseInt(r * i)] - 128) / 128;

                vbscopearray = box.viewFromBytes(fbscopearray.buffer);

                if (bandscopebutton.checked && (bAM.checked || bFM.checked || bWFM.checked) && !bScanPlay.checked)
                    bandscope.setData(vbscopearray);
                else
                    bandscope.setData();

                if (bandspectrogrambutton.checked && (bAM.checked || bFM.checked || bWFM.checked) && !bScanPlay.checked)
                    bandspectrogram.setData(vbscopearray);
                else
                    bandspectrogram.setData();
            }
        }
    }


    function b_start(params)
    {
        box = b_getbox();
        dspid = box.DSP_create();
        powering = false;
        audiodeviceid = -1;
        keypadactive = false;
        stepactive = false;
        bankactive = false;
        memactive = false;
        delbankallactive = false;
        editing = false;
        editingfreq = 0;
        editingdecimaldigit = -1;
        busy = false;
        scanfromfreq = b_getvar("scanfromfreq", 0);
        scanfrombank = b_getvar("scanfrombank", 0);
        scantofreq = b_getvar("scantofreq", 0);
        scantobank = b_getvar("scantobank", 0);
        scanwait = false;
        maxfreq = 1299999000;
        maxbank = 999;
        maxmem = 999;
        scroll = true;
        bscopearray = new ArrayBuffer(256);
        stdsteps = "1,10,20,50,100,500,1000,2500,5000,6250,8333,9000,10000,12500,15000,20000,25000,30000,50000,100000,125000,150000,200000,500000,1000000,10000000";
        steps = stdsteps.split(",");
        tsqlfreqs = ["67.0","69.3","71.0","71.9","74.4","77.0","79.7","82.5","85.4","88.5","91.5","94.8","97.4","100.0","103.5","107.2","110.9","114.8","118.8","123.0",
                     "127.3","131.8","136.5","141.3","146.2","151.4","156.7","159.8","162.2","165.5","167.9","171.3","173.8","177.3","179.9","183.5","186.2","189.9","192.8","196.6","199.5","203.5",
                     "206.5","210.7","218.1","225.7","229.1","233.6","241.8","250.3","254.1"];
        dtcscodes = ["023","025","026","031","032","036","043","047","051","053","054","065","071","072","073","074","114","115","116","122","125","131","132","134","143",
                     "145","152","155","156","162","165","172","174","205","212","223","225","226","243","244","245","246","251","252","255","261","263","265","266","271","274","306","311","315",
                     "325","331","332","343","346","351","356","364","365","371","411","412","413","423","431","432","445","446","452","454","455","462","464","465","466","503","506","516","523",
                     "526","532","546","565","606","612","624","627","631","632","654","662","664","703","712","723","731","732","734","743","754"];

        let freq = b_getvar("frequency", 6000000);
        let band = b_getvar("band", "AM");
        let filt = b_getvar("filter", "15 kHz");
        let span = b_getvar("span", 4);

        refreshDevices();

        setOutputDevice(b_getvar("outputdevice", box.audioDevice_defaultOutput()));
        setSrate(b_getvar("srate", 32000));
        setSBits(b_getvar("sbits", 32));
        setCBits(b_getvar("cbits", 0));
        setOgain(b_getvar("ogain", 100));
        setBandscopeButton(b_getvar("bandscopebutton", "false") === "true")
        setBandSpectrogramButton(b_getvar("bandspectrogrambutton", "false") === "true")
        setTimeButton(b_getvar("timebutton", "false") === "true")
        setFreqButton(b_getvar("freqbutton", "false") === "true")
        setSpectrogramButton(b_getvar("spectrogrambutton", "false") === "true")
        setToolsButton(b_getvar("toolsbutton", "false") === "true")
        setAFGain(b_getvar("afgain", 128));
        setMute(b_getvar("mute", "false") === "true");
        setSquelch(b_getvar("squelch", 0));
        setMonitor(b_getvar("monitor", "false") === "true");
        setIFShift(b_getvar("ifshift", 128));
        setSteps(b_getvar("steps", stdsteps).split(","));
        setStep(b_getvar("step", 6));
        setBank(b_getvar("bank", 0)); // setMem not needed
        setFrequency(freq);
        setBand(band);
        setFilter(filt);
        setVSC(b_getvar("vsc", "false") === "true");
        setAFC(b_getvar("afc", "false") === "true");
        setNB(b_getvar("nb", "false") === "true");
        setATT(b_getvar("att", "false") === "true");
        setAGC(b_getvar("agc", "false") === "true");
        setSpan(span);
        setBandSampling(b_getvar("bandsampling", 0));
        setSampling(b_getvar("sampling", 0));
        setDSP(b_getvar("dsp", "false") === "true");
        setANF(b_getvar("anf", "false") === "true");
        setNR(b_getvar("nr", 0));
        setTSQL(b_getvar("tsql", "false") === "true");
        setTSQLfreq(b_getvar("tsqlfreq", 1));
        setDTCS(b_getvar("dtcs", "false") === "true");
        setDTCScode(b_getvar("dtcscode", 1));
        setReverseAction(b_getvar("reverseaction", "false") === "true");
        setReversePolarity(b_getvar("reversepolarity", "false") === "true");
        setScanFreq(b_getvar("scanfreq", "true") === "true");
        setScanBank(b_getvar("scanbank", "false") === "true");
        setScanEdge(b_getvar("scanedge", "true") === "true");
        setScanLevel(b_getvar("scanlevel", "false") === "true");
        setScanDelay(b_getvar("scandelay", 1));
        setAudioFilterType(b_getvar("audiofiltertype", "PASSBAND"));
        setAudioFilter(b_getvar("audiofilter", "false") === "true");
        updateRecordFiles();

        b_send("init");
    }


    function b_finish()
    {
        box.audioDevice_Processing.disconnect(audioDeviceProcessing);
        box.audioDevice_close(audiodeviceid);
    }


    function b_receive(key, value)
    {
        if (key === "power") {
            bPower.status = parseInt(value);
            if (value === "1") {
                setAFGain(kAFGain.value);
                setMute(bMute.checked);
                setSquelch(kSquelch.value);
                setMonitor(bMonitor.checked);
                setIFShift(kIFShift.value);
                setFrequency(kFrequency.value);
                setBand(lField4.text);
                setFilter(lField5.text);
                setVSC(bVSC.checked);
                setAFC(bAFC.checked);
                setNB(bNB.checked);
                setATT(bATT.checked);
                setAGC(bAGC.checked);
                setSpan(kSpan.value);
                setBandSampling(kBandSampling.value);
                setSampling(kSampling.value);
                setDSP(bDSP.checked);
                setANF(bANF.checked);
                setNR(kNR.value);
                setTSQL(bTSQL.checked);
                setTSQLfreq(kTSQL.value);
                setDTCS(bDTCS.checked);
                setDTCScode(kDTCS.value);
                setReverseAction(bReverseAction.checked);
                setReversePolarity(bReversePolarity.checked);
                setScanLevel(bScanLevel.checked);
                setScanEdge(bScanEdge.checked);
                setAudioFilter(bAudioFilter.checked);
                setAudioFilterType(bAudioFilterPass.checked ? "PASSBAND" : "REJECTBAND");
            } else {
                lBusy.opacity = 0;
                if (bScanPlay.checked) {
                    bScanPlay.checked = false;
                    setScan(false);
                }
                if (bRecordPlay.checked) {
                    bRecordPlay.checked = false;
                    setRecord(false);
                }
                smeter.value = 0;
                bandscope.setData();
                bandspectrogram.setData();
            }
            powering = false;

        } else if (key === "openaudio") {
            outputdevicemode = value
            let avalue = value.split(",");

            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            spectrogram.setData();
            audiodeviceid = box.audioDevice_open(outputdevice.currentValue, value);
            setSrate(audiosettingsset.srate);
            setSBits(audiosettingsset.sbits);
            setCBits(audiosettingsset.cbits);
            setOgain(audiosettingsset.ogain);
            box.audioDevice_Processing.connect(audioDeviceProcessing);
            box.audioDevice_mute(audiodeviceid, bMute.checked);

            updateAudioFilter();

        } else if (key === "closeaudio") {
            box.audioDevice_Processing.disconnect(audioDeviceProcessing);
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            spectrogram.setData();
            audiodeviceid = -1;

        } else if (key === "busy") {
            busy = (value === "true");
            lBusy.opacity = (busy ? 1 : 0);
            if (scanwait) {
                if (busy)
                    scantimer.stop();
                else
                    scantimer.start();
            }
            if (bRecordPlay.checked && bRecordSQL.checked && !bRecordPause.checked)
                box.audioDevice_recordPause(audiodeviceid, !busy);

        } else if (key === "ctcss") {

        } else if (key === "vsc") {

        } else if (key === "smeter") {
            if (bPower.status !== 1)
                return;

            smeter.value = value;

        } else if (key === "afc") {
            if (bAFC.checked) {
                lLeft.opacity = 0;
                lRight.opacity = 0;
                if (value === "right") {
                    lRight.opacity = 1;
                    lRightTimer.start();
                } else if (value === "left") {
                    lLeft.opacity = 1;
                    lLeftTimer.start();
                }
            }

        } else if (key === "bscope") {
            if (bPower.status !== 1)
                return;

            let pos = 16 * parseInt(value[0], 16);
            let data = value.slice(1);
            let view = new Uint8Array(bscopearray, pos, 16);

            for (let i = 0; i < data.length / 2; i++)
                view[i] = 2 * parseInt(data.substr(2 * i, 2), 16);

        } else if (key === "dsp") {
            bDSP.enabled = (value === "true");

        } else if (key === "darc") {

        } else if (key === "scan") {
            if (value === "next")
                scanNext();
            else if (value === "hit")
                scanHit();
        }
    }


    function b_receivebin(key, value)
    {
        if (key === "audio") {
            if (bPower.status !== 1)
                return;

            if (audiosettingsset.cbits > 0)
                value = box.DSP_uncompress(value, audiosettingsset.cbits);

            audioData(value);
        }
    }


    function b_change(type)
    {
        if (type === "language") {
            setStep(kStep.value);
            setBank(kBank.value);
            setMem(kMem.value);
        }
    }


    function b_hotplug()
    {
        refreshDevices();
    }
    
    
    function refreshDevices()
    {
        outputdevicemodel.clear();
        
        let outputdevicelist = box.audioDevice_list("OUTPUT");
        for (let i = 0; i < outputdevicelist.length; i++)
            outputdevicemodel.append({value: outputdevicelist[i], text: box.audioDevice_description(outputdevicelist[i])});

        setOutputDevice(b_getvar("outputdevice", box.audioDevice_defaultOutput()));
    }
    
    
    function audioData(data)
    {
        if (bAudioFilter.checked)
            data = box.DSP_filter(dspid, data);

        box.audioDevice_write(audiodeviceid, data);
    }


    function audioDeviceProcessing(id, data)
    {
        if (id !== audiodeviceid)
            return;

        box.audioDevice_setBusy(id, true);

        if (timebutton.checked)
            graphtime.setData(box.viewSlice(data, 0, 4 * Math.ceil(graphtime.width)));
        else
            graphtime.setData();

        if (box.viewSize(data) < 4 * (1 << parseInt(Math.log2(audiosettingsset.srate / b_param("system.refreshrate"))))) {
            box.audioDevice_setBusy(id, false);
            return;
        }

        let fft;

        if (freqbutton.checked) {
            fft = box.DSP_FFT(dspid, box.viewSlice(data, 0, 16 * graphfreq.width), Math.ceil(graphfreq.width));
            graphfreq.setData(fft);
        } else
            graphfreq.setData();

        if (spectrogrambutton.checked) {
            if (!fft)
                fft = box.DSP_FFT(dspid, box.viewSlice(data, 0, 16 * spectrogram.width), Math.ceil(spectrogram.width));
            spectrogram.setData(fft);
        } else
            spectrogram.setData();

        box.audioDevice_setBusy(id, false);
    }


    function keyPressed(key)
    {
        if (key === Qt.Key_0 || key === Qt.Key_1 || key === Qt.Key_2 || key === Qt.Key_3 || key === Qt.Key_4 || key === Qt.Key_5 || key === Qt.Key_6 || key === Qt.Key_7 || key === Qt.Key_8 || key === Qt.Key_9) {
            if (!editing) {
                editingfreq = 0;
                editingdecimaldigit = -1;
                lFrequency.color = Qt.lighter(lFrequency.color, 0.5);
                editing = true;
            }
            if (editingdecimaldigit === -1) {
                editingfreq = 10 * editingfreq + (key - Qt.Key_0);
                if (editingfreq > maxfreq)
                    editingfreq = Math.floor(editingfreq / 10);
            } else {
                editingfreq += editingdecimaldigit * (key - Qt.Key_0);
                editingdecimaldigit /= 10;
            }
            lFrequency.text = editingfreq.toLocaleString(Qt.locale("de_DE"), "f", 0);
        } else if (key === Qt.Key_Period || key === Qt.Key_Comma) {
            if (editingfreq > 0 && editingfreq <= (maxfreq / 1000000)) {
                editingfreq *= 1000000;
                lFrequency.text = editingfreq.toLocaleString(Qt.locale("de_DE"), "f", 0);
                editingdecimaldigit = 100000;
            }
        } else if (key === Qt.Key_Escape) {
            if (editing) {
                lFrequency.text = parseInt(b_getvar("frequency", 0)).toLocaleString(Qt.locale("de_DE"), "f", 0);
                lFrequency.color = Qt.lighter(lFrequency.color, 2);
                editing = false;
            }
        } else if (key === Qt.Key_Backspace) {
            if (editingdecimaldigit === -1) {
                editingfreq = Math.floor(editingfreq / 10);
            } else {
                if (editingdecimaldigit < 100000) {
                    editingdecimaldigit *= 10;
                    let s = editingfreq.toString();
                    let n = s.length - editingdecimaldigit.toString().length;
                    editingfreq -= editingdecimaldigit * parseInt(s.slice(n, n + 1));
                }
            }
            lFrequency.text = editingfreq.toLocaleString(Qt.locale("de_DE"), "f", 0);
        } else if (key === Qt.Key_Enter || key === Qt.Key_Return) {
            if (editingfreq <= maxfreq && editingfreq > 0) {
                lFrequency.color = Qt.lighter(lFrequency.color, 2);
                kFrequency.value = editingfreq;
                setFrequency(editingfreq);
                editing = false;
            }
        }
    }


    function setPower(status)
    {
        powering = true;
        b_send("power", status);
    }


    function setOutputDevice(value)
    {
        let outputdevicename = b_getvar("outputdevice");
        outputdevice.currentIndex = Math.max(0, outputdevice.find(box.audioDevice_description(value)));
        b_setvar("outputdevice", outputdevice.currentValue);

        if (bPower.status === 1 && outputdevicename !== outputdevice.currentValue) {
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            spectrogram.setData();
            audiodeviceid = box.audioDevice_open(outputdevice.currentValue, outputdevicemode);
            setOgain(audiosettingsset.ogain);
            box.audioDevice_mute(audiodeviceid, bMute.checked);
        }
    }


    function setBandscopeButton(checked)
    {
        bandscopebutton.checked = checked;
        b_setvar("bandscopebutton", checked);
        setSpan(kSpan.value);
    }


    function setBandSpectrogramButton(checked)
    {
        bandspectrogrambutton.checked = checked;
        b_setvar("bandspectrogrambutton", checked);
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


    function setSpectrogramButton(checked)
    {
        spectrogrambutton.checked = checked;
        b_setvar("spectrogrambutton", checked);
    }


    function setToolsButton(checked)
    {
        toolsbutton.checked = checked;
        b_setvar("toolsbutton", checked);
    }


    function setSrate(value)
    {
        audiosettingsset.srate = value;
    }


    function setSBits(value)
    {
        audiosettingsset.sbits = value;
    }


    function setCBits(value)
    {
        audiosettingsset.cbits = value;
    }


    function setOgain(value)
    {
        audiosettingsset.ogain = value;
        box.audioDevice_setVolume(audiodeviceid, value / 100);
    }


    function setAFGain(value)
    {
        if (bPower.status === 1) {
            if (bMute.checked)
                b_send("afgain", 0);
            else
                b_send("afgain", value);
        }
        if (kAFGain.value === -1) {
            kAFGain.value = value;
            kAFGain.angle = (value - kAFGain.min) / kAFGain.step * kAFGain.anglestep;
        }
        b_setvar("afgain", value);
    }


    function setMute(checked)
    {
        setAFGain(kAFGain.value);
        bMute.checked = checked;
        b_setvar("mute", checked);
    }


    function setSquelch(value)
    {
        if (bPower.status === 1) {
            if (bMonitor.checked)
                b_send("squelch", 0);
            else
                b_send("squelch", value);
        }
        if (kSquelch.value === -1) {
            kSquelch.value = value;
            kSquelch.angle = (value - kSquelch.min) / kSquelch.step * kSquelch.anglestep;
        }
        b_setvar("squelch", value);
    }


    function setMonitor(checked)
    {
        setSquelch(kSquelch.value);
        bMonitor.checked = checked;
        b_setvar("monitor", checked);
    }


    function setIFShift(value)
    {
        if (kIFShift.value === -1) {
            kIFShift.value = value;
            kIFShift.angle = 20 + value / kIFShift.step * kIFShift.anglestep;
        }

        bandscope.reset();

        b_setvar("ifshift", value);
        if (bPower.status === 1)
            b_send("ifshift", value);
    }


    function centerIFShift()
    {
        kIFShift.value = -1;
        setIFShift(128);
    }


    function setSteps(value)
    {
        stepset.text = value.join();
    }


    function setStep(value)
    {
        let s = "";
        let n = steps[value];

        if (n < 1000)
            s = n + " Hz";
        else if (n < 1000000) {
            s = (n / 1000).toLocaleString(Qt.locale("en_US"), "f", 2);
            if (s.slice(-1) === "0")
                s = s.slice(0, s.length - 1);
            if (s.slice(-2) === ".0")
                s = s.slice(0, s.length - 2);
            s += " kHz";
        } else {
            s = (n / 1000000).toLocaleString(Qt.locale("en_US"), "f", 2);
            if (s.slice(-1) === "0")
                s = s.slice(0, s.length - 1);
            if (s.slice(-2) === ".0")
                s = s.slice(0, s.length - 2);
            s += " MHz";
        }

        lField1.text = b_translate("STEP") + ": " + s;
        if (kStep.value === -1) {
            kStep.value = value;
            kStep.angle = (value - kStep.min) / kStep.step * kStep.anglestep;
        }
        b_setvar("step", value);
    }


    function setBank(value)
    {
        if (kBank.value === -1) {
            kBank.value = value;
            kBank.angle = (value - kBank.min) / kBank.step * kBank.anglestep;
        }
        b_setvar("bank", value);

        let text = b_getvar("bank" + kBank.value, "");
        lField2.text = b_translate("BANK") + ": " + value + (text.length === 0 ? "" : " - ") + text;
        bankset.text = text;
        setMem(b_getvar("mem", 0));
    }


    function setMem(value)
    {
        if (kMem.value === -1) {
            kMem.value = value;
            kMem.angle = (value - kMem.min) / kMem.step * kMem.anglestep;
        }
        b_setvar("mem", value);

        let mem = b_getvar("bank" + kBank.value + ".mem" + value, "").split("!@!");
        lField3.text = b_translate("MEM") + ": " + value + (mem[0].length === 0 ? "" : " - ") + mem[0];

        memset.text = mem[0];

        if (mem.length > 1)
            setFrequency(mem[1]);

        if (mem.length > 2)
            setBand(mem[2]);

        if (mem.length > 3)
            setFilter(mem[3]);
    }


    function setFrequency(value)
    {
        kFrequency.value = value;
        lFrequency.text = kFrequency.value.toLocaleString(Qt.locale("de_DE"), "f", 0);
        if (kFrequency.value === -1)
            kFrequency.angle = value / kFrequency.step * kFrequency.anglestep;

        bandscope.reset();

        b_setvar("frequency", value);
        if (bPower.status === 1)
            b_send("freq", value);
    }


    function setBand(value)
    {
        bAM.checked = (value === "AM");
        bLSB.checked = (value === "LSB");
        bUSB.checked = (value === "USB");
        bCW.checked = (value === "CW");
        bFM.checked = (value === "FM");
        bWFM.checked = (value === "WFM");

        lField4.text = value;
        b_setvar("band", value);
        if (bPower.status === 1)
            b_send("band", value);

        if (value === "AM") {
            bFilter1.enabled = true;
            bFilter2.enabled = true;
            bFilter3.enabled = true;
            bFilter4.enabled = true;
            bFilter5.enabled = false;
            if (lField5.text === "230 kHz")
                setFilter("50 kHz");
        } else if (value === "USB" || value === "LSB" || value === "CW") {
            bFilter1.enabled = true;
            bFilter2.enabled = true;
            bFilter3.enabled = false;
            bFilter4.enabled = false;
            bFilter5.enabled = false;
            if (lField5.text === "15 kHz" || lField5.text === "50 kHz" || lField5.text === "230 kHz")
                setFilter("6 kHz");
        } else if (value === "FM") {
            bFilter1.enabled = false;
            bFilter2.enabled = true;
            bFilter3.enabled = true;
            bFilter4.enabled = true;
            bFilter5.enabled = false;
            if (lField5.text === "2.8 kHz")
                setFilter("6 kHz");
            if (lField5.text === "230 kHz")
                setFilter("50 kHz");
        } else if (value === "WFM") {
            bFilter1.enabled = false;
            bFilter2.enabled = false;
            bFilter3.enabled = false;
            bFilter4.enabled = true;
            bFilter5.enabled = true;
            if (lField5.text === "2.8 kHz" || lField5.text === "6 kHz" || lField5.text === "15 kHz")
                setFilter("50 kHz");
        }
    }


    function setFilter(value)
    {
        bFilter1.checked = (value === "2.8 kHz");
        bFilter2.checked = (value === "6 kHz");
        bFilter3.checked = (value === "15 kHz");
        bFilter4.checked = (value === "50 kHz");
        bFilter5.checked = (value === "230 kHz");

        lField5.text = value;
        b_setvar("filter", value);
        if (bPower.status === 1)
            b_send("filter", value);
    }


    function setVSC(value)
    {
        bVSC.checked = value;
        b_setvar("vsc", value);
        if (bPower.status === 1)
            b_send("vsc", value)
    }


    function setAFC(value)
    {
        bAFC.checked = value;
        b_setvar("afc", value);
        if (bPower.status === 1)
            b_send("afc", value)
    }


    function setNB(value)
    {
        bNB.checked = value;
        b_setvar("nb", value);
        if (bPower.status === 1)
            b_send("nb", value)
    }


    function setATT(value)
    {
        bATT.checked = value;
        b_setvar("att", value);
        if (bPower.status === 1)
            b_send("att", value)
    }


    function setAGC(value)
    {
        bAGC.checked = value;
        b_setvar("agc", value);
        if (bPower.status === 1)
            b_send("agc", value)
    }


    function setSpan(value)
    {
        if (value === 1) {
            tSpan.text = "50 kHz";
            kSpan.bandwidth = 50000;
        } else if (value === 2) {
            tSpan.text = "100 kHz";
            kSpan.bandwidth = 100000;
        } else if (value === 3) {
            tSpan.text = "200 kHz";
            kSpan.bandwidth = 200000;
        } else if (value === 4) {
            tSpan.text = "400 kHz";
            kSpan.bandwidth = 400000;
        } else if (value === 5) {
            tSpan.text = "1 MHz";
            kSpan.bandwidth = 1000000;
        }

        if (kSpan.value === -1) {
            kSpan.value = value;
            kSpan.angle = (value - kSpan.min) / kSpan.step * kSpan.anglestep;
        }

        bandscope.reset();

        b_setvar("span", value);
        if (bPower.status === 1)
            b_send("span", bandscopebutton.checked || bandspectrogrambutton.checked ? value : 0);
    }


    function setBandSampling(value)
    {
        tBandSampling.text = value;
        bandspectrogram.delay = 1 + 2 * value;

        if (kBandSampling.value === -1) {
            kBandSampling.value = value;
            kBandSampling.angle = (value - kBandSampling.min) / kBandSampling.step * kBandSampling.anglestep;
        }

        b_setvar("bandsampling", value);
        if (bPower.status === 1)
            b_send("bandsampling", value)
    }


    function setSampling(value)
    {
        tSampling.text = value;
        spectrogram.delay = value;

        if (kSampling.value === -1) {
            kSampling.value = value;
            kSampling.angle = (value - kSampling.min) / kSampling.step * kSampling.anglestep;
        }

        b_setvar("sampling", value);
        if (bPower.status === 1)
            b_send("sampling", value)
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


    function setDSP(value)
    {
        bDSP.checked = value;
        b_setvar("dsp", value);
        if (bPower.status === 1)
            b_send("dsp", value)

        bANF.enabled = bDSP.checked;
        kNR.enabled = bDSP.checked;
    }


    function setANF(value)
    {
        bANF.checked = value;
        b_setvar("anf", value);
        if (bPower.status === 1)
            b_send("anf", value)
    }


    function setNR(value)
    {
        if (kNR.value === -1) {
            kNR.value = value;
            kNR.angle = (value - kNR.min) / kNR.step * kNR.anglestep;
        }
        b_setvar("nr", value);
        if (bPower.status === 1)
            b_send("nr", value);
    }


    function setTSQL(value)
    {
        bTSQL.checked = value;
        if (bTSQL.checked && bDTCS.checked)
            setDTCS(false);

        b_setvar("tsql", value);
        kTSQL.enabled = value;
        tTSQL.color = (value ? bMute.contentItem.color : "transparent");
        bReverseAction.enabled = kTSQL.enabled || kDTCS.enabled;
        bReversePolarity.enabled = kDTCS.enabled;
        if (bPower.status === 1)
            b_send("tsql", value);
    }


    function setTSQLfreq(value)
    {
        if (kTSQL.value === -1) {
            kTSQL.value = value;
            kTSQL.angle = (value - kTSQL.min) / kTSQL.step * kTSQL.anglestep;
        }

        kTSQL.value = value;
        b_setvar("tsqlfreq", value);
        tTSQL.text = tsqlfreqs[value - 1];
        if (bPower.status === 1)
            b_send("tsqlfreq", value);
    }


    function setDTCS(value)
    {
        bDTCS.checked = value;
        if (bDTCS.checked && bTSQL.checked)
            setTSQL(false);

        b_setvar("dtcs", value);
        kDTCS.enabled = value;
        tDTCS.color = (value ? bMute.contentItem.color : "transparent");
        bReverseAction.enabled = kTSQL.enabled || kDTCS.enabled;
        bReversePolarity.enabled = kDTCS.enabled;
        if (bPower.status === 1)
            b_send("dtcs", value);
    }


    function setDTCScode(value)
    {
        if (kDTCS.value === -1) {
            kDTCS.value = value;
            kDTCS.angle = (value - kDTCS.min) / kDTCS.step * kDTCS.anglestep;
        }

        kDTCS.value = value;
        b_setvar("dtcscode", value);
        tDTCS.text = dtcscodes[value - 1];
        if (bPower.status === 1)
            b_send("dtcscode", value);
    }


    function setReverseAction(value)
    {
        bReverseAction.checked = value;
        b_setvar("reverseaction", value);
        if (bPower.status === 1)
            b_send("reverseaction", value);
    }


    function setReversePolarity(value)
    {
        bReversePolarity.checked = value;
        b_setvar("reversepolarity", value);
        if (bPower.status === 1)
            b_send("reversepolarity", value);
    }


    function setScan(value)
    {
        let ok = false;

        if (!value) {
            scanwait = false;
            scantimer.stop();
            bScanPause.checked = false;
            ok = true;
        } else {
            if (bScanFreq.checked) {
                if (scantofreq > scanfromfreq) {
                    setFrequency(scanfromfreq);
                    ok = true;
                }
            } else {
                if (scantobank >= scanfrombank) {
                    kBank.value = -1;
                    setBank(scanfrombank);
                    kMem.value = -1;
                    setMem(0);
                    ok = true;
                }
            }
        }

        if (!ok) {
            bScanPlay.checked = false;
            return;
        }

        bandscope.setData();

        if (bPower.status === 1)
            b_send("scan", value);
    }


    function setRecord(value)
    {
        if (value) {
            let filename = "_Save_" + new Date().toLocaleString(Qt.locale("de_DE"), "yyyy.MM.dd HH.mm.ss@") + lFrequency.text + " " + lField4.text + ".wav";
            updateRecordSize(44);
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


    function setScanFreq(value)
    {
        bScanFreq.checked = value;
        if (bScanFreq.checked && bScanBank.checked)
            setScanBank(false);

        b_setvar("scanfreq", value);

        if (bScanFreq.checked) {
            setScanFrom(scanfromfreq);
            setScanTo(scantofreq);
        }
    }


    function setScanBank(value)
    {
        bScanBank.checked = value;
        if (bScanBank.checked && bScanFreq.checked)
            setScanFreq(false);

        b_setvar("scanbank", value);

        if (bScanBank.checked) {
            setScanFrom(scanfrombank);
            setScanTo(scantobank);
        }
    }


    function setScanEdge(value)
    {
        bScanEdge.checked = value;
        if (bScanEdge.checked && bScanLevel.checked)
            setScanLevel(false);

        b_setvar("scanedge", value);
        if (bPower.status === 1)
            b_send("scanedge", value);
    }


    function setScanLevel(value)
    {
        bScanLevel.checked = value;
        if (bScanLevel.checked && bScanEdge.checked)
            setScanEdge(false);

        b_setvar("scanlevel", value);
        if (bPower.status === 1)
            b_send("scanlevel", value);
    }


    function setScanDelay(value)
    {
        if (kScanDelay.value === -1) {
            kScanDelay.value = value;
            kScanDelay.angle = (value - kScanDelay.min) / kScanDelay.step * kScanDelay.anglestep;
        }

        kScanDelay.value = value;
        b_setvar("scandelay", value);
    }


    function setScanFrom(value)
    {
        if (bScanFreq.checked) {
            tScanFrom.text = parseInt(value).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz";
            scanfromfreq = value;
            b_setvar("scanfromfreq", value);
        } else {
            tScanFrom.text = b_translate("Bank") + " " + value;
            scanfrombank = value;
            b_setvar("scanfrombank", value);
        }
    }


    function setScanTo(value)
    {
        if (bScanFreq.checked) {
            tScanTo.text = parseInt(value).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz";
            scantofreq = value;
            b_setvar("scantofreq", value);
        } else {
            tScanTo.text = b_translate("Bank") + " " + value;
            scantobank = value;
            b_setvar("scantobank", value);
        }
    }


    function scanNext()
    {
        if (bScanPause.checked)
            return;

        if (bScanFreq.checked) {
            let freq = kFrequency.value + parseInt(steps[kStep.value]);
            if (freq > scantofreq)
                freq = scanfromfreq;
            kFrequency.angle += kFrequency.anglestep;
            setFrequency(freq);
            b_send("scan", bScanPlay.checked);
        } else {
            scanwait = false;
            let bank = kBank.value;
            let mem = kMem.value;
            let ibank = bank;
            let imem = mem;
            let found = false;
            let notfound = false;
            while (!found && !notfound) {
                mem++;
                if (mem > maxmem) {
                    mem = 0;
                    bank++;
                    if (bank > scantobank)
                        bank = scanfrombank;
                }
                if (bank === ibank && mem === imem)
                    notfound = true;
                if (b_getvar("bank" + bank + ".mem" + mem, "NO") !== "NO")
                    found = true;
            }
            if (notfound)
                setScan(false);
            else if (found) {
                kBank.value = -1;
                setBank(bank);
                kMem.value = -1;
                setMem(mem);
                b_send("scan", bScanPlay.checked);
            }
        }
    }


    function scanHit()
    {
        if (bScanFreq.checked) {
            let found = false;
            let mem = -1;
            let v;
            for (let i = 0; i <= maxmem; i++) {
                v = b_getvar("bank" + kBank.value + ".mem" + i, "free");
                if (v === "free") {
                    mem = i;
                    break;
                } else if (v.includes(kFrequency.value + "!@!" + lField4.text + "!@!" + lField5.text)) {
                    mem = i;
                    found = true;
                    break;
                }
            }
            if (mem === -1) {
                bScanPlay.checked = false;
                setScan(false);
                return;
            }
            if (!found) {
                b_setvar("bank" + kBank.value + ".mem" + mem, "Scan" + "!@!" + kFrequency.value + "!@!" + lField4.text + "!@!" + lField5.text);
                kMem.value = -1;
                setMem(mem);
            }
            scantimer.start();
        } else {
            scanwait = true;
        }
    }


    function updateRecordSize(id, size)
    {
        if (id !== audiodeviceid)
            return;

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
