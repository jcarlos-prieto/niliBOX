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

// WEBCAM - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property var box
    property var params

    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);
                       if (!device.contains(device.mapFromGlobal(p))) device.popup.close();
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
        TGrid {
            id: fields
            columns: 3
            TLabel {
                name: "applogo"
                width: 3 * b_unit
                height: width
            }
            TLabel {
                id: ldevice
                height: b_unit
                text: b_translate("Camera:")
            }

            TComboBox {
                id: device
                width: b_width - 3 * b_unit - ldevice.width - 1 - 2 * fields.spacing - 2 * fields.rightPadding - 2 * fields.leftPadding
                height: b_unit
                model: ListModel {
                    id: devicemodel
                }
                onActivated: b_send("videodevice", device.currentValue);
            }
        }
    }


    function b_start(p)
    {
        box = b_getbox("remote");
        params = p;
        
        refreshDevices();
    }
    
    
    function b_hotplug()
    {
        refreshDevices();
    }
    
    
    function refreshDevices()
    {
        devicemodel.clear();
        
        let devicelist = box.videoDevice_list();
        
        if (params.videodevice && !devicelist.includes(params.videodevice))
            devicelist.push(params.videodevice);
            
        for (let i = 0; i < devicelist.length; i++)
            if (devicelist[i].length > 0)
                devicemodel.append({value: devicelist[i], text: box.videoDevice_description(devicelist[i])});

        device.currentIndex = Math.max(0, device.find(box.videoDevice_description(params.videodevice)));
        b_send("videodevice", device.currentValue);
    }
}
