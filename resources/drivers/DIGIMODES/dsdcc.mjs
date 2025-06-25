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

//=================================================== DSDcc
// Based on https://github.com/f4exb/dsdcc

const M_PI = 3.14159265359793;
const M_2PI = 2 * M_PI;
const M_SQRT2 = 1.414213562373095;
const M_E = 2.718281828459045;

let global1, global2, global3;


function TimeUtil()
{
}

TimeUtil.nowms = function()
{
    return Date.now();
}

TimeUtil.nowus = function()
{
    return (1000 * Date.now());
}


function DSDSync()
{
    this.m_syncErrors = new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

DSDSync.SyncDMRDataBS = 0;
DSDSync.SyncDMRVoiceBS = 1;
DSDSync.SyncDMRDataMS = 2;
DSDSync.SyncDMRVoiceMS = 3;
DSDSync.SyncDPMRFS1 = 4;
DSDSync.SyncDPMRFS4 = 5;
DSDSync.SyncDPMRFS2 = 6;
DSDSync.SyncDPMRFS3 = 7;
DSDSync.SyncNXDNRDCHFull = 8;
DSDSync.SyncNXDNRDCHFullInv = 9;
DSDSync.SyncNXDNRDCHFSW = 10;
DSDSync.SyncNXDNRDCHFSWInv = 11;
DSDSync.SyncDStarHeader = 12;
DSDSync.SyncDStarHeaderInv = 13;
DSDSync.SyncDStar = 14;
DSDSync.SyncDStarInv = 15;
DSDSync.SyncYSF = 16;
DSDSync.SyncP25P1 = 17;
DSDSync.SyncP25P1Inv = 18;
DSDSync.SyncX2TDMADataBS = 19;
DSDSync.SyncX2TDMAVoiceBS = 20;
DSDSync.SyncX2TDMADataMS = 21;
DSDSync.SyncX2TDMAVoiceMS = 22;
DSDSync.SyncProVoice = 23;
DSDSync.SyncProVoiceInv = 24;
DSDSync.SyncProVoiceEA = 25;
DSDSync.SyncProVoiceEAInv = 26;
DSDSync.m_history = 32;
DSDSync.m_patterns = 27;
DSDSync.m_syncPatterns = new Uint8Array([
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3, 1, 1, 3, 1, 1, 3, 1, 3, 3, 1, 1, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3, 1, 3, 3, 1, 3, 1, 1, 3, 3, 1, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 3, 1, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 1, 1, 3, 1, 1, 1, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 3, 3, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 3, 3, 1, 3, 3, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 3, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 1, 3, 3, 1, 3, 3, 3, 3, 1, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 3, 1, 3, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 3, 1, 3, 3, 3, 3, 1, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 1, 3, 3, 3, 1, 3, 1, 3, 1, 3, 3, 1, 1, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 3, 3, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1, 3, 3, 1, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 3, 3, 1, 1, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 3, 1, 1, 3, 3, 1, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 1, 1, 3, 1, 3, 1, 1, 1, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1, 3, 1, 1, 3, 3, 1, 3, 1, 3, 3, 3, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 3, 1, 3, 1, 1, 1, 3, 3, 1, 3, 1, 1, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 3, 1, 3, 3, 3, 1, 1, 3, 1, 3, 3, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 3, 3, 3, 1, 1, 3, 3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 1, 1, 3, 3, 1, 1,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3 ,3 ,3 ,1 ,3,
                                            0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3 ,3 ,3 ,1 ,3,
                                            1, 3, 1, 3, 1, 3, 3, 3, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3,
                                            3, 1, 3, 1, 3, 1, 1, 1, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1,
                                            3, 1, 1, 3, 1, 3, 1, 1, 3, 3, 1, 3, 3, 1, 1, 1, 1, 1, 3, 3, 1, 3, 1, 3, 1, 1, 3 ,1 ,1 ,1, 3 ,3,
                                            1, 3, 3, 1, 3, 1, 3, 3, 1, 1, 3, 1, 1 ,3 ,3, 3, 3 ,3, 1, 1 ,3, 1, 3, 1, 3, 3, 1, 3, 3, 3, 1, 1
                                        ]);
DSDSync.m_syncLenTol = new Uint8Array([
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          12, 1,
                                          12, 1,
                                          19, 1,
                                          19, 1,
                                          10, 1,
                                          10, 1,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          20, 1,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          24, 2,
                                          32, 2,
                                          32, 2,
                                          32, 2,
                                          32, 2
                                      ]);

DSDSync.getPattern = function(pattern, length)
{
    global1 = DSDSync.m_syncLenTol[2 * pattern];
    return DSDSync.m_syncPatterns.subarray(32 * pattern + DSDSync.m_history - global1);
}

DSDSync.prototype.matchAll = function(start)
{
    this.m_syncErrors.fill(0);
    let c;
    for (let i = 0; i < DSDSync.m_history; i++) {
        c = start[i];
        for (let p = 0; p < DSDSync.m_patterns; p++) {
            if (this.m_syncErrors[p] > DSDSync.m_syncLenTol[2 * p + 1])
                continue;
            if ((DSDSync.m_syncPatterns[32 * p + i] !== 0) && (c !== DSDSync.m_syncPatterns[32 * p + i]))
                this.m_syncErrors[p]++;
        }
    }
}

DSDSync.prototype.matchSome = function(start, maxHistory, patterns, nbPatterns)
{
    this.m_syncErrors.fill(0);
    let pshift = DSDSync.m_history - maxHistory;
    let c, p;
    for (let i = 0; i < maxHistory; i++) {
        c = start[i];
        for (let ip = 0; ip < nbPatterns; ip++) {
            p = patterns[ip];
            if (this.m_syncErrors[p] > DSDSync.m_syncLenTol[2 * p + 1])
                continue;
            if ((DSDSync.m_syncPatterns[32 * p + i + pshift] !== 0) && (c !== DSDSync.m_syncPatterns[32 * p + i + pshift]))
                this.m_syncErrors[p]++;
        }
    }
}

DSDSync.prototype.isMatching = function(pattern)
{
    return this.m_syncErrors[pattern] <= DSDSync.m_syncLenTol[2 * pattern + 1];
}

DSDSync.prototype.getErrors = function(pattern)
{
    return this.m_syncErrors[pattern];
}


function DSDOpts()
{
    this.onesymbol = 10;
    this.errorbars = 1;
    this.symboltiming = 0;
    this.verbose = 2;
    this.dmr_bp_key = 0;
    this.p25enc = 0;
    this.p25lc = 0;
    this.p25status = 0;
    this.p25tg = 0;
    this.scoperate = 15;
    this.playoffset = 0;
    this.audio_gain = 0;
    this.audio_out = 1;
    this.resume = 0;
    this.frame_dstar = 0;
    this.frame_x2tdma = 1;
    this.frame_p25p1 = 1;
    this.frame_nxdn48 = 0;
    this.frame_nxdn96 = 1;
    this.frame_dmr = 1;
    this.frame_provoice = 0;
    this.frame_dpmr = 0;
    this.frame_ysf = 0;
    this.uvquality = 3;
    this.inverted_x2tdma = 1;
    this.delay = 0;
    this.use_cosine_filter = 1;
    this.unmute_encrypted_p25 = 0;
}


const MIN_ELEMENTS_FOR_HEURISTICS = 10;
const HEURISTICS_SIZE = 200;

function SymbolHeuristics()
{
    this.values = new Int32Array(HEURISTICS_SIZE);
    this.means = new Float32Array(HEURISTICS_SIZE);
    this.index = 0;
    this.count = 0;
    this.sum = 0;
    this.var_sum = 0;
}

function P25Heuristics()
{
    this.bit_count = 0;
    this.bit_error_count = 0;
    this.symbols = [
             [new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics()],
             [new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics()],
             [new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics()],
             [new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics(), new SymbolHeuristics()]
         ];
}

function AnalogSignal()
{
    this.value = 0;
    this.dibit = 0;
    this.corrected_dibit = 0;
    this.sequence_broken = 0;
}

function DSDP25Heuristics()
{
}

DSDP25Heuristics.initialize_p25_heuristics = function(heuristics)
{
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            DSDP25Heuristics.initialize_symbol_heuristics(heuristics.symbols[i][j]);
    heuristics.bit_count = 0;
    heuristics.bit_error_count = 0;
}

DSDP25Heuristics.estimate_symbol = function(rf_mod, heuristics, previous_dibit, analog_value, dibit)
{
    let valid;
    let i;
    let pdfs = new Float32Array(4);
    let use_prev_dibit = DSDP25Heuristics.use_previous_dibit(rf_mod);
    if (use_prev_dibit === 0)
        previous_dibit = 0;
    valid = 1;
    for (i = 0; i < 4; i++) {
        if (heuristics.symbols[previous_dibit][i].count >= MIN_ELEMENTS_FOR_HEURISTICS)
            pdfs[i] = this.evaluate_pdf(heuristics.symbols[previous_dibit][i], analog_value);
        else {
            valid = 0;
            break;
        }
    }
    if (valid) {
        let max_index;
        let max;
        max_index = 0;
        max = pdfs[0];
        for (i = 1; i < 4; i++)
            if (pdfs[i] > max) {
                max_index = i;
                max = pdfs[i];
            }
        global1 = max_index;
    }
    return valid;
}

DSDP25Heuristics.contribute_to_heuristics = function(rf_mod, heuristics, analog_signal_array, count)
{
    let use_prev_dibit;
    let use;
    let prev_dibit;
    use_prev_dibit = DSDP25Heuristics.use_previous_dibit(rf_mod);
    for (let i = 0; i < count; i++) {
        if (use_prev_dibit) {
            if (analog_signal_array[i].sequence_broken)
                use = 0;
            else {
                use = 1;
                prev_dibit = analog_signal_array[i - 1].corrected_dibit;
            }
        } else {
            use = 1;
            prev_dibit = 0;
        }
        if (use)
            DSDP25Heuristics.update_p25_heuristics(heuristics, prev_dibit, analog_signal_array[i].dibit, analog_signal_array[i].corrected_dibit, analog_signal_array[i].value);
    }
}

DSDP25Heuristics.update_error_stats = function(heuristics, bits, errors)
{
    heuristics.bit_count += bits;
    heuristics.bit_error_count += errors;
    if ((heuristics.bit_count & 1) === 0	&& (heuristics.bit_error_count & 1) === 0) {
        heuristics.bit_count >>= 1;
        heuristics.bit_error_count >>= 1;
    }
}

DSDP25Heuristics.use_previous_dibit = function(rf_mod)
{
    return (rf_mod === 0) ? 1 : 0;
}

DSDP25Heuristics.update_p25_heuristics = function(heuristics, previous_dibit, original_dibit, dibit, analog_value)
{
    let mean;
    let old_value;
    let old_mean;
    let sh;
    let number_errors;
    sh = heuristics.symbols[previous_dibit][dibit];
    old_value = sh.values[sh.index];
    old_mean = sh.means[sh.index];
    number_errors = 0;
    if (original_dibit !== dibit) {
        if ((original_dibit === 0 && dibit === 3) || (original_dibit === 3 && dibit === 0) || (original_dibit === 1 && dibit === 2) || (original_dibit === 2 && dibit === 1))
            number_errors = 2;
        else
            number_errors = 1;
    }
    DSDP25Heuristics.update_error_stats(heuristics, 2, number_errors);
    if (sh.count >= HEURISTICS_SIZE) {
        sh.sum -= old_value;
        sh.var_sum -= (old_value - old_mean) * (old_value - old_mean);
    }
    sh.sum += analog_value;
    sh.values[sh.index] = analog_value;
    if (sh.count < HEURISTICS_SIZE)
        sh.count++;
    mean = sh.sum / sh.count;
    sh.means[sh.index] = mean;
    if (sh.index >= HEURISTICS_SIZE - 1)
        sh.index = 0;
    else
        sh.index++;
    sh.var_sum += (analog_value - mean)	* (analog_value - mean);
}

DSDP25Heuristics.initialize_symbol_heuristics = function(sh)
{
    sh.count = 0;
    sh.index = 0;
    sh.sum = 0;
    sh.var_sum = 0;
}

DSDP25Heuristics.evaluate_pdf = function(se, value)
{
    let x = se.count * value - se.sum;
    let y = -0.5 * x * x / (se.count * se.var_sum);
    let pdf = Math.sqrt(se.count / se.var_sum) * Math.exp(y) / Math.sqrt(M_2PI);
    return pdf;
}

DSDP25Heuristics.prototype.get_P25_BER_estimate = function(heuristics)
{
    let ber;
    if (heuristics.bit_count === 0)
        ber = 0;
    else
        ber = (heuristics.bit_error_count) * 100 / heuristics.bit_count;
    return ber;
}


function DSDState()
{
    this.repeat = 0;
    this.maxbuf = new Int32Array(1024);
    this.minbuf = new Int32Array(1024);
    this.midx = 0;
    this.fsubtype = " ".repeat(14);
    this.ftype = " ".repeat(13);
    this.symbolcnt = 0;
    this.lastp25type = 0;
    this.offset = 0;
    this.carrier = 0;
    this.tg = new Int8Array(400);
    this.tgcount = 0;
    this.lasttg = 0;
    this.lastsrc = 0;
    this.nac = 0;
    this.mbe_file_type = -1;
    this.optind = 0;
    this.numtdulc = 0;
    this.firstframe = 0;
    this.slot0light = " ".repeat(26);
    this.slot1light = " ".repeat(26);
    this.algid = "_".repeat(8);
    this.keyid = "_".repeat(16);
    this.currentslot = 0;
    this.p25kid = 0;
    this.output_finished = 0;
    this.output_offset = 0;
    this.output_num_samples = 0;
    this.output_samples = null;
    this.output_length = 0;
    this.output_buffer = null;
    this.ccnum = 0;
    this.p25_heuristics = new P25Heuristics();
    this.inv_p25_heuristics = new P25Heuristics();
    this.maxbuf.fill(15000);
    this.minbuf.fill(-15000);
    this.tg.fill(48);
}


const NZEROS = 60;
const NXZEROS = 134;

function IIRFilter(order, a, b)
{
    this.m_order = order;
    this.m_a = new Float32Array(this.m_order + 1);
    this.m_b = new Float32Array(this.m_order + 1);
    this.m_x = new Float32Array(this.m_order);
    this.m_y = new Float32Array(this.m_order);
    this.setCoeffs(a, b);
}

IIRFilter.prototype.setCoeffs = function(a, b)
{
    this.m_a.set(b);  // WHY??
    this.m_b.set(a);  // WHY??
    this.m_x.fill(0);
    this.m_y.fill(0);
}

IIRFilter.prototype.run = function(sample)
{
    let y = this.m_b[0] * sample;
    for (let i = this.m_order; i > 0; i--)	{
        y += this.m_b[i] * this.m_x[i - 1] + this.m_a[i] * this.m_y[i - 1];
        if (i > 1) {
            this.m_x[i - 1] = this.m_x[i - 2];
            this.m_y[i - 1] = this.m_y[i - 2];
        }
    }
    this.m_x[0] = sample;
    this.m_y[0] = y;
    return y;
}


function IIRFilter2(a, b)
{
    this.m_a = new Float32Array(3);
    this.m_b = new Float32Array(3);
    this.m_x = new Float32Array(2);
    this.m_y = new Float32Array(2);
    this.setCoeffs(a, b);
}

IIRFilter2.prototype.setCoeffs = function(a, b)
{
    this.m_a[0] = a[0];
    this.m_a[1] = a[1];
    this.m_a[2] = a[2];
    this.m_b[0] = b[0];
    this.m_b[1] = b[1];
    this.m_b[2] = b[2];
    this.m_x[0] = 0;
    this.m_x[1] = 0;
    this.m_y[0] = 0;
    this.m_y[1] = 0;
}

IIRFilter2.prototype.run = function(sample)
{
    let y = this.m_b[0] * sample + this.m_b[1] * this.m_x[0] + this.m_b[2] * this.m_x[1] + this.m_a[1] * this.m_y[0] + this.m_a[2] * this.m_y[1];
    this.m_x[1] = this.m_x[0];
    this.m_x[0] = sample;
    this.m_y[1] = this.m_y[0];
    this.m_y[0] = y;
    return y;
}


function DSDFilters()
{
    this.xv = new Float32Array(NZEROS + 1);
    this.nxv = new Float32Array(NXZEROS + 1);
}

DSDFilters.ngain = 7.423339364;
DSDFilters.nxgain = 15.95930463;
DSDFilters.dmrgain = 6.82973073748;
DSDFilters.dpmrgain = 14.6083498224;
DSDFilters.xcoeffs = new Float32Array([
                                          -0.0083649323, -0.0265444850, -0.0428141462, -0.0537571943,
                                          -0.0564141052, -0.0489161045, -0.0310068662, -0.0043393881,
                                          0.0275375106, 0.0595423283, 0.0857543325, 0.1003565948,
                                          0.0986944931, 0.0782804830, 0.0395670487, -0.0136691535,
                                          -0.0744390415, -0.1331834575, -0.1788967208, -0.2005995448,
                                          -0.1889627181, -0.1378439993, -0.0454976231, 0.0847488694,
                                          0.2444859269, 0.4209222342, 0.5982295474, 0.7593684540,
                                          0.8881539892, 0.9712773915, 0.9999999166, 0.9712773915,
                                          0.8881539892, 0.7593684540, 0.5982295474, 0.4209222342,
                                          0.2444859269, 0.0847488694, -0.0454976231, -0.1378439993,
                                          -0.1889627181, -0.2005995448, -0.1788967208, -0.1331834575,
                                          -0.0744390415, -0.0136691535, 0.0395670487, 0.0782804830,
                                          0.0986944931, 0.1003565948, 0.0857543325, 0.0595423283,
                                          0.0275375106, -0.0043393881, -0.0310068662, -0.0489161045,
                                          -0.0564141052, -0.0537571943, -0.0428141462, -0.0265444850,
                                          -0.0083649323
                                      ]);
DSDFilters.nxcoeffs = new Float32Array([
                                           0.031462429, 0.031747267, 0.030401148, 0.027362877,
                                           0.022653298, 0.016379869, 0.008737200, 0.000003302,
                                           -0.009468531, -0.019262057, -0.028914291, -0.037935027,
                                           -0.045828927, -0.052119261, -0.056372283, -0.058221106,
                                           -0.057387924, -0.053703443, -0.047122444, -0.037734535,
                                           -0.025769308, -0.011595336, 0.004287292, 0.021260954,
                                           0.038610717, 0.055550276, 0.071252765, 0.084885375,
                                           0.095646450, 0.102803611, 0.105731303, 0.103946126,
                                           0.097138329, 0.085197939, 0.068234131, 0.046586711,
                                           0.020828821, -0.008239664, -0.039608255, -0.072081234,
                                           -0.104311776, -0.134843790, -0.162160200, -0.184736015,
                                           -0.201094346, -0.209863285, -0.209831516, -0.200000470,
                                           -0.179630919, -0.148282051, -0.105841323, -0.052543664,
                                           0.011020985, 0.083912428, 0.164857408, 0.252278939,
                                           0.344336996, 0.438979335, 0.534000832, 0.627109358,
                                           0.715995947, 0.798406824, 0.872214756, 0.935487176,
                                           0.986548646, 1.024035395, 1.046939951, 1.054644241,
                                           1.046939951, 1.024035395, 0.986548646, 0.935487176,
                                           0.872214756, 0.798406824, 0.715995947, 0.627109358,
                                           0.534000832, 0.438979335, 0.344336996, 0.252278939,
                                           0.164857408, 0.083912428, 0.011020985, -0.052543664,
                                           -0.105841323, -0.148282051, -0.179630919, -0.200000470,
                                           -0.209831516, -0.209863285, -0.201094346, -0.184736015,
                                           -0.162160200, -0.134843790, -0.104311776, -0.072081234,
                                           -0.039608255,  -0.008239664, 0.020828821, 0.046586711,
                                           0.068234131, 0.085197939, 0.097138329, 0.103946126,
                                           0.105731303, 0.102803611, 0.095646450, 0.084885375,
                                           0.071252765, 0.055550276, 0.038610717, 0.021260954,
                                           0.004287292, -0.011595336, -0.025769308, -0.037734535,
                                           -0.047122444, -0.053703443, -0.057387924, -0.058221106,
                                           -0.056372283, -0.052119261, -0.045828927, -0.037935027,
                                           -0.028914291, -0.019262057, -0.009468531, 0.000003302,
                                           0.008737200, 0.016379869, 0.022653298, 0.027362877,
                                           0.030401148, 0.031747267, 0.031462429
                                       ]);
DSDFilters.dmrcoeffs = new Float32Array([
                                            0.0301506278, 0.0269200615, 0.0159662432, -0.0013114705,
                                            -0.0216605133, -0.0404938748, -0.0528141756, -0.0543747957,
                                            -0.0428325003, -0.0186176083, 0.0147202645, 0.0508418571,
                                            0.0816392577, 0.0988113688, 0.0957187780, 0.0691512084,
                                            0.0206194642, -0.0431564563, -0.1107569268, -0.1675773224,
                                            -0.1981519842, -0.1889130786, -0.1308939560, -0.0218608492,
                                            0.1325685970, 0.3190962499, 0.5182530574, 0.7070497652,
                                            0.8623526878, 0.9644213921, 1.0000000000, 0.9644213921,
                                            0.8623526878, 0.7070497652, 0.5182530574, 0.3190962499,
                                            0.1325685970, -0.0218608492, -0.1308939560, -0.1889130786,
                                            -0.1981519842, -0.1675773224, -0.1107569268, -0.0431564563,
                                            0.0206194642, 0.0691512084, 0.0957187780, 0.0988113688,
                                            0.0816392577, 0.0508418571, 0.0147202645, -0.0186176083,
                                            -0.0428325003, -0.0543747957, -0.0528141756, -0.0404938748,
                                            -0.0216605133, -0.0013114705, 0.0159662432, 0.0269200615,
                                            0.0301506278
                                        ]);
DSDFilters.dpmrcoeffs = new Float32Array([
                                             -0.0000983004, 0.0058388841, 0.0119748846, 0.0179185547,
                                             0.0232592816, 0.0275919612, 0.0305433586, 0.0317982965,
                                             0.0311240307, 0.0283911865, 0.0235897433, 0.0168387650,
                                             0.0083888763, -0.0013831396, -0.0119878087, -0.0228442151,
                                             -0.0333082708,  -0.0427067804, -0.0503756642, -0.0557003599,
                                             -0.0581561791, -0.0573462646, -0.0530347941, -0.0451732069,
                                             -0.0339174991, -0.0196350217, -0.0028997157, 0.0155246961,
                                             0.0347134030, 0.0536202583, 0.0711271166, 0.0861006725,
                                             0.0974542022, 0.1042112035, 0.1055676660, 0.1009496091,
                                             0.0900625944, 0.0729301774, 0.0499186839, 0.0217462748,
                                             -0.0105250265, -0.0455148664, -0.0815673067, -0.1168095612,
                                             -0.1492246435, -0.1767350726, -0.1972941202, -0.2089805758,
                                             -0.2100926829, -0.1992367833, -0.1754063031, -0.1380470370,
                                             -0.0871052089, -0.0230554989, 0.0530929052, 0.1398131936,
                                             0.2351006721, 0.3365341927, 0.4413570929, 0.5465745033,
                                             0.6490630781, 0.7456885564, 0.8334261381, 0.9094784589,
                                             0.9713859928, 1.0171250045, 1.0451886943, 1.0546479089,
                                             1.0451886943, 1.0171250045, 0.9713859928, 0.9094784589,
                                             0.8334261381, 0.7456885564, 0.6490630781, 0.5465745033,
                                             0.4413570929, 0.3365341927, 0.2351006721, 0.1398131936,
                                             0.0530929052, -0.0230554989, -0.0871052089, -0.1380470370,
                                             -0.1754063031, -0.1992367833, -0.2100926829, -0.2089805758,
                                             -0.1972941202, -0.1767350726, -0.1492246435, -0.1168095612,
                                             -0.0815673067, -0.0455148664, -0.0105250265, 0.0217462748,
                                             0.0499186839, 0.0729301774, 0.0900625944, 0.1009496091,
                                             0.1055676660, 0.1042112035, 0.0974542022, 0.0861006725,
                                             0.0711271166, 0.0536202583, 0.0347134030, 0.0155246961,
                                             -0.0028997157, -0.0196350217, -0.0339174991, -0.0451732069,
                                             -0.0530347941, -0.0573462646, -0.0581561791, -0.0557003599,
                                             -0.0503756642, -0.0427067804, -0.0333082708, -0.0228442151,
                                             -0.0119878087, -0.0013831396, 0.0083888763, 0.0168387650,
                                             0.0235897433, 0.0283911865, 0.0311240307, 0.0317982965,
                                             0.0305433586, 0.0275919612, 0.0232592816, 0.0179185547,
                                             0.0119748846, 0.0058388841, -0.0000983004
                                         ]);

DSDFilters.prototype.dsd_input_filter = function(sample, mode)
{
    let sum;
    let i;
    let gain;
    let zeros;
    let v;
    let coeffs;
    switch (mode) {
    case 1:
        gain = DSDFilters.ngain;
        v = this.xv;
        coeffs = DSDFilters.xcoeffs;
        zeros = NZEROS;
        break;
    case 2:
        gain = DSDFilters.nxgain;
        v = this.nxv;
        coeffs = DSDFilters.nxcoeffs;
        zeros = NXZEROS;
        break;
    case 3:
        gain = DSDFilters.dmrgain;
        v = this.xv;
        coeffs = DSDFilters.dmrcoeffs;
        zeros = NZEROS;
        break;
    case 4:
        gain = DSDFilters.dpmrgain;
        v = this.nxv;
        coeffs = DSDFilters.dpmrcoeffs;
        zeros = NXZEROS;
        break;
    default:
        return sample;
    }
    for (i = 0; i < zeros; i++)
        v[i] = v[i + 1];
    v[zeros] = sample;
    sum = 0;
    for (i = 0; i <= zeros; i++)
        sum += coeffs[i] * v[i];
    return (sum / gain) | 0;
}

DSDFilters.prototype.dmr_filter = function(sample)
{
    return this.dsd_input_filter(sample, 3);
}

DSDFilters.prototype.nxdn_filter = function(sample)
{
    return this.dsd_input_filter(sample, 4);
}


function DSDSecondOrderRecursiveFilter(samplingFrequency, centerFrequency, r)
{
    this.m_r = r;
    this.m_frequencyRatio = centerFrequency / samplingFrequency;
    this.m_v = new Float32Array(3);
    this.init();
}

DSDSecondOrderRecursiveFilter.prototype.setFrequencies = function(samplingFrequency, centerFrequency)
{
    this.m_frequencyRatio = centerFrequency / samplingFrequency;
    this.init();
}

DSDSecondOrderRecursiveFilter.prototype.setR = function(r)
{
    this.m_r = r;
    this.init();
}

DSDSecondOrderRecursiveFilter.prototype.run = function(sample)
{
    this.m_v[0] = (1 - this.m_r) * sample + 2 * this.m_r * Math.cos(M_2PI * this.m_frequencyRatio) * this.m_v[1] - this.m_r * this.m_r * this.m_v[2];
    let y = this.m_v[0] - this.m_v[2];
    this.m_v[2] = this.m_v[1];
    this.m_v[1] = this.m_v[0];
    return y | 0;
}

DSDSecondOrderRecursiveFilter.prototype.init = function()
{
    this.m_v.fill(0);
}


function DSDMBEAudioInterpolatorFilter()
{
    this.m_filterLP = new IIRFilter2(DSDMBEAudioInterpolatorFilter.m_lpa, DSDMBEAudioInterpolatorFilter.m_lpb);
    this.m_filterHP = new IIRFilter2(DSDMBEAudioInterpolatorFilter.m_hpa, DSDMBEAudioInterpolatorFilter.m_hpb);
    this.m_useHP = false;
}

DSDMBEAudioInterpolatorFilter.m_lpa = new Float32Array([1.0, 1.392667e+00, -5.474446e-01]);
DSDMBEAudioInterpolatorFilter.m_lpb = new Float32Array([3.869430e-02, 7.738860e-02, 3.869430e-02]);
DSDMBEAudioInterpolatorFilter.m_hpa = new Float32Array([1.000000e+00, 1.667871e+00, -7.156964e-01]);
DSDMBEAudioInterpolatorFilter.m_hpb = new Float32Array([8.459039e-01, -1.691760e+00, 8.459039e-01]);

DSDMBEAudioInterpolatorFilter.prototype.useHP = function(use)
{
    this.m_useHP = use;
}

DSDMBEAudioInterpolatorFilter.prototype.usesHP = function()
{
    return this.m_useHP;
}

DSDMBEAudioInterpolatorFilter.prototype.run = function(sample)
{
    return this.m_useHP ? this.m_filterLP.run(this.m_filterHP.run(sample)) : this.m_filterLP.run(sample);
}

DSDMBEAudioInterpolatorFilter.prototype.runHP = function(sample)
{
    return this.m_filterHP.run(sample);
}

DSDMBEAudioInterpolatorFilter.prototype.runLP = function(sample)
{
    return this.m_filterLP.run(sample);
}


function DoubleBuffer(size)
{
    this.m_size = size;
    this.m_index = 0;
    this.m_buffer = new Uint8Array(2 * this.m_size);
    this.reset();
}

DoubleBuffer.prototype.resize = function(size)
{
    this.m_size = size;
    this.m_buffer = new Uint8Array(2 * this.m_size);
    this.reset();
}

DoubleBuffer.prototype.push = function(item)
{
    this.m_buffer[this.m_index] = item;
    this.m_buffer[this.m_index + this.m_size] = item;
    this.m_index = (this.m_index + 1) % this.m_size;
}

DoubleBuffer.prototype.reset = function()
{
    this.m_index = 0;
    this.m_buffer.fill(0);
}

DoubleBuffer.prototype.move = function(distance)
{
    this.m_index = (this.m_index + this.m_size + distance) % this.m_size;
}

DoubleBuffer.prototype.getData = function(shift = 0)
{
    if (shift < this.m_size)
        return this.m_buffer.subarray(this.m_index + shift);
    else
        return this.m_buffer.subarray(this.m_index);
}

DoubleBuffer.prototype.getLatest = function()
{
    return this.m_buffer[this.m_index + this.m_size - 1];
}

DoubleBuffer.prototype.getBack = function(shift = 0)
{
    if (shift < this.m_size)
        return this.m_buffer.subarray((this.m_index + this.m_size - shift) % this.m_size);
    else
        return this.m_buffer.subarray(this.m_index);
}


function valuenode()
{
    this.index = 0;
    this.value = 0;
}

function valuesqueue()
{
    this.nodes = null;
    this.head = 0;
    this.tail = 0;
    this.mask = 0;
};

function lemiremaxmintruestreaming(width)
{
    this.up = new valuesqueue();
    this.lo = new valuesqueue();
    this.n = 0;
    this.ww = width;
    this.init(this.up, this.ww);
    this.init(this.lo, this.ww);
}

lemiremaxmintruestreaming.prototype.nextPowerOfTwo = function(x)
{
    let result = 1;
    while (result < x)
        result <<= 1;
    return result;
}

lemiremaxmintruestreaming.prototype.resize = function(width)
{
    this.ww = width;
    this.freenodes(this.up);
    this.freenodes(this.lo);
    this.init(this.up, this.ww);
    this.init(this.lo, this.ww);
}

lemiremaxmintruestreaming.prototype.update = function(value)
{
    if (this.nonempty(this.up)) {
        if (value > this.tailvalue(this.up)) {
            this.prunetail(this.up);
            while (this.nonempty(this.up) && value >= this.tailvalue(this.up))
                this.prunetail(this.up);
        } else {
            this.prunetail(this.lo);
            while (this.nonempty(this.lo) && value <= this.tailvalue(this.lo))
                this.prunetail(this.lo);
        }
    }
    this.push(this.up, this.n, value);
    if (this.n === this.ww + this.headindex(this.up))
        this.prunehead(this.up);
    this.push(this.lo, this.n, value);
    if (this.n === this.ww + this.headindex(this.lo))
        this.prunehead(this.lo);
    this.n++;
}

lemiremaxmintruestreaming.prototype.max = function()
{
    return this.headvalue(this.up);
}

lemiremaxmintruestreaming.prototype.min = function()
{
    return this.headvalue(this.lo);
}

lemiremaxmintruestreaming.prototype.count = function(q)
{
    return (q.tail - q.head) & q.mask;
}

lemiremaxmintruestreaming.prototype.init = function(q, size)
{
    size = this.nextPowerOfTwo(size + 1);
    q.nodes = Array.from(Array(size), () => new valuenode());
    q.head = 0;
    q.tail = 0;
    q.mask = size - 1;
}

lemiremaxmintruestreaming.prototype.freenodes = function(q)
{
    q.nodes.length = 0;
}

lemiremaxmintruestreaming.prototype.headindex = function(q)
{
    return q.nodes[q.head].index;
}

lemiremaxmintruestreaming.prototype.push = function(q, index, value)
{
    q.nodes[q.tail].index = index;
    q.nodes[q.tail].value = value;
    q.tail = (q.tail + 1) & q.mask;
}

lemiremaxmintruestreaming.prototype.tailvalue = function(q)
{
    return q.nodes[(q.tail - 1) & q.mask].value;
}

lemiremaxmintruestreaming.prototype.headvalue = function(q)
{
    return q.nodes[q.head].value;
}

lemiremaxmintruestreaming.prototype.prunehead = function(q)
{
    q.head = (q.head + 1) & q.mask;
}

lemiremaxmintruestreaming.prototype.prunetail = function(q)
{
    q.tail = (q.tail - 1) & q.mask;
}

lemiremaxmintruestreaming.prototype.nonempty = function(q)
{
    return q.tail !== q.head;
}


function PhaseLock(freq, bandwith, minsignal)
{
    this.m_phase = 0;
    this.m_psin = 0;
    this.m_pcos = 1;
    this.m_minfreq = (freq - bandwith) * M_2PI;
    this.m_maxfreq = (freq + bandwith) * M_2PI;
    this.m_phasor_i1 = 0;
    this.m_phasor_i2 = 0;
    this.m_phasor_q1 = 0;
    this.m_phasor_q2 = 0;
    this.m_loopfilter_x1 = 0;
    this.m_minsignal = minsignal;
    this.m_lock_delay = (1 / bandwith) | 0;
    this.m_lock_cnt = 0;
    this.m_sample_cnt = 0;
    this.m_freq = freq * M_2PI;
    let p1 = Math.exp(-1.146 * bandwith * M_2PI);
    let p2 = Math.exp(-5.331 * bandwith * M_2PI);
    this.m_phasor_a1 = -p1 - p2;
    this.m_phasor_a2 = p1 * p2;
    this.m_phasor_b0 = 1 + this.m_phasor_a1 + this.m_phasor_a2;
    let q1 = Math.exp(-0.1153 * bandwith * M_2PI);
    this.m_loopfilter_b0 = 0.62 * bandwith * M_2PI;
    this.m_loopfilter_b1 = - this.m_loopfilter_b0 * q1;
}

PhaseLock.prototype.configure = function(freq, bandwith, minsignal)
{
    this.m_minfreq = (freq - bandwith) * M_2PI;
    this.m_maxfreq = (freq + bandwith) * M_2PI;
    this.m_minsignal  = minsignal;
    this.m_lock_delay = (1 / bandwith) | 0;
    this.m_lock_cnt = 0;
    let p1 = Math.exp(-1.146 * bandwith * M_2PI);
    let p2 = Math.exp(-5.331 * bandwith * M_2PI);
    this.m_phasor_a1 = -p1 - p2;
    this.m_phasor_a2 = p1 * p2;
    this.m_phasor_b0 = 1 + this.m_phasor_a1 + this.m_phasor_a2;
    let q1 = Math.exp(-0.1153 * bandwith * M_2PI);
    this.m_loopfilter_b0 = 0.62 * bandwith * M_2PI;
    this.m_loopfilter_b1 = - this.m_loopfilter_b0 * q1;
    this.m_freq  = freq * M_2PI;
    this.m_phase = 0;
    this.m_phasor_i1 = 0;
    this.m_phasor_i2 = 0;
    this.m_phasor_q1 = 0;
    this.m_phasor_q2 = 0;
    this.m_loopfilter_x1 = 0;
    this.m_sample_cnt = 0;
}

PhaseLock.prototype.process = function(samples_in, samples_out)
{
    if (Array.isArray(samples_in)) {
        let n = samples_in.length;
        samples_out.length = n;
        let pilot_level = MAX_VALUE;
        let psin, pcos;
        let x, phasor_i, phasor_q, phase_err;
        for (let i = 0; i < n; i++) {
            psin = Math.sin(this.m_phase);
            pcos = Math.cos(this.m_phase);
            samples_out[i] = 2 * psin * pcos;
            x = samples_in[i];
            phasor_i = psin * x;
            phasor_q = pcos * x;
            phasor_i = this.m_phasor_b0 * phasor_i - this.m_phasor_a1 * this.m_phasor_i1 - this.m_phasor_a2 * this.m_phasor_i2;
            phasor_q = this.m_phasor_b0 * phasor_q - this.m_phasor_a1 * this.m_phasor_q1 - this.m_phasor_a2 * this.m_phasor_q2;
            this.m_phasor_i2 = this.m_phasor_i1;
            this.m_phasor_i1 = phasor_i;
            this.m_phasor_q2 = this.m_phasor_q1;
            this.m_phasor_q1 = phasor_q;
            if (phasor_i > Math.abs(phasor_q))
                phase_err = phasor_q / phasor_i;
            else if (phasor_q > 0)
                phase_err = 1;
            else
                phase_err = -1;
            pilot_level = Math.min(pilot_level, phasor_i);
            this.m_freq += this.m_loopfilter_b0 * phase_err + this.m_loopfilter_b1 * this.m_loopfilter_x1;
            this.m_loopfilter_x1 = phase_err;
            this.m_freq = Math.max(this.m_minfreq, Math.min(this.m_maxfreq, this.m_freq));
            this.m_phase += this.m_freq;
            if (this.m_phase > M_2PI)
                this.m_phase -= M_2PI;
            if ((phase_err > -this.m_minsignal) && (phase_err < this.m_minsignal)) {
                if (this.m_lock_cnt < 2 * this.m_lock_delay)
                    this.m_lock_cnt += 1;
            } else {
                if (this.m_lock_cnt > 0)
                    this.m_lock_cnt -= 1;
            }
        }
        this.m_sample_cnt += n;
    } else {
        this.m_psin = Math.sin(this.m_phase);
        this.m_pcos = Math.cos(this.m_phase);
        this.processPhase(samples_out);
        let x = samples_in;
        let phasor_i = this.m_psin * x;
        let phasor_q = this.m_pcos * x;
        phasor_i = this.m_phasor_b0 * phasor_i - this.m_phasor_a1 * this.m_phasor_i1 - this.m_phasor_a2 * this.m_phasor_i2;
        phasor_q = this.m_phasor_b0 * phasor_q - this.m_phasor_a1 * this.m_phasor_q1 - this.m_phasor_a2 * this.m_phasor_q2;
        this.m_phasor_i2 = this.m_phasor_i1;
        this.m_phasor_i1 = phasor_i;
        this.m_phasor_q2 = this.m_phasor_q1;
        this.m_phasor_q1 = phasor_q;
        let phase_err;
        if (phasor_i > Math.abs(phasor_q))
            phase_err = phasor_q / phasor_i;
        else if (phasor_q > 0)
            phase_err = 1;
        else
            phase_err = -1;
        if ((phase_err > -this.m_minsignal) && (phase_err < this.m_minsignal)) {
            if (this.m_lock_cnt < 2 * this.m_lock_delay)
                this.m_lock_cnt += 1;
        } else {
            if (this.m_lock_cnt > 0)
                this.m_lock_cnt -= 1;
        }
        this.m_freq += this.m_loopfilter_b0 * phase_err + this.m_loopfilter_b1 * this.m_loopfilter_x1;
        this.m_loopfilter_x1 = phase_err;
        this.m_freq = Math.max(this.m_minfreq, Math.min(this.m_maxfreq, this.m_freq));
        this.m_phase += this.m_freq;
        if (this.m_phase > M_2PI)
            this.m_phase -= M_2PI;
        this.m_sample_cnt += 1;
    }
}

PhaseLock.prototype.locked = function()
{
    return this.m_lock_cnt >= this.m_lock_delay;
}

PhaseLock.prototype.processPhase = function(samples_out)
{
}


function SimplePhaseLock(freq, bandwidth, minsignal)
{
    PhaseLock.call(this, freq, bandwidth, minsignal);
}

SimplePhaseLock.prototype = Object.create(PhaseLock.prototype);
SimplePhaseLock.prototype.constructor = SimplePhaseLock;

SimplePhaseLock.prototype.processPhase = function(samples_out)
{
    samples_out[0] = this.m_psin;
    samples_out[1] = this.m_pcos;
}


function DSDSymbol(dsdDecoder)
{
    this.m_dsdFilters = new DSDFilters();
    this.m_sum = 0;
    this.m_count = 0;
    this.m_zeroCrossing = 0;
    this.m_zeroCrossingInCycle = 0;
    this.m_zeroCrossingPos = 0;
    this.m_zeroCrossingCorrectionProfile = new Int32Array(11);
    this.m_lbuf = new Int32Array(64)
    this.m_lbuf2 = new Int32Array(32);
    this.m_min = 0;
    this.m_max = 0;
    this.m_center = 0;
    this.m_filteredSample = 0;
    this.m_symbolSyncSample = 0;
    this.m_dsdDecoder = dsdDecoder;
    this.m_symbol = 0;
    this.m_sampleIndex = 0;
    this.m_noSignal = false;
    this.m_zeroCrossingSlopeDivisor = 232;
    this.m_lmmidx = 0;
    this.m_pllLock = true;
    this.m_lmmSamples = new lemiremaxmintruestreaming(240);
    this.m_ringingFilter = new DSDSecondOrderRecursiveFilter(48000, 4800, 0.99);
    this.m_pll = new SimplePhaseLock(0.1, 0.003, 0.25);
    this.m_binSymbolBuffer = new DoubleBuffer(1024);
    this.m_syncSymbolBuffer = new DoubleBuffer(64);
    this.m_nonInvertedSyncSymbolBuffer = new DoubleBuffer(64);
    this.noCarrier();
    this.m_umid = 0;
    this.m_lmid = 0;
    this.m_nbFSKSymbols = 2;
    this.m_invertedFSK = false;
    this.m_samplesPerSymbol = 10;
    this.m_lastsample = 0;
    this.m_numflips = 0;
    this.m_symbolSyncQuality = 0;
    this.m_symbolSyncQualityCounter = 0;
    this.m_zeroCrossingCorrectionProfile.set(DSDSymbol.m_zeroCrossingCorrectionProfile4800.subarray(0, 4));
}

DSDSymbol.m_zeroCrossingCorrectionProfile2400 = new Int32Array([0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4]);
DSDSymbol.m_zeroCrossingCorrectionProfile4800 = new Int32Array([0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2]);
DSDSymbol.m_zeroCrossingCorrectionProfile9600 = new Int32Array([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

DSDSymbol.prototype.noCarrier = function()
{
    this.resetSymbol();
    this.resetZeroCrossing();
    this.m_max = 0;
    this.m_min = 0;
    this.m_center = 0;
    this.m_filteredSample = 0;
}

DSDSymbol.prototype.resetFrameSync = function()
{
}

DSDSymbol.prototype.snapLevels = function(nbSymbols)
{
    this.m_lbuf2.set(this.m_lbuf.subarray(32 + this.m_lmmidx - nbSymbols, 32 + this.m_lmmidx));
    this.m_lbuf2.subarray(0, nbSymbols).sort(comp);
    let lmin = ((this.m_lbuf2[2] + this.m_lbuf2[3] + this.m_lbuf2[4]) / 3) | 0;
    let lmax = ((this.m_lbuf2[nbSymbols - 3] + this.m_lbuf2[nbSymbols - 4] + this.m_lbuf2[nbSymbols - 5]) / 3) | 0;
    this.m_max = (this.m_max + (lmax - this.m_max) / 4) | 0;
    this.m_min = (this.m_min + (lmin - this.m_min) / 4) | 0;
    this.m_center = ((this.m_max + this.m_min) / 2) | 0;
    this.m_umid = (((this.m_max - this.m_center) / 2) + this.m_center) | 0;
    this.m_lmid = (((this.m_min - this.m_center) / 2) + this.m_center) | 0;
}

DSDSymbol.prototype.setSamplesPerSymbol = function(samplesPerSymbol)
{
    this.m_samplesPerSymbol = samplesPerSymbol;
    if (this.m_samplesPerSymbol === 5) {
        this.m_zeroCrossingCorrectionProfile.set(DSDSymbol.m_zeroCrossingCorrectionProfile9600);
        this.m_zeroCrossingSlopeDivisor = 164;
        this.m_lmmSamples.resize(120);
        this.m_ringingFilter.setFrequencies(48000, 9600);
        this.m_ringingFilter.setR(0.99);
        this.m_pll.configure(0.2, 0.003, 0.25);
    } else if (this.m_samplesPerSymbol === 10) {
        this.m_zeroCrossingCorrectionProfile.set(DSDSymbol.m_zeroCrossingCorrectionProfile4800);
        this.m_zeroCrossingSlopeDivisor = 232;
        this.m_lmmSamples.resize(240);
        this.m_ringingFilter.setFrequencies(48000, 4800);
        this.m_ringingFilter.setR(0.99);
        this.m_pll.configure(0.1, 0.003, 0.25);
    } else if (this.m_samplesPerSymbol === 20) {
        this.m_zeroCrossingCorrectionProfile.set(DSDSymbol.m_zeroCrossingCorrectionProfile2400);
        this.m_zeroCrossingSlopeDivisor = 328;
        this.m_lmmSamples.resize(480);
        this.m_ringingFilter.setFrequencies(48000, 2400);
        this.m_ringingFilter.setR(0.996);
        this.m_pll.configure(0.05, 0.003, 0.25);
    } else {
        this.m_zeroCrossingCorrectionProfile.set(DSDSymbol.m_zeroCrossingCorrectionProfile4800);
        this.m_zeroCrossingSlopeDivisor = 232;
        this.m_lmmSamples.resize(240);
        this.m_ringingFilter.setFrequencies(48000, 4800);
        this.m_ringingFilter.setR(0.99);
        this.m_pll.configure(0.1, 0.003, 0.25);
    }
}

DSDSymbol.prototype.setFSK = function(nbSymbols, inverted = false)
{
    if (nbSymbols === 2)
        this.m_nbFSKSymbols = 2;
    else if (nbSymbols === 4)
        this.m_nbFSKSymbols = 4;
    else
        this.m_nbFSKSymbols = 2;
    this.m_invertedFSK = inverted;
}

DSDSymbol.prototype.setNoSignal = function(noSignal)
{
    this.m_noSignal = noSignal;
}

DSDSymbol.prototype.pushSample = function(sample)
{
    if (this.m_dsdDecoder.m_opts.use_cosine_filter) {
        if (this.m_samplesPerSymbol === 20)
            sample = this.m_dsdFilters.nxdn_filter(sample);
        else
            sample = this.m_dsdFilters.dmr_filter(sample);
    }
    this.m_filteredSample = sample;
    if (!this.m_noSignal) {
        this.m_lmmSamples.update(sample);
        let sampleSq = ((sample - this.m_center) * (sample - this.m_center)) >> 15;
        let sampleRinging = this.m_ringingFilter.run(sampleSq);
        if (this.m_pllLock) {
            let pllOut = new Float32Array(2);
            let pllIn = sampleRinging / 32768;
            this.m_pll.process(pllIn, pllOut);
            this.m_symbolSyncSample = (pllOut[0] * 16384) | 0;
            if ((this.m_symbolSyncSample > 0) && (this.m_lastsample < 0)) {
                let targetZero = ((this.m_sampleIndex - (this.m_samplesPerSymbol / 4)) % this.m_samplesPerSymbol) | 0;
                if (targetZero < (this.m_samplesPerSymbol) / 2) {
                    this.m_zeroCrossingPos = -targetZero;
                    this.m_zeroCrossing = -targetZero;
                    this.m_zeroCrossingInCycle = true;
                } else {
                    this.m_zeroCrossingPos = this.m_samplesPerSymbol - targetZero;
                    this.m_zeroCrossing = this.m_samplesPerSymbol - targetZero;
                    this.m_zeroCrossingInCycle = true;
                }
            }
            this.m_lastsample = this.m_symbolSyncSample;
        } else {
            if ((sampleRinging > 0) && (this.m_lastsample < 0) && (sampleRinging - this.m_lastsample > (this.m_max - this.m_min) / this.m_zeroCrossingSlopeDivisor)) {
                let targetZero = ((this.m_sampleIndex - (this.m_samplesPerSymbol / 4)) % this.m_samplesPerSymbol) | 0;
                if (targetZero < (this.m_samplesPerSymbol) / 2) {
                    this.m_zeroCrossingPos = -targetZero;
                    this.m_zeroCrossing = -targetZero;
                    this.m_zeroCrossingInCycle = true;
                } else {
                    this.m_zeroCrossingPos = this.m_samplesPerSymbol - targetZero;
                    this.m_zeroCrossing = this.m_samplesPerSymbol - targetZero;
                    this.m_zeroCrossingInCycle = true;
                }
            }
            this.m_lastsample = sampleRinging;
        }
    }
    if (!this.m_pllLock) {
        if (this.m_samplesPerSymbol === 5) {
            if (this.m_sampleIndex === 2)
                this.m_symbolSyncSample = this.m_max;
            else
                this.m_symbolSyncSample = this.m_min;
        } else if (this.m_samplesPerSymbol === 20) {
            if ((this.m_sampleIndex >= 7) && (this.m_sampleIndex <= 12))
                this.m_symbolSyncSample = this.m_max;
            else
                this.m_symbolSyncSample = this.m_min;
        } else {
            if ((this.m_sampleIndex >= 4) && (this.m_sampleIndex <= 5))
                this.m_symbolSyncSample = this.m_max;
            else
                this.m_symbolSyncSample = this.m_min;
        }
    }
    if (this.m_samplesPerSymbol === 5) {
        if (this.m_sampleIndex === 2) {
            this.m_sum += sample;
            this.m_count++;
        }
    } else if (this.m_samplesPerSymbol === 20) {
        if ((this.m_sampleIndex >= 7) && (this.m_sampleIndex <= 12)) {
            this.m_sum += sample;
            this.m_count++;
        }
    } else {
        if ((this.m_sampleIndex >= 4) && (this.m_sampleIndex <= 5)) {
            this.m_sum += sample;
            this.m_count++;
        }
    }
    if ((this.m_sampleIndex === 0) && (!this.m_noSignal)) {
        if (this.m_zeroCrossingInCycle) {
            if (this.m_zeroCrossing < 0)
                this.m_sampleIndex -= this.m_zeroCrossingCorrectionProfile[-this.m_zeroCrossing];
            else
                this.m_sampleIndex += this.m_zeroCrossingCorrectionProfile[this.m_zeroCrossing];
            this.m_numflips++;
            this.m_zeroCrossingInCycle = false;
        }
    }
    if (this.m_sampleIndex === this.m_samplesPerSymbol - 1) {
        if (this.m_count === 0) {
            this.m_sampleIndex = 0;
            return false;
        }
        this.m_symbol = (this.m_sum / this.m_count) | 0;
        this.m_dsdDecoder.m_state.symbolcnt++;
        this.digitizeIntoBinaryBuffer();
        this.resetSymbol();
        if (this.m_symbolSyncQualityCounter < 99)
            this.m_symbolSyncQualityCounter++;
        else {
            this.m_symbolSyncQuality = this.m_numflips;
            this.m_symbolSyncQualityCounter = 0;
            this.m_numflips = 0;
        }
        if (this.m_lmmidx < 24)
            this.m_lmmidx++;
        else {
            this.m_lmmidx = 0;
            this.snapMinMax();
        }
        return true;
    } else {
        this.m_sampleIndex++;
        return false;
    }
}

DSDSymbol.prototype.getSymbol = function()
{
    return this.m_symbol;
}

DSDSymbol.prototype.getDibit = function()
{
    return this.get_dibit();
}

DSDSymbol.prototype.getDibitBack = function(shift)
{
    return this.m_binSymbolBuffer.getBack(shift);
}

DSDSymbol.prototype.getSyncDibitBack = function(shift)
{
    return this.m_syncSymbolBuffer.getBack(shift);
}

DSDSymbol.prototype.getNonInvertedSyncDibitBack = function(shift)
{
    return this.m_nonInvertedSyncSymbolBuffer.getBack(shift);
}

DSDSymbol.invert_dibit = function(dibit)
{
    switch (dibit) {
    case 0:
        return 2;
    case 1:
        return 3;
    case 2:
        return 0;
    case 3:
        return 1;
    }
    return -1;
}

DSDSymbol.prototype.getLevel = function()
{
    return ((this.m_max - this.m_min) / 328) | 0;
}

DSDSymbol.prototype.getCarrierPos = function()
{
    return (this.m_center / 164) | 0;
}

DSDSymbol.prototype.getZeroCrossingPos = function()
{
    return this.m_zeroCrossingPos;
}

DSDSymbol.prototype.getSymbolSyncQuality = function()
{
    return this.m_symbolSyncQuality;
}

DSDSymbol.prototype.getFilteredSample = function()
{
    return this.m_filteredSample;
}

DSDSymbol.prototype.getSymbolSyncSample = function()
{
    return this.m_symbolSyncSample;
}

DSDSymbol.prototype.getSamplesPerSymbol = function()
{
    return this.m_samplesPerSymbol;
}

DSDSymbol.prototype.getPLLLocked = function()
{
    return this.m_pllLock && this.m_pll.locked();
}

DSDSymbol.prototype.setPLLLock = function(pllLock)
{
    this.m_pllLock = pllLock;
}

DSDSymbol.compressBits = function(bitArray, byteArray, nbBytes)
{
    for (let i = 0; i < nbBytes; i++) {
        byteArray[i] =  (1 & bitArray[8 * i + 0]) << 7;
        byteArray[i] += (1 & bitArray[8 * i + 1]) << 6;
        byteArray[i] += (1 & bitArray[8 * i + 2]) << 5;
        byteArray[i] += (1 & bitArray[8 * i + 3]) << 4;
        byteArray[i] += (1 & bitArray[8 * i + 4]) << 3;
        byteArray[i] += (1 & bitArray[8 * i + 5]) << 2;
        byteArray[i] += (1 & bitArray[8 * i + 6]) << 1;
        byteArray[i] += (1 & bitArray[8 * i + 7]) << 0;
    }
}

DSDSymbol.prototype.resetSymbol = function()
{
    this.m_sampleIndex = 0;
    this.m_sum = 0;
    this.m_count = 0;
}

DSDSymbol.prototype.resetZeroCrossing = function()
{
    this.m_zeroCrossing = 0;
    this.m_zeroCrossingInCycle = false;
    this.m_zeroCrossingPos = 0;
}

DSDSymbol.prototype.get_dibit = function()
{
    return this.m_binSymbolBuffer.getLatest();
}

DSDSymbol.prototype.digitize = function(symbol)
{
    if (this.m_nbFSKSymbols === 2) {
        if (symbol > this.m_center)
            return (this.m_invertedFSK ? 1 : 0);
        else
            return (this.m_invertedFSK ? 0 : 1);
    } else if (this.m_nbFSKSymbols === 4) {
        let dibit;
        if (symbol > this.m_center) {
            if (symbol > this.m_umid)
                dibit = this.m_invertedFSK ? 3 : 1;
            else
                dibit = this.m_invertedFSK ? 2 : 0;
        }
        else {
            if (symbol < this.m_lmid)
                dibit = this.m_invertedFSK ? 1 : 3;
            else
                dibit = this.m_invertedFSK ? 0 : 2;
        }
        return dibit;
    } else
        return 0;
}

DSDSymbol.prototype.digitizeIntoBinaryBuffer = function()
{
    let binSymbol = this.digitize(this.m_symbol);
    this.m_binSymbolBuffer.push(binSymbol);
    this.m_syncSymbolBuffer.push(this.m_symbol > 0 ? 1 : 3);
    this.m_nonInvertedSyncSymbolBuffer.push((this.m_invertedFSK ? (this.m_symbol <= 0) : (this.m_symbol > 0)) ? 1 : 3);
}

DSDSymbol.prototype.snapMinMax = function()
{
    this.m_max = (this.m_max + (this.m_lmmSamples.max() - this.m_max) / 4) | 0;
    this.m_min = (this.m_min + (this.m_lmmSamples.min() - this.m_min) / 4) | 0;
    this.m_center = ((this.m_max + this.m_min) / 2) | 0;
    this.m_umid = (((this.m_max - this.m_center) / 2) + this.m_center) | 0;
    this.m_lmid = (((this.m_min - this.m_center) / 2) + this.m_center) | 0;
}

DSDSymbol.comp = function(a, b)
{
    if (a === b)
        return 0;
    else if (a < b)
        return -1;
    else
        return 1;
}

DSDSymbol.compShort = function(a, b)
{
    return this.comp(a, b);
}


function DSDmbelibParms()
{
    this.m_cur_mp = new mbe_parms();
    this.m_prev_mp = new mbe_parms();
    this.m_prev_mp_enhanced = new mbe_parms();
}


function DSDMBEDecoder(dsdDecoder)
{
    this.m_audio_out_temp_buf = new Float32Array(160);
    this.m_errs = 0;
    this.m_errs2 = 0;
    this.m_err_str = "";
    this.m_upsamplingFilter = new DSDMBEAudioInterpolatorFilter();
    this.m_mbelibParms = new DSDmbelibParms();
    this.m_dsdDecoder = dsdDecoder;
    this.m_upsamplerLastValue = 0;
    this.m_audio_out_temp_buf_p = 0;
    this.m_audio_out_float_buf = new Float32Array(1120);
    this.m_audio_out_float_buf_p = 0;
    this.m_aout_max_buf = new Float32Array(200);
    this.m_aout_max_buf_p = 0;
    this.m_aout_max_buf_idx = 0;
    this.m_audio_out_buf = new Int16Array(96000);
    this.m_audio_out_buf_p = 0;
    this.m_audio_out_nb_samples = 0;
    this.m_audio_out_buf_size = 48000;
    this.m_audio_out_idx = 0;
    this.m_audio_out_idx2 = 0;
    this.m_aout_gain = 25;
    this.m_volume = 1;
    this.m_auto_gain = true;
    this.m_stereo = false;
    this.m_channels = 3;
    this.m_upsample = 0;
    this.initMbeParms();
    this.ambe_d = new Int8Array(49);
    this.imbe_d = new Int8Array(88);
}

DSDMBEDecoder.prototype.initMbeParms = function()
{
    mbe_initMbeParms(this.m_mbelibParms.m_cur_mp, this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced);
    this.m_errs = 0;
    this.m_errs2 = 0;
    this.m_err_str = "";
    if (this.m_auto_gain)
        this.m_aout_gain = 25;
}

DSDMBEDecoder.prototype.processFrame = function(imbe_fr, ambe_fr, imbe7100_fr)
{
    if (!this.m_dsdDecoder.m_mbelibEnable)
        return;
    this.imbe_d.fill(0);
    if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate7200x4400)
        mbe_processImbe7200x4400Framef(this.m_audio_out_temp_buf, this.m_errs,
                                       this.m_errs2, this.m_err_str, imbe_fr, this.imbe_d, this.m_mbelibParms.m_cur_mp,
                                       this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    else if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate7100x4400)
        mbe_processImbe7100x4400Framef(this.m_audio_out_temp_buf, this.m_errs,
                                       this.m_errs2, this.m_err_str, imbe7100_fr, this.imbe_d,
                                       this.m_mbelibParms.m_cur_mp, this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced,
                                       this.m_dsdDecoder.m_opts.uvquality);
    else if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate3600x2400)
        mbe_processAmbe3600x2400Framef(this.m_audio_out_temp_buf, this.m_errs,
                                       this.m_errs2, this.m_err_str, ambe_fr, this.ambe_d, this.m_mbelibParms.m_cur_mp,
                                       this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    else
        mbe_processAmbe3600x2450Framef(this.m_audio_out_temp_buf, this.m_errs,
                                       this.m_errs2, this.m_err_str, ambe_fr, this.ambe_d, this.m_mbelibParms.m_cur_mp,
                                       this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    this.m_errs = global2;
    this.m_errs2 = global3;
    this.processAudio();
}

DSDMBEDecoder.prototype.processData = function(imbe_data, ambe_data)
{
    if (!this.m_dsdDecoder.m_mbelibEnable)
        return;
    if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate4400)
        mbe_processImbe4400Dataf(this.m_audio_out_temp_buf, this.m_errs,
                                 this.m_errs2, this.m_err_str, imbe_data, this.m_mbelibParms.m_cur_mp,
                                 this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    else if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate2400)
        mbe_processAmbe2400Dataf(this.m_audio_out_temp_buf, this.m_errs,
                                 this.m_errs2, this.m_err_str, ambe_data, this.m_mbelibParms.m_cur_mp,
                                 this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    else if (this.m_dsdDecoder.m_mbeRate === DSDDecoder.DSDMBERate2450)
        mbe_processAmbe2450Dataf(this.m_audio_out_temp_buf, this.m_errs,
                                 this.m_errs2, this.m_err_str, ambe_data, this.m_mbelibParms.m_cur_mp,
                                 this.m_mbelibParms.m_prev_mp, this.m_mbelibParms.m_prev_mp_enhanced, this.m_dsdDecoder.m_opts.uvquality);
    else
        return;
    this.m_err_str = global1;
    this.processAudio();
}

DSDMBEDecoder.prototype.getAudio = function(nbSamples)
{
    global1 = this.m_audio_out_nb_samples;
    return this.m_audio_out_buf;
}

DSDMBEDecoder.prototype.resetAudio = function()
{
    this.m_audio_out_nb_samples = 0;
    this.m_audio_out_buf_p = 0;
}

DSDMBEDecoder.prototype.setAudioGain = function(aout_gain)
{
    this.m_aout_gain = aout_gain;
}

DSDMBEDecoder.prototype.setAutoGain = function(auto_gain)
{
    this.m_auto_gain = auto_gain;
}

DSDMBEDecoder.prototype.setVolume = function(volume)
{
    this.m_volume = volume;
}

DSDMBEDecoder.prototype.setStereo = function(stereo)
{
    this.m_stereo = stereo;
}

DSDMBEDecoder.prototype.setChannels = function(channels)
{
    this.m_channels = channels % 4;
}

DSDMBEDecoder.prototype.setUpsamplingFactor = function(upsample)
{
    this.m_upsample = upsample;
}

DSDMBEDecoder.prototype.getUpsamplingFactor = function()
{
    return this.m_upsample;
}

DSDMBEDecoder.prototype.useHP = function(use)
{
    this.m_upsamplingFilter.useHP(use);
}

DSDMBEDecoder.prototype.processAudio = function()
{
    let i, n;
    let aout_abs, max, gainfactor, gaindelta, maxbuf;

    if (this.m_auto_gain) {
        max = 0;
        this.m_audio_out_temp_buf_p = 0;
        for (n = 0; n < 160; n++) {
            aout_abs = Math.abs(this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p]);
            if (aout_abs > max)
                max = aout_abs;
            this.m_audio_out_temp_buf_p++;
        }
        this.m_aout_max_buf[this.m_aout_max_buf_p] = max;
        this.m_aout_max_buf_p++;
        this.m_aout_max_buf_idx++;
        if (this.m_aout_max_buf_idx > 24) {
            this.m_aout_max_buf_idx = 0;
            this.m_aout_max_buf_p = 0;
        }
        for (i = 0; i < 25; i++) {
            maxbuf = this.m_aout_max_buf[i];
            if (maxbuf > max)
                max = maxbuf;
        }
        if (max > 0)
            gainfactor = 30000 / max;
        else
            gainfactor = 50;
        if (gainfactor < this.m_aout_gain) {
            this.m_aout_gain = gainfactor;
            gaindelta = 0;
        } else {
            if (gainfactor > 50)
                gainfactor = 50;
            gaindelta = gainfactor - this.m_aout_gain;
            if (gaindelta > 0.05 * this.m_aout_gain)
                gaindelta = 0.05 * this.m_aout_gain;
        }
        gaindelta /= 160;
        this.m_audio_out_temp_buf_p = 0;
        for (n = 0; n < 160; n++) {
            this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] = (this.m_aout_gain + n * gaindelta) * this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p];
            this.m_audio_out_temp_buf_p++;
        }
        this.m_aout_gain += 160 * gaindelta;
    } else
        gaindelta = 0;
    this.m_audio_out_temp_buf_p = 0;
    if (this.m_upsample >= 2) {
        let upsampling = this.m_upsample;
        if (this.m_audio_out_nb_samples + 160 * upsampling >= this.m_audio_out_buf_size)
            this.resetAudio();
        this.m_audio_out_float_buf_p = 0;
        for (n = 0; n < 160; n++) {
            this.upsample(upsampling, this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p]);
            this.m_audio_out_temp_buf_p++;
            this.m_audio_out_float_buf_p += upsampling;
            this.m_audio_out_idx += upsampling;
            this.m_audio_out_idx2 += upsampling;
        }
        this.m_audio_out_float_buf_p = 0;
        for (n = 0; n < 160 * upsampling; n++) {
            if (this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] > 32760)
                this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] = 32760;
            else if (this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] < -32760)
                this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] = -32760;
            if (this.m_stereo) {
                if (this.m_channels & 1)
                    this.m_audio_out_buf[this.m_audio_out_buf_p] = this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] | 0;
                else
                    this.m_audio_out_buf[this.m_audio_out_buf_p] = 0;
                this.m_audio_out_buf_p++;
                if ((this.m_channels >> 1) & 1)
                    this.m_audio_out_buf[this.m_audio_out_buf_p] = this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] | 0;
                else
                    this.m_audio_out_buf[this.m_audio_out_buf_p] = 0;
                this.m_audio_out_buf_p++;
            } else {
                this.m_audio_out_buf[this.m_audio_out_buf_p] = this.m_audio_out_float_buf[this.m_audio_out_float_buf_p] | 0;
                this.m_audio_out_buf_p++;
            }
            this.m_audio_out_nb_samples++;
            this.m_audio_out_float_buf_p++;
        }
    } else {
        if (this.m_audio_out_nb_samples + 160 >= this.m_audio_out_buf_size)
            this.resetAudio();
        this.m_audio_out_float_buf_p = 0;
        for (let n = 0; n < 160; n++) {
            if (this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] > 32760)
                this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] = 32760;
            else if (this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] < -32760)
                this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] = -32760;
            this.m_audio_out_buf[this.m_audio_out_buf_p] = this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] | 0;
            this.m_audio_out_buf_p++;
            if (this.m_stereo) {
                this.m_audio_out_buf[this.m_audio_out_buf_p] = this.m_audio_out_temp_buf[this.m_audio_out_temp_buf_p] | 0;
                this.m_audio_out_buf_p++;
            }
            this.m_audio_out_nb_samples++;
            this.m_audio_out_temp_buf_p++;
            this.m_audio_out_idx++;
            this.m_audio_out_idx2++;
        }
    }
}

DSDMBEDecoder.prototype.upsample = function(upsampling, invalue)
{
    let outbuf1;
    let c, d;
    outbuf1 = this.m_audio_out_float_buf_p;
    c = this.m_upsamplerLastValue;
    d = (this.m_upsamplingFilter.usesHP() ? this.m_upsamplingFilter.runHP(invalue) : invalue) * this.m_volume;
    if (upsampling === 2) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.5 + c * 0.5);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else if (upsampling === 3) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.332 + c * 0.668);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.668 + c * 0.332);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else if (upsampling === 4) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.25 + c * 0.75);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.5 + c * 0.5);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.75 + c * 0.25);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else if (upsampling === 5) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.2 + c * 0.8);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.4 + c * 0.6);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.6 + c * 0.4);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.8 + c * 0.2);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else if (upsampling === 6) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.166 + c * 0.834);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.332 + c * 0.668);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.5 + c * 0.5);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.668 + c * 0.332);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.834 + c * 0.166);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else if (upsampling === 7) {
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.142 + c * 0.857);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.286 + c * 0.714);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.429 + c * 0.571);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.571 + c * 0.429);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.714 + c * 0.286);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d * 0.857 + c * 0.142);
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = this.m_upsamplingFilter.runLP(d);
        this.m_upsamplerLastValue = d;
        outbuf1++;
    } else {
        outbuf1++;
        this.m_audio_out_float_buf[outbuf1] = d;
        outbuf1++;
    }
    outbuf1 -= upsampling;
}


function Hamming_7_4()
{
    this.m_corr = new Uint8Array(8);
    this.init();
}

Hamming_7_4.m_G = new Uint8Array([
                                     1, 0, 0, 0, 1, 0, 1,
                                     0, 1, 0, 0, 1, 1, 1,
                                     0, 0, 1, 0, 1, 1, 0,
                                     0, 0, 0, 1, 0, 1, 1,
                                 ]);
Hamming_7_4.m_H = new Uint8Array([
                                     1, 1, 1, 0, 1, 0, 0,
                                     0, 1, 1, 1, 0, 1, 0,
                                     1, 1, 0, 1, 0, 0, 1
                                 ]);

Hamming_7_4.prototype.init = function()
{
    this.m_corr.fill(0xff);
    this.m_corr[0b101] = 0;
    this.m_corr[0b111] = 1;
    this.m_corr[0b110] = 2;
    this.m_corr[0b011] = 3;
    this.m_corr[0b100] = 4;
    this.m_corr[0b010] = 5;
    this.m_corr[0b001] = 6;
}

Hamming_7_4.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 4; i++)
        for (j = 0; j < 7; j++)
            encodedBits[j] += origBits[i] * Hamming_7_4.m_G[7 * i + j];
    for (i = 0; i < 7; i++)
        encodedBits[i] %= 2;
}

Hamming_7_4.prototype.decode = function(rxBits)
{
    let syndromeI = 0;
    for (let is = 0; is < 3; is++)
        syndromeI +=(((rxBits[0] * Hamming_7_4.m_H[7 * is + 0])
                      + (rxBits[1] * Hamming_7_4.m_H[7 * is + 1])
                      + (rxBits[2] * Hamming_7_4.m_H[7 * is + 2])
                      + (rxBits[3] * Hamming_7_4.m_H[7 * is + 3])
                      + (rxBits[4] * Hamming_7_4.m_H[7 * is + 4])
                      + (rxBits[5] * Hamming_7_4.m_H[7 * is + 5])
                      + (rxBits[6] * Hamming_7_4.m_H[7 * is + 6])) % 2) << (2 - is);
    if (syndromeI > 0) {
        if (this.m_corr[syndromeI] === 0xff)
            return false;
        else
            rxBits[this.m_corr[syndromeI]] ^= 1;
    }
    return true;
}


function Hamming_12_8()
{
    this.m_corr = new Uint8Array(16);
    this.init();
}

Hamming_12_8.m_G = new Uint8Array([
                                      1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
                                      0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                                      0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0,
                                      0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
                                      0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1,
                                      0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0,
                                      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                                  ]);
Hamming_12_8.m_H = new Uint8Array([
                                      1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0,
                                      1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0,
                                      1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0,
                                      0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1
                                  ]);

Hamming_12_8.prototype.init = function()
{
    this.m_corr.fill(0xff);
    this.m_corr[0b1110] = 0;
    this.m_corr[0b0111] = 1;
    this.m_corr[0b1010] = 2;
    this.m_corr[0b0101] = 3;
    this.m_corr[0b1011] = 4;
    this.m_corr[0b1100] = 5;
    this.m_corr[0b0110] = 6;
    this.m_corr[0b0011] = 7;
    this.m_corr[0b1000] = 8;
    this.m_corr[0b0100] = 9;
    this.m_corr[0b0010] = 10;
    this.m_corr[0b0001] = 11;
}

Hamming_12_8.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 8; i++)
        for (j = 0; j < 12; j++)
            encodedBits[j] += origBits[i] * Hamming_12_8.m_G[12 * i + j];
    for (i = 0; i < 12; i++)
        encodedBits[i] %= 2;
}

Hamming_12_8.prototype.decode = function(rxBits, decodedBits, nbCodewords)
{
    let correctable = true;
    let is, i;
    for (let ic = 0; ic < nbCodewords; ic++) {
        let syndromeI = 0;
        for (is = 0; is < 4; is++)
            syndromeI += (((rxBits[12 * ic +  0] * Hamming_12_8.m_H[12 * is +  0])
                           + (rxBits[12 * ic +  1] * Hamming_12_8.m_H[12 * is +  1])
                           + (rxBits[12 * ic +  2] * Hamming_12_8.m_H[12 * is +  2])
                           + (rxBits[12 * ic +  3] * Hamming_12_8.m_H[12 * is +  3])
                           + (rxBits[12 * ic +  4] * Hamming_12_8.m_H[12 * is +  4])
                           + (rxBits[12 * ic +  5] * Hamming_12_8.m_H[12 * is +  5])
                           + (rxBits[12 * ic +  6] * Hamming_12_8.m_H[12 * is +  6])
                           + (rxBits[12 * ic +  7] * Hamming_12_8.m_H[12 * is +  7])
                           + (rxBits[12 * ic +  8] * Hamming_12_8.m_H[12 * is +  8])
                           + (rxBits[12 * ic +  9] * Hamming_12_8.m_H[12 * is +  9])
                           + (rxBits[12 * ic + 10] * Hamming_12_8.m_H[12 * is + 10])
                           + (rxBits[12 * ic + 11] * Hamming_12_8.m_H[12 * is + 11])) % 2) << (3 - is);
        if (syndromeI > 0) {
            if (this.m_corr[syndromeI] === 0xff)
                correctable = false;
            else
                rxBits[this.m_corr[syndromeI]] ^= 1;
        }
        decodedBits.set(rxBits.subarray(12 * ic, 12 * ic + 8), 8 * ic);
    }
    return correctable;
}


function Hamming_15_11()
{
    this.m_corr = new Uint8Array(16);
    this.init();
}

Hamming_15_11.m_G = new Uint8Array([
                                       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                                       0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1,
                                       0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
                                       0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
                                       0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                                       0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0,
                                       0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
                                       0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1,
                                       0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0,
                                       0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0,
                                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                                   ]);
Hamming_15_11.m_H = new Uint8Array([
                                       1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0,
                                       0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0,
                                       0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0,
                                       1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1,
                                   ]);

Hamming_15_11.prototype.init = function()
{
    this.m_corr.fill(0xff);
    this.m_corr[0b1001] = 0;
    this.m_corr[0b1101] = 1;
    this.m_corr[0b1111] = 2;
    this.m_corr[0b1110] = 3;
    this.m_corr[0b0111] = 4;
    this.m_corr[0b1010] = 5;
    this.m_corr[0b0101] = 6;
    this.m_corr[0b1011] = 7;
    this.m_corr[0b1100] = 8;
    this.m_corr[0b0110] = 9;
    this.m_corr[0b0011] = 10;
    this.m_corr[0b1000] = 11;
    this.m_corr[0b0100] = 12;
    this.m_corr[0b0010] = 13;
    this.m_corr[0b0001] = 14;
}

Hamming_15_11.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 11; i++)
        for (j = 0; j < 15; j++)
            encodedBits[j] += origBits[i] * Hamming_15_11.m_G[15 * i + j];
    for (i = 0; i < 15; i++)
        encodedBits[i] %= 2;
}

Hamming_15_11.prototype.decode = function(rxBits, decodedBits, nbCodewords)
{
    let correctable = true;
    let is, i;
    for (let ic = 0; ic < nbCodewords; ic++) {
        let syndromeI = 0;
        for (is = 0; is < 4; is++)
            syndromeI += (((rxBits[15 * ic +  0] * Hamming_15_11.m_H[15 * is +  0])
                           + (rxBits[15 * ic +  1] * Hamming_15_11.m_H[15 * is +  1])
                           + (rxBits[15 * ic +  2] * Hamming_15_11.m_H[15 * is +  2])
                           + (rxBits[15 * ic +  3] * Hamming_15_11.m_H[15 * is +  3])
                           + (rxBits[15 * ic +  4] * Hamming_15_11.m_H[15 * is +  4])
                           + (rxBits[15 * ic +  5] * Hamming_15_11.m_H[15 * is +  5])
                           + (rxBits[15 * ic +  6] * Hamming_15_11.m_H[15 * is +  6])
                           + (rxBits[15 * ic +  7] * Hamming_15_11.m_H[15 * is +  7])
                           + (rxBits[15 * ic +  8] * Hamming_15_11.m_H[15 * is +  8])
                           + (rxBits[15 * ic +  9] * Hamming_15_11.m_H[15 * is +  9])
                           + (rxBits[15 * ic + 10] * Hamming_15_11.m_H[15 * is + 10])
                           + (rxBits[15 * ic + 11] * Hamming_15_11.m_H[15 * is + 11])
                           + (rxBits[15 * ic + 12] * Hamming_15_11.m_H[15 * is + 12])
                           + (rxBits[15 * ic + 13] * Hamming_15_11.m_H[15 * is + 13])
                           + (rxBits[15 * ic + 14] * Hamming_15_11.m_H[15 * is + 14])) % 2) << (3 - is);
        if (syndromeI > 0) {
            if (this.m_corr[syndromeI] === 0xff) {
                correctable = false;
                break;
            } else
                rxBits[this.m_corr[syndromeI]] ^= 1
        }
        if (decodedBits)
            decodedBits.set(rxBits.subarray(15 * ic, 15 * ic + 11), 11 * ic);
    }
    return correctable;
}


function Hamming_16_11_4()
{
    this.m_corr = new Uint8Array(32);
    this.init();
}

Hamming_16_11_4.m_G = new Uint8Array([
                                         1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                                         0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0,
                                         0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                                         0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                                         0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
                                         0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
                                         0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1,
                                         0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0,
                                         0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1,
                                         0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1,
                                         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1
                                     ]);
Hamming_16_11_4.m_H = new Uint8Array([
                                         1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0,
                                         0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0,
                                         0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0,
                                         1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0,
                                         1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1
                                     ]);

Hamming_16_11_4.prototype.init = function()
{
    this.m_corr.fill(0xff);
    this.m_corr[0b10011] = 0;
    this.m_corr[0b11010] = 1;
    this.m_corr[0b11111] = 2;
    this.m_corr[0b11100] = 3;
    this.m_corr[0b01110] = 4;
    this.m_corr[0b10101] = 5;
    this.m_corr[0b01011] = 6;
    this.m_corr[0b10110] = 7;
    this.m_corr[0b11001] = 8;
    this.m_corr[0b01101] = 9;
    this.m_corr[0b00111] = 10;
    this.m_corr[0b10000] = 11;
    this.m_corr[0b01000] = 12;
    this.m_corr[0b00100] = 13;
    this.m_corr[0b00010] = 14;
    this.m_corr[0b00001] = 15;
}

Hamming_16_11_4.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 11; i++)
        for (j = 0; j < 16; j++)
            encodedBits[j] += origBits[i] * Hamming_16_11_4.m_G[16 * i + j];
    for (i = 0; i < 16; i++)
        encodedBits[i] %= 2;
}

Hamming_16_11_4.prototype.decode = function(rxBits, decodedBits, nbCodewords)
{
    let correctable = true;
    let is, i;
    for (let ic = 0; ic < nbCodewords; ic++) {
        let syndromeI = 0;
        for (is = 0; is < 5; is++)
            syndromeI += (((rxBits[16 * ic +  0] * Hamming_16_11_4.m_H[16 * is +  0])
                           + (rxBits[16 * ic +  1] * Hamming_16_11_4.m_H[16 * is +  1])
                           + (rxBits[16 * ic +  2] * Hamming_16_11_4.m_H[16 * is +  2])
                           + (rxBits[16 * ic +  3] * Hamming_16_11_4.m_H[16 * is +  3])
                           + (rxBits[16 * ic +  4] * Hamming_16_11_4.m_H[16 * is +  4])
                           + (rxBits[16 * ic +  5] * Hamming_16_11_4.m_H[16 * is +  5])
                           + (rxBits[16 * ic +  6] * Hamming_16_11_4.m_H[16 * is +  6])
                           + (rxBits[16 * ic +  7] * Hamming_16_11_4.m_H[16 * is +  7])
                           + (rxBits[16 * ic +  8] * Hamming_16_11_4.m_H[16 * is +  8])
                           + (rxBits[16 * ic +  9] * Hamming_16_11_4.m_H[16 * is +  9])
                           + (rxBits[16 * ic + 10] * Hamming_16_11_4.m_H[16 * is + 10])
                           + (rxBits[16 * ic + 11] * Hamming_16_11_4.m_H[16 * is + 11])
                           + (rxBits[16 * ic + 12] * Hamming_16_11_4.m_H[16 * is + 12])
                           + (rxBits[16 * ic + 13] * Hamming_16_11_4.m_H[16 * is + 13])
                           + (rxBits[16 * ic + 14] * Hamming_16_11_4.m_H[16 * is + 14])
                           + (rxBits[16 * ic + 15] * Hamming_16_11_4.m_H[16 * is + 15])) % 2) << (4 - is);
        if (syndromeI > 0) {
            if (this.m_corr[syndromeI] === 0xff) {
                correctable = false;
                break;
            } else
                rxBits[this.m_corr[syndromeI]] ^= 1;
        }
        if (decodedBits)
            decodedBits.set(rxBits.subarray(16 * ic, 16 * ic + 11), 11 * ic);
    }
    return correctable;
}


function Golay_20_8()
{
    this.m_corr = new Uint8Array(12288);
    this.init();
}

Golay_20_8.m_G = new Uint8Array([
                                    1, 0, 0, 0, 0, 0, 0, 0,	0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0,
                                    0, 1, 0, 0, 0, 0, 0, 0,	1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                    0, 0, 1, 0, 0, 0, 0, 0,	0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
                                    0, 0, 0, 1, 0, 0, 0, 0,	0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1,
                                    0, 0, 0, 0, 1, 0, 0, 0,	1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0,
                                    0, 0, 0, 0, 0, 1, 0, 0,	1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1,
                                    0, 0, 0, 0, 0, 0, 1, 0,	1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0,
                                    0, 0, 0, 0, 0, 0, 0, 1,	1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1
                                ]);
Golay_20_8.m_H = new Uint8Array([
                                    0, 1, 0, 0, 1, 1, 1, 1,	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    0, 1, 1, 0, 1, 0, 0, 0,	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    1, 0, 1, 1, 0, 1, 0, 0,	0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    1, 1, 0, 1, 1, 0, 1, 0,	0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                                    1, 1, 1, 0, 1, 1, 0, 1,	0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                                    1, 0, 1, 1, 1, 0, 0, 1,	0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
                                    0, 0, 0, 1, 0, 0, 1, 1,	0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                                    1, 1, 0, 0, 0, 1, 1, 0,	0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                                    1, 1, 1, 0, 0, 0, 1, 1,	0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                                    0, 0, 1, 1, 1, 1, 1, 0,	0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                                    1, 0, 0, 1, 1, 1, 1, 1,	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                                    0, 1, 1, 1, 0, 1, 0, 1,	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
                                ]);

Golay_20_8.prototype.init = function()
{
    this.m_corr.fill(0xff);
    let syndromeI, syndromeIP, syndromeIP1, syndromeIP2, syndromeIP3;
    let i1, i2, i3, ir, ip, ip1, ip2, ip3;
    for (i1 = 0; i1 < 8; i1++) {
        for (i2 = i1 + 1; i2 < 8; i2++) {
            for (i3 = i2 + 1; i3 < 8; i3++) {
                syndromeI = 0;
                for (ir = 0; ir < 12; ir++)
                    syndromeI += ((Golay_20_8.m_H[20 * ir + i1] +  Golay_20_8.m_H[20 * ir + i2] +  Golay_20_8.m_H[20 * ir + i3]) % 2) << (11 - ir);
                this.m_corr[3 * syndromeI] = i1;
                this.m_corr[3 * syndromeI + 1] = i2;
                this.m_corr[3 * syndromeI + 2] = i3;
            }
            syndromeI = 0;
            for (ir = 0; ir < 12; ir++)
                syndromeI += ((Golay_20_8.m_H[20 * ir + i1] +  Golay_20_8.m_H[20 * ir + i2]) % 2) << (11 - ir);
            this.m_corr[3 * syndromeI] = i1;
            this.m_corr[3 * syndromeI + 1] = i2;
            for (ip = 0; ip < 12; ip++) {
                syndromeIP = syndromeI ^ (1 << (11 - ip));
                this.m_corr[3 * syndromeIP] = i1;
                this.m_corr[3 * syndromeIP + 1] = i2;
                this.m_corr[3 * syndromeIP + 2] = 12 + ip;
            }
        }
        syndromeI = 0;
        for (ir = 0; ir < 12; ir++)
            syndromeI += Golay_20_8.m_H[20 * ir + i1] << (11 - ir);
        this.m_corr[3 * syndromeI] = i1;
        for (ip1 = 0; ip1 < 12; ip1++) {
            syndromeIP1 = syndromeI ^ (1 << (11 - ip1));
            this.m_corr[3 * syndromeIP1] = i1;
            this.m_corr[3 * syndromeIP1 + 1] = 12 + ip1;
            for (ip2 = ip1 + 1; ip2 < 12; ip2++) {
                syndromeIP2 = syndromeIP1 ^ (1 << (11 - ip2));
                this.m_corr[3 * syndromeIP2] = i1;
                this.m_corr[3 * syndromeIP2 + 1] = 12 + ip1;
                this.m_corr[3 * syndromeIP2 + 2] = 12 + ip2;
            }
        }
    }
    for (ip1 = 0; ip1 < 12; ip1++) {
        syndromeIP1 =  (1 << (11 - ip1));
        this.m_corr[3 * syndromeIP1] = 12 + ip1;
        for (ip2 = ip1 + 1; ip2 < 12; ip2++) {
            syndromeIP2 = syndromeIP1 ^ (1 << (11 - ip2));
            this.m_corr[3 * syndromeIP2] = 12 + ip1;
            this.m_corr[3 * syndromeIP2 + 1] = 12 + ip2;
            for (ip3 = ip2 + 1; ip3 < 12; ip3++) {
                syndromeIP3 = syndromeIP2 ^ (1 << (11 - ip3));
                this.m_corr[3 * syndromeIP3] = 12 + ip1;
                this.m_corr[3 * syndromeIP3 + 1] = 12 + ip2;
                this.m_corr[3 * syndromeIP3 + 2] = 12 + ip3;
            }
        }
    }
}

Golay_20_8.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 8; i++)
        for (j = 0; j < 20; j++)
            encodedBits[j] += origBits[i] * Golay_20_8.m_G[20 * i + j];
    for (i = 0; i < 20; i++)
        encodedBits[i] %= 2;
}

Golay_20_8.prototype.decode = function(rxBits)
{
    let syndromeI = 0;
    for (let is = 0; is < 12; is++)
        syndromeI +=(((rxBits[0] *  Golay_20_8.m_H[20 * is + 0])
                      + (rxBits[1] *  Golay_20_8.m_H[20 * is + 1])
                      + (rxBits[2] *  Golay_20_8.m_H[20 * is + 2])
                      + (rxBits[3] *  Golay_20_8.m_H[20 * is + 3])
                      + (rxBits[4] *  Golay_20_8.m_H[20 * is + 4])
                      + (rxBits[5] *  Golay_20_8.m_H[20 * is + 5])
                      + (rxBits[6] *  Golay_20_8.m_H[20 * is + 6])
                      + (rxBits[7] *  Golay_20_8.m_H[20 * is + 7])
                      + (rxBits[8] *  Golay_20_8.m_H[20 * is + 8])
                      + (rxBits[9] *  Golay_20_8.m_H[20 * is + 9])
                      + (rxBits[10] * Golay_20_8.m_H[20 * is + 10])
                      + (rxBits[11] * Golay_20_8.m_H[20 * is + 11])
                      + (rxBits[12] * Golay_20_8.m_H[20 * is + 12])
                      + (rxBits[13] * Golay_20_8.m_H[20 * is + 13])
                      + (rxBits[14] * Golay_20_8.m_H[20 * is + 14])
                      + (rxBits[15] * Golay_20_8.m_H[20 * is + 15])
                      + (rxBits[16] * Golay_20_8.m_H[20 * is + 16])
                      + (rxBits[17] * Golay_20_8.m_H[20 * is + 17])
                      + (rxBits[18] * Golay_20_8.m_H[20 * is + 18])
                      + (rxBits[19] * Golay_20_8.m_H[20 * is + 19])) % 2) << (11 - is);
    if (syndromeI > 0) {
        let i = 0;
        for (; i < 3; i++)
            if (this.m_corr[3 * syndromeI + i] === 0xff)
                break;
        else
        rxBits[this.m_corr[3 * syndromeI + i]] ^= 1;
        if (i === 0)
            return false;
    }
    return true;
}


function Golay_23_12()
{
    this.m_corr = new Uint8Array(6144);
    this.init();
}

Golay_23_12.m_G = new Uint8Array([
                                     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0,
                                     0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1,
                                     0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0,
                                     0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0,
                                     0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1,
                                     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                                     0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0,
                                     0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1,
                                 ]);
Golay_23_12.m_H = new Uint8Array([
                                     1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                     1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                     0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                                     0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                                     0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
                                     1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                                     1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                                     1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                                     0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                                     1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                                     0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                                 ]);

Golay_23_12.prototype.init = function()
{
    this.m_corr.fill(0xff);
    let syndromeI, syndromeIP, syndromeIP1, syndromeIP2, syndromeIP3;
    let i1, i2, i3, ir, ip, ip1, ip2, ip3;
    for (i1 = 0; i1 < 12; i1++) {
        for (i2 = i1 + 1; i2 < 12; i2++) {
            for (i3 = i2 + 1; i3 < 12; i3++) {
                syndromeI = 0;
                for (ir = 0; ir < 11; ir++)
                    syndromeI += ((Golay_23_12.m_H[23 * ir + i1] +  Golay_23_12.m_H[23 * ir + i2] +  Golay_23_12.m_H[23 * ir + i3]) % 2) << (10 - ir);
                this.m_corr[3 * syndromeI] = i1;
                this.m_corr[3 * syndromeI + 1] = i2;
                this.m_corr[3 * syndromeI + 2] = i3;
            }
            let syndromeI = 0;
            for (ir = 0; ir < 11; ir++)
                syndromeI += ((Golay_23_12.m_H[23 * ir + i1] +  Golay_23_12.m_H[23 * ir + i2]) % 2) << (10 - ir);
            this.m_corr[3 * syndromeI] = i1;
            this.m_corr[3 * syndromeI + 1] = i2;
            for (ip = 0; ip < 11; ip++) {
                syndromeIP = syndromeI ^ (1 << (10 - ip));
                this.m_corr[3 * syndromeIP] = i1;
                this.m_corr[3 * syndromeIP + 1] = i2;
                this.m_corr[3 * syndromeIP + 2] = 12 + ip;
            }
        }
        syndromeI = 0;
        for (ir = 0; ir < 11; ir++)
            syndromeI += Golay_23_12.m_H[23 * ir + i1] << (10 - ir);
        this.m_corr[3 * syndromeI] = i1;
        for (ip1 = 0; ip1 < 11; ip1++) {
            syndromeIP1 = syndromeI ^ (1 << (10 - ip1));
            this.m_corr[3 * syndromeIP1] = i1;
            this.m_corr[3 * syndromeIP1 + 1] = 12 + ip1;
            for (ip2 = ip1 + 1; ip2 < 11; ip2++) {
                syndromeIP2 = syndromeIP1 ^ (1 << (10 - ip2));
                this.m_corr[3 * syndromeIP2] = i1;
                this.m_corr[3 * syndromeIP2 + 1] = 12 + ip1;
                this.m_corr[3 * syndromeIP2 + 2] = 12 + ip2;
            }
        }
    }
    for (ip1 = 0; ip1 < 11; ip1++) {
        syndromeIP1 = (1 << (10 - ip1));
        this.m_corr[3 * syndromeIP1] = 12 + ip1;
        for (ip2 = ip1 + 1; ip2 < 11; ip2++) {
            syndromeIP2 = syndromeIP1 ^ (1 << (10 - ip2));
            this.m_corr[3 * syndromeIP2] = 12 + ip1;
            this.m_corr[3 * syndromeIP2 + 1] = 12 + ip2;
            for (ip3 = ip2 + 1; ip3 < 11; ip3++) {
                syndromeIP3 = syndromeIP2 ^ (1 << (10 - ip3));
                this.m_corr[3 * syndromeIP3] = 12 + ip1;
                this.m_corr[3 * syndromeIP3 + 1] = 12 + ip2;
                this.m_corr[3 * syndromeIP3 + 2] = 12 + ip3;
            }
        }
    }
}

Golay_23_12.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 12; i++)
        for (j = 0; j < 23; j++)
            encodedBits[j] += origBits[i] * Golay_23_12.m_G[23 * i + j];
    for (i = 0; i < 23; i++)
        encodedBits[i] %= 2;
}

Golay_23_12.prototype.decode = function(rxBits)
{
    let syndromeI = 0;
    for (let is = 0; is < 11; is++)
        syndromeI +=(((rxBits[0] *  Golay_23_12.m_H[23 * is + 0])
                      + (rxBits[1] *  Golay_23_12.m_H[23 * is + 1])
                      + (rxBits[2] *  Golay_23_12.m_H[23 * is + 2])
                      + (rxBits[3] *  Golay_23_12.m_H[23 * is + 3])
                      + (rxBits[4] *  Golay_23_12.m_H[23 * is + 4])
                      + (rxBits[5] *  Golay_23_12.m_H[23 * is + 5])
                      + (rxBits[6] *  Golay_23_12.m_H[23 * is + 6])
                      + (rxBits[7] *  Golay_23_12.m_H[23 * is + 7])
                      + (rxBits[8] *  Golay_23_12.m_H[23 * is + 8])
                      + (rxBits[9] *  Golay_23_12.m_H[23 * is + 9])
                      + (rxBits[10] * Golay_23_12.m_H[23 * is + 10])
                      + (rxBits[11] * Golay_23_12.m_H[23 * is + 11])
                      + (rxBits[12] * Golay_23_12.m_H[23 * is + 12])
                      + (rxBits[13] * Golay_23_12.m_H[23 * is + 13])
                      + (rxBits[14] * Golay_23_12.m_H[23 * is + 14])
                      + (rxBits[15] * Golay_23_12.m_H[23 * is + 15])
                      + (rxBits[16] * Golay_23_12.m_H[23 * is + 16])
                      + (rxBits[17] * Golay_23_12.m_H[23 * is + 17])
                      + (rxBits[18] * Golay_23_12.m_H[23 * is + 18])
                      + (rxBits[19] * Golay_23_12.m_H[23 * is + 19])
                      + (rxBits[20] * Golay_23_12.m_H[23 * is + 20])
                      + (rxBits[21] * Golay_23_12.m_H[23 * is + 21])
                      + (rxBits[22] * Golay_23_12.m_H[23 * is + 22])) % 2) << (10 - is);
    if (syndromeI > 0) {
        let i = 0;
        for (; i < 3; i++)
            if (this.m_corr[3 * syndromeI + i] === 0xff)
                break;
        else
        rxBits[this.m_corr[3 * syndromeI + i]] ^= 1;
        if (i === 0)
            return false;
    }
    return true;
}


function Golay_24_12()
{
    this.m_corr = new Uint8Array(12288);
    this.init();
}

Golay_24_12.m_G = new Uint8Array([
                                     1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1,
                                     0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1,
                                     0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0,
                                     0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0,
                                     0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0,
                                     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
                                     0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
                                     0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0,
                                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1,
                                 ]);
Golay_24_12.m_H = new Uint8Array([
                                     1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                     1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                     0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                     0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                                     0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                                     1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
                                     1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                                     1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                                     0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                                     1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                                     0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                                     1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                                 ]);

Golay_24_12.prototype.init = function()
{
    this.m_corr.fill(0xff);
    let syndromeI, syndromeIP, syndromeIP1, syndromeIP2, syndromeIP3;
    let i1, i2, i3, ir, ip, ip1, ip2, ip3;
    for (i1 = 0; i1 < 12; i1++) {
        for (i2 = i1 + 1; i2 < 12; i2++) {
            for (i3 = i2 + 1; i3 < 12; i3++) {
                syndromeI = 0;
                for (ir = 0; ir < 12; ir++)
                    syndromeI += ((Golay_24_12.m_H[24 * ir + i1] +  Golay_24_12.m_H[24 * ir + i2] +  Golay_24_12.m_H[24 * ir + i3]) % 2) << (11 - ir);
                this.m_corr[3 * syndromeI] = i1;
                this.m_corr[3 * syndromeI + 1] = i2;
                this.m_corr[3 * syndromeI + 2] = i3;
            }
            syndromeI = 0;
            for (ir = 0; ir < 12; ir++)
                syndromeI += ((Golay_24_12.m_H[24 * ir + i1] +  Golay_24_12.m_H[24 * ir + i2]) % 2) << (11 - ir);
            this.m_corr[3 * syndromeI] = i1;
            this.m_corr[3 * syndromeI + 11] = i2;
            for (ip = 0; ip < 12; ip++) {
                let syndromeIP = syndromeI ^ (1 << (11 - ip));
                this.m_corr[3 * syndromeIP] = i1;
                this.m_corr[3 * syndromeIP + 1] = i2;
                this.m_corr[3 * syndromeIP + 2] = 12 + ip;
            }
        }
        syndromeI = 0;
        for (ir = 0; ir < 12; ir++)
            syndromeI += Golay_24_12.m_H[24 * ir + i1] << (11 - ir);
        this.m_corr[3 * syndromeI] = i1;
        for (ip1 = 0; ip1 < 12; ip1++) {
            syndromeIP1 = syndromeI ^ (1 << (11 - ip1));
            this.m_corr[3 * syndromeIP1] = i1;
            this.m_corr[3 * syndromeIP1 + 1] = 12 + ip1;
            for (ip2 = ip1 + 1; ip2 < 12; ip2++) {
                syndromeIP2 = syndromeIP1 ^ (1 << (11 - ip2));
                this.m_corr[3 * syndromeIP2] = i1;
                this.m_corr[3 * syndromeIP2 + 1] = 12 + ip1;
                this.m_corr[3 * syndromeIP2 + 2] = 12 + ip2;
            }
        }
    }
    for (ip1 = 0; ip1 < 12; ip1++) {
        syndromeIP1 =  (1 << (11 - ip1));
        this.m_corr[3 * syndromeIP1] = 12 + ip1;
        for (ip2 = ip1 + 1; ip2 < 12; ip2++) {
            syndromeIP2 = syndromeIP1 ^ (1 << (11 - ip2));
            this.m_corr[3 * syndromeIP2] = 12 + ip1;
            this.m_corr[3 * syndromeIP2 + 1] = 12 + ip2;
            for (ip3 = ip2 + 1; ip3 < 12; ip3++) {
                syndromeIP3 = syndromeIP2 ^ (1 << (11 - ip3));
                this.m_corr[3 * syndromeIP3] = 12 + ip1;
                this.m_corr[3 * syndromeIP3 + 1] = 12 + ip2;
                this.m_corr[3 * syndromeIP3 + 2] = 12 + ip3;
            }
        }
    }
}

Golay_24_12.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 12; i++)
        for (j = 0; j < 24; j++)
            encodedBits[j] += origBits[i] * Golay_24_12.m_G[24 * i + j];
    for (i = 0; i < 24; i++)
        encodedBits[i] %= 2;
}

Golay_24_12.prototype.decode = function(rxBits)
{
    let syndromeI = 0;
    for (let is = 0; is < 12; is++)
        syndromeI +=(((rxBits[0] *  Golay_24_12.m_H[24 * is + 0])
                      + (rxBits[1] *  Golay_24_12.m_H[24 * is + 1])
                      + (rxBits[2] *  Golay_24_12.m_H[24 * is + 2])
                      + (rxBits[3] *  Golay_24_12.m_H[24 * is + 3])
                      + (rxBits[4] *  Golay_24_12.m_H[24 * is + 4])
                      + (rxBits[5] *  Golay_24_12.m_H[24 * is + 5])
                      + (rxBits[6] *  Golay_24_12.m_H[24 * is + 6])
                      + (rxBits[7] *  Golay_24_12.m_H[24 * is + 7])
                      + (rxBits[8] *  Golay_24_12.m_H[24 * is + 8])
                      + (rxBits[9] *  Golay_24_12.m_H[24 * is + 9])
                      + (rxBits[10] * Golay_24_12.m_H[24 * is + 10])
                      + (rxBits[11] * Golay_24_12.m_H[24 * is + 11])
                      + (rxBits[12] * Golay_24_12.m_H[24 * is + 12])
                      + (rxBits[13] * Golay_24_12.m_H[24 * is + 13])
                      + (rxBits[14] * Golay_24_12.m_H[24 * is + 14])
                      + (rxBits[15] * Golay_24_12.m_H[24 * is + 15])
                      + (rxBits[16] * Golay_24_12.m_H[24 * is + 16])
                      + (rxBits[17] * Golay_24_12.m_H[24 * is + 17])
                      + (rxBits[18] * Golay_24_12.m_H[24 * is + 18])
                      + (rxBits[19] * Golay_24_12.m_H[24 * is + 19])
                      + (rxBits[20] * Golay_24_12.m_H[24 * is + 20])
                      + (rxBits[21] * Golay_24_12.m_H[24 * is + 21])
                      + (rxBits[22] * Golay_24_12.m_H[24 * is + 22])
                      + (rxBits[23] * Golay_24_12.m_H[24 * is + 23])) % 2) << (11 - is);
    if (syndromeI > 0) {
        let i = 0;
        for (; i < 3; i++)
            if (this.m_corr[3 * syndromeI + i] === 0xff)
                break;
        else
        rxBits[this.m_corr[3 * syndromeI + i]] ^= 1;
        if (i === 0)
            return false;
    }
    return true;
}


function QR_16_7_6()
{
    this.m_corr = new Uint8Array(1024);
    this.init();
}

QR_16_7_6.m_G = new Uint8Array([
                                   1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1,
                                   0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0,
                                   0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
                                   0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0,
                                   0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1,
                                   0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1,
                                   0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1,
                               ]);
QR_16_7_6.m_H = new Uint8Array([
                                   0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
                                   1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
                                   0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                                   0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                                   1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                                   1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                                   1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                                   1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                               ]);

QR_16_7_6.prototype.init = function()
{
    this.m_corr.fill(0xff);
    let syndromeI, syndromeIP, syndromeIP1, syndromeIP2;
    let i1, i2, i3, ir, ip, ip1, ip2;
    for (i1 = 0; i1 < 7; i1++) {
        for (i2 = i1 + 1; i2 < 7; i2++) {
            syndromeI = 0;
            for (ir = 0; ir < 9; ir++)
                syndromeI += ((QR_16_7_6.m_H[16 * ir + i1] +  QR_16_7_6.m_H[16 * ir + i2]) % 2) << (8 - ir);
            this.m_corr[2 * syndromeI] = i1;
            this.m_corr[2 * syndromeI + 1] = i2;
        }
        syndromeI = 0;
        for (ir = 0; ir < 9; ir++)
            syndromeI += QR_16_7_6.m_H[16 * ir + i1] << (8 - ir);
        this.m_corr[2 * syndromeI] = i1;
        for (ip = 0; ip < 9; ip++) {
            syndromeIP = syndromeI ^ (1 << (8 - ip));
            this.m_corr[2 * syndromeIP] = i1;
            this.m_corr[2 * syndromeIP + 1] = 7 + ip;
        }
    }
    for (ip1 = 0; ip1 < 9; ip1++) {
        syndromeIP1 = (1 << (8 - ip1));
        this.m_corr[2 * syndromeIP1] = 7 + ip1;
        for (ip2 = ip1 + 1; ip2 < 9; ip2++) {
            syndromeIP2 = syndromeIP1 ^ (1 << (8 - ip2));
            this.m_corr[2 * syndromeIP2] = 7 + ip1;
            this.m_corr[2 * syndromeIP2 + 1] = 7 + ip2;
        }
    }
}

QR_16_7_6.prototype.encode = function(origBits, encodedBits)
{
    encodedBits.fill(0);
    let i, j;
    for (i = 0; i < 7; i++)
        for (j = 0; j < 16; j++)
            encodedBits[j] += origBits[i] * QR_16_7_6.m_G[16 * i + j];
    for (i = 0; i < 16; i++)
        encodedBits[i] %= 2;
}

QR_16_7_6.prototype.decode = function(rxBits)
{
    let syndromeI = 0;
    for (let is = 0; is < 9; is++)
        syndromeI +=(((rxBits[0] *  QR_16_7_6.m_H[16 * is + 0])
                      + (rxBits[1] *  QR_16_7_6.m_H[16 * is + 1])
                      + (rxBits[2] *  QR_16_7_6.m_H[16 * is + 2])
                      + (rxBits[3] *  QR_16_7_6.m_H[16 * is + 3])
                      + (rxBits[4] *  QR_16_7_6.m_H[16 * is + 4])
                      + (rxBits[5] *  QR_16_7_6.m_H[16 * is + 5])
                      + (rxBits[6] *  QR_16_7_6.m_H[16 * is + 6])
                      + (rxBits[7] *  QR_16_7_6.m_H[16 * is + 7])
                      + (rxBits[8] *  QR_16_7_6.m_H[16 * is + 8])
                      + (rxBits[9] *  QR_16_7_6.m_H[16 * is + 9])
                      + (rxBits[10] * QR_16_7_6.m_H[16 * is + 10])
                      + (rxBits[11] * QR_16_7_6.m_H[16 * is + 11])
                      + (rxBits[12] * QR_16_7_6.m_H[16 * is + 12])
                      + (rxBits[13] * QR_16_7_6.m_H[16 * is + 13])
                      + (rxBits[14] * QR_16_7_6.m_H[16 * is + 14])
                      + (rxBits[15] * QR_16_7_6.m_H[16 * is + 15])) % 2) << (8 - is);
    if (syndromeI > 0) {
        let i = 0;
        for (; i < 2; i++)
            if (this.m_corr[2 * syndromeI + i] === 0xff)
                break;
        else
        rxBits[this.m_corr[2 * syndromeI + i]] ^= 1;
        if (i === 0)
            return false;
    }
    return true;
}


const DMR_TYPES_COUNT = 12;
const DMR_SLOT_TYPE_PARITY_LEN = 12;
const DMR_TS_LEN = 288;
const DMR_CACH_LEN = 24;
const DMR_SYNC_LEN = 48;
const DMR_EMB_PART_LEN = 8;
const DMR_ES_LEN = 32;
const DMR_SLOT_TYPE_PART_LEN = 10;
const DMR_VOCODER_FRAME_LEN = 72;
const DMR_VOX_PART_LEN = 108;
const DMR_DATA_PART_LEN = 98;
const DMR_VOX_SUPERFRAME_LEN = 6;
const DMR_BP_KEYS_COUNT = 255;
const SingleLC_FirstCSBK = 0;
const FirstLC = 1;
const LastLC_CSBK = 2;
const ContLC_CSBK = 3;

function DMRAddresses()
{
    this.m_group = false;
    this.m_target = 0;
    this.m_source = 0;
}


function DSDDMR(dsdDecoder)
{
    this.m_dsdDecoder = dsdDecoder;
    this.m_symbolIndex = 0;
    this.m_cachSymbolIndex = 0;
    this.m_burstType = DSDDMR.DSDDMRBurstNone;
    this.m_slot = DSDDMR.DSDDMRSlotUndefined;
    this.m_continuation = false;
    this.m_cachOK = false;
    this.m_lcss = SingleLC_FirstCSBK;
    this.m_colorCode = 0;
    this.m_dataType = DSDDMR.DSDDMRDataUnknown;
    this.m_slotTypePDU_dibits = new Uint8Array(10);
    this.m_cachBits = new Uint8Array(24);
    this.m_emb_dibits = new Uint8Array(8);
    this.m_voiceEmbSig_dibits = new Uint8Array(16);
    this.m_voice1EmbSigRawBits = new Uint8Array(128);
    this.m_slot1Addresses = new DMRAddresses();
    this.m_voice2EmbSigRawBits = new Uint8Array(128);
    this.m_slot2Addresses = new DMRAddresses();
    this.m_syncDibits = new Uint8Array(24);
    this.m_mbeDVFrame = new Uint8Array(9);
    this.m_hamming_7_4 = new Hamming_7_4();
    this.m_golay_20_8 = new Golay_20_8();
    this.m_qr_16_7_6 = new QR_16_7_6();
    this.m_hamming_16_11_4 = new Hamming_16_11_4();
    this.m_voice1EmbSig_dibitsIndex = 0;
    this.m_voice1EmbSig_OK = false;
    this.m_voice2EmbSig_dibitsIndex = 0;
    this.m_voice2EmbSig_OK = false;
    this.m_voice1FrameCount = DMR_VOX_SUPERFRAME_LEN;
    this.m_voice2FrameCount = DMR_VOX_SUPERFRAME_LEN;
    this.m_slotText = this.m_dsdDecoder.m_state.slot0light;
    this.n = 0;
}

DSDDMR.DSDDMRBurstNone = 0;
DSDDMR.DSDDMRBaseStation = 1;
DSDDMR.DSDDMRMobileStation = 2;
DSDDMR.DSDDMRMobileStationRC = 3;
DSDDMR.DSDDMRDirectSlot1 = 4;
DSDDMR.DSDDMRDirectSlot2 = 5;
DSDDMR.DSDDMRSlot1 = 0;
DSDDMR.DSDDMRSlot2 = 1;
DSDDMR.DSDDMRSlotUndefined = 2;
DSDDMR.DSDDMRDataPIHeader = 0;
DSDDMR.DSDDMRDataVoiceLCHeader = 1;
DSDDMR.DSDDMRDataTerminatorWithLC = 2;
DSDDMR.DSDDMRDataCSBK = 3;
DSDDMR.DSDDMRDataMBCHeader = 4;
DSDDMR.DSDDMRDataMBCContinuation = 5;
DSDDMR.DSDDMRDataDataHeader = 6;
DSDDMR.DSDDMRDataRate_1_2_Data = 7;
DSDDMR.DSDDMRDataRate_3_4_Data = 8;
DSDDMR.DSDDMRDataIdle = 9;
DSDDMR.DSDDMRDataRate_1 = 10;
DSDDMR.DSDDMRDataUnifiedSingleBlock = 11;
DSDDMR.DSDDMRDataReserved = 12;
DSDDMR.DSDDMRDataUnknown = 13;

DSDDMR.m_cachInterleave = new Int32Array([0, 7, 8, 9, 1, 10, 11, 12, 2, 13, 14, 15, 3, 16, 4, 17, 18, 19, 5, 20, 21, 22, 6, 23]);
DSDDMR.m_embSigInterleave = new Int32Array([
                                               0,  16,  32,  48,  64,  80,  96, 112,
                                               1,  17,  33,  49,  65,  81,  97, 113,
                                               2,  18,  34,  50,  66,  82,  98, 114,
                                               3,  19,  35,  51,  67,  83,  99, 115,
                                               4,  20,  36,  52,  68,  84, 100, 116,
                                               5,  21,  37,  53,  69,  85, 101, 117,
                                               6,  22,  38,  54,  70,  86, 102, 118,
                                               7,  23,  39,  55,  71,  87, 103, 119,
                                               8,  24,  40,  56,  72,  88, 104, 120,
                                               9,  25,  41,  57,  73,  89, 105, 121,
                                               10,  26,  42,  58,  74,  90, 106, 122,
                                               11,  27,  43,  59,  75,  91, 107, 123,
                                               12,  28,  44,  60,  76,  92, 108, 124,
                                               13,  29,  45,  61,  77,  93, 109, 125,
                                               14,  30,  46,  62,  78,  94, 110, 126,
                                               15,  31,  47,  63,  79,  95, 111, 127,
                                           ]);
DSDDMR.m_slotTypeText = ["PIH", "VLC", "TLC", "CSB", "MBH", "MBC", "DAH", "D12", "D34", "IDL", "D01", "USB"];
DSDDMR.rW = new Int32Array([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2]);
DSDDMR.rX = new Int32Array([23, 10, 22, 9, 21, 8, 20, 7, 19, 6, 18, 5, 17, 4, 16, 3, 15, 2, 14, 1, 13, 0, 12, 10, 11, 9, 10, 8, 9, 7, 8, 6, 7, 5, 6, 4]);
DSDDMR.rY = new Int32Array([0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3]);
DSDDMR.rZ = new Int32Array([5, 3, 4, 2, 3, 1, 2, 0, 1, 13, 0, 12, 22, 11, 21, 10, 20, 9, 19, 8, 18, 7, 17, 6, 16, 5, 15, 4, 14, 3, 13, 2, 12, 1, 11, 0]);
DSDDMR.BasicPrivacyKeys = new Uint16Array([
                                              0x1F00, 0xE300, 0xFC00, 0x2503, 0x3A03, 0xC603, 0xD903, 0x4A05, 0x5505, 0xA905,
                                              0xB605, 0x6F06, 0x7006, 0x8C06, 0x9306, 0x2618, 0x3918, 0xC518, 0xDA18, 0x031B,
                                              0x1C1B, 0xE01B, 0xFF1B, 0x6C1D, 0x731D, 0x8F1D, 0x901D, 0x491E, 0x561E, 0xAA1E,
                                              0xB51E, 0x4B28, 0x5428, 0xA828, 0xB728, 0x6E2B, 0x712B, 0x8D2B, 0x922B, 0x012D,
                                              0x1E2D, 0xE22D, 0xFD2D, 0x242E, 0x3B2E, 0xC72E, 0xD82E, 0x6D30, 0x7230, 0x8E30,
                                              0x9130, 0x4833, 0x5733, 0xAB33, 0xB433, 0x2735, 0x3835, 0xC435, 0xDB35, 0x0236,
                                              0x1D36, 0xE136, 0xFE36, 0x2B49, 0x3449, 0xC849, 0xD749, 0x0E4A, 0x114A, 0xED4A,
                                              0xF24A, 0x614C, 0xAE4C, 0x824C, 0x9D4C, 0x444F, 0x5B4F, 0xA74F, 0xB84F, 0x0D51,
                                              0x1251, 0xEE51, 0xF151, 0x2852, 0x3752, 0xCB52, 0xD452, 0x4754, 0x5854, 0xA454,
                                              0xBB54, 0x6257, 0x7D57, 0x8157, 0x9E57, 0x6061, 0x7F61, 0x8361, 0x9C61, 0x4562,
                                              0x5A62, 0xA662, 0xB962, 0x2A64, 0x3564, 0xC964, 0xD664, 0x0F67, 0x1067, 0xEC67,
                                              0xF367, 0x4679, 0x5979, 0xA579, 0xBA79, 0x637A, 0x7C7A, 0x807A, 0x9F7A, 0x0C7C,
                                              0x137C, 0xEF7C, 0xF07C, 0x297F, 0x367F, 0xCA7F, 0xD57F, 0x4D89, 0x5289, 0xAE89,
                                              0xB189, 0x688A, 0x778A, 0x8B8A, 0x948A, 0x078C, 0x188C, 0xE48C, 0xFB8C, 0x228F,
                                              0x3D8F, 0xC18F, 0xDE8F, 0x6B91, 0x7491, 0x8891, 0x9791, 0x4E92, 0x5192, 0xAD92,
                                              0xB292, 0x2194, 0x3E94, 0xC294, 0xDD94, 0x0497, 0x1B97, 0xE797, 0xF897, 0x06A1,
                                              0x19A1, 0xE5A1, 0xFAA1, 0x23A2, 0x3CA2, 0xC0A2, 0xDFA2, 0x4CA4, 0x53A4, 0xAFA4,
                                              0xB0A4, 0x69A7, 0x76A7, 0x8AA7, 0x95A7, 0x20B9, 0x3FB9, 0xC3B9, 0xDCB9, 0x05BA,
                                              0x1ABA, 0xE6BA, 0xF9BA, 0x6ABC, 0x75BC, 0x89BC, 0x96BC, 0x4FBF, 0x50BF, 0xACBF,
                                              0xB3BF, 0x66C0, 0x79C0, 0x85C0, 0x9AC0, 0x43C3, 0x5CC3, 0xA0C3, 0xBFC3, 0x2CC5,
                                              0x33C5, 0xCFC5, 0x0DC0, 0x09C6, 0x16C6, 0xEAC6, 0xF5C6, 0x84D0, 0x85DF, 0x8AD3,
                                              0x8BDC, 0xB6D5, 0xB7DA, 0xB8D6, 0xB9D9, 0x0DDA, 0xD1D5, 0xDED9, 0xDFD6, 0xE2DF,
                                              0xE3D0, 0xECDC, 0xEDD3, 0x2DE8, 0x32E8, 0xCEE8, 0xD1E8, 0x08EB, 0x17EB, 0xEBEB,
                                              0xF4EB, 0x67ED, 0x78ED, 0x84ED, 0x9BED, 0x42EE, 0x5DEE, 0xA1EE, 0xBEEE, 0x0BF0,
                                              0x14F0, 0xE8F0, 0xF7F0, 0x2EF3, 0x31F3, 0xCDF3, 0xD2F3, 0x41F5, 0x5EF5, 0xA2F5,
                                              0xBDF5, 0x64F6, 0x7BF6, 0x87F6, 0x98F6
                                          ]);

DSDDMR.prototype.IN_DIBITS = function(x)
{
    return (x / 2) | 0;
}

DSDDMR.prototype.IN_BYTES = function(x)
{
    return (x / 8) | 0;
}

DSDDMR.prototype.initData = function()
{
    this.m_burstType = DSDDMR.DSDDMRBaseStation;
    this.processDataFirstHalf(91);
}

DSDDMR.prototype.initDataMS = function()
{
    this.m_burstType = DSDDMR.DSDDMRMobileStation;
    this.processDataFirstHalfMS();
}

DSDDMR.prototype.initVoice = function()
{
    this.m_burstType = DSDDMR.DSDDMRBaseStation;
    this.processVoiceFirstHalf(91);
}

DSDDMR.prototype.initVoiceMS = function()
{
    this.m_burstType = DSDDMR.DSDDMRMobileStation;
    this.processVoiceFirstHalfMS();
}

DSDDMR.prototype.processData = function()
{
    if (!this.m_cachOK && this.m_burstType === DSDDMR.DSDDMRBaseStation) {
        this.m_slotText = this.m_dsdDecoder.m_state.slot0light;
        this.m_dsdDecoder.m_state.slot0light = "/-- UNK";
        this.m_dsdDecoder.resetFrameSync();
        return;
    }
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    this.processDataDibit(dibit);
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        if (this.m_slot === DSDDMR.DSDDMRSlot1) {
            if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRsyncOrSkip;
                    this.m_continuation = false;
                }
            } else {
                if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.resetFrameSync();
                    this.m_continuation = false;
                }
            }
        } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
            if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRsyncOrSkip;
                    this.m_continuation = false;
                }
            } else {
                if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.resetFrameSync();
                    this.m_continuation = false;
                }
            }
        }
        this.m_symbolIndex = 0;
    }
    else
        this.m_symbolIndex++;
    this.m_cachSymbolIndex++;
}

DSDDMR.prototype.processDataMS = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    this.processDataDibit(dibit);
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        this.m_dsdDecoder.resetFrameSync();
        this.m_symbolIndex = 0;
    } else
        this.m_symbolIndex++;
}

DSDDMR.prototype.processVoice = function()
{
    if (!this.m_cachOK && this.m_burstType === DSDDMR.DSDDMRBaseStation) {
        this.m_slotText = this.m_dsdDecoder.m_state.slot0light;
        this.m_dsdDecoder.m_state.slot0light = "/-- UNK";
        this.m_voice1FrameCount = DMR_VOX_SUPERFRAME_LEN;
        this.m_voice2FrameCount = DMR_VOX_SUPERFRAME_LEN;
        this.m_dsdDecoder.resetFrameSync();
        return;
    }
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    this.processVoiceDibit(dibit);
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        if (this.m_slot === DSDDMR.DSDDMRSlot1) {
            this.m_voice1FrameCount++;
            if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRsyncOrSkip;
                    this.m_continuation = false;
                }
            } else {
                this.m_dsdDecoder.m_voice1On = false;
                if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.resetFrameSync();
                    this.m_continuation = false;
                }
            }
        } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
            this.m_voice2FrameCount++;
            if (this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRsyncOrSkip;
                    this.m_continuation = false;
                }
            } else {
                this.m_dsdDecoder.m_voice2On = false;
                if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                    this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
                    this.m_continuation = true;
                } else {
                    this.m_dsdDecoder.resetFrameSync();
                    this.m_continuation = false;
                }
            }
        }
        this.m_symbolIndex = 0;
    } else
        this.m_symbolIndex++;
    this.m_cachSymbolIndex++;
}

DSDDMR.prototype.processVoiceMS = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    this.processVoiceDibit(dibit);
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        this.m_voice1FrameCount++;
        if (this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
            this.m_dsdDecoder.m_dsdSymbol.setNoSignal(true);
            this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRSkipMS;
        } else {
            this.m_dsdDecoder.m_voice1On = false;
            this.m_dsdDecoder.resetFrameSync();
        }
        this.m_symbolIndex = 0;
    } else
        this.m_symbolIndex++;
}

DSDDMR.prototype.processSyncOrSkip = function()
{
    let sync_db_size = this.IN_DIBITS(DMR_SYNC_LEN);
    let patterns = [DSDSync.SyncDMRDataBS, DSDSync.SyncDMRVoiceBS];
    if (this.m_symbolIndex > sync_db_size) {
        let syncEngine = new DSDSync();
        syncEngine.matchSome(this.m_dsdDecoder.m_dsdSymbol.getSyncDibitBack(sync_db_size), sync_db_size, patterns, 2);
        if (syncEngine.isMatching(DSDSync.SyncDMRDataBS)) {
            this.processDataFirstHalf(90);
            this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRdata;
            return;
        } else if (syncEngine.isMatching(DSDSync.SyncDMRVoiceBS)) {
            this.processVoiceFirstHalf(90);
            this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
            return;
        }
    }
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        this.m_slot = (this.m_slot + 1) % 2;
        this.m_continuation = true;
        this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
        this.m_symbolIndex = 0;
    } else
        this.m_symbolIndex++;
    this.m_cachSymbolIndex++;
}

DSDDMR.prototype.processSkipMS = function()
{
    if (this.m_symbolIndex === this.IN_DIBITS(DMR_TS_LEN) - 1) {
        this.m_dsdDecoder.m_dsdSymbol.setNoSignal(false);
        this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDMRvoiceMS;
        this.m_symbolIndex = 0;
    } else
        this.m_symbolIndex++;
}

DSDDMR.prototype.processDataFirstHalf = function(shiftBack)
{
    let dibit_p = this.m_dsdDecoder.m_dsdSymbol.getDibitBack(shiftBack);
    for (this.m_symbolIndex = 0; this.m_symbolIndex < 90; this.m_symbolIndex++, this.m_cachSymbolIndex++)
        this.processDataDibit(dibit_p[this.m_symbolIndex]);
}

DSDDMR.prototype.processDataFirstHalfMS = function()
{
    let dibit_p = this.m_dsdDecoder.m_dsdSymbol.getDibitBack(79);
    for (this.m_symbolIndex = 12; this.m_symbolIndex < 90; this.m_symbolIndex++, this.m_cachSymbolIndex++)
        this.processDataDibit(dibit_p[this.m_symbolIndex]);
}

DSDDMR.prototype.processVoiceFirstHalf = function(shiftBack)
{
    let dibit_p = this.m_dsdDecoder.m_dsdSymbol.getDibitBack(shiftBack);
    for (this.m_symbolIndex = 0; this.m_symbolIndex < 90; this.m_symbolIndex++, this.m_cachSymbolIndex++)
        this.processVoiceDibit(dibit_p[this.m_symbolIndex]);
    if (this.m_slot === DSDDMR.DSDDMRSlot1) {
        this.m_voice1FrameCount = 0;
        this.m_dsdDecoder.m_voice1On = true;
        this.m_voice1EmbSig_dibitsIndex = 0;
        this.m_voice1EmbSig_OK = true;
    } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
        this.m_voice2FrameCount = 0;
        this.m_dsdDecoder.m_voice2On = true;
        this.m_voice2EmbSig_dibitsIndex = 0;
        this.m_voice2EmbSig_OK = true;
    } else {
        this.m_voice1FrameCount = DMR_VOX_SUPERFRAME_LEN;
        this.m_voice2FrameCount = DMR_VOX_SUPERFRAME_LEN;
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.m_voice2On = false;
        this.m_voice1EmbSig_OK = false;
        this.m_voice2EmbSig_OK = false;
    }
}

DSDDMR.prototype.processVoiceFirstHalfMS = function()
{
    let dibit_p = this.m_dsdDecoder.m_dsdSymbol.getDibitBack(79);
    for (this.m_symbolIndex = 12; this.m_symbolIndex < 90; this.m_symbolIndex++, this.m_cachSymbolIndex++)
        this.processVoiceDibit(dibit_p[this.m_symbolIndex]);
    this.m_slot = DSDDMR.DSDDMRSlot1;
    let str = this.m_dsdDecoder.m_state.slot0light;
    this.m_dsdDecoder.m_state.slot0light = str.substring(0, 4) + "VOX" + str.substring(7);
    this.m_voice1FrameCount = 0;
    this.m_dsdDecoder.m_voice1On = true;
    this.m_voice1EmbSig_dibitsIndex = 0;
    this.m_voice1EmbSig_OK = true;
}

DSDDMR.prototype.processDataDibit = function(dibit)
{
    let nextPartOff = this.IN_DIBITS(DMR_CACH_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        if (this.m_burstType === DSDDMR.DSDDMRBaseStation) {
            this.m_cachBits[DSDDMR.m_cachInterleave[2 * this.m_symbolIndex]] = (dibit >> 1) & 1;
            this.m_cachBits[DSDDMR.m_cachInterleave[2 * this.m_symbolIndex + 1]] = dibit & 1;
            if(this.m_symbolIndex === nextPartOff - 1)
                this.decodeCACH(this.m_cachBits);
        }
        return;
    }
    nextPartOff += this.IN_DIBITS(DMR_DATA_PART_LEN);
    if (this.m_symbolIndex < nextPartOff)
        return;
    nextPartOff += this.IN_DIBITS(DMR_SLOT_TYPE_PART_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        this.m_slotTypePDU_dibits[this.m_symbolIndex - this.IN_DIBITS(DMR_CACH_LEN + DMR_DATA_PART_LEN)] = dibit;
        return;
    }
    nextPartOff += this.IN_DIBITS(DMR_SYNC_LEN);
    if (this.m_symbolIndex < nextPartOff)
        return;
    nextPartOff += this.IN_DIBITS(DMR_SLOT_TYPE_PART_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        let slotTypePDUOff = this.IN_DIBITS(DMR_SLOT_TYPE_PART_LEN) + this.m_symbolIndex - this.IN_DIBITS(DMR_CACH_LEN + DMR_DATA_PART_LEN + DMR_SLOT_TYPE_PART_LEN + DMR_SYNC_LEN);
        this.m_slotTypePDU_dibits[slotTypePDUOff] = dibit;
        if (this.m_symbolIndex === nextPartOff - 1)
            this.processSlotTypePDU();
        return;
    }
    nextPartOff += this.IN_DIBITS(DMR_DATA_PART_LEN);
    if (this.m_symbolIndex < nextPartOff)
        return;
}

DSDDMR.prototype.processVoiceDibit = function(dibit)
{
    let nextPartOff = this.IN_DIBITS(DMR_CACH_LEN);
    let CurOff = 0;
    if (this.m_symbolIndex < nextPartOff) {
        if (this.m_burstType === DSDDMR.DSDDMRBaseStation) {
            this.m_cachBits[DSDDMR.m_cachInterleave[2 * this.m_symbolIndex]] = (dibit >> 1) & 1;
            this.m_cachBits[DSDDMR.m_cachInterleave[2 * this.m_symbolIndex + 1]] = dibit & 1;
            if(this.m_symbolIndex === nextPartOff - 1) {
                this.decodeCACH(this.m_cachBits);
                if (this.m_cachOK) {
                    if (this.m_slot === DSDDMR.DSDDMRSlot1) {
                        let str = this.m_dsdDecoder.m_state.slot0light;
                        this.m_dsdDecoder.m_state.slot0light = str.substring(0, 4) + "VOX" + str.substring(7);
                    } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
                        let str = this.m_dsdDecoder.m_state.slot1light;
                        this.m_dsdDecoder.m_state.slot1light = str.substring(0, 4) + "VOX" + str.substring(7);
                    }
                }
            }
        }
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_VOCODER_FRAME_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        let mbeIndex = this.m_symbolIndex - this.IN_DIBITS(DMR_CACH_LEN);
        if (mbeIndex === 0) {
            this.n = 0;
            if (this.m_slot === DSDDMR.DSDDMRSlot1)
                this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, this.IN_BYTES(DMR_VOCODER_FRAME_LEN));
            else
                this.m_dsdDecoder.m_mbeDVFrame2.fill(0);
        }
        this.BasicPrivacyXOR(dibit, mbeIndex);
        dibit = global1;
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rW[this.n] + DSDDMR.rX[this.n]] = (1 & (dibit >> 1));
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rY[this.n] + DSDDMR.rZ[this.n]] = (1 & dibit);
        this.n++;
        if (this.m_slot === DSDDMR.DSDDMRSlot1)
            this.storeSymbolDV(this.m_dsdDecoder.m_mbeDVFrame1, mbeIndex, dibit);
        else
            this.storeSymbolDV(this.m_dsdDecoder.m_mbeDVFrame2, mbeIndex, dibit);
        if (mbeIndex === this.IN_DIBITS(DMR_VOCODER_FRAME_LEN) - 1) {
            if (this.m_slot === DSDDMR.DSDDMRSlot1) {
                this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVReady1 = true;
            } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
                this.m_dsdDecoder.m_mbeDecoder2.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVReady2 = true;
            }
        }
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_VOCODER_FRAME_LEN / 2);
    if (this.m_symbolIndex < nextPartOff) {
        let mbeIndex = this.m_symbolIndex - CurOff;
        if (mbeIndex === 0) {
            this.n = 0;
            this.m_mbeDVFrame.fill(0);
        }
        this.BasicPrivacyXOR(dibit, mbeIndex);
        dibit = global1;
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rW[this.n] + DSDDMR.rX[this.n]] = (1 & (dibit >> 1));
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rY[this.n] + DSDDMR.rZ[this.n]] = (1 & dibit);
        this.n++;
        this.storeSymbolDV(this.m_mbeDVFrame, mbeIndex, dibit);
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_EMB_PART_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        this.m_emb_dibits[this.m_symbolIndex - CurOff] = dibit;
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_ES_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        this.m_voiceEmbSig_dibits[this.m_symbolIndex - CurOff] = dibit;
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_EMB_PART_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        this.m_emb_dibits[this.m_symbolIndex + this.IN_DIBITS(DMR_EMB_PART_LEN) - CurOff] = dibit;
        if (this.m_symbolIndex === nextPartOff - 1) {
            if (this.m_slot === DSDDMR.DSDDMRSlot1 && this.m_voice1FrameCount > 0 && this.m_voice1FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.processEMB())
                    if (this.processVoiceEmbeddedSignalling(this.m_voice1EmbSig_dibitsIndex, this.m_voice1EmbSigRawBits, this.m_voice1EmbSig_OK, this.m_slot1Addresses)) {
                        this.m_voice1EmbSig_dibitsIndex = global1;
                        this.m_voice1EmbSig_OK = global2;
                        DSDDMR.textVoiceEmbeddedSignalling(this.m_slot1Addresses, this.m_dsdDecoder.m_state.slot0light);
                        this.m_dsdDecoder.m_state.slot0light = global1;
                    } else {
                        this.m_voice1EmbSig_dibitsIndex = global1;
                        this.m_voice1EmbSig_OK = global2;
                    }
            } else if (this.m_slot === DSDDMR.DSDDMRSlot2 && this.m_voice2FrameCount > 0 && this.m_voice2FrameCount < DMR_VOX_SUPERFRAME_LEN) {
                if (this.processEMB())
                    if (this.processVoiceEmbeddedSignalling(this.m_voice2EmbSig_dibitsIndex, this.m_voice2EmbSigRawBits, this.m_voice2EmbSig_OK, this.m_slot2Addresses)) {
                        this.m_voice2EmbSig_dibitsIndex = global1;
                        this.m_voice2EmbSig_OK = global2;
                        DSDDMR.textVoiceEmbeddedSignalling(this.m_slot2Addresses, this.m_dsdDecoder.m_state.slot1light);
                        this.m_dsdDecoder.m_state.slot1light = global1;
                    } else {
                        this.m_voice2EmbSig_dibitsIndex = global1;
                        this.m_voice2EmbSig_OK = global2;
                    }
            }
        }
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_VOCODER_FRAME_LEN / 2);
    if (this.m_symbolIndex < nextPartOff) {
        let mbeIndex = this.m_symbolIndex - (CurOff - this.IN_DIBITS(DMR_VOCODER_FRAME_LEN / 2));
        this.BasicPrivacyXOR(dibit, mbeIndex);
        dibit = global1;
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rW[this.n] + DSDDMR.rX[this.n]] = (1 & (dibit >> 1));
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rY[this.n] + DSDDMR.rZ[this.n]] = (1 & dibit);
        this.n++;
        this.storeSymbolDV(this.m_mbeDVFrame, mbeIndex, dibit);
        if (mbeIndex === this.IN_DIBITS(DMR_VOCODER_FRAME_LEN) - 1) {
            if (this.m_slot === DSDDMR.DSDDMRSlot1) {
                this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVFrame1.set(this.m_mbeDVFrame);
                this.m_dsdDecoder.m_mbeDVReady1 = true;
            } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
                this.m_dsdDecoder.m_mbeDecoder2.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVFrame2.set(this.m_mbeDVFrame);
                this.m_dsdDecoder.m_mbeDVReady2 = true;
            }
        }
        return;
    }
    CurOff = nextPartOff;
    nextPartOff += this.IN_DIBITS(DMR_VOCODER_FRAME_LEN);
    if (this.m_symbolIndex < nextPartOff) {
        let mbeIndex = this.m_symbolIndex - CurOff;
        this.BasicPrivacyXOR(dibit, mbeIndex);
        dibit = global1;
        if (mbeIndex === 0) {
            this.n = 0;
            if (this.m_slot === DSDDMR.DSDDMRSlot1)
                this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, this.IN_BYTES(DMR_VOCODER_FRAME_LEN));
            else
                this.m_dsdDecoder.m_mbeDVFrame2.fill(0);
        }
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rW[this.n] + DSDDMR.rX[this.n]] = (1 & (dibit >> 1));
        this.m_dsdDecoder.ambe_fr[24 * DSDDMR.rY[this.n] + DSDDMR.rZ[this.n]] = (1 & dibit);
        this.n++;
        if (this.m_slot === DSDDMR.DSDDMRSlot1)
            this.storeSymbolDV(this.m_dsdDecoder.m_mbeDVFrame1, mbeIndex, dibit);
        else
            this.storeSymbolDV(this.m_dsdDecoder.m_mbeDVFrame2, mbeIndex, dibit);
        if (mbeIndex === this.IN_DIBITS(DMR_VOCODER_FRAME_LEN) - 1) {
            if (this.m_slot === DSDDMR.DSDDMRSlot1) {
                this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVReady1 = true;
            } else if (this.m_slot === DSDDMR.DSDDMRSlot2) {
                this.m_dsdDecoder.m_mbeDecoder2.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
                this.m_dsdDecoder.m_mbeDVReady2 = true;
            }
        }
        return;
    }
}

DSDDMR.prototype.processSlotTypePDU = function()
{
    let slotTypeBits = new Uint8Array(DMR_SLOT_TYPE_PART_LEN * 2);
    for (let i = 0; i < DMR_SLOT_TYPE_PART_LEN; i++) {
        slotTypeBits[2 * i] = (this.m_slotTypePDU_dibits[i] >> 1) & 1;
        slotTypeBits[2 * i + 1] = this.m_slotTypePDU_dibits[i] & 1;
    }
    if (this.m_golay_20_8.decode(slotTypeBits)) {
        this.m_colorCode = (slotTypeBits[0] << 3) + (slotTypeBits[1] << 2) + (slotTypeBits[2] << 1) + slotTypeBits[3];
        let dataType = (slotTypeBits[4] << 3) + (slotTypeBits[5] << 2) + (slotTypeBits[6] << 1) + slotTypeBits[7];
        if (dataType > DMR_TYPES_COUNT) {
            this.m_dataType = DSDDMR.DSDDMRDataReserved;
            this.m_slotText = this.m_slotText.substring(0, 3) + "RES" + this.m_slotText.substring(7);
        } else {
            this.m_dataType = dataType;
            this.m_slotText = this.m_slotText.substring(0, 3) + DSDDMR.m_slotTypeText[dataType] + this.m_slotText.substring(7);
        }
    } else
        this.m_slotText = this.m_slotText.substring(0, 1) + "-- UNK" + this.m_slotText.substring(7);
}

DSDDMR.prototype.processEMB = function()
{
    let embBits = new Uint8Array(DMR_EMB_PART_LEN * 2);
    for (let i = 0; i < DMR_EMB_PART_LEN; i++) {
        embBits[2 * i] = (this.m_emb_dibits[i] >> 1) & 1;
        embBits[2 * i + 1] = this.m_emb_dibits[i] & 1;
    }
    if (this.m_qr_16_7_6.decode(embBits)) {
        this.m_colorCode = (embBits[0] << 3) + (embBits[1] << 2) + (embBits[2] << 1) + embBits[3];
        let str = String(this.m_colorCode).padStart(2) + " ";
        this.m_slotText = this.m_slotText.substring(0, 1) + str + this.m_slotText.substring(4);
        this.m_lcss = (embBits[5] << 1) + embBits[6];
        return true;
    } else
        return false;
}

DSDDMR.prototype.processVoiceEmbeddedSignalling = function(voiceEmbSig_dibitsIndex, voiceEmbSigRawBits, voiceEmbSig_OK, addresses)
{
    global1 = voiceEmbSig_dibitsIndex;
    global2 = voiceEmbSig_OK;
    if (this.m_lcss !== SingleLC_FirstCSBK) {
        let parityCheck = 0;
        let bit1Index;
        let bit0Index;
        for (let i = 0; i < this.IN_DIBITS(DMR_ES_LEN); i++) {
            if (global1 > 63)
                break;
            bit1Index = DSDDMR.m_embSigInterleave[2 * global1];
            bit0Index = DSDDMR.m_embSigInterleave[2 * global1 + 1];
            if (i % 4 === 0)
                parityCheck = 0;
            voiceEmbSigRawBits[bit1Index] = (1 & (this.m_voiceEmbSig_dibits[i] >> 1));
            voiceEmbSigRawBits[bit0Index] = (1 & this.m_voiceEmbSig_dibits[i]);
            parityCheck ^= voiceEmbSigRawBits[bit1Index];
            parityCheck ^= voiceEmbSigRawBits[bit0Index];
            if (i % 4 === 3)
                if (parityCheck !== 0) {
                    global2 = false;
                    break;
                }
            global1++;
        }
        if (global1 === 64) {
            if (this.m_hamming_16_11_4.decode(voiceEmbSigRawBits, 0, 7)) {
                let flco =(voiceEmbSigRawBits[2] << 5)
                    + (voiceEmbSigRawBits[3] << 4)
                    + (voiceEmbSigRawBits[4] << 3)
                    + (voiceEmbSigRawBits[5] << 2)
                    + (voiceEmbSigRawBits[6] << 1)
                    + (voiceEmbSigRawBits[7]);
                addresses.m_group = (flco === 0);
                addresses.m_target =  (voiceEmbSigRawBits[16 * 2 + 2] << 23)
                        + (voiceEmbSigRawBits[16 * 2 + 3] << 22)
                        + (voiceEmbSigRawBits[16 * 2 + 4] << 21)
                        + (voiceEmbSigRawBits[16 * 2 + 5] << 20)
                        + (voiceEmbSigRawBits[16 * 2 + 6] << 19)
                        + (voiceEmbSigRawBits[16 * 2 + 7] << 18)
                        + (voiceEmbSigRawBits[16 * 2 + 8] << 17)
                        + (voiceEmbSigRawBits[16 * 2 + 9] << 16)
                        + (voiceEmbSigRawBits[16 * 3 + 0] << 15)
                        + (voiceEmbSigRawBits[16 * 3 + 1] << 14)
                        + (voiceEmbSigRawBits[16 * 3 + 2] << 13)
                        + (voiceEmbSigRawBits[16 * 3 + 3] << 12)
                        + (voiceEmbSigRawBits[16 * 3 + 4] << 11)
                        + (voiceEmbSigRawBits[16 * 3 + 5] << 10)
                        + (voiceEmbSigRawBits[16 * 3 + 6] << 9)
                        + (voiceEmbSigRawBits[16 * 3 + 7] << 8)
                        + (voiceEmbSigRawBits[16 * 3 + 8] << 7)
                        + (voiceEmbSigRawBits[16 * 3 + 9] << 6)
                        + (voiceEmbSigRawBits[16 * 4 + 0] << 5)
                        + (voiceEmbSigRawBits[16 * 4 + 1] << 4)
                        + (voiceEmbSigRawBits[16 * 4 + 2] << 3)
                        + (voiceEmbSigRawBits[16 * 4 + 3] << 2)
                        + (voiceEmbSigRawBits[16 * 4 + 4] << 1)
                        + (voiceEmbSigRawBits[16 * 4 + 5]);
                addresses.m_source =  (voiceEmbSigRawBits[16 * 4 + 6] << 23)
                        + (voiceEmbSigRawBits[16 * 4 + 7] << 22)
                        + (voiceEmbSigRawBits[16 * 4 + 8] << 21)
                        + (voiceEmbSigRawBits[16 * 4 + 9] << 20)
                        + (voiceEmbSigRawBits[16 * 5 + 0] << 19)
                        + (voiceEmbSigRawBits[16 * 5 + 1] << 18)
                        + (voiceEmbSigRawBits[16 * 5 + 2] << 17)
                        + (voiceEmbSigRawBits[16 * 5 + 3] << 16)
                        + (voiceEmbSigRawBits[16 * 5 + 4] << 15)
                        + (voiceEmbSigRawBits[16 * 5 + 5] << 14)
                        + (voiceEmbSigRawBits[16 * 5 + 6] << 13)
                        + (voiceEmbSigRawBits[16 * 5 + 7] << 12)
                        + (voiceEmbSigRawBits[16 * 5 + 8] << 11)
                        + (voiceEmbSigRawBits[16 * 5 + 9] << 10)
                        + (voiceEmbSigRawBits[16 * 6 + 0] << 9)
                        + (voiceEmbSigRawBits[16 * 6 + 1] << 8)
                        + (voiceEmbSigRawBits[16 * 6 + 2] << 7)
                        + (voiceEmbSigRawBits[16 * 6 + 3] << 6)
                        + (voiceEmbSigRawBits[16 * 6 + 4] << 5)
                        + (voiceEmbSigRawBits[16 * 6 + 5] << 4)
                        + (voiceEmbSigRawBits[16 * 6 + 6] << 3)
                        + (voiceEmbSigRawBits[16 * 6 + 7] << 2)
                        + (voiceEmbSigRawBits[16 * 6 + 8] << 1)
                        + (voiceEmbSigRawBits[16 * 6 + 9]);
                return true;
            } else
                global2 = false;
        }
    }
    return false;
}

DSDDMR.prototype.decodeCACH = function(cachBits)
{
    this.m_cachOK = true;
    if (this.m_continuation) {
        this.m_slot = (this.m_slot + 1) % 2;
        this.m_continuation = false;
        this.m_cachSymbolIndex = 0;
    } else {
        if (this.m_hamming_7_4.decode(cachBits)) {
            let slotIndex = cachBits[1] & 1;
            this.m_dsdDecoder.m_state.currentslot = slotIndex;
            if (slotIndex) {
                this.m_slotText = this.m_dsdDecoder.m_state.slot1light;
                let str = this.m_dsdDecoder.m_state.slot0light;
                this.m_dsdDecoder.m_state.slot0light = ((cachBits[0] & 1) ? '*' : '.') + str.substring(1);
            } else {
                this.m_slotText = this.m_dsdDecoder.m_state.slot0light;
                let str = this.m_dsdDecoder.m_state.slot1light;
                this.m_dsdDecoder.m_state.slot1light = ((cachBits[0] & 1) ? '*' : '.') + str.substring(1);
            }
            this.m_slot = slotIndex;
            this.m_lcss = 2 * cachBits[2] + cachBits[3];
            this.m_cachSymbolIndex = 0;
        } else {
            this.m_slot = DSDDMR.DSDDMRSlotUndefined;
            this.m_cachOK = false;
        }
    }
}

DSDDMR.prototype.storeSymbolDV = function(mbeFrame, dibitindex, dibit, invertDibit = false)
{
    if (this.m_dsdDecoder.m_mbelibEnable)
        return;
    if (invertDibit)
        dibit = DSDSymbol.invert_dibit(dibit);
    mbeFrame[(dibitindex / 4) | 0] |= (dibit << (6 - 2 * (dibitindex % 4)));
}

DSDDMR.textVoiceEmbeddedSignalling = function(addresses, slotText)
{
    global1 =  slotText.substring(0, 8)
            + String(addresses.m_source).padStart(8)
            + ">"
            + (addresses.m_group ? "G" : "U")
            + String(addresses.m_target).padStart(8)
            + slotText.substring(26);
}

DSDDMR.prototype.BasicPrivacyXOR = function(dibit, index)
{
    global1 = dibit;
    if (this.m_dsdDecoder.m_opts.dmr_bp_key === 0)
        return;
    let key_number = this.m_dsdDecoder.m_opts.dmr_bp_key - 1;
    let key = DSDDMR.BasicPrivacyKeys[key_number];
    let key_bits = 16;
    if (index < 24) {
        let off = key_bits - ((index % 8) + 1) * 2;
        let out = global1 ^ ((key >> off) & 3);
        global1 = out;
    } else if (index === 24) {
        let msb = (global1 >> 1) ^ (key >> 15);
        global1 = (msb << 1) + (global1 & 1);
    }
}

DSDDMR.prototype.getSlot0Text = function()
{
    return this.m_dsdDecoder.m_state.slot0light;
}

DSDDMR.prototype.getSlot1Text = function()
{
    return this.m_dsdDecoder.m_state.slot1light;
}

DSDDMR.prototype.getColorCode = function()
{
    return this.m_dsdDecoder.m_state.ccnum;
}


function Viterbi(k, n, polys, msbFirst = true)
{
    this.m_k = k;
    this.m_n = n;
    this.m_polys = polys;
    this.m_msbFirst = msbFirst;
    this.m_nbSymbolsMax = 0;
    this.m_nbBitsMax = 0;
    this.m_branchCodes = new Uint8Array(1 << this.m_k);
    this.m_predA = new Uint8Array(1 << (this.m_k - 1));
    this.m_predB = new Uint8Array(1 << (this.m_k - 1));
    this.m_pathMetrics = null;
    this.m_traceback = null;
    this.m_symbols = null;
    this.initCodes();
    this.initTreillis();
}

Viterbi.m_maxMetric = 0xfffe0000;
Viterbi.Poly23 = new Uint32Array([0x7, 0x6]);
Viterbi.Poly23a = new Uint32Array([0x7, 0x5]);
Viterbi.Poly24 = new Uint32Array([0xf, 0xb]);
Viterbi.Poly25 = new Uint32Array([0x17, 0x19]);
Viterbi.Poly25a = new Uint32Array([0x13, 0x1b]);
Viterbi.Poly25y = new Uint32Array([0x13, 0x1d]);
Viterbi.Partab = new Uint8Array([
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    0, 1, 1, 0, 1, 0, 0, 1,
                                    1, 0, 0, 1, 0, 1, 1, 0,
                                ]);
Viterbi.NbOnes = new Uint8Array([
                                    0, 1, 1, 2, 1, 2, 2, 3,
                                    1, 2, 2, 3, 2, 3, 3, 4,
                                    1, 2, 2, 3, 2, 3, 3, 4,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    1, 2, 2, 3, 2, 3, 3, 4,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    1, 2, 2, 3, 2, 3, 3, 4,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    4, 5, 5, 6, 5, 6, 6, 7,
                                    1, 2, 2, 3, 2, 3, 3, 4,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    4, 5, 5, 6, 5, 6, 6, 7,
                                    2, 3, 3, 4, 3, 4, 4, 5,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    4, 5, 5, 6, 5, 6, 6, 7,
                                    3, 4, 4, 5, 4, 5, 5, 6,
                                    4, 5, 5, 6, 5, 6, 6, 7,
                                    4, 5, 5, 6, 5, 6, 6, 7,
                                    5, 6, 6, 7, 6, 7, 7, 8,
                                ]);

Viterbi.prototype.encodeToSymbols = function(symbols, dataBits, nbBits, startstate)
{
    let encstate = startstate;
    let j;
    for (let i = 0; i < nbBits; i++) {
        encstate = (encstate >> 1) | (dataBits[i] << (this.m_k - 1));
        symbols[i] = 0;
        for (j = 0; j < this.m_n; j++)
            symbols[i] += Viterbi.parity(encstate & this.m_polys[j]) << (this.m_msbFirst ? (this.m_n - 1) - j : j);
    }
}

Viterbi.prototype.encodeToBits = function(codedBits, dataBits, nbBits, startstate)
{
    let encstate = startstate;
    let j;
    for (let i = 0; i < nbBits; i++) {
        encstate = (encstate >> 1) | (dataBits[i] << (this.m_k - 1));
        for (j = 0; j < this.m_n; j++)
            codedBits[i] = Viterbi.parity(encstate & this.m_polys[j]);
    }
}

Viterbi.prototype.decodeFromSymbols = function(dataBits, symbols, nbSymbols, startstate)
{
    if (nbSymbols > this.m_nbSymbolsMax) {
        this.m_traceback = new Uint8Array((1 << (this.m_k - 1)) * nbSymbols);
        this.m_pathMetrics = new Uint32Array[(1 << (this.m_k - 1)) * 2];
        this.m_nbSymbolsMax = nbSymbols;
    }
    this.m_pathMetrics.fill(Viterbi.m_maxMetric);
    this.m_pathMetrics[startstate] = 0;
    let minPathIndex;
    let minMetric;
    let is, ib, bit, predA, predPMIxA, codeA, bmA, pmA, predB, predPMIxB, codeB, bmB, pmB, a_b;
    for (is = 0; is < nbSymbols; is++) {
        minMetric = Viterbi.m_maxMetric;
        for (ib = 0; ib < 1 << (this.m_k - 1); ib++) {
            bit = ib < 1 << (this.m_k - 2) ? 0 : 1;
            predA = this.m_predA[ib];
            predPMIxA = (is % 2) * (1 << (this.m_k - 1)) + predA;
            codeA = this.m_branchCodes[(predA << 1) + bit];
            bmA = Viterbi.NbOnes[codeA ^ symbols[is]];
            pmA = this.m_pathMetrics[predPMIxA] + bmA;
            predB = this.m_predB[ib];
            predPMIxB = (is % 2) * (1 << (this.m_k - 1)) + predB;
            codeB = this.m_branchCodes[(predB << 1) + bit];
            bmB = Viterbi.NbOnes[codeB ^ symbols[is]];
            pmB = this.m_pathMetrics[predPMIxB] + bmB;
            if (pmA === pmB) {
                if (bmA === bmB)
                    a_b = true;
                else
                    a_b = bmA < bmB;
            } else
                a_b = pmA < pmB;
            if (a_b) {
                this.m_pathMetrics[ib + ((is + 1) % 2) * (1 << (this.m_k - 1))] = pmA;
                this.m_traceback[ib + is * (1 << (this.m_k - 1))] = predA;
                if (pmA < minMetric) {
                    minMetric = pmA;
                    minPathIndex = ib;
                }
            } else {
                this.m_pathMetrics[ib + ((is + 1) % 2) * (1 << (this.m_k - 1))] = pmB;
                this.m_traceback[ib + is * (1 << (this.m_k - 1))] = predB;
                if (pmB < minMetric) {
                    minMetric = pmB;
                    minPathIndex = ib;
                }
            }
        }
    }
    let bIx = minPathIndex = 0;
    for (is = nbSymbols - 1; is >= 0; is--) {
        dataBits[is] = bIx < 1 << (this.m_k - 2) ? 0 : 1;
        bIx = this.m_traceback[bIx + is * (1 << (this.m_k - 1))];
    }
}

Viterbi.prototype.decodeFromBits = function(dataBits, bits, nbBits, startstate)
{
    if (nbBits > this.m_nbBitsMax) {
        this.m_symbols = new Uint8Array((nbBits / this.m_n) | 0);
        this.m_nbBitsMax = nbBits;
    }
    let j;
    for (let i = 0; i < nbBits; i += this.m_n) {
        this.m_symbols[(i / this.m_n) | 0] = bits[i];
        for (j = this.m_n - 1; j > 0; j--)
            this.m_symbols[(i / this.m_n) | 0] += bits[i + j] << j;
    }
    this.decodeFromSymbols(dataBits, this.m_symbols, (nbBits / this.m_n) | 0, startstate);
}

Viterbi.prototype.initCodes = function()
{
    let symbol = new Uint8Array(1);
    let dataBit = new Uint8Array(1);
    for (let i = 0; i < (1 << (this.m_k - 1)); i++) {
        dataBit[0] = 0;
        this.encodeToSymbols(symbol, dataBit, 1, i << 1);
        this.m_branchCodes[2 * i] = symbol[0];
        dataBit[0] = 1;
        this.encodeToSymbols(symbol, dataBit, 1, i << 1);
        this.m_branchCodes[2 * i + 1] = symbol[0];
    }
}

Viterbi.prototype.initTreillis = function()
{
    for (let s = 0; s < 1 << (this.m_k - 2); s++) {
        this.m_predA[s] = (s << 1);
        this.m_predB[s] = (s << 1) + 1;
        this.m_predA[s + (1 << (this.m_k - 2))] = (s << 1);
        this.m_predB[s + (1 << (this.m_k - 2))] = (s << 1) + 1;
    }
}

Viterbi.prototype.getK = function()
{
    return this.m_k;
}

Viterbi.prototype.getN = function()
{
    return this.m_n;
}

Viterbi.prototype.getBranchCodes = function()
{
    return this.m_branchCodes;
}

Viterbi.prototype.getPredA = function()
{
    return this.m_predA;
}

Viterbi.prototype.getPredB = function()
{
    return this.m_predB;
}

Viterbi.parity = function(x)
{
    x ^= (x >> 16);
    x ^= (x >> 8);
    return Viterbi.Partab[x & 0xff];
}


function Viterbi5(n, polys, msbFirst = true)
{
    Viterbi.call(this, 5, n, polys, msbFirst);
}

Viterbi5.prototype = Object.create(Viterbi.prototype);
Viterbi5.prototype.constructor = Viterbi5;

Viterbi5.prototype.decodeFromSymbols = function(dataBits, symbols, nbSymbols, startstate)
{
    if (nbSymbols > this.m_nbSymbolsMax) {
        this.m_traceback = new Uint8Array(16 * nbSymbols);
        this.m_pathMetrics = new Uint32Array(16);
        this.m_nbSymbolsMax = nbSymbols;
    }
    this.m_pathMetrics.fill(Viterbi.m_maxMetric);
    this.m_pathMetrics[startstate] = 0;
    for (let is = 0; is < nbSymbols; is++)
        Viterbi5.doMetrics(is, this.m_branchCodes, symbols[is],
                           this.m_traceback.subarray(0 *  nbSymbols),
                           this.m_traceback.subarray(1 *  nbSymbols),
                           this.m_traceback.subarray(2 *  nbSymbols),
                           this.m_traceback.subarray(3 *  nbSymbols),
                           this.m_traceback.subarray(4 *  nbSymbols),
                           this.m_traceback.subarray(5 *  nbSymbols),
                           this.m_traceback.subarray(6 *  nbSymbols),
                           this.m_traceback.subarray(7 *  nbSymbols),
                           this.m_traceback.subarray(8 *  nbSymbols),
                           this.m_traceback.subarray(9 *  nbSymbols),
                           this.m_traceback.subarray(10 * nbSymbols),
                           this.m_traceback.subarray(11 * nbSymbols),
                           this.m_traceback.subarray(12 * nbSymbols),
                           this.m_traceback.subarray(13 * nbSymbols),
                           this.m_traceback.subarray(14 * nbSymbols),
                           this.m_traceback.subarray(15 * nbSymbols),
                           this.m_pathMetrics
                           );
    let minPathMetric = this.m_pathMetrics[0];
    let minPathIndex = 0;
    for (let i = 1; i < 16; i++)
        if (this.m_pathMetrics[i] < minPathMetric) {
            minPathMetric = this.m_pathMetrics[i];
            minPathIndex = i;
        }
    Viterbi5.traceBack(nbSymbols, minPathIndex, dataBits,
                       this.m_traceback.subarray(0 *  nbSymbols),
                       this.m_traceback.subarray(1 *  nbSymbols),
                       this.m_traceback.subarray(2 *  nbSymbols),
                       this.m_traceback.subarray(3 *  nbSymbols),
                       this.m_traceback.subarray(4 *  nbSymbols),
                       this.m_traceback.subarray(5 *  nbSymbols),
                       this.m_traceback.subarray(6 *  nbSymbols),
                       this.m_traceback.subarray(7 *  nbSymbols),
                       this.m_traceback.subarray(8 *  nbSymbols),
                       this.m_traceback.subarray(9 *  nbSymbols),
                       this.m_traceback.subarray(10 * nbSymbols),
                       this.m_traceback.subarray(11 * nbSymbols),
                       this.m_traceback.subarray(12 * nbSymbols),
                       this.m_traceback.subarray(13 * nbSymbols),
                       this.m_traceback.subarray(14 * nbSymbols),
                       this.m_traceback.subarray(15 * nbSymbols)
                       );
}

Viterbi5.prototype.decodeFromBits = function(dataBits, bits, nbBits, startstate)
{
    if (nbBits > this.m_nbBitsMax) {
        this.m_symbols = new Uint8Array[(nbBits / this.m_n) | 0];
        this.m_nbBitsMax = nbBits;
    }
    let j;
    for (let i = 0; i < nbBits; i += this.m_n) {
        this.m_symbols[(i / this.m_n) | 0] = bits[i];
        for (j = this.m_n - 1; j > 0; j--)
            this.m_symbols[(i / this.m_n) | 0] += bits[i + j] << j;
    }
    this.decodeFromSymbols(dataBits, this.m_symbols, (nbBits / this.m_n) | 0, startstate);
}

Viterbi5.doMetrics = function(n, branchCodes, symbol,
                              m_pathMemory0,
                              m_pathMemory1,
                              m_pathMemory2,
                              m_pathMemory3,
                              m_pathMemory4,
                              m_pathMemory5,
                              m_pathMemory6,
                              m_pathMemory7,
                              m_pathMemory8,
                              m_pathMemory9,
                              m_pathMemory10,
                              m_pathMemory11,
                              m_pathMemory12,
                              m_pathMemory13,
                              m_pathMemory14,
                              m_pathMemory15,
                              m_pathMetric)
{
    let tempMetric = new Uint32Array(16);
    let metric = new Uint32Array(32);
    let m1;
    let m2;
    metric[0]  = Viterbi.NbOnes[branchCodes[0]  ^ symbol];
    metric[1]  = Viterbi.NbOnes[branchCodes[1]  ^ symbol];
    metric[2]  = Viterbi.NbOnes[branchCodes[2]  ^ symbol];
    metric[3]  = Viterbi.NbOnes[branchCodes[3]  ^ symbol];
    metric[4]  = Viterbi.NbOnes[branchCodes[4]  ^ symbol];
    metric[5]  = Viterbi.NbOnes[branchCodes[5]  ^ symbol];
    metric[6]  = Viterbi.NbOnes[branchCodes[6]  ^ symbol];
    metric[7]  = Viterbi.NbOnes[branchCodes[7]  ^ symbol];
    metric[8]  = Viterbi.NbOnes[branchCodes[8]  ^ symbol];
    metric[9]  = Viterbi.NbOnes[branchCodes[9]  ^ symbol];
    metric[10] = Viterbi.NbOnes[branchCodes[10] ^ symbol];
    metric[11] = Viterbi.NbOnes[branchCodes[11] ^ symbol];
    metric[12] = Viterbi.NbOnes[branchCodes[12] ^ symbol];
    metric[13] = Viterbi.NbOnes[branchCodes[13] ^ symbol];
    metric[14] = Viterbi.NbOnes[branchCodes[14] ^ symbol];
    metric[15] = Viterbi.NbOnes[branchCodes[15] ^ symbol];
    metric[16] = Viterbi.NbOnes[branchCodes[16] ^ symbol];
    metric[17] = Viterbi.NbOnes[branchCodes[17] ^ symbol];
    metric[18] = Viterbi.NbOnes[branchCodes[18] ^ symbol];
    metric[19] = Viterbi.NbOnes[branchCodes[19] ^ symbol];
    metric[20] = Viterbi.NbOnes[branchCodes[20] ^ symbol];
    metric[21] = Viterbi.NbOnes[branchCodes[21] ^ symbol];
    metric[22] = Viterbi.NbOnes[branchCodes[22] ^ symbol];
    metric[23] = Viterbi.NbOnes[branchCodes[23] ^ symbol];
    metric[24] = Viterbi.NbOnes[branchCodes[24] ^ symbol];
    metric[25] = Viterbi.NbOnes[branchCodes[25] ^ symbol];
    metric[26] = Viterbi.NbOnes[branchCodes[26] ^ symbol];
    metric[27] = Viterbi.NbOnes[branchCodes[27] ^ symbol];
    metric[28] = Viterbi.NbOnes[branchCodes[28] ^ symbol];
    metric[29] = Viterbi.NbOnes[branchCodes[29] ^ symbol];
    metric[30] = Viterbi.NbOnes[branchCodes[30] ^ symbol];
    metric[31] = Viterbi.NbOnes[branchCodes[31] ^ symbol];
    m1 = metric[0] + m_pathMetric[0];
    m2 = metric[2] + m_pathMetric[1];
    if (m1 < m2) {
        m_pathMemory0[n] = 0;
        tempMetric[0] = m1;
    } else {
        m_pathMemory0[n] = 1;
        tempMetric[0] = m2;
    }
    m1 = metric[4] + m_pathMetric[2];
    m2 = metric[6] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory1[n] = 2;
        tempMetric[1] = m1;
    } else {
        m_pathMemory1[n] = 3;
        tempMetric[1] = m2;
    }
    m1 = metric[8]  + m_pathMetric[4];
    m2 = metric[10] + m_pathMetric[5];
    if (m1 < m2) {
        m_pathMemory2[n] = 4;
        tempMetric[2] = m1;
    } else {
        m_pathMemory2[n] = 5;
        tempMetric[2] = m2;
    }
    m1 = metric[12] + m_pathMetric[6];
    m2 = metric[14] + m_pathMetric[7];
    if (m1 < m2) {
        m_pathMemory3[n] = 6;
        tempMetric[3] = m1;
    } else {
        m_pathMemory3[n] = 7;
        tempMetric[3] = m2;
    }
    m1 = metric[16] + m_pathMetric[8];
    m2 = metric[18] + m_pathMetric[9];
    if (m1 < m2) {
        m_pathMemory4[n] = 8;
        tempMetric[4] = m1;
    } else {
        m_pathMemory4[n] = 9;
        tempMetric[4] = m2;
    }
    m1 = metric[20] + m_pathMetric[10];
    m2 = metric[22] + m_pathMetric[11];
    if (m1 < m2) {
        m_pathMemory5[n] = 10;
        tempMetric[5] = m1;
    } else {
        m_pathMemory5[n] = 11;
        tempMetric[5] = m2;
    }
    m1 = metric[24] + m_pathMetric[12];
    m2 = metric[26] + m_pathMetric[13];
    if (m1 < m2) {
        m_pathMemory6[n] = 12;
        tempMetric[6] = m1;
    } else {
        m_pathMemory6[n] = 13;
        tempMetric[6] = m2;
    }
    m1 = metric[28] + m_pathMetric[14];
    m2 = metric[30] + m_pathMetric[15];
    if (m1 < m2) {
        m_pathMemory7[n] = 14;
        tempMetric[7] = m1;
    } else {
        m_pathMemory7[n] = 15;
        tempMetric[7] = m2;
    }
    m1 = metric[1] + m_pathMetric[0];
    m2 = metric[3] + m_pathMetric[1];
    if (m1 < m2) {
        m_pathMemory8[n] = 0;
        tempMetric[8] = m1;
    } else {
        m_pathMemory8[n] = 1;
        tempMetric[8] = m2;
    }
    m1 = metric[5] + m_pathMetric[2];
    m2 = metric[7] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory9[n] = 2;
        tempMetric[9] = m1;
    } else {
        m_pathMemory9[n] = 3;
        tempMetric[9] = m2;
    }
    m1 = metric[9]  + m_pathMetric[4];
    m2 = metric[11] + m_pathMetric[5];
    if (m1 < m2) {
        m_pathMemory10[n] = 4;
        tempMetric[10] = m1;
    } else {
        m_pathMemory10[n] = 5;
        tempMetric[10] = m2;
    }
    m1 = metric[13] + m_pathMetric[6];
    m2 = metric[15] + m_pathMetric[7];
    if (m1 < m2) {
        m_pathMemory11[n] = 6
        tempMetric[11] = m1;
    } else {
        m_pathMemory11[n] = 7;
        tempMetric[11] = m2;
    }
    m1 = metric[17] + m_pathMetric[8];
    m2 = metric[19] + m_pathMetric[9];
    if (m1 < m2) {
        m_pathMemory12[n] = 8;
        tempMetric[12] = m1;
    } else {
        m_pathMemory12[n] = 9;
        tempMetric[12] = m2;
    }
    m1 = metric[21] + m_pathMetric[10];
    m2 = metric[23] + m_pathMetric[11];
    if (m1 < m2) {
        m_pathMemory13[n] = 10;
        tempMetric[13] = m1;
    } else {
        m_pathMemory13[n] = 11;
        tempMetric[13] = m2;
    }
    m1 = metric[25] + m_pathMetric[12];
    m2 = metric[27] + m_pathMetric[13];
    if (m1 < m2) {
        m_pathMemory14[n] = 12;
        tempMetric[14] = m1;
    } else {
        m_pathMemory14[n] = 13;
        tempMetric[14] = m2;
    }
    m1 = metric[29] + m_pathMetric[14];
    m2 = metric[31] + m_pathMetric[15];
    if (m1 < m2) {
        m_pathMemory15[n] = 14;
        tempMetric[15] = m1;
    } else {
        m_pathMemory15[n] = 15;
        tempMetric[15] = m2;
    }
    m_pathMetric[0]  = tempMetric[0];
    m_pathMetric[1]  = tempMetric[1];
    m_pathMetric[2]  = tempMetric[2];
    m_pathMetric[3]  = tempMetric[3];
    m_pathMetric[4]  = tempMetric[4];
    m_pathMetric[5]  = tempMetric[5];
    m_pathMetric[6]  = tempMetric[6];
    m_pathMetric[7]  = tempMetric[7];
    m_pathMetric[8]  = tempMetric[8];
    m_pathMetric[9]  = tempMetric[9];
    m_pathMetric[10] = tempMetric[10];
    m_pathMetric[11] = tempMetric[11];
    m_pathMetric[12] = tempMetric[12];
    m_pathMetric[13] = tempMetric[13];
    m_pathMetric[14] = tempMetric[14];
    m_pathMetric[15] = tempMetric[15];
}

Viterbi5.traceBack = function(nbSymbols, startState, out,
                              m_pathMemory0,
                              m_pathMemory1,
                              m_pathMemory2,
                              m_pathMemory3,
                              m_pathMemory4,
                              m_pathMemory5,
                              m_pathMemory6,
                              m_pathMemory7,
                              m_pathMemory8,
                              m_pathMemory9,
                              m_pathMemory10,
                              m_pathMemory11,
                              m_pathMemory12,
                              m_pathMemory13,
                              m_pathMemory14,
                              m_pathMemory15)
{
    let state = startState;
    for (let loop = nbSymbols - 1; loop >= 0; loop--) {
        switch (state) {
        case 0:
            state = m_pathMemory0[loop];
            out[loop] = 0;
            break;
        case 1:
            state = m_pathMemory1[loop];
            out[loop] = 0;
            break;
        case 2:
            state = m_pathMemory2[loop];
            out[loop] = 0;
            break;
        case 3:
            state = m_pathMemory3[loop];
            out[loop] = 0;
            break;
        case 4:
            state = m_pathMemory4[loop];
            out[loop] = 0;
            break;
        case 5:
            state = m_pathMemory5[loop];
            out[loop] = 0;
            break;
        case 6:
            state = m_pathMemory6[loop];
            out[loop] = 0;
            break;
        case 7:
            state = m_pathMemory7[loop];
            out[loop] = 0;
            break;
        case 8:
            state = m_pathMemory8[loop];
            out[loop] = 1;
            break;
        case 9:
            state = m_pathMemory9[loop];
            out[loop] = 1;
            break;
        case 10:
            state = m_pathMemory10[loop];
            out[loop] = 1;
            break;
        case 11:
            state = m_pathMemory11[loop];
            out[loop] = 1;
            break;
        case 12:
            state = m_pathMemory12[loop];
            out[loop] = 1;
            break;
        case 13:
            state = m_pathMemory13[loop];
            out[loop] = 1;
            break;
        case 14:
            state = m_pathMemory14[loop];
            out[loop] = 1;
            break;
        case 15:
            state = m_pathMemory15[loop];
            out[loop] = 1;
            break;
        }
    }
}


function CRC(polynomial, order, crcinit, crcxor, direct = 1, refin = 0, refout = 0)
{
    this.m_order = order;
    this.m_poly = polynomial;
    this.m_direct = direct;
    this.m_crcinit = crcinit;
    this.m_crcxor = crcxor;
    this.m_refin = refin;
    this.m_refout = refout;
    this.m_crcmask = (((1 << (this.m_order - 1)) - 1) << 1) | 1;
    this.m_crchighbit = 1 << (this.m_order - 1);
    this.m_crcinit_direct = 0;
    this.m_crcinit_nondirect = 0;
    this.m_crctab = new Uint32Array(256);
    this.generate_crc_table();
    this.init();
}

CRC.PolyCCITT16 = 0x1021;
CRC.PolyDStar16 = 0x8408;

CRC.prototype.getOrder = function()
{
    return this.m_order;
}

CRC.prototype.getPolynom = function()
{
    return this.m_poly;
}

CRC.prototype.getCRCInit = function()
{
    return this.m_crcinit;
}

CRC.prototype.getCRCXOR = function()
{
    return this.m_crcxor;
}

CRC.prototype.getRefin = function()
{
    return this.m_refin;
}

CRC.prototype.getRefout = function()
{
    return this.m_refout;
}

CRC.prototype.getCRCInitDirect = function()
{
    return this.m_crcinit_direct;
}

CRC.prototype.getCRCInitNonDirect = function()
{
    return this.m_crcinit_nondirect;
}

CRC.prototype.crctable = function(p, len)
{
    let n = 0;
    let crc = this.m_crcinit_nondirect;
    if (this.m_refin)
        crc = this.reflect(crc, this.m_order);
    if (!this.m_refin)
        while (len--)
            crc = ((crc << 8) | p[n++]) ^ this.m_crctab[(crc >> (this.m_order - 8)) & 0xff];
    else
        while (len--)
            crc = ((crc >> 8) | (p[n++] << (this.m_order - 8))) ^ this.m_crctab[crc & 0xff];
    if (!this.m_refin)
        while (++len < (this.m_order / 8) | 0)
            crc = (crc << 8) ^ this.m_crctab[(crc >> (this.m_order - 8)) & 0xff];
    else
        while (++len < (this.m_order / 8) | 0)
            crc = (crc >> 8) ^ this.m_crctab[crc & 0xff];
    if (this.m_refout ^ this.m_refin)
        crc = this.reflect(crc, this.m_order);
    crc ^= this.m_crcxor;
    crc &= this.m_crcmask;
    return crc;
}

CRC.prototype.crctablefast = function(p, len)
{
    let n = 0;
    let crc = this.m_crcinit_direct;
    if (this.m_refin)
        crc = this.reflect(crc, this.m_order);
    if (!this.m_refin)
        while (len--)
            crc = (crc << 8) ^ this.m_crctab[((crc >> (this.m_order - 8)) & 0xff) ^ p[n++]];
    else
        while (len--)
            crc = (crc >> 8) ^ this.m_crctab[(crc & 0xff) ^ p[n++]];
    if (this.m_refout ^ this.m_refin)
        crc = this.reflect(crc, this.m_order);
    crc ^= this.m_crcxor;
    crc &= this.m_crcmask;
    return crc;
}

CRC.prototype.crcbitbybit = function(p, len)
{
    let n = 0;
    let i, j, c, bit;
    let crc = this.m_crcinit_nondirect;
    for (i = 0; i < len; i++) {
        c = p[n++];
        if (this.m_refin)
            c = this.reflect(c, 8);
        for (j = 0x80; j; j >>= 1) {
            bit = crc & this.m_crchighbit;
            crc <<= 1;
            if (c & j)
                crc |= 1;
            if (bit)
                crc ^= this.m_poly;
        }
    }
    for (i = 0; i < this.m_order; i++) {
        bit = crc & this.m_crchighbit;
        crc <<= 1;
        if (bit)
            crc ^= this.m_poly;
    }
    if (this.m_refout)
        crc = this.reflect(crc, this.m_order);
    crc ^= this.m_crcxor;
    crc &= this.m_crcmask;
    return crc;
}

CRC.prototype.crcbitbybitfast = function(p, len)
{
    let n = 0;
    let j, c, bit;
    let crc = this.m_crcinit_direct;
    for (let i = 0; i < len; i++) {
        c = p[n++];
        if (this.m_refin)
            c = this.reflect(c, 8);
        for (j = 0x80; j; j >>= 1) {
            bit = crc & this.m_crchighbit;
            crc <<= 1;
            if (c & j)
                bit ^= this.m_crchighbit;
            if (bit)
                crc ^= this.m_poly;
        }
    }
    if (this.m_refout)
        crc = this.reflect(crc, this.m_order);
    crc ^= this.m_crcxor;
    crc &= this.m_crcmask;
    return crc;
}

CRC.prototype.reflect = function(crc, bitnum)
{
    let j = 1, crcout = 0;
    for (let i = 1 << (bitnum - 1); i; i >>= 1) {
        if (crc & i)
            crcout |= j;
        j <<= 1;
    }
    return crcout;
}

CRC.prototype.generate_crc_table = function()
{
    let bit, crc;
    let j;
    for (let i = 0; i < 256; i++) {
        crc = i;
        if (this.m_refin)
            crc = this.reflect(crc, 8);
        crc <<= this.m_order - 8;
        for (j = 0; j < 8; j++) {
            bit = crc & this.m_crchighbit;
            crc <<= 1;
            if (bit)
                crc ^= this.m_poly;
        }
        if (this.m_refin)
            crc = this.reflect(crc, this.m_order);
        crc &= this.m_crcmask;
        this.m_crctab[i] = crc;
    }
}

CRC.prototype.init = function()
{
    let i;
    let bit, crc;
    if (!this.m_direct) {
        this.m_crcinit_nondirect = this.m_crcinit;
        crc = this.m_crcinit;
        for (i = 0; i < this.m_order; i++) {
            bit = crc & this.m_crchighbit;
            crc <<= 1;
            if (bit)
                crc ^= this.m_poly;
        }
        crc &= this.m_crcmask;
        this.m_crcinit_direct = crc;
    } else {
        this.m_crcinit_direct = this.m_crcinit;
        crc = this.m_crcinit;
        for (i = 0; i < this.m_order; i++) {
            bit = crc & 1;
            if (bit)
                crc ^= this.m_poly;
            crc >>= 1;
            if (bit)
                crc |= this.m_crchighbit;
        }
        this.m_crcinit_nondirect = crc;
    }
}


function DStarCRC()
{
    this.crc = 0;
}

DStarCRC.prototype.check_crc = function(array, size_buffer, crcValue)
{
    if (crcValue) {
        this.compute_crc(array, size_buffer + 2);
        return (crcValue === this.crc)
    } else {
        this.compute_crc(array, size_buffer);
        let crc_decoded = (array[size_buffer - 1] << 8) + array[size_buffer - 2];
        return (crc_decoded === this.crc)
    }
}

DStarCRC.prototype.bitRead = function(value, bit)
{
    return (value >> bit) & 0x01;
}

DStarCRC.prototype.fcsbit = function(tbyte)
{
    this.crc ^= tbyte;
    if (this.crc & 1)
        this.crc = (this.crc >> 1) ^ 0x8408;
    else
        this.crc = this.crc >> 1;
}

DStarCRC.prototype.compute_crc = function(array, size_buffer)
{
    let m;
    this.crc = 0xffff;
    for (let n = 0; n < size_buffer - 2; n++)
        for (m = 0; m < 8; m++)
            this.fcsbit(this.bitRead(array[n], m));
    this.crc ^= 0xffff;
}


function PN_9_5(seed)
{
    this.m_seed = seed;
    this.m_byteTable = new Uint8Array(64);
    this.m_bitTable = new Uint8Array(512);
    this.init();
}

PN_9_5.prototype.getByte = function(byteIndex)
{
    return this.m_byteTable[byteIndex % 64];
}

PN_9_5.prototype.getBit = function(bitIndex)
{
    return this.m_bitTable[bitIndex % 512];
}

PN_9_5.prototype.getBits = function()
{
    return this.m_bitTable;
}

PN_9_5.prototype.init = function()
{
    let byte0;
    let sr = this.m_seed;
    let bit0, bit4;
    for (let i = 0; i < 512; i++) {
        if (i % 8  === 0)
            byte0 = 0;
        bit0 = sr & 1;
        bit4 = (sr & 0x10) >> 4;
        sr >>= 1;
        sr |= (bit4 ^ bit0) << 8;
        this.m_bitTable[i] = bit0;
        byte0 += bit0 << (7 - (i % 8));
        if (i % 8 === 7)
            this.m_byteTable[(i / 8) | 0] = byte0;
    }
}


function FICH()
{
    this.m_reserved = 0;
    this.m_freqDeviation = 0;
    this.m_voipPath = 0;
    this.m_sqlType = 0;
    this.m_frameInfo = new Uint8Array(32);
}

FICH.prototype.setBytes = function(bytes)
{
    this.m_frameInfo.set(bytes.subarray(0, 32));
}

FICH.prototype.getFrameInformation = function()
{
    return ((this.m_frameInfo[0] & 1) << 1) + (this.m_frameInfo[1] & 1);
}

FICH.prototype.getCallMode = function()
{
    return ((this.m_frameInfo[4] & 1) << 1) + (this.m_frameInfo[5] & 1);
}

FICH.prototype.getBlockNumber = function()
{
    return ((this.m_frameInfo[6] & 1) << 1) + (this.m_frameInfo[7] & 1);
}

FICH.prototype.getBlockTotal = function()
{
    return ((this.m_frameInfo[8]&1) << 1) + (this.m_frameInfo[9] & 1);
}

FICH.prototype.getFrameNumber = function()
{
    return ((this.m_frameInfo[10] & 1) << 2) + ((this.m_frameInfo[11] & 1) << 1) + (this.m_frameInfo[12] & 1);
}

FICH.prototype.getFrameTotal = function()
{
    return ((this.m_frameInfo[13] & 1) << 2) + ((this.m_frameInfo[14] & 1) << 1) + (this.m_frameInfo[15] & 1);
}

FICH.prototype.isNarrowMode = function()
{
    return (this.m_frameInfo[17] & 1) === 1;
}

FICH.prototype.getMessageRouting = function()
{
    let mrValue = ((this.m_frameInfo[18] & 1) << 2) + ((this.m_frameInfo[19] & 1) << 1) + (this.m_frameInfo[20] & 1);
    if (mrValue < DSDYSF.MRReserved)
        return mrValue;
    else
        return DSDYSF.MRReserved;
}

FICH.prototype.isInternetPath = function()
{
    return (this.m_frameInfo[21] & 1) === 1;
}

FICH.prototype.getDataType = function(){
    return ((this.m_frameInfo[22] & 1) << 1) + (this.m_frameInfo[23] & 1);
}

FICH.prototype.isSquelchCodeEnabled = function()
{
    return (this.m_frameInfo[24] & 1) === 0;
}

FICH.prototype.getSquelchCode = function()
{
    return ((this.m_frameInfo[25] & 1) << 6) + ((this.m_frameInfo[26] & 1) << 5) + ((this.m_frameInfo[27] & 1) << 4) + ((this.m_frameInfo[28] & 1) << 3) + ((this.m_frameInfo[29] & 1) << 2) + ((this.m_frameInfo[30] & 1) << 1) + (this.m_frameInfo[31] & 1);
}


function DSDYSF(dsdDecoder)
{
    this.m_dsdDecoder = dsdDecoder;
    this.m_symbolIndex = 0;
    this.m_fichError = DSDYSF.FICHNoError;
    this.m_viterbiFICH = new Viterbi5(2, Viterbi.Poly25y, true)
    this.m_crc = new CRC(CRC.PolyCCITT16, 16, 0x0, 0xffff);
    this.m_pn = new PN_9_5(0x1c9);

    this.m_fichRaw = new Uint8Array(100);
    this.m_fichGolay = new Uint8Array(100);
    this.m_fichBits = new Uint8Array(48);
    this.m_dch1Raw = new Uint8Array(180);
    this.m_dch1Bits = new Uint8Array(180);
    this.m_dch2Raw = new Uint8Array(180);
    this.m_dch2Bits = new Uint8Array(180);
    this.m_vd2BitsRaw = new Uint8Array(104);
    this.m_vd2MBEBits = new Uint8Array(72);
    this.m_vfrBitsRaw = new Uint8Array(144);
    this.m_vfrBits = new Uint8Array(88);
    this.m_bitWork = new Uint8Array(48);
    this.m_dest = "";
    this.m_src = "";
    this.m_downlink = "";
    this.m_uplink = "";
    this.m_rem1 = "";
    this.m_rem2 = "";
    this.m_rem3 = "";
    this.m_rem4 = "";
    this.m_destId = "";
    this.m_srcId = "";
    this.m_fich = new FICH();
    this.m_golay_24_12 = new Golay_24_12();
    this.m_vfrStart = false;
    this.n = 0;
}

DSDYSF.FIHeader = 0;
DSDYSF.FICommunication = 1
DSDYSF.FITerminator = 2
DSDYSF.FITest = 3
DSDYSF.CMGroupCQ = 0;
DSDYSF.CMRadioID = 1;
DSDYSF.CMReserved = 2;
DSDYSF.CMIndividual = 3;
DSDYSF.MRDirectWave = 0;
DSDYSF.MRDownlinUplinkkNotBusy = 1;
DSDYSF.MRDownlinkUplinkBusy = 2;
DSDYSF.MRReserved = 3;
DSDYSF.DTVoiceData1 = 0;
DSDYSF.DTDataFullRate = 1;
DSDYSF.DTVoiceData2 = 2;
DSDYSF.DTVoiceFullRate = 3;
DSDYSF.FICHNoError = 0;
DSDYSF.FICHErrorGolay = 1;
DSDYSF.FICHErrorCRC = 2;
DSDYSF.ysfChannelTypeText = ["H", "T", "C", "S"];
DSDYSF.ysfDataTypeText = ["V1", "DF", "V2", "VF"];
DSDYSF.ysfCallModeText = ["GC", "RI", "RS", "IN"];
DSDYSF.rW = new Int32Array([
                               0, 1, 0, 1, 0, 1,
                               0, 1, 0, 1, 0, 1,
                               0, 1, 0, 1, 0, 1,
                               0, 1, 0, 1, 0, 2,
                               0, 2, 0, 2, 0, 2,
                               0, 2, 0, 2, 0, 2
                           ]);
DSDYSF.rX = new Int32Array([
                               23, 10, 22, 9, 21, 8,
                               20, 7, 19, 6, 18, 5,
                               17, 4, 16, 3, 15, 2,
                               14, 1, 13, 0, 12, 10,
                               11, 9, 10, 8, 9, 7,
                               8, 6, 7, 5, 6, 4
                           ]);
DSDYSF.rY = new Int32Array([
                               0, 2, 0, 2, 0, 2,
                               0, 2, 0, 3, 0, 3,
                               1, 3, 1, 3, 1, 3,
                               1, 3, 1, 3, 1, 3,
                               1, 3, 1, 3, 1, 3,
                               1, 3, 1, 3, 1, 3
                           ]);
DSDYSF.rZ = new Int32Array([
                               5, 3, 4, 2, 3, 1,
                               2, 0, 1, 13, 0, 12,
                               22, 11, 21, 10, 20, 9,
                               19, 8, 18, 7, 17, 6,
                               16, 5, 15, 4, 14, 3,
                               13, 2, 12, 1, 11, 0
                           ]);
DSDYSF.m_fichInterleave = new Int32Array([
                                             0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
                                             1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96,
                                             2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87, 92, 97,
                                             3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83, 88, 93, 98,
                                             4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64, 69, 74, 79, 84, 89, 94, 99,
                                         ]);
DSDYSF.m_dchInterleave = new Int32Array([
                                            0,   9,  18,  27,  36,  45,  54,  63,  72,  81,  90,  99, 108, 117, 126, 135, 144, 153, 162, 171,
                                            1,  10,  19,  28,  37,  46,  55,  64,  73,  82,  91, 100, 109, 118, 127, 136, 145, 154, 163, 172,
                                            2,  11,  20,  29,  38,  47,  56,  65,  74,  83,  92, 101, 110, 119, 128, 137, 146, 155, 164, 173,
                                            3,  12,  21,  30,  39,  48,  57,  66,  75,  84,  93, 102, 111, 120, 129, 138, 147, 156, 165, 174,
                                            4,  13,  22,  31,  40,  49,  58,  67,  76,  85,  94, 103, 112, 121, 130, 139, 148, 157, 166, 175,
                                            5,  14,  23,  32,  41,  50,  59,  68,  77,  86,  95, 104, 113, 122, 131, 140, 149, 158, 167, 176,
                                            6,  15,  24,  33,  42,  51,  60,  69,  78,  87,  96, 105, 114, 123, 132, 141, 150, 159, 168, 177,
                                            7,  16,  25,  34,  43,  52,  61,  70,  79,  88,  97, 106, 115, 124, 133, 142, 151, 160, 169, 178,
                                            8,  17,  26,  35,  44,  53,  62,  71,  80,  89,  98, 107, 116, 125, 134, 143, 152, 161, 170, 179
                                        ]);
DSDYSF.m_vd2Interleave = new Int32Array([
                                            0,  26,  52,  78,
                                            1,  27,  53,  79,
                                            2,  28,  54,  80,
                                            3,  29,  55,  81,
                                            4,  30,  56,  82,
                                            5,  31,  57,  83,
                                            6,  32,  58,  84,
                                            7,  33,  59,  85,
                                            8,  34,  60,  86,
                                            9,  35,  61,  87,
                                            10,  36,  62,  88,
                                            11,  37,  63,  89,
                                            12,  38,  64,  90,
                                            13,  39,  65,  91,
                                            14,  40,  66,  92,
                                            15,  41,  67,  93,
                                            16,  42,  68,  94,
                                            17,  43,  69,  95,
                                            18,  44,  70,  96,
                                            19,  45,  71,  97,
                                            20,  46,  72,  98,
                                            21,  47,  73,  99,
                                            22,  48,  74, 100,
                                            23,  49,  75, 101,
                                            24,  50,  76, 102,
                                            25,  51,  77, 103
                                        ]);
DSDYSF.m_vd2DVSIInterleave = new Int32Array([
                                                0, 3, 6,  9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 41, 43, 45, 47,
                                                1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 42, 44, 46, 48,
                                                2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38
                                            ]);
DSDYSF.m_vfrInterleave = new Int32Array([
                                            0,  24,  48,  72,  96, 120,  25,   1,  73,  49, 121,  97,
                                            2,  26,  50,  74,  98, 122,  27,   3,  75,  51, 123,  99,
                                            4,  28,  52,  76, 100, 124,  29,   5,  77,  53, 125, 101,
                                            6,  30,  54,  78, 102, 126,  31,   7,  79,  55, 127, 103,
                                            8,  32,  56,  80, 104, 128,  33,   9,  81,  57, 129, 105,
                                            10,  34,  58,  82, 106, 130,  35,  11,  83,  59, 131, 107,
                                            12,  36,  60,  84, 108, 132,  37,  13,  85,  61, 133, 109,
                                            14,  38,  62,  86, 110, 134,  39,  15,  87,  63, 135, 111,
                                            16,  40,  64,  88, 112, 136,  41,  17,  89,  65, 137, 113,
                                            18,  42,  66,  90, 114, 138,  43,  19,  91,  67, 139, 115,
                                            20,  44,  68,  92, 116, 140,  45,  21,  93,  69, 141, 117,
                                            22,  46,  70,  94, 118, 142,  47,  23,  95,  71, 143, 119
                                        ]);

DSDYSF.prototype.init = function()
{
    this.m_symbolIndex = 0;
}

DSDYSF.prototype.process = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex < 100) {
        this.processFICH(this.m_symbolIndex, dibit);
        if (this.m_symbolIndex === 99) {
            if (this.m_fich.getFrameInformation() === DSDYSF.FICommunication) {
                switch (this.m_fich.getDataType()) {
                case DSDYSF.DTVoiceData1:
                    this.m_dsdDecoder.m_voice1On = true;
                    break;
                case DSDYSF.DTVoiceData2:
                    this.m_dsdDecoder.m_voice1On = true;
                    break;
                case DSDYSF.DTVoiceFullRate:
                    this.m_dsdDecoder.m_voice1On = true;
                    break;
                default:
                    this.m_dsdDecoder.m_voice1On = false;
                    break;
                }
            } else
                this.m_dsdDecoder.m_voice1On = false;
        }
    } else if (this.m_symbolIndex < 460) {
        switch (this.m_fich.getFrameInformation()) {
        case DSDYSF.FIHeader:
        case DSDYSF.FITerminator:
            this.processHeader(this.m_symbolIndex - 100, dibit);
            break;
        case DSDYSF.FICommunication: {
            switch (this.m_fich.getDataType()) {
            case DSDYSF.DTVoiceData1:
                this.m_dsdDecoder.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                this.processVD1(this.m_symbolIndex - 100, dibit);
                break;
            case DSDYSF.DTVoiceData2:
                this.m_dsdDecoder.m_mbeRate = DSDDecoder.DSDMBERate2450;
                this.processVD2(this.m_symbolIndex - 100, dibit);
                break;
            case DSDYSF.DTVoiceFullRate:
                this.m_dsdDecoder.m_mbeRate = DSDDecoder.DSDMBERate4400;
                this.processVFR(this.m_symbolIndex - 100, dibit);
                break;
            default:
                break;
            }
        }
        break;
        default:
            break;
        }
    } else {
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
        return;
    }
    this.m_symbolIndex++;
}

DSDYSF.prototype.processFICH = function(symbolIndex, dibit)
{
    this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex]] = dibit;
    if (symbolIndex === 99) {
        this.m_viterbiFICH.decodeFromSymbols(this.m_fichGolay, this.m_fichRaw, 100, 0);
        let i = 0;
        for (; i < 4; i++) {
            if (this.m_golay_24_12.decode(this.m_fichGolay.subarray(24 * i, 24 * i + 12)))
                this.m_fichBits.set(this.m_fichGolay.subarray(24 * i, 24 * i + 12), 12 * i);
            else {
                this.m_fichError = DSDYSF.FICHErrorGolay;
                break;
            }
        }
        if (i === 4) {
            if (this.checkCRC16(this.m_fichBits, 4)) {
                this.m_fich.setBytes(this.m_fichBits);
                this.m_fichError = DSDYSF.FICHNoError;
            } else
                this.m_fichError = DSDYSF.FICHErrorCRC;
        }
    }
}

DSDYSF.prototype.processHeader = function(symbolIndex, dibit)
{
    if (symbolIndex < 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex]] = dibit;
    else if (symbolIndex < 2 * 36)
        this.m_dch2Raw[DSDYSF.m_dchInterleave[symbolIndex - 36]] = dibit;
    else if (symbolIndex < 3 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 36]] = dibit;
    else if (symbolIndex < 4 * 36)
        this.m_dch2Raw[DSDYSF.m_dchInterleave[symbolIndex - 2 * 36]] = dibit;
    else if (symbolIndex < 5 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 2 * 36]] = dibit;
    else if (symbolIndex < 6 * 36)
        this.m_dch2Raw[DSDYSF.m_dchInterleave[symbolIndex - 3 * 36]] = dibit;
    else if (symbolIndex < 7 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 3 * 36]] = dibit;
    else if (symbolIndex < 8 * 36)
        this.m_dch2Raw[DSDYSF.m_dchInterleave[symbolIndex - 4 * 36]] = dibit;
    else if (symbolIndex < 9 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 4 * 36]] = dibit;
    else if (symbolIndex < 10 * 36)
        this.m_dch2Raw[DSDYSF.m_dchInterleave[symbolIndex - 5 * 36]] = dibit;
    if (symbolIndex === 359) {
        let bytes = new Uint8Array(22);
        this.m_viterbiFICH.decodeFromSymbols(this.m_dch1Bits, this.m_dch1Raw, 180, 0);
        this.m_viterbiFICH.decodeFromSymbols(this.m_dch2Bits, this.m_dch2Raw, 180, 0);
        if (this.checkCRC16(this.m_dch1Bits, 20, bytes))
            this.processCSD1(bytes);
        if (this.checkCRC16(this.m_dch2Bits, 20, bytes))
            this.processCSD2(bytes);
        this.m_vfrStart = this.m_fich.getFrameInformation() === DSDYSF.FIHeader;
    }
}

DSDYSF.prototype.processVD1 = function(symbolIndex, dibit)
{
    if (symbolIndex < 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex]] = dibit;
    else if (symbolIndex < 2 * 36)
        this.processAMBE(symbolIndex - 36, dibit);
    else if (symbolIndex < 3 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 36]] = dibit;
    else if (symbolIndex < 4 * 36)
        this.processAMBE(symbolIndex - 3 * 36, dibit);
    else if (symbolIndex < 5 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 2 * 36]] = dibit;
    else if (symbolIndex < 6 * 36)
        this.processAMBE(symbolIndex - 5 * 36, dibit);
    else if (symbolIndex < 7 * 36)
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 3 * 36]] = dibit;
    else if (symbolIndex < 8 * 36)
        this.processAMBE(symbolIndex - 7 * 36, dibit);
    else if (symbolIndex < 9 * 36) {
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex - 4 * 36]] = dibit;
        if (symbolIndex === 9 * 36 - 1) {
            let bytes = new Uint8Array(22);
            this.m_viterbiFICH.decodeFromSymbols(this.m_dch1Bits, this.m_dch1Raw, 180, 0);
            if (this.checkCRC16(this.m_dch1Bits, 20, bytes))
                switch (this.m_fich.getFrameNumber()) {
                case 0:
                    this.processCSD1(bytes);
                    break;
                case 1:
                    this.processCSD2(bytes);
                    break;
                case 2:
                    this.processCSD3_1(bytes);
                    this.processCSD3_2(bytes.subarray(10));
                    break;
                default:
                    break;
                }
        }
    } else if (symbolIndex < 10 * 36)
        this.processAMBE(symbolIndex - 9 * 36, dibit);
}

DSDYSF.prototype.processVD2 = function(symbolIndex, dibit)
{
    if (symbolIndex < 20)
        this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex]] = dibit;
    else if (symbolIndex < 20 + 52)
        this.processVD2Voice(symbolIndex - 20, dibit);
    else if (symbolIndex < 2 * 20 + 52)
        this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex - 52]] = dibit;
    else if (symbolIndex < 2 * 20 + 2 * 52)
        this.processVD2Voice(symbolIndex - (2 * 20 + 52), dibit);
    else if (symbolIndex < 3 * 20 + 2 * 52)
        this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex - 2 * 52]] = dibit;
    else if (symbolIndex < 3 * 20 + 3 * 52)
        this.processVD2Voice(symbolIndex - (3 * 20 + 2 * 52), dibit);
    else if (symbolIndex < 4 * 20 + 3 * 52)
        this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex - 3*52]] = dibit;
    else if (symbolIndex < 4 * 20 + 4 * 52)
        this.processVD2Voice(symbolIndex - (4 * 20 + 3 * 52), dibit);
    else if (symbolIndex < 5 * 20 + 4 * 52) {
        this.m_fichRaw[DSDYSF.m_fichInterleave[symbolIndex - 4 * 52]] = dibit;
        if (symbolIndex === (5 * 20 + 4 * 52) - 1) {
            let bytes = new Uint8Array(12);
            this.m_viterbiFICH.decodeFromSymbols(this.m_fichGolay, this.m_fichRaw, 100, 0);
            if (this.checkCRC16(this.m_fichGolay, 10, bytes))
                switch (this.m_fich.getFrameNumber()) {
                case 0:
                    this.m_dest = String.fromCharCode.apply(null, [...bytes.subarray(0, 10)]);
                    break;
                case 1:
                    this.m_src = String.fromCharCode.apply(null, [...bytes.subarray(0, 10)]);
                    break;
                case 2:
                    this.m_downlink = String.fromCharCode.apply(null, [...bytes.subarray(0, 10)]);
                    break;
                case 3:
                    this.m_uplink = String.fromCharCode.apply(null, [...bytes.subarray(0, 10)]);
                    break;
                case 4:
                    this.processCSD3_1(bytes);
                    break;
                case 5:
                    this.processCSD3_2(bytes);
                    break;
                default:
                    break;
                }
        }
    } else if (symbolIndex < 5 * 20 + 5 * 52)
        this.processVD2Voice(symbolIndex - (5 * 20 + 4 * 52), dibit);
}

DSDYSF.prototype.processVD2Voice = function(mbeIndex, dibit)
{
    if (mbeIndex === 0) {
        this.n = 0;
        this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, 9);
        this.m_vd2BitsRaw.fill(0);
        this.m_vd2MBEBits.fill(0);
    }
    let msbI = DSDYSF.m_vd2Interleave[2 * mbeIndex];
    let lsbI = DSDYSF.m_vd2Interleave[2 * mbeIndex + 1];
    this.m_vd2BitsRaw[msbI] = ((dibit >> 1) & 1) ^ this.m_pn.getBit(msbI);
    this.m_vd2BitsRaw[lsbI] = (dibit & 1) ^ this.m_pn.getBit(lsbI);
    if (mbeIndex === 51) {
        let nbOnes;
        let mbeIndex;
        let bit;
        for (let i = 0; i < 103; i++) {
            if (i < 81) {
                if (i % 3 === 2) {
                    nbOnes = this.m_vd2BitsRaw[i - 2] + this.m_vd2BitsRaw[i - 1] + this.m_vd2BitsRaw[i];
                    bit = nbOnes > 1 ? 1 : 0;
                    this.m_vd2MBEBits[(i / 3) | 0] = bit;
                    mbeIndex = DSDYSF.m_vd2DVSIInterleave[(i / 3) | 0];
                    this.m_dsdDecoder.m_mbeDVFrame1[(mbeIndex / 8) | 0] += bit << (7 - (mbeIndex % 8));
                }
            } else if (i < 103) {
                this.m_vd2MBEBits[i - 81 + 27] = this.m_vd2BitsRaw[i];
                mbeIndex = DSDYSF.m_vd2DVSIInterleave[i - 81 + 27];
                this.m_dsdDecoder.m_mbeDVFrame1[(mbeIndex / 8) | 0] += (this.m_vd2BitsRaw[i])<<(7 - (mbeIndex % 8));
            }
        }
        this.m_dsdDecoder.m_mbeDecoder1.processData(null, new Int8Array(this.m_vd2MBEBits.buffer));
        this.m_dsdDecoder.m_mbeDVReady1 = true;
    }
}

DSDYSF.prototype.processVFR = function(symbolIndex, dibit)
{
    if (this.m_vfrStart)
        this.processVFRSubHeader(symbolIndex, dibit);
    else
        this.processVFRFullIMBE(symbolIndex, dibit);
}

DSDYSF.prototype.processVFRSubHeader = function(symbolIndex, dibit)
{
    if (symbolIndex < 5*36) {
        this.m_dch1Raw[DSDYSF.m_dchInterleave[symbolIndex]] = dibit;
        if (symbolIndex === 5 * 36 - 1) {
            let bytes = new Uint8Array(22);
            this.m_viterbiFICH.decodeFromSymbols(this.m_dch1Bits, this.m_dch1Raw, 180, 0);
            if (this.checkCRC16(this.m_dch1Bits, 20, bytes)) {
                this.processCSD3_1(bytes);
                this.processCSD3_2(bytes.subarray(10));
            }
        }
    } else if (symbolIndex < 6 * 36)
    {}
    else if (symbolIndex < 6 * 36 + 72)
        this.procesVFRFrame(symbolIndex - 6 * 36, dibit);
    else if (symbolIndex < 6 * 36 + 2 * 72) {
        this.procesVFRFrame(symbolIndex - (6 * 36 + 72), dibit);
        if (symbolIndex === 6 * 36 + 2 * 72 - 1)
            this.m_vfrStart = false;
    }
}

DSDYSF.prototype.processVFRFullIMBE = function(symbolIndex, dibit)
{
    if (symbolIndex < 72)
        this.procesVFRFrame(symbolIndex, dibit);
    else if (symbolIndex < 2 * 72)
        this.procesVFRFrame(symbolIndex - 72, dibit);
    else if (symbolIndex < 3 * 72)
        this.procesVFRFrame(symbolIndex - 2 * 72, dibit);
    else if (symbolIndex < 4 * 72)
        this.procesVFRFrame(symbolIndex - 3 * 72, dibit);
    else if (symbolIndex < 5 * 72)
        this.procesVFRFrame(symbolIndex - 4 * 72, dibit);
}

DSDYSF.prototype.processCSD1 = function(dchBytes)
{
    if (this.m_fich.getCallMode() === DSDYSF.CMRadioID) {
        this.m_destId = String.fromCharCode.apply(null, [...dchBytes.subarray(0, 5)]);
        this.m_srcId = String.fromCharCode.apply(null, [...dchBytes.subarray(5, 10)]);
    } else {
        this.m_destId = String.fromCharCode.apply(null, [...dchBytes.subarray(0, 10)]);
        this.m_srcId = String.fromCharCode.apply(null, [...dchBytes.subarray(10, 20)]);
    }
}

DSDYSF.prototype.processCSD2 = function(dchBytes)
{
    this.m_downlink = String.fromCharCode.apply(null, [...dchBytes.subarray(0, 10)]);
    this.m_uplink = String.fromCharCode.apply(null, [...dchBytes.subarray(10, 20)]);
}

DSDYSF.prototype.processCSD3_1 = function(dchBytes)
{
    this.m_rem1 = String.fromCharCode.apply(null, [...dchBytes.subarray(0, 5)]);
    this.m_rem2 = String.fromCharCode.apply(null, [...dchBytes.subarray(5, 10)]);
}

DSDYSF.prototype.processCSD3_2 = function(dchBytes)
{
    this.m_rem3 = String.fromCharCode.apply(null, [...dchBytes.subarray(0, 5)]);
    this.m_rem4 = String.fromCharCode.apply(null, [...dchBytes.subarray(5, 10)]);
}

DSDYSF.prototype.processAMBE = function(mbeIndex, dibit)
{
    if (mbeIndex === 0) {
        this.n = 0;
        this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, 9);
    }
    this.m_dsdDecoder.ambe_fr[24 * DSDYSF.rW[this.n] + DSDYSF.rX[this.n]] = (1 & (dibit >> 1));
    this.m_dsdDecoder.ambe_fr[24 * DSDYSF.rY[this.n] + DSDYSF.rZ[this.n]] = (1 & dibit);
    this.n++;
    this.storeSymbolDV(this.m_dsdDecoder.m_mbeDVFrame1, mbeIndex, dibit)
    if (mbeIndex === 35) {
        this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
        this.m_dsdDecoder.m_mbeDVReady1 = true;
    }
}

DSDYSF.prototype.procesVFRFrame = function(mbeIndex, dibit)
{
    if (mbeIndex === 0)
        this.m_dsdDecoder.m_mbeDVFrame1.fill(0);
    this.m_vfrBitsRaw[DSDYSF.m_vfrInterleave[2 * mbeIndex]] = (1 & (dibit >> 1));
    this.m_vfrBitsRaw[DSDYSF.m_vfrInterleave[2 * mbeIndex + 1]] = (1 & dibit);
    if (mbeIndex === 71) {
        let seed = 0;
        let i;
        for (i = 0; i < 12; i++)
            seed = (seed << 1) | this.m_vfrBitsRaw[i];
        this.scrambleVFR(this.m_vfrBitsRaw.subarray(23), this.m_vfrBitsRaw.subarray(23), 144 - 23 - 7, seed, 4);
        mbe_golay2312(this.m_vfrBitsRaw, this.m_vfrBits);
        mbe_golay2312(this.m_vfrBitsRaw.subarray(23), this.m_vfrBits.subarray(12));
        mbe_golay2312(this.m_vfrBitsRaw.subarray(46), this.m_vfrBits.subarray(24));
        mbe_golay2312(this.m_vfrBitsRaw.subarray(69), this.m_vfrBits.subarray(36));
        mbe_hamming1511(this.m_vfrBitsRaw.subarray(92), this.m_vfrBits.subarray(48));
        mbe_hamming1511(this.m_vfrBitsRaw.subarray(107), this.m_vfrBits.subarray(59));
        mbe_hamming1511(this.m_vfrBitsRaw.subarray(122), this.m_vfrBits.subarray(70));
        this.m_vfrBits.set(this.m_vfrBitsRaw.subarray(137, 144), 81);
        for (i = 0; i < 88; i++)
            this.m_dsdDecoder.m_mbeDVFrame1[(i / 8) | 0] += this.m_vfrBits[i] << (7 - (i % 8));
        this.m_dsdDecoder.m_mbeDecoder1.processData(new Int8Array(this.m_vfrBits.buffer), null);
        this.m_dsdDecoder.m_mbeDVReady1 = true;
    }
}

DSDYSF.prototype.storeSymbolDV = function(mbeFrame, dibitindex, dibit, invertDibit = false)
{
    if (this.m_dsdDecoder.m_mbelibEnable)
        return;
    if (invertDibit)
        dibit = DSDSymbol.invert_dibit(dibit);
    mbeFrame[(dibitindex / 4) | 0] |= (dibit << (6 - 2 * (dibitindex % 4)));
}

DSDYSF.prototype.checkCRC16 = function(bits, nbBytes, xoredBytes = null)
{
    let bytes = new Uint8Array(22);
    for (let i = 0; i < nbBytes + 2; i++) {
        bytes[i] =(bits[8 * i + 0] << 7)
                + (bits[8 * i + 1] << 6)
                + (bits[8 * i + 2] << 5)
                + (bits[8 * i + 3] << 4)
                + (bits[8 * i + 4] << 3)
                + (bits[8 * i + 5] << 2)
                + (bits[8 * i + 6] << 1)
                + (bits[8 * i + 7] << 0);
        if (xoredBytes)
            xoredBytes[i] = bytes[i] ^ this.m_pn.getByte(i);
    }
    let crc = (bytes[nbBytes] << 8) + bytes[nbBytes + 1];
    return this.m_crc.crctablefast(bytes, nbBytes) === crc;
}

DSDYSF.prototype.scrambleVFR = function(out, inn, n, seed, shift)
{
    let v = seed << shift;
    for (let i = 0; i < n; i++) {
        v = (v * 173 + 13849) & 0xffff;
        out[i] = inn[i] ^ (v >> 15);
    }
}

DSDYSF.prototype.getFICH = function()
{
    return this.m_fich;
}

DSDYSF.prototype.getFICHError = function()
{
    return this.m_fichError;
}

DSDYSF.prototype.getDest = function()
{
    return this.m_dest;
}

DSDYSF.prototype.getSrc = function()
{
    return this.m_src;
}

DSDYSF.prototype.getDownlink = function()
{
    return this.m_downlink;
}

DSDYSF.prototype.getUplink = function()
{
    return this.m_uplink;
}

DSDYSF.prototype.getRem4 = function()
{
    return this.m_rem4;
}

DSDYSF.prototype.radioIdMode = function()
{
    return this.m_fich.getCallMode() === DSDYSF.CMRadioID;
}

DSDYSF.prototype.getDestId = function()
{
    return this.m_destId;
}

DSDYSF.prototype.getSrcId = function()
{
    return this.m_srcId;
}


function LFSRGenerator()
{
    this.m_sr = null;
    this.init();
}

LFSRGenerator.prototype.init = function()
{
    this.m_sr = 0x3ff;
}

LFSRGenerator.prototype.next = function()
{
    this.m_sr >>= 1;
    let res = this.m_sr & 1;
    let feedback = (((this.m_sr >> 4) & 1) ^ res) << 9;
    this.m_sr = (this.m_sr & 0x1ff) | feedback;
    return res;
}


function DSDdPMR(dsdDecoder)
{
    this.DPMRNoFrame = 0;
    this.DPMRExtSearchFrame = 1;
    this.DPMRHeaderFrame = 2;
    this.DPMRPayloadFrame = 3;
    this.DPMRVoiceframe = 4;
    this.DPMRDataVoiceframe = 5;
    this.DPMRData1frame = 6;
    this.DPMRData2frame = 7;
    this.DPMREndFrame = 8;
    this.DPMRCommStartHeader = 0;
    this.DPMRConnReqHeader = 1;
    this.DPMRUnConnReqHeader = 2;
    this.DPMRAckHeader = 3;
    this.DPMRSysReqHeader = 4;
    this.DPMRAckReplyHeader = 5;
    this.DPMRSysDelivHeader = 6;
    this.DPMRStatRespHeader = 7;
    this.DPMRStatReqHeader = 8;
    this.DPMRReservedHeader = 9;
    this.DPMRUndefinedHeader = 10;
    this.DPMRVoiceMode = 0;
    this.DPMRVoiceSLDMode = 1;
    this.DPMRData1Mode = 2;
    this.DPMRData2Mode = 3;
    this.DPMRData3Mode = 4;
    this.DPMRVoiceDataMode = 5;
    this.DPMRReservedMode = 6;
    this.DPMRUndefinedMode = 7;
    this.DPMRCallAllFormat = 0;
    this.DPMRP2PFormat = 1;
    this.DPMRReservedFormat = 2;
    this.DPMRUndefinedFormat = 3;
    this.DPMRHeader = 0;
    this.DPMRPostFrame = 1;
    this.DPMRExtSearch = 2;
    this.DPMRSuperFrame = 3;
    this.DPMREnd = 4;
    this.m_dsdDecoder = dsdDecoder;
    this.m_state = this.DPMRHeader;
    this.m_frameType = this.DPMRNoFrame;
    this.m_syncCycle = 0;
    this.m_symbolIndex = 0;
    this.m_frameIndex = 0;
    this.m_colourCode = 0;
    this.m_calledId = 0;
    this.m_ownId = 0;
    this.m_calledIdHalf = false;
    this.m_ownIdHalf = false;
    this.m_frameNumber = 0xff;
    this.n = 0;
    this.m_bitBuffer = new Uint8Array(80);
    this.m_bitBufferRx = new Uint8Array(120);
    this.m_bitWork = new Uint8Array(80);
    this.m_calledIdWork = 0;
    this.m_colourBuffer = new Uint8Array(12);
    this.m_ownIdWork = 0;
    this.m_syncDoubleBuffer = new Uint8Array(24);
    this.m_scramblingGenerator = new LFSRGenerator();
    this.m_hamming = new Hamming_12_8();
    this.m_scrambleBits = new Uint8Array(120);
    this.dI72 = new Uint32Array(72);
    this.dI120 = new Uint32Array(120);
    this.m_headerType = null;
    this.m_commMode = null;
    this.m_commFormat = null;
    this.initScrambling();
    this.initInterleaveIndexes();
    this.init();
}

DSDdPMR.dpmrFrameTypes = ["--", "XS", "HD", "PY", "VO", "VD", "D1", "S2", "EN"];
DSDdPMR.rW = new Int32Array([
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 2,
                                0, 2, 0, 2, 0, 2,
                                0, 2, 0, 2, 0, 2
                            ]);
DSDdPMR.rX = new Int32Array([
                                23, 10, 22, 9, 21, 8,
                                20, 7, 19, 6, 18, 5,
                                17, 4, 16, 3, 15, 2,
                                14, 1, 13, 0, 12, 10,
                                11, 9, 10, 8, 9, 7,
                                8, 6, 7, 5, 6, 4
                            ]);
DSDdPMR.rY = new Int32Array([
                                0, 2, 0, 2, 0, 2,
                                0, 2, 0, 3, 0, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3
                            ]);
DSDdPMR.rZ = new Int32Array([
                                5, 3, 4, 2, 3, 1,
                                2, 0, 1, 13, 0, 12,
                                22, 11, 21, 10, 20, 9,
                                19, 8, 18, 7, 17, 6,
                                16, 5, 15, 4, 14, 3,
                                13, 2, 12, 1, 11, 0
                            ]);
DSDdPMR.m_preamble = new Uint8Array([1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3]);

DSDdPMR.prototype.init = function()
{
    this.m_syncCycle = 0;
    this.m_symbolIndex = 0;
    this.m_colourCode = 0;
    this.m_calledId = 0;
    this.m_ownId = 0;
    this.m_frameNumber = 0xff;
    this.m_headerType = this.DPMRUndefinedHeader;
    this.m_commMode = this.DPMRUndefinedMode;
    this.m_commFormat = this.DPMRUndefinedFormat;
    this.m_frameType = this.DPMRNoFrame;
    this.m_state = this.DPMRHeader;
}

DSDdPMR.prototype.process = function()
{
    switch(this.m_state) {
    case this.DPMRHeader:
        this.processHeader();
        break;
    case this.DPMRPostFrame:
        this.processPostFrame();
        break;
    case this.DPMRExtSearch:
        this.processExtSearch();
        break;
    case this.DPMRSuperFrame:
        this.processSuperFrame();
        break;
    case this.DPMREnd:
        this.processEndFrame();
        break;
    default:
        this.m_dsdDecoder.resetFrameSync();
    }
}

DSDdPMR.prototype.getColorCode = function()
{
    return this.m_colourCode;
}

DSDdPMR.prototype.getFrameType = function()
{
    return this.m_frameType;
}

DSDdPMR.prototype.getCalledId = function()
{
    return this.m_calledId;
}

DSDdPMR.prototype.getOwnId = function()
{
    return this.m_ownId;
}

DSDdPMR.prototype.processHeader = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex === 0)
        this.m_frameType = this.DPMRHeaderFrame;
    if (this.m_symbolIndex < 60) {
        this.processHIn(this.m_symbolIndex, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 72) {
        this.processColourCode(this.m_symbolIndex - 60, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 132) {
        this.processHIn(this.m_symbolIndex - 72, dibit);
        this.m_symbolIndex++;
        if (this.m_symbolIndex === 132) {
            this.m_state = this.DPMRPostFrame;
            this.m_symbolIndex = 0;
        }
    } else {
        this.m_frameType = this.DPMRNoFrame;
        this.m_dsdDecoder.resetFrameSync();
    }
}

DSDdPMR.prototype.processHIn = function(symbolIndex, dibit)
{
    this.m_bitBufferRx[this.dI120[2 * symbolIndex]] = ((dibit >> 1) & 1) ^ this.m_scrambleBits[2 * symbolIndex];
    this.m_bitBufferRx[this.dI120[2 * symbolIndex + 1]] = (dibit & 1) ^ this.m_scrambleBits[2 * symbolIndex + 1];
    if (symbolIndex === 59) {
        let hammingStatus = this.m_hamming.decode(this.m_bitBufferRx, this.m_bitBuffer, 10);
        if (this.checkCRC8(this.m_bitBuffer, 72)) {
            let ht = (this.m_bitBuffer[0] << 3) + (this.m_bitBuffer[1] << 2) + (this.m_bitBuffer[2] << 1) + this.m_bitBuffer[3];
            let mode = (this.m_bitBuffer[52] << 2) + (this.m_bitBuffer[53] << 1) + this.m_bitBuffer[54];
            let format = (this.m_bitBuffer[55] << 3) + (this.m_bitBuffer[56] << 2) + (this.m_bitBuffer[57] << 1) + this.m_bitBuffer[58];
            let calledId = 0, ownId = 0;
            for (let i = 0; i < 24; i++) {
                calledId += (this.m_bitBuffer[27 - i]) << i;
                ownId += (this.m_bitBuffer[51 - i]) << i;
            }
            if (calledId)
                this.m_calledId = calledId;
            if (ownId)
                this.m_ownId = ownId;
            if (ht < 9)
                this.m_headerType = ht;
            else
                this.m_headerType = this.DPMRReservedHeader;
            if (mode < 6)
                this.m_commMode = mode;
            else
                this.m_commMode = this.DPMRReservedMode;
            if (format < 2)
                this.m_commFormat = format;
            else
                this.m_commFormat = this.DPMRReservedFormat;
        }
    }
}

DSDdPMR.prototype.processSuperFrame = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex === 0) {
        this.m_frameType = this.DPMRPayloadFrame;
        this.m_frameIndex = 0;
    }
    if (this.m_symbolIndex < 36) {
        this.m_calledIdHalf = false;
        this.m_ownIdHalf = false;
        this.processCCH(this.m_symbolIndex, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 180) {
        this.processTCH(this.m_symbolIndex - 36, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 192) {
        this.processColourCode(this.m_symbolIndex - 180, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 228) {
        this.processCCH(this.m_symbolIndex - 192, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 372) {
        this.processTCH(this.m_symbolIndex - 228, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 384) {
        this.processFS2(this.m_symbolIndex - 372, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 420) {
        this.processCCH(this.m_symbolIndex - 384, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 564) {
        this.processTCH(this.m_symbolIndex - 420, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 576) {
        this.processColourCode(this.m_symbolIndex - 564, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 612) {
        this.processCCH(this.m_symbolIndex - 576, dibit);
        this.m_symbolIndex++;
    } else if (this.m_symbolIndex < 756) {
        this.processTCH(this.m_symbolIndex - 612, dibit);
        this.m_symbolIndex++;
        if (this.m_symbolIndex === 756) {
            this.m_frameType = this.DPMRNoFrame;
            this.m_state = this.DPMRPostFrame;
            this.m_symbolIndex = 0;
        }
    } else {
        this.m_frameType = this.DPMRNoFrame;
        this.m_dsdDecoder.resetFrameSync();
    }
}

DSDdPMR.prototype.processEndFrame = function()
{
    if (this.m_symbolIndex === 0)
        this.m_frameType = this.DPMREndFrame;
    if (this.m_symbolIndex < 18)
        this.m_symbolIndex++;
    else if (this.m_symbolIndex < 36)
        this.m_symbolIndex++;
    else {
        this.m_frameType = this.DPMRNoFrame;
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
    }
}

DSDdPMR.prototype.processPostFrame = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex < 12) {
        if (dibit > 1)
            this.m_syncDoubleBuffer[this.m_symbolIndex] = 3;
        else
            this.m_syncDoubleBuffer[this.m_symbolIndex] = 1;
        this.m_symbolIndex++;
        if (this.m_symbolIndex === 12) {
            let syncEngine = new DSDSync();
            let patterns = [DSDSync.SyncDPMRFS2, DSDSync.SyncDPMRFS3];
            syncEngine.matchSome(this.m_syncDoubleBuffer, 12, patterns, 2);
            if (syncEngine.isMatching(DSDSync.SyncDPMRFS2))	{
                this.m_state = this.DPMRSuperFrame;
                this.m_symbolIndex = 0;
            } else if (syncEngine.isMatching(DSDSync.SyncDPMRFS3)) {
                this.m_state = this.DPMREnd;
                this.m_symbolIndex = 0;
            } else if (this.m_syncDoubleBuffer.subarray(0, 8).toString() === DSDdPMR.m_preamble.subarray(0, 8).toString()
                       || this.m_syncDoubleBuffer.subarray(1, 9).toString() === DSDdPMR.m_preamble.subarray(0, 8).toString()
                       || this.m_syncDoubleBuffer.subarray(2, 10).toString() === DSDdPMR.m_preamble.subarray(0, 8).toString()
                       || this.m_syncDoubleBuffer.subarray(3, 11).toString() === DSDdPMR.m_preamble.subarray(0, 8).toString()) {
                this.m_frameType = this.DPMRNoFrame;
                this.m_dsdDecoder.m_voice1On = false;
                this.m_dsdDecoder.resetFrameSync();
            } else {
                this.m_frameType = this.DPMRExtSearchFrame;
                this.m_dsdDecoder.m_voice1On = false;
                this.m_state = this.DPMRExtSearch;
                this.m_symbolIndex = 0;
                this.m_syncCycle = 0;
            }
        }
    } else if (this.m_symbolIndex < 192)
        this.m_symbolIndex++;
    else
        this.m_symbolIndex = 0;
}

DSDdPMR.prototype.processExtSearch = function()
{
    let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex >= 12) {
        this.m_symbolIndex = 0;
        if (this.m_syncCycle < 15)
            this.m_syncCycle++;
        else
            this.m_syncCycle = 0;
    }
    if (this.m_syncCycle < 1 || this.m_syncCycle > 14) {
        let syncEngine = new DSDSync();
        let patterns = [DSDSync.SyncDPMRFS2];
        syncEngine.matchSome(this.m_syncDoubleBuffer, 12, patterns, 1);
        if (syncEngine.isMatching(DSDSync.SyncDPMRFS2)) {
            this.m_state = this.DPMRSuperFrame;
            this.m_symbolIndex = 0;
            this.processSuperFrame();
            return;
        } else if (this.m_syncDoubleBuffer.subarray(0, 12).toString() === DSDdPMR.m_preamble.subarray(0, 12).toString()) {
            this.m_frameType = this.DPMRNoFrame;
            this.m_dsdDecoder.resetFrameSync();
            return;
        }
    }
    this.m_syncDoubleBuffer[this.m_symbolIndex] = (dibit > 1 ? 3 : 1);
    this.m_syncDoubleBuffer[this.m_symbolIndex + 12] = (dibit > 1 ? 3 : 1);
    this.m_symbolIndex++;
}

DSDdPMR.prototype.processColourCode = function(symbolIndex, dibit)
{
    this.m_colourBuffer[symbolIndex] = (dibit > 1 ? 1 : 0);
    if (symbolIndex === 11) {
        this.m_colourCode = 0;
        for (let i = 11, n = 0; i >= 0; i--, n++)
            if (this.m_colourBuffer[i] === 1)
                this.m_colourCode += (1 << n);
    }
}

DSDdPMR.prototype.processFS2 = function(symbolIndex, dibit)
{
    if ((dibit === 0) || (dibit === 1))
        this.m_syncDoubleBuffer[symbolIndex] = 1;
    else
        this.m_syncDoubleBuffer[symbolIndex] = 3;
    if (symbolIndex === 11) {
        let syncEngine = new DSDSync();
        let patterns = [DSDSync.SyncDPMRFS2, DSDSync.SyncDPMRFS3];
        syncEngine.matchSome(this.m_syncDoubleBuffer, 12, patterns, 2);
        if (syncEngine.isMatching(DSDSync.SyncDPMRFS2))
            this.m_frameType = this.DPMRPayloadFrame;
        else if (syncEngine.isMatching(DSDSync.SyncDPMRFS3)) {
            this.m_state = this.DPMREnd;
            this.m_symbolIndex = 0;
        } else {
            this.m_frameType = this.DPMRExtSearchFrame;
            this.m_state = this.DPMRExtSearch;
            this.m_symbolIndex = 0;
            this.m_syncCycle = 0;
        }
    }
}

DSDdPMR.prototype.processCCH = function(symbolIndex, dibit)
{
    this.m_bitBufferRx[this.dI72[2 * symbolIndex]] = ((dibit >> 1) & 1) ^ this.m_scrambleBits[2 * symbolIndex];
    this.m_bitBufferRx[this.dI72[2 * symbolIndex + 1]] = (dibit & 1) ^ this.m_scrambleBits[2 * symbolIndex + 1];
    if (symbolIndex === 35) {
        this.m_hamming.decode(this.m_bitBufferRx, this.m_bitBuffer, 6);
        if (this.checkCRC7(this.m_bitBuffer, 41)) {
            this.m_frameNumber = (this.m_bitBuffer[0] << 1) + this.m_bitBuffer[1];
            let mode = (this.m_bitBuffer[14] << 2) + (this.m_bitBuffer[15] << 1) + this.m_bitBuffer[16];
            let format = (this.m_bitBuffer[17] << 3) + (this.m_bitBuffer[18] << 2) + (this.m_bitBuffer[19] << 1) + this.m_bitBuffer[20];
            this.m_frameIndex = this.m_frameNumber;
            if (this.m_frameNumber === 0) {
                this.m_calledIdWork = ((this.m_bitBuffer[2]  << 23)
                                       + (this.m_bitBuffer[3]  << 22)
                                       + (this.m_bitBuffer[4]  << 21)
                                       + (this.m_bitBuffer[5]  << 20)
                                       + (this.m_bitBuffer[6]  << 19)
                                       + (this.m_bitBuffer[7]  << 18)
                                       + (this.m_bitBuffer[8]  << 17)
                                       + (this.m_bitBuffer[9]  << 16)
                                       + (this.m_bitBuffer[10] << 15)
                                       + (this.m_bitBuffer[11] << 14)
                                       + (this.m_bitBuffer[12] << 13)
                                       + (this.m_bitBuffer[13] << 12));
                this.m_calledIdHalf = true;
            } else if (this.m_frameNumber === 1) {
                if (this.m_calledIdHalf) {
                    this.m_calledIdWork +=((this.m_bitBuffer[2]  << 11)
                                           + (this.m_bitBuffer[3]  << 10)
                                           + (this.m_bitBuffer[4]  << 9)
                                           + (this.m_bitBuffer[5]  << 8)
                                           + (this.m_bitBuffer[6]  << 7)
                                           + (this.m_bitBuffer[7]  << 6)
                                           + (this.m_bitBuffer[8]  << 5)
                                           + (this.m_bitBuffer[9]  << 4)
                                           + (this.m_bitBuffer[10] << 3)
                                           + (this.m_bitBuffer[11] << 2)
                                           + (this.m_bitBuffer[12] << 1)
                                           + (this.m_bitBuffer[13]));
                    this.m_calledId = this.m_calledIdWork;
                }
                this.m_calledIdHalf = false;
            } else if (this.m_frameNumber === 2) {
                this.m_ownIdWork =((this.m_bitBuffer[2]  << 23)
                                   + (this.m_bitBuffer[3]  << 22)
                                   + (this.m_bitBuffer[4]  << 21)
                                   + (this.m_bitBuffer[5]  << 20)
                                   + (this.m_bitBuffer[6]  << 19)
                                   + (this.m_bitBuffer[7]  << 18)
                                   + (this.m_bitBuffer[8]  << 17)
                                   + (this.m_bitBuffer[9]  << 16)
                                   + (this.m_bitBuffer[10] << 15)
                                   + (this.m_bitBuffer[11] << 14)
                                   + (this.m_bitBuffer[12] << 13)
                                   + (this.m_bitBuffer[13] << 12));
                this.m_ownIdHalf = true;
            } else if (this.m_frameNumber === 3) {
                if (this.m_ownIdHalf) {
                    this.m_ownIdWork+=((this.m_bitBuffer[2]  << 11)
                                       + (this.m_bitBuffer[3]  << 10)
                                       + (this.m_bitBuffer[4]  << 9)
                                       + (this.m_bitBuffer[5]  << 8)
                                       + (this.m_bitBuffer[6]  << 7)
                                       + (this.m_bitBuffer[7]  << 6)
                                       + (this.m_bitBuffer[8]  << 5)
                                       + (this.m_bitBuffer[9]  << 4)
                                       + (this.m_bitBuffer[10] << 3)
                                       + (this.m_bitBuffer[11] << 2)
                                       + (this.m_bitBuffer[12] << 1)
                                       + (this.m_bitBuffer[13]));
                    this.m_ownId = this.m_ownIdWork;
                }
                this.m_ownIdHalf = false;
            }
            if (mode < 6)
                this.m_commMode = mode;
            else
                this.m_commMode = this.DPMRReservedMode;
            if (format < 2)
                this.m_commFormat = format;
            else
                this.m_commFormat = this.DPMRReservedFormat;
        } else
            this.m_frameNumber = 0xff;
        switch (this.m_commMode) {
        case this.DPMRVoiceMode:
            this.m_frameType = this.DPMRVoiceframe;
            this.m_dsdDecoder.m_voice1On = true;
            break;
        case this.DPMRVoiceSLDMode:
            this.m_frameType = this.DPMRVoiceframe;
            this.m_dsdDecoder.m_voice1On = true;
            break;
        case this.DPMRVoiceDataMode:
            this.m_frameType = this.DPMRDataVoiceframe;
            this.m_dsdDecoder.m_voice1On = true;
            break;
        case this.DPMRData1Mode:
            this.m_frameType = this.DPMRData1frame;
            this.m_dsdDecoder.m_voice1On = false;
            break;
        case this.DPMRData2Mode:
            this.m_frameType = this.DPMRData2frame;
            this.m_dsdDecoder.m_voice1On = false;
            break;
        case this.DPMRData3Mode:
            this.m_frameType = this.DPMRPayloadFrame;
            this.m_dsdDecoder.m_voice1On = false;
            break;
        default:
            this.m_frameType = this.DPMRPayloadFrame;
            this.m_dsdDecoder.m_voice1On = false;
            break;
        }
        this.m_frameIndex++;
    }
}

DSDdPMR.prototype.processTCH = function(symbolIndex, dibit)
{
    if ((this.m_frameType === this.DPMRVoiceframe) || (this.m_frameType === this.DPMRDataVoiceframe))
        this.processVoiceFrame(symbolIndex % 36, dibit);
}

DSDdPMR.prototype.processVoiceFrame = function(symbolIndex, dibit)
{
    if (symbolIndex % 36 === 0) {
        this.n = 0;
        this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, 9);
    }
    this.m_dsdDecoder.ambe_fr[24 * DSDdPMR.rW[this.n] + DSDdPMR.rX[this.n]] = (1 & (dibit >> 1));
    this.m_dsdDecoder.ambe_fr[24 * DSDdPMR.rY[this.n] + DSDdPMR.rZ[this.n]] = (1 & dibit);
    this.n++;
    this.storeSymbolDV(symbolIndex % 36, dibit);
    if (symbolIndex % 36 === 35) {
        this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
        this.m_dsdDecoder.m_mbeDVReady1 = true;
    }
}

DSDdPMR.prototype.storeSymbolDV = function(dibitindex, dibit, invertDibit = false)
{
    if (this.m_dsdDecoder.m_mbelibEnable)
        return;
    if (invertDibit)
        dibit = DSDSymbol.invert_dibit(dibit);
    this.m_dsdDecoder.m_mbeDVFrame1[(dibitindex / 4) | 0] |= (dibit << (6 - 2 * (dibitindex % 4)));
}

DSDdPMR.prototype.initScrambling = function()
{
    this.m_scramblingGenerator.init();
    for (let i = 0; i < 120; i++)
        this.m_scrambleBits[i] = this.m_scramblingGenerator.next() & 1;
}

DSDdPMR.prototype.initInterleaveIndexes = function()
{
    let i;
    for (i = 0; i < 72; i++)
        this.dI72[i] = 12 * (i % 6) + ((i / 6) | 0);
    for (i = 0; i < 120; i++)
        this.dI120[i] = 12 * (i % 10) + ((i / 10) | 0);
}

DSDdPMR.prototype.checkCRC7 = function(bits, nbBits)
{
    this.m_bitWork.set(bits.subarray(0, nbBits));
    this.m_bitWork.subarray(nbBits, nbBits + 7).fill(0);
    for (let i = 0; i < nbBits; i++)
        if (this.m_bitWork[i] === 1) {
            this.m_bitWork[i] = 0;
            this.m_bitWork[i + 4] ^= 1;
            this.m_bitWork[i + 7] ^= 1;
        }
    return bits.subarray(nbBits, nbBits + 7).toString() === this.m_bitWork.subarray(nbBits, nbBits + 7).toString();
}

DSDdPMR.prototype.checkCRC8 = function(bits, nbBits)
{
    this.m_bitWork.set(bits.subarray(0, nbBits));
    this.m_bitWork.subarray(nbBits, nbBits + 8).fill(0);
    for (let i = 0; i < nbBits; i++)
        if (this.m_bitWork[i] === 1) {
            this.m_bitWork[i]	= 0;
            this.m_bitWork[i + 6] ^= 1;
            this.m_bitWork[i + 7] ^= 1;
            this.m_bitWork[i + 8] ^= 1;
        }
    return bits.subarray(nbBits, nbBits + 8).toString() === this.m_bitWork.subarray(nbBits, nbBits + 8).toString();
}


function Viterbi3(n, polys, msbFirst = true)
{
    Viterbi.call(this, 3, n, polys, msbFirst);
}

Viterbi3.prototype = Object.create(Viterbi.prototype);
Viterbi3.prototype.constructor = Viterbi3;

Viterbi3.prototype.decodeFromSymbols = function(dataBits, symbols, nbSymbols, startstate)
{
    if (nbSymbols > this.m_nbSymbolsMax) {
        this.m_traceback = new Uint8Array(4 * nbSymbols);
        this.m_pathMetrics = new Uint32Array(4);
        this.m_nbSymbolsMax = nbSymbols;
    }
    this.m_pathMetrics.fill(Viterbi.m_maxMetric);
    this.m_pathMetrics[startstate] = 0;
    for (let is = 0; is < nbSymbols; is++)
        Viterbi3.doMetrics(is, this.m_branchCodes, symbols[is],
                           this.m_traceback.subarray(0 * nbSymbols),
                           this.m_traceback.subarray(1 * nbSymbols),
                           this.m_traceback.subarray(2 * nbSymbols),
                           this.m_traceback.subarray(3 * nbSymbols),
                           this.m_pathMetrics
                           );
    let minPathMetric = this.m_pathMetrics[0];
    let minPathIndex = 0;
    for (let i = 1; i < 4; i++)
        if (this.m_pathMetrics[i] < minPathMetric) {
            minPathMetric = this.m_pathMetrics[i];
            minPathIndex = i;
        }
    Viterbi3.traceBack(nbSymbols, minPathIndex, dataBits,
                       this.m_traceback.subarray(0 * nbSymbols),
                       this.m_traceback.subarray(1 * nbSymbols),
                       this.m_traceback.subarray(2 * nbSymbols),
                       this.m_traceback.subarray(3 * nbSymbols)
                       );
}

Viterbi3.prototype.decodeFromBits = function(dataBits, bits, nbBits, startstate)
{
    if (nbBits > this.m_nbBitsMax) {
        this.m_symbols = new Uint8Array((nbBits / this.m_n) | 0);
        this.m_nbBitsMax = nbBits;
    }
    let j;
    for (let i = 0; i < nbBits; i += this.m_n) {
        this.m_symbols[(i / this.m_n) | 0] = bits[i];
        for (j = this.m_n - 1; j > 0; j--)
            this.m_symbols[(i / this.m_n) | 0] += bits[i + j] << j;
    }
    this.decodeFromSymbols(dataBits, this.m_symbols, (nbBits / this.m_n) | 0, startstate);
}

Viterbi3.doMetrics = function(n, branchCodes, symbol, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3, m_pathMetric)
{
    let tempMetric = new Uint32Array(4);
    let metric = new Uint32Array(8);
    let m1;
    let m2;
    metric[0] = Viterbi.NbOnes[branchCodes[0] ^ symbol];
    metric[1] = Viterbi.NbOnes[branchCodes[1] ^ symbol];
    metric[2] = Viterbi.NbOnes[branchCodes[2] ^ symbol];
    metric[3] = Viterbi.NbOnes[branchCodes[3] ^ symbol];
    metric[4] = Viterbi.NbOnes[branchCodes[4] ^ symbol];
    metric[5] = Viterbi.NbOnes[branchCodes[5] ^ symbol];
    metric[6] = Viterbi.NbOnes[branchCodes[6] ^ symbol];
    metric[7] = Viterbi.NbOnes[branchCodes[7] ^ symbol];
    m1 = metric[0] + m_pathMetric[0];
    m2 = metric[2] + m_pathMetric[1];
    if (m1 < m2) {
        m_pathMemory0[n] = 0;
        tempMetric[0] = m1;
    } else {
        m_pathMemory0[n] = 1;
        tempMetric[0] = m2;
    }
    m1 = metric[4] + m_pathMetric[2];
    m2 = metric[6] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory1[n] = 2;
        tempMetric[1] = m1;
    } else {
        m_pathMemory1[n] = 3;
        tempMetric[1] = m2;
    };
    m1 = metric[1] + m_pathMetric[0];
    m2 = metric[3] + m_pathMetric[1];
    if (m1 < m2) {
        m_pathMemory2[n] = 0;
        tempMetric[2] = m1;
    } else {
        m_pathMemory2[n] = 1;
        tempMetric[2] = m2;
    }
    m1 = metric[5] + m_pathMetric[2];
    m2 = metric[7] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory3[n] = 2;
        tempMetric[3] = m1;
    } else {
        m_pathMemory3[n] = 3;
        tempMetric[3] = m2;
    };
    m_pathMetric[0] = tempMetric[0];
    m_pathMetric[1] = tempMetric[1];
    m_pathMetric[2] = tempMetric[2];
    m_pathMetric[3] = tempMetric[3];
}

Viterbi3.traceBack = function(nbSymbols, startState, out, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3)
{
    let state = startState;
    for (let loop = nbSymbols - 1; loop >= 0; loop--)
        switch (state) {
        case 0:
            state = m_pathMemory0[loop];
            out[loop] = 0;
            break;
        case 1:
            state = m_pathMemory1[loop];
            out[loop] = 0;
            break;
        case 2:
            state = m_pathMemory2[loop];
            out[loop] = 1;
            break;
        case 3:
            state = m_pathMemory3[loop];
            out[loop] = 1;
            break;
        }
}


function LocatorInvalidException(locator_str)
{
    this._locator_str = locator_str;
}

LocatorInvalidException.prototype.getString = function()
{
    return _locator_str;
}


function Locator(...args)
{
    this.m_lat_index1 = 0;
    this.m_lat_index2 = 0;
    this.m_lat_index3 = 0;
    this.m_lon_index1 = 0;
    this.m_lon_index2 = 0;
    this.m_lon_index3 = 0;
    this.m_lat = 0;
    this.m_lon = 0;
    if (args.length === 0) {
        this.m_lat = 0;
        this.m_lon = 0;
        setIndexes();
    } else if (args.length === 1) {
        let loc_string = args[0];
        if (loc_string.length !== 6)
            return;
        loc_string = loc_string.toUpperCase();
        let sz = Locator.m_lon_array1.indexOf(loc_string[0]);
        if (sz === -1)
            return;
        else
            this.m_lon_index1 = sz;
        sz = Locator.m_lat_array1.indexOf(loc_string[1]);
        if (sz === -1)
            return;
        else
            this.m_lat_index1 = sz;
        sz = Locator.m_lon_array2.indexOf(loc_string[2]);
        if (sz === -1)
            return;
        else
            this.m_lon_index2 = sz;
        sz = Locator.m_lat_array2.indexOf(loc_string[3]);
        if (sz === -1)
            return;
        else
            this.m_lat_index2 = sz;
        sz = Locator.m_lon_array3.indexOf(loc_string[4]);
        if (sz === -1)
            return;
        else
            this.m_lon_index3 = sz;
        sz = Locator.m_lat_array3.indexOf(loc_string[5]);
        if (sz === -1)
            return;
        else
            this.m_lat_index3 = sz;
        this.m_lat = this.m_lat_index1 * 10 - 90;
        this.m_lon = this.m_lon_index1 * 20 - 180;
        this.m_lat += this.m_lat_index2;
        this.m_lon += this.m_lon_index2 * 2;
        this.m_lat += this.m_lat_index3 / 24;
        this.m_lon += this.m_lon_index3 / 12;
        this.m_lat += 1.25 / 60;
        this.m_lon += 2.5 / 60;
    } else if (args.length === 2) {
        this.m_lat = args[0];
        this.m_lon = args[1];
        this.setIndexes();
    }
}

Locator.m_lon_array1 = "ABCDEFGHIJKLMNOPQR";
Locator.m_lat_array1 = "ABCDEFGHIJKLMNOPQR";
Locator.m_lon_array2 = "0123456789";
Locator.m_lat_array2 = "0123456789";
Locator.m_lon_array3 = "ABCDEFGHIJKLMNOPQRSTUVWX";
Locator.m_lat_array3 = "ABCDEFGHIJKLMNOPQRSTUVWX";

Locator.prototype.toString = function()
{
    let returned = "";
    returned += Locator.m_lon_array1.charAt(this.m_lon_index1);
    returned += Locator.m_lat_array1.charAt(this.m_lon_index1);
    returned += Locator.m_lon_array2.charAt(this.m_lon_index2);
    returned += Locator.m_lat_array2.charAt(this.m_lon_index2);
    returned += Locator.m_lon_array3.charAt(this.m_lon_index3);
    returned += Locator.m_lat_array3.charAt(this.m_lon_index3);
    return returned;
}

Locator.prototype.toCSting = function(locator)
{
    locator[0] = Locator.m_lon_array1.charAt(this.m_lon_index1);
    locator[1] = Locator.m_lat_array1.charAt(this.m_lat_index1);
    locator[2] = Locator.m_lon_array2.charAt(this.m_lon_index2);
    locator[3] = Locator.m_lat_array2.charAt(this.m_lat_index2);
    locator[4] = Locator.m_lon_array3.charAt(this.m_lon_index3);
    locator[5] = Locator.m_lat_array3.charAt(this.m_lat_index3);
}

Locator.prototype.latitude = function()
{
    return this.m_lat;
}

Locator.prototype.longitude = function()
{
    return this.m_lon;
}

Locator.prototype.setLatLon = function(lat, lon)
{
    this.m_lat = lat;
    this.m_lon = lon;
    setIndexes();
}

Locator.prototype.setIndexes = function()
{
    let lat_rem, lon_rem;
    this.m_lat_index1 = ((this.m_lat + 90) / 10) | 0;
    this.m_lon_index1 = ((this.m_lon + 180) / 20) | 0;
    lat_rem = this.m_lat + 90 - (this.m_lat_index1 * 10);
    lon_rem = this.m_lon + 180 - (this.m_lon_index1 * 20);
    this.m_lat_index2 = lat_rem | 0;
    this.m_lon_index2 = (lon_rem / 2) | 0;
    lat_rem = lat_rem - this.m_lat_index2;
    lon_rem = lon_rem - this.m_lon_index2 * 2;
    this.m_lat_index3 = (lat_rem * 24) | 0;
    this.m_lon_index3 = (lon_rem * 12) | 0;
}


function LocPoint(...args)
{
    this.m_locator;
    if (args.length === 1)
        this.m_locator = args[0]
    else if (args.length === 2)
        this.m_locator = new Locator(args[0], args[1]);
}

LocPoint.prototype.latitude = function()
{
    return this.m_locator.latitude();
}

LocPoint.prototype.longitude = function()
{
    return this.m_locator.longitude()
}

LocPoint.prototype.bearingTo = function(distant_point)
{
    let lat1 = this.m_locator.latitude() * M_PI / 180;
    let lon1 = this.m_locator.longitude() * M_PI / 180;
    let lat2 = distant_point.latitude() * M_PI / 180;
    let lon2 = distant_point.longitude() * M_PI / 180;
    let dLon = lon2 - lon1;
    let y = Math.sin(dLon) * Math.cos(lat2);
    let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bear_rad = Math.atan2(y, x);
    if (bear_rad > 0)
        return bear_rad * 180 / M_PI;
    else
        return 360 + bear_rad * 180 / M_PI;
}

LocPoint.prototype.distanceTo = function(distant_point)
{
    let lat1 = this.m_locator.latitude() * M_PI / 180;
    let lon1 = this.m_locator.longitude() * M_PI / 180;
    let lat2 = distant_point.latitude() * M_PI / 180;
    let lon2 = distant_point.longitude() * M_PI / 180;
    return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * 6371;
}

LocPoint.prototype.setLatLon = function(lat, lon)
{
    this.m_locator.setLatLon(lat, lon);
}

LocPoint.prototype.getLocator = function()
{
    return this.m_locator;
}


function Descramble()
{
}

Descramble.SCRAMBLER_TABLE_BITS_LENGTH = 720;
Descramble.SCRAMBLER_TABLE_BITS = new Uint8Array([
                                                     0,0,0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,
                                                     0,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,
                                                     1,1,0,1,0,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,
                                                     1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,
                                                     0,0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,
                                                     0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,
                                                     1,0,1,0,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,
                                                     1,1,1,1,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,
                                                     0,0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,
                                                     1,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,
                                                     0,1,0,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,1,
                                                     1,1,1,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,
                                                     0,1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,
                                                     0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,
                                                     1,0,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,
                                                     1,1,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,
                                                     1,1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,
                                                     0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,1,
                                                     0,1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,
                                                     1,0,1,0,0,1,0,1,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,
                                                     1,1,0,1,1,1,1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,
                                                     1,1,0,0,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,0,1,1,0,1,0,
                                                     1,0,0,1,1,1,0,0,1,1,1,1,0,1,1,0
                                                 ]);

Descramble.scramble = function(inn, out)
{
    let loop = 0;
    let m_count = 0;
    for (loop = 0; loop < 660; loop++) {
        out[loop] = inn[loop] ^ Descramble.SCRAMBLER_TABLE_BITS[m_count++];
        if (m_count >= Descramble.SCRAMBLER_TABLE_BITS_LENGTH)
            m_count = 0;
    }
}

Descramble.deinterleave = function(inn, out)
{
    let k = 0;
    let loop = 0;
    for (loop = 0; loop < 660; loop++) {
        out[k] = inn[loop];
        k += 24;
        if (k >= 672)
            k -= 671;
        else if (k >= 660)
            k -= 647;
    }
}

Descramble.FECdecoder = function(inn, out)
{
    let outLen;
    m_pathMemory0 = new Uint8Array(330);
    m_pathMemory1 = new Uint8Array(330);
    m_pathMemory2 = new Uint8Array(330);
    m_pathMemory3 = new Uint8Array(330);
    m_pathMetric = new Uint8Array(4);
    let loop, loop2;
    let n = 0;
    for (loop = 0; loop < 4; loop++)
        m_pathMetric[loop] = 0;
    data = new Uint8Array(2);
    for (loop2 = 0; loop2 < 660; loop2 += 2, n++) {
        if (inn[loop2])
            data[1] = 1;
        else
            data[1] = 0;
        if (inn[loop2 + 1])
            data[0] = 1;
        else
            data[0] = 0;
        Descramble.viterbiDecode(n, data, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3, m_pathMetric);
    }
    outLen = Descramble.traceBack(out, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3);
    return outLen;
}

Descramble.traceBack = function(out, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3) {
    let S0 = 0;
    let S1 = 1;
    let S2 = 2;
    let S3 = 3;
    let loop;
    let length = 0;
    let state = S0;
    for (loop = 329; loop >= 0; loop--, length++)
        switch (state) {
        case S0:
            if (m_pathMemory0[loop])
                state = S2;
            else
                state = S0;
            out[loop] = 0;
            break;
        case S1:
            if (m_pathMemory1[loop])
                state = S2;
            else
                state = S0;
            out[loop] = 1;
            break;
        case S2:
            if (m_pathMemory2[loop])
                state = S3;
            else
                state = S1;
            out[loop] = 0;
            break;
        case S3:
            if (m_pathMemory3[loop])
                state = S3;
            else
                state = S1;
            out[loop] = 1;
            break;
        }
    return length;
}

Descramble.viterbiDecode = function(n, data, m_pathMemory0, m_pathMemory1, m_pathMemory2, m_pathMemory3, m_pathMetric)
{
    let tempMetric = new Int32Array(4);
    let metric = new Int32Array(8);
    let loop;
    let m1;
    let m2;
    metric[0] = (data[1] ^ 0) + (data[0] ^ 0);
    metric[1] = (data[1] ^ 1) + (data[0] ^ 1);
    metric[2] = (data[1] ^ 1) + (data[0] ^ 0);
    metric[3] = (data[1] ^ 0) + (data[0] ^ 1);
    metric[4] = (data[1] ^ 1) + (data[0] ^ 1);
    metric[5] = (data[1] ^ 0) + (data[0] ^ 0);
    metric[6] = (data[1] ^ 0) + (data[0] ^ 1);
    metric[7] = (data[1] ^ 1) + (data[0] ^ 0);
    m1 = metric[0] + m_pathMetric[0];
    m2 = metric[4] + m_pathMetric[2];
    if (m1 < m2) {
        m_pathMemory0[n] = 0;
        tempMetric[0] = m1;
    } else {
        m_pathMemory0[n] = 1;
        tempMetric[0] = m2;
    }
    m1 = metric[1] + m_pathMetric[0];
    m2 = metric[5] + m_pathMetric[2];
    if (m1 < m2) {
        m_pathMemory1[n] = 0;
        tempMetric[1] = m1;
    } else {
        m_pathMemory1[n] = 1;
        tempMetric[1] = m2;
    }
    m1 = metric[2] + m_pathMetric[1];
    m2 = metric[6] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory2[n] = 0;
        tempMetric[2] = m1;
    } else {
        m_pathMemory2[n] = 1;
        tempMetric[2] = m2;
    }
    m1 = metric[3] + m_pathMetric[1];
    m2 = metric[7] + m_pathMetric[3];
    if (m1 < m2) {
        m_pathMemory3[n] = 0;
        tempMetric[3] = m1;
    } else {
        m_pathMemory3[n] = 1;
        tempMetric[3] = m2;
    }
    for (loop = 0; loop < 4; loop++)
        m_pathMetric[loop] = tempMetric[loop];
}


function DStarHeader()
{
    this.m_rpt1 = "";
    this.m_rpt2 = "";
    this.m_yourSign = "";
    this.m_mySign = "";
    this.m_rpt1FromHD = false;
    this.m_rpt2FromHD = false;
    this.m_yourSignFromHD = false;
    this.m_mySignFromHD = false;
}

DStarHeader.prototype.clear = function()
{
    this.m_rpt1 = "";
    this.m_rpt2 = "";
    this.m_yourSign = "";
    this.m_mySign = "";
    this.m_rpt1FromHD = false;
    this.m_rpt2FromHD = false;
    this.m_yourSignFromHD = false;
    this.m_mySignFromHD = false;
}

DStarHeader.prototype.setRpt1 = function(rpt1, fromHD)
{
    if (!this.m_rpt1FromHD || fromHD) {
        this.m_rpt1 = String.fromCharCode.apply(null, [...rpt1.subarray(0, 8)]);
        this.m_rpt1FromHD = fromHD;
    }
}

DStarHeader.prototype.setRpt2 = function(rpt2, fromHD)
{
    if (!this.m_rpt2FromHD || fromHD) {
        this.m_rpt2 = String.fromCharCode.apply(null, [...rpt2.subarray(0, 8)]);
        this.m_rpt2FromHD = fromHD;
    }
}

DStarHeader.prototype.setYourSign = function(yourSign, fromHD)
{
    if (!this.m_yourSignFromHD || fromHD) {
        this.m_yourSign = String.fromCharCode.apply(null, [...yourSign.subarray(0, 8)]);
        this.m_yourSignFromHD = fromHD;
    }
}

DStarHeader.prototype.setMySign = function(mySign, mySignInfo, fromHD)
{
    if (!this.m_mySignFromHD || fromHD) {
        this.m_mySign = String.fromCharCode.apply(null, [...mySign.subarray(0, 8)]);
        this.m_mySign += "/";
        this.m_mySign += String.fromCharCode.apply(null, [...mySignInfo.subarray(0, 4)]);
        this.m_mySignFromHD = fromHD;
    }
}


function DStarSlowData()
{
    this.counter = 0;
    this.radioHeader = new Int8Array(41);
    this.radioHeaderIndex = 0;
    this.text = new Int8Array(21);
    this.textFrameIndex = 0;
    this.gpsNMEA = new Int8Array(256);
    this.gpsIndex = 0;
    this.gpsStart = false;
    this.locator = new Int8Array(7);
    this.bearing = 0;
    this.distance = 0;
    this.currentDataType = null;
}

DStarSlowData.prototype.init = function()
{
    this.counter = 0;
    this.radioHeaderIndex = 0;
    this.textFrameIndex = 0;
    this.radioHeader.fill(0);
    this.text.fill(0x20);
    this.text[20] = 0;
    this.gpsNMEA.fill(0);
    this.gpsIndex = 0;
    this.gpsStart = true;
    this.locator = " ".repeat(6);
    this.bearing = 0;
    this.distance = 0;
    this.currentDataType = DSDDstar.DStarSlowDataNone;
}


function DPRS()
{
    this.m_lon = 0;
    this.m_lat = 0;
    this.m_locPoint = new LocPoint();
}

DPRS.prototype.matchDSTAR = function(d)
{
    let pch;
    let latStr = "";
    let lonStr = "";
    let latH, lonH;
    let x, min, deg;
    let dd = String.fromCharCode.apply(null, [...d]);
    pch = dd.indexOf("DSTAR*:/");
    if (pch !== -1) {
        pch += 15;
        latStr = dd.substr(pch, 7);
        latH = dd.charAt(pch + 7);
        x = parseFloat(latStr);
        x /= 100;
        deg = x | 0;
        min = x - deg;
        this.m_lat = (deg + min * 100 / 60) * (latH === "N" ? 1 : -1);
        pch += 9;
        lonStr = dd.substr(pch, 8);
        lonH = dd.charAt(pch + 8);
        x = parseFloat(lonStr);
        x /= 100;
        deg = x | 0;
        min = x - deg;
        this.m_lon = (deg + min * 100 /60) * (lonH === "E" ? 1 : -1);
        this.m_locPoint.setLatLon(this.m_lat, this.m_lon);
        return true;
    } else
        return false;
}

DPRS.prototype.getCRC = function(d)
{
    let crcStr = String.fromCharCode.apply(null, [...d.subarray(0, 4)]);
    return parseInt(crcStr, 16);
}


function DSDDstar(dsdDecoder)
{
    this.DStarVoiceFrame = 0;
    this.DStarDataFrame = 1;
    this.DStarSyncFrame = 2;
    this.DStarSlowData0 = 0;
    this.DStarSlowData1 = 1;
    this.DStarSlowData2 = 2;
    this.DStarSlowDataGPS = 3;
    this.DStarSlowDataText = 4;
    this.DStarSlowDataHeader = 5;
    this.DStarSlowDataFiller = 6;
    this.DStarSlowDataNone = 7;
    this.m_crcDStar = new DStarCRC();
    this.nullBytes = new Uint8Array(4);
    this.slowdata = new Uint8Array(4);
    this.m_header = new DStarHeader();
    this.m_slowData = new DStarSlowData();
    this.m_dprs = new DPRS();
    this.m_dsdDecoder = dsdDecoder;
    this.m_voiceFrameCount = 0;
    this.m_frameType = this.DStarVoiceFrame;
    this.m_symbolIndex = 0;
    this.m_symbolIndexHD = 0;
    this.m_viterbi = new Viterbi3(2, Viterbi.Poly23a, false);
    this.m_crc = new CRC(CRC.PolyDStar16, 16, 0xffff, 0xffff, 1, 0, 0);
    this.slowdataIx = 0;
    this.n = 0;
    this.reset_header_strings();
    this.m_slowData.init();
}

DSDDstar.dW = new Int32Array([
                                 0, 0, 3, 2, 1, 1, 0, 0, 1, 1, 0, 0, 3, 2, 1, 1, 3, 2, 1, 1, 0, 0, 3, 2, 0, 0, 3, 2, 1, 1, 0, 0, 1, 1, 0, 0,
                                 3, 2, 1, 1, 3, 2, 1, 1, 0, 0, 3, 2, 0, 0, 3, 2, 1, 1, 0, 0, 1, 1, 0, 0, 3, 2, 1, 1,	3, 3, 2, 1,	0, 0, 3, 3
                             ]);
DSDDstar.dX = new Int32Array([
                                 10, 22, 11, 9, 10, 22, 11, 23, 8, 20, 9, 21, 10, 8, 9, 21, 8, 6, 7, 19, 8, 20, 9, 7, 6, 18, 7, 5, 6, 18,
                                 7, 19, 4, 16, 5, 17, 6, 4, 5, 17, 4, 2, 3, 15, 4, 16, 5, 3, 2, 14, 3, 1, 2, 14, 3, 15, 0, 12, 1, 13,
                                 2, 0, 1, 13, 0, 12, 10, 11, 0, 12, 1, 13
                             ]);
DSDDstar.m_terminationSequence = new Uint8Array([
                                                    3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
                                                    3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,
                                                    1, 1, 1, 3, 1, 1, 3, 3, 1, 3, 1, 3, 3, 3, 3, 1
                                                ]);

DSDDstar.prototype.init = function(header = false)
{
    if (header)
        this.m_dsdDecoder.m_voice1On = false;
    else {
        this.m_voiceFrameCount = 0;
        this.m_frameType = this.DStarVoiceFrame;
        this.m_dsdDecoder.m_voice1On = true;
    }
    this.m_symbolIndex = 0;
    this.m_symbolIndexHD = 0;
}

DSDDstar.prototype.process = function()
{
    if (this.m_frameType === this.DStarVoiceFrame)
        this.processVoice();
    else if (this.m_frameType === this.DStarDataFrame)
        this.processData();
    else if (this.m_frameType === this.DStarSyncFrame)
        this.processSync();
}

DSDDstar.prototype.processHD = function()
{
    if (this.m_symbolIndexHD === 659) {
        this.reset_header_strings();
        this.m_slowData.init();
        this.dstar_header_decode();
        this.init();
        this.m_frameType = this.DStarVoiceFrame;
        this.m_voiceFrameCount = 20;
        this.m_dsdDecoder.m_fsmState = DSDDecoder.DSDprocessDSTAR;
    } else
        this.m_symbolIndexHD++;
}

DSDDstar.prototype.getRpt1 = function()
{
    return this.m_header.m_rpt1;
}

DSDDstar.prototype.getRpt2 = function()
{
    return this.m_header.m_rpt2;
}

DSDDstar.prototype.getYourSign = function()
{
    return this.m_header.m_yourSign;
}

DSDDstar.prototype.getMySign = function()
{
    return this.m_header.m_mySign;
}

DSDDstar.prototype.getInfoText = function()
{
    return String.fromCharCode.apply(null, [...this.m_slowData.text]);
}

DSDDstar.prototype.getLocator = function()
{
    return String.fromCharCode.apply(null, [...this.m_slowData.locator]);
}

DSDDstar.prototype.getBearing = function()
{
    return this.m_slowData.bearing;
}

DSDDstar.prototype.getDistance = function()
{
    return this.m_slowData.distance;
}

DSDDstar.prototype.initVoiceFrame = function()
{
    this.m_dsdDecoder.ambe_fr.fill(0);
    this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, 9);
    this.n = 0;
}

DSDDstar.prototype.initDataFrame = function()
{
}

DSDDstar.prototype.processVoice = function()
{
    let bit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex === 0)
        this.initVoiceFrame();
    this.m_dsdDecoder.ambe_fr[24 * DSDDstar.dW[this.n] + DSDDstar.dX[this.n]] = (1 & bit);
    this.n++;
    this.storeSymbolDV(this.m_symbolIndex, (1 & bit));
    if (this.m_symbolIndex === 71) {
        this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
        this.m_dsdDecoder.m_mbeDVReady1 = true;
        this.m_symbolIndex = 0;
        if (this.m_voiceFrameCount < 20) {
            this.m_frameType = this.DStarDataFrame;
            this.m_voiceFrameCount++;
        } else
            this.m_frameType = this.DStarSyncFrame;
    } else
        this.m_symbolIndex++;
}

DSDDstar.prototype.processData = function()
{
    let bit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    if (this.m_symbolIndex === 0) {
        this.slowdata.fill(0);
        this.nullBytes.fill(0);
        this.slowdataIx = 0;
    } else if (this.m_symbolIndex % 8 === 0)
        this.slowdataIx++;
    this.slowdata[this.slowdataIx] += bit << (this.m_symbolIndex % 8);
    if (this.m_symbolIndex === 23) {
        if ((this.m_voiceFrameCount > 0) && (this.slowdata.toString() !== this.nullBytes.toString())) {
            this.slowdata[0] ^= 0x70;
            this.slowdata[1] ^= 0x4f;
            this.slowdata[2] ^= 0x93;
            this.processSlowData(this.m_voiceFrameCount === 1);
        }
        this.m_symbolIndex = 0;
        this.m_frameType = this.DStarVoiceFrame;
    } else
        this.m_symbolIndex++;
}

DSDDstar.prototype.processSlowData = function(firstFrame)
{
    if (firstFrame || (this.m_slowData.counter === 0)) {
        let dataType = (this.slowdata[0] >> 4) & 0xf;
        this.m_slowData.counter = this.slowdata[0] & 0xf;
        if (dataType > 6)
            this.m_slowData.currentDataType = this.DStarSlowDataNone;
        else if (dataType === 6) {
            this.m_slowData.currentDataType = this.DStarSlowDataFiller;
            this.m_slowData.counter = 2;
        } else if (dataType === 4) {
            this.m_slowData.textFrameIndex = this.m_slowData.counter % 4;
            this.m_slowData.counter = 5;
            this.m_slowData.currentDataType = dataType;
        } else
            this.m_slowData.currentDataType = dataType;
        if (firstFrame) {
            this.m_slowData.radioHeaderIndex = 0;
            switch (this.m_slowData.currentDataType) {
            case this.DStarSlowDataHeader:
                if (!this.m_slowData.gpsStart)
                    this.processDPRS();
                this.m_slowData.gpsStart = true;
                break;
            case this.DStarSlowDataText:
                if (!this.m_slowData.gpsStart)
                    this.processDPRS();
                this.m_slowData.gpsStart = true;
                break;
            case this.DStarSlowDataGPS:
                if (this.m_slowData.gpsStart) {
                    this.m_slowData.gpsIndex = 0;
                    this.m_slowData.gpsStart = false;
                }
                break;
            default:
                break;
            }
        }
    } else {
        if (this.m_slowData.counter > 0) {
            this.processSlowDataByte(this.slowdata[0]);
            this.m_slowData.counter--;
        }
    }
    if (this.m_slowData.counter > 0) {
        this.processSlowDataByte(this.slowdata[1]);
        this.m_slowData.counter--;
    }
    if (this.m_slowData.counter > 0) {
        this.processSlowDataByte(this.slowdata[2]);
        this.m_slowData.counter--;
    }
    this.processSlowDataGroup();
}

DSDDstar.prototype.processSlowDataByte = function(byte)
{
    switch (this.m_slowData.currentDataType) {
    case this.DStarSlowDataHeader:
        if (this.m_slowData.radioHeaderIndex < 41) {
            this.m_slowData.radioHeader[this.m_slowData.radioHeaderIndex] = byte < 32 || byte > 127 ? 46 : byte;
            this.m_slowData.radioHeaderIndex++;
        }
        break;
    case this.DStarSlowDataText:
        this.m_slowData.text[5 * this.m_slowData.textFrameIndex + 5 - this.m_slowData.counter] = byte < 32 || byte > 127 ? 46 : byte;
        break;
    case this.DStarSlowDataGPS:
        this.m_slowData.gpsNMEA[this.m_slowData.gpsIndex] = byte;
        this.m_slowData.gpsIndex++;
        break;
    default:
        break;
    }
}

DSDDstar.prototype.processSlowDataGroup = function()
{
    switch (this.m_slowData.currentDataType) {
    case this.DStarSlowDataHeader:
        if (this.m_slowData.radioHeaderIndex === 41) {
            if (this.m_crcDStar.check_crc(this.m_slowData.radioHeader, 41)) {
                this.m_header.setRpt2(this.m_slowData.radioHeader.subarray(3), false);
                this.m_header.setRpt1(this.m_slowData.radioHeader.subarray(11), false);
                this.m_header.setYourSign(this.m_slowData.radioHeader.subarray(19), false);
                this.m_header.setMySign(this.m_slowData.radioHeader.subarray(27), this.m_slowData.radioHeader.subarray(35), false);
            }
            this.m_slowData.radioHeaderIndex = 0;
        }
        break;
    case this.DStarSlowDataText:
        this.m_slowData.text[20] = 0;
        break;
    default:
        break;
    }
}

DSDDstar.prototype.processDPRS = function()
{
    this.m_slowData.gpsNMEA[this.m_slowData.gpsIndex] = 0;
    if (String.fromCharCode.apply(null, [...this.m_slowData.gpsNMEA.subarray(0, 5)]) === "$$CRC") {
        let crcOK = this.m_crcDStar.check_crc(new Uint8Array(this.m_slowData.gpsNMEA.subarray(10)), this.m_slowData.gpsNMEA.indexOf(0) - 10, this.m_dprs.getCRC(this.m_slowData.gpsNMEA.subarray(5)));
        if (crcOK)
            if (this.m_dprs.matchDSTAR(this.m_slowData.gpsNMEA)) {
                this.m_dprs.m_locPoint.getLocator().toCSting(this.m_slowData.locator);
                this.m_slowData.bearing = this.m_dsdDecoder.m_myPoint.bearingTo(this.m_dprs.m_locPoint) | 0;
                this.m_slowData.distance = this.m_dsdDecoder.m_myPoint.distanceTo(this.m_dprs.m_locPoint);
            }
    }
}

DSDDstar.prototype.processSync = function()
{
    if (this.m_symbolIndex >= 72) {
        this.m_dsdDecoder.m_voice1On = false;
        this.reset_header_strings();
        this.m_slowData.init();
        this.m_dsdDecoder.resetFrameSync();
        return;
    }
    if (this.m_symbolIndex >= 12) {
        let syncEngine = new DSDSync();
        let patterns = [DSDSync.SyncDStar];
        syncEngine.matchSome(this.m_dsdDecoder.m_dsdSymbol.getNonInvertedSyncDibitBack(24), 24, patterns, 1);
        if (syncEngine.isMatching(DSDSync.SyncDStar)) {
            this.m_symbolIndex = 0;
            this.m_voiceFrameCount = 0;
            this.m_frameType = this.DStarVoiceFrame;
            return;
        }
    }
    if (this.m_symbolIndex >= 36)
        if (String.fromCharCode.apply(null, [...this.m_dsdDecoder.m_dsdSymbol.getNonInvertedSyncDibitBack(48).subarray(48)]) === String.fromCharCode.apply(null, [...DSDDstar.m_terminationSequence])) {
            this.m_dsdDecoder.m_voice1On = false;
            this.reset_header_strings();
            this.m_slowData.init();
            this.m_dsdDecoder.resetFrameSync();
            return;
        }
    this.m_symbolIndex++;
}

DSDDstar.prototype.dstar_header_decode = function()
{
    let radioheaderbuffer2 = new Uint8Array(660);
    let radioheaderbuffer3 = new Uint8Array(660);
    let radioheader = new Uint8Array(41);
    let octetcount, bitcount;
    let bit2octet = new Uint8Array([0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80]);
    Descramble.scramble(this.m_dsdDecoder.m_dsdSymbol.getDibitBack(660), radioheaderbuffer2);
    Descramble.deinterleave(radioheaderbuffer2, radioheaderbuffer3);
    this.m_viterbi.decodeFromBits(radioheaderbuffer2, radioheaderbuffer3, 660, 0);
    radioheader.fill(0);
    octetcount = 0;
    bitcount = 0;
    for (let i = 0; i < 328; i++) {
        if (radioheaderbuffer2[i])
            radioheader[octetcount] |= bit2octet[bitcount];
        bitcount++;
        if (bitcount >= 8) {
            octetcount++;
            bitcount = 0;
        }
    }
    this.m_header.setRpt2(radioheader.subarray(3), true);
    this.m_header.setRpt1(radioheader.subarray(11), true);
    this.m_header.setYourSign(radioheader.subarray(19), true);
    this.m_header.setMySign(radioheader.subarray(27), radioheader.subarray(35), true);
}

DSDDstar.prototype.reset_header_strings = function()
{
    this.m_header.clear();
}

DSDDstar.prototype.storeSymbolDV = function(bitindex, bit, lsbFirst = true)
{
    if (lsbFirst)
        this.m_dsdDecoder.m_mbeDVFrame1[(bitindex / 8) | 0] |= bit << (bitindex % 8);
    else
        this.m_dsdDecoder.m_mbeDVFrame1[(8 - (bitindex / 8)) | 0] |= bit << (7 - (bitindex % 8));
}


function AdjacentSiteInformation()
{
    this.m_siteNumber = 0;
    this.m_locationId = 0;
    this.m_channelNumber = 0;
}

function Message()
{
    this.m_data = new Uint8Array(22);
    this.m_shift = 0;
}

Message.NXDN_MESSAGE_TYPE_VCALL            = 0x01;
Message.NXDN_MESSAGE_TYPE_VCALL_IV         = 0x03;
Message.NXDN_MESSAGE_TYPE_DCALL_HDR        = 0x09;
Message.NXDN_MESSAGE_TYPE_DCALL_DATA       = 0x0b;
Message.NXDN_MESSAGE_TYPE_DCALL_ACK        = 0x0c;
Message.NXDN_MESSAGE_TYPE_TX_REL           = 0x08;
Message.NXDN_MESSAGE_TYPE_HEAD_DLY         = 0x0f;
Message.NXDN_MESSAGE_TYPE_SDCALL_REQ_HDR   = 0x38;
Message.NXDN_MESSAGE_TYPE_SDCALL_REQ_DATA  = 0x39;
Message.NXDN_MESSAGE_TYPE_SDCALL_RESP      = 0x3b;
Message.NXDN_MESSAGE_TYPE_SDCALL_IV        = 0x3a;
Message.NXDN_MESSAGE_TYPE_STAT_INQ_REQ     = 0x30;
Message.NXDN_MESSAGE_TYPE_STAT_INQ_RESP    = 0x31;
Message.NXDN_MESSAGE_TYPE_STAT_REQ         = 0x32;
Message.NXDN_MESSAGE_TYPE_STAT_RESP        = 0x33;
Message.NXDN_MESSAGE_TYPE_REM_CON_REQ      = 0x34;
Message.NXDN_MESSAGE_TYPE_REM_CON_RESP     = 0x35;
Message.NXDN_MESSAGE_TYPE_IDLE             = 0x10;
Message.NXDN_MESSAGE_TYPE_AUTH_INQ_REQ     = 0x28;
Message.NXDN_MESSAGE_TYPE_AUTH_INQ_RESP    = 0x29;
Message.NXDN_MESSAGE_TYPE_PROP_FORM        = 0x3f;
Message.NXDN_MESSAGE_TYPE_VCALL_ASSGN      = 0x04;
Message.NXDN_MESSAGE_TYPE_SRV_INFO         = 0x19;
Message.NXDN_MESSAGE_TYPE_SITE_INFO        = 0x18;
Message.NXDN_MESSAGE_TYPE_ADJ_SITE_INFO    = 0x1b;
Message.NXDN_MESSAGE_TYPE_GRP_REG_REQ_RESP = 0x24;
Message.NXDN_MESSAGE_TYPE_VCALL_REQ        = 0x01;
Message.NXDN_MESSAGE_TYPE_VCALL_RESP       = 0x01;
Message.NXDN_MESSAGE_TYPE_VCALL_REC_REQ    = 0x02;
Message.NXDN_MESSAGE_TYPE_VCALL_REC_RESP   = 0x02;
Message.NXDN_MESSAGE_TYPE_VCALL_CONN_REQ   = 0x03;
Message.NXDN_MESSAGE_TYPE_VCALL_CONN_RESP  = 0x03;
Message.NXDN_MESSAGE_TYPE_VCALL_ASSGN_DUP  = 0x05;

Message.prototype.reset = function()
{
    this.m_data.fill(0);
}

Message.prototype.setMessageIndex = function(index)
{
    if (index < 2)
        this.m_shift = index * 9;
}

Message.prototype.setFromSACCH = function(index, data)
{
    if (index === 0) {
        this.m_data[0] = data[0];
        this.m_data[1] = data[1];
        this.m_data[2] = data[2];
    } else if (index === 1) {
        this.m_data[2] = (this.m_data[2] & 0xc0) + (data[0] >> 2);
        this.m_data[3] = ((data[0] & 0x03) << 6) + (data[1] >> 2);
        this.m_data[4] = ((data[1] & 0x03) << 6) + (data[2] >> 2);
    } else if (index === 2) {
        this.m_data[4] = (this.m_data[4] & 0xf0) + (data[0] >> 4);
        this.m_data[5] = ((data[0] & 0x0f) << 4) + (data[1] >> 4);
        this.m_data[6] = ((data[1] & 0x0f) << 4) + (data[2] >> 4);
    } else if (index === 3) {
        this.m_data[6] = (this.m_data[6] & 0xfc) + (data[0] >> 6);
        this.m_data[7] = ((data[0] & 0x3f) << 2) + (data[1] >> 6);
        this.m_data[8] = ((data[1] & 0x3f) << 2) + (data[2] >> 6);
    }
    this.m_shift = 0;
}

Message.prototype.setFromFACCH1 = function(data)
{
    this.m_data.set(data.subarray(0, 10));
    this.m_shift = 0;
}

Message.prototype.setFromFACCH2 = function(data)
{
    this.m_data.set(data.subarray(0, 22));
    this.m_shift = 0;
}

Message.prototype.setFromCAC = function(data)
{
    this.m_data.set(data.subarray(0, 18));
    this.m_shift = 0;
}

Message.prototype.setFromCACShort = function(data)
{
    this.m_data.set(data.subarray(0, 12));
    this.m_shift = 0;
}

Message.prototype.setFromCACLong = function(data)
{
    this.m_data.set(data.subarray(0, 16));
    this.m_shift = 0;
}

Message.prototype.getMessageType = function()
{
    return this.m_data[this.m_shift] & 0x3f;
}

Message.prototype.getSourceUnitId = function(id)
{
    if (this.hasCallDetails()) {
        global1 = (this.m_data[3 + this.m_shift] << 8) | this.m_data[4 + this.m_shift];
        return true;
    } else
        return false;
}

Message.prototype.getDestinationGroupId = function(id)
{
    if (this.hasCallDetails()) {
        global1 = (this.m_data[5 + this.m_shift] << 8) | this.m_data[6 + this.m_shift];
        return true;
    } else
        return false;
}

Message.prototype.isGroupCall = function(sw)
{
    if (this.hasCallDetails()) {
        global1 = (this.m_data[2 + this.m_shift] & 0x80) !== 0x80;
        return true;
    } else
        return false;
}

Message.prototype.getLocationId = function(id)
{
    let ret;
    switch(this.getMessageType()) {
    case Message.NXDN_MESSAGE_TYPE_SITE_INFO:
        global1 = (this.m_data[1 + this.m_shift] << 16) | (this.m_data[2 + this.m_shift] << 8) | this.m_data[3 + this.m_shift];
        ret = true;
        break;
    case Message.NXDN_MESSAGE_TYPE_SRV_INFO:
        global1 = (this.m_data[1 + this.m_shift] << 16) | (this.m_data[2 + this.m_shift] << 8) | this.m_data[3 + this.m_shift];
        ret = true;
        break;
    default:
        ret = false;
        break;
    }
    return ret;
}

Message.prototype.getServiceInformation = function(sibits)
{
    let ret;
    switch(this.getMessageType()) {
    case Message.NXDN_MESSAGE_TYPE_SITE_INFO:
        global1 = (this.m_data[6 + this.m_shift] << 8) | this.m_data[7 + this.m_shift];
        ret = true;
        break;
    case Message.NXDN_MESSAGE_TYPE_SRV_INFO:
        global1 = (this.m_data[4 + this.m_shift] << 8) | this.m_data[5 + this.m_shift];
        ret = true;
        break;
    default:
        ret = false;
        break;
    }
    return ret;
}

Message.prototype.getAdjacentSitesInformation = function(adjacentSites, nbSitesToGet)
{
    if (this.getMessageType() === Message.NXDN_MESSAGE_TYPE_ADJ_SITE_INFO) {
        let siteIndex;
        for (let i = 0; i < nbSitesToGet; i++) {
            siteIndex = (this.m_data[4 + this.m_shift + 5 * i] >> 2) & 0xf;
            adjacentSites[siteIndex].m_siteNumber = siteIndex;
            adjacentSites[siteIndex].m_channelNumber = this.m_data[5 + this.m_shift + 5 * i] + ((this.m_data[4 + this.m_shift + 5 * i] & 0x3) << 8);
            adjacentSites[siteIndex].m_locationId = (this.m_data[1 + this.m_shift + 5 * i] << 16) + (this.m_data[2 + this.m_shift + 5 * i] << 8) + this.m_data[3 + this.m_shift + 5 * i];
        }
        return true;
    } else
        return false;
}

Message.prototype.isFullRate = function(fullRate)
{
    let ret;
    switch(this.getMessageType()) {
    case Message.NXDN_MESSAGE_TYPE_VCALL:
    case Message.NXDN_MESSAGE_TYPE_VCALL_REC_REQ:
    case Message.NXDN_MESSAGE_TYPE_VCALL_CONN_REQ:
    case Message.NXDN_MESSAGE_TYPE_VCALL_ASSGN:
    case Message.NXDN_MESSAGE_TYPE_VCALL_ASSGN_DUP:
        global1 = this.m_data[2 + this.m_shift] & 1;
        ret = true;
        break;
    default:
        ret = false;
        break;
    }
    return ret;
}

Message.prototype.hasCallDetails = function()
{
    let ret;
    switch(this.getMessageType()) {
    case Message.NXDN_MESSAGE_TYPE_VCALL:
    case Message.NXDN_MESSAGE_TYPE_DCALL_HDR:
    case Message.NXDN_MESSAGE_TYPE_DCALL_ACK:
    case Message.NXDN_MESSAGE_TYPE_TX_REL:
    case Message.NXDN_MESSAGE_TYPE_HEAD_DLY:
    case Message.NXDN_MESSAGE_TYPE_SDCALL_REQ_HDR:
    case Message.NXDN_MESSAGE_TYPE_SDCALL_RESP:
    case Message.NXDN_MESSAGE_TYPE_STAT_INQ_REQ:
    case Message.NXDN_MESSAGE_TYPE_STAT_INQ_RESP:
    case Message.NXDN_MESSAGE_TYPE_STAT_REQ:
    case Message.NXDN_MESSAGE_TYPE_STAT_RESP:
    case Message.NXDN_MESSAGE_TYPE_REM_CON_REQ:
    case Message.NXDN_MESSAGE_TYPE_REM_CON_RESP:
    case Message.NXDN_MESSAGE_TYPE_AUTH_INQ_REQ:
    case Message.NXDN_MESSAGE_TYPE_AUTH_INQ_RESP:
        ret = true;
        break;
    default:
        ret = false;
        break;
    }
    return ret;
}

Message.prototype.hasGroupCallInfo = function()
{
    let ret;
    switch(this.getMessageType()) {
    case Message.NXDN_MESSAGE_TYPE_VCALL:
    case Message.NXDN_MESSAGE_TYPE_DCALL_HDR:
    case Message.NXDN_MESSAGE_TYPE_DCALL_ACK:
    case Message.NXDN_MESSAGE_TYPE_TX_REL:
    case Message.NXDN_MESSAGE_TYPE_HEAD_DLY:
    case Message.NXDN_MESSAGE_TYPE_SDCALL_REQ_HDR:
    case Message.NXDN_MESSAGE_TYPE_SDCALL_RESP:
    case Message.NXDN_MESSAGE_TYPE_STAT_INQ_REQ:
    case Message.NXDN_MESSAGE_TYPE_STAT_INQ_RESP:
    case Message.NXDN_MESSAGE_TYPE_STAT_REQ:
    case Message.NXDN_MESSAGE_TYPE_STAT_RESP:
    case Message.NXDN_MESSAGE_TYPE_REM_CON_REQ:
    case Message.NXDN_MESSAGE_TYPE_REM_CON_RESP:
        ret = true;
        break;
    default:
        ret = false;
        break;
    }
    return ret;
}


function CNXDNConvolution()
{
    this.m_metrics1 = new Uint16Array(16);
    this.m_metrics2 = new Uint16Array(16);
    this.m_oldMetrics = null;
    this.m_newMetrics = null;
    this.m_decisions = new Uint32Array(300);
    this.m_dp = 0;
}

CNXDNConvolution.BIT_MASK_TABLE = new Uint8Array([0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]);
CNXDNConvolution.BRANCH_TABLE1 = new Uint8Array([0, 0, 0, 0, 2, 2, 2, 2]);
CNXDNConvolution.BRANCH_TABLE2 = new Uint8Array([0, 2, 2, 0, 0, 2, 2, 0]);
CNXDNConvolution.NUM_OF_STATES_D2 = 8;
CNXDNConvolution.NUM_OF_STATES = 16;
CNXDNConvolution.M = 4;
CNXDNConvolution.K = 5;

CNXDNConvolution.prototype.WRITE_BIT1 = function(p, i, b)
{
    p[i >> 3] = b ? p[i >> 3] | CNXDNConvolution.BIT_MASK_TABLE[i & 7] : p[i >> 3] & ~CNXDNConvolution.BIT_MASK_TABLE[i & 7];
}

CNXDNConvolution.prototype.READ_BIT1 = function(p, i)
{
    return p[i >> 3] & CNXDNConvolution.BIT_MASK_TABLE[i & 7];
}

CNXDNConvolution.prototype.start = function()
{
    this.m_metrics1.fill(0);
    this.m_metrics2.fill(0);
    this.m_oldMetrics = this.m_metrics1;
    this.m_newMetrics = this.m_metrics2;
    this.m_dp = 0;
}

CNXDNConvolution.prototype.decode = function(s0, s1)
{
    this.m_decisions[this.m_dp] = 0;
    for (let i = 0; i < CNXDNConvolution.NUM_OF_STATES_D2; i++) {
        let j = i * 2;
        let metric = Math.abs(CNXDNConvolution.BRANCH_TABLE1[i] - s0) + Math.abs(CNXDNConvolution.BRANCH_TABLE2[i] - s1);
        let m0 = this.m_oldMetrics[i] + metric;
        let m1 = this.m_oldMetrics[i + CNXDNConvolution.NUM_OF_STATES_D2] + CNXDNConvolution.M - metric;
        let decision0 = (m0 >= m1) ? 1 : 0;
        this.m_newMetrics[j] = decision0 !== 0 ? m1 : m0;
        m0 = this.m_oldMetrics[i] + (CNXDNConvolution.M - metric);
        m1 = this.m_oldMetrics[i + CNXDNConvolution.NUM_OF_STATES_D2] + metric;
        let decision1 = (m0 >= m1) ? 1 : 0;
        this.m_newMetrics[j + 1] = decision1 !== 0 ? m1 : m0;
        this.m_decisions[this.m_dp] |= (decision1 << (j + 1)) | (decision0 << j);
    }
    ++this.m_dp;
    let tmp = this.m_oldMetrics;
    this.m_oldMetrics = this.m_newMetrics;
    this.m_newMetrics = tmp;
}

CNXDNConvolution.prototype.chainback = function(out, nBits)
{
    let state = 0;
    let i, bit;
    while (nBits-- > 0) {
        --this.m_dp;
        i = state >> (9 - CNXDNConvolution.K);
        bit = ((this.m_decisions[this.m_dp] >> i) | 0) & 1;
        state = (bit << 7) | (state >> 1);
        this.WRITE_BIT1(out, nBits, bit !== 0);
    }
}

CNXDNConvolution.prototype.encode = function(inn, out, nBits)
{
    let d1 = 0, d2 = 0, d3 = 0, d4 = 0;
    let k = 0;
    let d, g1, g2;
    for (let i = 0; i < nBits; i++) {
        d = this.READ_BIT1(inn, i) ? 1 : 0;
        g1 = (d + d3 + d4) & 1;
        g2 = (d + d1 + d2 + d4) & 1;
        d4 = d3;
        d3 = d2;
        d2 = d1;
        d1 = d;
        this.WRITE_BIT1(out, k, g1 !== 0);
        k++;
        this.WRITE_BIT1(out, k, g2 !== 0);
        k++;
    }
}


function CNXDNCRC()
{
}

CNXDNCRC.BIT_MASK_TABLE1 = new Uint8Array([0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]);

CNXDNCRC.WRITE_BIT1 = function(p ,i ,b)
{
    p[i >> 3] = b ? (p[i >> 3] | CNXDNCRC.BIT_MASK_TABLE1[i & 7]) : (p[i >> 3] & ~CNXDNCRC.BIT_MASK_TABLE1[i & 7]);
}

CNXDNCRC.READ_BIT1 = function(p, i)
{
    return (p[i >> 3] & CNXDNCRC.BIT_MASK_TABLE1[i & 7]);
}

CNXDNCRC.checkCRC6 = function(inn, length)
{
    let crc = this.createCRC6(inn, length);
    let temp = new Uint8Array(1);
    temp[0] = 0x00;
    let j = length;
    for (let i = 2; i < 8; i++, j++)
        CNXDNCRC.WRITE_BIT1(temp, i, CNXDNCRC.READ_BIT1(inn, j));
    return crc === temp[0];
}

CNXDNCRC.encodeCRC6 = function(inn, length)
{
    let crc = new Uint8Array(1);
    crc[0] = this.createCRC6(inn, length);
    let n = length;
    for (let i = 2; i < 8; i++, n++)
        CNXDNCRC.WRITE_BIT1(inn, n, CNXDNCRC.READ_BIT1(crc, i));
}

CNXDNCRC.checkCRC12 = function(inn, length)
{
    let crc = this.createCRC12(inn, length);
    let temp1 = new Uint8Array(2);
    temp1[0] = (crc >> 8) & 0xff;
    temp1[1] = (crc >> 0) & 0xff;
    let temp2 = new Uint8Array(2);
    temp2[0] = 0x00;
    temp2[1] = 0x00;
    let j = length;
    for (let i = 4; i < 16; i++, j++)
        CNXDNCRC.WRITE_BIT1(temp2, i, CNXDNCRC.READ_BIT1(inn, j));
    return temp1[0] === temp2[0] && temp1[1] === temp2[1];
}

CNXDNCRC.encodeCRC12 = function(inn, length)
{
    let crc = this.createCRC12(inn, length);
    let temp = new Uint8Array(2);
    temp[0] = (crc >> 8) & 0xff;
    temp[1] = (crc >> 0) & 0xff;
    let n = length;
    for (let i = 4; i < 16; i++, n++)
        CNXDNCRC.WRITE_BIT1(inn, n, CNXDNCRC.READ_BIT1(temp, i));
}

CNXDNCRC.checkCRC15 = function(inn, length)
{
    let crc = this.createCRC15(inn, length);
    let temp1 = new Uint8Array(2);
    temp1[0] = (crc >> 8) & 0xff;
    temp1[1] = (crc >> 0) & 0xff;
    let temp2 = new Uint8Array(2);
    temp2[0] = 0x00;
    temp2[1] = 0x00;
    let j = length;
    for (let i = 1; i < 16; i++, j++)
        CNXDNCRC.WRITE_BIT1(temp2, i, CNXDNCRC.READ_BIT1(inn, j));
    return temp1[0] === temp2[0] && temp1[1] === temp2[1];
}

CNXDNCRC.encodeCRC15 = function(inn, length)
{
    let crc = this.createCRC15(inn, length);
    let temp = new Uint8Array(2);
    temp[0] = (crc >> 8) & 0xff;
    temp[1] = (crc >> 0) & 0xff;
    let n = length;
    for (let i = 1; i < 16; i++, n++)
        CNXDNCRC.WRITE_BIT1(inn, n, CNXDNCRC.READ_BIT1(temp, i));
}

CNXDNCRC.checkCRC16 = function(inn, length)
{
    let crc = this.createCRC16(inn, length);
    let temp1 = new Uint8Array(2);
    temp1[0] = (crc >> 8) & 0xff;
    temp1[1] = (crc >> 0) & 0xff;
    let temp2 = new Uint8Array(2);
    temp2[0] = 0x00;
    temp2[1] = 0x00;
    for (let i = 0, j = length; i < 16; i++, j++)
        CNXDNCRC.WRITE_BIT1(temp2, i, CNXDNCRC.READ_BIT1(inn, j));
    return temp1[0] === temp2[0] && temp1[1] === temp2[1];
}

CNXDNCRC.encodeCRC16 = function(inn, length)
{
    let crc = this.createCRC16(inn, length);
    let temp = new Uint8Array(2);
    temp[0] = (crc >> 8) & 0xff;
    temp[1] = (crc >> 0) & 0xff;
    let n = length;
    for (let i = 1; i < 16; i++, n++)
        CNXDNCRC.WRITE_BIT1(inn, n, CNXDNCRC.READ_BIT1(temp, i));
}

CNXDNCRC.createCRC6 = function(inn, length)
{
    let crc = 0x3f;
    let bit1, bit2;
    for (let i = 0; i < length; i++) {
        bit1 = CNXDNCRC.READ_BIT1(inn, i) !== 0x00;
        bit2 = (crc & 0x20) === 0x20;
        crc <<= 1;
        if (bit1 ^ bit2)
            crc ^= 0x27;
    }
    return crc & 0x3f;
}

CNXDNCRC.createCRC12 = function(inn, length)
{
    let crc = 0x0fff;
    let bit1, bit2;
    for (let i = 0; i < length; i++) {
        bit1 = CNXDNCRC.READ_BIT1(inn, i) !== 0x00;
        bit2 = (crc & 0x0800) === 0x0800;
        crc <<= 1;
        if (bit1 ^ bit2)
            crc ^= 0x080f;
    }
    return crc & 0x0fff;
}

CNXDNCRC.createCRC15 = function(inn, length)
{
    let crc = 0x7fff;
    let bit1, bit2;
    for (let i = 0; i < length; i++) {
        bit1 = CNXDNCRC.READ_BIT1(inn, i) !== 0x00;
        bit2 = (crc & 0x4000) === 0x4000;
        crc <<= 1;
        if (bit1 ^ bit2)
            crc ^= 0x4cc5;
    }
    return crc & 0x7fff;
}

CNXDNCRC.createCRC16 = function(inn, length)
{
    let crc = 0xffff;
    let bit1, bit2;
    for (let i = 0; i < length; i++) {
        bit1 = CNXDNCRC.READ_BIT1(inn, i) !== 0x00;
        bit2 = (crc & 0x8000) === 0x8000;
        crc <<= 1;
        if (bit1 ^ bit2)
            crc ^= 0x1021;
    }
    return crc & 0xffff;
}


function NXDNLICH()
{
    this.rfChannelCode = 0;
    this.fnChannelCode = 0;
    this.optionCode = 0;
    this.direction = 0;
    this.parity = 0;
}


function FnChannel()
{
    this.m_nbPuncture = 0;
    this.m_rawSize = 0;
    this.m_bufRaw = null;
    this.m_bufTmp = null;
    this.m_interleave = null;
    this.m_punctureList = null;
    this.reset();
}

FnChannel.prototype.reset = function()
{
    this.m_index = 0;
}

FnChannel.prototype.pushDibit = function(dibit)
{
    this.m_bufRaw[this.m_interleave[this.m_index++]] = (dibit & 2) >> 1;
    this.m_bufRaw[this.m_interleave[this.m_index++]] = dibit & 1;
}

FnChannel.prototype.unpuncture = function()
{
    if (this.m_nbPuncture === 0)
        return;
    let index, punctureIndex, i;
    for (index = 0, punctureIndex = 0, i = 0; i < this.m_rawSize; i++) {
        if (index === this.m_punctureList[punctureIndex]) {
            this.m_bufTmp[index++] = 1;
            punctureIndex++;
        }
        this.m_bufTmp[index++] = this.m_bufRaw[i] << 1;
    }
    for (i = 0; i < 8; i++)
        this.m_bufTmp[index++] = 0;
}


function SACCH()
{
    FnChannel.call(this);
    this.m_sacchRaw = new Uint8Array(60);
    this.m_temp = new Uint8Array(90);
    this.m_data = new Uint8Array(5);
    this.m_message = new Message();
    this.m_rawSize = 60;
    this.m_nbPuncture = 12;
    this.m_bufRaw = this.m_sacchRaw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = SACCH.m_Interleave;
    this.m_punctureList = SACCH.m_PunctureList;
    this.m_message.reset();
    this.m_decodeCount = 0;
}

SACCH.prototype = Object.create(FnChannel.prototype);
SACCH.prototype.constructor = SACCH;

SACCH.m_Interleave = new Int32Array([
                                        0, 12, 24, 36, 48,
                                        1, 13, 25, 37, 49,
                                        2, 14, 26, 38, 50,
                                        3, 15, 27, 39, 51,
                                        4, 16, 28, 40, 52,
                                        5, 17, 29, 41, 53,
                                        6, 18, 30, 42, 54,
                                        7, 19, 31, 43, 55,
                                        8, 20, 32, 44, 56,
                                        9, 21, 33, 45, 57,
                                        10, 22, 34, 46, 58,
                                        11, 23, 35, 47, 59
                                    ]);
SACCH.m_PunctureList = new Int32Array([5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71]);

SACCH.prototype.decode = function()
{
    let conv = new CNXDNConvolution();
    conv.start();
    let n = 0;
    let s0, s1;
    for (let i = 0; i < 40; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 36);
    if (!CNXDNCRC.checkCRC6(this.m_data, 26)) {
        if (this.m_decodeCount >= 0)
            this.m_decodeCount = -1;
        return false;
    } else {
        if (this.getCountdown() === 3)
            this.m_decodeCount = 3;
        else
            this.m_decodeCount--;
        this.m_message.setFromSACCH(3 - this.getCountdown(), this.m_data.subarray(1));
        return true;
    }
}

SACCH.prototype.getRAN = function()
{
    return this.m_data[0] & 0x3f;
}

SACCH.prototype.getCountdown = function()
{
    return (this.m_data[0] >> 6) & 0x03;
}

SACCH.prototype.getDecodeCount = function()
{
    return this.m_decodeCount;
}

SACCH.prototype.getMessage = function()
{
    return this.m_message;
}


function CACOutbound()
{
    FnChannel.call(this);
    this.m_cacRaw = new Int8Array(300);
    this.m_temp = new Int8Array(420);
    this.m_data = new Int8Array(22);
    this.m_rawSize = 300;
    this.m_nbPuncture = 50;
    this.m_bufRaw = this.m_cacRaw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = CACOutbound.m_Interleave;
    this.m_punctureList = CACOutbound.m_PunctureList;
}

CACOutbound.prototype = Object.create(FnChannel.prototype);
CACOutbound.prototype.constructor = CACOutbound;

CACOutbound.m_Interleave = new Int32Array([
                                              0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288,
                                              1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121, 133, 145, 157, 169, 181, 193, 205, 217, 229, 241, 253, 265, 277, 289,
                                              2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122, 134, 146, 158, 170, 182, 194, 206, 218, 230, 242, 254, 266, 278, 290,
                                              3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 267, 279, 291,
                                              4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 208, 220, 232, 244, 256, 268, 280, 292,
                                              5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125, 137, 149, 161, 173, 185, 197, 209, 221, 233, 245, 257, 269, 281, 293,
                                              6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246, 258, 270, 282, 294,
                                              7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127, 139, 151, 163, 175, 187, 199, 211, 223, 235, 247, 259, 271, 283, 295,
                                              8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200, 212, 224, 236, 248, 260, 272, 284, 296,
                                              9, 21, 33, 45, 57, 69, 81, 93, 105, 117, 129, 141, 153, 165, 177, 189, 201, 213, 225, 237, 249, 261, 273, 285, 297,
                                              10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 298,
                                              11, 23, 35, 47, 59, 71, 83, 95, 107, 119, 131, 143, 155, 167, 179, 191, 203, 215, 227, 239, 251, 263, 275, 287, 299
                                          ]);
CACOutbound.m_PunctureList = new Int32Array([5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71]);

CACOutbound.prototype.decode = function()
{
    let conv = new CNXDNConvolution();
    conv.start();
    let n = 0;
    let so, s1;
    for (let i = 0; i < 179; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 175);
    return CNXDNCRC.checkCRC16(this.m_data, 155);
}

CACOutbound.prototype.getRAN = function()
{
    return this.m_data[0] & 0x3f;
}

CACOutbound.prototype.isHeadOfSuperframe = function()
{
    return (this.m_data[0] & 0x80) === 0x80;
}

CACOutbound.prototype.hasDualMessageFormat = function()
{
    return (this.m_data[0] & 0x40) === 0x40;
}

CACOutbound.prototype.getMessageType = function()
{
    return this.m_data[1] & 0x3f;
}

CACOutbound.prototype.getData = function()
{
    return this.m_data;
}


function CACLong()
{
    FnChannel.call(this);
    this.m_cacRaw = new Int8Array(252);
    this.m_temp = new Int8Array(420);
    this.m_data = new Int8Array(20);
    this.m_rawSize = 252;
    this.m_nbPuncture = 60;
    this.m_bufRaw = this.m_cacRaw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = CACLong.m_Interleave;
    this.m_punctureList = CACLong.m_PunctureList;
}

CACLong.prototype = Object.create(FnChannel.prototype);
CACLong.prototype.constructor = CACLong;

CACLong.m_Interleave = new Int32Array([
                                          0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240,
                                          1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121, 133, 145, 157, 169, 181, 193, 205, 217, 229, 241,
                                          2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122, 134, 146, 158, 170, 182, 194, 206, 218, 230, 242,
                                          3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243,
                                          4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 208, 220, 232, 244,
                                          5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125, 137, 149, 161, 173, 185, 197, 209, 221, 233, 245,
                                          6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246,
                                          7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127, 139, 151, 163, 175, 187, 199, 211, 223, 235, 247,
                                          8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200, 212, 224, 236, 248,
                                          9, 21, 33, 45, 57, 69, 81, 93, 105, 117, 129, 141, 153, 165, 177, 189, 201, 213, 225, 237, 249,
                                          10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250,
                                          11, 23, 35, 47, 59, 71, 83, 95, 107, 119, 131, 143, 155, 167, 179, 191, 203, 215, 227, 239, 251
                                      ]);
CACLong.m_PunctureList = new Int32Array([
                                            1, 7, 9, 11, 19,
                                            27, 33, 35, 37, 45,
                                            53, 59, 61, 63, 71,
                                            79, 85, 87, 89, 97,
                                            105, 111, 113, 115, 123,
                                            131, 137, 139, 141, 149,
                                            157, 163, 165, 167, 175,
                                            183, 189, 191, 193, 201,
                                            209, 215, 217, 219, 227,
                                            235, 241, 243, 245, 253,
                                            261, 267, 269, 271, 279,
                                            287, 293, 295, 297, 305
                                        ]);

CACLong.prototype.decode = function()
{
    let conv = new CNXDNConvolution();
    conv.start();
    let n = 0;
    let s0, s1;
    for (let i = 0; i < 160; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 156);
    return CNXDNCRC.checkCRC16(this.m_data, 136);
}

CACLong.prototype.getRAN = function()
{
    return this.m_data[0] & 0x3f;
}

CACLong.prototype.getData = function()
{
    return this.m_data;
}


function CACShort()
{
    FnChannel.call(this);
    this.m_cacRaw = new Int8Array(252);
    this.m_temp = new Int8Array(420);
    this.m_data = new Int8Array(16);
    this.m_rawSize = 252;
    this.m_nbPuncture = 0;
    this.m_bufRaw = this.m_cacRaw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = CACLong.m_Interleave;
}

CACShort.prototype = Object.create(FnChannel.prototype);
CACShort.prototype.constructor = CACShort;

CACShort.prototype.decode = function()
{
    let conv = new CNXDNConvolution();
    conv.start();
    let n = 0;
    let s0, s1;
    for (let i = 0; i < 130; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 126);
    return CNXDNCRC.checkCRC16(this.m_data, 106);
}

CACShort.prototype.getRAN = function()
{
    return this.m_data[0] & 0x3f;
}

CACShort.prototype.getData = function()
{
    return this.m_data;
}


function FACCH1()
{
    FnChannel.call(this);
    this.m_facch1Raw = new Int8Array(192);
    this.m_temp = new Int8Array(210);
    this.m_data = new Int8Array(12);
    this.m_rawSize = 144;
    this.m_nbPuncture = 48;
    this.m_bufRaw = this.m_facch1Raw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = FACCH1.m_Interleave;
    this.m_punctureList = FACCH1.m_PunctureList;
}

FACCH1.prototype = Object.create(FnChannel.prototype);
FACCH1.prototype.constructor = FACCH1;

FACCH1.m_Interleave = new Int32Array([
                                         0, 16, 32, 48, 64, 80, 96, 112, 128,
                                         1, 17, 33, 49, 65, 81, 97, 113, 129,
                                         2, 18, 34, 50, 66, 82, 98, 114, 130,
                                         3, 19, 35, 51, 67, 83, 99, 115, 131,
                                         4, 20, 36, 52, 68, 84, 100, 116, 132,
                                         5, 21, 37, 53, 69, 85, 101, 117, 133,
                                         6, 22, 38, 54, 70, 86, 102, 118, 134,
                                         7, 23, 39, 55, 71, 87, 103, 119, 135,
                                         8, 24, 40, 56, 72, 88, 104, 120, 136,
                                         9, 25, 41, 57, 73, 89, 105, 121, 137,
                                         10, 26, 42, 58, 74, 90, 106, 122, 138,
                                         11, 27, 43, 59, 75, 91, 107, 123, 139,
                                         12, 28, 44, 60, 76, 92, 108, 124, 140,
                                         13, 29, 45, 61, 77, 93, 109, 125, 141,
                                         14, 30, 46, 62, 78, 94, 110, 126, 142,
                                         15, 31, 47, 63, 79, 95, 111, 127, 143
                                     ]);
FACCH1.m_PunctureList = new Int32Array([
                                           1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77,
                                           81, 85, 89, 93, 97, 101, 105, 109, 113, 117, 121, 125, 129, 133, 137, 141, 145,
                                           149, 153, 157, 161, 165, 169, 173, 177, 181, 185, 189
                                       ]);

FACCH1.prototype.decode = function()
{
    let conv = new CNXDNConvolution();
    conv.start();
    let n = 0;
    let s0, s1;
    for (let i = 0; i < 100; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 96);
    return CNXDNCRC.checkCRC12(this.m_data, 80);
}

FACCH1.prototype.getData = function()
{
    return this.m_data;
}


function UDCH()
{
    FnChannel.call(this);
    this.m_udchRaw = new Int8Array(406);
    this.m_temp = new Int8Array(420);
    this.m_data = new Int8Array(26);
    this.m_rawSize = 348;
    this.m_nbPuncture = 58;
    this.m_bufRaw = this.m_udchRaw;
    this.m_bufTmp = this.m_temp;
    this.m_interleave = UDCH.m_Interleave;
    this.m_punctureList = UDCH.m_PunctureList;
}

UDCH.prototype = Object.create(FnChannel.prototype);
UDCH.prototype.constructor = UDCH;

UDCH.m_Interleave = new Int32Array([
                                       0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336,
                                       1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121, 133, 145, 157, 169, 181, 193, 205, 217, 229, 241, 253, 265, 277, 289, 301, 313, 325, 337,
                                       2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122, 134, 146, 158, 170, 182, 194, 206, 218, 230, 242, 254, 266, 278, 290, 302, 314, 326, 338,
                                       3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123, 135, 147, 159, 171, 183, 195, 207, 219, 231, 243, 255, 267, 279, 291, 303, 315, 327, 339,
                                       4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 208, 220, 232, 244, 256, 268, 280, 292, 304, 316, 328, 340,
                                       5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125, 137, 149, 161, 173, 185, 197, 209, 221, 233, 245, 257, 269, 281, 293, 305, 317, 329, 341,
                                       6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246, 258, 270, 282, 294, 306, 318, 330, 342,
                                       7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127, 139, 151, 163, 175, 187, 199, 211, 223, 235, 247, 259, 271, 283, 295, 307, 319, 331, 343,
                                       8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200, 212, 224, 236, 248, 260, 272, 284, 296, 308, 320, 332, 344,
                                       9, 21, 33, 45, 57, 69, 81, 93, 105, 117, 129, 141, 153, 165, 177, 189, 201, 213, 225, 237, 249, 261, 273, 285, 297, 309, 321, 333, 345,
                                       10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 130, 142, 154, 166, 178, 190, 202, 214, 226, 238, 250, 262, 274, 286, 298, 310, 322, 334, 346,
                                       11, 23, 35, 47, 59, 71, 83, 95, 107, 119, 131, 143, 155, 167, 179, 191, 203, 215, 227, 239, 251, 263, 275, 287, 299, 311, 323, 335, 347
                                   ]);
UDCH.m_PunctureList = new Int32Array([
                                         3, 11, 17, 25, 31, 39, 45, 53, 59, 67, 73, 81, 87, 95, 101, 109, 115, 123, 129, 137, 143, 151, 157, 165, 171, 179, 185, 193, 199, 207,
                                         213, 221, 227, 235, 241, 249, 255, 263, 269, 277, 283, 291, 297, 305, 311, 319, 325, 333, 339, 347, 353, 361, 367, 375, 381, 389, 395, 403
                                     ]);

UDCH.prototype.decode = function()
{
    let conv = CNXDNConvolution();
    conv.start();
    let n = 0;
    let s0, s1;
    for (let i = 0; i < 207; i++) {
        s0 = this.m_temp[n++];
        s1 = this.m_temp[n++];
        conv.decode(s0, s1);
    }
    conv.chainback(this.m_data, 203);
    return CNXDNCRC.checkCRC15(this.m_data, 184);
}

UDCH.prototype.getRAN = function()
{
    return this.m_data[0] & 0x3f;
}

UDCH.prototype.getStructure = function()
{
    return (this.m_data[0] >> 6) & 0x03;
}

UDCH.prototype.getData = function()
{
    return this.m_data;
}


function DSDNXDN(dsdDecoder)
{
    this.NXDNFrame = 0;
    this.NXDNPostFrame = 1;
    this.NXDNSwallow = 2;
    this.NXDNRCCH = 0;
    this.NXDNRTCH = 1;
    this.NXDNRDCH = 2;
    this.NXDNRTCHC = 3;
    this.NXDNRFCHUnknown = 4;
    this.NXDNFSReserved = 0;
    this.NXDNFSCAC = 1;
    this.NXDNFSCACShort = 2;
    this.NXDNFSCACLong = 3;
    this.NXDNFSSACCH = 4;
    this.NXDNFSSACCHSup = 5;
    this.NXDNFSSACCHIdle = 6;
    this.NXDNFSUDCH = 7;
    this.NXDNStealBoth = 0;
    this.NXDNSteal1 = 1;
    this.NXDNSteal2 = 2;
    this.NXDNStealNone = 3;
    this.NXDNStealReserved = 4;
    this.m_lich = new NXDNLICH();
    this.m_cac = new CACOutbound();
    this.m_cacShort = new CACShort();
    this.m_cacLong = new CACLong();
    this.m_sacch = new SACCH();
    this.m_facch1 = new FACCH1();
    this.m_udch = new UDCH();
    this.m_currentMessage = new Message();
    this.m_adjacentSites = Array.from(Array(16), () => new AdjacentSiteInformation());
    this.m_dsdDecoder = dsdDecoder;
    this.m_state = this.NXDNFrame;
    this.m_pn = new PN_9_5(0xe4);
    this.m_inSync = false;
    this.m_lichEvenParity = 0;
    this.m_symbolIndex = 0;
    this.m_swallowCount = 0;
    this.n = 0;
    this.m_syncBuffer = new Uint8Array(10);
    this.m_lichBuffer = new Uint8Array(8);
    this.m_rfChannel = this.NXDNRFCHUnknown;
    this.m_frameStructure = this.NXDNFSReserved;
    this.m_steal = this.NXDNStealReserved;
    this.m_ran = 0;
    this.m_idle = 0;
    this.m_sourceId = 0;
    this.m_destinationId = 0;
    this.m_group = false;
    this.m_messageType = 0;
    this.m_locationId = 0;
    this.m_services = 0;
    this.m_fullRate = false;
    this.m_rfChannelStr = "";
}

DSDNXDN.nxdnRFChannelTypeText = ["RC", "RT", "RD", "Rt", "RU"];
DSDNXDN.rW = new Int32Array([
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 1,
                                0, 1, 0, 1, 0, 2,
                                0, 2, 0, 2, 0, 2,
                                0, 2, 0, 2, 0, 2
                            ]);
DSDNXDN.rX = new Int32Array([
                                23, 10, 22, 9, 21, 8,
                                20, 7, 19, 6, 18, 5,
                                17, 4, 16, 3, 15, 2,
                                14, 1, 13, 0, 12, 10,
                                11, 9, 10, 8, 9, 7,
                                8, 6, 7, 5, 6, 4
                            ]);
DSDNXDN.rY = new Int32Array([
                                0, 2, 0, 2, 0, 2,
                                0, 2, 0, 3, 0, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3,
                                1, 3, 1, 3, 1, 3
                            ]);
DSDNXDN.rZ = new Int32Array([
                                5, 3, 4, 2, 3, 1,
                                2, 0, 1, 13, 0, 12,
                                22, 11, 21, 10, 20, 9,
                                19, 8, 18, 7, 17, 6,
                                16, 5, 15, 4, 14, 3,
                                13, 2, 12, 1, 11, 0
                            ]);
DSDNXDN.m_voiceTestPattern = new Uint8Array([
                                                3, 0, 3, 2, 2, 2, 2, 0,
                                                3, 3, 3, 2, 2, 0, 0, 3,
                                                2, 2, 3, 0, 3, 0, 1, 0,
                                                1, 1, 2, 0, 0, 2, 0, 0,
                                                0, 0, 2, 2
                                            ]);

DSDNXDN.prototype.init = function()
{
    if (!this.m_inSync) {
        this.m_currentMessage.reset();
        this.m_inSync = true;
        this.m_fullRate = false;
        this.m_dsdDecoder.setMbeRate(DSDDecoder.DSDMBERate3600x2450);
    }
    this.m_symbolIndex = 0;
    this.m_lichEvenParity = 0;
    this.m_state = this.NXDNFrame;
}

DSDNXDN.prototype.process = function()
{
    switch(this.m_state) {
    case this.NXDNFrame:
        this.processFrame();
        break;
    case this.NXDNPostFrame:
        this.processPostFrame();
        break;
    case this.NXDNSwallow:
        this.processSwallow();
        break;
    default:
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
        this.m_inSync = false;
    }
}

DSDNXDN.prototype.getRFChannel = function()
{
    return this.m_rfChannel;
}

DSDNXDN.prototype.getRFChannelStr = function()
{
    return this.m_rfChannelStr;
}

DSDNXDN.prototype.isIdle = function()
{
    return this.m_idle;
}

DSDNXDN.prototype.getRAN = function()
{
    return this.m_ran;
}

DSDNXDN.prototype.getMessageType = function()
{
    return this.m_messageType;
}

DSDNXDN.prototype.getSourceId = function()
{
    return this.m_sourceId;
}

DSDNXDN.prototype.getDestinationId = function()
{
    return this.m_destinationId;
}

DSDNXDN.prototype.isGroupCall = function()
{
    return this.m_group;
}

DSDNXDN.prototype.getLocationId = function()
{
    return this.m_locationId;
}

DSDNXDN.prototype.getServicesFlag = function()
{
    return this.m_services;
}

DSDNXDN.prototype.isFullRate = function()
{
    return (this.m_dsdDecoder.getDataRate() === DSDDecoder.DSDRate4800) && this.m_fullRate;
}

DSDNXDN.prototype.unscrambleDibit = function(dibit)
{
    return this.m_pn.getBit(this.m_symbolIndex) ? dibit ^ 2 : dibit;
}

DSDNXDN.prototype.processFrame = function()
{
    let dibitRaw = this.m_dsdDecoder.m_dsdSymbol.getDibit();
    let dibit = this.unscrambleDibit(dibitRaw);
    if (this.m_symbolIndex < 8) {
        this.acquireLICH(dibit);
        this.m_symbolIndex++;
        if (this.m_symbolIndex === 8)
            this.processLICH();
    } else if (this.m_symbolIndex < 8 + 174) {
        switch (this.m_rfChannel) {
        case this.NXDNRCCH:
            this.processRCCH(this.m_symbolIndex - 8, dibit);
            break;
        case this.NXDNRTCH:
        case this.NXDNRDCH:
        case this.NXDNRTCHC:
            this.processRTDCH(this.m_symbolIndex - 8, dibit);
            break;
        case this.NXDNRFCHUnknown:
        default:
            break;
        }
        this.m_symbolIndex++;
    } else {
        if ((dibitRaw === 0) || (dibitRaw === 1))
            this.m_syncBuffer[0] = 1;
        else
            this.m_syncBuffer[0] = 3;
        this.m_state = this.NXDNPostFrame;
        this.m_symbolIndex = 1;
    }
}

DSDNXDN.prototype.processPostFrame = function()
{
    if (this.m_symbolIndex < 10) {
        let dibit = this.m_dsdDecoder.m_dsdSymbol.getDibit();
        if ((dibit === 0) || (dibit === 1))
            this.m_syncBuffer[this.m_symbolIndex] = 1;
        else
            this.m_syncBuffer[this.m_symbolIndex] = 3;
        this.m_symbolIndex++;
        if (this.m_symbolIndex === 10)
            this.processFSW();
    } else {
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
        this.m_inSync = false;
    }
}

DSDNXDN.prototype.acquireLICH = function(dibit)
{
    this.m_lichBuffer[this.m_symbolIndex] = dibit >> 1;
    if (this.m_symbolIndex < 6)
        this.m_lichEvenParity += this.m_lichBuffer[this.m_symbolIndex];
}

DSDNXDN.prototype.processLICH = function()
{
    this.m_lich.rfChannelCode = 2 * this.m_lichBuffer[0] + this.m_lichBuffer[1];
    this.m_lich.fnChannelCode = 2 * this.m_lichBuffer[2] + this.m_lichBuffer[3];
    this.m_lich.optionCode = 2 * this.m_lichBuffer[4] + this.m_lichBuffer[5];
    this.m_lich.direction = this.m_lichBuffer[6];
    this.m_lich.parity = this.m_lichBuffer[7];
    this.m_lichEvenParity += this.m_lich.parity;
    if (this.m_lichEvenParity % 2) {
        this.m_rfChannel = this.NXDNRFCHUnknown;
        this.m_rfChannelStr = "XX";
        this.m_dsdDecoder.m_voice1On = false;
    } else {
        this.m_rfChannel = this.m_lich.rfChannelCode;
        this.m_rfChannelStr = DSDNXDN.nxdnRFChannelTypeText[this.m_rfChannel];
        switch (this.m_rfChannel) {
        case this.NXDNRCCH:
            this.m_idle = false;
            if (this.m_lich.fnChannelCode === 0)
                this.m_frameStructure = this.m_lich.direction ? this.NXDNFSCAC: this.NXDNFSReserved;
            else if (this.m_lich.fnChannelCode === 1)
                this.m_frameStructure = this.m_lich.direction ? this.NXDNFSReserved: this.NXDNFSCACLong;
            else if (this.m_lich.fnChannelCode === 3)
                this.m_frameStructure = this.m_lich.direction ? this.NXDNFSReserved: this.NXDNFSCACShort;
            else
                this.m_frameStructure = this.NXDNFSReserved;
            break;
        case this.NXDNRTCH:
        case this.NXDNRDCH:
        case this.NXDNRTCHC:
            this.m_idle = false;
            if (this.m_lich.fnChannelCode === 0)
                this.m_frameStructure = this.NXDNFSSACCH;
            else if (this.m_lich.fnChannelCode === 1)
                this.m_frameStructure = this.NXDNFSUDCH;
            else if (this.m_lich.fnChannelCode === 2)
                this.m_frameStructure = this.NXDNFSSACCHSup;
            else
                this.m_frameStructure = this.NXDNFSSACCHIdle;
            this.m_idle = true;
            break;
        default:
            break;
        }
        if ((this.m_frameStructure === this.NXDNFSSACCH) || (this.m_frameStructure === this.NXDNFSSACCHSup)) {
            this.m_steal = this.m_lich.optionCode;
            this.m_dsdDecoder.m_voice1On = (this.m_steal !== this.NXDNStealBoth);
        } else if (this.m_frameStructure === this.NXDNFSUDCH) {
            this.m_dsdDecoder.m_voice1On = false;
            if ((this.m_lich.optionCode === 0) || (this.m_lich.optionCode === 3))
                this.m_steal = this.m_lich.optionCode;
            else
                this.m_steal = this.NXDNStealReserved;
        } else
            this.m_steal = this.NXDNStealReserved;
    }
}

DSDNXDN.prototype.processFSW = function()
{
    let match_late2 = 0;
    let match_late1 = 0;
    let match_spot  = 0;
    let match_earl1 = 0;
    let match_earl2 = 0;
    let fsw;
    let fswLength;
    if (this.m_dsdDecoder.getSyncType() === DSDDecoder.DSDSyncNXDNP) {
        fsw = DSDSync.getPattern(DSDSync.SyncNXDNRDCHFSW, fswLength);
        fswLength = global1;
    } else if (this.m_dsdDecoder.getSyncType() === DSDDecoder.DSDSyncNXDNN) {
        fsw = DSDSync.getPattern(DSDSync.SyncNXDNRDCHFSWInv, fswLength);
        fswLength = global1;
    } else {
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
        this.m_inSync = false;
        return;
    }
    for (let i = 0; i < 10; i++) {
        if (this.m_syncBuffer[i] ===  fsw[i])
            match_spot++;
        if ((i < 7) && (this.m_syncBuffer[i] ===  fsw[i + 2]))
            match_late2++;
        if ((i < 8) && (this.m_syncBuffer[i] ===  fsw[i + 1]))
            match_late1++;
        if ((i > 0) && (this.m_syncBuffer[i] ===  fsw[i - 1]))
            match_earl1++;
        if ((i > 1) && (this.m_syncBuffer[i] ===  fsw[i - 2]))
            match_earl2++;
    }
    if (match_spot >= 7)
        this.init();
    else if (match_earl1 >= 6) {
        this.m_swallowCount = 1;
        this.m_state = this.NXDNSwallow;
    } else if (match_late1 >= 6) {
        this.m_symbolIndex = 0;
        this.m_lichEvenParity = 0;
        this.acquireLICH(this.unscrambleDibit(this.m_syncBuffer[9]));
        this.m_symbolIndex++;
        this.m_state = this.NXDNFrame;
    } else if (match_earl2 >= 5) {
        this.m_swallowCount = 2;
        this.m_state = this.NXDNSwallow;
    } else if (match_late2 >= 5) {
        this.m_symbolIndex = 0;
        this.m_lichEvenParity = 0;
        this.acquireLICH(this.unscrambleDibit(this.m_syncBuffer[8]));
        this.m_symbolIndex++;
        this.acquireLICH(this.unscrambleDibit(this.m_syncBuffer[9]));
        this.m_symbolIndex++;
        this.m_state = this.NXDNFrame;
    } else {
        this.m_dsdDecoder.m_voice1On = false;
        this.m_dsdDecoder.resetFrameSync();
        this.m_inSync = false;
    }
}

DSDNXDN.prototype.processSwallow = function()
{
    if (this.m_swallowCount > 0)
        this.m_swallowCount--;
    if (this.m_swallowCount === 0)
        this.init();
}

DSDNXDN.prototype.processRCCH = function(index, dibit)
{
    switch (this.m_frameStructure) {
    case this.NXDNFSCAC:
        if (index === 0)
            this.m_cac.reset();
        if (index < 150)
            this.m_cac.pushDibit(dibit);
        if (index === 150) {
            this.m_cac.unpuncture();
            if (this.m_cac.decode()) {
                this.m_ran = this.m_cac.getRAN();
                this.m_currentMessage.setFromCAC(this.m_cac.getData().subarray(1));
                this.m_messageType = this.m_currentMessage.getMessageType();
                this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                this.m_sourceId = global1;
                this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                this.m_destinationId = global1;
                this.m_currentMessage.isGroupCall(this.m_group);
                this.m_group = global1;
                this.m_currentMessage.getLocationId(this.m_locationId);
                this.m_locationId = global1;
                this.m_currentMessage.getServiceInformation(this.m_services);
                this.m_services = global1;
                if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                    this.m_fullRate = global1;
                    this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                } else
                    this.m_fullRate = global1;
                if (this.m_cac.hasDualMessageFormat()) {
                    this.m_currentMessage.setMessageIndex(1);
                    this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                    this.m_sourceId = global1;
                    this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                    this.m_destinationId = global1;
                    this.m_currentMessage.isGroupCall(this.m_group);
                    this.m_group = global1;
                    this.m_currentMessage.getLocationId(this.m_locationId);
                    this.m_locationId = global1;
                    this.m_currentMessage.getServiceInformation(this.m_services);
                    this.m_services = global1;
                    if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                        this.m_fullRate = global1;
                        this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                    } else
                        this.m_fullRate = global1;
                    if (this.m_currentMessage.getAdjacentSitesInformation(this.m_adjacentSites, 1))
                        this.printAdjacentSites();
                    this.m_currentMessage.setMessageIndex(0);
                    if (this.m_currentMessage.getAdjacentSitesInformation(this.m_adjacentSites, 1))
                        this.printAdjacentSites();
                } else
                    if (this.m_currentMessage.getAdjacentSitesInformation(this.m_adjacentSites, 3))
                        this.printAdjacentSites();
            }
        }
        break;
    case this.NXDNFSCACShort:
        if (index === 0)
            this.m_cacShort.reset();
        if (index < 126)
            this.m_cacShort.pushDibit(dibit);
        if (index === 126) {
            this.m_cacShort.unpuncture();
            if (this.m_cacShort.decode()) {
                this.m_ran = this.m_cacShort.getRAN();
                this.m_currentMessage.setFromCACShort(this.m_cacShort.getData().subarray(1));
                this.m_messageType = this.m_currentMessage.getMessageType();
                this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                this.m_sourceId = global1;
                this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                this.m_destinationId = global1;
                this.m_currentMessage.isGroupCall(this.m_group);
                this.m_group = global1;
                this.m_currentMessage.getLocationId(this.m_locationId);
                this.m_locationId = global1;
                this.m_currentMessage.getServiceInformation(this.m_services);
                this.m_services = global1;
                if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                    this.m_fullRate = global1;
                    this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                } else
                    this.m_fullRate = global1;
            }
        }
        break;
    case this.NXDNFSCACLong:
        if (index === 0)
            this.m_cacLong.reset();
        if (index < 126)
            this.m_cacLong.pushDibit(dibit);
        if (index === 126) {
            this.m_cacLong.unpuncture();
            if (this.m_cacLong.decode()) {
                this.m_ran = this.m_cacLong.getRAN();
                this.m_currentMessage.setFromCACLong(this.m_cacLong.getData().subarray(1));
                this.m_messageType = this.m_currentMessage.getMessageType();
                this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                this.m_sourceId = global1;
                this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                this.m_destinationId = global1;
                this.m_currentMessage.isGroupCall(this.m_group);
                this.m_group = global1;
                this.m_currentMessage.getLocationId(this.m_locationId);
                this.m_locationId = global1;
                this.m_currentMessage.getServiceInformation(this.m_services);
                this.m_services = global1;
                if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                    this.m_fullRate = global1;
                    this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                } else
                    this.m_fullRate = global1;
            }
        }
        break;
    default:
        break;
    }
}

DSDNXDN.prototype.processRTDCH = function(index, dibit)
{
    if ((this.m_frameStructure === this.NXDNFSSACCH) || (this.m_frameStructure === this.NXDNFSSACCHSup)) {
        if (index === 0)
            this.m_sacch.reset();
        if (index < 30)
            this.m_sacch.pushDibit(dibit);
        if (index === 30) {
            this.m_sacch.unpuncture();
            if (this.m_sacch.decode()) {
                this.m_ran = this.m_sacch.getRAN();
                if ((this.m_sacch.getCountdown() === 0) && (this.m_sacch.getDecodeCount() === 0)) {
                    this.m_currentMessage = this.m_sacch.getMessage();
                    this.m_messageType = this.m_currentMessage.getMessageType();
                    this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                    this.m_sourceId = global1;
                    this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                    this.m_destinationId = global1;
                    this.m_currentMessage.isGroupCall(this.m_group);
                    this.m_group = global1;
                    if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                        this.m_fullRate = global1;
                        this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                    } else
                        this.m_fullRate = global1;
                }
            }
        }
        if (index >= 30) {
            let vindex = index - 30;
            if (this.m_steal === this.NXDNStealNone) {
                if (this.isFullRate())
                    this.processVoiceFrameEFR(vindex, dibit);
                else
                    this.processVoiceFrameEHR(vindex, dibit);
            } else if (this.m_steal === this.NXDNSteal1) {
                if (vindex < 72)
                    this.processFACCH1(vindex, dibit);
                else {
                    if (this.isFullRate())
                        this.processVoiceFrameEFR(vindex - 72, dibit);
                    else
                        this.processVoiceFrameEHR(vindex - 72, dibit);
                }
            } else if (this.m_steal === this.NXDNSteal2) {
                if (vindex < 72) {
                    if (this.isFullRate())
                        this.processVoiceFrameEFR(vindex, dibit);
                    else
                        this.processVoiceFrameEHR(vindex, dibit);
                } else
                    this.processFACCH1(vindex - 72, dibit);
            } else if (this.m_steal === this.NXDNStealBoth) {
                if (vindex < 72)
                    this.processFACCH1(vindex, dibit);
                else
                    this.processFACCH1(vindex - 72, dibit);
            }
        }
    } else if (this.m_frameStructure === this.NXDNFSUDCH) {
        if (index === 0)
            this.m_udch.reset();
        if (index < 174)
            this.m_udch.pushDibit(dibit);
        if (index === 174) {
            this.m_udch.unpuncture();
            if (this.m_udch.decode()) {
                this.m_ran = this.m_udch.getRAN();
                this.m_currentMessage.setFromFACCH2(this.m_udch.getData().subarray(1));
                this.m_messageType = this.m_currentMessage.getMessageType();
                this.m_currentMessage.getSourceUnitId(this.m_sourceId);
                this.m_sourceId = global1;
                this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
                this.m_destinationId = global1;
                this.m_currentMessage.isGroupCall(this.m_group);
                this.m_group = global1;
                if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                    this.m_fullRate = global1;
                    this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
                } else
                    this.m_fullRate = global1;
                if (this.m_steal === this.NXDNStealBoth)
                    if (this.m_currentMessage.getAdjacentSitesInformation(this.m_adjacentSites, 4))
                        this.printAdjacentSites();
            }
        }
    }
}

DSDNXDN.prototype.processFACCH1 = function(index, dibit)
{
    if (index === 0)
        this.m_facch1.reset();
    if (index < 72)
        this.m_facch1.pushDibit(dibit);
    if (index === 71) {
        this.m_facch1.unpuncture();
        if (this.m_facch1.decode()) {
            this.m_currentMessage.setFromFACCH1(this.m_facch1.getData());
            this.m_messageType = this.m_currentMessage.getMessageType();
            this.m_currentMessage.getSourceUnitId(this.m_sourceId);
            this.m_sourceId = global1;
            this.m_currentMessage.getDestinationGroupId(this.m_destinationId);
            this.m_destinationId = global1;
            this.m_currentMessage.isGroupCall(this.m_group);
            this.m_group = global1;
            if (this.m_currentMessage.isFullRate(this.m_fullRate)) {
                this.m_fullRate = global1;
                this.m_dsdDecoder.setMbeRate(isFullRate() ? DSDDecoder.DSDMBERate7200x4400 : DSDDecoder.DSDMBERate3600x2450);
            } else
                this.m_fullRate = global1;
            if (this.m_currentMessage.getAdjacentSitesInformation(this.m_adjacentSites, 1))
                this.printAdjacentSites();
        }
        this.m_facch1.reset();
    }
}

DSDNXDN.prototype.processVoiceTest = function(symbolIndex)
{
    this.processVoiceFrameEHR(symbolIndex, DSDNXDN.m_voiceTestPattern[symbolIndex % 36]);
}

DSDNXDN.prototype.processVoiceFrameEHR = function(symbolIndex, dibit)
{
    if (symbolIndex % 36 === 0) {
        this.n = 0;
        this.m_dsdDecoder.m_mbeDVFrame1.fill(0, 0, 9);
    }
    this.m_dsdDecoder.ambe_fr[24 * DSDNXDN.rW[this.n] + DSDNXDN.rX[this.n]] = (1 & (dibit >> 1));
    this.m_dsdDecoder.ambe_fr[24 * DSDNXDN.rY[this.n] + DSDNXDN.rZ[this.n]] = (1 & dibit);
    this.n++;
    this.storeSymbolDV(symbolIndex % 36, dibit);
    if (symbolIndex % 36 === 35) {
        this.m_dsdDecoder.m_mbeDecoder1.processFrame(null, this.m_dsdDecoder.ambe_fr, null);
        this.m_dsdDecoder.m_mbeDVReady1 = true;
    }
}

DSDNXDN.prototype.processVoiceFrameEFR = function(symbolIndex, dibit)
{
    this.storeSymbolDV(symbolIndex % 72, dibit);
    if (symbolIndex % 72 === 71)
        this.m_dsdDecoder.m_mbeDVReady1 = true;
}

DSDNXDN.prototype.storeSymbolDV = function(dibitindex, dibit, invertDibit = false)
{
    if (this.m_dsdDecoder.m_mbelibEnable)
        return;
    if (invertDibit)
        dibit = DSDSymbol.invert_dibit(dibit);
    this.m_dsdDecoder.m_mbeDVFrame1[(dibitindex / 4) | 0] |= (dibit << (6 - 2 * (dibitindex % 4)));
}

DSDNXDN.prototype.resetAdjacentSites = function()
{
    for (let i = 0; i < 16; i++) {
        this.m_adjacentSites[i].m_channelNumber = 0;
        this.m_adjacentSites[i].m_locationId = 0;
        this.m_adjacentSites[i].m_siteNumber = 0;
    }
}

DSDNXDN.prototype.printAdjacentSites = function()
{
}


const DSD_SQUELCH_TIMEOUT_SAMPLES = 960;

function DSDDecoder()
{
    this.signalFormatNone = 0;
    this.signalFormatDMR = 1;
    this.signalFormatDStar = 2;
    this.signalFormatDPMR = 3;
    this.signalFormatYSF = 4;
    this.signalFormatNXDN = 5;
    this.m_opts = new DSDOpts();
    this.m_state = new DSDState();
    this.m_stationType = null;
    this.m_dmrBurstType = null;
    this.m_sync = 0;
    this.im_dibi = 0;
    this.m_synctest_pos = 0;
    this.m_lsum = 0;
    this.m_spectrum = new Int8Array(64);
    this.m_t = 0;
    this.ambe_fr = new Int8Array(96);
    this.imbe_fr = new Int8Array(184);
    this.m_mbeDVFrame1 = new Uint8Array(18);
    this.m_mbeDVFrame2 = new Uint8Array(9);
    this.m_mbeDVReady2 = false;
    this.m_voice1On = false;
    this.m_voice2On = false;
    this.m_myPoint = new LocPoint();
    this.m_fsmState = this.DSDLookForSync;
    this.m_dsdSymbol = new DSDSymbol(this);
    this.m_mbelibEnable = true;
    this.m_mbeRate = this.DSDMBERateNone;
    this.m_mbeDecoder1 = new DSDMBEDecoder(this);
    this.m_mbeDecoder2 = new DSDMBEDecoder(this);
    this.m_mbeDVReady1 = false;
    this.m_dsdDMR = new DSDDMR(this);
    this.m_dsdDstar = new DSDDstar(this);
    this.m_dsdYSF = new DSDYSF(this);
    this.m_dsdDPMR = new DSDdPMR(this);
    this.m_dsdNXDN = new DSDNXDN(this);
    this.m_dataRate = this.DSDRate4800;
    this.m_syncType = this.DSDSyncNone;
    this.m_lastSyncType = this.DSDSyncNone;
    this.m_signalFormat = this.signalFormatNone;
    this.resetFrameSync();
    this.noCarrier();
    this.m_squelchTimeoutCount = 0;
    this.m_nxdnInterSyncCount = -1;
}

DSDDecoder.DSDDecodeAuto = 0;
DSDDecoder.DSDDecodeNone = 1;
DSDDecoder.DSDDecodeP25P1 = 2;
DSDDecoder.DSDDecodeDStar = 3;
DSDDecoder.DSDDecodeNXDN48 = 4;
DSDDecoder.DSDDecodeNXDN96 = 5;
DSDDecoder.DSDDecodeProVoice = 6;
DSDDecoder.DSDDecodeDMR = 7;
DSDDecoder.DSDDecodeX2TDMA = 8;
DSDDecoder.DSDDecodeDPMR = 9;
DSDDecoder.DSDDecodeYSF = 10;
DSDDecoder.DSDRate2400 = 0;
DSDDecoder.DSDRate4800 = 1;
DSDDecoder.DSDRate9600 = 2;
DSDDecoder.DSDShowP25EncryptionSyncBits = 0;
DSDDecoder.DSDShowP25LinkControlBits = 1;
DSDDecoder.DSDShowP25StatusBitsAndLowSpeedData = 2;
DSDDecoder.DSDShowP25TalkGroupInfo = 3;
DSDDecoder.DSDLookForSync = 0;
DSDDecoder.DSDSyncFound = 1;
DSDDecoder.DSDprocessFrame = 2;
DSDDecoder.DSDprocessNXDNVoice = 3;
DSDDecoder.DSDprocessNXDNData = 4;
DSDDecoder.DSDprocessDSTAR = 5;
DSDDecoder.DSDprocessDSTAR_HD = 6;
DSDDecoder.DSDprocessDMRvoice = 7;
DSDDecoder.DSDprocessDMRdata = 8;
DSDDecoder.DSDprocessDMRvoiceMS = 9;
DSDDecoder.DSDprocessDMRdataMS = 10;
DSDDecoder.DSDprocessDMRsyncOrSkip = 11;
DSDDecoder.DSDprocessDMRSkipMS = 12;
DSDDecoder.DSDprocessX2TDMAvoice = 13;
DSDDecoder.DSDprocessX2TDMAdata = 14;
DSDDecoder.DSDprocessProVoice = 15;
DSDDecoder.DSDprocessYSF = 16;
DSDDecoder.DSDprocessDPMR = 17;
DSDDecoder.DSDprocessNXDN = 18;
DSDDecoder.DSDprocessUnknown = 19;
DSDDecoder.DSDSyncP25p1P = 0;
DSDDecoder.DSDSyncP25p1N = 1;
DSDDecoder.DSDSyncX2TDMADataP = 2;
DSDDecoder.DSDSyncX2TDMAVoiceN = 3;
DSDDecoder.DSDSyncX2TDMAVoiceP = 4;
DSDDecoder.DSDSyncX2TDMADataN = 5;
DSDDecoder.DSDSyncDStarP = 6;
DSDDecoder.DSDSyncDStarN = 7;
DSDDecoder.DSDSyncNXDNP = 8;
DSDDecoder.DSDSyncNXDNN = 9;
DSDDecoder.DSDSyncDMRDataP = 10;
DSDDecoder.DSDSyncDMRDataMS = 11;
DSDDecoder.DSDSyncDMRVoiceP = 12;
DSDDecoder.DSDSyncDMRVoiceMS = 13;
DSDDecoder.DSDSyncProVoiceP = 14;
DSDDecoder.DSDSyncProVoiceN = 15;
DSDDecoder.DSDSyncNXDNDataP = 16;
DSDDecoder.DSDSyncNXDNDataN = 17;
DSDDecoder.DSDSyncDStarHeaderP = 18;
DSDDecoder.DSDSyncDStarHeaderN = 19;
DSDDecoder.DSDSyncDPMR = 20;
DSDDecoder.DSDSyncDPMRPacket = 21;
DSDDecoder.DSDSyncDPMRPayload = 22;
DSDDecoder.DSDSyncDPMREnd = 23;
DSDDecoder.DSDSyncYSF = 24;
DSDDecoder.DSDSyncNone = 25;
DSDDecoder.DSDStationTypeNotApplicable = 0;
DSDDecoder.DSDBaseStation = 1;
DSDDecoder.DSDMobileStatio = 2;
DSDDecoder.DSDMBERateNone = 0;
DSDDecoder.DSDMBERate3600x2400 = 1;
DSDDecoder.DSDMBERate3600x2450 = 2;
DSDDecoder.DSDMBERate7200x4400 = 3;
DSDDecoder.DSDMBERate7100x4400 = 4;
DSDDecoder.DSDMBERate2400 = 5;
DSDDecoder.DSDMBERate2450 = 6;
DSDDecoder.DSDMBERate4400 = 7;

DSDDecoder.prototype.run = function(sample)
{
    if (this.m_fsmState !== DSDDecoder.DSDLookForSync) {
        if (sample === 0) {
            if (this.m_squelchTimeoutCount < DSD_SQUELCH_TIMEOUT_SAMPLES)
                this.m_squelchTimeoutCount++;
            else {
                this.resetFrameSync();
                this.m_squelchTimeoutCount = 0;
            }
        }
        else
            this.m_squelchTimeoutCount = 0;
    }
    if (this.m_dsdSymbol.pushSample(sample))
        switch (this.m_fsmState) {
        case DSDDecoder.DSDLookForSync:
            this.m_sync = this.getFrameSync();
            if (this.m_sync === -2)
                break;
            else if (this.m_sync === -1)
                this.resetFrameSync();
            else
                this.m_fsmState = DSDDecoder.DSDSyncFound;
            break;
        case DSDDecoder.DSDSyncFound:
            this.m_syncType  = this.m_sync;
            this.processFrameInit();
            break;
        case DSDDecoder.DSDprocessDMRvoice:
            this.m_dsdDMR.processVoice();
            break;
        case DSDDecoder.DSDprocessDMRvoiceMS:
            this.m_dsdDMR.processVoiceMS();
            break;
        case DSDDecoder.DSDprocessDMRdata:
            this.m_dsdDMR.processData();
            break;
        case DSDDecoder.DSDprocessDMRdataMS:
            this.m_dsdDMR.processDataMS();
            break;
        case DSDDecoder.DSDprocessDMRsyncOrSkip:
            this.m_dsdDMR.processSyncOrSkip();
            break;
        case DSDDecoder.DSDprocessDMRSkipMS:
            this.m_dsdDMR.processSkipMS();
            break;
        case DSDDecoder.DSDprocessDSTAR:
            this.m_dsdDstar.process();
            break;
        case DSDDecoder.DSDprocessDSTAR_HD:
            this.m_dsdDstar.processHD();
            break;
        case DSDDecoder.DSDprocessYSF:
            this.m_dsdYSF.process();
            break;
        case DSDDecoder.DSDprocessDPMR:
            this.m_dsdDPMR.process();
            break;
        case DSDDecoder.DSDprocessNXDN:
            this.m_dsdNXDN.process();
            break;
        default:
            break;
        }
}

DSDDecoder.prototype.getFilteredSample = function()
{
    return this.m_dsdSymbol.getFilteredSample();
}

DSDDecoder.prototype.getSymbolSyncSample = function()
{
    return this.m_dsdSymbol.getSymbolSyncSample();
}

DSDDecoder.prototype.getMbeDVFrame1 = function()
{
    return this.m_mbeDVFrame1;
}

DSDDecoder.prototype.mbeDVReady1 = function()
{
    return this.m_mbeDVReady1;
}

DSDDecoder.prototype.resetMbeDV1 = function()
{
    this.m_mbeDVReady1 = false;
}

DSDDecoder.prototype.getMbeDVFrame2 = function()
{
    return this.m_mbeDVFrame2;
}

DSDDecoder.prototype.mbeDVReady2 = function()
{
    return this.m_mbeDVReady2;
}

DSDDecoder.prototype.resetMbeDV2 = function()
{
    this.m_mbeDVReady2 = false;
}

DSDDecoder.prototype.getAudio1 = function(nbSamples)
{
    return this.m_mbeDecoder1.getAudio(nbSamples);
}

DSDDecoder.prototype.resetAudio1 = function()
{
    this.m_mbeDecoder1.resetAudio();
}

DSDDecoder.prototype.getAudio2 = function(nbSamples)
{
    return this.m_mbeDecoder2.getAudio(nbSamples);
}

DSDDecoder.prototype.resetAudio2 = function()
{
    this.m_mbeDecoder2.resetAudio();
}

DSDDecoder.prototype.getSyncType = function()
{
    return this.m_lastSyncType;
}

DSDDecoder.prototype.getStationType = function()
{
    return this.m_stationType;
}

DSDDecoder.prototype.getFrameTypeText = function()
{
    return this.m_state.ftype;
}

DSDDecoder.prototype.getFrameSubtypeText = function()
{
    return this.m_state.fsubtype;
}

DSDDecoder.prototype.getInLevel = function()
{
    return this.m_dsdSymbol.getLevel();
}

DSDDecoder.prototype.getCarrierPos = function()
{
    return this.m_dsdSymbol.getCarrierPos();
}

DSDDecoder.prototype.getZeroCrossingPos = function()
{
    return this.m_dsdSymbol.getZeroCrossingPos();
}

DSDDecoder.prototype.getSymbolSyncQuality = function()
{
    return this.m_dsdSymbol.getSymbolSyncQuality();
}

DSDDecoder.prototype.getSamplesPerSymbol = function()
{
    return this.m_dsdSymbol.getSamplesPerSymbol();
}

DSDDecoder.prototype.getDataRate = function()
{
    return this.m_dataRate;
}

DSDDecoder.prototype.getVoice1On = function()
{
    return this.m_voice1On;
}

DSDDecoder.prototype.getVoice2On = function()
{
    return this.m_voice2On;
}

DSDDecoder.prototype.setTDMAStereo = function(tdmaStereo)
{
    if (tdmaStereo) {
        this.m_mbeDecoder1.setChannels(1);
        this.m_mbeDecoder2.setChannels(2);
    } else {
        this.m_mbeDecoder1.setChannels(3);
        this.m_mbeDecoder2.setChannels(3);
    }
}

DSDDecoder.prototype.formatStatusText = function(statusText)
{
    let tv_sec, tv_msec;
    let nowms = TimeUtil.nowms();
    tv_sec = (nowms / 1000) | 0;
    tv_msec = nowms % 1000;
    statusText = tv_sec.toString().padStart(10, " ") + "." + tv_msec.toString().padStart(3, "0") + ":";
    switch (this.getSyncType()) {
    case DSDDecoder.DSDSyncDMRDataMS:
    case DSDDecoder.DSDSyncDMRDataP:
    case DSDDecoder.DSDSyncDMRVoiceMS:
    case DSDDecoder.DSDSyncDMRVoiceP:
        if (this.m_signalFormat !== this.signalFormatDMR)
            statusText += "DMR>Sta: AA S1: BBBBBBBBBBBBBBBBBBBBBBBBBB S2: CCCCCCCCCCCCCCCCCCCCCCCCCC";
        else
            statusText += "DMR      AA     BBBBBBBBBBBBBBBBBBBBBBBBBB     CCCCCCCCCCCCCCCCCCCCCCCCCC";
        switch (this.getStationType()) {
        case DSDDecoder.DSDBaseStation:
            statusText = statusText.replace("AA", "BS");
            break;
        case DSDDecoder.DSDMobileStation:
            statusText = statusText.replace("AA", "MS");
            break;
        default:
            statusText = statusText.replace("AA", "NA");
            break;
        }
        statusText = statusText.replace("BBBBBBBBBBBBBBBBBBBBBBBBBB", this.getDMRDecoder().getSlot0Text());
        statusText = statusText.replace("CCCCCCCCCCCCCCCCCCCCCCCCCC", this.getDMRDecoder().getSlot1Text());
        this.m_signalFormat = this.signalFormatDMR;
        break;
    case DSDDecoder.DSDSyncDStarHeaderN:
    case DSDDecoder.DSDSyncDStarHeaderP:
    case DSDDecoder.DSDSyncDStarN:
    case DSDDecoder.DSDSyncDStarP:
        if (this.m_signalFormat !== this.signalFormatDStar)
            statusText += "DST>AAAAAAAAAAAAA>BBBBBBBB|CCCCCCCC>DDDDDDDD|EEEEEEEEEEEEEEEEEEEE|FFFFFF:GGGGHHHHHHH";
        else
            statusText += "DST AAAAAAAAAAAAA BBBBBBBB CCCCCCCC DDDDDDDD EEEEEEEEEEEEEEEEEEEE FFFFFF GGGGHHHHHHH";
        let rpt1 = this.getDStarDecoder().getRpt1();
        let rpt2 = this.getDStarDecoder().getRpt2();
        let mySign = this.getDStarDecoder().getMySign();
        let yrSign = this.getDStarDecoder().getYourSign();
        if (mySign.length > 0)
            statusText = statusText.replace("AAAAAAAAAAAAA", mySign);
        else
            statusText = statusText.replace("AAAAAAAAAAAAA", "________/____");
        if (yrSign.length > 0)
            statusText = statusText.replace("BBBBBBBB", yrSign);
        else
            statusText = statusText.replace("BBBBBBBB", "________");
        if (rpt1.length > 0)
            statusText = statusText.replace("CCCCCCCC", rpt1);
        else
            statusText = statusText.replace("CCCCCCCC", "________");
        if (rpt2.length > 0)
            statusText = statusText.replace("DDDDDDDD", rpt2);
        else
            statusText = statusText.replace("DDDDDDDD", "________");
        statusText = statusText.replace("EEEEEEEEEEEEEEEEEEEE", this.getDStarDecoder().getInfoText());
        statusText = statusText.replace("FFFFFF", this.getDStarDecoder().getLocator());
        statusText = statusText.replace("GGGG", this.getDStarDecoder().getBearing().toString().padStart(3, "0") + "/");
        statusText = statusText.replace("HHHHHHH", (10 * (this.getDStarDecoder().getDistance() | 0) / 10).toString().padStart(7, "0"));
        this.m_signalFormat = this.signalFormatDStar;
        break;
    case DSDDecoder.DSDSyncDPMR:
        statusText += "DPM>" + DSDdPMR.dpmrFrameTypes[this.getDPMRDecoder().getFrameType()];
        statusText += " CC: " + this.getDPMRDecoder().getColorCode().toString().padStart(4, " ");
        statusText += " OI: " + this.getDPMRDecoder().getOwnId().toString().padStart(8, " ");
        statusText += " CI: " + this.getDPMRDecoder().getCalledId().toString().padStart(8, " ");
        this.m_signalFormat = this.signalFormatDPMR;
        break;
    case DSDDecoder.DSDSyncYSF:
        if (this.getYSFDecoder().getFICHError() === DSDYSF.FICHNoError)
            statusText += "YSF>" +  DSDYSF.ysfChannelTypeText[this.getYSFDecoder().getFICH().getFrameInformation()] + " ";
        else
            statusText += "YSF>" + this.getYSFDecoder().getFICHError().toString() + " ";
        statusText += DSDYSF.ysfDataTypeText[this.getYSFDecoder().getFICH().getDataType()] + " ";
        statusText += DSDYSF.ysfCallModeText[this.getYSFDecoder().getFICH().getCallMode()] + " ";
        statusText += this.getYSFDecoder().getFICH().getBlockTotal().toString() + ":";
        statusText += this.getYSFDecoder().getFICH().getFrameTotal().toString() + " ";
        statusText += this.getYSFDecoder().getFICH().isNarrowMode() ? 'N' : 'W';
        statusText += this.getYSFDecoder().getFICH().isInternetPath() ? 'I' : 'L';
        if (this.getYSFDecoder().getFICH().isSquelchCodeEnabled())
            statusText += this.getYSFDecoder().getFICH().getSquelchCode().toString().padStart(3, " ");
        else
            statusText += "---";
        statusText += "|" + this.getYSFDecoder().getSrc().padEnd(10, " ") + ">";
        if (this.getYSFDecoder().radioIdMode())
            statusText += this.getYSFDecoder().getDestId().padEnd(5, " ") + ":" + this.getYSFDecoder().getSrcId().padEnd(5, " ");
        else
            statusText += this.getYSFDecoder().getDest().padEnd(10, " ");
        statusText += "|" + this.getYSFDecoder().getUplink().padEnd(10, " ");
        statusText += ">" + this.getYSFDecoder().getDownlink().padEnd(10, " ");
        statusText += "|" + this.getYSFDecoder().getRem4().padEnd(5, " ");
        this.m_signalFormat = this.signalFormatYSF;
        break;
    case DSDDecoder.DSDSyncNXDNN:
    case DSDDecoder.DSDSyncNXDNP:
        if (this.getNXDNDecoder().getRFChannel() === this.NXDNRCCH) {
            statusText += "NXD>RC " + this.getNXDNDecoder().isFullRate() ? "F" : "H";
            statusText += " " + this.getNXDNDecoder().getRAN().toString().padStart(2, " ");
            statusText += " " + this.getNXDNDecoder().getMessageType().toString(16).padStart(2, "0");
            statusText += " " + this.getNXDNDecoder().getLocationId().toString(16).padStart(6, "0");
            statusText += " " + this.getNXDNDecoder().getServicesFlag().toString(16).padStart(2, "0");
        } else if ((this.getNXDNDecoder().getRFChannel() === this.NXDNRTCH) || (this.getNXDNDecoder().getRFChannel() === this.NXDNRDCH)) {
            if (this.getNXDNDecoder().isIdle())
                statusText += "NXD>" + this.getNXDNDecoder().getRFChannelStr() + " IDLE";
            else {
                statusText += "NXD>" + this.getNXDNDecoder().isFullRate() ? "F" : "H";
                statusText += " " + this.getNXDNDecoder().getRFChannelStr();
                statusText += " " + this.getNXDNDecoder().getRAN().toString().padStart(2, " ");
                statusText += " " + this.getNXDNDecoder().getMessageType().toString(16).padStart(2, "0");
                statusText += " " + this.getNXDNDecoder().getSourceId().toString().padStart(5, " ");
                statusText += ">" + this.getNXDNDecoder().isGroupCall() ? "G" : "I";
                statusText += " " + this.getNXDNDecoder().getDestinationId().toString().padStart(5, " ");
            }
        }
        else
            statusText += "NXD>RU";
        this.m_signalFormat = this.signalFormatNXDN;
        break;
    default:
        statusText += "XXX>";
        this.m_signalFormat = this.signalFormatNone;
        break;
    }
    global1 = statusText;
}

DSDDecoder.prototype.getSymbolPLLLocked = function()
{
    return this.m_dsdSymbol.getPLLLocked();
}

DSDDecoder.prototype.getDMRDecoder = function()
{
    return this.m_dsdDMR;
}

DSDDecoder.prototype.getDStarDecoder = function()
{
    return this.m_dsdDstar;
}

DSDDecoder.prototype.getDPMRDecoder = function()
{
    return this.m_dsdDPMR;
}

DSDDecoder.prototype.getYSFDecoder = function()
{
    return this.m_dsdYSF;
}

DSDDecoder.prototype.getNXDNDecoder = function()
{
    return this.m_dsdNXDN;
}

DSDDecoder.prototype.enableMbelib = function(enable)
{
    this.m_mbelibEnable = enable;
}

DSDDecoder.prototype.setQuiet = function()
{
    this.m_opts.errorbars = 0;
    this.m_opts.verbose = 0;
}

DSDDecoder.prototype.setVerbosity = function(verbosity)
{
    this.m_opts.verbose = verbosity;
}

DSDDecoder.prototype.showErrorBars = function()
{
    this.m_opts.errorbars = 1;
}

DSDDecoder.prototype.showSymbolTiming = function()
{
    this.m_opts.symboltiming = 1;
    this.m_opts.errorbars = 1;
}

DSDDecoder.prototype.setP25DisplayOptions = function(mode, on)
{
    switch (mode) {
    case DSDDecoder.DSDShowP25EncryptionSyncBits:
        this.m_opts.p25enc = (on ? 1 : 0);
        break;
    case DSDDecoder.DSDShowP25LinkControlBits:
        this.m_opts.p25lc = (on ? 1 : 0);
        break;
    case DSDDecoder.DSDShowP25StatusBitsAndLowSpeedData:
        this.m_opts.p25status = (on ? 1 : 0);
        break;
    case DSDDecoder.DSDShowP25TalkGroupInfo:
        this.m_opts.p25tg = (on ? 1 : 0);
        break;
    default:
        break;
    }
}

DSDDecoder.prototype.muteEncryptedP25 = function(on)
{
    this.m_opts.unmute_encrypted_p25 = (on ? 0 : 1);
}

DSDDecoder.prototype.setDecodeMode = function(mode, on)
{
    switch (mode) {
    case DSDDecoder.DSDDecodeNone:
        if (on) {
            this.m_opts.frame_dmr = 0;
            this.m_opts.frame_dstar = 0;
            this.m_opts.frame_p25p1 = 0;
            this.m_opts.frame_nxdn48 = 0;
            this.m_opts.frame_nxdn96 = 0;
            this.m_opts.frame_provoice = 0;
            this.m_opts.frame_x2tdma = 0;
            this.m_opts.frame_dpmr = 0;
            this.m_opts.frame_ysf = 0;
        }
        break;
    case DSDDecoder.DSDDecodeDMR:
        this.m_opts.frame_dmr = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeDStar:
        this.m_opts.frame_dstar = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeP25P1:
        this.m_opts.frame_p25p1 = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeDPMR:
        this.m_opts.frame_dpmr = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate2400);
        else
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeNXDN48:
        this.m_opts.frame_nxdn48 = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate2400);
        else
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeNXDN96:
        this.m_opts.frame_nxdn96 = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeProVoice:
        this.m_opts.frame_provoice = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate9600);
        else
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeX2TDMA:
        this.m_opts.frame_x2tdma = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeYSF:
        this.m_opts.frame_ysf = (on ? 1 : 0);
        if (on)
            this.setDataRate(DSDDecoder.DSDRate4800);
        break;
    case DSDDecoder.DSDDecodeAuto:
        this.m_opts.frame_dmr = 0;
        this.m_opts.frame_dstar = 0;
        this.m_opts.frame_p25p1 = 0;
        this.m_opts.frame_nxdn48 = 0;
        this.m_opts.frame_nxdn96 = 0;
        this.m_opts.frame_provoice = 0;
        this.m_opts.frame_x2tdma = 0;
        this.m_opts.frame_dpmr = 0;
        this.m_opts.frame_ysf = 0;
        switch (this.m_dataRate) {
        case DSDDecoder.DSDRate2400:
            this.m_opts.frame_nxdn48 = (on ? 1 : 0);
            this.m_opts.frame_dpmr = (on ? 1 : 0);
            break;
        case DSDDecoder.DSDRate4800:
            this.m_opts.frame_dmr = (on ? 1 : 0);
            this.m_opts.frame_dstar = (on ? 1 : 0);
            this.m_opts.frame_x2tdma = (on ? 1 : 0);
            this.m_opts.frame_p25p1 = (on ? 1 : 0);
            this.m_opts.frame_nxdn96 = (on ? 1 : 0);
            this.m_opts.frame_ysf = (on ? 1 : 0);
            break;
        case DSDDecoder.DSDRate9600:
            this.m_opts.frame_provoice = (on ? 1 : 0);
            break;
        default:
            this.m_opts.frame_dmr = (on ? 1 : 0);
            this.m_opts.frame_dstar = (on ? 1 : 0);
            this.m_opts.frame_x2tdma = (on ? 1 : 0);
            this.m_opts.frame_p25p1 = (on ? 1 : 0);
            this.m_opts.frame_nxdn96 = (on ? 1 : 0);
            this.m_opts.frame_ysf = (on ? 1 : 0);
            break;
        }
        break;
    default:
        break;
    }
    this.resetFrameSync();
    this.noCarrier();
    this.m_squelchTimeoutCount = 0;
    this.m_nxdnInterSyncCount = -1;
}


DSDDecoder.prototype.setAudioGain = function(gain)
{
    this.m_opts.audio_gain = gain;

    if (this.m_opts.audio_gain < 0)
    {}
    else if (this.m_opts.audio_gain === 0) {
        this.m_mbeDecoder1.setAudioGain(25);
        this.m_mbeDecoder1.setVolume(1);
        this.m_mbeDecoder1.setAutoGain(true);
        this.m_mbeDecoder2.setAudioGain(25);
        this.m_mbeDecoder2.setVolume(1);
        this.m_mbeDecoder2.setAutoGain(true);
    } else {
        this.m_mbeDecoder1.setAudioGain(this.m_opts.audio_gain);
        this.m_mbeDecoder1.setVolume(this.m_opts.audio_gain);
        this.m_mbeDecoder1.setAutoGain(false);
        this.m_mbeDecoder2.setAudioGain(this.m_opts.audio_gain);
        this.m_mbeDecoder2.setVolume(this.m_opts.audio_gain);
        this.m_mbeDecoder2.setAutoGain(false);
    }
}

DSDDecoder.prototype.setUvQuality = function(uvquality)
{
    this.m_opts.uvquality = uvquality;
    if (this.m_opts.uvquality < 1)
        this.m_opts.uvquality = 1;
    else if (this.m_opts.uvquality > 64)
        this.m_opts.uvquality = 64;
}

DSDDecoder.prototype.setUpsampling = function(upsampling)
{
    if (upsampling > 7)
        upsampling = 7;
    if (upsampling < 0)
        upsampling = 0;
    this.m_mbeDecoder1.setUpsamplingFactor(upsampling);
    this.m_mbeDecoder2.setUpsamplingFactor(upsampling);
}

DSDDecoder.prototype.setStereo = function(on)
{
    this.m_mbeDecoder1.setStereo(on);
    this.m_mbeDecoder2.setStereo(on);
}

DSDDecoder.prototype.setInvertedXTDMA = function(on)
{
    this.m_opts.inverted_x2tdma = (on ? 1 : 0);
}

DSDDecoder.prototype.enableCosineFiltering = function(on)
{
    this.m_opts.use_cosine_filter = (on ? 1 : 0);
}

DSDDecoder.prototype.enableAudioOut = function(on)
{
    this.m_opts.audio_out = (on ? 1 : 0);
}

DSDDecoder.prototype.enableScanResumeAfterTDULCFrames = function(nbFrames)
{
    this.m_opts.resume = nbFrames;
}

DSDDecoder.prototype.setDataRate = function(dataRate)
{
    this.m_dataRate = dataRate;
    switch(dataRate) {
    case DSDDecoder.DSDRate2400:
        this.m_dsdSymbol.setSamplesPerSymbol(20);
        break;
    case DSDDecoder.DSDRate4800:
        this.m_dsdSymbol.setSamplesPerSymbol(10);
        break;
    case DSDDecoder.DSDRate9600:
        this.m_dsdSymbol.setSamplesPerSymbol(5);
        break;
    default:
        this.m_dsdSymbol.setSamplesPerSymbol(10);
        break;
    }
}

DSDDecoder.prototype.setMyPoint = function(lat, lon)
{
    this.m_myPoint.setLatLon(lat, lon);
}

DSDDecoder.prototype.setSymbolPLLLock = function(pllLock)
{
    this.m_dsdSymbol.setPLLLock(pllLock);
}

DSDDecoder.prototype.setDMRBasicPrivacyKey = function(key)
{
    this.m_opts.dmr_bp_key = key;
}

DSDDecoder.prototype.upsampling = function()
{
    return this.m_mbeDecoder1.getUpsamplingFactor();
}

DSDDecoder.prototype.getMbeRate = function()
{
    return this.m_mbeRate;
}

DSDDecoder.prototype.setMbeRate = function(mbeRate)
{
    this.m_mbeRate = mbeRate;
}

DSDDecoder.prototype.useHPMbelib = function(useHP)
{
    this.m_mbeDecoder1.useHP(useHP);
    this.m_mbeDecoder2.useHP(useHP);
}

DSDDecoder.prototype.getFrameSync = function()
{
    if (this.m_t < 18)
        this.m_t++;
    else {
        let syncEngine = new DSDSync();
        this.m_dmrBurstType = DSDDMR.DSDDMRBurstNone;
        syncEngine.matchAll(this.m_dsdSymbol.getSyncDibitBack(DSDSync.m_history));
        if (this.m_opts.frame_p25p1 === 1) {
            if (syncEngine.isMatching(DSDSync.SyncP25P1)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_state.ftype = "+P25 Phase 1 ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +P25p1    ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncP25p1P;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncP25p1P;
            }
            if (syncEngine.isMatching(DSDSync.SyncP25P1Inv)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4, true);
                this.m_state.ftype = "-P25 Phase 1 ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" -P25p1    ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncP25p1N;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncP25p1N;
            }
        }
        if (this.m_opts.frame_x2tdma === 1) {
            if (syncEngine.isMatching(DSDSync.SyncX2TDMADataBS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDBaseStation;
                this.m_state.ftype = "+X2-TDMAd    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +X2-TDMA  ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncX2TDMADataP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncX2TDMADataP;
            }
            if (syncEngine.isMatching(DSDSync.SyncX2TDMADataMS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDMobileStation;
                this.m_state.ftype = "+X2-TDMAd    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +X2-TDMA  ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncX2TDMADataP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncX2TDMADataP;
            }
            if (syncEngine.isMatching(DSDSync.SyncX2TDMAVoiceBS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDBaseStation;
                this.m_state.ftype = "+X2-TDMAv    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +X2-TDMA  ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncX2TDMAVoiceP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncX2TDMAVoiceP;
            }
            if (syncEngine.isMatching(DSDSync.SyncX2TDMAVoiceMS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDMobileStation;
                this.m_state.ftype = "+X2-TDMAv    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +X2-TDMA  ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncX2TDMAVoiceP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncX2TDMAVoiceP;
            }
        }
        if (this.m_opts.frame_ysf === 1) {
            if (syncEngine.isMatching(DSDSync.SyncYSF)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_state.ftype = "+YSF         ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync("+YSF       ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncYSF;
                this.m_mbeRate = DSDDecoder.DSDMBERateNone;
                return DSDDecoder.DSDSyncYSF;
            }
        }
        if (this.m_opts.frame_dmr === 1) {
            if (syncEngine.isMatching(DSDSync.SyncDMRDataBS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDBaseStation;
                this.m_dmrBurstType = DSDDMR.DSDDMRBaseStation;
                this.m_state.ftype = "+DMRd        ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +DMRd     ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDMRDataP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncDMRDataP;
            }
            if (syncEngine.isMatching(DSDSync.SyncDMRDataMS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDMobileStation;
                this.m_dmrBurstType = DSDDMR.DSDDMRMobileStation;
                this.m_state.ftype = "+DMRd        ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +DMRd     ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDMRDataMS;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncDMRDataMS;
            }
            if (syncEngine.isMatching(DSDSync.SyncDMRVoiceBS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDBaseStation;
                this.m_dmrBurstType = DSDDMR.DSDDMRBaseStation;
                this.m_state.ftype = "+DMRv        ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +DMRv     ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDMRVoiceP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncDMRVoiceP;
            }
            if (syncEngine.isMatching(DSDSync.SyncDMRVoiceMS)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_stationType = DSDDecoder.DSDMobileStation;
                this.m_dmrBurstType = DSDDMR.DSDDMRMobileStation;
                this.m_state.ftype = "+DMRv        ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +DMRv     ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDMRVoiceMS;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncDMRVoiceMS;
            }
        }
        if (this.m_opts.frame_provoice === 1) {
            if (syncEngine.isMatching(DSDSync.SyncProVoice) || syncEngine.isMatching(DSDSync.SyncProVoiceEA)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_state.ftype = "+ProVoice    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +ProVoice ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncProVoiceP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncProVoiceP;
            }
            else if (syncEngine.isMatching(DSDSync.SyncProVoiceInv) || syncEngine.isMatching(DSDSync.SyncProVoiceEAInv)) {
                this.m_state.carrier = 1;
                this.m_state.offset = this.m_synctest_pos;
                this.m_dsdSymbol.setFSK(4, true);
                this.m_state.ftype = "-ProVoice    ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" -ProVoice ",  this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncProVoiceN;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncProVoiceN;
            }

        }
        if ((this.m_opts.frame_nxdn96 === 1) || (this.m_opts.frame_nxdn48 === 1)) {
            if (syncEngine.isMatching(DSDSync.SyncNXDNRDCHFull)) {
                this.m_nxdnInterSyncCount = 0;
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                if (this.m_dataRate === DSDDecoder.DSDRate2400) {
                    this.m_state.ftype = "+NXDN48      ";
                    if (this.m_opts.errorbars === 1)
                        this.printFrameSync(" +NXDN48   ", this.m_synctest_pos + 1);
                } else {
                    this.m_state.ftype = "+NXDN96      ";
                    if (this.m_opts.errorbars === 1)
                        this.printFrameSync(" +NXDN96   ", this.m_synctest_pos + 1);
                }
                this.m_lastSyncType = DSDDecoder.DSDSyncNXDNP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncNXDNP;
            } else if (syncEngine.isMatching(DSDSync.SyncNXDNRDCHFullInv)) {
                this.m_nxdnInterSyncCount = 0;
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4, true);
                if (this.m_dataRate === DSDDecoder.DSDRate2400) {
                    this.m_state.ftype = "-NXDN48      ";
                    if (this.m_opts.errorbars === 1)
                        this.printFrameSync(" -NXDN48   ", this.m_synctest_pos + 1);
                } else {
                    this.m_state.ftype = "-NXDN96      ";
                    if (this.m_opts.errorbars === 1)
                        this.printFrameSync(" -NXDN96   ", this.m_synctest_pos + 1);
                }
                this.m_lastSyncType = DSDDecoder.DSDSyncNXDNN;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncNXDNN;
            }
            else if (syncEngine.isMatching(DSDSync.SyncNXDNRDCHFSW)) {
                if ((this.m_nxdnInterSyncCount > 0) && (this.m_nxdnInterSyncCount % 192 === 0)) {
                    this.m_state.carrier = 1;
                    this.m_dsdSymbol.setFSK(4);
                    if (this.m_dataRate === DSDDecoder.DSDRate2400) {
                        this.m_state.ftype = "+NXDN48      ";
                        if (this.m_opts.errorbars === 1)
                            this.printFrameSync(" +NXDN48   ", this.m_synctest_pos + 1);
                    } else {
                        this.m_state.ftype = "+NXDN96      ";
                        if (this.m_opts.errorbars === 1)
                            this.printFrameSync(" +NXDN96   ", this.m_synctest_pos + 1);
                    }
                    this.m_lastSyncType = DSDDecoder.DSDSyncNXDNP;
                    this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                    this.m_nxdnInterSyncCount = 0;
                    return DSDDecoder.DSDSyncNXDNP;
                } else
                    this.m_nxdnInterSyncCount = 0;
            } else if (syncEngine.isMatching(DSDSync.SyncNXDNRDCHFSWInv)) {
                if ((this.m_nxdnInterSyncCount > 0) && (this.m_nxdnInterSyncCount % 192 === 0)) {
                    this.m_state.carrier = 1;
                    this.m_dsdSymbol.setFSK(4, true);
                    if (this.m_dataRate === DSDDecoder.DSDRate2400) {
                        this.m_state.ftype = "-NXDN48      ";
                        if (this.m_opts.errorbars === 1)
                            this.printFrameSync(" -NXDN48   ", this.m_synctest_pos + 1);
                    } else {
                        this.m_state.ftype = "-NXDN96      ";
                        if (this.m_opts.errorbars === 1)
                            this.printFrameSync(" -NXDN96   ", this.m_synctest_pos + 1);
                    }
                    this.m_lastSyncType = DSDDecoder.DSDSyncNXDNN;
                    this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                    this.m_nxdnInterSyncCount = 0;
                    return DSDDecoder.DSDSyncNXDNN;
                } else {
                    this.m_nxdnInterSyncCount = 0;
                }
            }
        }
        if (this.m_opts.frame_dpmr === 1) {
            if (syncEngine.isMatching(DSDSync.SyncDPMRFS1)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(4);
                this.m_state.ftype = "+dPMR        ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync("+dPMR      ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDPMR;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2450;
                return DSDDecoder.DSDSyncDPMR;
            }
        }
        if (this.m_opts.frame_dstar === 1) {
            if (syncEngine.isMatching(DSDSync.SyncDStar)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(2);
                this.m_state.ftype = "+D-STAR      ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +D-STAR   ",  this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDStarP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2400;
                return DSDDecoder.DSDSyncDStarP;
            }
            if (syncEngine.isMatching(DSDSync.SyncDStarInv)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(2, true);
                this.m_state.ftype = "-D-STAR      ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" -D-STAR   ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDStarN;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2400;
                return DSDDecoder.DSDSyncDStarN;
            }
            if (syncEngine.isMatching(DSDSync.SyncDStarHeader)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(2);
                this.m_state.ftype = "+D-STAR_HD   ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" +D-STAR_HD   ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDStarHeaderP;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2400;
                return DSDDecoder.DSDSyncDStarHeaderP;
            }
            if (syncEngine.isMatching(DSDSync.SyncDStarHeaderInv)) {
                this.m_state.carrier = 1;
                this.m_dsdSymbol.setFSK(2, true);
                this.m_state.ftype = "-D-STAR_HD   ";
                if (this.m_opts.errorbars === 1)
                    this.printFrameSync(" -D-STAR_HD   ", this.m_synctest_pos + 1);
                this.m_lastSyncType = DSDDecoder.DSDSyncDStarHeaderN;
                this.m_mbeRate = DSDDecoder.DSDMBERate3600x2400;
                return DSDDecoder.DSDSyncDStarHeaderN;
            }
        }
    }
    if (this.m_nxdnInterSyncCount >= 0)
        this.m_nxdnInterSyncCount++;
    this.m_synctest_pos++;
    if (this.m_synctest_pos >= 1800) {
        this.m_state.ftype = "No Sync      ";
        this.noCarrier();
        return -1;
    }
    return -2;
}

DSDDecoder.prototype.resetFrameSync = function()
{
    this.m_t = 0;
    this.m_synctest_pos = 0;
    this.m_sync = -2;
    this.m_nxdnInterSyncCount = -1;
    this.m_fsmState = DSDDecoder.DSDLookForSync;
}

DSDDecoder.prototype.printFrameSync = function(frametype, offset)
{
}

DSDDecoder.prototype.noCarrier = function()
{
    this.m_dsdSymbol.noCarrier();
    this.m_stationType = DSDDecoder.DSDStationTypeNotApplicable;
    this.m_lastSyncType = DSDDecoder.DSDSyncNone;
    this.m_state.carrier = 0;
    this.m_state.slot0light = " ".repeat(26);
    this.m_state.slot1light = " ".repeat(26);
    this.m_state.fsubtype = "";
    this.m_state.ftype = "";
    this.m_state.lasttg = 0;
    this.m_state.lastsrc = 0;
    this.m_state.lastp25type = 0;
    this.m_state.repeat = 0;
    this.m_state.nac = 0;
    this.m_state.numtdulc = 0;
    this.m_state.firstframe = 0;
    this.m_state.algid = "_".repeat(8);
    this.m_state.keyid = "_".repeat(16);
    this.m_mbeDecoder1.initMbeParms();
    this.m_mbeDecoder2.initMbeParms();
    this.m_voice1On = false;
    this.m_voice2On = false;
}

DSDDecoder.prototype.printFrameInfo = function()
{
}

DSDDecoder.prototype.processFrameInit = function()
{
    if ((this.m_syncType === DSDDecoder.DSDSyncDMRDataP) || (this.m_syncType === DSDDecoder.DSDSyncDMRVoiceP)) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        if (this.m_syncType === DSDDecoder.DSDSyncDMRVoiceP) {
            this.m_state.fsubtype = " VOICE        ";
            this.m_dsdDMR.initVoice();
            this.m_dsdDMR.processVoice();
            this.m_fsmState = DSDDecoder.DSDprocessDMRvoice;
        } else {
            this.m_dsdDMR.initData();
            this.m_dsdDMR.processData();
            this.m_fsmState = DSDDecoder.DSDprocessDMRdata;
        }
    } else if ((this.m_syncType === DSDDecoder.DSDSyncDMRDataMS) || (this.m_syncType === DSDDecoder.DSDSyncDMRVoiceMS)) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        if (this.m_syncType === DSDDecoder.DSDSyncDMRVoiceMS) {
            this.m_state.fsubtype = " VOICE        ";
            this.m_dsdDMR.initVoiceMS();
            this.m_dsdDMR.processVoiceMS();
            this.m_fsmState = DSDDecoder.DSDprocessDMRvoiceMS;
        } else {
            this.m_dsdDMR.initDataMS();
            this.m_dsdDMR.processDataMS();
            this.m_fsmState = DSDDecoder.DSDprocessDMRdataMS;
        }

    } else if ((this.m_syncType === DSDDecoder.DSDSyncDStarP) || (this.m_syncType === DSDDecoder.DSDSyncDStarN)) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        this.m_state.nac = 0;
        this.m_state.fsubtype = " VOICE        ";
        this.m_dsdDstar.init();
        this.m_dsdDstar.process();
        this.m_fsmState = DSDDecoder.DSDprocessDSTAR;
    } else if ((this.m_syncType === DSDDecoder.DSDSyncDStarHeaderP) || (this.m_syncType === DSDDecoder.DSDSyncDStarHeaderN)) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        this.m_state.nac = 0;
        this.m_state.fsubtype = " DATA         ";
        this.m_dsdDstar.init(true);
        this.m_dsdDstar.processHD();
        this.m_fsmState = DSDDecoder.DSDprocessDSTAR_HD;
    } else if ((this.m_syncType === DSDDecoder.DSDSyncNXDNP) || (this.m_syncType === DSDDecoder.DSDSyncNXDNN)) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        this.m_state.fsubtype = " RDCH         ";
        this.m_dsdNXDN.init();
        this.m_dsdNXDN.process();
        this.m_fsmState = DSDDecoder.DSDprocessNXDN;
    } else if (this.m_syncType === DSDDecoder.DSDSyncDPMR) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        this.m_state.fsubtype = " ANY          ";
        this.m_dsdDPMR.init();
        this.m_dsdDPMR.process();
        this.m_fsmState = DSDDecoder.DSDprocessDPMR;
    } else if (this.m_syncType === DSDDecoder.DSDSyncYSF) {
        this.m_state.nac = 0;
        this.m_state.lastsrc = 0;
        this.m_state.lasttg = 0;
        this.m_state.fsubtype = " ANY          ";
        this.m_dsdYSF.init();
        this.m_dsdYSF.process();
        this.m_fsmState = DSDDecoder.DSDprocessYSF;
    } else {
        this.noCarrier();
        this.m_fsmState = DSDDecoder.DSDLookForSync;
    }
}

DSDDecoder.comp = function(a, b)
{
    if (a === b)
        return 0;
    else if (a < b)
        return -1;
    else
        return 1;
}


//======================================================= MBELIB
// Based on https://github.com/szechyjs/mbelib

function mbe_parms()
{
    this.w0 = 0;
    this.L = 0;
    this.K = 0;
    this.Vl = new Int32Array(57);
    this.Ml = new Float32Array(57);
    this.log2Ml = new Float32Array(57);
    this.PHIl = new Float32Array(57);
    this.PSIl = new Float32Array(57);
    this.gamma = 0;
    this.un = 0;
    this.repeat = 0;
}


const golayGenerator = new Int32Array([0x63a, 0x31d, 0x7b4, 0x3da, 0x1ed, 0x6cc, 0x366, 0x1b3, 0x6e3, 0x54b, 0x49f, 0x475]);
const golayMatrix = new Int32Array([
                                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 2084, 0, 0, 0, 769, 0, 1024, 144,
                                       2, 0, 0, 0, 0, 0, 0, 0, 72, 0, 0, 0, 72, 0, 72, 72, 72, 0, 0, 0, 16, 0, 1, 1538, 384, 0, 134, 2048, 1056, 288,
                                       2576, 5, 72, 0, 0, 0, 0, 0, 0, 0, 1280, 0, 0, 0, 4, 0, 546, 144, 2049, 0, 0, 0, 66, 0, 1, 144, 520, 0, 2056, 144,
                                       1056, 144, 324, 144, 144, 0, 0, 0, 2688, 0, 1, 32, 22, 0, 272, 3, 1056, 3076, 128, 768, 72, 0, 1, 268, 1056, 1, 1, 2112, 1, 576,
                                       1056, 1056, 1056, 10, 1, 144, 1056, 0, 0, 0, 0, 0, 0, 0, 1280, 0, 0, 0, 160, 0, 21, 2560, 2, 0, 0, 0, 16, 0, 704, 9,
                                       2, 0, 2056, 1092, 2, 288, 2, 2, 2, 0, 0, 0, 16, 0, 2050, 132, 545, 0, 1536, 3, 2308, 288, 128, 1040, 72, 0, 16, 16, 16, 288,
                                       1036, 2112, 16, 288, 65, 648, 16, 288, 288, 288, 2, 0, 0, 0, 1280, 0, 1280, 1280, 1280, 0, 2056, 3, 592, 64, 128, 44, 1280, 0, 2056, 544,
                                       133, 6, 48, 2112, 1280, 2056, 2056, 256, 2056, 1537, 2056, 144, 2, 0, 100, 3, 8, 536, 128, 2112, 1280, 3, 128, 3, 3, 128, 128, 3, 128, 1152,
                                       770, 2112, 16, 2112, 1, 2112, 2112, 20, 2056, 3, 1056, 288, 128, 2112, 516, 0, 0, 0, 0, 0, 0, 0, 131, 0, 0, 0, 4, 0, 1024, 2560,
                                       304, 0, 0, 0, 16, 0, 1024, 320, 520, 0, 1024, 42, 2240, 1024, 1024, 5, 1024, 0, 0, 0, 16, 0, 772, 32, 3072, 0, 2081, 1408, 514, 18,
                                       128, 5, 72, 0, 16, 16, 16, 2184, 98, 5, 16, 576, 264, 5, 16, 5, 1024, 5, 5, 0, 0, 0, 4, 0, 2128, 32, 520, 0, 4, 4,
                                       4, 265, 128, 1090, 4, 0, 416, 3073, 520, 6, 520, 520, 520, 576, 19, 256, 4, 2080, 1024, 144, 520, 0, 1034, 32, 321, 32, 128, 32, 32, 576,
                                       128, 2072, 4, 128, 128, 32, 128, 576, 2052, 130, 16, 1296, 1, 32, 520, 576, 576, 576, 1056, 576, 128, 5, 2306, 0, 0, 0, 16, 0, 40, 2560,
                                       68, 0, 322, 2560, 1033, 2560, 128, 2560, 2560, 0, 16, 16, 16, 6, 2305, 1184, 16, 129, 548, 256, 16, 88, 1024, 2560, 2, 0, 16, 16, 16, 1089,
                                       128, 266, 16, 12, 128, 96, 16, 128, 128, 2560, 128, 16, 16, 16, 16, 512, 16, 16, 16, 3074, 16, 16, 16, 288, 128, 5, 16, 0, 513, 200,
                                       2082, 6, 128, 17, 1280, 1072, 128, 256, 4, 128, 128, 2560, 128, 6, 1088, 256, 16, 6, 6, 6, 520, 256, 2056, 256, 256, 6, 128, 256, 97, 2304,
                                       128, 1540, 16, 128, 128, 32, 128, 128, 128, 3, 128, 128, 128, 128, 128, 41, 16, 16, 16, 6, 128, 2112, 16, 576, 128, 256, 16, 128, 128, 1032,
                                       128, 0, 0, 0, 0, 0, 0, 0, 528, 0, 0, 0, 160, 0, 1024, 262, 2049, 0, 0, 0, 66, 0, 1024, 9, 384, 0, 1024, 2048, 28, 1024,
                                       1024, 608, 1024, 0, 0, 0, 1029, 0, 2050, 32, 384, 0, 272, 2048, 514, 641, 36, 1040, 72, 0, 552, 2048, 384, 84, 384, 384, 384, 2048, 65, 2048,
                                       2048, 10, 1024, 2048, 384, 0, 0, 0, 66, 0, 140, 32, 2049, 0, 272, 1544, 2049, 64, 2049, 2049, 2049, 0, 66, 66, 66, 2816, 48, 1028, 66, 37,
                                       640, 256, 66, 10, 1024, 144, 2049, 0, 272, 32, 8, 32, 1600, 32, 32, 272, 272, 196, 272, 10, 272, 32, 2049, 1152, 2052, 529, 66, 10, 1, 32,
                                       384, 10, 272, 2048, 1056, 10, 10, 10, 516, 0, 0, 0, 160, 0, 2050, 9, 68, 0, 160, 160, 160, 64, 776, 1040, 160, 0, 260, 9, 3584, 9,
                                       48, 9, 9, 530, 65, 256, 160, 2180, 1024, 9, 2, 0, 2050, 832, 8, 2050, 2050, 1040, 2050, 12, 65, 1040, 160, 1040, 2050, 1040, 1040, 1152, 65, 38,
                                       16, 512, 2050, 9, 384, 65, 65, 2048, 65, 288, 65, 1040, 516, 0, 513, 2068, 8, 64, 48, 642, 1280, 64, 1030, 256, 160, 64, 64, 64, 2049, 1152,
                                       48, 256, 66, 48, 48, 9, 48, 256, 2056, 256, 256, 64, 48, 256, 516, 1152, 8, 8, 8, 261, 2050, 32, 8, 2592, 272, 3, 8, 64, 128, 1040,
                                       516, 1152, 1152, 1152, 8, 1152, 48, 2112, 516, 1152, 65, 256, 516, 10, 516, 516, 516, 0, 0, 0, 2312, 0, 1024, 32, 68, 0, 1024, 81, 514, 1024,
                                       1024, 136, 1024, 0, 1024, 644, 33, 1024, 1024, 2066, 1024, 1024, 1024, 256, 1024, 1024, 1024, 1024, 1024, 0, 192, 32, 514, 32, 25, 32, 32, 12, 514, 514,
                                       514, 2368, 1024, 32, 514, 259, 2052, 1096, 16, 512, 1024, 32, 384, 176, 1024, 2048, 514, 1024, 1024, 5, 1024, 0, 513, 32, 1168, 32, 258, 32, 32, 2178,
                                       104, 256, 4, 532, 1024, 32, 2049, 24, 2052, 256, 66, 193, 1024, 32, 520, 256, 1024, 256, 256, 1024, 1024, 256, 1024, 32, 2052, 32, 32, 32, 32, 32,
                                       32, 1025, 272, 32, 514, 32, 128, 32, 32, 2052, 2052, 32, 2052, 32, 2052, 32, 32, 576, 2052, 256, 137, 10, 1024, 32, 80, 0, 513, 1026, 68, 400,
                                       68, 68, 68, 12, 2064, 256, 160, 35, 1024, 2560, 68, 2144, 138, 256, 16, 512, 1024, 9, 68, 256, 1024, 256, 256, 1024, 1024, 256, 1024, 12, 1312, 2177,
                                       16, 512, 2050, 32, 68, 12, 12, 12, 514, 12, 128, 1040, 257, 512, 16, 16, 16, 512, 512, 512, 16, 12, 65, 256, 16, 512, 1024, 194, 2088, 513,
                                       513, 256, 513, 3080, 513, 32, 68, 256, 513, 256, 256, 64, 128, 256, 26, 256, 513, 256, 256, 6, 48, 256, 2176, 256, 256, 256, 256, 256, 1024, 256,
                                       256, 82, 513, 32, 8, 32, 128, 32, 32, 12, 128, 256, 3136, 128, 128, 32, 128, 1152, 2052, 256, 16, 512, 328, 32, 1027, 256, 34, 256, 256, 2065,
                                       128, 256, 516, 0, 0, 0, 0, 0, 0, 0, 528, 0, 0, 0, 4, 0, 2432, 1057, 2, 0, 0, 0, 1160, 0, 1, 320, 2, 0, 112, 2048,
                                       2, 524, 2, 2, 2, 0, 0, 0, 290, 0, 1, 132, 3072, 0, 1536, 2048, 145, 18, 36, 768, 72, 0, 1, 2048, 580, 1, 1, 56, 1, 2048,
                                       264, 2048, 2048, 1216, 1, 2048, 2, 0, 0, 0, 4, 0, 1, 2058, 224, 0, 4, 4, 4, 64, 1048, 768, 4, 0, 1, 544, 2320, 1, 1, 1028,
                                       1, 1282, 640, 73, 4, 2080, 1, 144, 2, 0, 1, 1104, 8, 1, 1, 768, 1, 168, 2114, 768, 4, 768, 1, 768, 768, 1, 1, 130, 1, 1,
                                       1, 1, 1, 20, 1, 2048, 1056, 1, 1, 768, 1, 0, 0, 0, 2113, 0, 40, 132, 2, 0, 1536, 280, 2, 64, 2, 2, 2, 0, 260, 544,
                                       2, 3088, 2, 2, 2, 129, 2, 2, 2, 2, 2, 2, 2, 0, 1536, 132, 8, 132, 336, 132, 132, 1536, 1536, 96, 1536, 2057, 1536, 132, 2, 74,
                                       2208, 1281, 16, 512, 1, 132, 2, 20, 1536, 2048, 2, 288, 2, 2, 2, 0, 146, 544, 8, 64, 2564, 17, 1280, 64, 289, 3200, 4, 64, 64, 64,
                                       2, 544, 1088, 544, 544, 392, 1, 544, 2, 20, 2056, 544, 2, 64, 2, 2, 2, 2304, 8, 8, 8, 1058, 1, 132, 8, 20, 1536, 3, 8, 64,
                                       128, 768, 2096, 20, 1, 544, 8, 1, 1, 2112, 1, 20, 20, 20, 448, 20, 1, 1032, 2, 0, 0, 0, 4, 0, 40, 320, 3072, 0, 4, 4,
                                       4, 18, 577, 136, 4, 0, 2562, 320, 33, 320, 148, 320, 320, 129, 264, 1552, 4, 2080, 1024, 320, 2, 0, 192, 521, 3072, 18, 3072, 3072, 3072, 18,
                                       264, 96, 4, 18, 18, 18, 3072, 1060, 264, 130, 16, 512, 1, 320, 3072, 264, 264, 2048, 264, 18, 264, 5, 672, 0, 4, 4, 4, 1664, 258, 17,
                                       4, 4, 4, 4, 4, 2080, 4, 4, 4, 24, 1088, 130, 4, 2080, 1, 320, 520, 2080, 4, 4, 4, 2080, 2080, 2080, 4, 2304, 560, 130, 4, 76,
                                       1, 32, 3072, 1025, 4, 4, 4, 18, 128, 768, 4, 130, 1, 130, 130, 1, 1, 130, 1, 576, 264, 130, 4, 2080, 1, 1032, 80, 0, 40, 1026,
                                       896, 40, 40, 17, 40, 129, 2064, 96, 4, 1284, 40, 2560, 2, 129, 1088, 2060, 16, 512, 40, 320, 2, 129, 129, 129, 2, 129, 2, 2, 2, 2304,
                                       7, 96, 16, 512, 40, 132, 3072, 96, 1536, 96, 96, 18, 128, 96, 257, 512, 16, 16, 16, 512, 512, 512, 16, 129, 264, 96, 16, 512, 2116, 1032,
                                       2, 2304, 1088, 17, 4, 17, 40, 17, 17, 522, 4, 4, 4, 64, 128, 17, 4, 1088, 1088, 544, 1088, 6, 1088, 17, 2176, 129, 1088, 256, 4, 2080,
                                       784, 1032, 2, 2304, 2304, 2304, 8, 2304, 128, 17, 578, 2304, 128, 96, 4, 128, 128, 1032, 128, 2304, 1088, 130, 16, 512, 1, 1032, 292, 20, 34, 1032,
                                       2561, 1032, 128, 1032, 1032, 0, 0, 0, 528, 0, 528, 528, 528, 0, 11, 2048, 1344, 64, 36, 136, 528, 0, 260, 2048, 33, 162, 2120, 1028, 528, 2048,
                                       640, 2048, 2048, 273, 1024, 2048, 2, 0, 192, 2048, 8, 1288, 36, 67, 528, 2048, 36, 2048, 2048, 36, 36, 2048, 36, 2048, 1042, 2048, 2048, 512, 1, 2048,
                                       384, 2048, 2048, 2048, 2048, 2048, 36, 2048, 2048, 0, 3104, 385, 8, 64, 258, 1028, 528, 64, 640, 50, 4, 64, 64, 64, 2049, 24, 640, 1028, 66, 1028,
                                       1, 1028, 1028, 640, 640, 2048, 640, 64, 640, 1028, 296, 518, 8, 8, 8, 2192, 1, 32, 8, 1025, 272, 2048, 8, 64, 36, 768, 1154, 352, 1, 2048,
                                       8, 1, 1, 1028, 1, 2048, 640, 2048, 2048, 10, 1, 2048, 80, 0, 260, 1026, 8, 64, 1153, 2336, 528, 64, 2064, 517, 160, 64, 64, 64, 2, 260,
                                       260, 208, 260, 512, 260, 9, 2, 1064, 260, 2048, 2, 64, 2, 2, 2, 49, 8, 8, 8, 512, 2050, 132, 8, 386, 1536, 2048, 8, 64, 36, 1040,
                                       257, 512, 260, 2048, 8, 512, 512, 512, 1120, 2048, 65, 2048, 2048, 512, 152, 2048, 2, 64, 8, 8, 8, 64, 64, 64, 8, 64, 64, 64, 8, 64,
                                       64, 64, 64, 2051, 260, 544, 8, 64, 48, 1028, 2176, 64, 640, 256, 1041, 64, 64, 64, 2, 8, 8, 8, 8, 64, 8, 8, 8, 64, 8, 8,
                                       8, 64, 64, 64, 8, 1152, 8, 8, 8, 512, 1, 274, 8, 20, 34, 2048, 8, 64, 3328, 161, 516, 0, 192, 1026, 33, 2053, 258, 136, 528, 800,
                                       2064, 136, 4, 136, 1024, 136, 136, 24, 33, 33, 33, 512, 1024, 320, 33, 70, 1024, 2048, 33, 1024, 1024, 136, 1024, 192, 192, 276, 192, 512, 192, 32,
                                       3072, 1025, 192, 2048, 514, 18, 36, 136, 257, 512, 192, 2048, 33, 512, 512, 512, 14, 2048, 264, 2048, 2048, 512, 1024, 2048, 80, 24, 258, 2624, 4, 258,
                                       258, 32, 258, 1025, 4, 4, 4, 64, 258, 136, 4, 24, 24, 24, 33, 24, 258, 1028, 2176, 24, 640, 256, 4, 2080, 1024, 515, 80, 1025, 192, 32,
                                       8, 32, 258, 32, 32, 1025, 1025, 1025, 4, 1025, 2568, 32, 80, 24, 2052, 130, 1792, 512, 1, 32, 80, 1025, 34, 2048, 80, 388, 80, 80, 80, 1026,
                                       2064, 1026, 1026, 512, 40, 1026, 68, 2064, 2064, 1026, 2064, 64, 2064, 136, 257, 512, 260, 1026, 33, 512, 512, 512, 2176, 129, 2064, 256, 584, 512, 1024, 52,
                                       2, 512, 192, 1026, 8, 512, 512, 512, 257, 12, 2064, 96, 257, 512, 257, 257, 257, 512, 512, 512, 16, 512, 512, 512, 512, 512, 34, 2048, 1156, 512,
                                       512, 512, 257, 164, 513, 1026, 8, 64, 258, 17, 2176, 64, 2064, 256, 4, 64, 64, 64, 1568, 24, 1088, 256, 2176, 512, 2176, 2176, 2176, 256, 34, 256,
                                       256, 64, 13, 256, 2176, 2304, 8, 8, 8, 512, 1044, 32, 8, 1025, 34, 656, 8, 64, 128, 2054, 257, 512, 34, 69, 8, 512, 512, 512, 2176, 34,
                                       34, 256, 34, 512, 34, 1032, 80
                                   ]);
const hammingGenerator = new Int32Array([0x7f08, 0x78e4, 0x66d2, 0x55b1]);
const imbe7100x4400hammingGenerator = new Int32Array([0x7ac8, 0x3d64, 0x1eb2, 0x7591]);
const hammingMatrix = new Int32Array([0x0, 0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x100, 0x200, 0x400, 0x800, 0x1000, 0x2000, 0x4000]);

function mbe_golay2312(inn, out)
{
    let i, errs;
    let block = 0;
    for (i = 22; i >= 0; i--) {
        block = block << 1;
        block = block + inn[i];
    }
    mbe_checkGolayBlock(block);
    block = global1;
    for (i = 22; i >= 11; i--) {
        out[i] = (block & 2048) >> 11;
        block = block << 1;
    }
    for (i = 10; i >= 0; i--)
        out[i] = inn[i];
    errs = 0;
    for (i = 22; i >= 11; i--)
        if (out[i] !== inn[i])
            errs++;
    return errs;
}

function mbe_checkGolayBlock(block)
{
    let syndrome, eccexpected, eccbits, databits;
    let mask, block_l;
    block_l = block;
    mask = 0x400000;
    eccexpected = 0;
    for (let i = 0; i < 12; i++) {
        if ((block_l & mask) !== 0)
            eccexpected ^= golayGenerator[i];
        mask = mask >> 1;
    }
    eccbits = block_l & 0x7ff;
    syndrome = eccexpected ^ eccbits;
    databits = block_l >> 11;
    databits = databits ^ golayMatrix[syndrome];
    global1 = databits;
}

function mbe_hamming1511(inn, out)
{
    let i, j, errs, block, syndrome, stmp, stmp2;
    errs = 0;
    block = 0;
    for (i = 14; i >= 0; i--) {
        block <<= 1;
        block |= inn[i];
    }
    syndrome = 0;
    for (i = 0; i < 4; i++) {
        syndrome <<= 1;
        stmp = block;
        stmp &= hammingGenerator[i];
        stmp2 = stmp % 2;
        for (j = 0; j < 14; j++) {
            stmp >>= 1;
            stmp2 ^= (stmp % 2);
        }
        syndrome |= stmp2;
    }
    if (syndrome > 0) {
        errs++;
        block ^= hammingMatrix[syndrome];
    }
    for (i = 14; i >= 0; i--) {
        out[i] = (block & 0x4000) >> 14;
        block = block << 1;
    }
    return errs;
}

function mbe_7100x4400hamming1511(inn, out)
{
    let i, j, errs, block, syndrome, stmp, stmp2;
    errs = 0;
    block = 0;
    for (i = 14; i >= 0; i--) {
        block <<= 1;
        block |= inn[i];
    }
    syndrome = 0;
    for (i = 0; i < 4; i++) {
        syndrome <<= 1;
        stmp = block;
        stmp &= imbe7100x4400hammingGenerator[i];
        stmp2 = (stmp % 2);
        for (j = 0; j < 14; j++) {
            stmp >>= 1;
            stmp2 ^= (stmp % 2);
        }
        syndrome |= stmp2;
    }
    if (syndrome > 0) {
        errs++;
        block ^= hammingMatrix[syndrome];
    }
    for (i = 14; i >= 0; i--) {
        out[i] = (block & 0x4000) >> 14;
        block = block << 1;
    }
    return errs;
}

const AmbePlusLtable = new Float32Array([
                                            9,  9,  9,  9,  9,  9,
                                            10, 10, 10, 10, 10, 10,
                                            11, 11, 11, 11, 11, 11,
                                            12, 12, 12, 12, 12, 13,
                                            13, 13, 13, 13, 14, 14,
                                            14, 14, 15, 15, 15, 15,
                                            16, 16, 16, 16, 17, 17,
                                            17, 17, 18, 18, 18, 18,
                                            19, 19, 19, 20, 20, 20,
                                            21, 21, 21, 22, 22, 22,
                                            23, 23, 23, 24, 24, 24,
                                            25, 25, 26, 26, 26, 27,
                                            27, 28, 28, 29, 29, 30,
                                            30, 30, 31, 31, 32, 32,
                                            33, 33, 34, 34, 35, 36,
                                            36, 37, 37, 38, 38, 39,
                                            40, 40, 41, 42, 42, 43,
                                            43, 44, 45, 46, 46, 47,
                                            48, 48, 49, 50, 51, 52,
                                            52, 53, 54, 55, 56, 56,
                                            56, 56, 56, 56, 56, 56
                                        ]);

const AmbePlusVuv = new Int32Array([
                                       0, 0, 0, 0, 0, 0, 0, 0,
                                       0, 0, 0, 0, 0, 0, 1, 1,
                                       0, 0, 0, 0, 1, 1, 0, 0,
                                       0, 0, 0, 0, 1, 1, 1, 1,
                                       0, 0, 1, 1, 0, 0, 0, 0,
                                       0, 0, 1, 1, 0, 0, 1, 1,
                                       0, 0, 1, 1, 1, 1, 0, 0,
                                       0, 0, 1, 1, 1, 1, 1, 1,
                                       1, 1, 0, 0, 0, 0, 0, 0,
                                       1, 1, 0, 0, 0, 0, 1, 1,
                                       1, 1, 0, 0, 1, 1, 0, 0,
                                       1, 1, 0, 0, 1, 1, 1, 1,
                                       1, 1, 1, 1, 0, 0, 0, 0,
                                       1, 1, 1, 1, 0, 0, 1, 1,
                                       1, 1, 1, 1, 1, 1, 0, 0,
                                       1, 1, 1, 1, 1, 1, 1, 1
                                   ]);

const AmbePlusLmprbl = new Int32Array([
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          0, 0, 0, 0,
                                          2, 2, 2, 3,
                                          2, 2, 3, 3,
                                          2, 3, 3, 3,
                                          2, 3, 3, 4,
                                          3, 3, 3, 4,
                                          3, 3, 4, 4,
                                          3, 3, 4, 5,
                                          3, 4, 4, 5,
                                          3, 4, 5, 5,
                                          4, 4, 5, 5,
                                          4, 4, 5, 6,
                                          4, 4, 6, 6,
                                          4, 5, 6, 6,
                                          4, 5, 6, 7,
                                          5, 5, 6, 7,
                                          5, 5, 7, 7,
                                          5, 6, 7, 7,
                                          5, 6, 7, 8,
                                          5, 6, 8, 8,
                                          6, 6, 8, 8,
                                          6, 6, 8, 9,
                                          6, 7, 8, 9,
                                          6, 7, 9, 9,
                                          6, 7, 9, 10,
                                          7, 7, 9, 10,
                                          7, 8, 9, 10,
                                          7, 8, 10, 10,
                                          7, 8, 10, 11,
                                          8, 8, 10, 11,
                                          8, 9, 10, 11,
                                          8, 9, 11, 11,
                                          8, 9, 11, 12,
                                          8, 9, 11, 13,
                                          8, 9, 12, 13,
                                          8, 10, 12, 13,
                                          9, 10, 12, 13,
                                          9, 10, 12, 14,
                                          9, 10, 13, 14,
                                          9, 11, 13, 14,
                                          10, 11, 13, 14,
                                          10, 11, 13, 15,
                                          10, 11, 14, 15,
                                          10, 12, 14, 15,
                                          10, 12, 14, 16,
                                          11, 12, 14, 16,
                                          11, 12, 15, 16,
                                          11, 12, 15, 17,
                                          11, 13, 15, 17
                                      ]);

const AmbePlusDg = new Float32Array([
                                        0.000000, 0.118200, 0.215088, 0.421167, 0.590088, 0.749075, 0.879395, 0.996388,
                                        1.092285, 1.171577, 1.236572, 1.313450, 1.376465, 1.453342, 1.516357, 1.600346,
                                        1.669189, 1.742847, 1.803223, 1.880234, 1.943359, 2.025067, 2.092041, 2.178042,
                                        2.248535, 2.331718, 2.399902, 2.492343, 2.568115, 2.658677, 2.732910, 2.816496,
                                        2.885010, 2.956386, 3.014893, 3.078890, 3.131348, 3.206615, 3.268311, 3.344785,
                                        3.407471, 3.484885, 3.548340, 3.623339, 3.684814, 3.764509, 3.829834, 3.915298,
                                        3.985352, 4.072560, 4.144043, 4.231251, 4.302734, 4.399066, 4.478027, 4.572883,
                                        4.650635, 4.760785, 4.851074, 4.972361, 5.071777, 5.226203, 5.352783, 5.352783
                                    ]);

const AmbePlusPRBA24 = new Float32Array([
                                            -1.250000, -0.312500, -0.625000,
                                            -0.750000, -0.437500, -0.437500,
                                            -0.437500, -0.375000, -0.312500,
                                            -0.437500, -0.625000, -0.500000,
                                            -1.000000, -0.187500, -0.187500,
                                            -0.625000, -0.625000, -0.125000,
                                            -0.500000, -0.187500, -0.187500,
                                            -0.375000, -0.437500, -0.187500,
                                            -1.062500, -0.750000, -0.125000,
                                            -0.625000, -0.312500, -0.062500,
                                            -0.500000, -1.000000, -0.062500,
                                            -0.375000, -0.312500, -0.062500,
                                            -0.687500, -0.250000, 0.187500,
                                            -0.437500, -0.500000, 0.375000,
                                            -0.375000, -0.375000, 0.062500,
                                            -0.312500, -0.187500, 0.000000,
                                            -0.625000, -0.187500, -0.187500,
                                            -0.500000, -0.062500, -0.250000,
                                            -0.500000, -0.125000, -0.437500,
                                            -0.312500, -0.062500, -0.312500,
                                            -0.562500, -0.187500, -0.062500,
                                            -0.375000, -0.187500, -0.062500,
                                            -0.375000, -0.125000, -0.187500,
                                            -0.312500, -0.187500, -0.125000,
                                            -0.562500, 0.000000, 0.125000,
                                            -0.437500, 0.000000, 0.062500,
                                            -0.312500, -0.125000, 0.125000,
                                            -0.312500, -0.062500, 0.000000,
                                            -0.937500, -0.062500, 0.125000,
                                            -0.750000, -0.125000, 0.375000,
                                            -0.437500, -0.062500, 0.250000,
                                            -0.375000, -0.062500, 0.625000,
                                            -0.875000, 0.062500, -0.312500,
                                            -0.500000, 0.125000, -0.375000,
                                            -0.312500, 0.062500, -0.250000,
                                            -0.312500, 0.000000, -0.312500,
                                            -0.687500, 0.125000, -0.187500,
                                            -0.437500, 0.062500, -0.062500,
                                            -0.375000, 0.125000, -0.125000,
                                            -0.312500, 0.062500, -0.125000,
                                            -0.687500, 0.062500, -0.062500,
                                            -0.437500, 0.187500, 0.062500,
                                            -0.312500, 0.062500, 0.000000,
                                            -0.250000, 0.000000, 0.125000,
                                            -1.312500, 0.062500, 0.312500,
                                            -0.562500, 0.125000, 0.250000,
                                            -0.375000, 0.062500, 0.375000,
                                            -0.312500, 0.125000, 0.125000,
                                            -1.250000, 0.187500, -0.250000,
                                            -0.687500, 0.437500, -0.375000,
                                            -0.562500, 0.250000, -0.250000,
                                            -0.312500, 0.375000, -0.562500,
                                            -0.812500, 0.437500, -0.062500,
                                            -0.625000, 0.187500, -0.062500,
                                            -0.500000, 0.375000, -0.062500,
                                            -0.375000, 0.375000, -0.250000,
                                            -0.812500, 0.187500, 0.187500,
                                            -0.562500, 0.625000, 0.062500,
                                            -0.500000, 0.312500, 0.125000,
                                            -0.312500, 0.312500, 0.062500,
                                            -0.500000, 0.250000, 0.625000,
                                            -0.375000, 0.250000, 0.312500,
                                            -0.312500, 0.500000, 0.500000,
                                            -0.312500, 0.500000, 0.250000,
                                            -0.250000, -0.437500, -0.375000,
                                            -0.250000, -0.250000, -0.312500,
                                            -0.250000, -0.687500, -0.312500,
                                            -0.125000, -0.500000, -0.250000,
                                            -0.250000, -0.375000, -0.125000,
                                            -0.125000, -0.312500, -0.187500,
                                            -0.125000, -0.250000, -0.250000,
                                            -0.062500, -0.187500, -0.125000,
                                            -0.187500, -0.187500, -0.062500,
                                            -0.187500, -0.500000, 0.000000,
                                            -0.125000, -0.375000, -0.062500,
                                            -0.062500, -0.250000, 0.000000,
                                            -0.250000, -0.312500, 0.250000,
                                            -0.187500, -0.250000, 0.125000,
                                            -0.187500, -0.250000, 0.000000,
                                            -0.125000, -0.625000, 0.187500,
                                            -0.187500, -0.062500, -0.250000,
                                            -0.125000, -0.062500, -0.187500,
                                            -0.062500, 0.000000, -0.312500,
                                            -0.062500, 0.000000, -0.812500,
                                            -0.250000, -0.125000, -0.062500,
                                            -0.250000, -0.062500, -0.125000,
                                            -0.187500, 0.000000, -0.062500,
                                            -0.125000, -0.062500, -0.062500,
                                            -0.187500, 0.000000, 0.125000,
                                            -0.187500, -0.062500, 0.062500,
                                            -0.125000, -0.125000, 0.125000,
                                            -0.125000, -0.187500, 0.062500,
                                            -0.187500, -0.062500, 0.437500,
                                            -0.187500, -0.125000, 0.187500,
                                            -0.125000, 0.000000, 0.187500,
                                            -0.062500, 0.000000, 0.375000,
                                            -0.187500, 0.000000, -0.187500,
                                            -0.187500, 0.125000, -0.125000,
                                            -0.187500, 0.125000, -0.187500,
                                            -0.125000, 0.125000, -0.375000,
                                            -0.250000, 0.187500, 0.000000,
                                            -0.125000, 0.000000, -0.125000,
                                            -0.062500, 0.000000, -0.062500,
                                            -0.062500, 0.125000, -0.062500,
                                            -0.187500, 0.125000, 0.125000,
                                            -0.187500, 0.062500, 0.000000,
                                            -0.125000, 0.125000, 0.062500,
                                            -0.062500, 0.000000, 0.000000,
                                            -0.250000, 0.062500, 0.250000,
                                            -0.125000, 0.125000, 0.312500,
                                            -0.125000, 0.125000, 0.125000,
                                            -0.062500, 0.000000, 0.125000,
                                            -0.250000, 0.250000, -0.187500,
                                            -0.187500, 0.687500, -0.187500,
                                            -0.125000, 0.250000, -0.125000,
                                            -0.062500, 0.375000, -0.312500,
                                            -0.187500, 0.187500, -0.062500,
                                            -0.187500, 0.437500, -0.062500,
                                            -0.125000, 0.375000, 0.062500,
                                            -0.062500, 0.500000, 0.000000,
                                            -0.250000, 0.250000, 0.187500,
                                            -0.125000, 0.562500, 0.250000,
                                            -0.125000, 0.437500, 0.125000,
                                            -0.062500, 0.312500, 0.125000,
                                            -0.250000, 0.187500, 0.437500,
                                            -0.187500, 0.250000, 0.312500,
                                            -0.062500, 0.312500, 0.250000,
                                            -0.062500, 0.437500, 0.562500,
                                            -0.062500, -0.375000, -0.250000,
                                            0.000000, -0.250000, -0.375000,
                                            0.062500, -0.250000, -0.312500,
                                            0.062500, -0.375000, -0.312500,
                                            0.000000, -0.312500, -0.125000,
                                            0.000000, -0.250000, -0.062500,
                                            0.062500, -0.500000, -0.125000,
                                            0.062500, -0.250000, -0.187500,
                                            0.000000, -0.437500, 0.000000,
                                            0.000000, -0.250000, 0.000000,
                                            0.000000, -0.187500, 0.062500,
                                            0.062500, -0.375000, 0.000000,
                                            -0.062500, -0.187500, 0.125000,
                                            -0.062500, -0.375000, 0.062500,
                                            0.000000, -0.250000, 0.187500,
                                            0.000000, -0.312500, 0.125000,
                                            -0.062500, -0.125000, -0.250000,
                                            0.000000, -0.125000, -0.500000,
                                            0.000000, -0.062500, -0.250000,
                                            0.062500, -0.187500, -0.187500,
                                            -0.062500, -0.125000, -0.062500,
                                            -0.062500, -0.187500, 0.000000,
                                            0.000000, -0.125000, -0.125000,
                                            0.000000, -0.187500, -0.125000,
                                            -0.062500, -0.062500, 0.125000,
                                            0.000000, -0.125000, 0.000000,
                                            0.062500, -0.062500, 0.000000,
                                            0.062500, -0.125000, 0.000000,
                                            -0.062500, -0.125000, 0.437500,
                                            0.000000, -0.062500, 0.250000,
                                            0.000000, -0.125000, 0.187500,
                                            0.062500, -0.187500, 0.312500,
                                            -0.062500, 0.062500, -0.187500,
                                            -0.062500, 0.000000, -0.125000,
                                            0.062500, 0.062500, -0.125000,
                                            0.062500, 0.062500, -0.312500,
                                            0.000000, 0.062500, -0.062500,
                                            0.000000, 0.000000, 0.000000,
                                            0.062500, 0.000000, -0.125000,
                                            0.062500, 0.125000, -0.125000,
                                            0.000000, 0.062500, 0.125000,
                                            0.000000, 0.125000, 0.062500,
                                            0.062500, 0.000000, 0.125000,
                                            0.062500, 0.062500, 0.000000,
                                            -0.062500, 0.062500, 0.187500,
                                            -0.062500, 0.062500, 0.437500,
                                            0.000000, 0.062500, 0.250000,
                                            0.062500, 0.125000, 0.187500,
                                            0.000000, 0.250000, -0.250000,
                                            0.000000, 0.375000, -0.062500,
                                            0.000000, 0.187500, -0.125000,
                                            0.062500, 0.500000, -0.187500,
                                            0.000000, 0.250000, 0.000000,
                                            0.000000, 0.187500, 0.062500,
                                            0.062500, 0.312500, 0.062500,
                                            0.062500, 0.187500, 0.000000,
                                            -0.062500, 0.187500, 0.187500,
                                            0.000000, 0.250000, 0.125000,
                                            0.062500, 0.375000, 0.187500,
                                            0.062500, 0.250000, 0.250000,
                                            -0.062500, 0.187500, 0.500000,
                                            0.000000, 0.312500, 0.375000,
                                            0.000000, 0.125000, 0.312500,
                                            0.062500, 0.187500, 0.250000,
                                            0.125000, -0.125000, -0.312500,
                                            0.125000, -0.312500, -0.187500,
                                            0.187500, -0.375000, -0.250000,
                                            0.187500, -0.187500, -0.125000,
                                            0.125000, -0.187500, -0.062500,
                                            0.125000, -0.687500, -0.062500,
                                            0.125000, -0.187500, -0.062500,
                                            0.187500, -0.375000, -0.062500,
                                            0.062500, -0.250000, 0.062500,
                                            0.125000, -0.187500, 0.000000,
                                            0.125000, -0.187500, 0.125000,
                                            0.187500, -0.250000, 0.125000,
                                            0.062500, -0.187500, 0.187500,
                                            0.125000, -0.312500, 0.250000,
                                            0.125000, -0.375000, 0.125000,
                                            0.187500, -0.187500, 0.187500,
                                            0.062500, -0.125000, -0.125000,
                                            0.062500, 0.000000, -0.187500,
                                            0.125000, -0.062500, -0.187500,
                                            0.125000, -0.125000, -0.062500,
                                            0.062500, -0.062500, 0.062500,
                                            0.125000, -0.062500, 0.000000,
                                            0.125000, -0.125000, 0.000000,
                                            0.187500, -0.062500, 0.000000,
                                            0.062500, 0.000000, 0.187500,
                                            0.125000, -0.125000, 0.125000,
                                            0.125000, -0.062500, 0.125000,
                                            0.187500, -0.125000, 0.125000,
                                            0.062500, -0.062500, 0.250000,
                                            0.062500, 0.000000, 0.437500,
                                            0.187500, -0.125000, 0.375000,
                                            0.187500, -0.125000, 0.250000,
                                            0.062500, 0.125000, -0.500000,
                                            0.125000, 0.125000, -0.125000,
                                            0.125000, 0.000000, -0.125000,
                                            0.187500, 0.000000, -0.312500,
                                            0.062500, 0.062500, 0.062500,
                                            0.062500, 0.125000, 0.000000,
                                            0.187500, 0.062500, -0.062500,
                                            0.187500, 0.125000, 0.062500,
                                            0.125000, 0.125000, 0.125000,
                                            0.125000, 0.000000, 0.125000,
                                            0.187500, 0.000000, 0.062500,
                                            0.187500, 0.125000, 0.125000,
                                            0.062500, 0.125000, 0.375000,
                                            0.125000, 0.062500, 0.687500,
                                            0.125000, 0.062500, 0.187500,
                                            0.125000, 0.000000, 0.250000,
                                            0.062500, 0.187500, -0.125000,
                                            0.125000, 0.187500, -0.250000,
                                            0.187500, 0.312500, -0.312500,
                                            0.187500, 0.250000, -0.125000,
                                            0.062500, 0.437500, 0.000000,
                                            0.125000, 0.250000, 0.000000,
                                            0.187500, 0.187500, 0.062500,
                                            0.187500, 0.187500, -0.062500,
                                            0.062500, 0.187500, 0.187500,
                                            0.125000, 0.375000, 0.062500,
                                            0.187500, 0.250000, 0.125000,
                                            0.187500, 0.250000, 0.187500,
                                            0.125000, 0.312500, 0.375000,
                                            0.187500, 0.687500, 0.312500,
                                            0.187500, 0.187500, 0.250000,
                                            0.187500, 0.312500, 0.250000,
                                            0.187500, -0.562500, -0.250000,
                                            0.187500, -0.937500, -0.687500,
                                            0.312500, -0.312500, -0.375000,
                                            0.312500, -0.500000, -0.625000,
                                            0.187500, -0.312500, 0.000000,
                                            0.187500, -0.250000, -0.250000,
                                            0.250000, -0.312500, -0.125000,
                                            0.312500, -0.187500, 0.000000,
                                            0.187500, -0.437500, 0.062500,
                                            0.250000, -0.250000, 0.000000,
                                            0.250000, -0.312500, 0.125000,
                                            0.250000, -1.000000, 0.125000,
                                            0.187500, -0.312500, 0.437500,
                                            0.187500, -0.625000, 0.187500,
                                            0.187500, -0.250000, 0.187500,
                                            0.312500, -0.312500, 0.250000,
                                            0.187500, -0.062500, -0.187500,
                                            0.187500, -0.125000, -0.437500,
                                            0.250000, -0.187500, -0.125000,
                                            0.250000, -0.125000, -0.250000,
                                            0.250000, -0.187500, -0.062500,
                                            0.250000, -0.062500, -0.062500,
                                            0.250000, -0.062500, -0.125000,
                                            0.312500, -0.125000, -0.062500,
                                            0.187500, -0.187500, 0.062500,
                                            0.250000, -0.062500, 0.000000,
                                            0.250000, -0.125000, 0.000000,
                                            0.250000, -0.125000, 0.125000,
                                            0.250000, -0.062500, 0.312500,
                                            0.250000, -0.187500, 0.312500,
                                            0.250000, -0.062500, 0.250000,
                                            0.312500, -0.187500, 0.187500,
                                            0.187500, 0.125000, -0.187500,
                                            0.187500, 0.062500, -0.125000,
                                            0.312500, 0.062500, -0.312500,
                                            0.312500, 0.062500, -0.187500,
                                            0.250000, -0.062500, 0.062500,
                                            0.250000, 0.000000, -0.062500,
                                            0.250000, 0.062500, 0.000000,
                                            0.312500, 0.000000, 0.000000,
                                            0.187500, 0.000000, 0.187500,
                                            0.187500, 0.062500, 0.125000,
                                            0.312500, 0.000000, 0.125000,
                                            0.312500, 0.062500, 0.187500,
                                            0.187500, 0.062500, 0.187500,
                                            0.250000, 0.062500, 0.312500,
                                            0.250000, 0.000000, 0.250000,
                                            0.250000, 0.062500, 0.437500,
                                            0.250000, 0.250000, -0.187500,
                                            0.250000, 0.250000, -0.062500,
                                            0.250000, 0.125000, -0.062500,
                                            0.312500, 0.625000, -0.062500,
                                            0.187500, 0.312500, 0.062500,
                                            0.250000, 0.375000, -0.062500,
                                            0.250000, 0.125000, 0.062500,
                                            0.312500, 0.187500, -0.062500,
                                            0.250000, 0.437500, 0.125000,
                                            0.250000, 0.187500, 0.187500,
                                            0.250000, 0.187500, 0.062500,
                                            0.312500, 0.250000, 0.187500,
                                            0.187500, 0.187500, 0.375000,
                                            0.250000, 0.187500, 0.250000,
                                            0.250000, 0.312500, 0.437500,
                                            0.250000, 0.375000, 0.625000,
                                            0.312500, -0.250000, -0.125000,
                                            0.312500, -0.312500, -0.187500,
                                            0.312500, -0.187500, -0.062500,
                                            0.437500, -0.625000, -0.250000,
                                            0.312500, -0.312500, 0.062500,
                                            0.312500, -0.312500, 0.000000,
                                            0.312500, -0.375000, -0.062500,
                                            0.375000, -0.250000, 0.062500,
                                            0.312500, -0.437500, 0.187500,
                                            0.312500, -0.187500, 0.062500,
                                            0.312500, -0.312500, 0.125000,
                                            0.375000, -0.250000, 0.125000,
                                            0.375000, -0.375000, 0.375000,
                                            0.375000, -0.250000, 0.437500,
                                            0.375000, -0.250000, 0.250000,
                                            0.375000, -0.312500, 0.625000,
                                            0.375000, -0.125000, -0.062500,
                                            0.375000, -0.125000, -0.125000,
                                            0.375000, -0.062500, -0.125000,
                                            0.437500, 0.000000, -0.312500,
                                            0.312500, -0.125000, 0.062500,
                                            0.312500, 0.000000, 0.000000,
                                            0.375000, -0.062500, 0.000000,
                                            0.375000, -0.187500, 0.000000,
                                            0.312500, -0.062500, 0.062500,
                                            0.375000, -0.062500, 0.187500,
                                            0.375000, -0.125000, 0.125000,
                                            0.437500, -0.062500, 0.062500,
                                            0.312500, -0.125000, 0.312500,
                                            0.375000, -0.062500, 0.562500,
                                            0.375000, -0.187500, 0.250000,
                                            0.437500, -0.062500, 0.187500,
                                            0.312500, 0.000000, -0.187500,
                                            0.312500, 0.000000, -0.062500,
                                            0.375000, 0.062500, -0.187500,
                                            0.375000, 0.125000, -0.250000,
                                            0.312500, 0.062500, -0.062500,
                                            0.375000, 0.062500, 0.000000,
                                            0.375000, 0.125000, 0.000000,
                                            0.437500, 0.000000, 0.000000,
                                            0.312500, 0.062500, 0.062500,
                                            0.312500, 0.125000, 0.125000,
                                            0.375000, 0.000000, 0.062500,
                                            0.437500, 0.125000, 0.062500,
                                            0.312500, 0.062500, 0.250000,
                                            0.375000, 0.000000, 0.312500,
                                            0.375000, 0.000000, 0.187500,
                                            0.375000, 0.125000, 0.187500,
                                            0.312500, 0.187500, -0.437500,
                                            0.312500, 0.187500, -0.250000,
                                            0.437500, 0.500000, -0.375000,
                                            0.437500, 0.250000, -0.187500,
                                            0.312500, 0.250000, -0.125000,
                                            0.312500, 0.187500, 0.062500,
                                            0.312500, 0.312500, 0.000000,
                                            0.375000, 0.125000, -0.125000,
                                            0.312500, 0.250000, 0.062500,
                                            0.375000, 0.312500, 0.125000,
                                            0.375000, 0.187500, 0.125000,
                                            0.437500, 0.312500, 0.250000,
                                            0.312500, 0.437500, 0.312500,
                                            0.375000, 0.125000, 0.375000,
                                            0.375000, 0.750000, 0.687500,
                                            0.437500, 0.125000, 0.625000,
                                            0.437500, -0.250000, -0.312500,
                                            0.437500, -0.250000, -0.187500,
                                            0.500000, -0.375000, -0.312500,
                                            0.562500, -0.250000, -0.125000,
                                            0.437500, -0.250000, 0.000000,
                                            0.500000, -0.500000, -0.062500,
                                            0.500000, -0.312500, -0.125000,
                                            0.562500, -0.375000, 0.000000,
                                            0.437500, -0.312500, 0.187500,
                                            0.437500, -0.375000, 0.125000,
                                            0.500000, -0.187500, 0.062500,
                                            0.625000, -0.250000, 0.187500,
                                            0.437500, -0.375000, 0.312500,
                                            0.500000, -0.250000, 0.375000,
                                            0.562500, -0.562500, 0.312500,
                                            0.625000, -0.437500, 0.187500,
                                            0.437500, -0.187500, -0.250000,
                                            0.437500, -0.187500, -0.062500,
                                            0.437500, -0.062500, -0.125000,
                                            0.625000, -0.187500, -0.125000,
                                            0.437500, -0.125000, 0.000000,
                                            0.500000, -0.125000, -0.062500,
                                            0.562500, -0.125000, 0.000000,
                                            0.562500, -0.062500, -0.062500,
                                            0.437500, -0.062500, 0.125000,
                                            0.500000, -0.187500, 0.125000,
                                            0.562500, -0.062500, 0.125000,
                                            0.625000, -0.187500, 0.187500,
                                            0.437500, -0.062500, 0.375000,
                                            0.500000, -0.125000, 0.187500,
                                            0.562500, -0.125000, 0.562500,
                                            0.562500, -0.125000, 0.250000,
                                            0.437500, 0.062500, -0.187500,
                                            0.500000, 0.125000, -0.187500,
                                            0.562500, 0.000000, -0.187500,
                                            0.625000, 0.000000, -0.312500,
                                            0.437500, 0.062500, -0.062500,
                                            0.500000, 0.062500, 0.000000,
                                            0.500000, 0.125000, -0.062500,
                                            0.500000, -0.062500, 0.000000,
                                            0.437500, 0.062500, 0.187500,
                                            0.500000, 0.000000, 0.125000,
                                            0.500000, 0.062500, 0.125000,
                                            0.562500, 0.125000, 0.000000,
                                            0.437500, 0.062500, 0.500000,
                                            0.500000, -0.062500, 0.312500,
                                            0.562500, 0.000000, 0.250000,
                                            0.562500, 0.062500, 0.375000,
                                            0.437500, 0.312500, -0.125000,
                                            0.437500, 0.187500, -0.125000,
                                            0.562500, 0.500000, -0.125000,
                                            0.562500, 0.312500, -0.125000,
                                            0.437500, 0.250000, -0.062500,
                                            0.437500, 0.250000, 0.062500,
                                            0.500000, 0.250000, -0.062500,
                                            0.625000, 0.125000, -0.125000,
                                            0.500000, 0.375000, 0.062500,
                                            0.500000, 0.125000, 0.125000,
                                            0.500000, 0.562500, 0.125000,
                                            0.562500, 0.187500, 0.125000,
                                            0.500000, 0.187500, 0.250000,
                                            0.500000, 0.625000, 0.375000,
                                            0.500000, 0.250000, 0.187500,
                                            0.562500, 0.312500, 0.375000,
                                            0.625000, -0.312500, -0.187500,
                                            0.625000, -0.187500, -0.312500,
                                            0.812500, -0.437500, -0.437500,
                                            1.375000, -0.187500, -0.375000,
                                            0.687500, -0.312500, -0.062500,
                                            0.875000, -0.250000, -0.062500,
                                            1.062500, -0.187500, 0.062500,
                                            1.062500, -0.437500, -0.062500,
                                            0.625000, -0.250000, 0.125000,
                                            0.750000, -0.125000, 0.062500,
                                            0.812500, -0.312500, 0.125000,
                                            1.187500, -0.125000, 0.312500,
                                            0.625000, -0.312500, 0.562500,
                                            0.812500, -0.250000, 0.312500,
                                            0.875000, -0.500000, 0.312500,
                                            1.000000, -0.312500, 0.500000,
                                            0.625000, -0.062500, -0.187500,
                                            0.687500, 0.062500, -0.187500,
                                            0.812500, -0.062500, -0.187500,
                                            1.062500, -0.125000, -0.187500,
                                            0.625000, 0.062500, -0.062500,
                                            0.687500, -0.125000, -0.062500,
                                            0.875000, -0.125000, 0.000000,
                                            1.437500, 0.000000, 0.000000,
                                            0.625000, 0.000000, 0.062500,
                                            0.687500, -0.062500, 0.187500,
                                            0.750000, 0.062500, 0.000000,
                                            0.812500, 0.000000, 0.125000,
                                            0.625000, 0.062500, 0.250000,
                                            0.687500, -0.062500, 0.375000,
                                            0.687500, 0.000000, 0.500000,
                                            0.937500, -0.062500, 0.250000,
                                            0.687500, 0.187500, -0.312500,
                                            0.750000, 0.187500, -0.500000,
                                            1.000000, 0.187500, -0.312500,
                                            1.750000, 0.125000, -0.250000,
                                            0.750000, 0.187500, -0.125000,
                                            0.875000, 0.187500, -0.062500,
                                            0.937500, 0.125000, 0.000000,
                                            1.187500, 0.187500, -0.187500,
                                            0.625000, 0.187500, 0.250000,
                                            0.625000, 0.187500, 0.125000,
                                            0.687500, 0.187500, 0.000000,
                                            0.937500, 0.250000, 0.250000,
                                            0.687500, 0.187500, 0.437500,
                                            0.750000, 0.062500, 0.312500,
                                            0.937500, 0.125000, 0.437500,
                                            1.437500, 0.187500, 0.437500,
                                            0.625000, 0.250000, -0.062500,
                                            0.687500, 0.375000, 0.000000,
                                            1.062500, 0.937500, -0.250000,
                                            1.375000, 0.375000, -0.250000,
                                            0.812500, 0.312500, 0.125000,
                                            0.875000, 0.500000, 0.000000,
                                            1.062500, 0.375000, 0.062500,
                                            1.500000, 0.437500, 0.125000,
                                            0.625000, 0.375000, 0.250000,
                                            0.875000, 0.375000, 0.312500,
                                            1.125000, 0.625000, 0.187500,
                                            1.187500, 0.250000, 0.187500,
                                            0.687500, 0.437500, 0.437500,
                                            0.750000, 0.375000, 0.687500,
                                            0.937500, 0.750000, 0.500000,
                                            1.312500, 0.687500, 0.625000
                                        ]);

const AmbePlusPRBA58 = new Float32Array([
                                            -0.460938, -0.265625, -0.281250, -0.062500,
                                            -0.367188, -0.117188, -0.078125, -0.054688,
                                            -0.250000, -0.312500, -0.164063, -0.101563,
                                            -0.156250, -0.078125, -0.085938, -0.203125,
                                            -0.468750, -0.085938, -0.171875, 0.164063,
                                            -0.210938, -0.039063, -0.117188, 0.085938,
                                            -0.187500, -0.156250, -0.289063, 0.070313,
                                            -0.179688, -0.117188, -0.148438, -0.046875,
                                            -0.320313, -0.031250, 0.140625, -0.132813,
                                            -0.289063, -0.140625, 0.179688, 0.015625,
                                            -0.179688, -0.226563, -0.007813, -0.101563,
                                            -0.156250, -0.031250, 0.015625, -0.093750,
                                            -0.390625, -0.273438, 0.046875, 0.031250,
                                            -0.195313, -0.203125, -0.070313, 0.039063,
                                            -0.171875, -0.156250, -0.039063, 0.171875,
                                            -0.156250, -0.085938, 0.085938, 0.125000,
                                            -0.304688, 0.054688, -0.210938, -0.085938,
                                            -0.265625, 0.140625, -0.031250, -0.132813,
                                            -0.242188, 0.078125, -0.031250, 0.015625,
                                            -0.203125, 0.000000, -0.085938, -0.070313,
                                            -0.453125, 0.171875, -0.062500, 0.031250,
                                            -0.289063, 0.125000, -0.156250, 0.093750,
                                            -0.179688, 0.257813, -0.054688, 0.273438,
                                            -0.171875, 0.226563, -0.109375, 0.015625,
                                            -0.312500, -0.007813, 0.000000, 0.085938,
                                            -0.265625, 0.265625, 0.046875, 0.101563,
                                            -0.234375, 0.109375, 0.125000, -0.046875,
                                            -0.171875, -0.015625, 0.093750, 0.007813,
                                            -0.414063, 0.046875, 0.101563, 0.203125,
                                            -0.179688, 0.093750, 0.210938, 0.125000,
                                            -0.179688, -0.007813, 0.007813, 0.273438,
                                            -0.171875, 0.085938, 0.007813, 0.132813,
                                            -0.062500, -0.117188, -0.257813, -0.156250,
                                            -0.054688, -0.226563, -0.109375, -0.015625,
                                            -0.046875, -0.164063, -0.070313, -0.117188,
                                            -0.039063, -0.031250, -0.093750, -0.085938,
                                            -0.156250, -0.031250, -0.015625, 0.039063,
                                            -0.085938, 0.015625, -0.179688, 0.164063,
                                            -0.078125, -0.078125, -0.070313, 0.046875,
                                            -0.046875, -0.195313, -0.062500, 0.109375,
                                            -0.093750, -0.046875, 0.109375, -0.101563,
                                            -0.054688, -0.007813, 0.007813, -0.007813,
                                            -0.039063, -0.132813, 0.031250, -0.031250,
                                            -0.023438, -0.148438, 0.195313, -0.085938,
                                            -0.148438, -0.109375, 0.023438, 0.000000,
                                            -0.039063, -0.085938, 0.031250, 0.085938,
                                            -0.039063, -0.226563, 0.117188, 0.070313,
                                            -0.015625, -0.015625, 0.156250, 0.156250,
                                            -0.109375, 0.132813, -0.109375, -0.140625,
                                            -0.093750, 0.023438, -0.187500, -0.007813,
                                            -0.093750, 0.382813, -0.062500, -0.101563,
                                            -0.023438, 0.101563, -0.062500, -0.007813,
                                            -0.140625, 0.195313, -0.273438, 0.132813,
                                            -0.109375, 0.125000, -0.117188, 0.062500,
                                            -0.085938, 0.015625, -0.078125, 0.031250,
                                            -0.031250, 0.203125, -0.023438, 0.125000,
                                            -0.125000, 0.156250, 0.078125, -0.140625,
                                            -0.117188, 0.085938, 0.312500, -0.101563,
                                            -0.093750, 0.062500, 0.007813, -0.078125,
                                            -0.046875, 0.046875, 0.148438, -0.023438,
                                            -0.125000, 0.148438, 0.007813, 0.015625,
                                            -0.085938, 0.046875, 0.054688, 0.039063,
                                            -0.054688, 0.140625, 0.117188, 0.101563,
                                            -0.054688, 0.039063, -0.015625, 0.109375,
                                            0.046875, -0.062500, -0.054688, -0.226563,
                                            0.062500, -0.132813, -0.093750, -0.101563,
                                            0.078125, -0.015625, -0.132813, -0.023438,
                                            0.085938, -0.421875, -0.140625, -0.062500,
                                            -0.007813, -0.054688, -0.054688, 0.179688,
                                            0.015625, -0.078125, -0.203125, 0.054688,
                                            0.015625, -0.093750, -0.078125, 0.023438,
                                            0.062500, -0.179688, -0.187500, 0.148438,
                                            0.007813, -0.039063, 0.046875, -0.093750,
                                            0.023438, 0.031250, 0.117188, -0.179688,
                                            0.101563, -0.171875, 0.093750, -0.171875,
                                            0.101563, -0.023438, -0.023438, -0.125000,
                                            -0.007813, -0.039063, 0.109375, 0.023438,
                                            0.046875, -0.015625, 0.015625, 0.078125,
                                            0.054688, -0.046875, -0.023438, -0.023438,
                                            0.070313, -0.140625, 0.062500, -0.015625,
                                            0.007813, 0.070313, -0.031250, -0.210938,
                                            0.015625, 0.140625, -0.179688, -0.046875,
                                            0.023438, 0.039063, -0.039063, -0.039063,
                                            0.054688, 0.117188, -0.007813, -0.101563,
                                            0.015625, 0.046875, -0.117188, 0.078125,
                                            0.054688, 0.054688, -0.281250, 0.164063,
                                            0.062500, 0.273438, -0.125000, 0.085938,
                                            0.093750, 0.101563, -0.070313, 0.046875,
                                            -0.015625, 0.125000, 0.046875, -0.031250,
                                            -0.007813, 0.273438, 0.054688, 0.000000,
                                            0.070313, 0.039063, 0.070313, -0.023438,
                                            0.109375, 0.195313, 0.093750, -0.218750,
                                            0.046875, 0.078125, 0.039063, 0.070313,
                                            0.054688, 0.101563, 0.023438, 0.265625,
                                            0.070313, 0.125000, 0.273438, 0.031250,
                                            0.093750, 0.335938, 0.164063, 0.132813,
                                            0.195313, -0.101563, 0.015625, -0.046875,
                                            0.234375, -0.171875, -0.164063, -0.125000,
                                            0.296875, -0.085938, -0.117188, 0.031250,
                                            0.507813, -0.179688, -0.117188, 0.015625,
                                            0.109375, -0.179688, -0.046875, 0.046875,
                                            0.132813, -0.054688, -0.039063, 0.070313,
                                            0.171875, 0.007813, -0.117188, 0.179688,
                                            0.429688, 0.015625, -0.039063, 0.218750,
                                            0.132813, -0.015625, 0.156250, -0.085938,
                                            0.140625, -0.125000, 0.218750, 0.000000,
                                            0.265625, -0.250000, 0.101563, -0.085938,
                                            0.382813, -0.109375, 0.101563, -0.125000,
                                            0.117188, -0.078125, 0.085938, 0.195313,
                                            0.218750, -0.210938, 0.054688, 0.140625,
                                            0.265625, -0.031250, 0.054688, 0.148438,
                                            0.304688, 0.007813, 0.250000, 0.023438,
                                            0.117188, 0.289063, -0.226563, -0.109375,
                                            0.132813, 0.023438, -0.195313, -0.132813,
                                            0.164063, 0.187500, -0.070313, -0.078125,
                                            0.281250, 0.046875, -0.101563, -0.250000,
                                            0.164063, 0.023438, -0.023438, -0.039063,
                                            0.171875, 0.148438, -0.265625, 0.046875,
                                            0.210938, 0.031250, -0.156250, 0.000000,
                                            0.390625, 0.179688, -0.101563, -0.031250,
                                            0.234375, 0.085938, 0.031250, -0.148438,
                                            0.250000, 0.265625, 0.156250, -0.070313,
                                            0.312500, 0.054688, 0.093750, -0.007813,
                                            0.531250, 0.210938, 0.085938, -0.015625,
                                            0.117188, 0.179688, 0.054688, 0.031250,
                                            0.132813, 0.039063, 0.140625, 0.070313,
                                            0.218750, 0.070313, 0.007813, 0.039063,
                                            0.226563, 0.242188, 0.007813, 0.148438
                                        ]);

const AmbePlusHOCb5 = new Float32Array([
                                           -0.617188, -0.015625, 0.015625, -0.023438,
                                           -0.507813, -0.382813, -0.312500, -0.117188,
                                           -0.328125, 0.046875, 0.007813, -0.015625,
                                           -0.320313, -0.281250, -0.023438, -0.023438,
                                           -0.171875, 0.140625, -0.179688, -0.007813,
                                           -0.148438, 0.226563, 0.039063, -0.039063,
                                           -0.140625, -0.007813, -0.007813, -0.015625,
                                           -0.109375, -0.101563, 0.179688, -0.062500,
                                           -0.109375, -0.109375, -0.031250, 0.187500,
                                           -0.109375, -0.218750, -0.273438, -0.140625,
                                           0.007813, -0.007813, -0.015625, -0.015625,
                                           0.078125, -0.265625, -0.007813, 0.007813,
                                           0.101563, 0.054688, -0.210938, -0.007813,
                                           0.164063, 0.242188, 0.093750, 0.039063,
                                           0.179688, -0.023438, 0.007813, -0.007813,
                                           0.460938, 0.015625, -0.015625, 0.007813
                                       ]);

const AmbePlusHOCb6 = new Float32Array([
                                           -0.429688, -0.046875, 0.039063, 0.000000,
                                           -0.296875, 0.187500, 0.125000, 0.015625,
                                           -0.203125, -0.218750, -0.039063, -0.007813,
                                           -0.179688, 0.007813, -0.007813, 0.000000,
                                           -0.171875, 0.265625, -0.085938, -0.039063,
                                           -0.046875, -0.070313, 0.203125, -0.023438,
                                           -0.023438, 0.125000, 0.031250, -0.023438,
                                           -0.007813, 0.000000, -0.195313, -0.007813,
                                           0.007813, -0.046875, -0.007813, -0.015625,
                                           0.015625, -0.031250, 0.039063, 0.195313,
                                           0.031250, -0.273438, -0.015625, -0.007813,
                                           0.140625, 0.257813, 0.015625, 0.007813,
                                           0.164063, 0.015625, 0.007813, -0.023438,
                                           0.210938, -0.148438, -0.187500, 0.039063,
                                           0.273438, -0.179688, 0.054688, -0.007813,
                                           0.421875, 0.054688, -0.039063, 0.000000
                                       ]);

const AmbePlusHOCb7 = new Float32Array([
                                           -0.382813, -0.101563, 0.007813, 0.015625,
                                           -0.335938, 0.226563, 0.015625, -0.007813,
                                           -0.156250, 0.031250, -0.039063, -0.054688,
                                           -0.156250, -0.015625, 0.187500, -0.015625,
                                           -0.085938, -0.257813, 0.023438, -0.007813,
                                           -0.070313, -0.148438, -0.203125, -0.023438,
                                           -0.031250, 0.187500, -0.156250, 0.007813,
                                           -0.023438, -0.007813, -0.015625, 0.179688,
                                           -0.015625, 0.203125, 0.070313, -0.023438,
                                           0.000000, -0.039063, -0.007813, -0.023438,
                                           0.140625, -0.078125, 0.179688, -0.007813,
                                           0.164063, 0.023438, -0.007813, -0.015625,
                                           0.187500, -0.007813, -0.218750, -0.007813,
                                           0.218750, 0.242188, 0.023438, 0.031250,
                                           0.234375, -0.234375, -0.039063, 0.007813,
                                           0.445313, 0.054688, -0.007813, 0.000000
                                       ]);

const AmbePlusHOCb8 = new Float32Array([
                                           -0.453125, 0.179688, 0.078125, -0.015625,
                                           -0.414063, -0.179688, -0.031250, 0.015625,
                                           -0.281250, 0.187500, -0.203125, 0.046875,
                                           -0.210938, -0.007813, -0.031250, -0.031250,
                                           -0.148438, -0.031250, 0.218750, -0.054688,
                                           -0.140625, -0.085938, 0.039063, 0.187500,
                                           -0.117188, 0.234375, 0.031250, -0.054688,
                                           -0.062500, -0.273438, -0.007813, -0.015625,
                                           -0.054688, 0.093750, -0.078125, 0.078125,
                                           -0.023438, -0.062500, -0.210938, -0.054688,
                                           0.023438, 0.000000, 0.023438, -0.046875,
                                           0.125000, 0.234375, -0.187500, -0.015625,
                                           0.164063, -0.054688, -0.093750, 0.070313,
                                           0.187500, 0.179688, 0.093750, 0.015625,
                                           0.203125, -0.171875, 0.140625, -0.015625,
                                           0.421875, -0.039063, -0.046875, -0.007813
                                       ]);

function mbe_dumpAmbe2400Data(ambe_d)
{
}

function mbe_dumpAmbe3600x2400Frame(ambe_fr)
{
}

function mbe_eccAmbe3600x2400C0(ambe_fr)
{
    let j, errs;
    let inn = new Int8Array(23);
    let out = new Int8Array(23);
    for (j = 0; j < 23; j++)
        inn[j] = ambe_fr[j + 1];
    errs = mbe_golay2312(inn, out);
    for (j = 0; j < 23; j++)
        ambe_fr[j + 1] = out[j];
    return errs;
}

function mbe_eccAmbe3600x2400Data(ambe_fr, ambe_d)
{
    let j, errs;
    let gin = new Int8Array(24);
    let gout = new Int8Array(24);
    let ambe = 0;
    for (j = 23; j > 11; j--)
        ambe_d[ambe++] = ambe_fr[j];
    for (j = 0; j < 23; j++)
        gin[j] = ambe_fr[24 + j];
    errs = mbe_golay2312(gin, gout);
    for (j = 22; j > 10; j--)
        ambe_d[ambe++] = gout[j];
    for (j = 10; j >= 0; j--)
        ambe_d[ambe++] = ambe_fr[48 + j];
    for (j = 13; j >= 0; j--)
        ambe_d[ambe++] = ambe_fr[72 + j];
    return errs;
}

function mbe_decodeAmbe2400Parms(ambe_d, cur_mp, prev_mp)
{
    let ji, i, j, k, l, L, L9, m, am, ak;
    let intkl = new Int32Array(57);
    let b0, b1, b2, b3, b4, b5, b6, b7, b8;
    let f0;
    let Cik = new Float32Array(90);
    let flokl = new Float32Array(57);
    let deltal = new Float32Array(57);
    let Sum42, Sum43;
    let Tl = new Float32Array(57);
    let Gm = new Float32Array(9);
    let Ri = new Float32Array(9);
    let sum, c1, c2;
    let silence = 0;
    let Ji = new Int32Array(5)
    let jl;
    let deltaGamma, BigGamma;
    let unvc, rconst;
    cur_mp.repeat = prev_mp.repeat;
    b0 = 0;
    b0 |= ambe_d[0] << 6;
    b0 |= ambe_d[1] << 5;
    b0 |= ambe_d[2] << 4;
    b0 |= ambe_d[3] << 3;
    b0 |= ambe_d[4] << 2;
    b0 |= ambe_d[5] << 1;
    b0 |= ambe_d[48];
    if ((b0 & 0x7e) === 0x7e) {
        let t7tab = [1,0,0,0,0,1,1,1];
        let t6tab = [0,0,0,1,1,1,1,0];
        let t5tab = [0,0,1,0,1,1,0,1];
        b1 = 0;
        b1 |= t7tab[(ambe_d[6] << 2) | (ambe_d[7] << 1) | ambe_d[8]] << 7;
        b1 |= t6tab[(ambe_d[6] << 2) | (ambe_d[7] << 1) | ambe_d[8]] << 6;
        b1 |= t5tab[(ambe_d[6] << 2) | (ambe_d[7] << 1) | ambe_d[8]] << 5;
        b1 |= ambe_d[9] << 4;
        b1 |= ambe_d[42] << 3;
        b1 |= ambe_d[43] << 2;
        b1 |= ambe_d[10] << 1;
        b1 |= ambe_d[11];
        b2 = 0;
        b2 |= ambe_d[12] << 7;
        b2 |= ambe_d[13] << 6;
        b2 |= ambe_d[14] << 5;
        b2 |= ambe_d[15] << 4;
        b2 |= ambe_d[16] << 3;
        b2 |= ambe_d[44] << 2;
        b2 |= ambe_d[45] << 1;
        b2 |= ambe_d[17];

        if (b1 < 5)
            silence = 1;
        else if ((b1 >= 5) && (b1 <= 122))
        {}
        else if ((b1 > 122) && (b1 < 128))
            silence = 1;
        else if ((b1 >= 128) && (b1 <= 163))
        {} else
            silence = 1;
        if (silence === 1) {
            cur_mp.w0 = M_2PI / 32;
            f0 = 1 / 32;
            L = 14;
            cur_mp.L = 14;
            for (l = 1; l <= L; l++)
                cur_mp.Vl[l] = 0;
        }
        return 3;
    }
    if (silence === 0) {
        f0 = Math.pow(2, -4.311767578125 - 2.1336e-2 * (b0 + 0.5));
        cur_mp.w0 = f0 * M_2PI;
    }
    unvc = 0.2046 / Math.sqrt(cur_mp.w0);
    if (silence === 0) {
        L = AmbePlusLtable[b0] | 0;
        cur_mp.L = L;
    }
    L9 = L - 9;
    b1 = 0;
    b1 |= ambe_d[38] << 3;
    b1 |= ambe_d[39] << 2;
    b1 |= ambe_d[40] << 1;
    b1 |= ambe_d[41];
    for (l = 1; l <= L; l++) {
        jl = (l * 16 * f0) | 0;
        if (silence === 0)
            cur_mp.Vl[l] = AmbePlusVuv[8 * b1 + jl];
    }
    b2 = 0;
    b2 |= ambe_d[6] << 5;
    b2 |= ambe_d[7] << 4;
    b2 |= ambe_d[8] << 3;
    b2 |= ambe_d[9] << 2;
    b2 |= ambe_d[42] << 1;
    b2 |= ambe_d[43];
    deltaGamma = AmbePlusDg[b2];
    cur_mp.gamma = deltaGamma + 0.5 * prev_mp.gamma;
    Gm[1] = 0;
    b3 = 0;
    b3 |= ambe_d[10] << 8;
    b3 |= ambe_d[11] << 7;
    b3 |= ambe_d[12] << 6;
    b3 |= ambe_d[13] << 5;
    b3 |= ambe_d[14] << 4;
    b3 |= ambe_d[15] << 3;
    b3 |= ambe_d[16] << 2;
    b3 |= ambe_d[44] << 1;
    b3 |= ambe_d[45];
    Gm[2] = AmbePlusPRBA24[3 * b3];
    Gm[3] = AmbePlusPRBA24[3 * b3 + 1];
    Gm[4] = AmbePlusPRBA24[3 * b3 + 2];
    b4 = 0;
    b4 |= ambe_d[17] << 6;
    b4 |= ambe_d[18] << 5;
    b4 |= ambe_d[19] << 4;
    b4 |= ambe_d[20] << 3;
    b4 |= ambe_d[21] << 2;
    b4 |= ambe_d[46] << 1;
    b4 |= ambe_d[47];
    Gm[5] = AmbePlusPRBA58[4 * b4];
    Gm[6] = AmbePlusPRBA58[4 * b4 + 1];
    Gm[7] = AmbePlusPRBA58[4 * b4 + 2];
    Gm[8] = AmbePlusPRBA58[4 * b4 + 3];
    for (i = 1; i <= 8; i++) {
        sum = 0;
        for (m = 1; m <= 8; m++) {
            if (m === 1)
                am = 1;
            else
                am = 2;
            sum = sum + am * Gm[m] * Math.cos(M_PI * (m - 1) * (i - 0.5) / 8);
        }
        Ri[i] = sum;
    }
    rconst = 1 / (2 * M_SQRT2);
    Cik[19] = 0.5 *(Ri[1] + Ri[2]);
    Cik[20] = rconst * (Ri[1] - Ri[2]);
    Cik[37] = 0.5 *(Ri[3] + Ri[4]);
    Cik[38] = rconst * (Ri[3] - Ri[4]);
    Cik[55] = 0.5 *(Ri[5] + Ri[6]);
    Cik[56] = rconst * (Ri[5] - Ri[6]);
    Cik[73] = 0.5 *(Ri[7] + Ri[8]);
    Cik[74] = rconst * (Ri[7] - Ri[8]);
    b5 = 0;
    b5 |= ambe_d[22] << 3;
    b5 |= ambe_d[23] << 2;
    b5 |= ambe_d[25] << 1;
    b5 |= ambe_d[26];
    b6 = 0;
    b6 |= ambe_d[27] << 3;
    b6 |= ambe_d[28] << 2;
    b6 |= ambe_d[29] << 1;
    b6 |= ambe_d[30];
    b7 = 0;
    b7 |= ambe_d[31] << 3;
    b7 |= ambe_d[32] << 2;
    b7 |= ambe_d[33] << 1;
    b7 |= ambe_d[34];
    b8 = 0;
    b8 |= ambe_d[35] << 3;
    b8 |= ambe_d[36] << 2;
    b8 |= ambe_d[37] << 1;
    Ji[1] = AmbePlusLmprbl[4 * L];
    Ji[2] = AmbePlusLmprbl[4 * L + 1];
    Ji[3] = AmbePlusLmprbl[4 * L + 2];
    Ji[4] = AmbePlusLmprbl[4 * L + 3];
    for (k = 3; k <= Ji[1]; k++)
        if (k > 6)
            Cik[18 + k] = 0;
        else
            Cik[18 + k] = AmbePlusHOCb5[4 * b5 + k - 3];
    for (k = 3; k <= Ji[2]; k++)
        if (k > 6)
            Cik[36 + k] = 0;
        else
            Cik[36 + k] = AmbePlusHOCb6[4 * b6 + k - 3];
    for (k = 3; k <= Ji[3]; k++)
        if (k > 6)
            Cik[54 + k] = 0;
        else
            Cik[54 + k] = AmbePlusHOCb7[4 * b7 + k - 3];
    for (k = 3; k <= Ji[4]; k++)
        if (k > 6)
            Cik[72 + k] = 0;
        else
            Cik[72 + k] = AmbePlusHOCb8[4 * b8 + k - 3];
    l = 1;
    for (i = 1; i <= 4; i++) {
        ji = Ji[i];
        for (j = 1; j <= ji; j++)	{
            sum = 0;
            for (k = 1; k <= ji; k++) {
                if (k === 1)
                    ak = 1;
                else
                    ak = 2;
                sum = sum + ak * Cik[18 * i + k] * Math.cos(M_PI * (k - 1) * (j - 0.5) / ji);
            }
            Tl[l] = sum;
            l++;
        }
    }
    if (cur_mp.L > prev_mp.L)
        for (l = prev_mp.L + 1; l <= cur_mp.L; l++)	{
            prev_mp.Ml[l] = prev_mp.Ml[prev_mp.L];
            prev_mp.log2Ml[l] = prev_mp.log2Ml[prev_mp.L];
        }
    prev_mp.log2Ml[0] = prev_mp.log2Ml[1];
    prev_mp.Ml[0] = prev_mp.Ml[1];
    Sum43 = 0;
    for (l = 1; l <= cur_mp.L; l++)	{
        flokl[l] = prev_mp.L / cur_mp.L * l;
        intkl[l] = flokl[l] | 0;
        deltal[l] = flokl[l] - intkl[l];
        Sum43 = Sum43 + (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]] + (deltal[l] === 0 ? 0 : deltal[l] * prev_mp.log2Ml[intkl[l] + 1]);
    }
    Sum43 = 0.65 / cur_mp.L * Sum43;
    Sum42 = 0;
    for (l = 1; l <= cur_mp.L; l++)
        Sum42 += Tl[l];
    Sum42 = Sum42 / cur_mp.L;
    BigGamma = cur_mp.gamma - 0.5 * Math.log(cur_mp.L) / Math.log(2) - Sum42;
    for (l = 1; l <= cur_mp.L; l++) {
        c1 = 0.65 * (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]];
        c2 = deltal[l] === 0 ? 0 : 0.65 * deltal[l] * prev_mp.log2Ml[intkl[l] + 1];
        cur_mp.log2Ml[l] = Tl[l] + c1 + c2 - Sum43 + BigGamma;
        if (cur_mp.Vl[l] === 1)
            cur_mp.Ml[l] = Math.exp(0.693 * cur_mp.log2Ml[l]);
        else
            cur_mp.Ml[l] = unvc * Math.exp(0.693 * cur_mp.log2Ml[l]);
    }
    return 0;
}

function mbe_demodulateAmbe3600x2400Data(ambe_fr)
{
    let i, j, k;
    let pr = new Uint16Array(115);
    let foo = 0;
    for (i = 23; i >= 12; i--) {
        foo <<= 1;
        foo |= ambe_fr[i];
    }
    pr[0] = 16 * foo;
    for (i = 1; i < 24; i++)
        pr[i] = 173 * pr[i - 1] + 13849 - 65536 * Math.trunc(((173 * pr[i - 1]) + 13849) / 65536);
    for (i = 1; i < 24; i++)
        pr[i] = (pr[i] / 32768) | 0;
    k = 1;
    for (j = 22; j >= 0; j--) {
        ambe_fr[24 + j] ^= pr[k];
        k++;
    }
}

function mbe_processAmbe2400Dataf(aout_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let i, bad;
    err_str = "";
    for (i = 0; i < errs2; i++)
        err_str += "=";
    bad = mbe_decodeAmbe2400Parms(ambe_d, cur_mp, prev_mp);
    if (bad === 2) {
        err_str += "E";
        cur_mp.repeat = 0;
    } else if (bad === 3) {
        err_str += "T";
        cur_mp.repeat = 0;
    } else if (errs2 > 3) {
        mbe_useLastMbeParms(cur_mp, prev_mp);
        cur_mp.repeat++;
        err_str += "R";
    } else
        cur_mp.repeat = 0;
    if (bad === 0) {
        if (cur_mp.repeat <= 3) {
            mbe_moveMbeParms(cur_mp, prev_mp);
            mbe_spectralAmpEnhance(cur_mp);
            mbe_synthesizeSpeechf(aout_buf, cur_mp, prev_mp_enhanced, uvquality);
            mbe_moveMbeParms(cur_mp, prev_mp_enhanced);
        } else {
            err_str += "M";
            mbe_synthesizeSilencef(aout_buf);
            mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced);
        }
    } else {
        mbe_synthesizeSilencef(aout_buf);
        mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced);
    }
    global1 = err_str;
}

function mbe_processAmbe2400Data(aout_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processAmbe2400Dataf(float_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

function mbe_processAmbe3600x2400Framef(aout_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    global2 = 0;
    global3 = 0;
    global2 = mbe_eccAmbe3600x2400C0(ambe_fr);
    mbe_demodulateAmbe3600x2400Data(ambe_fr);
    global3 = global2;
    global3 += mbe_eccAmbe3600x2400Data(ambe_fr, ambe_d);
    mbe_processAmbe2400Dataf(aout_buf, global2, global3, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
}

function mbe_processAmbe3600x2400Frame(aout_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processAmbe3600x2400Framef(float_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

const AmbeW0table = new Float32Array([
                                         0.049971, 0.049215, 0.048471, 0.047739, 0.047010, 0.046299,
                                         0.045601, 0.044905, 0.044226, 0.043558, 0.042900, 0.042246,
                                         0.041609, 0.040979, 0.040356, 0.039747, 0.039148, 0.038559,
                                         0.037971, 0.037399, 0.036839, 0.036278, 0.035732, 0.035198,
                                         0.034672, 0.034145, 0.033636, 0.033133, 0.032635, 0.032148,
                                         0.031670, 0.031122, 0.030647, 0.030184, 0.029728, 0.029272,
                                         0.028831, 0.028395, 0.027966, 0.027538,
                                         0.027122, 0.026712, 0.026304, 0.025906, 0.025515, 0.025129,
                                         0.024746, 0.024372, 0.024002, 0.023636, 0.023279, 0.022926,
                                         0.022581, 0.022236, 0.021900, 0.021570, 0.021240, 0.020920,
                                         0.020605, 0.020294, 0.019983, 0.019684, 0.019386, 0.019094,
                                         0.018805, 0.018520, 0.018242, 0.017965, 0.017696, 0.017431,
                                         0.017170, 0.016911, 0.016657, 0.016409, 0.016163, 0.015923,
                                         0.015686, 0.015411, 0.015177, 0.014946,
                                         0.014721, 0.014496, 0.014277, 0.014061, 0.013847, 0.013636,
                                         0.013430, 0.013227, 0.013025, 0.012829, 0.012634, 0.012444,
                                         0.012253, 0.012068, 0.011887, 0.011703, 0.011528, 0.011353,
                                         0.011183, 0.011011, 0.010845, 0.010681, 0.010517, 0.010359,
                                         0.010202, 0.010050, 0.009895, 0.009747, 0.009600, 0.009453,
                                         0.009312, 0.009172, 0.009033, 0.008896, 0.008762, 0.008633,
                                         0.008501, 0.008375, 0.008249, 0.008125
                                     ]);

const AmbeLtable = new Float32Array([
                                        9, 9, 9, 9, 9, 9,
                                        10, 10, 10, 10, 10, 10,
                                        11, 11, 11, 11, 11, 11,
                                        12, 12, 12, 12, 12, 13,
                                        13, 13, 13, 13, 14, 14,
                                        14, 14, 15, 15, 15, 15,
                                        16, 16, 16, 16, 17, 17,
                                        17, 17, 18, 18, 18, 18,
                                        19, 19, 19, 20, 20, 20,
                                        21, 21, 21, 22, 22, 22,
                                        23, 23, 23, 24, 24, 24,
                                        25, 25, 26, 26, 26, 27,
                                        27, 28, 28, 29, 29, 30,
                                        30, 30, 31, 31, 32, 32,
                                        33, 33, 34, 34, 35, 36,
                                        36, 37, 37, 38, 38, 39,
                                        40, 40, 41, 42, 42, 43,
                                        43, 44, 45, 46, 46, 47,
                                        48, 48, 49, 50, 51, 52,
                                        52, 53, 54, 55, 56, 56
                                    ]);

const AmbeVuv = new Int32Array([
                                   1, 1, 1, 1, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 1, 1, 0,
                                   1, 1, 1, 1, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 1, 0, 0,
                                   1, 1, 0, 1, 1, 1, 1, 1,
                                   1, 1, 1, 0, 1, 1, 1, 1,
                                   1, 1, 1, 1, 1, 0, 1, 1,
                                   1, 1, 1, 1, 0, 0, 0, 0,
                                   1, 1, 1, 1, 1, 0, 0, 0,
                                   1, 1, 1, 0, 0, 0, 0, 0,
                                   1, 1, 1, 0, 0, 0, 0, 1,
                                   1, 1, 0, 0, 0, 0, 0, 0,
                                   1, 1, 1, 0, 0, 0, 0, 0,
                                   1, 0, 0, 0, 0, 0, 0, 0,
                                   1, 1, 1, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0,
                                   0, 0, 0, 0, 0, 0, 0, 0
                               ]);

const AmbeLmprbl = new Int32Array([
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      0, 0, 0, 0,
                                      2, 2, 2, 3,
                                      2, 2, 3, 3,
                                      2, 3, 3, 3,
                                      2, 3, 3, 4,
                                      3, 3, 3, 4,
                                      3, 3, 4, 4,
                                      3, 3, 4, 5,
                                      3, 4, 4, 5,
                                      3, 4, 5, 5,
                                      4, 4, 5, 5,
                                      4, 4, 5, 6,
                                      4, 4, 6, 6,
                                      4, 5, 6, 6,
                                      4, 5, 6, 7,
                                      5, 5, 6, 7,
                                      5, 5, 7, 7,
                                      5, 6, 7, 7,
                                      5, 6, 7, 8,
                                      5, 6, 8, 8,
                                      6, 6, 8, 8,
                                      6, 6, 8, 9,
                                      6, 7, 8, 9,
                                      6, 7, 9, 9,
                                      6, 7, 9, 10,
                                      7, 7, 9, 10,
                                      7, 8, 9, 10,
                                      7, 8, 10, 10,
                                      7, 8, 10, 11,
                                      8, 8, 10, 11,
                                      8, 9, 10, 11,
                                      8, 9, 11, 11,
                                      8, 9, 11, 12,
                                      8, 9, 11, 13,
                                      8, 9, 12, 13,
                                      8, 10, 12, 13,
                                      9, 10, 12, 13,
                                      9, 10, 12, 14,
                                      9, 10, 13, 14,
                                      9, 11, 13, 14,
                                      10, 11, 13, 14,
                                      10, 11, 13, 15,
                                      10, 11, 14, 15,
                                      10, 12, 14, 15,
                                      10, 12, 14, 16,
                                      11, 12, 14, 16,
                                      11, 12, 15, 16,
                                      11, 12, 15, 17,
                                      11, 13, 15, 17
                                  ]);

const AmbeDg = new Float32Array([
                                    -2.0, -0.67, 0.297941, 0.663728, 1.036829, 1.438136, 1.890077, 2.227970,
                                    2.478289, 2.667544, 2.793619, 2.893261, 3.020630, 3.138586, 3.237579, 3.322570,
                                    3.432367, 3.571863, 3.696650, 3.814917, 3.920932, 4.022503, 4.123569, 4.228291,
                                    4.370569, 4.543700, 4.707695, 4.848879, 5.056757, 5.326468, 5.777581, 6.874496
                                ]);

const AmbePRBA24 = new Float32Array([
                                        0.526055, -0.328567, -0.304727,
                                        0.441044, -0.303127, -0.201114,
                                        1.030896, -0.324730, -0.397204,
                                        0.839696, -0.351933, -0.224909,
                                        0.272958, -0.176118, -0.098893,
                                        0.221466, -0.160045, -0.061026,
                                        0.496555, -0.211499, 0.047305,
                                        0.424376, -0.223752, 0.069911,
                                        0.264531, -0.353355, -0.330505,
                                        0.273650, -0.253004, -0.250241,
                                        0.484531, -0.297627, -0.071051,
                                        0.410814, -0.224961, -0.084998,
                                        0.039519, -0.252904, -0.115128,
                                        0.017423, -0.296519, -0.045921,
                                        0.225113, -0.224371, 0.037882,
                                        0.183424, -0.260492, 0.050491,
                                        0.308704, -0.073205, -0.405880,
                                        0.213125, -0.101632, -0.333208,
                                        0.617735, -0.137299, -0.213670,
                                        0.514382, -0.126485, -0.170204,
                                        0.130009, -0.076955, -0.229303,
                                        0.061740, -0.108259, -0.203887,
                                        0.244473, -0.110094, -0.051689,
                                        0.230452, -0.076147, -0.028190,
                                        0.059837, -0.254595, -0.562704,
                                        0.011630, -0.135223, -0.432791,
                                        0.207077, -0.152248, -0.148391,
                                        0.158078, -0.128800, -0.122150,
                                        -0.265982, -0.144742, -0.199894,
                                        -0.356479, -0.204740, -0.156465,
                                        0.000324, -0.139549, -0.066471,
                                        0.001888, -0.170557, -0.025025,
                                        0.402913, -0.581478, -0.274626,
                                        0.191289, -0.540335, -0.193040,
                                        0.632914, -0.401410, -0.006636,
                                        0.471086, -0.463144, 0.061489,
                                        0.044829, -0.438487, 0.033433,
                                        0.015513, -0.539475, -0.006719,
                                        0.336218, -0.351311, 0.214087,
                                        0.239967, -0.380836, 0.157681,
                                        0.347609, -0.901619, -0.688432,
                                        0.064067, -0.826753, -0.492089,
                                        0.303089, -0.396757, -0.108446,
                                        0.235590, -0.446122, 0.006437,
                                        -0.236964, -0.652532, -0.135520,
                                        -0.418285, -0.793014, -0.034730,
                                        -0.038262, -0.516984, 0.273681,
                                        -0.037419, -0.958198, 0.214749,
                                        0.061624, -0.238233, -0.237184,
                                        -0.013944, -0.235704, -0.204811,
                                        0.286428, -0.210542, -0.029587,
                                        0.257656, -0.261837, -0.056566,
                                        -0.235852, -0.310760, -0.165147,
                                        -0.334949, -0.385870, -0.197362,
                                        0.094870, -0.241144, 0.059122,
                                        0.060177, -0.225884, 0.031140,
                                        -0.301184, -0.306545, -0.446189,
                                        -0.293528, -0.504146, -0.429844,
                                        -0.055084, -0.379015, -0.125887,
                                        -0.115434, -0.375008, -0.059939,
                                        -0.777425, -0.592163, -0.107585,
                                        -0.950500, -0.893847, -0.181762,
                                        -0.259402, -0.396726, 0.010357,
                                        -0.368905, -0.449026, 0.038299,
                                        0.279719, -0.063196, -0.184628,
                                        0.255265, -0.067248, -0.121124,
                                        0.458433, -0.103777, 0.010074,
                                        0.437231, -0.092496, -0.031028,
                                        0.082265, -0.028050, -0.041262,
                                        0.045920, -0.051719, -0.030155,
                                        0.271149, -0.043613, 0.112085,
                                        0.246881, -0.065274, 0.105436,
                                        0.056590, -0.117773, -0.142283,
                                        0.058824, -0.104418, -0.099608,
                                        0.213781, -0.111974, 0.031269,
                                        0.187554, -0.070340, 0.011834,
                                        -0.185701, -0.081106, -0.073803,
                                        -0.266112, -0.074133, -0.085370,
                                        -0.029368, -0.046490, 0.124679,
                                        -0.017378, -0.102882, 0.140482,
                                        0.114700, 0.092738, -0.244271,
                                        0.072922, 0.007863, -0.231476,
                                        0.270022, 0.031819, -0.094208,
                                        0.254403, 0.024805, -0.050389,
                                        -0.182905, 0.021629, -0.168481,
                                        -0.225864, -0.010109, -0.130374,
                                        0.040089, 0.013969, 0.016028,
                                        0.001442, 0.010551, 0.032942,
                                        -0.287472, -0.036130, -0.296798,
                                        -0.332344, -0.108862, -0.342196,
                                        0.012700, 0.022917, -0.052501,
                                        -0.040681, -0.001805, -0.050548,
                                        -0.718522, -0.061234, -0.278820,
                                        -0.879205, -0.213588, -0.303508,
                                        -0.234102, -0.065407, 0.013686,
                                        -0.281223, -0.076139, 0.046830,
                                        0.141967, -0.193679, -0.055697,
                                        0.100318, -0.161222, -0.063062,
                                        0.265859, -0.132747, 0.078209,
                                        0.244805, -0.139776, 0.122123,
                                        -0.121802, -0.179976, 0.031732,
                                        -0.185318, -0.214011, 0.018117,
                                        0.047014, -0.153961, 0.218068,
                                        0.047305, -0.187402, 0.282114,
                                        -0.027533, -0.415868, -0.333841,
                                        -0.125886, -0.334492, -0.290317,
                                        -0.030602, -0.190918, 0.097454,
                                        -0.054936, -0.209948, 0.158977,
                                        -0.507223, -0.295876, -0.217183,
                                        -0.581733, -0.403194, -0.208936,
                                        -0.299719, -0.289679, 0.297101,
                                        -0.363169, -0.362718, 0.436529,
                                        -0.124627, -0.042100, -0.157011,
                                        -0.161571, -0.092846, -0.183636,
                                        0.084520, -0.100217, -0.000901,
                                        0.055655, -0.136381, 0.032764,
                                        -0.545087, -0.197713, -0.026888,
                                        -0.662772, -0.179815, 0.026419,
                                        -0.165583, -0.148913, 0.090382,
                                        -0.240772, -0.182830, 0.105474,
                                        -0.576315, -0.359473, -0.456844,
                                        -0.713430, -0.554156, -0.476739,
                                        -0.275628, -0.223640, -0.051584,
                                        -0.359501, -0.230758, -0.027006,
                                        -1.282559, -0.284807, -0.233743,
                                        -1.060476, -0.399911, -0.562698,
                                        -0.871952, -0.272197, 0.016126,
                                        -0.747922, -0.329404, 0.276696,
                                        0.643086, 0.046175, -0.660078,
                                        0.738204, -0.127844, -0.433708,
                                        1.158072, 0.025571, -0.177856,
                                        0.974840, -0.009417, -0.112337,
                                        0.418014, 0.032741, -0.124545,
                                        0.381422, -0.001557, -0.085504,
                                        0.768280, 0.056085, 0.095375,
                                        0.680004, 0.052035, 0.152318,
                                        0.473182, 0.012560, -0.264221,
                                        0.345153, 0.036627, -0.248756,
                                        0.746238, -0.025880, -0.106050,
                                        0.644319, -0.058256, -0.095133,
                                        0.185924, -0.022230, -0.070540,
                                        0.146068, -0.009550, -0.057871,
                                        0.338488, 0.013022, 0.069961,
                                        0.298969, 0.047403, 0.052598,
                                        0.346002, 0.256253, -0.380261,
                                        0.313092, 0.163821, -0.314004,
                                        0.719154, 0.103108, -0.252648,
                                        0.621429, 0.172423, -0.265180,
                                        0.240461, 0.104684, -0.202582,
                                        0.206946, 0.139642, -0.138016,
                                        0.359915, 0.101273, -0.052997,
                                        0.318117, 0.125888, -0.003486,
                                        0.150452, 0.050219, -0.409155,
                                        0.188753, 0.091894, -0.325733,
                                        0.334922, 0.029098, -0.098587,
                                        0.324508, 0.015809, -0.135408,
                                        -0.042506, 0.038667, -0.208535,
                                        -0.083003, 0.094758, -0.174054,
                                        0.094773, 0.102653, -0.025701,
                                        0.063284, 0.118703, -0.000071,
                                        0.355965, -0.139239, -0.191705,
                                        0.392742, -0.105496, -0.132103,
                                        0.663678, -0.204627, -0.031242,
                                        0.609381, -0.146914, 0.079610,
                                        0.151855, -0.132843, -0.007125,
                                        0.146404, -0.161917, 0.024842,
                                        0.400524, -0.135221, 0.232289,
                                        0.324931, -0.116605, 0.253458,
                                        0.169066, -0.215132, -0.185604,
                                        0.128681, -0.189394, -0.160279,
                                        0.356194, -0.116992, -0.038381,
                                        0.342866, -0.144687, 0.020265,
                                        -0.065545, -0.202593, -0.043688,
                                        -0.124296, -0.260225, -0.035370,
                                        0.083224, -0.235149, 0.153301,
                                        0.046256, -0.309608, 0.190944,
                                        0.187385, -0.008168, -0.198575,
                                        0.190401, -0.018699, -0.136858,
                                        0.398009, -0.025700, -0.007458,
                                        0.346948, -0.022258, -0.020905,
                                        -0.047064, -0.085629, -0.080677,
                                        -0.067523, -0.128972, -0.119538,
                                        0.186086, -0.016828, 0.070014,
                                        0.187364, 0.017133, 0.075949,
                                        -0.112669, -0.037433, -0.298944,
                                        -0.068276, -0.114504, -0.265795,
                                        0.147510, -0.040616, -0.013687,
                                        0.133084, -0.062849, -0.032637,
                                        -0.416571, -0.041544, -0.125088,
                                        -0.505337, -0.044193, -0.157651,
                                        -0.154132, -0.075106, 0.050466,
                                        -0.148036, -0.059719, 0.121516,
                                        0.490555, 0.157659, -0.222208,
                                        0.436700, 0.120500, -0.205869,
                                        0.754525, 0.269323, 0.045810,
                                        0.645077, 0.271923, 0.013942,
                                        0.237023, 0.115337, -0.026429,
                                        0.204895, 0.121020, -0.008541,
                                        0.383999, 0.153963, 0.171763,
                                        0.385026, 0.222074, 0.239731,
                                        0.198232, 0.072972, -0.108179,
                                        0.147882, 0.074743, -0.123341,
                                        0.390929, 0.075205, 0.081828,
                                        0.341623, 0.089405, 0.069389,
                                        -0.003381, 0.159694, -0.016026,
                                        -0.043653, 0.206860, -0.040729,
                                        0.135515, 0.107824, 0.179310,
                                        0.081086, 0.119673, 0.174282,
                                        0.192637, 0.400335, -0.341906,
                                        0.171196, 0.284921, -0.221516,
                                        0.377807, 0.359087, -0.151523,
                                        0.411052, 0.297925, -0.099774,
                                        -0.010060, 0.261887, -0.149567,
                                        -0.107877, 0.287756, -0.116982,
                                        0.158003, 0.209727, 0.077988,
                                        0.109710, 0.232272, 0.088135,
                                        0.000698, 0.209353, -0.395208,
                                        -0.094015, 0.230322, -0.279928,
                                        0.137355, 0.230881, -0.124115,
                                        0.103058, 0.166855, -0.100386,
                                        -0.305058, 0.305422, -0.176026,
                                        -0.422049, 0.337137, -0.293297,
                                        -0.121744, 0.185124, 0.048115,
                                        -0.171052, 0.200312, 0.052812,
                                        0.224091, -0.010673, -0.019727,
                                        0.200266, -0.020167, 0.001798,
                                        0.382742, 0.032362, 0.161665,
                                        0.345631, -0.019705, 0.164451,
                                        0.029431, 0.045010, 0.071518,
                                        0.031940, 0.010876, 0.087037,
                                        0.181935, 0.039112, 0.202316,
                                        0.181810, 0.033189, 0.253435,
                                        -0.008677, -0.066679, -0.144737,
                                        -0.021768, -0.021288, -0.125903,
                                        0.136766, 0.000100, 0.059449,
                                        0.135405, -0.020446, 0.103793,
                                        -0.289115, 0.039747, -0.012256,
                                        -0.338683, 0.025909, -0.034058,
                                        -0.016515, 0.048584, 0.197981,
                                        -0.046790, 0.011816, 0.199964,
                                        0.094214, 0.127422, -0.169936,
                                        0.048279, 0.096189, -0.148153,
                                        0.217391, 0.081732, 0.013677,
                                        0.179656, 0.084671, 0.031434,
                                        -0.227367, 0.118176, -0.039803,
                                        -0.327096, 0.159747, -0.018931,
                                        0.000834, 0.113118, 0.125325,
                                        -0.014617, 0.128924, 0.163776,
                                        -0.254570, 0.154329, -0.232018,
                                        -0.353068, 0.124341, -0.174409,
                                        -0.061004, 0.107744, 0.037257,
                                        -0.100991, 0.080302, 0.062701,
                                        -0.927022, 0.285660, -0.240549,
                                        -1.153224, 0.277232, -0.322538,
                                        -0.569012, 0.108135, 0.172634,
                                        -0.555273, 0.131461, 0.325930,
                                        0.518847, 0.065683, -0.132877,
                                        0.501324, -0.006585, -0.094884,
                                        1.066190, -0.150380, 0.201791,
                                        0.858377, -0.166415, 0.081686,
                                        0.320584, -0.031499, 0.039534,
                                        0.311442, -0.075120, 0.026013,
                                        0.625829, -0.019856, 0.346041,
                                        0.525271, -0.003948, 0.284868,
                                        0.312594, -0.075673, -0.066642,
                                        0.295732, -0.057895, -0.042207,
                                        0.550446, -0.029110, 0.046850,
                                        0.465467, -0.068987, 0.096167,
                                        0.122669, -0.051786, 0.044283,
                                        0.079669, -0.044145, 0.045805,
                                        0.238778, -0.031835, 0.171694,
                                        0.200734, -0.072619, 0.178726,
                                        0.342512, 0.131270, -0.163021,
                                        0.294028, 0.111759, -0.125793,
                                        0.589523, 0.121808, -0.049372,
                                        0.550506, 0.132318, 0.017485,
                                        0.164280, 0.047560, -0.058383,
                                        0.120110, 0.049242, -0.052403,
                                        0.269181, 0.035000, 0.103494,
                                        0.297466, 0.038517, 0.139289,
                                        0.094549, -0.030880, -0.153376,
                                        0.080363, 0.024359, -0.127578,
                                        0.281351, 0.055178, 0.000155,
                                        0.234900, 0.039477, 0.013957,
                                        -0.118161, 0.011976, -0.034270,
                                        -0.157654, 0.027765, -0.005010,
                                        0.102631, 0.027283, 0.099723,
                                        0.077285, 0.052532, 0.115583,
                                        0.329398, -0.278552, 0.016316,
                                        0.305993, -0.267896, 0.094952,
                                        0.775270, -0.394995, 0.290748,
                                        0.583180, -0.252159, 0.285391,
                                        0.192226, -0.182242, 0.126859,
                                        0.185908, -0.245779, 0.159940,
                                        0.346293, -0.250404, 0.355682,
                                        0.354160, -0.364521, 0.472337,
                                        0.134942, -0.313666, -0.115181,
                                        0.126077, -0.286568, -0.039927,
                                        0.405618, -0.211792, 0.199095,
                                        0.312099, -0.213642, 0.190972,
                                        -0.071392, -0.297366, 0.081426,
                                        -0.165839, -0.301986, 0.160640,
                                        0.147808, -0.290712, 0.298198,
                                        0.063302, -0.310149, 0.396302,
                                        0.141444, -0.081377, -0.076621,
                                        0.115936, -0.104440, -0.039885,
                                        0.367023, -0.087281, 0.096390,
                                        0.330038, -0.117958, 0.127050,
                                        0.002897, -0.062454, 0.025151,
                                        -0.052404, -0.082200, 0.041975,
                                        0.181553, -0.137004, 0.230489,
                                        0.140768, -0.094604, 0.265928,
                                        -0.101763, -0.209566, -0.135964,
                                        -0.159056, -0.191005, -0.095509,
                                        0.045016, -0.081562, 0.075942,
                                        0.016808, -0.112482, 0.068593,
                                        -0.408578, -0.132377, 0.079163,
                                        -0.431534, -0.214646, 0.157714,
                                        -0.096931, -0.101938, 0.200304,
                                        -0.167867, -0.114851, 0.262964,
                                        0.393882, 0.086002, 0.008961,
                                        0.338747, 0.048405, -0.004187,
                                        0.877844, 0.374373, 0.171008,
                                        0.740790, 0.324525, 0.242248,
                                        0.200218, 0.070150, 0.085891,
                                        0.171760, 0.090531, 0.102579,
                                        0.314263, 0.126417, 0.322833,
                                        0.313523, 0.065445, 0.403855,
                                        0.164261, 0.057745, -0.005490,
                                        0.122141, 0.024122, 0.009190,
                                        0.308248, 0.078401, 0.180577,
                                        0.251222, 0.073868, 0.160457,
                                        -0.047526, 0.023725, 0.086336,
                                        -0.091643, 0.005539, 0.093179,
                                        0.079339, 0.044135, 0.206697,
                                        0.104213, 0.011277, 0.240060,
                                        0.226607, 0.186234, -0.056881,
                                        0.173281, 0.158131, -0.059413,
                                        0.339400, 0.214501, 0.052905,
                                        0.309166, 0.188181, 0.058028,
                                        0.014442, 0.194715, 0.048945,
                                        -0.028793, 0.194766, 0.089078,
                                        0.069564, 0.206743, 0.193568,
                                        0.091532, 0.202786, 0.269680,
                                        -0.071196, 0.135604, -0.103744,
                                        -0.118288, 0.152837, -0.060151,
                                        0.146856, 0.143174, 0.061789,
                                        0.104379, 0.143672, 0.056797,
                                        -0.541832, 0.250034, -0.017602,
                                        -0.641583, 0.278411, -0.111909,
                                        -0.094447, 0.159393, 0.164848,
                                        -0.113612, 0.120702, 0.221656,
                                        0.204918, -0.078894, 0.075524,
                                        0.161232, -0.090256, 0.088701,
                                        0.378460, -0.033687, 0.309964,
                                        0.311701, -0.049984, 0.316881,
                                        0.019311, -0.050048, 0.212387,
                                        0.002473, -0.062855, 0.278462,
                                        0.151448, -0.090652, 0.410031,
                                        0.162778, -0.071291, 0.531252,
                                        -0.083704, -0.076839, -0.020798,
                                        -0.092832, -0.043492, 0.029202,
                                        0.136844, -0.077791, 0.186493,
                                        0.089536, -0.086826, 0.184711,
                                        -0.270255, -0.058858, 0.173048,
                                        -0.350416, -0.009219, 0.273260,
                                        -0.105248, -0.205534, 0.425159,
                                        -0.135030, -0.197464, 0.623550,
                                        -0.051717, 0.069756, -0.043829,
                                        -0.081050, 0.056947, -0.000205,
                                        0.190388, 0.016366, 0.145922,
                                        0.142662, 0.002575, 0.159182,
                                        -0.352890, 0.011117, 0.091040,
                                        -0.367374, 0.056547, 0.147209,
                                        -0.003179, 0.026570, 0.282541,
                                        -0.069934, -0.005171, 0.337678,
                                        -0.496181, 0.026464, 0.019432,
                                        -0.690384, 0.069313, -0.004175,
                                        -0.146138, 0.046372, 0.161839,
                                        -0.197581, 0.034093, 0.241003,
                                        -0.989567, 0.040993, 0.049384,
                                        -1.151075, 0.210556, 0.237374,
                                        -0.335366, -0.058208, 0.480168,
                                        -0.502419, -0.093761, 0.675240,
                                        0.862548, 0.264137, -0.294905,
                                        0.782668, 0.251324, -0.122108,
                                        1.597797, 0.463818, -0.133153,
                                        1.615756, 0.060653, 0.084764,
                                        0.435588, 0.209832, 0.095050,
                                        0.431013, 0.165328, 0.047909,
                                        1.248164, 0.265923, 0.488086,
                                        1.009933, 0.345440, 0.473702,
                                        0.477017, 0.194237, -0.058012,
                                        0.401362, 0.186915, -0.054137,
                                        1.202158, 0.284782, -0.066531,
                                        1.064907, 0.203766, 0.046383,
                                        0.255848, 0.133398, 0.046049,
                                        0.218680, 0.128833, 0.065326,
                                        0.490817, 0.182041, 0.286583,
                                        0.440714, 0.106576, 0.301120,
                                        0.604263, 0.522925, -0.238629,
                                        0.526329, 0.377577, -0.198100,
                                        1.038632, 0.606242, -0.121253,
                                        0.995283, 0.552202, 0.110700,
                                        0.262232, 0.313664, -0.086909,
                                        0.230835, 0.273385, -0.054268,
                                        0.548466, 0.490721, 0.278201,
                                        0.466984, 0.355859, 0.289160,
                                        0.367137, 0.236160, -0.228114,
                                        0.309359, 0.233843, -0.171325,
                                        0.465268, 0.276569, 0.010951,
                                        0.378124, 0.250237, 0.011131,
                                        0.061885, 0.296810, -0.011420,
                                        0.000125, 0.350029, -0.011277,
                                        0.163815, 0.261191, 0.175863,
                                        0.165132, 0.308797, 0.227800,
                                        0.461418, 0.052075, -0.016543,
                                        0.472372, 0.046962, 0.045746,
                                        0.856406, 0.136415, 0.245074,
                                        0.834616, 0.003254, 0.372643,
                                        0.337869, 0.036994, 0.232513,
                                        0.267414, 0.027593, 0.252779,
                                        0.584983, 0.113046, 0.583119,
                                        0.475406, -0.024234, 0.655070,
                                        0.264823, -0.029292, 0.004270,
                                        0.246071, -0.019109, 0.030048,
                                        0.477401, 0.021039, 0.155448,
                                        0.458453, -0.043959, 0.187850,
                                        0.067059, -0.061227, 0.126904,
                                        0.044608, -0.034575, 0.150205,
                                        0.191304, -0.003810, 0.316776,
                                        0.153078, 0.029915, 0.361303,
                                        0.320704, 0.178950, -0.088835,
                                        0.300866, 0.137645, -0.056893,
                                        0.553442, 0.162339, 0.131987,
                                        0.490083, 0.123682, 0.146163,
                                        0.118950, 0.083109, 0.034052,
                                        0.099344, 0.066212, 0.054329,
                                        0.228325, 0.122445, 0.309219,
                                        0.172093, 0.135754, 0.323361,
                                        0.064213, 0.063405, -0.058243,
                                        0.011906, 0.088795, -0.069678,
                                        0.194232, 0.129185, 0.125708,
                                        0.155182, 0.174013, 0.144099,
                                        -0.217068, 0.112731, 0.093497,
                                        -0.307590, 0.171146, 0.110735,
                                        -0.014897, 0.138094, 0.232455,
                                        -0.036936, 0.170135, 0.279166,
                                        0.681886, 0.437121, 0.078458,
                                        0.548559, 0.376914, 0.092485,
                                        1.259194, 0.901494, 0.256085,
                                        1.296139, 0.607949, 0.302184,
                                        0.319619, 0.307231, 0.099647,
                                        0.287232, 0.359355, 0.186844,
                                        0.751306, 0.676688, 0.499386,
                                        0.479609, 0.553030, 0.560447,
                                        0.276377, 0.214032, -0.003661,
                                        0.238146, 0.223595, 0.028806,
                                        0.542688, 0.266205, 0.171393,
                                        0.460188, 0.283979, 0.158288,
                                        0.057385, 0.309853, 0.144517,
                                        -0.006881, 0.348152, 0.097310,
                                        0.244434, 0.247298, 0.322601,
                                        0.253992, 0.335420, 0.402241,
                                        0.354006, 0.579776, -0.130176,
                                        0.267043, 0.461976, -0.058178,
                                        0.534049, 0.626549, 0.046747,
                                        0.441835, 0.468260, 0.057556,
                                        0.110477, 0.628795, 0.102950,
                                        0.031409, 0.489068, 0.090605,
                                        0.229564, 0.525640, 0.325454,
                                        0.105570, 0.582151, 0.509738,
                                        0.005690, 0.521474, -0.157885,
                                        0.104463, 0.424022, -0.080647,
                                        0.223784, 0.389860, 0.060904,
                                        0.159806, 0.340571, 0.062061,
                                        -0.173976, 0.573425, 0.027383,
                                        -0.376008, 0.587868, 0.133042,
                                        -0.051773, 0.348339, 0.231923,
                                        -0.122571, 0.473049, 0.251159,
                                        0.324321, 0.148510, 0.116006,
                                        0.282263, 0.121730, 0.114016,
                                        0.690108, 0.256346, 0.418128,
                                        0.542523, 0.294427, 0.461973,
                                        0.056944, 0.107667, 0.281797,
                                        0.027844, 0.106858, 0.355071,
                                        0.160456, 0.177656, 0.528819,
                                        0.227537, 0.177976, 0.689465,
                                        0.111585, 0.097896, 0.109244,
                                        0.083994, 0.133245, 0.115789,
                                        0.208740, 0.142084, 0.208953,
                                        0.156072, 0.143303, 0.231368,
                                        -0.185830, 0.214347, 0.309774,
                                        -0.311053, 0.240517, 0.328512,
                                        -0.041749, 0.090901, 0.511373,
                                        -0.156164, 0.098486, 0.478020,
                                        0.151543, 0.263073, -0.033471,
                                        0.126322, 0.213004, -0.007014,
                                        0.245313, 0.217564, 0.120210,
                                        0.259136, 0.225542, 0.176601,
                                        -0.190632, 0.260214, 0.141755,
                                        -0.189271, 0.331768, 0.170606,
                                        0.054763, 0.294766, 0.357775,
                                        -0.033724, 0.257645, 0.365069,
                                        -0.184971, 0.396532, 0.057728,
                                        -0.293313, 0.400259, 0.001123,
                                        -0.015219, 0.232287, 0.177913,
                                        -0.022524, 0.244724, 0.240753,
                                        -0.520342, 0.347950, 0.249265,
                                        -0.671997, 0.410782, 0.153434,
                                        -0.253089, 0.412356, 0.489854,
                                        -0.410922, 0.562454, 0.543891
                                    ]);

const AmbePRBA58 = new Float32Array([
                                        -0.103660, 0.094597, -0.013149, 0.081501,
                                        -0.170709, 0.129958, -0.057316, 0.112324,
                                        -0.095113, 0.080892, -0.027554, 0.003371,
                                        -0.154153, 0.113437, -0.074522, 0.003446,
                                        -0.109553, 0.153519, 0.006858, 0.040930,
                                        -0.181931, 0.217882, -0.019042, 0.040049,
                                        -0.096246, 0.144191, -0.024147, -0.035120,
                                        -0.174811, 0.193357, -0.054261, -0.071700,
                                        -0.183241, -0.052840, 0.117923, 0.030960,
                                        -0.242634, 0.009075, 0.098007, 0.091643,
                                        -0.143847, -0.028529, 0.040171, -0.002812,
                                        -0.198809, 0.006990, 0.020668, 0.026641,
                                        -0.233172, -0.028793, 0.140130, -0.071927,
                                        -0.309313, 0.056873, 0.108262, -0.018930,
                                        -0.172782, -0.002037, 0.048755, -0.087065,
                                        -0.242901, 0.036076, 0.015064, -0.064366,
                                        0.077107, 0.172685, 0.159939, 0.097456,
                                        0.024820, 0.209676, 0.087347, 0.105204,
                                        0.085113, 0.151639, 0.084272, 0.022747,
                                        0.047975, 0.196695, 0.038770, 0.029953,
                                        0.113925, 0.236813, 0.176121, 0.016635,
                                        0.009708, 0.267969, 0.127660, 0.015872,
                                        0.114044, 0.202311, 0.096892, -0.043071,
                                        0.047219, 0.260395, 0.050952, -0.046996,
                                        -0.055095, 0.034041, 0.200464, 0.039050,
                                        -0.061582, 0.069566, 0.113048, 0.027511,
                                        -0.025469, 0.040440, 0.132777, -0.039098,
                                        -0.031388, 0.064010, 0.067559, -0.017117,
                                        -0.074386, 0.086579, 0.228232, -0.055461,
                                        -0.107352, 0.120874, 0.137364, -0.030252,
                                        -0.036897, 0.089972, 0.155831, -0.128475,
                                        -0.059070, 0.097879, 0.084489, -0.075821,
                                        -0.050865, -0.025167, -0.086636, 0.011256,
                                        -0.051426, 0.013301, -0.144665, 0.038541,
                                        -0.073831, -0.028917, -0.142416, -0.025268,
                                        -0.083910, 0.015004, -0.227113, -0.002808,
                                        -0.030840, -0.009326, -0.070517, -0.041304,
                                        -0.022018, 0.029381, -0.124961, -0.031624,
                                        -0.064222, -0.014640, -0.108798, -0.092342,
                                        -0.038801, 0.038133, -0.188992, -0.094221,
                                        -0.154059, -0.183932, -0.019894, 0.082105,
                                        -0.188022, -0.113072, -0.117380, 0.090911,
                                        -0.243301, -0.207086, -0.053735, -0.001975,
                                        -0.275931, -0.121035, -0.161261, 0.004231,
                                        -0.118142, -0.157537, -0.036594, -0.008679,
                                        -0.153627, -0.111372, -0.103095, -0.009460,
                                        -0.173458, -0.180158, -0.057130, -0.103198,
                                        -0.208509, -0.127679, -0.149336, -0.109289,
                                        0.096310, 0.047927, -0.024094, -0.057018,
                                        0.044289, 0.075486, -0.008505, -0.067635,
                                        0.076751, 0.025560, -0.066428, -0.102991,
                                        0.025215, 0.090417, -0.058616, -0.114284,
                                        0.125980, 0.070078, 0.016282, -0.112355,
                                        0.070859, 0.118988, 0.001180, -0.116359,
                                        0.097520, 0.059219, -0.026821, -0.172850,
                                        0.048226, 0.145459, -0.050093, -0.188853,
                                        0.007242, -0.135796, 0.147832, -0.034080,
                                        0.012843, -0.069616, 0.077139, -0.047909,
                                        -0.050911, -0.116323, 0.082521, -0.056362,
                                        -0.039630, -0.055678, 0.036066, -0.067992,
                                        0.042694, -0.091527, 0.150940, -0.124225,
                                        0.029225, -0.039401, 0.071664, -0.113665,
                                        -0.025085, -0.099013, 0.074622, -0.138674,
                                        -0.031220, -0.035717, 0.020870, -0.143376,
                                        0.040638, 0.087903, -0.049500, 0.094607,
                                        0.026860, 0.125924, -0.103449, 0.140882,
                                        0.075166, 0.110186, -0.115173, 0.067330,
                                        0.036642, 0.163193, -0.188762, 0.103724,
                                        0.028179, 0.095124, -0.053258, 0.028900,
                                        0.002307, 0.148211, -0.096037, 0.046189,
                                        0.072227, 0.137595, -0.095629, 0.001339,
                                        0.033308, 0.221480, -0.152201, 0.012125,
                                        0.003458, -0.085112, 0.041850, 0.113836,
                                        -0.040610, -0.044880, 0.029732, 0.177011,
                                        0.011404, -0.054324, -0.012426, 0.077815,
                                        -0.042413, -0.030930, -0.034844, 0.122946,
                                        -0.002206, -0.045698, 0.050651, 0.054886,
                                        -0.041729, -0.016110, 0.048005, 0.102125,
                                        0.013963, -0.022204, 0.001613, 0.028997,
                                        -0.030218, -0.002052, -0.004365, 0.065343,
                                        0.299049, 0.046260, 0.076320, 0.070784,
                                        0.250160, 0.098440, 0.012590, 0.137479,
                                        0.254170, 0.095310, 0.018749, 0.004288,
                                        0.218892, 0.145554, -0.035161, 0.069784,
                                        0.303486, 0.101424, 0.135996, -0.013096,
                                        0.262919, 0.165133, 0.077237, 0.071721,
                                        0.319358, 0.170283, 0.054554, -0.072210,
                                        0.272983, 0.231181, -0.014471, 0.011689,
                                        0.134116, -0.026693, 0.161400, 0.110292,
                                        0.100379, 0.026517, 0.086236, 0.130478,
                                        0.144718, -0.000895, 0.093767, 0.044514,
                                        0.114943, 0.022145, 0.035871, 0.069193,
                                        0.122051, 0.011043, 0.192803, 0.022796,
                                        0.079482, 0.026156, 0.117725, 0.056565,
                                        0.124641, 0.027387, 0.122956, -0.025369,
                                        0.090708, 0.027357, 0.064450, 0.013058,
                                        0.159781, -0.055202, -0.090597, 0.151598,
                                        0.084577, -0.037203, -0.126698, 0.119739,
                                        0.192484, -0.100195, -0.162066, 0.104148,
                                        0.114579, -0.046270, -0.219547, 0.100067,
                                        0.153083, -0.010127, -0.086266, 0.068648,
                                        0.088202, -0.010515, -0.102196, 0.046281,
                                        0.164494, -0.057325, -0.132860, 0.024093,
                                        0.109419, -0.013999, -0.169596, 0.020412,
                                        0.039180, -0.209168, -0.035872, 0.087949,
                                        0.012790, -0.177723, -0.129986, 0.073364,
                                        0.045261, -0.256694, -0.088186, 0.004212,
                                        -0.005314, -0.231202, -0.191671, -0.002628,
                                        0.037963, -0.153227, -0.045364, 0.003322,
                                        0.030800, -0.126452, -0.114266, -0.010414,
                                        0.044125, -0.184146, -0.081400, -0.077341,
                                        0.029204, -0.157393, -0.172017, -0.089814,
                                        0.393519, -0.043228, -0.111365, -0.000740,
                                        0.289581, 0.018928, -0.123140, 0.000713,
                                        0.311229, -0.059735, -0.198982, -0.081664,
                                        0.258659, 0.052505, -0.211913, -0.034928,
                                        0.300693, 0.011381, -0.083545, -0.086683,
                                        0.214523, 0.053878, -0.101199, -0.061018,
                                        0.253422, 0.028496, -0.156752, -0.163342,
                                        0.199123, 0.113877, -0.166220, -0.102584,
                                        0.249134, -0.165135, 0.028917, 0.051838,
                                        0.156434, -0.123708, 0.017053, 0.043043,
                                        0.214763, -0.101243, -0.005581, -0.020703,
                                        0.140554, -0.072067, -0.015063, -0.011165,
                                        0.241791, -0.152048, 0.106403, -0.046857,
                                        0.142316, -0.131899, 0.054076, -0.026485,
                                        0.206535, -0.086116, 0.046640, -0.097615,
                                        0.129759, -0.081874, 0.004693, -0.073169
                                    ]);

const AmbeHOCb5 = new Float32Array([
                                       0.264108, 0.045976, -0.200999, -0.122344,
                                       0.479006, 0.227924, -0.016114, -0.006835,
                                       0.077297, 0.080775, -0.068936, 0.041733,
                                       0.185486, 0.231840, 0.182410, 0.101613,
                                       -0.012442, 0.223718, -0.277803, -0.034370,
                                       -0.059507, 0.139621, -0.024708, -0.104205,
                                       -0.248676, 0.255502, -0.134894, -0.058338,
                                       -0.055122, 0.427253, 0.025059, -0.045051,
                                       -0.058898, -0.061945, 0.028030, -0.022242,
                                       0.084153, 0.025327, 0.066780, -0.180839,
                                       -0.193125, -0.082632, 0.140899, -0.089559,
                                       0.000000, 0.033758, 0.276623, 0.002493,
                                       -0.396582, -0.049543, -0.118100, -0.208305,
                                       -0.287112, 0.096620, 0.049650, -0.079312,
                                       -0.543760, 0.171107, -0.062173, -0.010483,
                                       -0.353572, 0.227440, 0.230128, -0.032089,
                                       0.248579, -0.279824, -0.209589, 0.070903,
                                       0.377604, -0.119639, 0.008463, -0.005589,
                                       0.102127, -0.093666, -0.061325, 0.052082,
                                       0.154134, -0.105724, 0.099317, 0.187972,
                                       -0.139232, -0.091146, -0.275479, -0.038435,
                                       -0.144169, 0.034314, -0.030840, 0.022207,
                                       -0.143985, 0.079414, -0.194701, 0.175312,
                                       -0.195329, 0.087467, 0.067711, 0.186783,
                                       -0.123515, -0.377873, -0.209929, -0.212677,
                                       0.068698, -0.255933, 0.120463, -0.095629,
                                       -0.106810, -0.319964, -0.089322, 0.106947,
                                       -0.158605, -0.309606, 0.190900, 0.089340,
                                       -0.489162, -0.432784, -0.151215, -0.005786,
                                       -0.370883, -0.154342, -0.022545, 0.114054,
                                       -0.742866, -0.204364, -0.123865, -0.038888,
                                       -0.573077, -0.115287, 0.208879, -0.027698
                                   ]);

const AmbeHOCb6 = new Float32Array([
                                       -0.143886, 0.235528, -0.116707, 0.025541,
                                       -0.170182, -0.063822, -0.096934, 0.109704,
                                       0.232915, 0.269793, 0.047064, -0.032761,
                                       0.153458, 0.068130, -0.033513, 0.126553,
                                       -0.440712, 0.132952, 0.081378, -0.013210,
                                       -0.480433, -0.249687, -0.012280, 0.007112,
                                       -0.088001, 0.167609, 0.148323, -0.119892,
                                       -0.104628, 0.102639, 0.183560, 0.121674,
                                       0.047408, -0.000908, -0.214196, -0.109372,
                                       0.113418, -0.240340, -0.121420, 0.041117,
                                       0.385609, 0.042913, -0.184584, -0.017851,
                                       0.453830, -0.180745, 0.050455, 0.030984,
                                       -0.155984, -0.144212, 0.018226, -0.146356,
                                       -0.104028, -0.260377, 0.146472, 0.101389,
                                       0.012376, -0.000267, 0.006657, -0.013941,
                                       0.165852, -0.103467, 0.119713, -0.075455
                                   ]);

const AmbeHOCb7 = new Float32Array([
                                       0.182478, 0.271794, -0.057639, 0.026115,
                                       0.110795, 0.092854, 0.078125, -0.082726,
                                       0.057964, 0.000833, 0.176048, 0.135404,
                                       -0.027315, 0.098668, -0.065801, 0.116421,
                                       -0.222796, 0.062967, 0.201740, -0.089975,
                                       -0.193571, 0.309225, -0.014101, -0.034574,
                                       -0.389053, -0.181476, 0.107682, 0.050169,
                                       -0.345604, 0.064900, -0.065014, 0.065642,
                                       0.319393, -0.055491, -0.220727, -0.067499,
                                       0.460572, 0.084686, 0.048453, -0.011050,
                                       0.201623, -0.068994, -0.067101, 0.108320,
                                       0.227528, -0.173900, 0.092417, -0.066515,
                                       -0.016927, 0.047757, -0.177686, -0.102163,
                                       -0.052553, -0.065689, 0.019328, -0.033060,
                                       -0.144910, -0.238617, -0.195206, -0.063917,
                                       -0.024159, -0.338822, 0.003581, 0.060995
                                   ]);

const AmbeHOCb8 = new Float32Array([
                                       0.323968, 0.008964, -0.063117, 0.027909,
                                       0.010900, -0.004030, -0.125016, -0.080818,
                                       0.109969, 0.256272, 0.042470, 0.000749,
                                       -0.135446, 0.201769, -0.083426, 0.093888,
                                       -0.441995, 0.038159, 0.022784, 0.003943,
                                       -0.155951, 0.032467, 0.145309, -0.041725,
                                       -0.149182, -0.223356, -0.065793, 0.075016,
                                       0.096949, -0.096400, 0.083194, 0.049306
                                   ]);

function mbe_dumpAmbe2450Data(ambe_d)
{
}

function mbe_dumpAmbe3600x2450Frame(ambe_fr)
{
}

function mbe_eccAmbe3600x2450C0(ambe_fr)
{
    let j, errs;
    let inn = new Int8Array(23);
    let out = new Int8Array(23);
    for (j = 0; j < 23; j++)
        inn[j] = ambe_fr[j + 1];
    errs = mbe_golay2312(inn, out);
    for (j = 0; j < 23; j++)
        ambe_fr[j + 1] = out[j];
    return errs;
}

function mbe_eccAmbe3600x2450Data(ambe_fr, ambe_d)
{
    let j, errs;
    let gin = new Int8Array(23);
    let gout = new Int8Array(23);
    let ambe = 0;
    for (j = 23; j > 11; j--)
        ambe_d[ambe++] = ambe_fr[j];
    for (j = 0; j < 23; j++)
        gin[j] = ambe_fr[24 + j];
    errs = mbe_golay2312(gin, gout);
    for (j = 22; j > 10; j--)
        ambe_d[ambe++] = gout[j];
    for (j = 10; j >= 0; j--)
        ambe_d[ambe++] = ambe_fr[48 + j];
    for (j = 13; j >= 0; j--)
        ambe_d[ambe++] = ambe_fr[72 + j];
    return errs;
}

function mbe_decodeAmbe2450Parms(ambe_d, cur_mp, prev_mp)
{
    let ji, i, j, k, l, L, L9, m, am, ak;
    let intkl = new Int32Array(57);
    let b0, b1, b2, b3, b4, b5, b6, b7, b8;
    let f0;
    let Cik = new Float32Array(90);
    let flokl = new Float32Array(57);
    let deltal = new Float32Array(57);
    let Sum42, Sum43;
    let Tl = new Float32Array(57);
    let Gm = new Float32Array(9);
    let Ri = new Float32Array(9);
    let sum, c1, c2;
    let silence = 0;
    let Ji = new Int32Array(5)
    let jl;
    let deltaGamma, BigGamma;
    let unvc, rconst;
    cur_mp.repeat = prev_mp.repeat;
    b0 = 0;
    b0 |= ambe_d[0] << 6;
    b0 |= ambe_d[1] << 5;
    b0 |= ambe_d[2] << 4;
    b0 |= ambe_d[3] << 3;
    b0 |= ambe_d[37] << 2;
    b0 |= ambe_d[38] << 1;
    b0 |= ambe_d[39];
    if ((b0 >= 120) && (b0 <= 123))
        return 2;
    else if ((b0 === 124) || (b0 === 125)) {
        silence = 1;
        cur_mp.w0 = M_2PI / 32;
        f0 = 1 / 32;
        L = 14;
        cur_mp.L = 14;
        for (l = 1; l <= L; l++)
            cur_mp.Vl[l] = 0;
    } else if ((b0 === 126) || (b0 === 127))
        return 3;
    if (silence === 0) {
        f0 = AmbeW0table[b0];
        cur_mp.w0 = f0 * M_2PI;
    }
    unvc = 0.2046 / Math.sqrt(cur_mp.w0);
    if (silence === 0) {
        L = AmbeLtable[b0] | 0;
        cur_mp.L = L;
    }
    L9 = L - 9;
    b1 = 0;
    b1 |= ambe_d[4] << 4;
    b1 |= ambe_d[5] << 3;
    b1 |= ambe_d[6] << 2;
    b1 |= ambe_d[7] << 1;
    b1 |= ambe_d[35];
    for (l = 1; l <= L; l++) {
        jl = (l * 16 * f0) | 0;
        if (silence === 0)
            cur_mp.Vl[l] = AmbeVuv[8 * b1 + jl];
    }
    b2 = 0;
    b2 |= ambe_d[8] << 4;
    b2 |= ambe_d[9] << 3;
    b2 |= ambe_d[10] << 2;
    b2 |= ambe_d[11] << 1;
    b2 |= ambe_d[36];
    deltaGamma = AmbeDg[b2];
    cur_mp.gamma = deltaGamma + 0.5 * prev_mp.gamma;
    Gm[1] = 0;
    b3 = 0;
    b3 |= ambe_d[12] << 8;
    b3 |= ambe_d[13] << 7;
    b3 |= ambe_d[14] << 6;
    b3 |= ambe_d[15] << 5;
    b3 |= ambe_d[16] << 4;
    b3 |= ambe_d[17] << 3;
    b3 |= ambe_d[18] << 2;
    b3 |= ambe_d[19] << 1;
    b3 |= ambe_d[40];
    Gm[2] = AmbePRBA24[3 * b3];
    Gm[3] = AmbePRBA24[3 * b3 + 1];
    Gm[4] = AmbePRBA24[3 * b3 + 2];
    b4 = 0;
    b4 |= ambe_d[20] << 6;
    b4 |= ambe_d[21] << 5;
    b4 |= ambe_d[22] << 4;
    b4 |= ambe_d[23] << 3;
    b4 |= ambe_d[41] << 2;
    b4 |= ambe_d[42] << 1;
    b4 |= ambe_d[43];
    Gm[5] = AmbePRBA58[4 * b4];
    Gm[6] = AmbePRBA58[4 * b4 + 1];
    Gm[7] = AmbePRBA58[4 * b4 + 2];
    Gm[8] = AmbePRBA58[4 * b4 + 3];
    for (i = 1; i <= 8; i++) {
        sum = 0;
        for (m = 1; m <= 8; m++) {
            if (m === 1)
                am = 1;
            else
                am = 2;
            sum = sum + am * Gm[m] * Math.cos((M_PI * (m - 1) * (i - 0.5)) / 8);
        }
        Ri[i] = sum;
    }
    rconst = 1 / (2 * M_SQRT2);
    Cik[19] = 0.5 * (Ri[1] + Ri[2]);
    Cik[20] = rconst * (Ri[1] - Ri[2]);
    Cik[37] = 0.5 * (Ri[3] + Ri[4]);
    Cik[38] = rconst * (Ri[3] - Ri[4]);
    Cik[55] = 0.5 * (Ri[5] + Ri[6]);
    Cik[56] = rconst * (Ri[5] - Ri[6]);
    Cik[73] = 0.5 * (Ri[7] + Ri[8]);
    Cik[74] = rconst * (Ri[7] - Ri[8]);
    b5 = 0;
    b5 |= ambe_d[24] << 4;
    b5 |= ambe_d[25] << 3;
    b5 |= ambe_d[26] << 2;
    b5 |= ambe_d[27] << 1;
    b5 |= ambe_d[44];
    b6 = 0;
    b6 |= ambe_d[28] << 3;
    b6 |= ambe_d[29] << 2;
    b6 |= ambe_d[30] << 1;
    b6 |= ambe_d[45];
    b7 = 0;
    b7 |= ambe_d[31] << 3;
    b7 |= ambe_d[32] << 2;
    b7 |= ambe_d[33] << 1;
    b7 |= ambe_d[46];
    b8 = 0;
    b8 |= ambe_d[34] << 2;
    b8 |= ambe_d[47] << 1;
    b8 |= ambe_d[48];
    Ji[1] = AmbeLmprbl[4 * L];
    Ji[2] = AmbeLmprbl[4 * L + 1];
    Ji[3] = AmbeLmprbl[4 * L + 2];
    Ji[4] = AmbeLmprbl[4 * L + 3];
    for (k = 3; k <= Ji[1]; k++)
        if (k > 6)
            Cik[18 + k] = 0;
        else
            Cik[18 + k] = AmbeHOCb5[4 * b5 + k - 3];
    for (k = 3; k <= Ji[2]; k++)
        if (k > 6)
            Cik[36 + k] = 0;
        else
            Cik[36 + k] = AmbeHOCb6[4 * b6 + k - 3];
    for (k = 3; k <= Ji[3]; k++)
        if (k > 6)
            Cik[54 + k] = 0;
        else
            Cik[54 + k] = AmbeHOCb7[4 * b7 + k - 3];
    for (k = 3; k <= Ji[4]; k++)
        if (k > 6)
            Cik[72 + k] = 0;
        else
            Cik[72 + k] = AmbeHOCb8[4 * b8 + k - 3];

    l = 1;
    for (i = 1; i <= 4; i++) {
        ji = Ji[i];
        for (j = 1; j <= ji; j++) {
            sum = 0;
            for (k = 1; k <= ji; k++) {
                if (k === 1)
                    ak = 1;
                else
                    ak = 2;
                sum = sum + ak * Cik[18 * i + k] * Math.cos(M_PI * (k - 1) * (j - 0.5) / ji);
            }
            Tl[l] = sum;
            l++;
        }
    }
    if (cur_mp.L > prev_mp.L)
        for (l = prev_mp.L + 1; l <= cur_mp.L; l++) {
            prev_mp.Ml[l] = prev_mp.Ml[prev_mp.L];
            prev_mp.log2Ml[l] = prev_mp.log2Ml[prev_mp.L];
        }
    prev_mp.log2Ml[0] = prev_mp.log2Ml[1];
    prev_mp.Ml[0] = prev_mp.Ml[1];
    Sum43 = 0;
    for (l = 1; l <= cur_mp.L; l++) {
        flokl[l] = prev_mp.L / cur_mp.L * l;
        intkl[l] = flokl[l] | 0;
        deltal[l] = flokl[l] - intkl[l];
        Sum43 += (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]] + (deltal[l] === 0 ? 0 : deltal[l] * prev_mp.log2Ml[intkl[l] + 1]);
    }
    Sum43 = 0.65 / cur_mp.L * Sum43;
    Sum42 = 0;
    for (l = 1; l <= cur_mp.L; l++)
        Sum42 += Tl[l];
    Sum42 /= cur_mp.L;
    BigGamma = cur_mp.gamma - (0.5 * Math.log(cur_mp.L) / Math.log(2)) - Sum42;
    for (l = 1; l <= cur_mp.L; l++) {
        c1 = 0.65 * (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]];
        c2 = deltal[l] === 0 ? 0 : 0.65 * deltal[l] * prev_mp.log2Ml[intkl[l] + 1];
        cur_mp.log2Ml[l] = Tl[l] + c1 + c2 - Sum43 + BigGamma;
        if (cur_mp.Vl[l] === 1)
            cur_mp.Ml[l] = Math.exp(0.693 * cur_mp.log2Ml[l]);
        else
            cur_mp.Ml[l] = unvc * Math.exp(0.693 * cur_mp.log2Ml[l]);
    }
    return 0;
}

function mbe_demodulateAmbe3600x2450Data(ambe_fr)
{
    let i, j, k;
    let pr = new Uint16Array(115);
    let foo = 0;
    for (i = 23; i >= 12; i--) {
        foo <<= 1;
        foo |= ambe_fr[i];
    }
    pr[0] = 16 * foo;
    for (i = 1; i < 24; i++)
        pr[i] = 173 * pr[i - 1] + 13849 - 65536 * Math.trunc(((173 * pr[i - 1]) + 13849) / 65536);
    for (i = 1; i < 24; i++)
        pr[i] = (pr[i] / 32768) | 0;
    k = 1;
    for (j = 22; j >= 0; j--) {
        ambe_fr[24 + j] ^= pr[k];
        k++;
    }
}

function mbe_processAmbe2450Dataf(aout_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let i, bad;
    err_str = "";
    for (i = 0; i < errs2; i++)
        err_str += "=";
    bad = mbe_decodeAmbe2450Parms(ambe_d, cur_mp, prev_mp);
    if (bad === 2) {
        err_str += "E";
        cur_mp.repeat = 0;
    } else if (bad === 3) {
        err_str += "T";
        cur_mp.repeat = 0;
    } else if (errs2 > 3) {
        mbe_useLastMbeParms(cur_mp, prev_mp);
        cur_mp.repeat++;
        err_str += "R";
    } else
        cur_mp.repeat = 0;
    if (bad === 0) {
        if (cur_mp.repeat <= 3) {
            mbe_moveMbeParms(cur_mp, prev_mp);
            mbe_spectralAmpEnhance(cur_mp);
            mbe_synthesizeSpeechf(aout_buf, cur_mp, prev_mp_enhanced, uvquality);
            mbe_moveMbeParms(cur_mp, prev_mp_enhanced);
        } else {
            err_str += "M";
            mbe_synthesizeSilencef(aout_buf);
            mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced);
        }
    } else {
        mbe_synthesizeSilencef(aout_buf);
        mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced);
    }
    global1 = err_str;
}

function mbe_processAmbe2450Data(aout_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processAmbe2450Dataf(float_buf, errs, errs2, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

function mbe_processAmbe3600x2450Framef(aout_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    global2 = 0;
    global3 = 0;
    global2 = mbe_eccAmbe3600x2450C0(ambe_fr);
    mbe_demodulateAmbe3600x2450Data(ambe_fr);
    global3 = global2;
    global3 += mbe_eccAmbe3600x2450Data(ambe_fr, ambe_d);
    mbe_processAmbe2450Dataf(aout_buf, global2, global3, err_str, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
}

function mbe_processAmbe3600x2450Frame(aout_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processAmbe3600x2450Framef(float_buf, errs, errs2, err_str, ambe_fr, ambe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

const quantstep = new Float32Array([1.2, 0.85, 0.65, 0.40, 0.28, 0.15, 0.08, 0.04, 0.02, 0.01]);

const standdev = new Float32Array([0.307, 0.241, 0.207, 0.190, 0.179, 0.173, 0.165, 0.170, 0.170]);

const B2 = new Float32Array([
                                -2.842205, -2.694235, -2.558260, -2.382850,
                                -2.221042, -2.095574, -1.980845, -1.836058,
                                -1.645556, -1.417658, -1.261301, -1.125631,
                                -0.958207, -0.781591, -0.555837, -0.346976,
                                -0.147249, 0.027755, 0.211495, 0.388380,
                                0.552873, 0.737223, 0.932197, 1.139032,
                                1.320955, 1.483433, 1.648297, 1.801447,
                                1.942731, 2.118613, 2.321486, 2.504443,
                                2.653909, 2.780654, 2.925355, 3.076390,
                                3.220825, 3.402869, 3.585096, 3.784606,
                                3.955521, 4.155636, 4.314009, 4.444150,
                                4.577542, 4.735552, 4.909493, 5.085264,
                                5.254767, 5.411894, 5.568094, 5.738523,
                                5.919215, 6.087701, 6.280685, 6.464201,
                                6.647736, 6.834672, 7.022583, 7.211777,
                                7.471016, 7.738948, 8.124863, 8.695827
                            ]);

const ba = new Float32Array([
                                10, 0.003100, 9, 0.004020, 9, 0.003360, 9, 0.002900, 9, 0.002640,
                                9, 0.006200, 9, 0.004020, 8, 0.006720, 8, 0.005800, 8, 0.005280,
                                8, 0.012400, 8, 0.008040, 8, 0.006720, 7, 0.011600, 7, 0.010560,
                                8, 0.012400, 7, 0.016080, 7, 0.013440, 7, 0.011600, 7, 0.010560,
                                7, 0.024800, 7, 0.016080, 7, 0.013440, 6, 0.021750, 6, 0.019800,
                                7, 0.024800, 6, 0.030150, 6, 0.025200, 6, 0.021750, 6, 0.019800,
                                7, 0.024800, 6, 0.030150, 6, 0.025200, 6, 0.021750, 5, 0.036960,
                                6, 0.046500, 6, 0.030150, 6, 0.025200, 5, 0.040600, 5, 0.036960,
                                6, 0.046500, 6, 0.030150, 5, 0.047040, 5, 0.040600, 5, 0.036960,
                                6, 0.046500, 5, 0.056280, 5, 0.047040, 5, 0.040600, 5, 0.036960,
                                6, 0.046500, 5, 0.056280, 5, 0.047040, 4, 0.058000, 4, 0.052800,
                                6, 0.046500, 5, 0.056280, 5, 0.047040, 4, 0.058000, 4, 0.052800,
                                5, 0.086800, 5, 0.056280, 5, 0.047040, 4, 0.058000, 4, 0.052800,
                                5, 0.086800, 5, 0.056280, 4, 0.067200, 4, 0.058000, 4, 0.052800,
                                5, 0.086800, 4, 0.080400, 4, 0.067200, 4, 0.068000, 4, 0.052800,
                                5, 0.086800, 4, 0.080400, 4, 0.067200, 4, 0.058000, 4, 0.052800,
                                5, 0.086800, 4, 0.080400, 4, 0.067200, 4, 0.058000, 3, 0.085800,
                                5, 0.086800, 4, 0.080400, 4, 0.067200, 3, 0.094250, 3, 0.085800,
                                5, 0.086800, 4, 0.080400, 4, 0.067200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 4, 0.080400, 4, 0.067200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 4, 0.080400, 4, 0.067200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 4, 0.080400, 4, 0.067200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 4, 0.080400, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 4, 0.080400, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 3, 0.085800,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 3, 0.094250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                4, 0.124000, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 3, 0.109200, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 2, 0.142800, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 2, 0.142800, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 2, 0.142800, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 2, 0.142800, 2, 0.123250, 2, 0.112200,
                                3, 0.201500, 3, 0.130650, 2, 0.142800, 2, 0.123250, 2, 0.112200
                            ]);

const hoba = new Float32Array([
                                  9, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  9, 7, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  9, 7, 6, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  8, 7, 6, 5, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  7, 7, 6, 5, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  7, 7, 5, 4, 4, 3, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  6, 7, 5, 4, 4, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  6, 6, 5, 4, 4, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  5, 5, 5, 4, 4, 4, 3, 3, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  5, 4, 5, 5, 4, 3, 3, 3, 3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  5, 4, 5, 4, 4, 3, 3, 3, 3, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  5, 4, 5, 4, 4, 3, 3, 2, 3, 2, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 4, 5, 4, 4, 3, 3, 2, 2, 3, 2, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 4, 4, 4, 4, 3, 2, 3, 2, 2, 3, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 4, 4, 3, 4, 3, 2, 3, 2, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 3, 4, 3, 3, 3, 3, 2, 3, 2, 1, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 3, 4, 3, 3, 3, 3, 2, 3, 2, 1, 2, 2, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 3, 4, 3, 3, 3, 2, 2, 3, 2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 2, 4, 3, 2, 3, 2, 2, 3, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  4, 3, 2, 4, 3, 2, 3, 2, 2, 2, 3, 2, 1, 1, 2, 2, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 3, 2, 4, 3, 2, 2, 3, 2, 2, 2, 3, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 3, 2, 2, 3, 3, 2, 2, 3, 2, 2, 1, 3, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 3, 2, 2, 3, 3, 2, 2, 3, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 3, 2, 2, 3, 3, 2, 2, 3, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 3, 2, 2, 3, 3, 2, 2, 3, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 3, 2, 2, 2, 2, 3, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 3, 2, 2, 2, 1, 3, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 3, 2, 2, 2, 2, 3, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 3, 2, 2, 2, 1, 3, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 3, 2, 2, 2, 1, 3, 2, 1, 1, 1, 2, 2, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 3, 2, 2, 1, 1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 3, 2, 2, 2, 1, 1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 1, 3, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 2, 1, 1, 3, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 3, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 3, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 3, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 1, 1, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 1, 1, 1, 1, 1, 3, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 0, 3, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 0, 3, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0,
                                  3, 2, 2, 1, 1, 1, 1, 0, 3, 2, 2, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0
                              ]);

const bo = new Int32Array([
                              2, 5, 2, 4, 2, 3, 3, 9, 3, 8, 4, 8,	5, 8, 6, 8, 7, 8, 8, 8, 3, 7, 4, 7, 5, 7, 6, 7, 7, 7, 8, 7, 9, 7, 3, 6,
                              4, 6, 5, 6, 6, 6, 7, 6, 8, 6, 9, 6, 10, 6, 3, 5, 4, 5, 5, 5, 6, 5, 7, 5, 8, 5, 9, 5, 10, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 3, 3,
                              1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 3, 1, 4, 1,
                              5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 8, 4, 8, 8, 8,	3, 7, 4, 7, 5, 7, 6, 7, 7, 7, 8, 7, 3, 6, 4, 6, 5, 6, 6, 6, 7, 6, 8, 6,
                              9, 6, 3, 5, 4, 5, 5, 5, 6, 5, 7, 5, 8, 5, 9, 5, 10, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 11, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3,
                              1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 9, 3, 10, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 3, 1, 4, 1, 5, 1, 6, 1,
                              7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 8, 8, 3, 7, 4, 7,	5, 7, 8, 7, 3, 6, 4, 6, 5, 6, 6, 6, 7, 6, 8, 6, 9, 6, 3, 5, 4, 5, 5, 5,
                              6, 5, 7, 5, 8, 5, 9, 5, 10, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 11, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3,
                              1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1,
                              9, 1, 10, 1, 11, 1, 12, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 7, 8, 7, 3, 6,	4, 6, 5, 6, 6, 6, 7, 6, 8, 6, 9, 6, 3, 5, 4, 5, 5, 5, 6, 5, 7, 5, 8, 5,
                              9, 5, 10, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 11, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2,
                              1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1,
                              11, 1, 12, 1, 13, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 6, 4, 6, 5, 6,	8, 6, 9, 6, 3, 5, 4, 5, 5, 5, 6, 5, 7, 5, 8, 5, 9, 5, 10, 5, 3, 4, 4, 4,
                              5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 11, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,
                              1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1,
                              13, 1, 14, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 6, 8, 6, 9, 6,	3, 5, 4, 5, 5, 5, 6, 5, 7, 5, 8, 5, 9, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4,
                              8, 4, 9, 4, 10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 14, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2,
                              1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 13, 2, 14, 2, 15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1,
                              15, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 6, 9, 6, 3, 5,	4, 5, 5, 5, 6, 5, 8, 5, 9, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,
                              10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2,
                              1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1,
                              3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 5, 4, 5, 5, 5,	8, 5, 9, 5, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 3, 3, 4, 3,
                              5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 3, 1, 4, 1,
                              1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 3, 0,
                              4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 5, 4, 5, 3, 4,	4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4, 10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3,
                              8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 13, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1,
                              1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 3, 0, 4, 0,
                              5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 5, 3, 4, 4, 4,	5, 4, 6, 4, 7, 4, 8, 4, 10, 4, 11, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3,
                              9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1,
                              1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 3, 0, 4, 0, 5, 0,
                              6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 5, 3, 4, 4, 4,	5, 4, 8, 4, 10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3,
                              12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 16, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1,
                              1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 3, 0, 4, 0, 5, 0, 6, 0,
                              7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 5, 3, 4, 4, 4,	5, 4, 8, 4, 10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3,
                              12, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 16, 2, 19, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1,
                              1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 19, 1, 20, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0,
                              8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 4, 4, 5, 4,	10, 4, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2,
                              4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 17, 2, 20, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1,
                              1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0,
                              9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 4, 4, 3, 3,	4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3, 10, 3, 11, 3, 12, 3, 3, 2, 4, 2, 5, 2,
                              6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 15, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1,
                              1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 17, 1, 18, 1, 19, 1, 21, 1, 22, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,
                              10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 3, 3, 4, 3,	5, 3, 6, 3, 7, 3, 8, 3, 10, 3, 11, 3, 13, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2,
                              8, 2, 9, 2, 10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1,
                              1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 19, 1, 20, 1, 22, 1, 23, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0,
                              11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 3, 3, 4, 3,	5, 3, 6, 3, 7, 3, 8, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,
                              10, 2, 11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1,
                              1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 21, 1, 23, 1, 24, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0,
                              12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 3, 3, 4, 3,	5, 3, 6, 3, 8, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2,
                              11, 2, 12, 2, 13, 2, 14, 2, 15, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1,
                              1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 23, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0,
                              13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 3, 3, 4, 3,	5, 3, 8, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 10, 2, 11, 2,
                              12, 2, 13, 2, 14, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1, 24, 1, 25, 1,
                              1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0,
                              14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 4, 3, 3, 4, 3,	5, 3, 8, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 11, 2, 12, 2,
                              14, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 21, 1, 22, 1, 25, 1, 26, 1, 3, 0,
                              1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0,
                              15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 4, 3, 5, 3,	8, 3, 11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 11, 2, 12, 2, 14, 2,
                              18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 22, 1, 23, 1, 26, 1, 3, 0, 4, 0, 5, 0,
                              1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0,
                              16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 4, 3, 5, 3,	11, 3, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 11, 2, 12, 2, 15, 2, 19, 2,
                              3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 20, 1, 23, 1, 27, 1, 3, 0, 4, 0, 5, 0, 6, 0,
                              1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0,
                              17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 4, 3, 5, 3,	3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 12, 2, 13, 2, 16, 2, 20, 2, 3, 1,
                              4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1, 24, 1, 28, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0,
                              1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0,
                              18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 4, 3, 3, 2,	4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 12, 2, 13, 2, 16, 2, 3, 1, 4, 1, 5, 1,
                              6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1, 24, 1, 28, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,
                              1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0,
                              19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 4, 3, 3, 2,	4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 12, 2, 13, 2, 16, 2, 3, 1, 4, 1, 5, 1,
                              6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 20, 1, 21, 1, 24, 1, 29, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,
                              1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0,
                              19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 7, 2, 8, 2, 9, 2, 12, 2, 13, 2, 16, 2, 3, 1, 4, 1, 5, 1, 6, 1,
                              7, 1, 8, 1, 9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 20, 1, 21, 1, 25, 1, 30, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0,
                              1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0,
                              21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 7, 2, 8, 2, 12, 2, 16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1,
                              9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 21, 1, 22, 1, 26, 1, 31, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0,
                              21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 7, 2, 8, 2, 12, 2, 17, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1,
                              9, 1, 10, 1, 11, 1, 12, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 22, 1, 23, 1, 27, 1, 32, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0,
                              21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 32, 0, 33, 0, 34, 0, 35, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 7, 2, 8, 2, 13, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1,
                              9, 1, 10, 1, 11, 1, 13, 1, 14, 1, 15, 1, 16, 1, 18, 1, 19, 1, 23, 1, 24, 1, 28, 1, 33, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 33, 0, 34, 0, 35, 0, 36, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 8, 2, 13, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,
                              10, 1, 11, 1, 13, 1, 14, 1, 15, 1, 16, 1, 17, 1, 18, 1, 19, 1, 23, 1, 28, 1, 33, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0,
                              23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 33, 0, 34, 0, 35, 0, 36, 0, 37, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 8, 2, 13, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,
                              10, 1, 11, 1, 13, 1, 14, 1, 15, 1, 16, 1, 18, 1, 19, 1, 23, 1, 28, 1, 34, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0,
                              24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 34, 0, 35, 0, 36, 0, 37, 0, 38, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 8, 2, 13, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,
                              10, 1, 11, 1, 13, 1, 14, 1, 15, 1, 16, 1, 18, 1, 19, 1, 23, 1, 24, 1, 29, 1, 35, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0,
                              23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 35, 0, 36, 0, 37, 0, 38, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 6, 2, 8, 2, 13, 2, 18, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,
                              10, 1, 11, 1, 13, 1, 14, 1, 15, 1, 18, 1, 19, 1, 24, 1, 25, 1, 30, 1, 36, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0,
                              24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 36, 0, 37, 0, 38, 0, 39, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 8, 2, 13, 2, 19, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1,
                              13, 1, 14, 1, 15, 1, 16, 1, 19, 1, 20, 1, 25, 1, 26, 1, 31, 1, 37, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0,
                              25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 37, 0, 38, 0, 39, 0, 40, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1,
                              14, 1, 15, 1, 16, 1, 17, 1, 20, 1, 21, 1, 26, 1, 27, 1, 32, 1, 38, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0,
                              25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 32, 0, 33, 0, 34, 0, 35, 0, 38, 0, 39, 0, 40, 0, 41, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 11, 1,
                              14, 1, 15, 1, 16, 1, 17, 1, 20, 1, 21, 1, 26, 1, 32, 1, 38, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0,
                              26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 32, 0, 33, 0, 34, 0, 35, 0, 38, 0, 39, 0, 40, 0, 41, 0, 42, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 14, 1,
                              15, 1, 16, 1, 17, 1, 20, 1, 21, 1, 26, 1, 32, 1, 39, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0,
                              27, 0, 28, 0, 29, 0, 30, 0, 32, 0, 33, 0, 34, 0, 35, 0, 36, 0, 39, 0, 40, 0, 41, 0, 42, 0, 43, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 3, 3, 2, 4, 2,	5, 2, 8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 14, 1,
                              15, 1, 16, 1, 20, 1, 21, 1, 26, 1, 27, 1, 33, 1, 40, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0,
                              27, 0, 28, 0, 29, 0, 30, 0, 33, 0, 34, 0, 35, 0, 36, 0, 37, 0, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 14, 1, 15, 1,
                              16, 1, 20, 1, 21, 1, 27, 1, 28, 1, 34, 1, 41, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0,
                              28, 0, 29, 0, 30, 0, 31, 0, 34, 0, 35, 0, 36, 0, 37, 0, 38, 0, 41, 0, 42, 0, 43, 0, 44, 0, 45, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 14, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 14, 1, 15, 1,
                              16, 1, 21, 1, 22, 1, 28, 1, 29, 1, 35, 1, 42, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0,
                              28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 35, 0, 36, 0, 37, 0, 38, 0, 39, 0, 42, 0, 43, 0, 44, 0, 45, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 15, 1, 16, 1,
                              17, 1, 22, 1, 23, 1, 29, 1, 30, 1, 36, 1, 43, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0,
                              28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 36, 0, 37, 0, 38, 0, 39, 0, 43, 0, 44, 0, 45, 0, 46, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 15, 1, 16, 1,
                              17, 1, 22, 1, 23, 1, 29, 1, 30, 1, 36, 1, 43, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0,
                              29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 36, 0, 37, 0, 38, 0, 39, 0, 43, 0, 44, 0, 45, 0, 46, 0, 47, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 15, 1, 16, 1,
                              17, 1, 22, 1, 23, 1, 29, 1, 30, 1, 36, 1, 44, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0,
                              29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 36, 0, 37, 0, 38, 0, 39, 0, 40, 0, 44, 0, 45, 0, 46, 0, 47, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 5, 2,	8, 2, 15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 15, 1, 16, 1,
                              22, 1, 23, 1, 29, 1, 30, 1, 37, 1, 45, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 29, 0,
                              30, 0, 31, 0, 32, 0, 33, 0, 37, 0, 38, 0, 39, 0, 40, 0, 41, 0, 45, 0, 46, 0, 47, 0, 48, 0, 49, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 8, 2,	15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 15, 1, 16, 1, 17, 1, 22, 1,
                              23, 1, 30, 1, 31, 1, 38, 1, 46, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 30, 0,
                              31, 0, 32, 0, 33, 0, 34, 0, 38, 0, 39, 0, 40, 0, 41, 0, 42, 0, 46, 0, 47, 0, 48, 0, 49, 0, 50, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 8, 2,	15, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 15, 1, 16, 1, 17, 1, 23, 1,
                              24, 1, 31, 1, 32, 1, 39, 1, 47, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0,
                              31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 39, 0, 40, 0, 41, 0, 42, 0, 43, 0, 47, 0, 48, 0, 49, 0, 50, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 8, 2,	16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 16, 1, 17, 1, 18, 1,
                              24, 1, 25, 1, 32, 1, 33, 1, 40, 1, 48, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 22, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0,
                              32, 0, 33, 0, 34, 0, 35, 0, 36, 0, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 48, 0, 49, 0, 50, 0, 51, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 8, 2,	16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 16, 1, 17, 1, 18, 1,
                              24, 1, 25, 1, 32, 1, 33, 1, 40, 1, 48, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 22, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0,
                              32, 0, 33, 0, 34, 0, 35, 0, 36, 0, 40, 0, 41, 0, 42, 0, 43, 0, 48, 0, 49, 0, 50, 0, 51, 0, 52, 0, 2, 0,
                              2, 5, 2, 4, 2, 3, 3, 2, 4, 2, 8, 2,	16, 2, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1, 10, 1, 16, 1, 17, 1, 18, 1,
                              24, 1, 25, 1, 32, 1, 33, 1, 40, 1, 49, 1, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0,
                              1, 11, 1, 10, 1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1, 1, 0, 2, 2, 2, 1, 22, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0,
                              32, 0, 33, 0, 34, 0, 35, 0, 36, 0, 40, 0, 41, 0, 42, 0, 43, 0, 44, 0, 49, 0, 50, 0, 51, 0, 52, 0, 2, 0
                          ]);

const ImbeJi = new Int32Array([
                                  1, 1, 1, 2, 2, 2,
                                  1, 1, 2, 2, 2, 2,
                                  1, 2, 2, 2, 2, 2,
                                  2, 2, 2, 2, 2, 2,
                                  2, 2, 2, 2, 2, 3,
                                  2, 2, 2, 2, 3, 3,
                                  2, 2, 2, 3, 3, 3,
                                  2, 2, 3, 3, 3, 3,
                                  2, 3, 3, 3, 3, 3,
                                  3, 3, 3, 3, 3, 3,
                                  3, 3, 3, 3, 3, 4,
                                  3, 3, 3, 3, 4, 4,
                                  3, 3, 3, 4, 4, 4,
                                  3, 3, 4, 4, 4, 4,
                                  3, 4, 4, 4, 4, 4,
                                  4, 4, 4, 4, 4, 4,
                                  4, 4, 4, 4, 4, 5,
                                  4, 4, 4, 4, 5, 5,
                                  4, 4, 4, 5, 5, 5,
                                  4, 4, 5, 5, 5, 5,
                                  4, 5, 5, 5, 5, 5,
                                  5, 5, 5, 5, 5, 5,
                                  5, 5, 5, 5, 5, 6,
                                  5, 5, 5, 5, 6, 6,
                                  5, 5, 5, 6, 6, 6,
                                  5, 5, 6, 6, 6, 6,
                                  5, 6, 6, 6, 6, 6,
                                  6, 6, 6, 6, 6, 6,
                                  6, 6, 6, 6, 6, 7,
                                  6, 6, 6, 6, 7, 7,
                                  6, 6, 6, 7, 7, 7,
                                  6, 6, 7, 7, 7, 7,
                                  6, 7, 7, 7, 7, 7,
                                  7, 7, 7, 7, 7, 7,
                                  7, 7, 7, 7, 7, 8,
                                  7, 7, 7, 7, 8, 8,
                                  7, 7, 7, 8, 8, 8,
                                  7, 7, 8, 8, 8, 8,
                                  7, 8, 8, 8, 8, 8,
                                  8, 8, 8, 8, 8, 8,
                                  8, 8, 8, 8, 8, 9,
                                  8, 8, 8, 8, 9, 9,
                                  8, 8, 8, 9, 9, 9,
                                  8, 8, 9, 9, 9, 9,
                                  8, 9, 9, 9, 9, 9,
                                  9, 9, 9, 9, 9, 9,
                                  9, 9, 9, 9, 9, 10,
                                  9, 9, 9, 9, 10, 10
                              ]);

function mbe_dumpImbe4400Data(imbe_d)
{
}

function mbe_dumpImbe7200x4400Data(imbe_d)
{
}

function mbe_dumpImbe7200x4400Frame(imbe_fr)
{
}

function mbe_eccImbe7200x4400C0(imbe_fr)
{
    let j, errs;
    let inn = new Int8Array(23);
    let out = new Int8Array(23);
    for (j = 0; j < 23; j++)
        inn[j] = imbe_fr[j];
    errs = mbe_golay2312(inn, out);
    for (j = 0; j < 23; j++)
        imbe_fr[j] = out[j];
    return errs;
}

function mbe_eccImbe7200x4400Data(imbe_fr, imbe_d)
{
    let i, j, errs = 0;
    let imbe = 0;
    let gin = new Int8Array(23);
    let gout = new Int8Array(23);
    let hin = new Int8Array(15);
    let hout = new Int8Array(15);
    for (i = 0; i < 4; i++)
        if (i > 0) {
            for (j = 0; j < 23; j++)
                gin[j] = imbe_fr[23 * i + j];
            errs += mbe_golay2312(gin, gout);
            for (j = 22; j > 10; j--)
                imbe_d[imbe++] = gout[j];
        } else
            for (j = 22; j > 10; j--)
                imbe_d[imbe++] = imbe_fr[23 * i + j];
    for (i = 4; i < 7; i++) {
        for (j = 0; j < 15; j++)
            hin[j] = imbe_fr[23 * i + j];
        errs += mbe_hamming1511 (hin, hout);
        for (j = 14; j >= 4; j--)
            imbe_d[imbe++] = hout[j];
    }
    for (j = 6; j >= 0; j--)
        imbe_d[imbe++] = imbe_fr[161 + j];
    return errs;
}

function mbe_decodeImbe4400Parms(imbe_d, cur_mp, prev_mp)
{
    let Bm, ji, b, i, j, k, l, L, K, L9, m, am, ak;
    let intkl = new Int32Array(57);
    let b0, b2, bm;
    let Cik = new Float32Array(77);
    let rho;
    let flokl = new Float32Array(57);
    let deltal = new Float32Array(57);
    let Sum77;
    let Tl = new Float32Array(57);
    let Gm = new Float32Array(7);
    let Ri = new Float32Array(7);
    let sum, c1, c2;
    let ba1, ba2;
    let tmpstr = new Int8Array(13);
    let bo1, bo2;
    let bb = new Int8Array(1344);
    cur_mp.repeat = prev_mp.repeat;
    tmpstr[8] = 0;
    tmpstr[0] = imbe_d[0] + 48;
    tmpstr[1] = imbe_d[1] + 48;
    tmpstr[2] = imbe_d[2] + 48;
    tmpstr[3] = imbe_d[3] + 48;
    tmpstr[4] = imbe_d[4] + 48;
    tmpstr[5] = imbe_d[5] + 48;
    tmpstr[6] = imbe_d[85] + 48;
    tmpstr[7] = imbe_d[86] + 48;
    b0 = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, 8)]), 2);
    if (b0 > 207)
        return 1;
    cur_mp.w0 = 4 * M_PI / (b0 + 39.5);
    L = (0.9254 * (M_PI / cur_mp.w0 + 0.25) | 0) | 0;
    if ((L > 56) || (L < 9))
        return 1;
    cur_mp.L = L;
    L9 = L - 9;
    if (L < 37) {
        K = ((L + 2) / 3) | 0;
        cur_mp.K = K;
    } else {
        K = 12;
        cur_mp.K = 12;
    }
    bo1 = 0;
    bo2 = 1;
    for (i = 6; i < 85; i++) {
        bb[12 * bo[158 * L9 + bo1] + bo[158 * L9 + bo2]] = imbe_d[i];
        bo1 += 2;
        bo2 += 2;
    }
    j = 1;
    k = K - 1;
    for (i = 1; i <= L; i++) {
        cur_mp.Vl[i] = bb[12 + k];
        if (j === 3) {
            j = 1;
            if (k > 0)
                k--;
            else
                k = 0;
        } else
            j++;
    }
    tmpstr[6] = 0;
    tmpstr[0] = bb[29] + 48;
    tmpstr[1] = bb[28] + 48;
    tmpstr[2] = bb[27] + 48;
    tmpstr[3] = bb[26] + 48;
    tmpstr[4] = bb[25] + 48;
    tmpstr[5] = bb[24] + 48;
    b2 = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, 6)]), 2);
    Gm[1] = B2[b2];
    ba1 = 0;
    ba2 = 1;
    for (i = 2; i < 7; i++) {
        tmpstr[ba[10 * L9 + ba1] | 0] = 0;
        k = 0;
        for (j = (ba[10 * L9 + ba1] | 0) - 1; j >= 0; j--) {
            tmpstr[k] = bb[12 * (i + 1) + j] + 48;
            k++;
        }
        bm = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, ba[10 * L9 + ba1] | 0)]), 2);
        Gm[i] = ba[10 * L9 + ba2] * (bm - Math.pow(2, ba[10 * L9 + ba1] - 1) + 0.5);
        ba1 += 2;
        ba2 += 2;
    }
    for (i = 1; i <= 6; i++) {
        sum = 0;
        for (m = 1; m <= 6; m++) {
            if (m === 1)
                am = 1;
            else
                am = 2;
            sum += am * Gm[m] * Math.cos(M_PI * (m - 1) * (i - 0.5) / 6);
        }
        Ri[i] = sum;
    }
    m = 8;
    for (i = 1; i <= 6; i++) {
        Cik[11 * i + 1] = Ri[i];
        for (k = 2; k <= ImbeJi[6 * L9 + i - 1]; k++) {
            Bm = hoba[50 * L9 + m - 8];
            for (b = 0; b < Bm; b++)
                tmpstr[b] = bb[12 * m + Bm - b - 1] + 48;
            if (Bm === 0)
                Cik[11 * i + k] = 0;
            else {
                tmpstr[Bm] = 0;
                bm = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, Bm)]), 2);
                Cik[11 * i + k] = quantstep[Bm - 1] * standdev[k - 2] * (bm - Math.pow(2, Bm - 1) + 0.5);
            }
            m++;
        }
    }
    l = 1;
    for (i = 1; i <= 6; i++) {
        ji = ImbeJi[6 * L9 + i - 1];
        for (j = 1; j <= ji; j++) {
            sum = 0;
            for (k = 1; k <= ji; k++) {
                if (k === 1)
                    ak = 1;
                else
                    ak = 2;
                sum += ak * Cik[11 * i + k] * Math.cos(M_PI * (k - 1) * (j - 0.5) / ji);
            }
            Tl[l] = sum;
            l++;
        }
    }
    if (cur_mp.L <= 15)
        rho = 0.4;
    else if (cur_mp.L <= 24)
        rho = 0.03 * cur_mp.L - 0.05;
    else
        rho = 0.7;
    if (cur_mp.L > prev_mp.L)
        for (l = prev_mp.L + 1; l <= cur_mp.L; l++) {
            prev_mp.Ml[l] = prev_mp.Ml[prev_mp.L];
            prev_mp.log2Ml[l] = prev_mp.log2Ml[prev_mp.L];
        }
    Sum77 = 0;
    for (l = 1; l <= cur_mp.L; l++) {
        flokl[l] = (prev_mp.L / cur_mp.L) * l;
        intkl[l] = flokl[l] | 0;
        deltal[l] = flokl[l] - intkl[l];
        Sum77 += (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]] + (deltal[l] === 0 ? 0 : deltal[l] * prev_mp.log2Ml[intkl[l] + 1]);
    }
    Sum77 = (rho / cur_mp.L) * Sum77;
    for (l = 1; l <= cur_mp.L; l++) {
        c1 = rho * (1 - deltal[l]) * prev_mp.log2Ml[intkl[l]];
        c2 = deltal[l] === 0 ? 0 : rho * deltal[l] * prev_mp.log2Ml[intkl[l] + 1];
        cur_mp.log2Ml[l] = Tl[l] + c1 + c2 - Sum77;
        cur_mp.Ml[l] = Math.pow(2, cur_mp.log2Ml[l]);
    }
    return 0;
}

function mbe_demodulateImbe7200x4400Data(imbe_fr)
{
    let i, j, k;
    let pr = new Uint16Array(115);
    let foo;
    let tmpstr = new Int8Array(24);
    j = 0;
    tmpstr[12] = 0;
    for (i = 22; i >= 11; i--) {
        tmpstr[j] = imbe_fr[i] + 48;
        j++;
    }
    foo = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, 12)]), 2);
    pr[0] = 16 * foo;
    for (i = 1; i < 115; i++)
        pr[i] = 173 * pr[i - 1] + 13849 - (65536 * (((173 * pr[i - 1]) + 13849) / 65536));
    for (i = 1; i < 115; i++)
        pr[i] = pr[i] / 32768;
    k = 1;
    for (i = 1; i < 4; i++)
        for (j = 22; j >= 0; j--) {
            imbe_fr[23 * i + j] ^= pr[k];
            k++;
        }
    for (i = 4; i < 7; i++)
        for (j = 14; j >= 0; j--) {
            imbe_fr[23 * i + j] ^= pr[k];
            k++;
        }
}

function mbe_processImbe4400Dataf(aout_buf, errs, errs2, err_str, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{

    let i, bad;
    err_str = "";
    for (i = 0; i < errs2; i++)
        err_str += '=';
    bad = mbe_decodeImbe4400Parms(imbe_d, cur_mp, prev_mp);
    if ((bad === 1) || (errs2 > 5)) {
        mbe_useLastMbeParms(cur_mp, prev_mp);
        cur_mp.repeat++;
        err_str += "R";
    } else
        cur_mp.repeat = 0;
    if (cur_mp.repeat <= 3) {
        mbe_moveMbeParms(cur_mp, prev_mp);
        mbe_spectralAmpEnhance(cur_mp);
        mbe_synthesizeSpeechf(aout_buf, cur_mp, prev_mp_enhanced, uvquality);
        mbe_moveMbeParms(cur_mp, prev_mp_enhanced);
    } else {
        err_str += "M";
        mbe_synthesizeSilencef(aout_buf);
        mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced);
    }
    global1 = err_str;
}

function mbe_processImbe4400Data(aout_buf, errs, errs2, err_str, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processImbe4400Dataf(float_buf, errs, errs2, err_str, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

function mbe_processImbe7200x4400Framef(aout_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    global2 = 0;
    global3 = 0;
    global2 = mbe_eccImbe7200x4400C0(imbe_fr);
    mbe_demodulateImbe7200x4400Data(imbe_fr);
    global3 = global2;
    global3 += mbe_eccImbe7200x4400Data(imbe_fr, imbe_d);
    mbe_processImbe4400Dataf(aout_buf, global2, global3, err_str, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
}

function mbe_processImbe7200x4400Frame(aout_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processImbe7200x4400Framef(float_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

function mbe_dumpImbe7100x4400Data(imbe_d)
{
}

function mbe_dumpImbe7100x4400Frame(imbe_fr)
{
}

function mbe_eccImbe7100x4400C0(imbe_fr)
{
    let j, errs;
    let inn = new Int8Array(23);
    let out = new Int8Array(23);
    for (j = 0; j < 18; j++)
        inn[j] = imbe_fr[j + 1];
    for (j = 18; j < 23; j++)
        inn[j] = 0;
    errs = mbe_golay2312(inn, out);
    for (j = 0; j < 18; j++)
        imbe_fr[j + 1] = out[j];
    return errs;
}

function mbe_eccImbe7100x4400Data(imbe_fr, imbe_d)
{
    let i, j, errs = 0;
    let imbe = 0;
    let gin = new Int8Array(23);
    let gout = new Int8Array(23);
    let hin = new Int8Array(23);
    let hout = new Int8Array(23);
    for (j = 18; j > 11; j--)
        imbe_d[imbe++] = imbe_fr[j];
    for (j = 0; j < 23; j++)
        gin[j] = imbe_fr[24 + j];
    errs = mbe_golay2312(gin, gout);
    for (j = 22; j > 10; j--)
        imbe_d[imbe++] = gout[j];
    for (i = 2; i < 4; i++) {
        for (j = 0; j < 23; j++)
            gin[j] = imbe_fr[23 * i + j];
        errs += mbe_golay2312(gin, gout);
        for (j = 22; j > 10; j--)
            imbe_d[imbe++] = gout[j];
    }
    for (i = 4; i < 6; i++) {
        for (j = 0; j < 15; j++)
            hin[j] = imbe_fr[23 * i + j];
        errs += mbe_7100x4400hamming1511(hin, hout);
        for (j = 14; j >= 4; j--)
            imbe_d[imbe++] = hout[j];
    }
    for (j = 22; j >= 0; j--)
        imbe_d[imbe++] = imbe_fr[138 + j];
    return errs;
}

function mbe_demodulateImbe7100x4400Data(imbe_fr)
{
    let i, j, k;
    let pr = new Uint16Array(115);
    let seed;
    tmpstr = new Int8Array(24);
    j = 0;
    tmpstr[7] = 0;
    for (i = 18; i > 11; i--) {
        tmpstr[j] = imbe_fr[i] + 48;
        j++;
    }
    seed = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, 7)]), 2);
    pr[0] = 16 * seed;
    for (i = 1; i < 101; i++)
        pr[i] = 173 * pr[i - 1] + 13849 - (65536 * (((173 * pr[i - 1]) + 13849) / 65536));
    seed = pr[100];
    for (i = 1; i < 101; i++)
        pr[i] = (pr[i] / 32768) | 0;
    k = 1;
    for (j = 23; j >= 0; j--) {
        imbe_fr[23 + j] ^= pr[k];
        k++;
    }
    for (i = 2; i < 4; i++)
        for (j = 22; j >= 0; j--) {
            imbe_fr[23 * i + j] ^= pr[k];
            k++;
        }
    for (i = 4; i < 6; i++)
        for (j = 14; j >= 0; j--) {
            imbe_fr[23 * i + j] ^= pr[k];
            k++;
        }
}

function mbe_convertImbe7100to7200(imbe_d)
{
    let i, j, k, K, L, b0;
    let tmpstr = new Int8Array(9);
    let tmp_imbe = new Int8Array(88);
    let w0;
    tmpstr[8] = 0;
    tmpstr[0] = imbe_d[1] + 48;
    tmpstr[1] = imbe_d[2] + 48;
    tmpstr[2] = imbe_d[3] + 48;
    tmpstr[3] = imbe_d[4] + 48;
    tmpstr[4] = imbe_d[5] + 48;
    tmpstr[5] = imbe_d[6] + 48;
    tmpstr[6] = imbe_d[86] + 48;
    tmpstr[7] = imbe_d[87] + 48;
    b0 = parseInt(String.fromCharCode.apply(null, [...tmpstr.subarray(0, 8)]), 2);
    w0 = 4 * M_PI / (b0 + 39.5);
    L = (0.9254 * ((M_PI / w0 + 0.25) | 0)) | 0;
    if (L < 37)
        K = ((L + 2) / 3) | 0;
    else
        K = 12;
    tmp_imbe[87] = imbe_d[0];
    tmp_imbe[48 + K] = imbe_d[42];
    tmp_imbe[49 + K] = imbe_d[43];
    k = 44;
    j = 48;
    for (i = 0; i < K; i++) {
        tmp_imbe[j] = imbe_d[k];
        j++;
        k++;
    }
    j = 0;
    k = 1;
    while (j < 87) {
        tmp_imbe[j] = imbe_d[k];
        if (++j === 48)
            j += K + 2;
        if (++k === 42)
            k += K + 2;
    }
    for (i = 0; i < 88; i++)
        imbe_d[i] = tmp_imbe[i];
}

function mbe_processImbe7100x4400Framef(aout_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    global2 = 0;
    global3 = 0;
    global2 = mbe_eccImbe7100x4400C0(imbe_fr);
    mbe_demodulateImbe7100x4400Data(imbe_fr);
    global3 = global2;
    global3 += mbe_eccImbe7100x4400Data(imbe_fr, imbe_d);
    mbe_convertImbe7100to7200(imbe_d);
    mbe_processImbe4400Dataf(aout_buf, global2, global3, err_str, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
}

function mbe_processImbe7100x4400Frame(aout_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_processImbe7100x4400Framef(float_buf, errs, errs2, err_str, imbe_fr, imbe_d, cur_mp, prev_mp, prev_mp_enhanced, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

const Ws= new Float32Array([
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38,
                               0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62, 0.64, 0.66, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.82, 0.84, 0.86, 0.88, 0.9, 0.92, 0.94, 0.96, 0.98,
                               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                               0.98, 0.96, 0.94, 0.92, 0.9, 0.88, 0.86, 0.84, 0.82, 0.8, 0.78, 0.76, 0.74, 0.72, 0.7, 0.68, 0.66, 0.64, 0.62, 0.6, 0.58, 0.56, 0.54, 0.52, 0.5, 0.48, 0.46, 0.44, 0.42, 0.4,
                               0.38, 0.36, 0.34, 0.32, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2, 0.18, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                           ]);

function mbe_rand()
{
    return Math.random();
}

function mbe_rand_phase()
{
    return mbe_rand() * M_2PI - M_PI;
}

function mbe_moveMbeParms(cur_mp, prev_mp)
{
    let l;
    prev_mp.w0 = cur_mp.w0;
    prev_mp.L = cur_mp.L;
    prev_mp.K = cur_mp.K;
    prev_mp.Ml[0] = 0;
    prev_mp.gamma = cur_mp.gamma;
    prev_mp.repeat = cur_mp.repeat;
    for (l = 0; l <= 56; l++) {
        prev_mp.Ml[l] = cur_mp.Ml[l];
        prev_mp.Vl[l] = cur_mp.Vl[l];
        prev_mp.log2Ml[l] = cur_mp.log2Ml[l];
        prev_mp.PHIl[l] = cur_mp.PHIl[l];
        prev_mp.PSIl[l] = cur_mp.PSIl[l];
    }
}

function mbe_useLastMbeParms(cur_mp, prev_mp)
{
    let l;
    cur_mp.w0 = prev_mp.w0;
    cur_mp.L = prev_mp.L;
    cur_mp.K = prev_mp.K;
    cur_mp.Ml[0] = 0;
    cur_mp.gamma = prev_mp.gamma;
    cur_mp.repeat = prev_mp.repeat;
    for (l = 0; l <= 56; l++) {
        cur_mp.Ml[l] = prev_mp.Ml[l];
        cur_mp.Vl[l] = prev_mp.Vl[l];
        cur_mp.log2Ml[l] = prev_mp.log2Ml[l];
        cur_mp.PHIl[l] = prev_mp.PHIl[l];
        cur_mp.PSIl[l] = prev_mp.PSIl[l];
    }
}

function mbe_initMbeParms(cur_mp, prev_mp, prev_mp_enhanced)
{
    let l;
    prev_mp.w0 = 0.09378;
    prev_mp.L = 30;
    prev_mp.K = 10;
    prev_mp.gamma = 0;
    for (l = 0; l <= 56; l++) {
        prev_mp.Ml[l] = 0;
        prev_mp.Vl[l] = 0;
        prev_mp.log2Ml[l] = 0;
        prev_mp.PHIl[l] = 0;
        prev_mp.PSIl[l] = M_PI / 2;
    }
    prev_mp.repeat = 0;
    mbe_moveMbeParms(prev_mp, cur_mp);
    mbe_moveMbeParms(prev_mp, prev_mp_enhanced);
}

function mbe_spectralAmpEnhance(cur_mp)
{
    let Rm0, Rm1, R2m0, R2m1;
    let Wl = new Float32Array(57);
    let l;
    let sum, gamma, M;
    Rm0 = 0;
    Rm1 = 0;
    for (l = 1; l <= cur_mp.L; l++) {
        Rm0 += cur_mp.Ml[l] * cur_mp.Ml[l];
        Rm1 += cur_mp.Ml[l] * cur_mp.Ml[l] * Math.cos(cur_mp.w0 * l);
    }
    R2m0 = Rm0 * Rm0;
    R2m1 = Rm1 * Rm1;
    for (l = 1; l <= cur_mp.L; l++)
        if (cur_mp.Ml[l] !== 0) {
            Wl[l] = Math.sqrt(cur_mp.Ml[l]) * Math.pow((0.96 * M_PI * (R2m0 + R2m1 - 2 * Rm0 * Rm1 * Math.cos(cur_mp.w0 * l))) / (cur_mp.w0 * Rm0 * (R2m0 - R2m1)), 0.25);
            if (8 * l <= cur_mp.L)
            {}
            else if (Wl[l] > 1.2)
                cur_mp.Ml[l] = 1.2 * cur_mp.Ml[l];
            else if (Wl[l] < 0.5)
                cur_mp.Ml[l] = 0.5 * cur_mp.Ml[l];
            else
                cur_mp.Ml[l] = Wl[l] * cur_mp.Ml[l];
        }
    sum = 0;
    for (l = 1; l <= cur_mp.L; l++) {
        M = cur_mp.Ml[l];
        sum += M * M;
    }
    if (sum === 0)
        gamma = 1;
    else
        gamma = Math.sqrt(Rm0 / sum);
    for (l = 1; l <= cur_mp.L; l++)
        cur_mp.Ml[l] = gamma * cur_mp.Ml[l];
}

function mbe_synthesizeSilencef(aout_buf)
{
    let n;
    for (n = 0; n < 160; n++)
        aout_buf[n] = 0;
}

function mbe_synthesizeSilence(aout_buf)
{
    let n;
    for (n = 0; n < 160; n++)
        aout_buf[n] = 0;
}

function mbe_synthesizeSpeechf(aout_buf, cur_mp, prev_mp, uvquality)
{
    let i, l, n, maxl;
    let Ss, loguvquality;
    let C1, C2, C3, C4;
    let deltaphil, deltawl, thetaln, aln;
    let numUv;
    let cw0, pw0, cw0l, pw0l;
    let uvsine, uvrand, uvthreshold, uvthresholdf;
    let uvstep, uvoffset;
    let qfactor;
    let rphase = new Float32Array(64)
    let rphase2 = new Float32Array(64)
    let N = 160;
    uvthresholdf = 2700;
    uvthreshold = uvthresholdf * M_PI / 4000;
    uvsine = 1.3591409 * M_E;
    uvrand = 2;
    if ((uvquality < 1) || (uvquality > 64))
        uvquality = 3;
    if (uvquality === 1)
        loguvquality = 1 / M_E;
    else
        loguvquality = Math.log(uvquality) / uvquality;
    uvstep = 1 / uvquality;
    qfactor = loguvquality;
    uvoffset = uvstep * (uvquality - 1) / 2;
    numUv = 0;
    for (l = 1; l <= cur_mp.L; l++)
        if (cur_mp.Vl[l] === 0)
            numUv++;
    cw0 = cur_mp.w0;
    pw0 = prev_mp.w0;
    Ss = 0;
    for (n = 0; n < N; n++)
        aout_buf[Ss++] = 0;
    if (cur_mp.L > prev_mp.L) {
        maxl = cur_mp.L;
        for (l = prev_mp.L + 1; l <= maxl; l++) {
            prev_mp.Ml[l] = 0;
            prev_mp.Vl[l] = 1;
        }
    } else {
        maxl = prev_mp.L;
        for (l = cur_mp.L + 1; l <= maxl; l++) {
            cur_mp.Ml[l] = 0;
            cur_mp.Vl[l] = 1;
        }
    }
    for (l = 1; l <= 56; l++) {
        cur_mp.PSIl[l] = prev_mp.PSIl[l] + (pw0 + cw0) * l * N / 2;
        if (l <= ((cur_mp.L / 4) | 0))
            cur_mp.PHIl[l] = cur_mp.PSIl[l];
        else
            cur_mp.PHIl[l] = cur_mp.PSIl[l] + numUv * mbe_rand_phase() / cur_mp.L;
    }
    for (l = 1; l <= maxl; l++) {
        cw0l = cw0 * l;
        pw0l = pw0 * l;
        if ((cur_mp.Vl[l] === 0) && (prev_mp.Vl[l] === 1)) {
            Ss = 0;
            for (i = 0; i < uvquality; i++)
                rphase[i] = mbe_rand_phase();
            for (n = 0; n < N; n++) {
                C1 = Ws[n + N] * prev_mp.Ml[l] * Math.cos(pw0l * n + prev_mp.PHIl[l]);
                C3 = 0;
                for (i = 0; i < uvquality; i++) {
                    C3 += Math.cos(cw0 * n * (l + i * uvstep - uvoffset) + rphase[i]);
                    if (cw0l > uvthreshold)
                        C3 += (cw0l - uvthreshold) * uvrand * mbe_rand();
                }
                C3 *= uvsine * Ws[n] * cur_mp.Ml[l] * qfactor;
                aout_buf[Ss++] += C1 + C3;
            }
        } else if ((cur_mp.Vl[l] === 1) && (prev_mp.Vl[l] === 0)) {
            Ss = 0;
            for (i = 0; i < uvquality; i++)
                rphase[i] = mbe_rand_phase();
            for (n = 0; n < N; n++) {
                C1 = Ws[n] * cur_mp.Ml[l] * Math.cos(cw0l * (n - N) + cur_mp.PHIl[l]);
                C3 = 0;
                for (i = 0; i < uvquality; i++) {
                    C3 += Math.cos(pw0 * n * (l + i * uvstep - uvoffset) + rphase[i]);
                    if (pw0l > uvthreshold)
                        C3 += (pw0l - uvthreshold) * uvrand * mbe_rand();
                }
                C3 *= uvsine * Ws[n + N] * prev_mp.Ml[l] * qfactor;
                aout_buf[Ss++] += C1 + C3;
            }
        } else if ((cur_mp.Vl[l] === 1) || (prev_mp.Vl[l] === 1)) {
            Ss = 0;
            for (n = 0; n < N; n++) {
                C1 = Ws[n + N] * prev_mp.Ml[l] * Math.cos(pw0l * n + prev_mp.PHIl[l]);
                C2 = Ws[n] * cur_mp.Ml[l] * Math.cos(cw0l * (n - N) + cur_mp.PHIl[l]);
                aout_buf[Ss++] += C1 + C2;
            }
        } else {
            Ss = 0;
            for (i = 0; i < uvquality; i++)
                rphase[i] = mbe_rand_phase();
            for (i = 0; i < uvquality; i++)
                rphase2[i] = mbe_rand_phase();
            for (n = 0; n < N; n++) {
                C3 = 0;
                for (i = 0; i < uvquality; i++) {
                    C3 += Math.cos((pw0 * n * (l + i * uvstep - uvoffset)) + rphase[i]);
                    if (pw0l > uvthreshold)
                        C3 += (pw0l - uvthreshold) * uvrand * mbe_rand();
                }
                C3 *= uvsine * Ws[n + N] * prev_mp.Ml[l] * qfactor;
                C4 = 0;
                for (i = 0; i < uvquality; i++) {
                    C4 += Math.cos((cw0 * n * (l + i * uvstep - uvoffset)) + rphase2[i]);
                    if (cw0l > uvthreshold)
                        C4 += (cw0l - uvthreshold) * uvrand * mbe_rand();
                }
                C4 *= uvsine * Ws[n] * cur_mp.Ml[l] * qfactor;
                aout_buf[Ss++] += C3 + C4;
            }
        }
    }
}

function mbe_synthesizeSpeech(aout_buf, cur_mp, prev_mp, uvquality)
{
    let float_buf = new Float32Array(160);
    mbe_synthesizeSpeechf(float_buf, cur_mp, prev_mp, uvquality);
    mbe_floattoshort(float_buf, aout_buf);
}

function mbe_floattoshort(float_buf, aout_buf)
{
    let i, again;
    let audio;
    again = 7;
    for (i = 0; i < 160; i++) {
        audio = again * float_buf[i];
        if (audio > 32760)
            audio = 32760;
        else if (audio < -32760)
            audio = -32760;
        aout_buf[i] = audio | 0;
    }
}


//============================================= DSDcc wrapper


let dsd = {
    dsdcc: null,
    rate: 0,
    buffer: new Int16Array(),
    dvbuffer: new Uint8Array(),
    dvname: "",
    dsp: -1,
    serialdv: -1,
    slot: -1,
    bits: 0,
    bytes: 0,
    box: null,
}


export function create(serialdevice, box)
{
    dsd.dsdcc = new DSDDecoder();
    dsd.dsdcc.setQuiet();
    dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeAuto, true);
    dsd.dsdcc.setAudioGain(0);
    dsd.slot = 1;
    dsd.dsp = box.DSP_create();
    dsd.box = box;

    dsd.serialdv = box.serialPort_open(serialdevice, "460800,N,8,1,NO");
    if (dsd.serialdv === -1)
        dsd.dsdcc.enableMbelib(true);
    else {
        dsd.dsdcc.enableMbelib(false);
        box.serialPort_Data.connect(serialDV_data);
        box.serialPort_write(dsd.serialdv, new Uint8Array([0x61, 0x00, 0x01, 0x00, 0x30]).buffer); // PRODUCT ID
    }
}


export function release()
{
    dsd.box.serialPort_close(dsd.serialdv);
    dsd.box.serialPort_Data.disconnect(serialDV_data);
    dsd.box.DSP_release(dsd.dsp);
}


export function modes()
{
    let ret = [];

    ret.push("Auto");
    ret.push("None");
    ret.push("DMR");
    ret.push("DPMR");
    ret.push("DStar");
    ret.push("NXDN48");
    ret.push("NXDN96");
    ret.push("P25P1");
    ret.push("ProVoice");
    ret.push("X2TDMA");
    ret.push("YSF");

    return ret;
}


export function dataRates()
{
    let ret = [];

    ret.push("2400");
    ret.push("4800");
    ret.push("9600");

    return ret;
}


export function device()
{
    if (dsd.serialdv > -1)
        return dsd.dvname;
    else
        return "LIBMBE";
}


export function syncType()
{
    return dsd.dsdcc.getFrameTypeText() + " " + dsd.dsdcc.getFrameSubtypeText();
}


export function busy()
{
    return dsd.dsdcc.getSymbolPLLLocked();
}


export function inputLevel()
{
    return dsd.dsdcc.getInLevel();
}


export function feed(input, samplerate)
{
    input = dsd.box.floatToBytes(input, 16);

    let rinput;
    if (samplerate === 48000)
        rinput = new Int16Array(dsd.box.viewToBytes(input));
    else
        rinput = new Int16Array(dsd.box.viewToBytes(dsd.box.DSP_resample(dsd.dsp, input, dsd.box.viewSize(input) * 48000 / samplerate)));

    let s1, s2;
    let n1, n2;
    let chunk = 8000 / dsd.box.param("system.refreshrate");

    if (dsd.serialdv > -1)
        chunk *= 2;

    if (dsd.serialdv > -1)
        serialDV_setRate();

    for (let i = 0; i < rinput.length; i++) {
        dsd.dsdcc.run(rinput[i]);

        if (dsd.serialdv > -1) {
            if (dsd.dsdcc.mbeDVReady1()) {
                serialDV_write(dsd.dsdcc.getMbeDVFrame1(), dsd.bytes);
                dsd.dsdcc.resetMbeDV1();
            }

            if (dsd.dsdcc.mbeDVReady2()) {
                serialDV_write(dsd.dsdcc.getMbeDVFrame2(), dsd.bytes);
                dsd.dsdcc.resetMbeDV2();
            }
        } else {
            n1 = 0;
            n2 = 0;

            if (dsd.slot & 1) {
                s1 = dsd.dsdcc.getAudio1(n1);
                n1 = global1;
            }

            if (dsd.slot & 2) {
                s2 = dsd.dsdcc.getAudio2(n2);
                n2 = global1;
            }

            if (n1 !== 0 || n2 !== 0) {
                if (n1 > 0 && n2 > 0) {
                    let m;
                    let n = Math.min(n1, n2);
                    for (let i = 0; i < n; i++)
                        s1[i] = (s1[i] + s2[i]) / 2;
                    dsd.buffer = concatArray16(dsd.buffer, s1, n);
                    dsd.dsdcc.resetAudio1();
                    dsd.dsdcc.resetAudio2();
                } else if (n1 > 0) {
                    dsd.buffer = concatArray16(dsd.buffer, s1, n1);
                    dsd.dsdcc.resetAudio1();
                } else if (n2 > 0) {
                    dsd.buffer = concatArray16(dsd.buffer, s2, n2);
                    dsd.dsdcc.resetAudio2();
                }
            }
        }
    }

    while (dsd.buffer.length >= chunk) {
        if (dsd.dsdcc.getSymbolPLLLocked())
            processAudio(dsd.box.bytesToFloat(dsd.box.viewFromBytes(dsd.buffer.slice(0, chunk).buffer), 16));
        dsd.buffer = dsd.buffer.slice(chunk);
    }

    let text;
    dsd.dsdcc.formatStatusText(text);
    text = global1;
    if (text.substring(15) !== dsd.text) {
        dsd.text = text.substring(15);
        if (dsd.dsdcc.getSymbolPLLLocked())
            processText(text);
    }
}


export function setDataRate(rate)
{
    if (rate === 2400)
        dsd.dsdcc.setDataRate(DSDDecoder.DSDRate2400);
    else if (rate === 9600)
        dsd.dsdcc.setDataRate(DSDDecoder.DSDRate9600);
    else
        dsd.dsdcc.setDataRate(DSDDecoder.DSDRate4800);

    dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeAuto, true);
}


export function setDMRKey(key)
{
    dsd.dsdcc.setDMRBasicPrivacyKey(key);
}


export function setMode(mode)
{
    if (mode === "Auto")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeAuto, true);
    else if (mode === "None")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeNone, true);
    else if (mode === "DMR")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeDMR, true);
    else if (mode === "DPMR")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeDPMR, true);
    else if (mode === "DStar")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeDStar, true);
    else if (mode === "NXDN48")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeNXDN48, true);
    else if (mode === "NXDN96")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeNXDN96, true);
    else if (mode === "P25P1")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeP25P1, true);
    else if (mode === "ProVoice")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeProVoice, true);
    else if (mode === "X2TDMA")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeX2TDMA, true);
    else if (mode === "YSF")
        dsd.dsdcc.setDecodeMode(DSDDecoder.DSDDecodeYSF, true);
}


export function setPLLLock(pll)
{
    dsd.dsdcc.setSymbolPLLLock(pll);
}


export function setSlot(slot)
{
    dsd.slot = slot;
}


export function setSpeechQuality(quality)
{
    dsd.dsdcc.setUvQuality(quality);
}


export function useHighPassFilter(val)
{
    dsd.dsdcc.useHPMbelib(val);
}


export function useMatchedFilter(val)
{
    dsd.dsdcc.enableCosineFiltering(val);
}


export function serialDV_setRate()
{
    let rate = dsd.dsdcc.getMbeRate();
    if (rate !== dsd.rate) {
        dsd.rate = rate;
        let srate;
        switch (rate) {
        case DSDDecoder.DSDMBERate3600x2400:
            srate = new Uint8Array([0x61, 0x00, 0x0d, 0x00, 0x0a, 0x01, 0x30, 0x07, 0x63, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x48]);
            dsd.bits = 72;
            dsd.bytes = 9;
            break;
        case DSDDecoder.DSDMBERate3600x2450:
            srate = new Uint8Array([0x61, 0x00, 0x0d, 0x00, 0x0a, 0x04, 0x31, 0x07, 0x54, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x6f, 0x48]);
            dsd.bits = 72;
            dsd.bytes = 9;
            break;
        case DSDDecoder.DSDMBERate7200x4400:
            srate = new Uint8Array([0x61, 0x00, 0x0d, 0x00, 0x0a, 0x04, 0x58, 0x09, 0x86, 0x80, 0x20, 0x00, 0x00, 0x00, 0x00, 0x73, 0x90]);
            dsd.bits = 144;
            dsd.bytes = 18;
            break;
        case DSDDecoder.DSDMBERate2450:
            srate = new Uint8Array([0x61, 0x00, 0x0d, 0x00, 0x0a, 0x04, 0x31, 0x07, 0x54, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x31]);
            dsd.bits = 49;
            dsd.bytes = 7;
            break;
        case DSDDecoder.DSDMBERate4400:
            srate = new Uint8Array([0x61, 0x00, 0x0d, 0x00, 0x0a, 0x04, 0x58, 0x09, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x44, 0x58]);
            dsd.bits = 88;
            dsd.bytes = 11;
            break;
        default:
            return;
        }

        dsd.box.serialPort_write(dsd.serialdv, srate.buffer);
    }
}


export function setGain(gain)
{
    dsd.box.serialPort_write(dsd.serialdv, new Uint8Array([0x61, 0x00, 0x03, 0x00, 0x4b, 0x00, gain]).buffer);
}


export function serialDV_write(data)
{
    let len = dsd.bytes + 2;
    let frame = new Uint8Array(6 + data.byteLength);

    frame[0] = 0x61;
    frame[1] = (len >> 8) & 0xff;
    frame[2] = len & 0xff;
    frame[3] = 0x01;
    frame[4] = 0x01;
    frame[5] = dsd.bits;
    frame.set(data, 6);

    dsd.box.serialPort_write(dsd.serialdv, frame.buffer);
}


export function serialDV_data(id, data)
{
    if (id !== dsd.serialdv)
        return;

    dsd.dvbuffer = concatArray8(dsd.dvbuffer, new Uint8Array(data));

    while (true) {
        let n = dsd.dvbuffer.indexOf(0x61);

        if (n < 0) {
            dsd.dvbuffer = new Uint8Array();
            return;
        } else if (n > 0)
            dsd.dvbuffer = dsd.dvbuffer.slice(n);

        if (dsd.dvbuffer.length < 5)
            return;

        let len = (dsd.dvbuffer[1] << 8) + dsd.dvbuffer[2] + 4;

        if (dsd.dvbuffer.length < len)
            return;

        if (dsd.dvbuffer[3] === 0x00) {
            if (dsd.dvbuffer[4] === 0x30) {
                dsd.dvname = String.fromCharCode.apply(null, [...dsd.dvbuffer.subarray(5, len - 1)]);
            }
        } else {
            let tmp;
            for (let i = 6; i < len; i += 2) {
                tmp = dsd.dvbuffer[i];
                dsd.dvbuffer[i] = dsd.dvbuffer[i + 1];
                dsd.dvbuffer[i + 1] = tmp;
            }
            dsd.buffer = concatArray8(dsd.buffer, dsd.dvbuffer.slice(6, len));
        }

        dsd.dvbuffer = dsd.dvbuffer.slice(len);
    }
}


function concatArray8(a, b, n = 0)
{
    if (a.length === 0) {
        if (n === 0)
            return b;
        else
            return b.slice(0, n);
    }

    let res;
    if (n === 0) {
        res = new Uint8Array(a.length + b.length);
        res.set(a, 0);
        res.set(b, a.length);
    } else {
        res = new Uint8Array(a.length + n);
        res.set(a, 0);
        res.set(b.slice(0, n), a.length);
    }
    return res;
}


function concatArray16(a, b, n = 0)
{
    if (a.length === 0) {
        if (n === 0)
            return b;
        else
            return b.slice(0, n);
    }

    let res;
    if (n === 0) {
        res = new Int16Array(a.length + b.length);
        res.set(a, 0);
        res.set(b, a.length);
    } else {
        res = new Int16Array(a.length + n);
        res.set(a, 0);
        res.set(b.slice(0, n), a.length);
    }
    return res;
}
