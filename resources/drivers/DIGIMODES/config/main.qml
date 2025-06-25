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

// DIGIMODES - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property var box
    property var params;
    
    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);
                       if (!serialport.contains(serialport.mapFromGlobal(p))) serialport.popup.close();
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
            Rectangle {
                width: b_unit
                height: width
                color: "transparent"
            }
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
                        id: ldevice
                        height: b_unit
                        text: b_translate("AMBE3000 device:")
                    }
                    TComboBox {
                        id: serialport
                        width: b_width - 3 * b_unit - Math.max(ldevice.width, lsoft.width) - 1 - 2 * fields.spacing - 2 * fields.rightPadding - 2 * fields.leftPadding
                        height: b_unit
                        model: ListModel {
                            id: serialportmodel
                        }
                        onActivated: b_send("serialport", serialport.currentValue);
                    }
                    TLabel {
                        id: lsoft
                        height: serialport.currentValue === "SOFT" ? b_unit : 0
                        clip: true
                        color: "red"
                        text: b_translate("Software emulation")
                    }
                    TLabel {
                        height: serialport.currentValue === "SOFT" ? b_unit : 0
                        clip: true
                        color: "red"
                        text: b_translate("Testing purposes only")
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
        let serialportlist = box.serialPort_list();
        serialportmodel.append({value: "SOFT", text: "Software"});
        for (let i = 0; i < serialportlist.length; i++)
            if (serialportlist[i].length > 0)
                serialportmodel.append({value: serialportlist[i], text: serialportlist[i] + " - " + box.serialPort_description(serialportlist[i])});

        serialport.currentIndex = params.serialport === "SOFT" ? serialport.find("Software") : Math.max(0, serialport.find(params.serialport + " - " + box.serialPort_description(params.serialport)));
        b_send("serialport", serialport.currentValue);
    }
}
