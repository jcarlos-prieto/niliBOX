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

// WEBCAM - SERVER

let box;
let videodevicename = "";
let videodeviceid = -1;
let orientation;
let rate = 0;
let div = 1;
let cdiv = 0;


function b_start(params)
{
    box = b_getbox();
    videodevicename = params.videodevice;
    box.videoDevice_Data.connect(videoDeviceData);
}


function b_finish()
{
    stop();
    box.videoDevice_Data.disconnect(videoDeviceData);
}


function b_receive(key, value)
{
    if (key === "init")
        init();
    else if (key === "play")
        play(value);
    else if (key === "stop")
        stop();
    else if (key === "quality")
        setQuality(value);
    else if (key === "rate")
        setRate(value);
    else if (key === "image")
        takeShot();
}


function init()
{
    b_send("configurations", box.videoDevice_resolutions(videodevicename).join(";"));
}


function b_hotplug()
{
    init();
}


function play(value)
{
    if (videodeviceid > -1)
        box.videoDevice_close(videodeviceid);

    orientation = box.videoDevice_orientation(videodevicename);
    b_send("orientation", orientation);

    for (const r of [60, 30, 15, 10]) {
        videodeviceid = box.videoDevice_open(videodevicename, value + "," + r);
        if (videodeviceid > -1) {
            rate = r;
            return;
        }
    }
    
    b_send("clean");
}


function stop()
{
    if (videodeviceid > -1) {
        box.videoDevice_close(videodeviceid);
        videodeviceid = -1;
        b_send("clean");
    }
}


function setQuality(value)
{
    if (videodeviceid > -1)
        box.videoDevice_setQuality(videodeviceid, value);
}


function setRate(value)
{
    div = rate / value;
}


function takeShot()
{
    let data = box.videoDevice_takeShot(videodeviceid);
    b_sendbin("image", data);
}


function videoDeviceData(devid, data)
{
    if (devid !== videodeviceid)
        return;

    cdiv++;
    if (cdiv < div)
        return;

    let t_orientation = box.videoDevice_orientation(videodevicename);

    if (t_orientation !== orientation) {
        orientation = t_orientation;
        b_send("orientation", orientation);
    }

    b_sendbin("video", data);
    cdiv = 0;
}
