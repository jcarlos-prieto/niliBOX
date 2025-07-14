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

// DIGIMODES - SERVER

b_import("DSDcc", "dsdcc.mjs");


let box;
let audiodevicename = "";
let audiodeviceid = -1;
let serialport = "";
let isbusy = false;
let inlvl = 0;
let srate = 0;
let sbits = 0;
let cbits = 0;


function b_start(params)
{
    box = b_getbox();
    serialport = params.serialport;
    DSDcc.create(serialport, box);
    box.audioDevice_Data.connect(process);
}


function b_finish()
{
    box.audioDevice_Data.disconnect(process);
    box.audioDevice_close(audiodeviceid);
    DSDcc.release();
}


function b_receive(key, value)
{
    if (key === "device")
        device(value);
    else if (key === "play")
        play();
    else if (key === "stop")
        stop();
    else if (key === "volume")
        volume(value);
    else if (key === "mode")
        mode(value);
    else if (key === "bauds")
        bauds(value);
    else if (key === "slot")
        slot(value);
    else if (key === "dmrkey")
        dmrkey(value);
    else if (key === "mfilter")
        mfilter(value);
    else if (key === "hpfilter")
        hpfilter(value);
    else if (key === "pll")
        pll(value);
    else if (key === "speechq")
        speechq(value);
    else if (key === "modes")
        modes();
    else if (key === "rates")
        rates();
    else if (key === "gain")
        gain(value);
}


function b_hotplug()
{
    DSDcc.release();
    DSDcc.create(serialport, box);
    b_send("device", DSDcc.device());
}


function device(value)
{
    audiodevicename = value;
    b_send("device", DSDcc.device());
}


function play()
{
    if (audiodevicename.length === 0)
        return;

    let audiomode = box.audioDevice_mode(audiodevicename);

    if (audiomode.length === 0)
        audiomode = "48000,16,0"; // This is what DSDcc.feed needs

    let amode = audiomode.split(",");
    srate = parseInt(amode[0]);
    sbits = parseInt(amode[1]);
    cbits = parseInt(amode[2]);
    
    audiodeviceid = box.audioDevice_open(audiodevicename, audiomode);
}


function stop()
{
    box.audioDevice_close(audiodeviceid);
    audiodeviceid = -1;
}


function process(id, data)
{
    if (id !== audiodeviceid)
        return;

    DSDcc.feed(data, srate);

    let b = DSDcc.busy();
    if ((isbusy && !b) || (!isbusy && b)) {
        isbusy = b;
        b_send("busy", isbusy ? "true" : "false");
    }

    let l = DSDcc.inputLevel();
    if (l !== inlvl) {
        inlvl = l;
        b_send("inlvl", inlvl);
    }
}


function processText(data)
{
    b_send("text", data);
    b_send("synctype", DSDcc.syncType());
}


function processAudio(data)
{
    b_sendbin("audio", data);
}


function volume(value)
{
    box.audioDevice_setVolume(audiodeviceid, value);
}


function mode(value)
{
    DSDcc.setMode(value);
}

function bauds(value)
{
    DSDcc.setDataRate(value);
}


function slot(value)
{
    DSDcc.setSlot(value);
}


function dmrkey(value)
{
    DSDcc.setDMRKey(value);
}


function mfilter(value)
{
    DSDcc.useMatchedFilter(value);
}


function hpfilter(value)
{
    DSDcc.useHighPassFilter(value);
}


function pll(value)
{
    DSDcc.setPLLLock(value);
}


function speechq(value)
{
    DSDcc.setSpeechQuality(value);
}


function modes()
{
    b_send("modes", DSDcc.modes().toString());
}

function rates()
{
    b_send("rates", DSDcc.dataRates().toString());
}

function gain(value)
{
    DSDcc.setGain(value);
}
