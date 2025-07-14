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

// PLAYAUDIO - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property bool   scroll
    property int    audiodeviceid
    property bool   audiosettingsactive
    property int    dspid
    property var    box
    property var    remotebox
    property int    fsrate
    property int    fsbits

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
        id: all
        TGroupBox {
            id: topbuttons
            width: 16 * b_unit
            height: b_unit + 2 * toprow.spacing
            z: 1
            TRow {
                id: toprow
                TButton {
                    id: playbutton
                    name: "playbutton"
                    checkable: true
                    width: b_unit
                    height: width
                    tooltiptext: b_translate("Start / Stop")
                    enabled: checked || cFilesItems.count > 0
                    onClicked: setPlay()
                }
                TComboBox {
                    id: outputdevice
                    width: 13 * b_unit - 11 * parent.spacing - topbuttons.rightPadding - topbuttons.leftPadding
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
                    id: timebutton
                    name: "timebutton"
                    width: b_unit
                    height: width
                    checkable: true
                    tooltiptext: b_translate("Time graph")
                    onClicked: setTimeButton(checked);
                }
                TButton {
                    id: freqbutton
                    name: "freqbutton"
                    width: b_unit
                    height: width
                    checkable: true
                    tooltiptext: b_translate("Frequency graph")
                    onClicked: setFreqButton(checked);
                }
            }
            SetAudioSettings {
                id: audiosettingsset
                name: "audiosettings"
                x: audiosettingsbutton.x - width - toprow.spacing
                y: audiosettingsbutton.y
                width: audiosettingsactive ? 5.6 * b_unit : 0
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
                onSrateChanged: {
                    b_send("srate", srate);
                    displayFormat();
                    graphtime.setData();
                    graphfreq.setData();
                    spectrogram.setData();
                }
                onSbitsChanged: {
                    b_send("sbits", sbits);
                    displayFormat();
                    graphtime.setData();
                    graphfreq.setData();
                    spectrogram.setData();
                }
                onCbitsChanged: b_send("cbits", cbits);
            }
        }
        Flickable {
            width: 16 * b_unit
            height: b_height - topbuttons.height - parent.spacing
            contentHeight: contentItem.childrenRect.height
            clip: true
            interactive: scroll && (contentHeight > height)
            onContentHeightChanged: main.heightChanged();
            TColumn {
                TGroupBox {
                    id: gFiles
                    width: 16 * b_unit
                    TRow {
                        id: rFiles
                        TColumn {
                            TLabel {
                                id: tFiles
                                width: 1.5 * b_unit - b_space
                                height: 0.35 * b_unit
                                font.pixelSize: height
                                verticalAlignment: Text.AlignVCenter
                                text: b_translate("FILES")
                            }
                            TComboBox {
                                id: cFiles
                                name: "cfiles"
                                width: 16 * b_unit - cGainIn.width - cGainOut.width - 2 * rFiles.spacing - gFiles.leftPadding - gFiles.rightPadding
                                height: 1.3 * b_unit + Math.max(cGainIn.spacing, cGainOut.spacing)
                                font.pixelSize: 0.28 * height
                                model: ListModel {
                                    id: cFilesItems
                                }
                                onActivated: setFile(currentText.split("<br>")[0]);
                            }
                        }
                        TColumn {
                            id: cGainIn
                            TLabel {
                                id: lGainIn
                                height: 0.8 * b_unit
                                font.pixelSize: 0.3 * b_unit
                                horizontalAlignment: Text.AlignHCenter
                                text: b_translate("GAIN") + "<br>" + b_translate("IN");
                            }
                            TKnob {
                                id: kGainIn
                                width: b_unit
                                height: width
                                min: 0
                                max: 100
                                step: 5
                                anglestep: 17
                                value: -1
                                anchors.horizontalCenter: lGainIn.horizontalCenter
                                onAngleChanged: setGainIn(value);
                                onPressedChanged: scroll = !pressed;
                            }
                        }
                        TColumn {
                            id: cGainOut
                            TLabel {
                                id: lGainOut
                                height: 0.8 * b_unit
                                font.pixelSize: 0.3 * b_unit
                                horizontalAlignment: Text.AlignHCenter
                                text: b_translate("GAIN") + "<br>" + b_translate("OUT");
                            }
                            TKnob {
                                id: kGainOut
                                width: b_unit
                                height: width
                                min: 0
                                max: 100
                                step: 5
                                anglestep: 17
                                value: -1
                                anchors.horizontalCenter: lGainOut.horizontalCenter
                                onAngleChanged: setGainOut(value);
                                onPressedChanged: scroll = !pressed;
                            }
                        }
                    }
                }
                TLabel {
                    id: lSpecs
                    height: 0.4 * b_unit
                    font.pixelSize: height
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
                                        cgraphfreq.text = Math.trunc(audiosettingsset.srate / 2 * mx).toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz";
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
        }
    }


    function b_start(params)
    {
        box = b_getbox();
        dspid = box.DSP_create();
        remotebox = b_getbox("remote");
        audiodeviceid = -1;
        scroll = true;

        setSrate(b_getvar("srate", 32000));
        setSBits(b_getvar("sbits", 32));
        setCBits(b_getvar("cbits", 0));
        setTimeButton(b_getvar("timebutton", "false") === "true");
        setFreqButton(b_getvar("freqbutton", "false") === "true");
        setAudioFilter(b_getvar("audiofilter", "false") === "true");
        setAudioFilterType(b_getvar("audiofiltertype", "PASSBAND"));
        setGainIn(b_getvar("gainin", 100));
        setGainOut(b_getvar("gainout", 50));

        refreshDevices();

        let files = remotebox.file_list("*");
        cFilesItems.clear();
        for (let i = 0; i < files.length; i++) {
            let file = files[i].split(":");
            let disp = file[0] + "<br>";
            let size = parseInt(file[1]);

            if (size < 1024000)
                disp += Math.ceil(size / 1024) + "KB";
            else if (size < 10485760)
                disp += Math.ceil(size / 104857.6) / 10 + "MB";
            else
                disp += Math.ceil(size / 1048576) + "MB";
            cFilesItems.append({text: disp});
        }
        cFiles.currentIndex = files.length - 1;

        setFile(cFiles.currentText.split("<br>")[0]);
    }


    function b_finish()
    {
        box.audioDevice_close(audiodeviceid);
        box.audioDevice_Processing.disconnect(audioDeviceProcessing);
    }


    function b_receive(key, value)
    {
        if (key === "play") {
            if (!outputdevice.currentValue)
                return;
            
            let audiomode = audiosettingsset.srate + "," + audiosettingsset.sbits + "," + audiosettingsset.cbits;
            
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = box.audioDevice_open(outputdevice.currentValue, audiomode);
            setGainIn(kGainIn.value);
            setGainOut(kGainOut.value);
            updateAudioFilter();
            box.audioDevice_Processing.connect(audioDeviceProcessing);

        } else if (key === "format") {
            let avalue = value.split(",");
            fsrate = parseInt(avalue[0]);
            fsbits = parseInt(avalue[1]);
            displayFormat();
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
            displayFormat();
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
    
    
    function displayFormat()
    {
        lSpecs.text = b_translate("FORMAT") + ": ";
        if (fsrate === 0 || fsbits === 0) {
            lSpecs.text += b_translate("Unknown") + " - " + b_translate("Using") + " ";
            lSpecs.text += audiosettingsset.srate.toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz  -  " + audiosettingsset.sbits + " bit";
        } else
            lSpecs.text += fsrate.toLocaleString(Qt.locale("de_DE"), "f", 0) + " Hz  -  " + fsbits + " bit";
    }


    function setPlay()
    {
        if (playbutton.checked)
            b_send("play");
        else {
            b_send("stop");
            box.audioDevice_Processing.disconnect(audioDeviceProcessing);
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = -1;
        }
    }


    function setOutputDevice(value)
    {
        let outputdevicename = b_getvar("outputdevice");
        outputdevice.currentIndex = Math.max(0, outputdevice.find(box.audioDevice_description(value)));
        b_setvar("outputdevice", outputdevice.currentValue);

        if (playbutton.checked && outputdevicename !== outputdevice.currentValue) {
            let audiomode = audiosettingsset.srate + "," + audiosettingsset.sbits + "," + audiosettingsset.cbits;
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = box.audioDevice_open(outputdevice.currentValue, audiomode);
            setGainIn(kGainIn.value);
            setGainOut(kGainOut.value);
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


    function setCBits(value)
    {
        audiosettingsset.cbits = value;
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


    function setFile(file)
    {
        b_send("file", file);
    }


    function setGainIn(value)
    {
        if (kGainIn.value === -1) {
            kGainIn.value = value;
            kGainIn.angle = value / kGainIn.step * kGainIn.anglestep;
        }
        b_setvar("gainin", value);
        b_send("volume", value / 100);
    }


    function setGainOut(value)
    {
        if (kGainOut.value === -1) {
            kGainOut.value = value;
            kGainOut.angle = value / kGainOut.step * kGainOut.anglestep;
        }
        b_setvar("gainout", value);
        box.audioDevice_setVolume(audiodeviceid, value / 100);
    }


    function receiveAudioData(data)
    {
        if (audiosettingsset.cbits > 0)
            data = box.DSP_uncompress(data, audiosettingsset.cbits);

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

        if (freqbutton.checked) {
            let fft = box.DSP_FFT(dspid, box.viewSlice(data, 0, 16 * graphfreq.width), Math.ceil(graphfreq.width));
            graphfreq.setData(fft);
        }

        box.audioDevice_setBusy(id, false);
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
        box.DSP_setFilterParams(dspid,
                                audiosettingsset.srate,
                                audiosettingsset.srate / 2 * audiofilter.pos1,
                                audiosettingsset.srate / 2 * audiofilter.pos2,
                                20,
                                bAudioFilterPass.checked ? Box.FT_PASSBAND : Box.FT_REJECTBAND);
    }
}
