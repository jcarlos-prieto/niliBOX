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

// RELAY - CONFIG

import QtQuick
import QtQuick.Controls
import niliBOX.Controls
import niliBOX.Box


Item {
    property var  remotebox
    property var  localparams
    property real fwidth: 1 + Math.max(lname.width, ldevice.width, lsettings.width, lcommands.width, lgetstatus.width, lseton.width, lsetoff.width, lstatuson.width, lstatusoff.width)

    MouseArea {
        z: 1
        anchors.fill: parent
        propagateComposedEvents: true
        onPressed: (mouse)=> {
                       mouse.accepted = false;
                       let p = mapToGlobal(mouseX, mouseY);
                       if (!relay.contains(relay.mapFromGlobal(p))) relay.popup.close();
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
            TRow {
                TLabel {
                    name: "applogo"
                    id: image
                    width: 3 * b_unit
                    height: width
                }
                TGrid {
                    columns: 2
                    TLabel {
                        height: b_unit
                        text: b_translate("Number of relays:")
                    }
                    TLineEdit {
                        id: number
                        width: 3 * b_unit
                        height: b_unit
                        horizontalAlignment: Text.AlignRight
                        onEditingFinished: {
                            b_send("number", text);
                            refreshNumber();
                        }
                    }
                    TLabel {
                        height: b_unit
                        text: b_translate("Relay:")
                    }
                    TComboBox {
                        id: relay
                        width: 3 * b_unit
                        height: b_unit
                        model: ListModel {
                            id: relaymodel
                        }
                        onActivated: refreshRelay();
                    }
                }
            }
            TGrid {
                id: fields
                columns: 2
                TLabel {
                    id: lname
                    height: b_unit
                    text: b_translate("Name:")
                }
                TLineEdit {
                    id: name
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("name" + relay.currentText, text);
                            localparams["name" + relay.currentText] = text;
                        }
                    }
                }
                TLabel {
                    id: ldevice
                    height: b_unit
                    text: b_translate("Device:")
                }
                TComboBox {
                    id: device
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    model: ListModel {
                        id: devicemodel
                    }
                    onActivated: {
                        if (relay.currentText.length > 0) {
                            b_send("device" + relay.currentText, currentValue);
                            localparams["device" + relay.currentText] = currentValue;
                        }
                    }
                }
                TLabel {
                    id: lsettings
                    height: b_unit
                    text: b_translate("Settings:")
                }
                TRow {
                    TButton {
                        name: "help"
                        width: b_unit
                        height: b_unit
                        tooltiptext: b_translate("Information")
                        onClicked: {
                            if (device.currentValue.startsWith("COM:"))
                                popup0.open();
                            else
                                popup1.open();
                        }
                    }
                    TLineEdit {
                        id: settings
                        width: b_width - b_unit - fwidth - 2 * fields.spacing - fields.rightPadding - fields.leftPadding
                        height: b_unit
                        enabled: relay.currentText.length > 0
                        onEditingFinished: {
                            if (relay.currentText.length > 0) {
                                b_send("settings" + relay.currentText, text);
                                localparams["settings" + relay.currentText] = text;
                            }
                        }
                    }
                }
                TLabel {
                    id: lcommands
                    height: b_unit
                    text: b_translate("COMMANDS")
                }
                TButton {
                    name: "help"
                    width: b_unit
                    height: b_unit
                    tooltiptext: b_translate("Information")
                    onClicked: popup2.open();
                }
                TLabel {
                    id: lgetstatus
                    height: b_unit
                    text: b_translate("Initialization:")
                }
                TLineEdit {
                    id: getstatus
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("getstatus" + relay.currentText, text);
                            localparams["getstatus" + relay.currentText] = text;
                        }
                    }
                }
                TLabel {
                    id: lseton
                    height: b_unit
                    text: b_translate("Set ON:")
                }
                TLineEdit {
                    id: seton
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("seton" + relay.currentText, text);
                            localparams["seton" + relay.currentText] = text;
                        }
                    }
                }
                TLabel {
                    id: lsetoff
                    height: b_unit
                    text: b_translate("Set OFF:")
                }
                TLineEdit {
                    id: setoff
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("setoff" + relay.currentText, text);
                            localparams["setoff" + relay.currentText] = text;
                        }
                    }
                }
                TLabel {
                    id: lstatuson
                    height: b_unit
                    text: b_translate("Status ON:")
                }
                TLineEdit {
                    id: statuson
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("statuson" + relay.currentText, text);
                            localparams["statuson" + relay.currentText] = text;
                        }
                    }
                }
                TLabel {
                    id: lstatusoff
                    height: b_unit
                    text: b_translate("Status OFF:")
                }
                TLineEdit {
                    id: statusoff
                    width: b_width - fwidth - fields.spacing - fields.rightPadding - fields.leftPadding
                    height: b_unit
                    enabled: relay.currentText.length > 0
                    onEditingFinished: {
                        if (relay.currentText.length > 0) {
                            b_send("statusoff" + relay.currentText, text);
                            localparams["statusoff" + relay.currentText] = text;
                        }
                    }
                }
            }
            Popup {
                id: popup0
                anchors.centerIn: parent
                modal: true
                TColumn {
                    spacing: 0
                    TLabel {height: 0.9 * b_unit; text: "<b>" + b_translate("COM Settings:") + "</b>"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("baudrate,parity,databits,stopbits,flowcontrol")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("baudrate: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("parity:") + " <b>N</b>one, <b>E</b>ven, <b>O</b>dd, <b>S</b>pace, <b>M</b>ark"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("databits:") + " <b>8</b>, <b>7</b>, <b>6</b>, <b>5</b>"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("stopbits:") + " <b>1</b>, <b>1.5</b>, <b>2</b>"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("flowcontrol:") + " <b>NO</b>, <b>HW</b>, <b>SW</b>"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("Example: 9600,N,8,1,NO")}
                    TButton {
                        width: 4 * b_unit
                        height: b_unit
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: b_translate("Close")
                        onClicked: popup0.close();
                    }
                }
            }
            Popup {
                id: popup1
                anchors.centerIn: parent
                modal: true
                TColumn {
                    spacing: 0
                    TLabel {height: 0.9 * b_unit; text: "<b>" + b_translate("USB Settings:") + "</b>"}
                    TLabel {height: 0.9 * b_unit; text: b_translate("<b>bulk</b>,interface,endpoint")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("OR")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("<b>control</b>,bmRequestType,bRequest,wValue,wIndex")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("interface: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("endpoint: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("bmRequestType: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("bRequest: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("wValue: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("wIndex: number")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("Example: bulk,3")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("Example: control,3")}
                    TButton {
                        width: 4 * b_unit
                        height: b_unit
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: b_translate("Close")
                        onClicked: popup1.close();
                    }
                }
            }
            Popup {
                id: popup2
                anchors.centerIn: parent
                modal: true
                TColumn {
                    spacing: 0
                    TLabel {height: 0.9 * b_unit; text: "<b>" + b_translate("COMMANDS:") + "</b>"}
                    TLabel {height: 0.9 * b_unit; text: "\\xNN - " + b_translate("Hexadecimal number (2 digits)")}
                    TLabel {height: 0.9 * b_unit; text: "\\bNNNNNNNN - " + b_translate("Binary number (8 digits)")}
                    TLabel {height: 0.9 * b_unit; text: "\\wNNNN - " + b_translate("Wait NNNN msec (4 digits)")}
                    TLabel {height: 0.9 * b_unit; text: "\\sN:v1:v2: - " + b_translate("If relay N is 'on' then v1, otherwise v2")}
                    TLabel {height: 0.9 * b_unit; text: b_translate("Escape characters: ") + "\\n  \\r  \\t"}
                    TLabel {height: 0.9 * b_unit; text: "| - " + b_translate("'or' separator (status only)")}
                    TButton {
                        width: 4 * b_unit
                        height: b_unit
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: b_translate("Close")
                        onClicked: popup2.close();
                    }
                }
            }
        }
    }


    function b_start(params)
    {
        remotebox = b_getbox("remote");
        localparams = params;

        number.text = params.number ? params.number : "0";

        refreshDevices();
        refreshNumber();
    }
    
    
    function b_hotplug()
    {
        refreshDevices();
    }
    
    
    function refreshDevices()
    {
        devicemodel.clear();
        
        let i;
        let deviceid;
        let devicedesc;

        let devicelist = remotebox.serialPort_list();

        for (i = 0; i < devicelist.length; i++)
            if (devicelist[i].length > 0) {
                deviceid = "COM:" + devicelist[i];
                devicedesc = remotebox.serialPort_description(devicelist[i]);
                if (devicedesc)
                    devicemodel.append({value: deviceid, text: deviceid + " - " + devicedesc});
            }

        devicelist = remotebox.USBDevice_list();

        for (i = 0; i < devicelist.length; i++)
            if (devicelist[i].length > 0) {
                deviceid = "USB:" + devicelist[i];
                devicedesc = remotebox.USBDevice_description(devicelist[i]);
                if (devicedesc)
                    devicemodel.append({value: deviceid, text: deviceid + " - " + devicedesc});
            }

        device.currentIndex = Math.max(0, device.find(localparams["device" + relay.currentText], Qt.MatchStartsWith));
    }


    function refreshNumber()
    {
        if (relay.currentText.length === 0)
            relay.currentIndex = 0;

        let index = relay.currentIndex;

        relaymodel.clear();

        for (let i = 1; i <= number.text; i++)
            relaymodel.append({value: i, text: i});

        if (index < number.text)
            relay.currentIndex = index;
        else
            relay.currentIndex = number.text - 1;

        refreshRelay();
    }


    function refreshRelay()
    {
        if (localparams["device" + relay.currentText]) {
            let dev = localparams["device" + relay.currentText];
            device.currentIndex = device.find(dev, Qt.MatchStartsWith);
        } else
            device.currentIndex = 0;

        let n = parseInt(relay.currentText);
        if (n < 1)
            return;

        name.text = localparams["name" + n] ? localparams["name" + n] : "";
        settings.text = localparams["settings" + n] ? localparams["settings" + n] : "";
        seton.text = localparams["seton" + n] ? localparams["seton" + n] : "";
        setoff.text = localparams["setoff" + n] ? localparams["setoff" + n] : "";
        getstatus.text = localparams["getstatus" + n] ? localparams["getstatus" + n] : "";
        statuson.text = localparams["statuson" + n] ? localparams["statuson" + n] : "";
        statusoff.text = localparams["statusoff" + n] ? localparams["statusoff" + n] : "";
        b_send("name" + n, name.text);
        b_send("settings" + n, settings.text);
        b_send("device" + n, device.currentValue);
        b_send("seton" + n, seton.text);
        b_send("setoff" + n, setoff.text);
        b_send("getstatus" + n, getstatus.text);
        b_send("statuson" + n, statuson.text);
        b_send("statusoff" + n, statusoff.text);
        localparams["name" + n] = name.text;
        localparams["settings" + n] = settings.text;
        localparams["device" + n] = device.currentValue;
        localparams["seton" + n] = seton.text;
        localparams["setoff" + n] = setoff.text;
        localparams["getstatus" + n] = getstatus.text;
        localparams["statuson" + n] = statuson.text;
        localparams["statusoff" + n] = statusoff.text;
    }
}
