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

// PLAYAUDIO - SERVER

let box = b_getbox();
let dsp = box.DSP_create();
let filename = "";
let fileid = -1;
let vsrate = 0;
let vsbits = 0;
let vcbits = 0;
let fsrate = 0;
let fsbits = 0;
let volume = 1.0;


function b_start(params)
{
    box.file_playData.connect(sendAudioData);
}


function b_finish()
{
    stop();
    box.file_playData.disconnect(sendAudioData);
}


function b_receive(key, value)
{
    if (key === "file")
        file(value);
    else if (key === "play")
        play();
    else if (key === "stop")
        stop();
    else if (key === "volume")
        volume = value;
    else if (key === "srate")
        srate(value);
    else if (key === "sbits")
        sbits(value);
    else if (key === "cbits")
        cbits(value);
}


function play()
{
    if (filename.length === 0)
        return;

    fileid = box.file_openRead(filename);

    if (fileid === -1)
        return;

    fsrate = parseInt(box.file_samplerate(fileid));
    fsbits = parseInt(box.file_samplebits(fileid));

    setAudioMode();
    box.file_play(fileid);
}


function stop()
{
    box.file_stop(fileid);
    box.file_close(fileid);
    fileid = -1;
}


function file(name)
{
    if (filename === name)
        return;

    filename = name;

    if (fileid === -1) {
        play();
        stop();
    } else {
        stop();
        play();
    }

    b_send("format", fsrate + "," + fsbits);
}


function sendAudioData(id, data)
{
    if (id !== fileid)
        return;

    box.file_setBusy(id, true);

    if (fsrate !== vsrate && fsrate !== 0)
        data = box.DSP_resample(dsp, data, box.viewSize(data) / fsrate * vsrate / 4);

    data = box.DSP_scale(data, 2 * volume * volume);

    if (vcbits > 0)
        data = box.DSP_compress(data, vcbits);

    b_sendbin("audio", data);

    box.file_setBusy(id, false);
}


function setAudioMode()
{
    if (fileid === -1)
        return;

    if (fsrate === 0 || fsbits === 0) {
        box.file_samplerate(fileid, vsrate);
        box.file_samplebits(fileid, vsbits);
        box.file_channels(fileid, 1);
    }

    b_send("play");
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
