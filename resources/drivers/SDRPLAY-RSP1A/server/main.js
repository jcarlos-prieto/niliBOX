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

// SDRPLAY-RSP1A - SERVER

b_import("SDRPLAY", "sdrplay.mjs");

var bandsamp = 1;
var bandsampc = 0;
var box;
var vcbits = 0;
var deviceopen = false;
var devicename = "";
var dspid = -1;
var fileid = -1;
var gains;
var localaudio = false;
var powered = false;
var rawfilechunk = 0;
var rawfilename = "";
var record = false;
var vsbits = 0;
var sdrid = -1;
var vwidth = 512;
var specsamp = 1;
var specsampc = 0;
var vsrate = 0;
var status = {};
var vafgain = -1;
var vagcrsp = -1;
var vbusy = false;
var vfreq = -1;
var vifshift = -1;
var vrfgain = -1;
var vsample = -1;
var vsmeter = -1;
var vsquelch = -1;
var vfft = 4;
var pfft = 16536;
var vzoom = 1;
var transfertype = b_os === "windows" ? "ISOC" : "BULK";


function b_start(params)
{
    devicename = params.device;
    box = b_getbox();
    dspid = box.DSP_create();
    box.audioDevice_Data.connect(audioDeviceData);
    box.file_playData.connect(fileData);
}


function b_finish()
{
    power("1");
}


function b_receive(key, value)
{
    if (key === "init")
        init();
    else if (key === "power")
        power(value);
    else if (key === "width")
        width(value);
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
    else if (key === "agc")
        agc(value);
    else if (key === "band")
        band(value);
    else if (key === "filter")
        filter(value);
    else if (key === "sample")
        sample(value);
    else if (key === "rfgain")
        rfgain(value);
    else if (key === "specsampling")
        specsampling(value);
    else if (key === "bandsampling")
        bandsampling(value);
    else if (key === "record")
        record = (value === "start");
    else if (key === "rawfile")
        rawfile(value);
    else if (key === "tau")
        tau(value);
    else if (key === "unfilter")
        unfilter(value);
    else if (key === "biast")
        biast(value);
    else if (key === "bandwidth")
        bandwidth(value);
    else if (key === "fft")
        fft(value);
    else if (key === "zoom")
        zoom(value);
}


function b_hotplug()
{
    if (!powered)
        init();
}


let initing = false;
function init() 
{
    if (initing)
        return;
    
    initing = true;
    
    if (rawfilename !== "") {
        b_send("power", 0);
        return;
    }

    SDRPLAY.init(box);

    deviceopen = SDRPLAY.open(devicename);
    if (deviceopen) {
        SDRPLAY.close();
        gains = SDRPLAY.gains();
        b_send("tuner", SDRPLAY.description(devicename));
        b_send("rfgains", gains.join());
        b_send("power", 0);
    } else
        b_send("power", -1);
    
    initing = false;
}


function power(action)
{
    if (action === "0") {
        if (rawfilename === "") {
            deviceopen = SDRPLAY.open(devicename);
            if (deviceopen) {
                powered = true;
                sdrid = box.SDR_create();
                SDRPLAY.start(transfertype);
                b_send("power", 1);
                setAudioMode();
                box.SDR_setVolume(sdrid, 1);
                return;
            }
        } else {
            fileid = box.file_openRead(rawfilename);
            if (fileid > -1) {
                let samplerate = box.file_samplerate(fileid);
                if (samplerate > 0) {
                    powered = true;
                    sdrid = box.SDR_create();
                    b_send("power", 1);
                    b_send("samplerate", samplerate);
                    box.SDR_setSampleRate(sdrid, samplerate);
                    setAudioMode();
                    box.SDR_setVolume(sdrid, 1);
                    box.file_play(fileid, Box.PM_MONO);
                    return;
                }
            }
        }
        b_send("power", -1);
    } else if (action === "1") {
        if (rawfilename === "") {
            box.SDR_release(sdrid);
            SDRPLAY.stop();
            SDRPLAY.close();
            deviceopen = false;
            b_send("closeaudio");
            b_send("smeter", 0);
            b_send("power", 0);
        } else {
            box.file_stop(fileid);
            box.SDR_release(sdrid);
            box.file_close(fileid);
            b_send("closeaudio");
            b_send("smeter", 0);
            b_send("power", 0);
        }
        powered = false;
    } else
        init();
}


function error()
{
    power("1");
    init();
}


function fileData(id, data)
{
    if (id !== fileid)
        return;

    box.file_setBusy(id, true);

    deviceData(data);

    box.file_setBusy(id, false);
}


function deviceData(data)
{
    if (record)
        b_sendbin("raw", data);

    let fdata;
    specsampc++;
    bandsampc++;

    if ((specsampc >= specsamp && specsamp !== "-1") || (bandsampc >= bandsamp && bandsamp !== "-1")) {
        if (pfft < vwidth)
            pfft = 1 << (1 + Math.trunc(Math.log2(vwidth)));

        fdata = box.viewSlice(data, 0, 8 * pfft * vzoom);
        fdata = box.DSP_FFT_c(dspid, fdata, vwidth * vzoom);

        if (vzoom > 1)
            fdata = box.viewSlice(fdata, 4 * Math.trunc(box.viewSize(fdata) / 8 * (1 - 1 / vzoom)), 4 * Math.ceil(box.viewSize(fdata) / 8 * (1 + 1 / vzoom)));
    }

    if (specsampc >= specsamp && specsamp !== "-1" && bandsampc >= bandsamp && bandsamp !== "-1") {
        specsampc = 0;
        bandsampc = 0;
        b_sendbin("bscopebspect", fdata);
    } else if (specsampc >= specsamp && specsamp !== "-1") {
        specsampc = 0;
        b_sendbin("bscope", fdata);
    } else if (bandsampc >= bandsamp && bandsamp !== "-1") {
        bandsampc = 0;
        b_sendbin("bspect", fdata);
    }

    box.SDR_feed(sdrid, data);
}


function audioDeviceData(id, data)
{
    if (id !== sdrid)
        return;

    box.SDR_setBusy(id, true);

    if (vcbits > 0)
        data = box.DSP_compress(data, vcbits);

    b_sendbin("audio", data);

    let smeter = box.SDR_signalLevel(sdrid);
    if (smeter !== vsmeter) {
        vsmeter = smeter;
        b_send("smeter", vsmeter);
    }

    updateVolume();

    box.SDR_setBusy(id, false);
}


function width(value)
{
    vwidth = value;

    if (vfft === -1)
        pfft = 1 << (2 + Math.ceil(Math.log2(value)));
}


function setAudioMode()
{
    if (!powered)
        return;

    let audiomode = vsrate + "," + vsbits + "," + vcbits;
    b_send("openaudio", audiomode);
    box.SDR_setAudioMode(sdrid, audiomode);
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
    vafgain = value;
    updateVolume();
}


function squelch(value)
{
    vsquelch = value;
    updateVolume();
}


function ifshift(value)
{
    vifshift = value;
    SDRPLAY.setFrequencyCorrection(value);
}


function specsampling(value)
{
    specsamp = value;
}


function bandsampling(value)
{
    bandsamp = value;
}


function freq(value)
{
    vfreq = value;
    SDRPLAY.setCenterFrequency(value);
}


function band(value)
{
    box.SDR_setBand(sdrid, value);
}


function tau(value)
{
    box.SDR_setFMtau(sdrid, value);
}


function unfilter(value)
{
    box.SDR_setUnfiltered(sdrid, value === "true");
}


function agc(value)
{
    box.SDR_setAFAGC(sdrid, value === "true");
}


function filter(value)
{
    box.SDR_setFilter(sdrid, value);
}


function sample(value)
{   
    vsample = value;

    if (rawfilename === "") {
        box.SDR_setSampleRate(sdrid, value);
        SDRPLAY.setSampleRate(value);
    }
}


function rfgain(value)
{
    vrfgain = value;

    if (value < gains.length)
        SDRPLAY.setGain(gains[value]);
}


function biast(value)
{
    SDRPLAY.setBiasT(value === "true");
}


function bandwidth(value)
{
    SDRPLAY.setBandwidth(value);
}


function fft(value)
{
    vfft = value;

    if (value === -1)
        pfft = 1 << (2 + Math.ceil(Math.log2(vwidth)));
    else
        pfft = 1024 * (1 << value);
}


function zoom(value)
{
    vzoom = 1 << value;
}


function updateVolume()
{
    if (vsmeter < 2 * (vsquelch - 50)) {
        box.SDR_setVolume(sdrid, 0);
        if (vbusy) {
            b_send("busy", false);
            vbusy = false;
        }
    } else {
        box.SDR_setVolume(sdrid, vafgain / 100);
        if (vsmeter > 35) {
            if (!vbusy) {
                b_send("busy", true);
                vbusy = true;
            }
        } else {
            if (vbusy) {
                b_send("busy", false);
                vbusy = false;
            }
        }
    }
}


function rawfile(value)
{
    if (powered) {
        power("1");
        rawfilename = value;
        if (value === "") {
            init();
            if (deviceopen)
                power("0");
        } else {
            power("0");
        }
    } else {
        rawfilename = value;
        if (value === "") {
            init();
        } else {
            b_send("power", 0);
        }
    }
}
