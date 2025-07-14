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

// ICOM_IC-PCR1000 - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property var box
    property var params;
    property real fwidth: 1 + Math.max(lserialport.width, laudiodevice.width, linputgain.width)

    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);
                       if (!serialport.contains(serialport.mapFromGlobal(p))) serialport.popup.close();
                       if (!audiodevice.contains(audiodevice.mapFromGlobal(p))) audiodevice.popup.close();
                   }
    }
    TLabel {
        id: tooltip
        name: "tooltip"
        height: 20
        z: 2
        font.pixelSize: 12
        visible: false
    }
    Flickable {
        width: 16 * b_unit
        height: b_height
        contentHeight: contentItem.childrenRect.height
        clip: true
        interactive: (contentHeight > height)
        TColumn {
            TGrid {
                columns: 2
                TLabel {
                    name: "applogo"
                    width: 3 * b_unit
                    height: 2 * b_unit
                }
                TGrid {
                    id: fields
                    columns: 2
                    TLabel {
                        id: lserialport
                        height: b_unit
                        text: b_translate("Serial port:")
                    }
                    TComboBox {
                        id: serialport
                        width: b_width - 3 * b_unit - fwidth - 2 * fields.spacing - 2 * fields.rightPadding - 2 * fields.leftPadding
                        height: b_unit
                        model: ListModel {
                            id: serialportmodel
                        }
                        onActivated: b_send("serialport", serialport.currentValue);
                    }
                    TLabel {
                        id: laudiodevice
                        height: b_unit
                        text: b_translate("Audio device:")
                    }
                    TComboBox {
                        id: audiodevice
                        width: b_width - 3 * b_unit - fwidth - 2 * fields.spacing - 2 * fields.rightPadding - 2 * fields.leftPadding
                        height: b_unit
                        model: ListModel {
                            id: audiodevicemodel
                        }
                        onActivated: b_send("audiodevice", audiodevice.currentValue);
                    }
                    TLabel {
                        id: linputgain
                        height: b_unit
                        text: b_translate("Input gain:")
                    }
                    TGrid {
                        id: ginputgain
                        columns: 2
                        TSlider {
                            id: inputgain
                            width: b_width - 3 * b_unit - igain.width - fwidth - 3 * fields.spacing - 3 * fields.rightPadding - 3 * fields.leftPadding
                            height: b_unit
                            from: 0.0
                            to: 1.0
                            stepSize: 0.05
                            onMoved: refreshGain();
                        }
                        TLabel {
                            id: igain
                            height: b_unit
                        }
                    }
                }
            }
        }
    }


    function b_start(p)
    {
        params = p;
        box = b_getbox("remote");
        refreshDevices();
    }


    function b_hotplug()
    {
        refreshDevices();
    }
    
    
    function refreshDevices()
    {
        serialportmodel.clear();
        audiodevicemodel.clear();
        
        let i;
        let serialportlist = box.serialPort_list();
        for (i = 0; i < serialportlist.length; i++)
            if (serialportlist[i].length > 0)
                serialportmodel.append({value: serialportlist[i], text: serialportlist[i] + " - " + box.serialPort_description(serialportlist[i])});

        serialport.currentIndex = Math.max(0, serialport.find(params.serialport + " - " + box.serialPort_description(params.serialport)));
        b_send("serialport", serialport.currentValue);

        let audiodevicelist = box.audioDevice_list("INPUT");
        for (i = 0; i < audiodevicelist.length; i++)
            if (audiodevicelist[i].length > 0)
                audiodevicemodel.append({value: audiodevicelist[i], text: box.audioDevice_description(audiodevicelist[i])});

        audiodevice.currentIndex = Math.max(0, audiodevice.find(box.audioDevice_description(params.audiodevice)));
        b_send("audiodevice", audiodevice.currentValue);

        if (params.inputgain)
            inputgain.value = params.inputgain;
        else
            inputgain.value = 1;

        refreshGain();
    }
    
    
    function refreshGain()
    {
        b_send("inputgain", inputgain.value);
        igain.text = Math.round(100 * inputgain.value) + " %";
    }
}
