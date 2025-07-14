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

// WEBCAM - CLIENT

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property var    box
    property string config
    property string orientation: "LANDSCAPE"
    property int    rate
    property real   w: 1
    property real   h: 1
    property bool   scroll
    property var    rates: [30, 15, 10, 6, 5, 3, 2, 1]

    id: main
    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);
                       if (!configuration.contains(configuration.mapFromGlobal(p))) configuration.popup.close();TComboBox
                       if (!cfiles.contains(cfiles.mapFromGlobal(p))) cfiles.popup.close();
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
        width: b_width
        height: b_height
        contentHeight: contentItem.childrenRect.height
        clip: true
        interactive: scroll && (contentHeight > height)
        onDraggingChanged: {if (!dragging && (b_os === "ios" || b_os === "android")) flick(-horizontalVelocity, -verticalVelocity);}
        onContentHeightChanged: main.heightChanged();
        TColumn {
            width: 16 * b_unit
            TRow {
                TGroupBox {
                    id: control
                    height: record.height
                    TColumn {
                        TRow {
                            TComboBox {
                                id: configuration
                                width: 7 * b_unit - 2 * parent.spacing
                                height: b_unit
                                model: ListModel {
                                    id: configurationmodel
                                }
                                onCurrentTextChanged: setConfiguration(currentText)
                            }
                            TButton {
                                id: play
                                name: "play"
                                width: b_unit
                                height: width
                                checkable: true
                                tooltiptext: b_translate("Start / Stop")
                                anchors.verticalCenter: cquality.verticalCenter
                                onClicked: setPlay()
                            }
                            TButton {
                                id: shot
                                name: "shot"
                                width: b_unit
                                height: width
                                tooltiptext: b_translate("Take picture")
                                anchors.verticalCenter: cquality.verticalCenter
                                enabled: play.checked
                                onClicked: b_send("image")
                            }
                        }
                        TRow {
                            TColumn {
                                id: cquality
                                spacing: 0
                                TLabel {
                                    width: 2 * b_unit
                                    height: 0.6 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    text: b_translate("QUALITY")
                                }
                                TKnob {
                                    id: kQuality
                                    width: b_unit
                                    height: b_unit
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    min: 0
                                    max: 100
                                    step: 10
                                    anglestep: 35
                                    value: -1
                                    onValueChanged: setQuality(value);
                                    onPressedChanged: scroll = !pressed;
                                }
                                TLabel {
                                    id: lQuality
                                    width: 2 * b_unit
                                    height: 0.6 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    text: kQuality.value
                                }
                            }
                            TColumn {
                                id: crate
                                spacing: 0
                                TLabel {
                                    width: 2 * b_unit
                                    height: 0.6 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    text: b_translate("RATE")
                                }
                                TKnob {
                                    id: kRate
                                    width: b_unit
                                    height: b_unit
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    min: 0
                                    max: 7
                                    step: 1
                                    anglestep: 50
                                    value: -1
                                    onValueChanged: setRate(value);
                                    onPressedChanged: scroll = !pressed;
                                }
                                TLabel {
                                    id: lRate
                                    width: 2 * b_unit
                                    height: 0.6 * b_unit
                                    horizontalAlignment: Text.AlignHCenter
                                    text: rates[kRate.value] + " fps"
                                }
                            }
                            TButton {
                                id: bMirror
                                height: 0.7 * b_unit
                                checkable: true
                                padding: b_space
                                anchors.verticalCenter: cquality.verticalCenter
                                text: b_translate("MIRROR")
                                onClicked: setMirror(checked);
                            }
                            TLabel {
                                id: lmbps
                                height: b_unit
                                anchors.verticalCenter: cquality.verticalCenter
                            }
                        }
                    }
                }
                TGroupBox {
                    id: record
                    width: 6.5 * b_unit
                    TColumn {
                        TLabel {
                            id: tfiles
                            height: b_unit
                            font.pixelSize: 0.35 * height
                            text: b_translate("FILES")
                        }
                        TComboBox {
                            id: cfiles
                            name: "cfiles"
                            width: record.availableWidth
                            height: b_unit
                            font.pixelSize: 0.35 * height
                            model: ListModel {
                                id: cfilesItems
                            }
                        }
                        TRow {
                            TButton {
                                id: bRecordSave
                                name: "savebutton"
                                width: (cfiles.width - parent.spacing) / 2
                                height: b_unit
                                tooltiptext: b_translate("Save")
                                enabled: cfiles.currentText.length > 0
                                onClicked: imageSave()
                            }
                            TButton {
                                id: bRecordDelete
                                name: "deletebutton"
                                width: (cfiles.width - parent.spacing) / 2
                                height: b_unit
                                tooltiptext: b_translate("Delete")
                                enabled: cfiles.currentText.length > 0
                                onClicked: imageDelete()
                            }
                        }
                    }
                }
            }
            TVideoFrame {
                id: frame
                width: orientation === "LANDSCAPE" ? (w > b_width ? b_width : w) : (h > b_height ? b_height : h)
                height: orientation === "LANDSCAPE" ? (w > b_width ? h * b_width / w : h) : (h > b_height ? w * b_height / h : w)
            }
        }
    }


    function b_start(params)
    {
        box = b_getbox();
        scroll = true;

        setMirror(b_getvar("mirror") === "true", false);
        setQuality(b_getvar("quality", 20));
        setRate(b_getvar("rate", 2));

        b_send("init");
        updateImages();
    }


    function b_receive(key, value)
    {
        if (key === "configurations")
            configurations(value);
        else if (key === "orientation")
            orientation = value;
        else if (key === "clean")
            frame.setData();
    }


    function b_receivebin(key, value)
    {
        if (key === "video") {
            frame.setData(value);
            if (b_conn() !== "SELF") {
                let kbps = Math.round(box.viewSize(value) * rates[kRate.value] / 125);
                if (kbps >= 1000)
                    lmbps.text = Math.round(kbps / 1000) + " Mbps";
                else
                    lmbps.text = kbps + " kbps";
            }
        } else if (key === "image")
            setShot(value);
    }


    function configurations(value)
    {
        let list;
        
        if (value)
            list = value.split(";");
        else
            list = [];

        configurationmodel.clear();

        for (let i = 0; i < list.length; i++)
            configurationmodel.append({text: list[i]});

        let config = b_getvar("config");
        configuration.currentIndex = Math.max(0, configuration.find(config));

        if (value.length === 0) {
            play.enabled = false;
            play.checked = false;
            setPlay();
        } else
            play.enabled = true;
    }


    function setConfiguration(value)
    {
        b_setvar("config", value);

        config = value;

        let asize = config.split("x");
        w = asize[0];
        h = asize[1];

        if (play.checked)
            setPlay();
    }


    function setMirror(value)
    {
        bMirror.checked = value;
        b_setvar("mirror", value);
        frame.mirror = value;
    }


    function setQuality(value)
    {
        if (kQuality.value === -1) {
            kQuality.value = value;
            kQuality.angle = (value - kQuality.min) / kQuality.step * kQuality.anglestep;
        }

        b_setvar("quality", value);
        b_send("quality", value);
    }


    function setRate(value)
    {
        if (kRate.value === -1) {
            kRate.value = value;
            kRate.angle = (value - kRate.min) / kRate.step * kRate.anglestep;
        }

        b_setvar("rate", value);
        b_send("rate", rates[value]);
    }


    function setPlay()
    {
        if (play.checked) {
            b_send("play", config);
            b_send("quality", kQuality.value);
        } else {
            b_send("stop");
            lmbps.text = "";
        }
    }


    function setShot(data)
    {
        let filename = "_Save_" + new Date().toLocaleString(Qt.locale("de_DE"), "yyyy.MM.dd HH.mm.ss") + ".jpg";
        let file = box.file_openWrite(filename);
        box.file_write(file, data);
        box.file_close(file);
        updateImages();
    }


    function imageSave()
    {
        let file = cfiles.currentText;
        let n = file.indexOf("\n(");
        if (n > -1)
            file = file.substr(0, n);
        file = "_Save_" + file + ".jpg";
        box.file_save(file);
    }


    function imageDelete()
    {
        let file = cfiles.currentText;
        let n = file.indexOf("\n(");
        if (n > -1)
            file = file.substr(0, n);
        file = "_Save_" + file + ".jpg";
        box.file_delete(file);
        updateImages();
    }


    function updateImages()
    {
        let files = box.file_list("_Save_*.jpg");

        cfilesItems.clear();

        let file, disp, size;
        for (let i = 0; i < files.length; i++) {
            file = files[i].split(":");
            disp = file[0].replace("_Save_", "").replace(".jpg", "") + "\n(";
            size = parseInt(file[1]);

            if (size < 1048576)
                disp += Math.ceil(size / 1024) + "KB)";
            else if (size < 10485760)
                disp += Math.ceil(size / 104857.6) / 10 + "MB)";
            else
                disp += Math.ceil(size / 1048576) + "MB)";

            cfilesItems.append({text: disp});
        }
        cfiles.currentIndex = files.length - 1;
    }
}
