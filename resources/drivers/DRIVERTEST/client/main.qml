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

// DRIVERTEST - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls


Item {
    property bool   counting
    property int    count
    property var    box
    property bool   scroll
    property int    dspid1
    property int    dspid2
    property int    audiodeviceid: -1
    property int    wave
    property var    audio
    property string ftext
    property int    f
    property int    t
    property bool   audiosettingsactive: false

    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: {
            mouse.accepted = false;
            let p = mapToGlobal(mouseX, mouseY);

            if (audiosettingsactive) {
                if (!audiosettingsset.contains(audiosettingsset.mapFromGlobal(p)) && !config.contains(config.mapFromGlobal(p))) {
                    audiosettingsactive = false;
                    config.checked = false;
                }
            }

            if (!outputdevice.contains(outputdevice.mapFromGlobal(p))) outputdevice.popup.close();
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
    Flickable {
        width: 16 * b_unit
        height: b_height
        contentHeight: contentItem.childrenRect.height
        clip: true
        interactive: scroll && (contentHeight > height)
        TColumn {
            TGrid {
                columns: 2
                verticalItemAlignment: Grid.AlignTop
                TGrid {
                    columns: 3
                    Rectangle {
                        id: rectangle1
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#FF0000"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle1")
                        }
                    }
                    Rectangle {
                        id: rectangle2
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#00FF00"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle2")
                        }
                    }
                    Rectangle {
                        id: rectangle3
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#0000FF"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle3")
                        }
                    }
                    Rectangle {
                        id: rectangle4
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#00FFFF"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle4")
                        }
                    }
                    Rectangle {
                        id: rectangle5
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#FF00FF"
                        TLabel {
                            id: colorlabel
                            height: b_unit
                            anchors.centerIn: parent
                        }
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle5")
                        }
                    }
                    Rectangle {
                        id: rectangle6
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#FFFF00"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle6")
                        }
                    }
                    Rectangle {
                        id: rectangle7
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#404040"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle7")
                        }
                    }
                    Rectangle {
                        id: rectangle8
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#808080"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle8")
                        }
                    }
                    Rectangle {
                        id: rectangle9
                        width: 2.5 * b_unit
                        height: width
                        radius: 0.3 * b_unit
                        color: "#A0A0A0"
                        MouseArea {
                            anchors.fill: parent
                            onClicked: b_send("rectangle9")
                        }
                    }
                }
                TColumn {
                    TGrid {
                        columns: 2
                        TLabel {
                            height: b_unit
                            text: b_translate("Version:");
                        }
                        TLabel {
                            id: version
                            height: b_unit
                        }
                        TLabel {
                            height: b_unit
                            text: b_translate("Connection:");
                        }
                        TLabel {
                            height: b_unit
                            text: b_conn()
                        }
                        TButton {
                            id: sw
                            width: 3 * b_unit
                            height: b_unit
                            text: b_translate("COUNT")
                            checkable: true
                            onClicked: switchclicked()
                        }
                        TLabel {
                            id: number
                            width: 2 * b_unit
                            height: b_unit
                        }
                    }
                    TRow {
                        z: 1
                        TComboBox {
                            id: outputdevice
                            width: 6.9 * b_unit
                            height: b_unit
                            anchors.verticalCenter: kGain.verticalCenter
                            model: ListModel {
                                id: outputdevicemodel
                            }
                            onActivated: setOutputDevice(currentValue);
                        }
                        Item {
                            width: config.width
                            height: config.height
                            TButton {
                                id: config
                                name: "config"
                                checkable: true
                                width: b_unit
                                height: width
                                tooltiptext: b_translate("Audio Settings")
                                onClicked: audiosettingsactive = !audiosettingsactive;
                            }
                            SetAudioSettings {
                                id: audiosettingsset
                                name: "audiosettings"
                                x: config.x - width - b_space
                                y: config.y
                                width: audiosettingsactive ? 3.9 * b_unit : 0
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
                    }
                    TRow {
                        TKnob {
                            id: kF1
                            width: 1.3 * b_unit
                            height: width
                            min: 0
                            max: 4
                            step: 1
                            anglestep: 75
                            value: -1
                            textsize: 0.3 * b_unit
                            tooltiptext: b_translate("Frequency multiplier")
                            onAngleChanged: setF1(value);
                            onPressedChanged: scroll = !pressed;
                        }
                        TKnob {
                            id: kF2
                            width: 1.3 * b_unit
                            height: width
                            min: 1
                            max: 9.9
                            step: 0.1
                            anglestep: 3.5
                            value: -1
                            textsize: 0.3 * b_unit
                            tooltiptext: b_translate("Frequency")
                            onAngleChanged: setF2(value);
                            onPressedChanged: scroll = !pressed;
                        }
                        TGrid {
                            columns: 2
                            spacing: 0
                            TButton {
                                id: wsine
                                name: "wsine"
                                checkable: true
                                width: 1.1 * b_unit
                                height: 0.65 * b_unit
                                tooltiptext: b_translate("Sine")
                                onClicked: setWave(1);
                            }
                            TButton {
                                id: wsquare
                                name: "wsquare"
                                checkable: true
                                width: 1.1 * b_unit
                                height: 0.65 * b_unit
                                tooltiptext: b_translate("Square")
                                onClicked: setWave(2);
                            }
                            TButton {
                                id: wtriangle
                                name: "wtriangle"
                                checkable: true
                                width: 1.1 * b_unit
                                height: 0.65 * b_unit
                                tooltiptext: b_translate("Triangle")
                                onClicked: setWave(3);
                            }
                            TButton {
                                id: wnoise
                                name: "wnoise"
                                checkable: true
                                width: 1.1 * b_unit
                                height: 0.65 * b_unit
                                tooltiptext: b_translate("Noise")
                                onClicked: setWave(4);
                            }
                        }
                        TButton {
                            id: play
                            name: "play"
                            checkable: true
                            width: 1.3 * b_unit
                            height: width
                            tooltiptext: b_translate("Start / Stop")
                            onClicked: setPlay();
                        }
                        TKnob {
                            id: kGain
                            width: 1.3 * b_unit
                            height: width
                            min: 0
                            max: 100
                            step: 5
                            anglestep: 17
                            value: -1
                            tooltiptext: b_translate("Volume")
                            onAngleChanged: setGain(value);
                            onPressedChanged: scroll = !pressed;
                        }
                    }
                    TGraph {
                        id: graph
                        name: "graph"
                        width: 8 * b_unit
                        height: 1.8 * b_unit
                        backgroundcolor: "transparent"
                    }
                }
            }
            TLabel {
                id: hw
                font.pixelSize: 0.4 * b_unit
                textFormat: Text.RichText
                text: b_translate("Scanning hardware...")
            }
        }
    }
    Timer {
        id: timeraudio
        interval: 100
        running: false
        repeat: true
        onTriggered: updateAudio();
    }


    function b_start(params)
    {
        counting = false;
        count = 0;
        box = b_getbox();
        dspid1 = box.DSP_create();
        dspid2 = box.DSP_create();
        scroll = true;

        setSrate(b_getvar("srate", 32000));
        setSbits(b_getvar("sbits", 32));
        setGain(b_getvar("gain", 50));
        setF1(b_getvar("f1", 2));
        setF2(b_getvar("f2", 2.2));
        setWave(b_getvar("wave", 1));

        b_send("init");
        b_send("increment");

        version.text = box.HTTP_post(b_param("system.protocol") + b_param("system.masterserver") + b_param("system.masterserverport"), "command=getnotice");
        
        refreshDevices();
    }


    function b_finish()
    {
        box.DSP_release(dspid1);
        box.DSP_release(dspid2);
    }


    function b_receive(key, value)
    {
        if (key === "rectangle1") {
            rectangle1.color = value;
        } else if (key === "rectangle2") {
            rectangle2.color = value;
        } else if (key === "rectangle3") {
            rectangle3.color = value;
        } else if (key === "rectangle4") {
            rectangle4.color = value;
        } else if (key === "rectangle5") {
            rectangle5.color = value;
            colorlabel.text = value;
            colorlabel.color = optimalColor(value);
        } else if (key === "rectangle6") {
            rectangle6.color = value;
        } else if (key === "rectangle7") {
            rectangle7.color = value;
        } else if (key === "rectangle8") {
            rectangle8.color = value;
        } else if (key === "rectangle9") {
            rectangle9.color = value;
        } else if (key === "number") {
            count = value;
            number.text = count;
            if (counting)
                b_send("increment");
        } else if (key === "hardware") {
            hw.text = box.unescape(value);
        }
    }


    function switchclicked()
    {
        counting = !counting;
        if (counting)
            b_send("increment");
    }


    function b_active()
    {
        if (counting)
            b_send("increment");
    }


    function b_hotplug()
    {
        refreshDevices();
    }
    
    
    function refreshDevices()
    {
        b_send("hardware");

        outputdevicemodel.clear();
        
        let outputdevicelist = box.audioDevice_list("OUTPUT");
        for (let i = 0; i < outputdevicelist.length; i++)
            outputdevicemodel.append({value: outputdevicelist[i], text: box.audioDevice_description(outputdevicelist[i])});

        setOutputDevice(b_getvar("outputdevice", box.audioDevice_defaultOutput()));
    }


    function setOutputDevice(value)
    {
        let outputdevicename = b_getvar("outputdevice");
        outputdevice.currentIndex = Math.max(0, outputdevice.find(box.audioDevice_description(value)));
        b_setvar("outputdevice", outputdevice.currentValue);

        if (outputdevicename !== outputdevice.currentValue)
            setPlay();
    }


    function setSrate(value)
    {
        audiosettingsset.srate = value;
    }


    function setSbits(value)
    {
        audiosettingsset.sbits = value;
    }


    function setGain(value)
    {
        if (kGain.value === -1) {
            kGain.value = value;
            kGain.angle = value / kGain.step * kGain.anglestep;
        }

        b_setvar("gain", value);
        box.audioDevice_setVolume(audiodeviceid, value / 100);
    }


    function setF1(value)
    {
        if (kF1.value === -1) {
            kF1.value = value;
            kF1.angle = (value - kF1.min) / kF1.step * kF1.anglestep;
        }

        kF1.text = "x10^" + kF1.value;

        if (kF2.value !== -1)
            setF2(kF2.value);

        b_setvar("f1", value);
    }


    function setF2(value)
    {
        if (kF2.value === -1) {
            kF2.value = value;
            kF2.angle = (value - kF2.min) / kF2.step * kF2.anglestep;
        }

        f = Math.round(kF2.value * (10 ** kF1.value));
        kF2.text = f;

        box.DSP_setFilterParams(dspid1, audiosettingsset.srate, 0, f, 20, Box.FT_PASSBAND);
        box.DSP_setFilterParams(dspid2, 48000, 0, f, 20, Box.FT_PASSBAND);

        b_setvar("f2", value);
    }


    function setWave(value)
    {
        value = parseInt(value);

        wsine.checked = false;
        wsquare.checked = false;
        wtriangle.checked = false;
        wnoise.checked = false;

        if (value === 1)
            wsine.checked = true;
        else if (value === 2)
            wsquare.checked = true;
        else if (value === 3)
            wtriangle.checked = true;
        else
            wnoise.checked = true;

        wave = value;
        b_setvar("wave", value);
    }


    function setPlay()
    {
        if (play.checked) {
            box.audioDevice_close(audiodeviceid);
            audiodeviceid = box.audioDevice_open(outputdevice.currentValue, audiosettingsset.srate + "," + audiosettingsset.sbits + ",0", true);
            box.DSP_setFilterParams(dspid1, audiosettingsset.srate, 0, f, 20, Box.FT_PASSBAND);
            setGain(kGain.value);
            timeraudio.running = true;
            t = 0;
        } else {
            timeraudio.running = false;
            box.audioDevice_close(audiodeviceid);
            audiodeviceid = -1;
            graph.setData();
        }
    }


    function updateAudio()
    {
        if (audiodeviceid === -1)
            return;

        let imax = parseInt(audiosettingsset.srate * timeraudio.interval / 1000);
        let rmax = (t === 0 ? 2 : 1);
        let audio = new ArrayBuffer(4 * imax);
        let vaudio = new Float32Array(audio);
        let waudio;

        let k = 2 * Math.PI * f / audiosettingsset.srate;

        for (let r = 0; r < rmax; r++) {
            for (let i = 0; i < imax; i++) {
                if (wave === 1)
                    vaudio[i] = Math.sin(k * t);
                else if (wave === 2)
                    vaudio[i] = square(k * t);
                else if (wave === 3)
                    vaudio[i] = triangle(k * t);
                else
                    vaudio[i] = noise(k * t);
                t++;
            }

            waudio = box.viewFromBytes(audio);
            if (wave === 4)
                waudio = box.DSP_filter(dspid1, waudio);

            box.audioDevice_write(audiodeviceid, waudio);
        }

        k = 2 * Math.PI * f / 48000;

        for (let i = 0; i < graph.width; i++) {
            if (wave === 1)
                vaudio[i] = Math.sin(k * i);
            else if (wave === 2)
                vaudio[i] = square(k * i);
            else if (wave === 3)
                vaudio[i] = triangle(k * i);
            else
                vaudio[i] = noise(k * i);
        }

        waudio = box.viewFromBytes(audio);
        if (wave === 4)
            waudio = box.DSP_filter(dspid2, waudio);

        graph.setData(box.viewSlice(waudio, 0, 4 * parseInt(graph.width)));
    }


    function square(x)
    {
        x = x / 2 / Math.PI;
        x = 2 * Math.PI * (x - parseInt(x));

        return x < Math.PI ? 1 : -1;
    }


    function triangle(x)
    {
        x += Math.PI / 2;
        x = x / 2 / Math.PI;
        x = 2 * Math.PI * (x - parseInt(x));

        if (x < Math.PI)
            return -1 + 2 * x / Math.PI;
        else
            return 3 - 2 * x / Math.PI;
    }


    function noise(x)
    {
        return 2 * Math.random() - 1;
    }


    function optimalColor(hex)
    {
        let r = 255 - parseInt(hex.slice(1, 3), 16);
        let g = 255 - parseInt(hex.slice(3, 5), 16);
        let b = 255 - parseInt(hex.slice(5, 7), 16);
        
        let luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        return luminance < 128 ? '#000000' : '#ffffff';
    }
}
