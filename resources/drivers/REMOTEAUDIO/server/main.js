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

// REMOTEAUDIO - SERVER

let box;
let dspid;
let audiodevicename = "";
let audiodeviceid = -1;
let dsrate = 0;
let dsbits = 0;
let vsrate = 0;
let vsbits = 0;
let vcbits = 0;


function b_start(params)
{
    box = b_getbox();
    dspid = box.DSP_create();
    box.audioDevice_Data.connect(sendAudioData);
}


function b_finish()
{
    box.audioDevice_Data.disconnect(sendAudioData);
    box.audioDevice_close(audiodeviceid);
}


function b_receive(key, value)
{
    if (key === "play")
        play();
    else if (key === "stop")
        stop();
    else if (key === "device")
        device(value);
    else if (key === "volume")
        volume(value);
    else if (key === "srate")
        srate(value);
    else if (key === "sbits")
        sbits(value);
    else if (key === "cbits")
        cbits(value);
}


function b_receivebin(key, value)
{
    if (key === "audio")
        receiveAudioData(value);
}


function play()
{
    let audiomode = vsrate + "," + vsbits + "," + vcbits;
    audiodeviceid = box.audioDevice_open(audiodevicename, audiomode);
}


function stop()
{
    box.audioDevice_close(audiodeviceid);
    audiodeviceid = -1;
}


function device(value)
{
    audiodevicename = value;
    setAudioMode();
}


function volume(value)
{
    box.audioDevice_setVolume(audiodeviceid, value);
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
}


function setAudioMode()
{
    if (audiodeviceid === -1)
        return;

    let audiomode = vsrate + "," + vsbits + "," + vcbits;
    box.audioDevice_close(audiodeviceid);
    audiodeviceid = box.audioDevice_open(audiodevicename, audiomode);
}


function sendAudioData(id, data)
{
    if (id !== audiodeviceid)
        return;

    if (vcbits > 0)
        data = box.DSP_compress(data, vcbits);

    b_sendbin("audio", data);
}


function receiveAudioData(data)
{
    if (vcbits > 0)
        data = box.DSP_uncompress(data, vcbits);

    box.audioDevice_write(audiodeviceid, data);
}
