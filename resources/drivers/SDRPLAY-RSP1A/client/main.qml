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

// SDRPLAY-RSP1A - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property bool   bandscopesetactive
    property bool   audiosettingsactive
    property bool   bankactive
    property bool   busy
    property bool   delbankallactive
    property bool   editing
    property bool   keypadactive
    property bool   memactive
    property bool   powering
    property bool   scroll
    property bool   stepactive
    property int    audiodeviceid
    property int    dspid
    property int    editingdecimaldigit
    property int    editingfreq
    property int    maxbank
    property int    maxfreq
    property int    maxmem
    property int    tau
    property int    vsample
    property string outputdevice
    property string outputdevicemode
    property var    box
    property var    bscopearray
    property var    freqs: [63000, 126000, 252000, 504000, 756000, 1008000, 1512000, 2016000, 3000000, 4032000, 5040000, 6048000, 7056000, 8064000, 9216000, 10080000, 11088000, 12096000]
    property var    gains
    property var    stdsteps
    property var    steps

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

                       if (bandscopesetactive) {
                           if (!bandscopeset.contains(bandscopeset.mapFromGlobal(p)) && !bBandscopeset.contains(bBandscopeset.mapFromGlobal(p))) {
                               bandscopesetactive = false;
                               bBandscopeset.checked = false;
                           }
                       }

                       if (!outputdevice.contains(outputdevice.mapFromGlobal(p))) outputdevice.popup.close();
                       if (!cFiles.contains(cFiles.mapFromGlobal(p))) cFiles.popup.close();
                       if (!cRemoteFiles.contains(cRemoteFiles.mapFromGlobal(p))) cRemoteFiles.popup.close();
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
        Keys.onPressed: (event)=> keyPressed(event.key);
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
                        duration: b_param("ui.animationdelay")
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
            width: b_width
            height: b_height - topbuttons.height - parent.spacing
            contentHeight: contentItem.childrenRect.height
            clip: true
            interactive: scroll && (contentHeight > height)
            onDraggingChanged: {if (!dragging && (b_os === "ios" || b_os === "android")) flick(-horizontalVelocity, -verticalVelocity);}
            onContentHeightChanged: main.heightChanged();
            TColumn {
                spacing: 0
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
                                        id: textfields
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
                                                width: 2.7 * b_unit
                                                height: 0.4 * b_unit
                                                horizontalAlignment: Text.AlignRight
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField5
                                                name: "displaytext"
                                                width: 2.7 * b_unit
                                                height: 0.4 * b_unit
                                                horizontalAlignment: Text.AlignRight
                                                font.pixelSize: height
                                            }
                                            TLabel {
                                                id: lField6
                                                name: "displaytext"
                                                width: 2.7 * b_unit
                                                height: 0.4 * b_unit
                                                horizontalAlignment: Text.AlignRight
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
                                            max: 100
                                            step: 5
                                            anglestep: 17
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
                                            max: 100
                                            step: 5
                                            anglestep: 17
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
                                            text: "PPM"
                                        }
                                        TKnob {
                                            id: kIFShift
                                            width: b_unit
                                            height: b_unit
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            min: -99
                                            max: 99
                                            step: 1
                                            anglestep: 10
                                            value: -999
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
                                        b_setvar("bank" + kBank.value + ".mem" + kMem.value, text + "!@!" + kFrequency.value + "!@!" + lField4.text + "!@!" + kFilter.value + "!@!" + kRFGain.value);
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
                                anchors.horizontalCenter: parent.horizontalCenter
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
                                TColumn {
                                    width: 1.7 * b_unit
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
                                    TButton {
                                        id: bDSB
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("DSB")
                                        onClicked: setBand("DSB");
                                    }
                                }
                            }
                        }
                        TColumn {
                            width: 3 * b_unit
                            height: 6 * b_unit
                            spacing: 0.1 * b_unit
                            TLabel {
                                id: image
                                name: "applogo"
                                width: 2.9 * b_unit
                                height: width / 3.75
                            }
                            TLabel {
                                id: tuner
                                name: "tuner"
                                width: 3 * b_unit
                                height: 0.4 * b_unit
                                horizontalAlignment: Text.AlignHCenter
                                font.pixelSize: height
                                font.weight: Font.Black
                            }
                            TRow {
                                spacing: 0
                                TColumn {
                                    spacing: b_space
                                    Rectangle {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.03 * b_unit
                                        color: "transparent"
                                    }
                                    TLabel {
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                        text: b_translate("SAMPLING")
                                    }
                                    TKnob {
                                        id: kSample
                                        height: b_unit
                                        width: height
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        min: 0
                                        max: freqs.length - 1
                                        step: 1
                                        anglestep: 18
                                        value: -1
                                        enabled: !(bRecordPlay.checked && bRecordRAW.checked) && !bPlayPlay.checked
                                        onValueChanged: setSample(value);
                                        onPressedChanged: scroll = !pressed;
                                    }
                                    TLabel {
                                        id: tSample
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                    }
                                    Rectangle {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.02 * b_unit
                                        color: "transparent"
                                    }
                                    TLabel {
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                        text: b_translate("RF GAIN")
                                    }
                                    TKnob {
                                        id: kRFGain
                                        height: b_unit
                                        width: height
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        step: 1
                                        anglestep: 13
                                        value: -1
                                        onValueChanged: setRFGain(value);
                                        onPressedChanged: scroll = !pressed;
                                    }
                                    TLabel {
                                        id: tRFGain
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                    }
                                    Rectangle {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.02 * b_unit
                                        color: "transparent"
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
                                TColumn {
                                    spacing: b_space
                                    Rectangle {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.03 * b_unit
                                        color: "transparent"
                                    }
                                    TLabel {
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                        text: b_translate("FILTER")
                                    }
                                    TKnob {
                                        id: kFilter
                                        height: b_unit
                                        width: height
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        min: 1
                                        max: 28
                                        step: 1
                                        anglestep: 13
                                        value: -1
                                        onValueChanged: setFilter(value);
                                        onPressedChanged: scroll = !pressed;
                                    }
                                    TLabel {
                                        id: tFilter
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                    }
                                    Rectangle {
                                        width: 1.5 * b_unit
                                        height: 0.02 * b_unit
                                        color: "transparent"
                                    }
                                    TLabel {
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                        text: b_translate("BW")
                                    }
                                    TKnob {
                                        id: kBandwidth
                                        height: b_unit
                                        width: height
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        min: 0
                                        max: 8
                                        step: 1
                                        anglestep: 13
                                        value: -1
                                        onValueChanged: setBandwidth(value);
                                        onPressedChanged: scroll = !pressed;
                                    }
                                    TLabel {
                                        id: tBandwidth
                                        width: 1.5 * b_unit
                                        height: 0.3 * b_unit
                                        font.pixelSize: height
                                        horizontalAlignment: Text.AlignHCenter
                                    }
                                    Rectangle {
                                        width: 1.5 * b_unit - b_space
                                        height: 0.02 * b_unit
                                        color: "transparent"
                                    }
                                    TButton {
                                        id: bBiasT
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        checkable: true
                                        text: b_translate("BIAS T")
                                        onClicked: setBiasT(checked);
                                    }
                                }
                            }
                        }
                    }
                }
                Rectangle {
                    height: b_space
                    width: b_width
                    color: "transparent"
                }
                TGroupBox {
                    id: gbandscope
                    width: b_width
                    height: bandscopebutton.checked ? bandscope.height + 3 * b_space : 0
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
                            height: bandscope.height
                            font.pixelSize: width
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            text: b_translate("BANDSCOPE")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: bandscope
                            property real h: b_getvar("hbandscope", 3.5);
                            width: gbandscope.width - 1.9 * b_unit - 5 * b_space
                            height: h * b_unit
                            filled: true
                            logarithmic: true
                            average: true
                            onHeightChanged: updatedBGrid();
                            children: [
                                Repeater {
                                    id: dbgrid
                                    model: 17
                                    Rectangle {
                                        property string text: ""
                                        width: parent.width
                                        height: 0.99
                                        color: b_theme("TGraph", "", "axiscolor")
                                        x: 0
                                        y: 0
                                        smooth: false
                                        visible: false
                                        Text {
                                            width: 1.25 * b_unit
                                            horizontalAlignment: Text.AlignRight
                                            font.pixelSize: 0.35 * b_unit
                                            color: b_theme("TGraph", "", "axiscolor")
                                            text: parent.text
                                            y: -font.pixelSize - b_space
                                        }
                                    }
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
                                TLabel {
                                    id: filterscope
                                    name: "filterbox"
                                    x: Math.max((bandscope.width - width) / 2, 0)
                                    y: 0
                                    width: Math.min(bandscope.width * 1000 * filterFreq(kFilter.value) / vsample * (1 << bandscopeset.zoom), bandscope.width)
                                    height: parent.height
                                },
                                TLabel {
                                    id: cbandscope
                                    anchors.fill: parent
                                    font.pixelSize: 0.4 * b_unit
                                    color: parent.signalcolor
                                    horizontalAlignment: Text.AlignRight
                                    verticalAlignment: Text.AlignTop
                                },
                                MouseArea {
                                    property real initpos: 0
                                    property real initfreq: 0
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onReleased: {
                                        if (mouseX === initpos) {
                                            let f = kFrequency.value + (mouseX - width / 2) / width * vsample / (1 << bandscopeset.zoom);
                                            f = steps[kStep.value] * Math.round(f / steps[kStep.value]);
                                            if (!editing && f !== kFrequency.value) {
                                                setFrequency(f);
                                                cbandscope.text = ftext(f, mouseX, width);
                                            }
                                        }
                                    }
                                    onPressed: {
                                        initpos = mouseX;
                                        initfreq = kFrequency.value;
                                    }
                                    onExited: cbandscope.text = "";
                                    onPositionChanged: {
                                        cbandscope.text = ftext(kFrequency.value, mouseX, width);
                                        if (pressed) {
                                            let f = initfreq + (initpos - mouseX) / width * vsample / (1 << bandscopeset.zoom);
                                            f = steps[kStep.value] * Math.round(f / steps[kStep.value]);
                                            if (!editing && f !== kFrequency.value) {
                                                kFrequency.value = f;
                                                setFrequency(f);
                                                cbandscope.text = ftext(f, mouseX, width);
                                            }
                                        }
                                    }
                                    onWidthChanged: b_send("width", Math.ceil(width));
                                }
                            ]
                        }
                        TColumn {
                            spacing: 0.5 * b_space
                            width: 1.5 * b_unit
                            TLabel {
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                                text: b_translate("DELAY")
                            }
                            TKnob {
                                id: kSpecSampling
                                height: b_unit
                                width: height
                                anchors.horizontalCenter: parent.horizontalCenter
                                min: 0
                                max: 10
                                step: 1
                                anglestep: 35
                                value: -1
                                onValueChanged: setSpecSampling(value);
                                onPressedChanged: scroll = !pressed;
                            }
                            TLabel {
                                id: tSpecSampling
                                width: 1.5 * b_unit
                                height: 0.3 * b_unit
                                font.pixelSize: height
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }
                            Rectangle {
                                width: b_unit
                                height: 0.5 * b_space
                                color: "transparent"
                            }
                            TButton {
                                id: bBandscopeset
                                name: "setbutton"
                                width: 1.5 * b_unit - b_space
                                height: 0.7 * b_unit
                                anchors.horizontalCenter: parent.horizontalCenter
                                checkable: true
                                tooltiptext: b_translate("Configure bandscope")
                                onPressed: bandscopesetactive = !bandscopesetactive
                            }
                            Rectangle {
                                width: b_unit
                                height: bandscope.height - 3.2 * b_unit
                                color: "transparent"
                            }
                            TButton {
                                name: "resizebutton"
                                width: 0.5 * b_unit
                                height: width
                                anchors.horizontalCenter: parent.horizontalCenter
                                tooltiptext: b_translate("Resize")
                                MouseArea {
                                    property real a: 0
                                    anchors.fill: parent
                                    cursorShape: Qt.SizeVerCursor
                                    onPressed: {
                                        scroll = false;
                                        a = bandscope.h - mapToGlobal(mouse.x, mouse.y).y / b_unit;
                                    }
                                    onReleased: scroll = true;
                                    onPositionChanged: {
                                        bandscope.h = Math.min(14, Math.max(3.5, a + mapToGlobal(mouse.x, mouse.y).y / b_unit));
                                        b_setvar("hbandscope", bandscope.h);
                                    }
                                }
                            }
                        }
                    }
                    SetBandscope {
                        id: bandscopeset
                        name: "keypad"
                        x: bandscope.x + bandscope.width - width
                        y: bBandscopeset.y + bBandscopeset.height - height
                        width: bandscopesetactive ? 5.6 * b_unit : 0
                        height: 2.2 * b_unit
                        implicitHeight: 0
                        Behavior on width {
                            id: abandscopeset
                            PropertyAnimation {
                                duration: b_param("ui.animationdelay")
                                easing.type: Easing.InOutQuad
                                onRunningChanged: abandscopeset.enabled = !abandscopeset.enabled;
                            }
                        }
                    }
                }
                Rectangle {
                    height: bandscopebutton.checked ? b_space : 0
                    width: b_width
                    color: "transparent"
                }
                TGroupBox {
                    id: gbandspectrogram
                    width: b_width
                    height: bandspectrogrambutton.checked ? bandspectrogram.height + 3 * b_space : 0
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
                            height: bandspectrogram.height
                            font.pixelSize: width
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            text: b_translate("BAND SPECTROGRAM")
                            rotation: -90
                            transformOrigin: Item.Center
                        }
                        TGraph {
                            id: bandspectrogram
                            property real h: b_getvar("hbandspectrogram", 3.5);
                            width: gbandspectrogram.width - 1.9 * b_unit - 5 * b_space
                            height: h * b_unit
                            spectrogram: true
                            logarithmic: true
                            average: true
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
                                    onPositionChanged: cbandspectrogram.text = ftext(kFrequency.value, mouseX, width);
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
                            Rectangle {
                                width: b_unit
                                height: bandspectrogram.height - 2.75 * b_unit
                                color: "transparent"
                            }
                            TButton {
                                name: "resizebutton"
                                width: 0.5 * b_unit
                                height: width
                                anchors.horizontalCenter: parent.horizontalCenter
                                tooltiptext: b_translate("Resize")
                                MouseArea {
                                    property real a: 0
                                    anchors.fill: parent
                                    cursorShape: Qt.SizeVerCursor
                                    onPressed: {
                                        scroll = false;
                                        a = bandspectrogram.h - mapToGlobal(mouse.x, mouse.y).y / b_unit;
                                    }
                                    onReleased: scroll = true;
                                    onPositionChanged: {
                                        bandspectrogram.h = Math.min(14, Math.max(3.5, a + mapToGlobal(mouse.x, mouse.y).y / b_unit));
                                        b_setvar("hbandspectrogram", bandspectrogram.h);
                                    }
                                }
                            }
                        }
                    }
                }
                Rectangle {
                    height: bandspectrogrambutton.checked ? b_space : 0
                    width: b_width
                    color: "transparent"
                }
                Grid {
                    id: afgrid
                    width: b_width
                    spacing: b_space
                    padding: 0
                    rows: 3
                    onWidthChanged: updateAfGrid();
                    GroupBox {
                        id: gtime
                        width: b_width
                        height: timebutton.checked ? graphtime.height + 3 * b_space : 0
                        leftPadding: 0
                        rightPadding: 0
                        topPadding: 0
                        bottomPadding: 0
                        clip: true
                        background: Rectangle {
                            color: "transparent"
                            border.width: 0
                        }
                        Behavior on height {
                            id: atime
                            PropertyAnimation {
                                duration: b_param("ui.animationdelay")
                                easing.type: Easing.InOutQuad
                                onRunningChanged: {
                                    if (timebutton.checked && running || !timebutton.checked && !running)
                                        updateAfGrid();
                                    atime.enabled = !atime.enabled;
                                }
                            }
                        }
                        TGroupBox {
                            width: gtime.width
                            TRow {
                                spacing: b_space
                                TLabel {
                                    width: 0.3 * b_unit
                                    height: graphtime.height
                                    font.pixelSize: width
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("TIME")
                                    rotation: -90
                                    transformOrigin: Item.Center
                                }
                                TGraph {
                                    id: graphtime
                                    width: gtime.width - 1.9 * b_unit - 5 * b_space
                                    height: 3.5 * b_unit
                                }
                            }
                        }
                    }
                    GroupBox {
                        id: gfrequency
                        width: b_width
                        height: freqbutton.checked ? graphfreq.height + 3 * b_space : 0
                        leftPadding: 0
                        rightPadding: 0
                        topPadding: 0
                        bottomPadding: 0
                        clip: true
                        background: Rectangle {
                            color: "transparent"
                            border.width: 0
                        }
                        Behavior on height {
                            id: afrequency
                            PropertyAnimation {
                                duration: b_param("ui.animationdelay")
                                easing.type: Easing.InOutQuad
                                onRunningChanged: {
                                    if (freqbutton.checked && running || !freqbutton.checked && !running)
                                        updateAfGrid();
                                    atime.enabled = !atime.enabled;
                                }
                            }
                        }
                        TGroupBox {
                            width: gfrequency.width
                            TRow {
                                spacing: b_space
                                TLabel {
                                    width: 0.3 * b_unit
                                    height: graphfreq.height
                                    font.pixelSize: width
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("FREQUENCY")
                                    rotation: -90
                                    transformOrigin: Item.Center
                                }
                                TGraph {
                                    id: graphfreq
                                    width: gfrequency.width - 1.9 * b_unit - 5 * b_space
                                    height: 3.5 * b_unit
                                    filled: true
                                    logarithmic: true
                                    logmin: 85
                                    logmax: 0
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
                    }
                    GroupBox {
                        id: gspectrogram
                        width: b_width
                        height: spectrogrambutton.checked ? spectrogram.height + 3 * b_space : 0
                        leftPadding: 0
                        rightPadding: 0
                        topPadding: 0
                        bottomPadding: 0
                        clip: true
                        background: Rectangle {
                            color: "transparent"
                            border.width: 0
                        }
                        Behavior on height {
                            id: aspectrogram
                            PropertyAnimation {
                                duration: b_param("ui.animationdelay")
                                easing.type: Easing.InOutQuad
                                onRunningChanged: {
                                    if (spectrogrambutton.checked && running || !spectrogrambutton.checked && !running)
                                        updateAfGrid();
                                    atime.enabled = !atime.enabled;
                                }
                            }
                        }
                        TGroupBox {
                            width: gspectrogram.width
                            TRow {
                                spacing: b_space
                                TLabel {
                                    width: 0.3 * b_unit
                                    height: spectrogram.height
                                    font.pixelSize: width
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("SPECTROGRAM")
                                    rotation: -90
                                    transformOrigin: Item.Center
                                }
                                TGraph {
                                    id: spectrogram
                                    width: gspectrogram.width - 1.9 * b_unit - 5 * b_space
                                    height: 3.5 * b_unit
                                    spectrogram: true
                                    logarithmic: true
                                    logmin: 85
                                    logmax: 0
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
                                    id: bunfilter
                                    width: 1.5 * b_unit - b_space
                                    height: b_unit
                                    font.pixelSize: 0.3 * b_unit
                                    checkable: true
                                    text: "NO\nFILTER"
                                    tooltiptext: b_translate("Unfiltered audio output")
                                    onClicked: unfilter(checked);
                                }
                                TLabel {
                                    width: 1.5 * b_unit - b_space
                                    height: 0.4 * b_unit
                                    font.pixelSize: 0.3 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("DEEMPH")
                                }
                                TButton {
                                    id: btau50
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: "50 μs"
                                    onClicked: settau(50);
                                }
                                TButton {
                                    id: btau75
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: "75 μs"
                                    onClicked: settau(75);
                                }
                                TButton {
                                    id: btau0
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: "OFF"
                                    onClicked: settau(0);
                                }
                            }
                        }
                        TGroupBox {
                            width: 1.5 * b_unit + 2 * b_space
                            height: tools.height - 3 * b_space
                            padding: b_space
                            TColumn {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 2 * b_space
                                TButton {
                                    id: bNR
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    checkable: true
                                    text: b_translate("NR")
                                    tooltiptext: b_translate("Noise reduction")
                                    onClicked: setNR(checked);
                                }
                                TLabel {
                                    width: 1.5 * b_unit - b_space
                                    height: 0.7 * b_unit
                                    font.pixelSize: 0.35 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    enabled: bNR.checked
                                    text: b_translate("LEVEL")
                                }
                                TKnob {
                                    id: kNR
                                    width: height
                                    height: b_unit
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    min: 0.0
                                    max: 1.0
                                    step: 0.05
                                    anglestep: 18
                                    value: -1
                                    enabled: bNR.checked
                                    onValueChanged: setNRLevel(value);
                                    onPressedChanged: scroll = !pressed;
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
                                    spacing: b_space
                                    TButton {
                                        id: bRecordPlay
                                        name: "recordstopbutton"
                                        width: 0.85 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        enabled: bPower.status === 1
                                        checkable: true
                                        tooltiptext: b_translate("Record / Stop")
                                        onClicked: setRecord(checked)
                                    }
                                    TButton {
                                        id: bRecordPause
                                        name: "pausebutton"
                                        width: 0.85 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        checkable: true
                                        enabled: bRecordPlay.checked
                                        tooltiptext: b_translate("Pause")
                                        onClicked: setRecordPause(checked)
                                    }
                                    TButton {
                                        id: bRecordRAW
                                        width: 1.5 * b_unit - b_space
                                        height: 0.7 * b_unit
                                        checkable: true
                                        enabled: !bRecordPlay.checked
                                        text: b_translate("RAW")
                                        tooltiptext: b_translate("I/Q data")
                                        onClicked: setRecordRAW(checked)
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
                        TGroupBox {
                            width: 6.6 * b_unit + b_space
                            height: tools.height - 3 * b_space
                            padding: 2 * b_space
                            TColumn {
                                spacing: 2 * b_space
                                TButton {
                                    id: bPlayPlay
                                    width: 6.6 * b_unit - 2 * b_space
                                    height: 0.7 * b_unit
                                    enabled: cRemoteFiles.count > 0
                                    checkable: true
                                    text: b_translate("PLAY FROM RAW")
                                    onClicked: {
                                        if (checked)
                                            b_send("rawfile", convertFileName(cRemoteFiles.currentText));
                                        else
                                            b_send("rawfile", "");
                                    }
                                }
                                TLabel {
                                    id: tRemoteFiles
                                    width: 1.5 * b_unit - 2 * b_space
                                    height: 0.35 * b_unit
                                    font.pixelSize: height
                                    verticalAlignment: Text.AlignVCenter
                                    text: b_translate("FILES")
                                }
                                TComboBox {
                                    id: cRemoteFiles
                                    name: "cfiles"
                                    width: 6.6 * b_unit - 2 * b_space
                                    height: b_unit
                                    font.pixelSize: 0.28 * height
                                    model: ListModel {
                                        id: cRemoteFilesItems
                                    }
                                    onActivated: {
                                        if (bPlayPlay.checked)
                                            b_send("rawfile", convertFileName(cRemoteFiles.currentText));
                                        showFormat();
                                    }
                                }
                                TLabel {
                                    id: tRemoteFile
                                    width: 1.5 * b_unit - 2 * b_space
                                    height: 0.35 * b_unit
                                    font.pixelSize: height
                                    verticalAlignment: Text.AlignVCenter
                                }
                            }
                        }
                    }
                }
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
        maxfreq = 2000000000;
        maxbank = 999;
        maxmem = 999;
        scroll = true;
        bscopearray = new ArrayBuffer(256);
        stdsteps = "1,10,20,50,100,500,1000,2500,5000,6250,8333,9000,10000,12500,15000,20000,25000,30000,50000,100000,125000,150000,200000,500000,1000000,10000000";
        steps = stdsteps.split(",");
        gains = [];

        let freq = b_getvar("frequency", 100000000);
        let band = b_getvar("band", "AM");
        let filt = b_getvar("filter", 20);

        refreshDevices();

        setSrate(b_getvar("srate", 32000));
        setSBits(b_getvar("sbits", 32));
        setCBits(b_getvar("cbits", 0));
        setOgain(b_getvar("ogain", 100));
        setBandscopeButton(b_getvar("bandscopebutton", "false") === "true");
        setBandSpectrogramButton(b_getvar("bandspectrogrambutton", "false") === "true");
        setTimeButton(b_getvar("timebutton", "false") === "true");
        setFreqButton(b_getvar("freqbutton", "false") === "true");
        setSpectrogramButton(b_getvar("spectrogrambutton", "false") === "true");
        setToolsButton(b_getvar("toolsbutton", "false") === "true");
        setAFGain(b_getvar("afgain", 50));
        setMute(b_getvar("mute", "false") === "true");
        setSquelch(b_getvar("squelch", 0));
        setMonitor(b_getvar("monitor", "false") === "true");
        setIFShift(b_getvar("ifshift", 0));
        setSteps(b_getvar("steps", stdsteps).split(","));
        setStep(b_getvar("step", 19));
        setBank(b_getvar("bank", 0)); // setMem not needed
        setFrequency(freq);
        setBand(band);
        setAGC(b_getvar("agc", "false") === "true");
        kFilter.value = -1;
        setFilter(filt);
        setSample(b_getvar("sample", 7));
        setBandSampling(b_getvar("bandsampling", 0));
        setSpecSampling(b_getvar("specsampling", 0));
        setOffset(b_getvar("offset", 120));
        setRefer(b_getvar("refer", 0));
        setZoom(b_getvar("zoom", 0));
        setFFT(b_getvar("fft", -1));
        setSampling(b_getvar("sampling", 0));
        setAudioFilterType(b_getvar("audiofiltertype", "PASSBAND"));
        setAudioFilter(b_getvar("audiofilter", "false") === "true");
        setNR(b_getvar("NR", "false") === "true");
        settau(b_getvar("tau", 50));
        unfilter(b_getvar("unfilter", false) === "true");
        setNRLevel(b_getvar("NRlevel", 0));
        setRecordRAW(b_getvar("recordraw", "false") === "true");
        setRecordSQL(b_getvar("recordsql", "false") === "true");
        setBandwidth(b_getvar("bandwidth", 8));
        updateFiles();

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
                settau(tau);
                unfilter(bunfilter.checked);
                setBandwidth(kBandwidth.value);
                setAGC(bAGC.checked);
                setRFGain(kRFGain.value);
                setFilter(kFilter.value);
                setSample(kSample.value);
                setBandSampling(kBandSampling.value);
                setSpecSampling(kSpecSampling.value);
                setOffset(bandscopeset.offset);
                setRefer(bandscopeset.refer);
                setZoom(bandscopeset.zoom);
                setFFT(bandscopeset.fft);
                setSampling(kSampling.value);
                setAudioFilter(bAudioFilter.checked);
                setAudioFilterType(bAudioFilterPass.checked ? "PASSBAND" : "REJECTBAND");
                setBiasT(bBiasT.checked);
            } else {
                lBusy.opacity = 0;
                if (bRecordPlay.checked) {
                    bRecordPlay.checked = false;
                    setRecord(false);
                }
                smeter.value = 0;
                bandscope.setData();
                bandspectrogram.setData();
                graphtime.setData();
                graphfreq.setData();
                bandscope.setData();
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
            box.audioDevice_mute(audiodeviceid, bMute.checked);
            box.audioDevice_Processing.connect(audioDeviceProcessing);

            updateAudioFilter();

        } else if (key === "closeaudio") {
            box.audioDevice_Processing.disconnect(audioDeviceProcessing);
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            spectrogram.setData();
            audiodeviceid = -1;

        } else if (key === "tuner") {
            tuner.text = value;
            setBiasT(b_getvar("biast", "false") === "true");

        } else if (key === "rfgains") {
            gains = value.split(",");
            setRFGain(b_getvar("rfgain", parseInt(gains.length / 2)));

        } else if (key === "busy") {
            busy = (value === "true");
            lBusy.opacity = (busy ? 1 : 0);
            if (bRecordPlay.checked && bRecordSQL.checked && !bRecordPause.checked) {
                if (bRecordRAW.checked)
                    b_send("record", busy ? "start" : "stop");
                else
                    box.audioDevice_recordPause(audiodeviceid, !busy);
            }

        } else if (key === "smeter") {
            if (bPower.status !== 1)
                return;
            smeter.value = value * 26 / 100;

        } else if (key === "samplerate") {
            vsample = value;
            checkFilter();
            bandscope.reset();
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

        } else if (key === "bscopebspect") {
            if (bPower.status !== 1)
                return;
            if (bandscopebutton.checked)
                bandscope.setData(value);
            if (bandspectrogrambutton.checked)
                bandspectrogram.setData(value);

        } else if (key === "bscope") {
            if (bPower.status !== 1)
                return;
            if (bandscopebutton.checked)
                bandscope.setData(value);

        } else if (key === "bspect") {
            if (bPower.status !== 1)
                return;
            if (bandspectrogrambutton.checked)
                bandspectrogram.setData(value);

        } else if (key === "raw")
            box.audioDevice_recordWrite(audiodeviceid, value);
    }


    function b_change(type)
    {
        if (type === "language") {
            showFormat();
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
        if (bNR.checked)
            data = box.DSP_NR(dspid, data, kNR.value);

        if (bAudioFilter.checked)
            data = box.DSP_filter(dspid, data);

        box.audioDevice_write(audiodeviceid, data);
    }


    function audioDeviceProcessing(devid, data)
    {
        if (bPower.status !== 1)
            return;

        if (devid !== audiodeviceid)
            return;

        box.audioDevice_setBusy(devid, true);

        if (timebutton.checked)
            graphtime.setData(box.viewSlice(data, 0, 4 * Math.ceil(graphtime.width)));
        else
            graphtime.setData();

        if (box.viewSize(data) < 4 * (1 << parseInt(Math.log2(audiosettingsset.srate / b_param("system.refreshrate"))))) {
            box.audioDevice_setBusy(devid, false);
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

        box.audioDevice_setBusy(devid, false);
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
        b_send("specsampling", checked ? kSpecSampling.value : -1);
    }


    function setBandSpectrogramButton(checked)
    {
        bandspectrogrambutton.checked = checked;
        b_setvar("bandspectrogrambutton", checked);
        b_send("bandsampling", checked ? kBandSampling.value : -1);
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
        if (bPower.status === 1)
            b_send("afgain", value);

        if (kAFGain.value === -1) {
            kAFGain.value = value;
            kAFGain.angle = (value - kAFGain.min) / kAFGain.step * kAFGain.anglestep;
        }
        b_setvar("afgain", value);
    }


    function setMute(value)
    {
        box.audioDevice_mute(audiodeviceid, value);
        bMute.checked = value;
        b_setvar("mute", value);
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
        if (kIFShift.value === -999) {
            kIFShift.value = value;
            kIFShift.angle = 180 + value / kIFShift.step * kIFShift.anglestep;
        }

        if (kIFShift.value === 0)
            kIFShift.text = "";
        else
            kIFShift.text = kIFShift.value;

        bandscope.reset();

        b_setvar("ifshift", value);
        if (bPower.status === 1)
            b_send("ifshift", value);
    }


    function centerIFShift()
    {
        kIFShift.value = -999;
        setIFShift(0);
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
            s = n + "Hz";
        else if (n < 1000000) {
            s = (n / 1000).toLocaleString(Qt.locale("en_US"), "f", 2);
            if (s.slice(-1) === "0")
                s = s.slice(0, s.length - 1);
            if (s.slice(-2) === ".0")
                s = s.slice(0, s.length - 2);
            s += "kHz";
        } else {
            s = (n / 1000000).toLocaleString(Qt.locale("en_US"), "f", 2);
            if (s.slice(-1) === "0")
                s = s.slice(0, s.length - 1);
            if (s.slice(-2) === ".0")
                s = s.slice(0, s.length - 2);
            s += "MHz";
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

        if (mem.length > 3) {
            kFilter.value = -1;
            setFilter(mem[3]);
        }

        if (mem.length > 4) {
            kRFGain.value = -1;
            setRFGain(mem[4]);
        }
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
        bFM.checked = (value === "FM");
        bWFM.checked = (value === "WFM");
        bLSB.checked = (value === "LSB");
        bUSB.checked = (value === "USB");
        bDSB.checked = (value === "DSB");

        lField4.text = value;
        b_setvar("band", value);
        if (bPower.status === 1)
            b_send("band", value);
    }


    function setAGC(checked)
    {
        bAGC.checked = checked;
        b_setvar("agc", checked);
        if (bPower.status === 1)
            b_send("agc", checked);
    }


    function setFilter(value)
    {
        if (kFilter.value === -1) {
            kFilter.value = value;
            kFilter.angle = (value - kFilter.min) / kFilter.step * kFilter.anglestep;
        }

        let freq = filterFreq(value);

        if (freq === -1)
            return;

        lField5.text = freq + " kHz";
        tFilter.text = freq + " kHz";
        b_setvar("filter", value);
        if (bPower.status === 1)
            b_send("filter", 1000 * freq);
    }


    function filterFreq(value)
    {
        if (value === 1) return 1;
        else if (value === 2) return 2;
        else if (value === 3) return 3;
        else if (value === 4) return 4;
        else if (value === 5) return 5;
        else if (value === 6) return 6;
        else if (value === 7) return 7;
        else if (value === 8) return 8;
        else if (value === 9) return 9;
        else if (value === 10) return 10;
        else if (value === 11) return 12.5;
        else if (value === 12) return 15;
        else if (value === 13) return 20;
        else if (value === 14) return 25;
        else if (value === 15) return 30;
        else if (value === 16) return 35;
        else if (value === 17) return 40;
        else if (value === 18) return 45;
        else if (value === 19) return 50;
        else if (value === 20) return 75;
        else if (value === 21) return 100;
        else if (value === 22) return 125;
        else if (value === 23) return 150;
        else if (value === 24) return 175;
        else if (value === 25) return 200;
        else if (value === 26) return 225;
        else if (value === 27) return 250;
        else if (value === 28) return 300;
        else return -1;
    }


    function setSample(value)
    {
        if (value < 0)
            return;

        if (kSample.value === -1) {
            kSample.value = value;
            kSample.angle = (value - kSample.min) / kSample.step * kSample.anglestep;
        }

        vsample = sampleFreq(value);

        checkFilter();

        if (vsample < 1000000)
            tSample.text = (vsample / 1000).toFixed(0) + " kHz";
        else
            tSample.text = (vsample / 1000000).toFixed(1) + " MHz";

        bandscope.reset();

        b_setvar("sample", value);
        if (bPower.status === 1) {
            b_send("sample", vsample);
        }
    }


    function sampleFreq(value)
    {
        return freqs[value];
    }


    function checkFilter()
    {
        let f;
        for (f = kFilter.value; f > -1; f--)
            if (1000 * filterFreq(f) <= vsample)
                break;

        if (f < kFilter.value) {
            kFilter.value = -1;
            setFilter(f);
        }
    }


    function setRFGain(value)
    {
        if (gains.length === 0)
            return;

        kRFGain.min = 0;
        kRFGain.max = gains.length - 1;
        kRFGain.anglestep = 340 / gains.length;

        if (value >= gains.length)
            value = gains.length - 1;

        if (kRFGain.value === -1) {
            kRFGain.value = value;
            kRFGain.angle = (value - kRFGain.min) / kRFGain.step * kRFGain.anglestep;
        }

        tRFGain.text = gains[value] + " dB";

        bandscope.reset();

        b_setvar("rfgain", value);
        if (bPower.status === 1)
            b_send("rfgain", value);
    }


    function setBandSampling(value)
    {
        tBandSampling.text = value;

        if (kBandSampling.value === -1) {
            kBandSampling.value = value;
            kBandSampling.angle = (value - kBandSampling.min) / kBandSampling.step * kBandSampling.anglestep;
        }

        b_setvar("bandsampling", value);
        if (bPower.status === 1)
            b_send("bandsampling", bandspectrogrambutton.checked ? value : -1);
    }


    function setSpecSampling(value)
    {
        tSpecSampling.text = value;

        if (kSpecSampling.value === -1) {
            kSpecSampling.value = value;
            kSpecSampling.angle = (value - kSpecSampling.min) / kSpecSampling.step * kSpecSampling.anglestep;
        }

        b_setvar("specsampling", value);
        if (bPower.status === 1)
            b_send("specsampling", bandscopebutton.checked ? value : -1);
    }


    function setOffset(value)
    {
        bandscopeset.offset = value;
    }


    function setRefer(value)
    {
        bandscopeset.refer = value;
    }


    function setZoom(value)
    {
        bandscopeset.zoom = value;
    }


    function setFFT(value)
    {
        bandscopeset.fft = value;
    }


    function updatedBGrid()
    {
        let r = bandscope.height / (bandscope.logmin - bandscope.logmax);
        let s = 20;
        if (r > 2.5)
            s = 10;
        let db = bandscope.logmax;
        for (let i = 0; i < dbgrid.model; i++) {
            db += s;
            if (db < bandscope.logmin) {
                dbgrid.itemAt(i).visible = true;
                dbgrid.itemAt(i).y = r * s * (i + 1);
                dbgrid.itemAt(i).text = "-" + db + " dB";
            } else {
                dbgrid.itemAt(i).visible = false;
                dbgrid.itemAt(i).y = 0;
                dbgrid.itemAt(i).text = "";
            }
        }
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


    function settau(value)
    {
        btau50.checked = false;
        btau75.checked = false;
        btau0.checked = false;
        tau = value;

        if (value === 50)
            btau50.checked = true;
        else if (value === 75)
            btau75.checked = true;
        else
            btau0.checked = true;

        b_setvar("tau", value);
        if (bPower.status === 1)
            b_send("tau", value);
    }


    function unfilter(value)
    {
        bunfilter.checked = value;
        b_setvar("unfilter", value);
        if (bPower.status === 1)
            b_send("unfilter", value);
    }


    function setNR(value)
    {
        bNR.checked = value;
        b_setvar("NR", value);
    }


    function setNRLevel(value)
    {
        value = Math.round(20 * value) / 20;
        if (kNR.value === -1) {
            kNR.value = value;
            kNR.angle = (value - kNR.min) / kNR.step * kNR.anglestep;
        }
        b_setvar("NRlevel", value);
    }


    function setRecord(value)
    {
        if (value) {
            if (bRecordRAW.checked) {
                let filename = "_Save_" + new Date().toLocaleString(Qt.locale("de_DE"), "yyyy.MM.dd HH.mm.ss@") + lFrequency.text + " RAW.wav";
                updateRecordSize(44);
                box.audioDevice_recordStart(audiodeviceid, filename, vsample, 16);
                box.audioDevice_RecordSize.connect(updateRecordSize);
                updateFiles();
                b_send("record", "start");
            } else {
                let filename = "_Save_" + new Date().toLocaleString(Qt.locale("de_DE"), "yyyy.MM.dd HH.mm.ss@") + lFrequency.text + " " + lField4.text + ".wav";
                updateRecordSize(44);
                box.audioDevice_recordStart(audiodeviceid, filename);
                box.audioDevice_RecordSize.connect(updateRecordSize);
                if (bRecordSQL.checked && !busy)
                    box.audioDevice_recordPause(audiodeviceid, true);
                updateFiles();
            }
        } else {
            if (bRecordRAW.checked) {
                b_send("record", "stop");
                box.audioDevice_recordStop(audiodeviceid);
                box.audioDevice_RecordSize.disconnect(updateRecordSize);
                bRecordPause.checked = false;
                updateFiles();
            } else {
                box.audioDevice_recordStop(audiodeviceid);
                box.audioDevice_RecordSize.disconnect(updateRecordSize);
                bRecordPause.checked = false;
                updateFiles();
            }
        }
    }


    function setRecordPause(value)
    {
        if (!bRecordSQL.checked || (bRecordSQL.checked && busy)) {
            if (bRecordRAW.checked)
                b_send("record", value ? "stop" : "start");
            else
                box.audioDevice_recordPause(audiodeviceid, value);
        }
    }


    function setRecordRAW(value)
    {
        bRecordRAW.checked = value;
        b_setvar("recordraw", value);
    }


    function setRecordSQL(value)
    {
        bRecordSQL.checked = value;
        b_setvar("recordsql", value);
        if (bRecordPlay.checked && !bRecordPause.checked) {
            if (value & !busy) {
                if (bRecordRAW.checked)
                    b_send("record", "stop");
                else
                    box.audioDevice_recordPause(audiodeviceid, true);
            } else if (!value) {
                if (bRecordRAW.checked)
                    b_send("record", "start");
                else
                    box.audioDevice_recordPause(audiodeviceid, false);
            }
        }
    }


    function setBiasT(value)
    {
        bBiasT.checked = value;

        b_setvar("biast", value);
        if (bPower.status === 1)
            b_send("biast", value);
    }


    function setBandwidth(value)
    {
        let bw = [200000, 300000, 600000, 1536000, 5000000, 6000000, 7000000, 8000000, 14000000];
        let bws = ["200 kHz", "300 kHz", "600 kHz", "1536 kHz", "5 MHz", "6 MHz", "7 MHz", "8 MHz", "MAX"];

        kBandwidth.min = 0;
        kBandwidth.max = bw.length - 1;
        kBandwidth.anglestep = 340 / bw.length;

        if (value >= bw.length)
            value = bw.length - 1;

        if (kBandwidth.value === -1) {
            kBandwidth.value = value;
            kBandwidth.angle = (value - kBandwidth.min) / kBandwidth.step * kBandwidth.anglestep;
        }

        tBandwidth.text = bws[value];

        bandscope.reset();

        b_setvar("bandwidth", value);
        if (bPower.status === 1)
            b_send("bandwidth", bw[value]);
    }


    function updateRecordSize(id, size)
    {
        if (id !== audiodeviceid)
            return;

        let time;
        if (bRecordRAW.checked)
            time = new Date(125 * size / vsample);
        else
            time = new Date((size - 44) * 8000 / audiosettingsset.sbits / audiosettingsset.srate);

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

        if (bRecordRAW.checked) {
            cRemoteFilesItems.get(cRemoteFiles.count - 1).text = disp;
            showFormat();
        }
    }


    function recordFileSave()
    {
        let file = convertFileName(cFiles.currentText);
        box.file_save(file);
    }


    function recordFileDelete()
    {
        let file = convertFileName(cFiles.currentText);
        box.file_delete(file);
        updateFiles();
    }


    function updateFiles()
    {
        let files = box.file_list("_Save_*.wav");
        cFilesItems.clear();
        let i, file, disp, size;
        for (i = 0; i < files.length; i++) {
            file = files[i].split(":");
            disp = file[0].replace("_Save_", "").replace("@", "\n").replace(".wav", "") + " (";
            size = parseInt(file[1]);

            if (size < 1024000)
                disp += Math.ceil(size / 1024) + "KB)";
            else if (size < 10485760)
                disp += Math.ceil(size / 104857.6) / 10 + "MB)";
            else
                disp += Math.ceil(size / 1048576) + "MB)";
            cFilesItems.append({text: disp});
        }
        cFiles.currentIndex = files.length - 1;

        files = box.file_list("_Save_*RAW.wav");
        cRemoteFilesItems.clear();
        for (i = 0; i < files.length; i++) {
            file = files[i].split(":");
            disp = file[0].replace("_Save_", "").replace("@", "\n").replace(".wav", "") + " (";
            size = parseInt(file[1]);

            if (size < 1024000)
                disp += Math.ceil(size / 1024) + "KB)";
            else if (size < 10485760)
                disp += Math.ceil(size / 104857.6) / 10 + "MB)";
            else
                disp += Math.ceil(size / 1048576) + "MB)";
            cRemoteFilesItems.append({text: disp, value: file[0]});
        }
        cRemoteFiles.currentIndex = files.length - 1;
        
        showFormat();
    }


    function convertFileName(file)
    {
        let n = file.indexOf(" (");
        if (n > -1)
            file = file.substr(0, n);

        if (file.indexOf("\n") === -1)
            return file + ".wav";
        else
            return "_Save_" + file.replace("\n", "@") + ".wav";
    }


    function updateAfGrid()
    {
        let n = (timebutton.checked ? 1 : 0) + (freqbutton.checked ? 1 : 0) + (spectrogrambutton.checked ? 1 : 0);

        if (n === 0)
            afgrid.rows = 0;
        else if (n === 1) {
            afgrid.columns = 1;
            afgrid.rows = 2;
            gtime.width = b_width;
            gfrequency.width = b_width;
            gspectrogram.width = b_width;
        } else if (n === 2) {
            if (b_width > 24 * b_unit) {
                afgrid.columns = 2;
                afgrid.rows = 2;
                gtime.width = (b_width - afgrid.spacing) / 2;
                gfrequency.width = (b_width - afgrid.spacing) / 2;
                gspectrogram.width = (b_width - afgrid.spacing) / 2;
            } else {
                afgrid.columns = 1;
                afgrid.rows = 3;
                gtime.width = b_width;
                gfrequency.width = b_width;
                gspectrogram.width = b_width;
            }
        } else if (n === 3) {
            if (b_width > 36 * b_unit) {
                afgrid.columns = 3;
                afgrid.rows = 2;
                gtime.width = (b_width - 2 * afgrid.spacing) / 3;
                gfrequency.width = (b_width - 2 * afgrid.spacing) / 3;
                gspectrogram.width = (b_width - 2 * afgrid.spacing) / 3;
            } else if (b_width > 24 * b_unit) {
                afgrid.columns = 2;
                afgrid.rows = 3;
                gtime.width = (b_width - afgrid.spacing) / 2;
                gfrequency.width = (b_width - afgrid.spacing) / 2;
                gspectrogram.width = (b_width - afgrid.spacing) / 2;
            } else {
                afgrid.columns = 1;
                afgrid.rows = 4;
                gtime.width = b_width;
                gfrequency.width = b_width;
                gspectrogram.width = b_width;
            }
        }
    }


    function ftext(f, x, w)
    {
        let r = Math.trunc((f + (x - w / 2) / w * vsample / (1 << bandscopeset.zoom)) / 1000).toLocaleString(Qt.locale("de_DE"), "f", 0) + " kHz";
        if (bandscopeset.zoom > 0)
            r += " x" + (1 << bandscopeset.zoom);

        return r;
    }

    function showFormat()
    {
        let f = box.file_openRead(cRemoteFiles.currentValue);

        if (f > -1) {
            tRemoteFile.text = b_translate("FORMAT") + ": " + box.file_samplerate(f).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz - " + box.file_samplebits(f) + " bit";
            box.file_close(f);
        } else
            tRemoteFile.text = "";
    }
}
