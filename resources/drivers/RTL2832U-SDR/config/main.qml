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

// RTL2832U-SDR - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box
import "rtlsdr.mjs" as RTLSDR


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
        TColumn {
            Rectangle {
                width: 0.5 * b_unit
                height: width
                color: "transparent"
            }
            TRow {
                id: fields
                TLabel {
                    id: logo
                    name: "applogo"
                    width: 3 * b_unit
                    height: 2 * b_unit
                }
                TLabel {
                    id: ldevice
                    height: b_unit
                    anchors.verticalCenter: logo.verticalCenter
                    text: b_translate("Device:")
                }
                TComboBox {
                    id: device
                    width: b_width - 3 * b_unit - ldevice.width - 1 - 2 * fields.spacing - 2 * fields.rightPadding - 2 * fields.leftPadding
                    height: b_unit
                    anchors.verticalCenter: logo.verticalCenter
                    model: ListModel {
                        id: devicemodel
                    }
                    onActivated: b_send("device", device.currentValue);
                }
            }
            TLabel {
                width: b_width
                font.pixelSize: 0.45 * b_unit
                verticalAlignment: Text.AlignVCenter
                wrapMode: Text.WordWrap
                visible: box ? box.os() === "windows" : false
                text: b_translate("If the hardware is not recognized, try installing the WinUSB driver. Use Zadig from: ") + "<a href='https://zadig.akeo.ie'>https://zadig.akeo.ie</a>"
                onLinkActivated: (link)=> Qt.openUrlExternally(link);
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
        RTLSDR.init(box);
        devicemodel.clear();

        let devicelist = RTLSDR.list();
        if (devicelist.length === 0)
            return;

        for (let i = 0; i < devicelist.length; i++)
            if (devicelist[i].length > 0)
                devicemodel.append({value: devicelist[i], text: devicelist[i]});

        device.currentIndex = params.device ? device.find(params.device) : 0;
        b_send("device", device.currentValue);
    }
}
