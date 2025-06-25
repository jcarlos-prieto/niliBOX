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

// ICOM_IC-PCR1500 - SERVER

let audiodeviceid = -1;
let audiodevicename = "";
let box;
let vcbits = 0;
let inputgain = 0;
let localaudio = false;
let rdata;
let vsbits = 0;
let serialportid = -1;
let serialportname = "";
let smetercurrent = -1;
let vsrate = 0;
let status = {};


function b_start(params)
{
    serialportname = params.serialport;
    audiodevicename = params.audiodevice;
    localaudio = params.localaudio;
    inputgain = params.inputgain;
    box = b_getbox();
    rdata = "";

    box.serialPort_Data.connect(serialPortData);
    box.serialPort_Error.connect(serialPortError);
    box.audioDevice_Data.connect(audioDeviceData);
}


function b_finish()
{
    box.serialPort_Data.disconnect(serialPortData);
    box.audioDevice_Data.disconnect(audioDeviceData);

    if (serialportid > -1) {
        box.serialPort_write(serialportid, "H100\r\n");
        box.sleep(20);
        box.serialPort_close(serialportid);
    }
    if (audiodeviceid > -1) {
        box.audioDevice_close(audiodeviceid);
        b_send("closeaudio");
    }
    b_send("power", 0);
    b_send("smeter", 0);
}


function b_receive(key, value)
{
    if (key === "init")
        init();
    else if (key === "power")
        power(value);
    else if (key === "srate")
        srate(value);
    else if (key === "sbits")
        sbits(value);
    else if (key === "cbits")
        cbits(value);
    else if (key === "afgain")
        afgain(value);
    else if (key === "squelch")
        squelch(value);
    else if (key === "ifshift")
        ifshift(value);
    else if (key === "freq")
        freq(value);
    else if (key === "band")
        band(value);
    else if (key === "filter")
        filter(value);
    else if (key === "vsc")
        vsc(value);
    else if (key === "afc")
        afc(value);
    else if (key === "nb")
        nb(value);
    else if (key === "att")
        att(value);
    else if (key === "agc")
        agc(value);
    else if (key === "span")
        span(value);
    else if (key === "dsp")
        dsp(value);
    else if (key === "anf")
        anf(value);
    else if (key === "nr")
        nr(value);
    else if (key === "tsql")
        tsql(value);
    else if (key === "tsqlfreq")
        tsqlfreq(value);
    else if (key === "dtcs")
        dtcs(value);
    else if (key === "dtcscode")
        dtcscode(value);
    else if (key === "reverseaction")
        reverseaction(value);
    else if (key === "reversepolarity")
        reversepolarity(value);
    else if (key === "scan")
        scan(value);
    else if (key === "scanlevel")
        scanlevel(value);
    else if (key === "scanedge")
        scanedge(value);
}


function b_hotplug()
{
    if (serialportid === -1)
        init();
}


function init() 
{
    serialportid = box.serialPort_open(serialportname, "9600,N,8,1,NO");
    if (serialportid > -1) {
        box.serialPort_close(serialportid);
        serialportid = -1;
        b_send("localaudio", localaudio);
        b_send("power", 0);
    } else
        b_send("power", -1);
}


function serialPortData(portid, data)
{
    if (portid !== serialportid)
        return;

    rdata += data;

    while (rdata.length > 1) {
        if (rdata.substr(0, 2) === "I0") {
            if (rdata.length < 3)
                break;
            if (rdata.substr(0, 3) === "I0?") {
                rdata = rdata.substr(3);
                continue;
            }
            if (rdata.length < 4)
                break;
            let n = parseInt(rdata.substr(2, 2), 16);
            if (n & 1)
                b_send("busy", "true");
            else
                b_send("busy", "false");
            if (n & 2)
                b_send("ctcss", "true");
            else
                b_send("ctcss", "false");
            if (n & 4)
                b_send("vsc", "true");
            else
                b_send("vsc", "false");
            rdata = rdata.substr(4);
        } else if (rdata.substr(0, 2) === "I1") {
            if (rdata.length < 4)
                break;
            let n = Math.floor(parseInt(rdata.substr(2, 2), 16) * 26 / 255);
            if (n !== smetercurrent) {
                b_send("smeter", n);
                smetercurrent = n;
            }
            rdata = rdata.substr(4);
        } else if (rdata.substr(0, 2) === "I2") {
            if (rdata.length < 4)
                break;
            let n = parseInt(rdata.substr(2, 2), 16);
            if (n === 0)
                b_send("afc", "center");
            else if (n === 128)
                b_send("afc", "left");
            else if (n === 255)
                b_send("afc", "right");
            rdata = rdata.substr(4);
        } else if (rdata.substr(0, 2) === "NE") {
            if (rdata.length < 37)
                break;
            b_send("bscope", rdata[3] + rdata.substr(5, 32));
            rdata = rdata.substr(37);
        } else if (rdata.substr(0, 2) === "GD") {
            if (rdata.length < 4)
                break;
            let n = parseInt(rdata.substr(2, 2), 16);
            if (n & 1)
                b_send("dsp", "true");
            else
                b_send("dsp", "false");
            if (n & 4)
                b_send("darc", "true");
            else
                b_send("darc", "false");
            rdata = rdata.substr(4);
        } else if (rdata.substr(0, 2) === "H9") {
            if (rdata.length < 4)
                break;
            if (rdata.substr(2, 2) === "01")
                b_send("scan", "next");
            else if (rdata.substr(2, 2) === "10")
                b_send("scan", "hit");
            rdata = rdata.substr(4);
        } else
            rdata = rdata.substr(1);
    }
}


function serialPortError(id)
{
    if (id !== serialportid)
        return;
    
    box.serialPort_close(serialportid);
    box.audioDevice_close(audiodeviceid);
    serialportid = -1;
    b_send("closeaudio");
    b_send("power", -1);
}


function audioDeviceData(devid, data)
{
    if (devid !== audiodeviceid)
        return;

    if (vcbits > 0)
        data = box.DSP_compress(data, vcbits);

    b_sendbin("audio", data);
}


function power(action)
{
    if (action === "0") {
        serialportid = box.serialPort_open(serialportname, "9600,N,8,1,NO");
        if (serialportid > -1) {
            box.serialPort_DTR(serialportid, 1);
            box.serialPort_RTS(serialportid, 1);
            box.serialPort_write(serialportid, "H101\r\n");
            box.sleep(50);
            box.serialPort_write(serialportid, "H101\r\n");
            box.serialPort_write(serialportid, "G105\r\n");
            box.sleep(50);
            box.serialPort_close(serialportid);
            serialportid = box.serialPort_open(serialportname, "38400,N,8,1,NO");
            if (serialportid > -1) {
                box.serialPort_DTR(serialportid, 1);
                box.serialPort_RTS(serialportid, 1);
                box.serialPort_write(serialportid, "H101\r\n");
                box.sleep(50);
                box.serialPort_write(serialportid, "H101\r\n");
                box.serialPort_write(serialportid, "GD?\r\n");
                box.serialPort_write(serialportid, "G301\r\n");
                box.serialPort_write(serialportid, "J4000\r\n");
                box.serialPort_write(serialportid, "J4100\r\n");
                box.serialPort_write(serialportid, "J5000\r\n");
                box.serialPort_write(serialportid, "J5100\r\n");
                box.serialPort_write(serialportid, "J4700\r\n");
                box.serialPort_write(serialportid, "J4D00\r\n");
                box.serialPort_write(serialportid, "J8001\r\n");
                box.serialPort_write(serialportid, "JA101\r\n");
                box.serialPort_write(serialportid, "JA001\r\n");
                box.serialPort_write(serialportid, "LD82000\r\n");

                status.p_afgain = false;
                status.p_squelch = false;
                status.p_ifshift = false;
                status.p_anl = false;
                status.p_att = false;
                status.p_span = false;
                status.p_freq = false;
                status.p_tsql = false;

                setAudioMode();
                b_send("power", 1);
            } else
                b_send("power", -1);
        } else
            b_send("power", -1);
    } else if (action === "1") {
        box.serialPort_write(serialportid, "H100\r\n");
        box.sleep(20);
        box.serialPort_close(serialportid);
        box.audioDevice_close(audiodeviceid);
        serialportid = -1;
        b_send("power", 0);
        b_send("closeaudio");
        b_send("smeter", 0);
    } else
        init();
}


function setAudioMode()
{
    if (serialportid === -1)
        return;

    if (audiodeviceid > -1)
        box.audioDevice_close(audiodeviceid);

    let audiomode = vsrate + "," + vsbits + "," + vcbits;
    audiodeviceid = box.audioDevice_open(audiodevicename, audiomode);
    box.audioDevice_setVolume(audiodeviceid, inputgain);
    b_send("openaudio", audiomode);
}


function srate(value)
{
    vsrate = value;
    setAudioMode();
}


function sbits(value)
{
    vsbits = value;
    setAudioMode();
}


function cbits(value)
{
    vcbits = value;
    setAudioMode();
}


function afgain(value)
{
    let dup = false;
    if (status.p_afgain)
        if (status.p_afgain === value)
            dup = true;
    if (!dup) {
        status.p_afgain = value;
        box.serialPort_write(serialportid, "J40" + toHex(value) + "\r\n");
    }
}


function squelch(value)
{
    let dup = false;
    if (status.p_squelch)
        if (status.p_squelch === value)
            dup = true;
    if (!dup) {
        status.p_squelch = value;
        box.serialPort_write(serialportid, "J41" + toHex(value) + "\r\n");
    }
}


function ifshift(value)
{
    let dup = false;
    if (status.p_ifshift)
        if (status.p_ifshift === value)
            dup = true;
    if (!dup) {
        status.p_ifshift = value;
        box.serialPort_write(serialportid, "J43" + toHex(value) + "\r\n");
    }
}


function freq(value)
{
    status.freq = value;
    updateFreq();
}


function band(value)
{
    status.band = value;
    updateFreq();
}


function filter(value)
{
    status.filter = value;
    updateFreq();
}


function vsc(value)
{
    let dup = false;
    if (status.p_vsc)
        if (status.p_vsc === value)
            dup = true;
    if (!dup) {
        status.p_vsc = value;
        box.serialPort_write(serialportid, "J50" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function afc(value)
{
    let dup = false;
    if (status.p_afc)
        if (status.p_afc === value)
            dup = true;
    if (!dup) {
        status.p_afc = value;
        box.serialPort_write(serialportid, "J42" + (value === "true" ? "01" : "00") + "\r\n"); // J44?
    }
}


function nb(value)
{
    let dup = false;
    if (status.p_nb)
        if (status.p_nb === value)
            dup = true;
    if (!dup) {
        status.p_nb = value;
        box.serialPort_write(serialportid, "J46" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function att(value)
{
    let dup = false;
    if (status.p_att)
        if (status.p_att === value)
            dup = true;
    if (!dup) {
        status.p_att = value;
        box.serialPort_write(serialportid, "J47" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function agc(value)
{
    let dup = false;
    if (status.p_agc)
        if (status.p_agc === value)
            dup = true;
    if (!dup) {
        status.p_agc = value;
        box.serialPort_write(serialportid, "J45" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function span(value)
{
    let command = "";

    if (value === "0")
        command = "ME0000100000000000000";
    else if (value === "1")
        command = "ME00001FF010100000200";
    else if (value === "2")
        command = "ME00001FF010100000400";
    else if (value === "3")
        command = "ME00001FF010100000800";
    else if (value === "4")
        command = "ME00001FF010100001600";
    else if (value === "5")
        command = "ME00001FF010100004000";
    else if (value === "6")
        command = "ME00001FF010300008000";
    else if (value === "7")
        command = "ME00001FF010300016000";
    else if (value === "8")
        command = "ME00001FF010300040000";

    if (command.length > 0) {
        let dup = false;
        if (status.p_span)
            if (status.p_span === value)
                dup = true;
        if (!dup) {
            status.p_span = value;
            box.serialPort_write(serialportid, command + "\r\n");
        }
    }
}


function dsp(value)
{
    let dup = false;
    if (status.p_dsp)
        if (status.p_dsp === value)
            dup = true;
    if (!dup) {
        status.p_dsp = value;
        box.serialPort_write(serialportid, "J81" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function anf(value)
{
    let dup = false;
    if (status.p_anf)
        if (status.p_anf === value)
            dup = true;
    if (!dup) {
        status.p_anf = value;
        box.serialPort_write(serialportid, "J83" + (value === "true" ? "01" : "00") + "\r\n");
    }
}


function nr(value)
{
    let dup = false;
    if (status.p_nr)
        if (status.p_nr === value)
            dup = true;
    if (!dup) {
        status.p_nr = value;
        box.serialPort_write(serialportid, "J82" + toHex(value) + "\r\n");
    }
}


function tsql(value)
{
    status.tsql = (value === "true");
    updateTSQL();
}


function tsqlfreq(value)
{
    status.tsqlfreq = parseInt(value);
    updateTSQL();
}


function dtcs(value)
{
    status.dtcs = (value === "true");
    updateDTCS();
}


function dtcscode(value)
{
    status.dtcscode = parseInt(value);
    updateDTCS();
}


function reverseaction(value)
{
    status.reverseaction = (value === "true");
    if (status.tsql)
        updateTSQL();
    else
        updateDTCS();
}


function reversepolarity(value)
{
    status.reversepolarity = (value === "true");
    updateDTCS();
}


function scan(value)
{
    let command;

    if (value === "true") {
        if (status.scanlevel)
            command = "A0";
        else
            command = "20";
    } else {
        if (status.scanlevel)
            command = "80";
        else
            command = "00";
    }
    box.serialPort_write(serialportid, "H8" + command + "\r\n");
}


function scanlevel(value)
{
    status.scanlevel = value;
}


function scanedge(value)
{
    status.scanedge = value;
}


function updateFreq()
{
    let command = "K0";

    command += padDigits(status.freq, 10);

    if (status.band === "LSB")
        command += "00";
    else if (status.band === "USB")
        command += "01";
    else if (status.band === "AM")
        command += "02";
    else if (status.band === "CW")
        command += "03";
    else if (status.band === "FM")
        command += "05";
    else if (status.band === "WFM")
        command += "06";
    else
        return;

    if (status.filter === "2.8 kHz")
        command += "00";
    else if (status.filter === "6 kHz")
        command += "01";
    else if (status.filter === "15 kHz")
        command += "02";
    else if (status.filter === "50 kHz")
        command += "03";
    else if (status.filter === "230 kHz")
        command += "04";
    else
        return;

    command += "00\r\n";

    let dup = false;
    if (status.p_freq)
        if (status.p_freq === command)
            dup = true;
    if (!dup) {
        status.p_freq = command;
        box.serialPort_write(serialportid, command);
    }
}


function updateTSQL()
{
    if (!status.tsqlfreq)
        return;

    let value;

    if (status.tsql) {
        if (status.reverseaction)
            value = 128 + status.tsqlfreq;
        else
            value = status.tsqlfreq;
    } else
        value = 0;

    let dup = false;
    if (status.p_tsql)
        if (status.p_tsql === value)
            dup = true;
    if (!dup) {
        status.p_tsql = value;
        box.serialPort_write(serialportid, "J51" + toHex(value) + "\r\n");
    }
}


function updateDTCS()
{
    if (!status.dtcscode)
        return;

    let command = "J520";

    if (status.dtcs) {
        if (status.reverseaction && status.reversepolarity)
            command += "3";
        else if (status.reverseaction)
            command += "2";
        else if (status.reversepolarity)
            command += "1";
        else
            command += "0";
        command += toHex(status.dtcscode);
    } else
        command += "000";

    command += "\r\n";

    let dup = false;
    if (status.p_dtcs)
        if (status.p_dtcs === command)
            dup = true;
    if (!dup) {
        status.p_dtcs = command;
        box.serialPort_write(serialportid, command);
    }
}


function toHex(value)
{
    return ("0" + parseInt(value).toString(16)).slice(-2).toUpperCase();
}


function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}
