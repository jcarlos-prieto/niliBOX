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

// RELAY - SERVER

let localparams;
let box;
let devices = {};
let sts = {};
let settings = {};


function b_start(params)
{
    localparams = params;
    box = b_getbox();

    let devicename;
    for (let i = 1; i <= localparams.number; i++) {
        sts[i] = false;
        devicename = localparams["device" + i].substr(4);
        if (!devices.hasOwnProperty(devicename)) {
            if (localparams["device" + i].startsWith("COM:")) {
                devices[devicename] = box.serialPort_open(devicename, localparams["settings" + i]);
                box.serialPort_Data.connect(deviceData);
            } else if (localparams["device" + i].startsWith("USB:")) {
                settings[devicename] = localparams["settings" + i].split(",");
                devices[devicename] = box.USBDevice_open(devicename, parseInt(settings[devicename][1]));
                box.USB_Data.connect(deviceData);
                box.USB_bulk_transfer_setBufLen(devices[devicename], 20);
                box.USB_bulk_transfer_start(devices[devicename], 0x80 | parseInt(settings[devicename][2]));
            }
        }
    }
}


function b_finish()
{
    let devicename;
    for (let i = 1; i <= localparams.number; i++) {
        devicename = localparams["device" + i].substr(4);
        if (devices.hasOwnProperty(devicename)) {
            if (localparams["device" + i].startsWith("COM:")) {
                box.serialPort_close(devices[devicename]);
                box.serialPort_Data.disconnect(deviceData);
            } else if (localparams["device" + i].startsWith("USB:")) {
                box.USB_bulk_transfer_stop(devices[devicename]);
                box.USB_Data.disconnect(deviceData);
                box.USB_close(devices[devicename]);
            }
        }
    }
}


function b_receive(key, value)
{
    if (key === "number") {
        b_send("number", localparams.number);

    } else if (key === "names") {
        let names = "";
        for (let i = 1; i <= localparams.number; i++)
            names += localparams["name" + i] + ";";
        b_send("names", names);

    } else if (key === "seton") {
        sts[value] = true;
        let command = localparams["seton" + value];
        sendCommand(command, value);

    } else if (key === "setoff") {
        sts[value] = false;
        let command = localparams["setoff" + value];
        sendCommand(command, value);

    } else if (key === "getstatus") {
        let command = localparams["getstatus" + value];
        sendCommand(command, value);
    }
}


function sendCommand(command, index)
{
    let devicename = localparams["device" + index].substr(4);
    command = "0000" + command;
    let commands = command.split("\\w");
    let t, c, pc;
    for (let i = 0; i < commands.length; i++) {
        t = parseInt(commands[i].substr(0, 4));
        c = commands[i].substr(4);
        pc = parseCommand(c);
        if (t > 0) box.sleep(t);
        if (localparams["device" + index].startsWith("COM:"))
            box.serialPort_write(devices[devicename], pc);
        else if (localparams["device" + index].startsWith("USB:")) {
            if (settings[devicename][0] === "bulk")
                box.USB_bulk_transfer(parseInt(devices[devicename]), parseInt(settings[devicename][2]), pc, pc.length, 1000);
            else  {
                let r = box.USB_control_transfer(devices[devicename],
                                                 parseInt(settings[devicename][1]),
                                                 parseInt(settings[devicename][2]),
                                                 parseInt(settings[devicename][3]),
                                                 parseInt(settings[devicename][4]),
                                                 pc, pc.length, 1000);
                deviceData(devices[devicename], r);
            }
        }
    }
}


function parseCommand(command)
{
    let res = command;
    res = parse_s(res);
    res = parse_x(res);
    res = parse_b(res);
    res = parse_e(res);
    return res;
}


function parse_s(command)
{
    while (true) {
        let n0 = command.indexOf("\\s");
        if (n0 < 0)
            break;
        let n1 = command.indexOf(":", n0 + 1);
        if (n1 < 0)
            break;
        let n2 = command.indexOf(":", n1 + 1);
        if (n2 < 0)
            break;
        let n3 = command.indexOf(":", n2 + 1);
        if (n3 < 0)
            break;
        let v = sts[parseInt(command.substring(n0 + 2, n1))];
        let v1 = command.substring(n1 + 1, n2);
        let v2 = command.substring(n2 + 1, n3);
        if (n0 === 0)
            command = (v ? v1 : v2) + command.substr(n3);
        else
            command = command.substr(0, n0) + (v ? v1 : v2) + command.substr(n3 + 1);
    }
    return command;
}


function parse_x(command)
{
    let res = command;
    let n, v;
    while (true) {
        n = res.indexOf("\\x");
        if (n < 0)
            break;
        v = String.fromCharCode(parseInt(res.substr(n + 2, 2), 16));
        if (n === 0)
            res = v + res.substr(4);
        else
            res = res.substr(0, n) + v + res.substr(n + 4);
    }
    return res;
}


function parse_b(command)
{
    let res = command;
    let n, v;
    while (true) {
        n = res.indexOf("\\b");
        if (n < 0)
            break;
        v = String.fromCharCode(parseInt(res.substr(n + 2, 8), 2));
        if (n === 0)
            res = v + res.substr(10);
        else
            res = res.substr(0, n) + v + res.substr(n + 10);
    }
    return res;
}


function parse_e(command)
{
    let res = command;
    res = res.replace("\\t", String.fromCharCode(9));
    res = res.replace("\\n", String.fromCharCode(10));
    res = res.replace("\\r", String.fromCharCode(13));
    return res;
}


function deviceData(id, data)
{
    let sdata = data.toString();
    let devicename, v;
    for (let i = 1; i <= localparams.number; i++) {
        devicename = localparams["device" + i].substr(4);
        if (devices[devicename] === id) {
            v = parseCommand(localparams["statuson" + i]);
            if (v.indexOf("|") > -1)
                v = v.split("|");
            else
                v = [v];
            for (let j = 0; j < v.length; j++)
                if (sdata.includes(v[j])) {
                    sts[i] = true;
                    b_send("status", i + ";on");
                }
            v = parseCommand(localparams["statusoff" + i]);
            if (v.indexOf("|") > -1)
                v = v.split("|");
            else
                v = [v];
            for (let j = 0; j < v.length; j++)
                if (sdata.includes(v[j])) {
                    sts[i] = true;
                    b_send("status", i + ";off");
                }
        }
    }
}
