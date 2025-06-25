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

// REMOTEAUDIO - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property bool   audiosettingsactive
    property bool   scroll
    property int    audiodeviceid
    property int    audiovaluesize
    property int    dspid
    property int    dsrate
    property int    dsbits
    property string initaudiomode
    property var    box
    property var    remotebox
    property bool   refreshing

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
                    height: width
                    tooltiptext: b_translate("Start / Stop")
                    onClicked: setPlay();
                }
                Rectangle {
                    id: outputdevice
                    width: 14 * b_unit - 10 * parent.spacing - topbuttons.rightPadding - topbuttons.leftPadding
                    height: b_unit
                    color: "transparent"
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
        }
        Flickable {
            width: 16 * b_unit
            height: b_height - topbuttons.height - parent.spacing
            contentHeight: contentItem.childrenRect.height
            clip: true
            interactive: scroll && (contentHeight > height)
            TColumn {
                TGroupBox {
                    id: devices
                    width: 16 * b_unit
                    height: 6 * b_unit
                    TColumn {
                        id: cdevices
                        TRow {
                            id: remoterow
                            TLabel {
                                id: remote
                                height: b_unit
                                width: Math.max(tmremote.width, tmlocal.width) + leftPadding + rightPadding
                                text: b_translate("REMOTE")
                                anchors.bottom: remotegain.bottom
                                TextMetrics {
                                    id: tmremote
                                    font: remote.font
                                    text: remote.text
                                }
                            }
                            TComboBox {
                                id: remotedevice
                                width: devices.availableWidth - remote.width - remotegain.width - 2 * remoterow.spacing
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
                        Rectangle {
                            width: 0.3 * b_unit
                            height: width
                            color: "transparent"
                        }
                        TRow {
                            id: centerrow
                            height: 2 * b_unit
                            Rectangle {
                                width: Math.max(tmremote.width, tmlocal.width) + parent.spacing + (remotedevice.width - 4 * b_unit - parent.spacing) / 2
                                height: b_unit
                                color: "transparent"
                            }
                            ButtonUpDown {
                                id: down
                                name: "updownbutton"
                                up: false
                                height: 2 * b_unit
                                width: height
                                tooltiptext: b_translate("Remote to local")
                                onClicked: setDown()
                            }
                            ButtonUpDown {
                                id: up
                                name: "updownbutton"
                                up: true
                                height: 2 * b_unit
                                width: height
                                tooltiptext: b_translate("Local to remote")
                                onClicked: setUp()
                            }
                            Rectangle {
                                width: (remotedevice.width - 5 * b_unit - parent.spacing + remotegain.width) / 2
                                height: b_unit
                                color: "transparent"
                            }
                            TButton {
                                id: audiosettingsbutton
                                name: "audiosettingsbutton"
                                width: b_unit
                                height: b_unit
                                anchors.verticalCenter: up.verticalCenter
                                checkable: true
                                tooltiptext: b_translate("Audio settings")
                                onClicked: audiosettingsactive = !audiosettingsactive
                            }
                        }
                        TRow {
                            id: localrow
                            TLabel {
                                id: local
                                height: b_unit
                                width: Math.max(tmremote.width, tmremote.width) + leftPadding + rightPadding
                                text: b_translate("LOCAL")
                                anchors.bottom: localgain.bottom
                                TextMetrics {
                                    id: tmlocal
                                    font: local.font
                                    text: local.text
                                }
                            }
                            TComboBox {
                                id: localdevice
                                width: devices.availableWidth - remote.width - localgain.width - 2 * localrow.spacing
                                height: b_unit
                                anchors.bottom: localgain.bottom
                                model: ListModel {
                                    id: localdevicemodel
                                }
                                onActivated: setLocalDevice()
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
                                    anglestep: 17
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
                        x: audiosettingsbutton.x - width - centerrow.spacing
                        y: audiosettingsbutton.y + centerrow.y
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
                            setAudioMode();
                        }
                        onSbitsChanged: {
                            b_send("sbits", sbits);
                            setAudioMode();
                        }
                        onCbitsChanged: b_send("cbits", cbits);
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

        if (b_getvar("down", "true") === "true")
            setDown();

        if (b_getvar("up", "false") === "true")
            setUp();

        setSrate(b_getvar("srate", 32000));
        setSBits(b_getvar("sbits", 32));
        setCBits(b_getvar("cbits", 0));
        setTimeButton(b_getvar("timebutton", "false") === "true");
        setFreqButton(b_getvar("freqbutton", "false") === "true");
        setAudioFilter(b_getvar("audiofilter", "false") === "true");
        setAudioFilterType(b_getvar("audiofiltertype", "PASSBAND"));

        box.audioDevice_Data.connect(sendAudioData);
        box.audioDevice_Processing.connect(paintAudio);

        setRemoteDevice();
        setLocalDevice();
    }


    function b_finish()
    {
        box.audioDevice_Data.disconnect(sendAudioData);
        box.audioDevice_Processing.disconnect(paintAudio);
        box.audioDevice_close(audiodeviceid);
    }


    function b_receive(key, value)
    {
    }


    function b_receivebin(key, value)
    {
        if (key === "audio") {
            receiveAudioData(value);
        }
    }
    
    
    function b_hotplug()
    {
        refreshDevices();
    }


    function setPlay()
    {
        refreshArrows();
        if (playbutton.checked) {
            b_send("play");
            if (audiodeviceid === -1) {
                let audiomode = audiosettingsset.srate + "," + audiosettingsset.sbits + "," + audiosettingsset.cbits;
                audiodeviceid = box.audioDevice_open(localdevice.currentValue, audiomode);
            } else
                setAudioMode();
            setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
            setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
        } else {
            b_send("stop");
            box.audioDevice_close(audiodeviceid);
            graphtime.setData();
            graphfreq.setData();
            audiodeviceid = -1;
        }
    }


    function setRemoteDevice()
    {
        let direction = up.checked ? "up" : "down";
        b_setvar("remotedevice" + direction, remotedevice.currentValue);
        b_send("device", remotedevice.currentValue);
        kRemoteGain.value = -1;
        setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
    }


    function setLocalDevice()
    {
        let direction = up.checked ? "up" : "down";
        b_setvar("localdevice" + direction, localdevice.currentValue);        
        setAudioMode();
        kLocalGain.value = -1;
        setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
    }


    function setDown()
    {
        down.checked = true;
        up.checked = false;
        b_setvar("down", "true");
        b_setvar("up", "false");
        refreshArrows();
        refreshDevices();
        kRemoteGain.value = -1;
        setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
        kLocalGain.value = -1;
        setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
        setAudioMode();
    }


    function setUp()
    {
        up.checked = true;
        down.checked = false;
        b_setvar("up", "true");
        b_setvar("down", "false");
        refreshArrows();
        refreshDevices();
        kRemoteGain.value = -1;
        setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
        kLocalGain.value = -1;
        setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
        setAudioMode();
    }


    function refreshArrows()
    {
        if (playbutton.checked) {
            if (up.checked) {
                up.playing = true;
                down.playing = false
            } else {
                up.playing = false;
                down.playing = true;
            }
        } else {
            up.playing = false
            down.playing = false
        }
    }


    function refreshDevices()
    {
        if (refreshing)
            return;
        refreshing = true;
        
        remotedevicemodel.clear();
        localdevicemodel.clear();

        let direction;
        let i;
        
        if (up.checked) {
            direction = "up";
            let remotedevicelist = remotebox.audioDevice_list("OUTPUT");
            for (i = 0; i < remotedevicelist.length; i++)
                remotedevicemodel.append({value: remotedevicelist[i], text: remotebox.audioDevice_description(remotedevicelist[i])});

            let localdevicelist = box.audioDevice_list("INPUT");
            for (i = 0; i < localdevicelist.length; i++)
                localdevicemodel.append({value: localdevicelist[i], text: box.audioDevice_description(localdevicelist[i])});
        } else {
            direction = "down";
            let remotedevicelist = remotebox.audioDevice_list("INPUT");
            for (i = 0; i < remotedevicelist.length; i++)
                remotedevicemodel.append({value: remotedevicelist[i], text: remotebox.audioDevice_description(remotedevicelist[i])});

            let localdevicelist = box.audioDevice_list("OUTPUT");
            for (i = 0; i < localdevicelist.length; i++)
                localdevicemodel.append({value: localdevicelist[i], text: box.audioDevice_description(localdevicelist[i])});
        }

        let remotedevicename = b_getvar("remotedevice" + direction, "");
        let localdevicename = b_getvar("localdevice" + direction, "");

        remotedevice.currentIndex = Math.max(0, remotedevice.find(remotebox.audioDevice_description(b_getvar("remotedevice" + direction, ""))));
        localdevice.currentIndex = Math.max(0, localdevice.find(box.audioDevice_description(b_getvar("localdevice" + direction, ""))));

        b_setvar("localdevice" + direction, localdevice.currentValue);
        b_setvar("remotedevice" + direction, remotedevice.currentValue);

        if (remotedevicename !== remotedevice.currentValue)
            b_send("device", remotedevice.currentValue);

        if (localdevicename !== localdevice.currentValue)
            setAudioMode();
        
        refreshing = false;
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


    function setAudioMode()
    {
        let audiomode = audiosettingsset.srate + "," + audiosettingsset.sbits + "," + audiosettingsset.cbits;
        box.audioDevice_close(audiodeviceid);
        graphtime.setData();
        graphfreq.setData();
        audiodeviceid = box.audioDevice_open(localdevice.currentValue, audiomode);
        setRemoteGain(b_getvar("remotegain." + box.escape(remotedevice.currentValue), 50));
        setLocalGain(b_getvar("localgain." + box.escape(localdevice.currentValue), 50));
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


    function setRemoteGain(value)
    {
        if (kRemoteGain.value === -1) {
            kRemoteGain.value = value;
            kRemoteGain.angle = value / kRemoteGain.step * kRemoteGain.anglestep;
        }
        b_setvar("remotegain." + box.escape(remotedevice.currentValue), value);
        b_send("volume", value / 100);
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


    function receiveAudioData(data)
    {
        if (audiosettingsset.cbits > 0)
            data = box.DSP_uncompress(data, audiosettingsset.cbits);

        if (bAudioFilter.checked)
            data = box.DSP_filter(dspid, data);

        box.audioDevice_write(audiodeviceid, data);
    }


    function sendAudioData(id, data)
    {
        if (id !== audiodeviceid)
            return;

        if (audiosettingsset.cbits > 0)
            data = box.DSP_compress(data, audiosettingsset.cbits);

        if (bAudioFilter.checked)
            data = box.DSP_filter(dspid, data);

        paintAudio(audiodeviceid, data);
        b_sendbin("audio", data);
    }


    function paintAudio(id, data)
    {
        if (id !== audiodeviceid)
            return;

        if (timebutton.checked)
            graphtime.setData(box.viewSlice(data, 0, 4 * Math.ceil(graphtime.width)));
        else
            graphtime.setData();

        if (freqbutton.checked) {
            let fft = box.DSP_FFT(dspid, box.viewSlice(data, 0, 16 * graphfreq.width), Math.ceil(graphfreq.width));
            graphfreq.setData(fft);
        } else
            graphfreq.setData();
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
