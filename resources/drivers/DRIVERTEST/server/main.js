/*
 * Copyright (C) 2025 - Juan Carlos Prieto <nilibox\nilibox.com>
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

// DRIVERTEST - SERVER

let factor = 0;
let number = 0;
let box;
let timer;


function b_start(params)
{
    factor = params.factor;
    box = b_getbox();
    timer = box.timer();
    timer.interval = 100;
    timer.timeout.connect(tic);
}


function b_receive(key, value)
{
    if (key === "init")
        b_send("rectangle5", "#FFFFFF");
    else if (key === "rectangle1")
        b_send("rectangle1", color());
    else if (key === "rectangle2")
        b_send("rectangle2", color());
    else if (key === "rectangle3")
        b_send("rectangle3", color());
    else if (key === "rectangle4")
        b_send("rectangle4", color());
    else if (key === "rectangle5") {
        if (timer.active)
            timer.stop();
        else
            timer.start();
    } else if (key === "rectangle6")
        b_send("rectangle6", color());
    else if (key === "rectangle7")
        b_send("rectangle7", color());
    else if (key === "rectangle8")
        b_send("rectangle8", color());
    else if (key === "rectangle9")
        b_send("rectangle9", color());
    else if (key === "increment") {
        b_send("number", number);
        number++;
    } else if (key === "hardware")
        b_send("hardware", getHardware());
}


function b_hotplug()
{
    b_send("hardware", getHardware());
}


function tic()
{
    b_send("rectangle5", color());
}


function color()
{
    let ret = "#";
    let hex;
    for (let i = 0; i < 3; i++) {
        hex = Math.floor(256 * Math.random()).toString(16).toUpperCase();
        if (hex.length === 1)
            ret += "0";
        ret += hex;
    }

    return ret;
}


function getHardware()
{
    let t = "";
    let ids;
    let deviceid;

    if (!box)
        box = b_getbox();

    t += "<table>";
    t += "<tr><td colspan='3'>Audio In:</td></tr>";
    ids = box.audioDevice_list("INPUT").sort();
    for (let id of ids) {
        if (!id.startsWith("I:"))
            continue;
        
        t += "<tr><td></td><td colspan='2'>" + box.audioDevice_description(id);
        t += "</td></tr>";
    }
    t += "</table>";

    t += "<table>";
    t += "<tr><td colspan='3'>Audio Out:</td></tr>";
    ids = box.audioDevice_list("OUTPUT").sort();
    for (let id of ids) {
        if (id === "O:null")
            continue;
        
        t += "<tr><td></td><td colspan='2'>" + box.audioDevice_description(id);
        t += "</td></tr>";
    }
    t += "</table>";

    t += "<table>";
    t += "<tr><td colspan='3'>Video:</td></tr>";
    ids = box.videoDevice_list().sort();
    let conf;
    for (let id of ids) {
        t += "<tr><td></td><td colspan='2'>" + box.videoDevice_description(id);
        t += "</td></tr>";
    }
    t += "</table>";

    t += "<table>";
    t += "<tr><td colspan='3'>Serial:</td></tr>";
    ids = box.serialPort_list().sort();
    for (let id of ids) {
        t += "<tr><td></td><td>" + id + "</td><td>&nbsp;&nbsp;&nbsp;" + box.serialPort_description(id);
        t += "</td></tr>";
    }
    t += "</table>";

    t += "<table>";
    t += "<tr><td colspan='3'>USB:</td></tr>";
    ids = box.USBDevice_list().sort();
    let desc, manuf;
    for (let id of ids) {
        desc = box.USBDevice_description(id);
        if (!desc)
            desc = "??";
        manuf = box.USBDevice_manufacturer(id);
        if (!manuf)
            manuf = "??";
        t += "<tr><td></td><td>" + id + "</td><td>&nbsp;&nbsp;&nbsp;" + desc + " (" + manuf + ")</td></tr>";
    }
    t += "</table>";

    return box.escape(t);
}
