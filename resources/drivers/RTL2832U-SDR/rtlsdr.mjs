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

//========================================= RTLSDR
// Based on https://github.com/librtlsdr/librtlsdr


let global1, global2, global3;

export const RTLSDR_TUNER_UNKNOWN = 0;
export const RTLSDR_TUNER_E4000 = 1;
export const RTLSDR_TUNER_FC0012 = 2;
export const RTLSDR_TUNER_FC0013 = 3;
export const RTLSDR_TUNER_FC2580 = 4;
export const RTLSDR_TUNER_R820T = 5;
export const RTLSDR_TUNER_R828D = 6;
const RTLSDR_DS_IQ = 0;
const RTLSDR_DS_I = 1;
const RTLSDR_DS_Q = 2;
const RTLSDR_DS_I_BELOW = 3;
const RTLSDR_DS_Q_BELOW = 4;
const E4K_I2C_ADDR = 0xc8
const E4K_CHECK_ADDR = 0x02
const E4K_CHECK_VAL = 0x40
const E4K_REG_MASTER1 = 0x00;
const E4K_REG_MASTER2 = 0x01;
const E4K_REG_MASTER3 = 0x02;
const E4K_REG_MASTER4 = 0x03;
const E4K_REG_MASTER5 = 0x04;
const E4K_REG_CLK_INP = 0x05;
const E4K_REG_REF_CLK = 0x06;
const E4K_REG_SYNTH1 = 0x07;
const E4K_REG_SYNTH2 = 0x08;
const E4K_REG_SYNTH3 = 0x09;
const E4K_REG_SYNTH4 = 0x0a;
const E4K_REG_SYNTH5 = 0x0b;
const E4K_REG_SYNTH6 = 0x0c;
const E4K_REG_SYNTH7 = 0x0d;
const E4K_REG_SYNTH8 = 0x0e;
const E4K_REG_SYNTH9 = 0x0f;
const E4K_REG_FILT1	= 0x10;
const E4K_REG_FILT2	= 0x11;
const E4K_REG_FILT3	= 0x12;
const E4K_REG_GAIN1	= 0x14;
const E4K_REG_GAIN2	= 0x15;
const E4K_REG_GAIN3	= 0x16;
const E4K_REG_GAIN4	= 0x17;
const E4K_REG_AGC1 = 0x1a;
const E4K_REG_AGC2 = 0x1b;
const E4K_REG_AGC3 = 0x1c;
const E4K_REG_AGC4 = 0x1d;
const E4K_REG_AGC5 = 0x1e;
const E4K_REG_AGC6 = 0x1f;
const E4K_REG_AGC7 = 0x20;
const E4K_REG_AGC8 = 0x21;
const E4K_REG_AGC11 = 0x24;
const E4K_REG_AGC12 = 0x25;
const E4K_REG_DC1 = 0x29;
const E4K_REG_DC2 = 0x2a;
const E4K_REG_DC3 = 0x2b;
const E4K_REG_DC4 = 0x2c;
const E4K_REG_DC5 = 0x2d;
const E4K_REG_DC6 = 0x2e;
const E4K_REG_DC7 = 0x2f;
const E4K_REG_DC8 = 0x30;
const E4K_REG_QLUT0 = 0x50;
const E4K_REG_QLUT1	= 0x51;
const E4K_REG_QLUT2	= 0x52;
const E4K_REG_QLUT3	= 0x53;
const E4K_REG_ILUT0	= 0x60;
const E4K_REG_ILUT1	= 0x61;
const E4K_REG_ILUT2	= 0x62;
const E4K_REG_ILUT3	= 0x63;
const E4K_REG_DCTIME1 = 0x70;
const E4K_REG_DCTIME2 = 0x71;
const E4K_REG_DCTIME3 = 0x72;
const E4K_REG_DCTIME4 = 0x73;
const E4K_REG_PWM1 = 0x74;
const E4K_REG_PWM2 = 0x75;
const E4K_REG_PWM3 = 0x76;
const E4K_REG_PWM4 = 0x77;
const E4K_REG_BIAS = 0x78;
const E4K_REG_CLKOUT_PWDN = 0x7a;
const E4K_REG_CHFILT_CALIB = 0x7b;
const E4K_REG_I2C_REG_ADDR = 0x7d;
const E4K_MASTER1_RESET	= 0x01;
const E4K_MASTER1_NORM_STBY	= 0x02;
const E4K_MASTER1_POR_DET = 0x04;
const E4K_SYNTH1_PLL_LOCK = 0x01;
const E4K_SYNTH1_BAND_SHIF = 0x01;
const E4K_SYNTH7_3PHASE_EN = 0x08;
const E4K_SYNTH8_VCOCAL_UPD = 0x04;
const E4K_FILT3_DISABLE	= 0x20;
const E4K_AGC1_LIN_MODE = 0x10;
const E4K_AGC1_LNA_UPDATE = 0x20;
const E4K_AGC1_LNA_G_LOW = 0x40;
const E4K_AGC1_LNA_G_HIGH = 0x80;
const E4K_AGC6_LNA_CAL_REQ = 0x10;
const E4K_AGC7_MIX_GAIN_AUTO = 0x01;
const E4K_AGC7_GAIN_STEP_5dB = 0x20;
const E4K_AGC8_SENS_LIN_AUTO = 0x01;
const E4K_AGC11_LNA_GAIN_ENH = 0x01;
const E4K_DC1_CAL_REQ = 0x01;
const E4K_DC5_I_LUT_EN = 0x01;
const E4K_DC5_Q_LUT_EN = 0x02;
const E4K_DC5_RANGE_DET_EN = 0x04;
const E4K_DC5_RANGE_EN = 0x08;
const E4K_DC5_TIMEVAR_EN = 0x10;
const E4K_CLKOUT_DISABLE = 0x96;
const E4K_CHFCALIB_CMD = 0x01;
const E4K_AGC1_MOD_MASK = 0x0f;
const E4K_AGC_MOD_SERIAL = 0x0;
const E4K_AGC_MOD_IF_PWM_LNA_SERIAL	= 0x1;
const E4K_AGC_MOD_IF_PWM_LNA_AUTONL	= 0x2;
const E4K_AGC_MOD_IF_PWM_LNA_SUPERV	= 0x3;
const E4K_AGC_MOD_IF_SERIAL_LNA_PWM	= 0x4;
const E4K_AGC_MOD_IF_PWM_LNA_PWM = 0x5;
const E4K_AGC_MOD_IF_DIG_LNA_SERIAL	= 0x6;
const E4K_AGC_MOD_IF_DIG_LNA_AUTON	= 0x7;
const E4K_AGC_MOD_IF_DIG_LNA_SUPERV	= 0x8;
const E4K_AGC_MOD_IF_SERIAL_LNA_AUTON = 0x9;
const E4K_AGC_MOD_IF_SERIAL_LNA_SUPERV = 0xa;
const E4K_BAND_VHF2	= 0;
const E4K_BAND_VHF3	= 1;
const E4K_BAND_UHF	= 2;
const E4K_BAND_L = 3;
const E4K_F_MIX_BW_27M = 0;
const E4K_F_MIX_BW_4M6 = 8;
const E4K_F_MIX_BW_4M2 = 9;
const E4K_F_MIX_BW_3M8 = 10;
const E4K_F_MIX_BW_3M4 = 11;
const E4K_F_MIX_BW_3M = 12;
const E4K_F_MIX_BW_2M7 = 13;
const E4K_F_MIX_BW_2M3 = 14;
const E4K_F_MIX_BW_1M9 = 15;
const E4K_IF_FILTER_MIX = 0;
const E4K_IF_FILTER_CHAN = 1;
const E4K_IF_FILTER_RC = 2;


function TWO_POW(n)
{
    return 1 << n;
}


function e4k_pll_params()
{
    this.fosc = 0;
    this.intended_flo = 0;
    this.flo = 0;
    this.x = 0;
    this.z = 0;
    this.r = 0;
    this.r_idx = 0;
    this.threephase = 0;
}


function e4k_state()
{
    this.i2c_dev = null;
    this.i2c_addr = 0;
    this.band = 0;
    this.vco = new e4k_pll_params();
    this.rtl_dev = null;
}


const EINVAL = 22;


function strbuf()
{
    this.idx = 0;
    this.buf = new Int8Array(32);
}


function cmd_state()
{
    this.cmd = new strbuf();
    this.arg = new strbuf();
    this.state = 0;
    this.out = null;
}


function cmd()
{
    this.cmd = null;
    this.ops = 0;
    this.cb = null;
    this.help = null;
}


function reg_field(reg, shift, width)
{
    this.reg = reg;
    this.shift = shift;
    this.width = width;
}


function reg_field_ops()
{
    this.fields = null;
    this.field_names = null;
    this.num_fields = 0;
    this.data = 0;
    this.write_cb= null;
    this.read_cb = null;
}


function ARRAY_SIZE(arr)
{
    return arr.length;
}


function MHZ(x)
{
    return 1000000 * x;
}


function KHZ(x)
{
    return 1000 * x;
}


function unsigned_delta(a, b)
{
    if (a > b)
        return a - b;
    else
        return b - a;
}


const width2mask = new Uint8Array([0x00, 0x01, 0x03, 0x07, 0x0f, 0x1f, 0x3f, 0x7f, 0xff]);


function e4k_reg_write(e4k, reg, val)
{
    let data = new Uint8Array([reg, val]);
    let r = rtlsdr_i2c_write_fn(e4k.rtl_dev, e4k.i2c_addr, data, 2);
    return r === 2 ? 0 : -1;
}


function e4k_reg_read(e4k, reg)
{
    let data = new Uint8Array([reg]);
    if (rtlsdr_i2c_write_fn(e4k.rtl_dev, e4k.i2c_addr, data, 1) < 1)
        return -1;
    if (rtlsdr_i2c_read_fn(e4k.rtl_dev, e4k.i2c_addr, data, 1) < 1)
        return -1;
    return data;
}


function e4k_reg_set_mask(e4k, reg, mask, val)
{
    let tmp = e4k_reg_read(e4k, reg);
    if ((tmp & mask) === val)
        return 0;
    return e4k_reg_write(e4k, reg, (tmp & ~mask) | (val & mask));
}


function e4k_field_write(e4k, field, val)
{
    let rc;
    let mask;
    rc = e4k_reg_read(e4k, field.reg);
    if (rc < 0)
        return rc;
    mask = width2mask[field.width] << field.shift;
    return e4k_reg_set_mask(e4k, field.reg, mask, val << field.shift);
}


function e4k_field_read(e4k, field)
{
    let rc = e4k_reg_read(e4k, field.reg);
    if (rc < 0)
        return rc;
    rc = (rc >> field.shift) & width2mask[field.width];
    return rc;
}


const rf_filt_center_uhf = new Uint32Array([
                                               MHZ(360), MHZ(380), MHZ(405), MHZ(425),
                                               MHZ(450), MHZ(475), MHZ(505), MHZ(540),
                                               MHZ(575), MHZ(615), MHZ(670), MHZ(720),
                                               MHZ(760), MHZ(840), MHZ(890), MHZ(970)
                                           ]);

const rf_filt_center_l = new Uint32Array([
                                             MHZ(1300), MHZ(1320), MHZ(1360), MHZ(1410),
                                             MHZ(1445), MHZ(1460), MHZ(1490), MHZ(1530),
                                             MHZ(1560), MHZ(1590), MHZ(1640), MHZ(1660),
                                             MHZ(1680), MHZ(1700), MHZ(1720), MHZ(1750)
                                         ]);


function closest_arr_idx(arr, arr_size, freq)
{
    let i, bi = 0;
    let best_delta = 0xffffffff;
    let delta;
    for (i = 0; i < arr_size; i++) {
        delta = unsigned_delta(freq, arr[i]);
        if (delta < best_delta) {
            best_delta = delta;
            bi = i;
        }
    }
    return bi;
}


function choose_rf_filter(band, freq)
{
    let rc;
    switch (band) {
    case E4K_BAND_VHF2:
    case E4K_BAND_VHF3:
        rc = 0;
        break;
    case E4K_BAND_UHF:
        rc = closest_arr_idx(rf_filt_center_uhf, ARRAY_SIZE(rf_filt_center_uhf), freq);
        break;
    case E4K_BAND_L:
        rc = closest_arr_idx(rf_filt_center_l, ARRAY_SIZE(rf_filt_center_l), freq);
        break;
    default:
        rc = -EINVAL;
        break;
    }
    return rc;
}


function e4k_rf_filter_set(e4k)
{
    let rc = choose_rf_filter(e4k.band, e4k.vco.flo);
    if (rc < 0)
        return rc;
    return e4k_reg_set_mask(e4k, E4K_REG_FILT1, 0x0f, rc);
}


const mix_filter_bw = new Uint32Array([
                                          KHZ(27000), KHZ(27000), KHZ(27000), KHZ(27000),
                                          KHZ(27000), KHZ(27000), KHZ(27000), KHZ(27000),
                                          KHZ(4600), KHZ(4200), KHZ(3800), KHZ(3400),
                                          KHZ(3300), KHZ(2700), KHZ(2300), KHZ(1900)
                                      ]);

const ifrc_filter_bw = new Uint32Array([
                                           KHZ(21400), KHZ(21000), KHZ(17600), KHZ(14700),
                                           KHZ(12400), KHZ(10600), KHZ(9000), KHZ(7700),
                                           KHZ(6400), KHZ(5300), KHZ(4400), KHZ(3400),
                                           KHZ(2600), KHZ(1800), KHZ(1200), KHZ(1000)
                                       ]);

const ifch_filter_bw = new Uint32Array([
                                           KHZ(5500), KHZ(5300), KHZ(5000), KHZ(4800),
                                           KHZ(4600), KHZ(4400), KHZ(4300), KHZ(4100),
                                           KHZ(3900), KHZ(3800), KHZ(3700), KHZ(3600),
                                           KHZ(3400), KHZ(3300), KHZ(3200), KHZ(3100),
                                           KHZ(3000), KHZ(2950), KHZ(2900), KHZ(2800),
                                           KHZ(2750), KHZ(2700), KHZ(2600), KHZ(2550),
                                           KHZ(2500), KHZ(2450), KHZ(2400), KHZ(2300),
                                           KHZ(2280), KHZ(2240), KHZ(2200), KHZ(2150)
                                       ]);

const if_filter_bw = [mix_filter_bw, ifch_filter_bw, ifrc_filter_bw];
const if_filter_bw_len = [ARRAY_SIZE(mix_filter_bw), ARRAY_SIZE(ifch_filter_bw), ARRAY_SIZE(ifrc_filter_bw)];

const if_filter_fields = [
                           new reg_field(E4K_REG_FILT2, 4, 4),
                           new reg_field(E4K_REG_FILT3, 0, 5),
                           new reg_field(E4K_REG_FILT2, 0, 4)
                       ];


function find_if_bw(filter, bw)
{
    if (filter >= ARRAY_SIZE(if_filter_bw))
        return -EINVAL;
    return closest_arr_idx(if_filter_bw[filter], if_filter_bw_len[filter], bw);
}


function e4k_if_filter_bw_set(e4k, filter, bandwidth)
{
    if (filter >= ARRAY_SIZE(if_filter_bw))
        return -EINVAL;
    let bw_idx = find_if_bw(filter, bandwidth);
    let field = if_filter_fields[filter];
    return e4k_field_write(e4k, field, bw_idx);
}


function e4k_if_filter_chan_enable(e4k, on)
{
    return e4k_reg_set_mask(e4k, E4K_REG_FILT3, E4K_FILT3_DISABLE, on ? 0 : E4K_FILT3_DISABLE);
}


function e4k_if_filter_bw_get(e4k, filter)
{
    if (filter >= ARRAY_SIZE(if_filter_bw))
        return -EINVAL;

    let field = if_filter_fields[filter];
    let rc = e4k_field_read(e4k, field);
    if (rc < 0)
        return rc;
    let arr = if_filter_bw[filter];
    return arr[rc];
}


const E4K_FVCO_MIN_KHZ = 2600000;
const E4K_FVCO_MAX_KHZ = 3900000;
const E4K_PLL_Y = 65536;
const E4K_FLO_MIN_MHZ = 50;
const E4K_FLO_MAX_MHZ = 2200;


function pll_settings(freq, reg_synth7, mult)
{
    this.freq = freq;
    this.reg_synth7 = reg_synth7;
    this.mult = mult;
}


const pll_vars = [
                   new pll_settings(KHZ(72400), (1 << 3) | 7, 48),
                   new pll_settings(KHZ(81200), (1 << 3) | 6, 40),
                   new pll_settings(KHZ(108300), (1 << 3) | 5,	32),
                   new pll_settings(KHZ(162500), (1 << 3) | 4,	24),
                   new pll_settings(KHZ(216600), (1 << 3) | 3,	16),
                   new pll_settings(KHZ(325000), (1 << 3) | 2,	12),
                   new pll_settings(KHZ(350000), (1 << 3) | 1,	8),
                   new pll_settings(KHZ(432000), (0 << 3) | 3,	8),
                   new pll_settings(KHZ(667000), (0 << 3) | 2,	6),
                   new pll_settings(KHZ(1200000), (0 << 3) | 1, 4)
               ];


function is_fvco_valid(fvco_z)
{
    if ((fvco_z / 1000) | 0 < E4K_FVCO_MIN_KHZ || (fvco_z / 1000) | 0 > E4K_FVCO_MAX_KHZ)
        return 0;
    return 1;
}


function is_fosc_valid(fosc)
{
    if (fosc < MHZ(16) || fosc > MHZ(30))
        return 0;
    return 1;
}


function use_3ph_mixing(flo)
{
    if (flo < MHZ(350))
        return 1;
    return 0;
}


function compute_fvco(f_osc, z, x)
{
    let fvco_z = f_osc * z;
    let fvco_x = f_osc * x / E4K_PLL_Y;
    let fvco = fvco_z + fvco_x;
    return fvco;
}


function compute_flo(f_osc, z, x, r)
{
    let fvco = compute_fvco(f_osc, z, x);
    if (fvco === 0)
        return -EINVAL;
    return (fvco / r) | 0;
}


function e4k_band_set(e4k, band)
{
    let rc;
    switch (band) {
    case E4K_BAND_VHF2:
    case E4K_BAND_VHF3:
    case E4K_BAND_UHF:
        e4k_reg_write(e4k, E4K_REG_BIAS, 3);
        break;
    case E4K_BAND_L:
        e4k_reg_write(e4k, E4K_REG_BIAS, 0);
        break;
    }
    rc = e4k_reg_set_mask(e4k, E4K_REG_SYNTH1, 0x06, 0);
    rc = e4k_reg_set_mask(e4k, E4K_REG_SYNTH1, 0x06, band << 1);
    if (rc >= 0)
        e4k.band = band;
    return rc;
}


function e4k_compute_pll_params(oscp, fosc, intended_flo)
{
    let i;
    let r = 2;
    let intended_fvco, remainder;
    let z = 0;
    let x;
    let flo;
    let three_phase_mixing = 0;
    oscp.r_idx = 0;
    if (!is_fosc_valid(fosc))
        return 0;
    for (i = 0; i < ARRAY_SIZE(pll_vars); ++i) {
        if (intended_flo < pll_vars[i].freq) {
            three_phase_mixing = (pll_vars[i].reg_synth7 & 0x08) ? 1 : 0;
            oscp.r_idx = pll_vars[i].reg_synth7;
            r = pll_vars[i].mult;
            break;
        }
    }
    intended_fvco = intended_flo * r;
    z = (intended_fvco / fosc) | 0;
    remainder = intended_fvco - (fosc * z);
    x = (remainder * E4K_PLL_Y / fosc) | 0;
    flo = compute_flo(fosc, z, x, r);
    oscp.fosc = fosc;
    oscp.flo = flo;
    oscp.intended_flo = intended_flo;
    oscp.r = r;
    oscp.threephase = three_phase_mixing;
    oscp.x = x;
    oscp.z = z;
    return flo;
}


function e4k_tune_params(e4k, p)
{
    e4k_reg_write(e4k, E4K_REG_SYNTH7, p.r_idx);
    e4k_reg_write(e4k, E4K_REG_SYNTH3, p.z);
    e4k_reg_write(e4k, E4K_REG_SYNTH4, p.x & 0xff);
    e4k_reg_write(e4k, E4K_REG_SYNTH5, p.x >> 8);
    e4k.vco = p;
    if (e4k.vco.flo < MHZ(140))
        e4k_band_set(e4k, E4K_BAND_VHF2);
    else if (e4k.vco.flo < MHZ(350))
        e4k_band_set(e4k, E4K_BAND_VHF3);
    else if (e4k.vco.flo < MHZ(1135))
        e4k_band_set(e4k, E4K_BAND_UHF);
    else
        e4k_band_set(e4k, E4K_BAND_L);
    e4k_rf_filter_set(e4k);
    return e4k.vco.flo;
}


function e4k_tune_freq(e4k, freq)
{
    let p = new e4k_pll_params();
    let rc = e4k_compute_pll_params(p, e4k.vco.fosc, freq);
    if (!rc)
        return -EINVAL;
    rc = e4k_tune_params(e4k, p);
    rc = e4k_reg_read(e4k, E4K_REG_SYNTH1);
    if (!(rc & 0x01))
        return -1;
    return 0;
}


const if_stage1_gain = new Int8Array([-3, 6]);
const if_stage23_gain = new Int8Array([0, 3, 6, 9]);
const if_stage4_gain = new Int8Array([0, 1, 2, 2]);
const if_stage56_gain = new Int8Array([3, 6, 9, 12, 15, 15, 15, 15]);
const if_stage_gain = [
                        0,
                        if_stage1_gain,
                        if_stage23_gain,
                        if_stage23_gain,
                        if_stage4_gain,
                        if_stage56_gain,
                        if_stage56_gain
                    ];
const if_stage_gain_len = [
                            0,
                            ARRAY_SIZE(if_stage1_gain),
                            ARRAY_SIZE(if_stage23_gain),
                            ARRAY_SIZE(if_stage23_gain),
                            ARRAY_SIZE(if_stage4_gain),
                            ARRAY_SIZE(if_stage56_gain),
                            ARRAY_SIZE(if_stage56_gain)
                        ];
const if_stage_gain_regs = [
                             new reg_field(0, 0, 0),
                             new reg_field(E4K_REG_GAIN3, 0, 1),
                             new reg_field(E4K_REG_GAIN3, 1, 2),
                             new reg_field(E4K_REG_GAIN3, 3, 2),
                             new reg_field(E4K_REG_GAIN3, 5, 2),
                             new reg_field(E4K_REG_GAIN4, 0, 3),
                             new reg_field(E4K_REG_GAIN4, 3, 3),
                         ];
const lnagain = new Int32Array([-50, 0, -25, 1, 0, 4, 25, 5, 50, 6, 75, 7, 100, 8, 125, 9, 150, 10, 175, 11, 200, 12, 250, 13, 300, 14]);
const enhgain = new Int32Array([10, 30, 50, 70]);


function e4k_set_lna_gain(e4k, gain)
{
    for (let i = 0; i < (ARRAY_SIZE(lnagain) / 2) | 0; ++i)
        if(lnagain[i * 2] === gain) {
            e4k_reg_set_mask(e4k, E4K_REG_GAIN1, 0xf, lnagain[i * 2 + 1]);
            return gain;
        }
    return -EINVAL;
}


function e4k_set_enh_gain(e4k, gain)
{
    for (let i = 0; i < ARRAY_SIZE(enhgain); ++i) {
        if(enhgain[i] === gain) {
            e4k_reg_set_mask(e4k, E4K_REG_AGC11, 0x7, E4K_AGC11_LNA_GAIN_ENH | (i << 1));
            return gain;
        }
    }
    e4k_reg_set_mask(e4k, E4K_REG_AGC11, 0x7, 0);
    if (0 === gain)
        return 0;
    else
        return -EINVAL;
}


function e4k_enable_manual_gain(e4k, manual)
{
    if (manual) {
        e4k_reg_set_mask(e4k, E4K_REG_AGC1, E4K_AGC1_MOD_MASK, E4K_AGC_MOD_SERIAL);
        e4k_reg_set_mask(e4k, E4K_REG_AGC7, E4K_AGC7_MIX_GAIN_AUTO, 0);
    } else {
        e4k_reg_set_mask(e4k, E4K_REG_AGC1, E4K_AGC1_MOD_MASK, E4K_AGC_MOD_IF_SERIAL_LNA_AUTON);
        e4k_reg_set_mask(e4k, E4K_REG_AGC7, E4K_AGC7_MIX_GAIN_AUTO, 1);
        e4k_reg_set_mask(e4k, E4K_REG_AGC11, 0x7, 0);
    }
    return 0;
}


function find_stage_gain(stage, val)
{
    if (stage >= ARRAY_SIZE(if_stage_gain))
        return -EINVAL;
    let arr = if_stage_gain[stage];

    for (let i = 0; i < if_stage_gain_len[stage]; i++) {
        if (arr[i] === val)
            return i;
    }
    return -EINVAL;
}


function e4k_if_gain_set(e4k, stage, value)
{
    let rc = find_stage_gain(stage, value);
    if (rc < 0)
        return rc;
    let field = if_stage_gain_regs[stage];
    let mask = width2mask[field.width] << field.shift;
    return e4k_reg_set_mask(e4k, field.reg, mask, rc << field.shift);
}


function e4k_mixer_gain_set(e4k, value)
{
    let bit;
    switch (value) {
    case 4:
        bit = 0;
        break;
    case 12:
        bit = 1;
        break;
    default:
        return -EINVAL;
    }
    return e4k_reg_set_mask(e4k, E4K_REG_GAIN2, 1, bit);
}


function e4k_commonmode_set(e4k, value)
{
    if (value < 0)
        return -EINVAL;
    else if(value > 7)
        return -EINVAL;
    return e4k_reg_set_mask(e4k, E4K_REG_DC7, 7, value);
}


function e4k_manual_dc_offset(e4k, iofs, irange, qofs, qrange)
{
    if ((iofs < 0x00) || (iofs > 0x3f))
        return -EINVAL;
    if ((irange < 0x00) || (irange > 0x03))
        return -EINVAL;
    if ((qofs < 0x00) || (qofs > 0x3f))
        return -EINVAL;
    if ((qrange < 0x00) || (qrange > 0x03))
        return -EINVAL;
    let res = e4k_reg_set_mask(e4k, E4K_REG_DC2, 0x3f, iofs);
    if(res < 0)
        return res;
    res = e4k_reg_set_mask(e4k, E4K_REG_DC3, 0x3f, qofs);
    if(res < 0)
        return res;
    res = e4k_reg_set_mask(e4k, E4K_REG_DC4, 0x33, (qrange << 4) | irange);
    return res;
}


function e4k_dc_offset_calibrate(e4k)
{
    e4k_reg_set_mask(e4k, E4K_REG_DC5, E4K_DC5_RANGE_DET_EN, E4K_DC5_RANGE_DET_EN);
    return e4k_reg_write(e4k, E4K_REG_DC1, 0x01);
}


const if_gains_max = new Int8Array([0, 6, 9, 9, 2, 15, 15]);


function gain_comb(mixer_gain, if1_gain, reg)
{
    this.mixer_gain = mixer_gain;
    this.if1_gain = if1_gain;
    this.reg = reg;
}


const dc_gain_comb = [
                       new gain_comb(4, -3, 0x50),
                       new gain_comb(4, 6, 0x51),
                       new gain_comb(12, -3, 0x52),
                       new gain_comb(12, 6, 0x53)
                   ];


function TO_LUT(offset, range)
{
    return offset | (range << 6);
}


function e4k_dc_offset_gen_table(e4k)
{
    let i;
    e4k_reg_set_mask(e4k, E4K_REG_AGC7, E4K_AGC7_MIX_GAIN_AUTO, 0);
    e4k_reg_set_mask(e4k, E4K_REG_AGC1, E4K_AGC1_MOD_MASK, E4K_AGC_MOD_SERIAL);
    for (i = 2; i <= 6; i++)
        e4k_if_gain_set(e4k, i, if_gains_max[i]);
    let offs_i, offs_q, range, range_i, range_q;
    for (i = 0; i < ARRAY_SIZE(dc_gain_comb); i++) {
        e4k_mixer_gain_set(e4k, dc_gain_comb[i].mixer_gain);
        e4k_if_gain_set(e4k, 1, dc_gain_comb[i].if1_gain);
        e4k_dc_offset_calibrate(e4k);
        offs_i = e4k_reg_read(e4k, E4K_REG_DC2) & 0x3f;
        offs_q = e4k_reg_read(e4k, E4K_REG_DC3) & 0x3f;
        range  = e4k_reg_read(e4k, E4K_REG_DC4);
        range_i = range & 0x3;
        range_q = (range >> 4) & 0x3;
        e4k_reg_write(e4k, dc_gain_comb[i].reg, TO_LUT(offs_q, range_q));
        e4k_reg_write(e4k, dc_gain_comb[i].reg + 0x10, TO_LUT(offs_i, range_i));
    }
    return 0;
}


function e4k_standby(e4k, enable)
{
    e4k_reg_set_mask(e4k, E4K_REG_MASTER1, E4K_MASTER1_NORM_STBY, enable ? 0 : E4K_MASTER1_NORM_STBY);
    return 0;
}


function magic_init(e4k)
{
    e4k_reg_write(e4k, 0x7e, 0x01);
    e4k_reg_write(e4k, 0x7f, 0xfe);
    e4k_reg_write(e4k, 0x82, 0x00);
    e4k_reg_write(e4k, 0x86, 0x50);
    e4k_reg_write(e4k, 0x87, 0x20);
    e4k_reg_write(e4k, 0x88, 0x01);
    e4k_reg_write(e4k, 0x9f, 0x7f);
    e4k_reg_write(e4k, 0xa0, 0x07);
    return 0;
}


function e4k_init(e4k)
{
    e4k_reg_read(e4k, 0);
    e4k_reg_write(e4k, E4K_REG_MASTER1, E4K_MASTER1_RESET | E4K_MASTER1_NORM_STBY | E4K_MASTER1_POR_DET);
    e4k_reg_write(e4k, E4K_REG_CLK_INP, 0x00);
    e4k_reg_write(e4k, E4K_REG_REF_CLK, 0x00);
    e4k_reg_write(e4k, E4K_REG_CLKOUT_PWDN, 0x96);
    magic_init(e4k);
    e4k_reg_write(e4k, E4K_REG_AGC4, 0x10);
    e4k_reg_write(e4k, E4K_REG_AGC5, 0x04);
    e4k_reg_write(e4k, E4K_REG_AGC6, 0x1a);
    e4k_reg_set_mask(e4k, E4K_REG_AGC1, E4K_AGC1_MOD_MASK, E4K_AGC_MOD_SERIAL);
    e4k_reg_set_mask(e4k, E4K_REG_AGC7, E4K_AGC7_MIX_GAIN_AUTO, 0);
    e4k_enable_manual_gain(e4k, 0);
    e4k_if_gain_set(e4k, 1, 6);
    e4k_if_gain_set(e4k, 2, 0);
    e4k_if_gain_set(e4k, 3, 0);
    e4k_if_gain_set(e4k, 4, 0);
    e4k_if_gain_set(e4k, 5, 9);
    e4k_if_gain_set(e4k, 6, 9);
    e4k_if_filter_bw_set(e4k, E4K_IF_FILTER_MIX, KHZ(1900));
    e4k_if_filter_bw_set(e4k, E4K_IF_FILTER_RC, KHZ(1000));
    e4k_if_filter_bw_set(e4k, E4K_IF_FILTER_CHAN, KHZ(2150));
    e4k_if_filter_chan_enable(e4k, 1);
    e4k_reg_set_mask(e4k, E4K_REG_DC5, 0x03, 0);
    e4k_reg_set_mask(e4k, E4K_REG_DCTIME1, 0x03, 0);
    e4k_reg_set_mask(e4k, E4K_REG_DCTIME2, 0x03, 0);
    return 0;
}


const FC0012_I2C_ADDR = 0xc6;
const FC0012_CHECK_ADDR	= 0x00;
const FC0012_CHECK_VAL = 0xa1;


function fc0012_writereg(dev, reg, val)
{
    let data = new Uint8Array([reg, val]);
    if (rtlsdr_i2c_write_fn(dev, FC0012_I2C_ADDR, data, 2) < 0)
        return -1;
    return 0;
}


function fc0012_readreg(dev, reg, val)
{
    let data = new Uint8Array([reg]);
    if (rtlsdr_i2c_write_fn(dev, FC0012_I2C_ADDR, data, 1) < 0)
        return -1;
    if (rtlsdr_i2c_read_fn(dev, FC0012_I2C_ADDR, data, 1) < 0)
        return -1;
    val = data[0];
    global1 = val;
    return 0;
}


function fc0012_set_i2c_register(dev, i2c_register, data)
{
    let reg = i2c_register & 0xff;
    let reg_val = data & 0xff;
    return fc0012_writereg(dev, reg, reg_val);
}


function fc0012_get_i2c_register(dev, data, len)
{
    let len1;
    data[0] = 0;
    if (len < 16)
        len1 = len;
    else
        len1 = 16;
    if (rtlsdr_i2c_write_fn(dev, FC0012_I2C_ADDR, data, 1) < 0)
        return -1;
    if (rtlsdr_i2c_read_fn(dev, FC0012_I2C_ADDR, data, len1) < 0)
        return -1;
    if (len > 16) {
        len1 = len - 16;
        data[16] = 16;
        if (rtlsdr_i2c_write_fn(dev, FC0012_I2C_ADDR, data.subarray(16), 1) < 0)
            return -1;
        if (rtlsdr_i2c_read_fn(dev, FC0012_I2C_ADDR, data.subarray(16), len1) < 0)
            return -1;
    }
    return 0;
}


function print_registers(dev)
{
    return 0;
}


function fc0012_init(dev)
{
    let ret = 0;
    let reg = new Uint8Array([0x00,	0x05, 0x10,	0x00, 0x00,	0x0f, 0x00,	0x00, 0xff,	0x6e, 0xb8,	0x82, 0xfc,	0x02, 0x00,	0x00, 0x00,	0x0a, 0x51,	0x08, 0x00,	0x04]);
    reg[0x07] |= 0x20;
    reg[0x0c] |= 0x02;
    for (let i = 1; i < reg.length; i++) {
        ret = fc0012_writereg(dev, i, reg[i]);
        if (ret)
            break;
    }
    return ret;
}


function fc0012_set_params(dev, freq, bandwidth)
{
    let ret = 0;
    let reg = new Uint8Array(7);
    let am, pm, multi, tmp;
    let f_vco;
    let xtal_freq_div_2;
    let xin, xdiv;
    let vco_select = 0;
    xtal_freq_div_2 = (rtlsdr_get_tuner_clock(dev) / 2) | 0;
    if (freq < 37084000) {
        multi = 96;
        reg[5] = 0x82;
        reg[6] = 0x00;
    } else if (freq < 55625000) {
        multi = 64;
        reg[5] = 0x82;
        reg[6] = 0x02;
    } else if (freq < 74167000) {
        multi = 48;
        reg[5] = 0x42;
        reg[6] = 0x00;
    } else if (freq < 111250000) {
        multi = 32;
        reg[5] = 0x42;
        reg[6] = 0x02;
    } else if (freq < 148334000) {
        multi = 24;
        reg[5] = 0x22;
        reg[6] = 0x00;
    } else if (freq < 222500000) {
        multi = 16;
        reg[5] = 0x22;
        reg[6] = 0x02;
    } else if (freq < 296667000) {
        multi = 12;
        reg[5] = 0x12;
        reg[6] = 0x00;
    } else if (freq < 445000000) {
        multi = 8;
        reg[5] = 0x12;
        reg[6] = 0x02;
    } else if (freq < 593334000) {
        multi = 6;
        reg[5] = 0x0a;
        reg[6] = 0x00;
    } else {
        multi = 4;
        reg[5] = 0x0a;
        reg[6] = 0x02;
    }
    f_vco = freq * multi;
    if (f_vco >= 3060000000) {
        reg[6] |= 0x08;
        vco_select = 1;
    }
    xdiv = (f_vco / xtal_freq_div_2) | 0;
    if ((f_vco - xdiv * xtal_freq_div_2) >= ((xtal_freq_div_2 / 2) | 0))
        xdiv++;
    pm = (xdiv / 8) | 0;
    am = xdiv - (8 * pm);
    if (am < 2) {
        am += 8;
        pm--;
    }
    if (pm > 31) {
        reg[1] = am + 8 * (pm - 31);
        reg[2] = 31;
    } else {
        reg[1] = am;
        reg[2] = pm;
    }
    if ((reg[1] > 15) || (reg[2] < 0x0b))
        return -1;
    reg[6] |= 0x20;
    xin = ((f_vco - (f_vco / xtal_freq_div_2) * xtal_freq_div_2) / 1000) | 0;
    xin = ((xin << 15) / ((xtal_freq_div_2 / 1000) | 0)) | 0;
    if (xin >= 16384)
        xin += 32768;
    reg[3] = xin >> 8;
    reg[4] = xin & 0xff;
    reg[6] &= 0x3f;
    switch (bandwidth) {
    case 6000000:
        reg[6] |= 0x80;
        break;
    case 7000000:
        reg[6] |= 0x40;
        break;
    case 8000000:
    default:
        break;
    }
    reg[5] |= 0x07;
    for (let i = 1; i <= 6; i++) {
        ret = fc0012_writereg(dev, i, reg[i]);
        if (ret)
            return ret;
    }
    ret = fc0012_writereg(dev, 0x0e, 0x80);
    if (!ret)
        ret = fc0012_writereg(dev, 0x0e, 0x00);
    if (!ret)
        ret = fc0012_writereg(dev, 0x0e, 0x00);
    if (!ret) {
        ret = fc0012_readreg(dev, 0x0e, tmp);
        tmp = global1;
    }
    if (ret)
        return ret;
    tmp &= 0x3f;
    if (vco_select) {
        if (tmp > 0x3c) {
            reg[6] &= ~0x08;
            ret = fc0012_writereg(dev, 0x06, reg[6]);
            if (!ret)
                ret = fc0012_writereg(dev, 0x0e, 0x80);
            if (!ret)
                ret = fc0012_writereg(dev, 0x0e, 0x00);
        }
    } else {
        if (tmp < 0x02) {
            reg[6] |= 0x08;
            ret = fc0012_writereg(dev, 0x06, reg[6]);
            if (!ret)
                ret = fc0012_writereg(dev, 0x0e, 0x80);
            if (!ret)
                ret = fc0012_writereg(dev, 0x0e, 0x00);
        }
    }
    return ret;
}


function fc0012_set_gain(dev, gain)
{
    let ret;
    let tmp = 0;
    ret = fc0012_readreg(dev, 0x13, tmp);
    tmp = global1;
    tmp &= 0xe0;
    switch (gain) {
    case -99:
        tmp |= 0x02;
        break;
    case -40:
        break;
    case 71:
        tmp |= 0x08;
        break;
    case 179:
        tmp |= 0x17;
        break;
    case 192:
    default:
        tmp |= 0x10;
        break;
    }
    ret = fc0012_writereg(dev, 0x13, tmp);
    return ret;
}


const FC0013_I2C_ADDR = 0xc6;
const FC0013_CHECK_ADDR	= 0x00;
const FC0013_CHECK_VAL = 0xa3;


function fc0013_writereg(dev, reg, val)
{
    let data = new Uint8Array([reg, val]);
    if (rtlsdr_i2c_write_fn(dev, FC0013_I2C_ADDR, data, 2) < 0)
        return -1;
    return 0;
}


function fc0013_readreg(dev, reg, val)
{
    let data = new Uint8Array([reg]);
    if (rtlsdr_i2c_write_fn(dev, FC0013_I2C_ADDR, data, 1) < 0)
        return -1;
    if (rtlsdr_i2c_read_fn(dev, FC0013_I2C_ADDR, data, 1) < 0)
        return -1;
    val = data[0];
    global1 = val;
    return 0;
}


function fc0013_init(dev)
{
    let ret = 0;
    let reg = new Uint8Array([0x00, 0x09, 0x16,	0x00, 0x00,	0x17, 0x02,	0x0a, 0xff,	0x6e, 0xb8,	0x82, 0xfc,	0x01, 0x00,	0x00, 0x00,	0x00, 0x00,	0x00, 0x50,	0x01]);
    reg[0x07] |= 0x20;
    reg[0x0c] |= 0x02;
    for (let i = 1; i < reg.length; i++) {
        ret = fc0013_writereg(dev, i, reg[i]);
        if (ret < 0)
            break;
    }
    return ret;
}


function fc0013_rc_cal_add(dev, rc_val)
{
    let ret;
    let rc_cal;
    let val;
    ret = fc0013_writereg(dev, 0x10, 0x00);
    if (ret)
        return ret;
    ret = fc0013_readreg(dev, 0x10, rc_cal);
    rc_cal = global1;
    if (ret)
        return ret;
    rc_cal &= 0x0f;
    val = rc_cal + rc_val;
    ret = fc0013_writereg(dev, 0x0d, 0x11);
    if (ret)
        return ret;
    if (val > 15)
        ret = fc0013_writereg(dev, 0x10, 0x0f);
    else if (val < 0)
        ret = fc0013_writereg(dev, 0x10, 0x00);
    else
        ret = fc0013_writereg(dev, 0x10, val);
    return ret;
}


function fc0013_rc_cal_reset(dev)
{
    let ret = fc0013_writereg(dev, 0x0d, 0x01);
    if (!ret)
        ret = fc0013_writereg(dev, 0x10, 0x00);
    return ret;
}


function fc0013_set_vhf_track(dev, freq)
{
    let tmp;
    let ret = fc0013_readreg(dev, 0x1d, tmp);
    tmp = global1;
    if (ret)
        return ret;
    tmp &= 0xe3;
    if (freq <= 177500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x1c);
    else if (freq <= 184500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x18);
    else if (freq <= 191500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x14);
    else if (freq <= 198500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x10);
    else if (freq <= 205500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x0c);
    else if (freq <= 219500000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x08);
    else if (freq < 300000000)
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x04);
    else
        ret = fc0013_writereg(dev, 0x1d, tmp | 0x1c);
    return ret;
}


function fc0013_set_params(dev, freq, bandwidth)
{
    let ret = 0;
    let reg = new Uint8Array(7);
    let am, pm, multi, tmp;
    let f_vco;
    let xtal_freq_div_2;
    let xin, xdiv;
    let vco_select = 0;
    xtal_freq_div_2 = (rtlsdr_get_tuner_clock(dev) / 2) | 0;
    ret = fc0013_set_vhf_track(dev, freq);
    if (ret)
        return ret;
    if (freq < 300000000) {
        ret = fc0013_readreg(dev, 0x07, tmp);
        tmp = global1;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x07, tmp | 0x10);
        if (ret)
            return ret;
        ret = fc0013_readreg(dev, 0x14, tmp);
        tmp = global1;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x14, tmp & 0x1f);
        if (ret)
            return ret;
    } else if (freq <= 862000000) {
        ret = fc0013_readreg(dev, 0x07, tmp);
        tmp = global;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x07, tmp & 0xef);
        if (ret)
            return ret;
        ret = fc0013_readreg(dev, 0x14, tmp);
        tmp = global1;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x14, (tmp & 0x1f) | 0x40);
        if (ret)
            return ret;
    } else {
        ret = fc0013_readreg(dev, 0x07, tmp);
        tmp = global1;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x07, tmp & 0xef);
        if (ret)
            return ret;
        ret = fc0013_readreg(dev, 0x14, tmp);
        tmp = global1;
        if (ret)
            return ret;
        ret = fc0013_writereg(dev, 0x14, (tmp & 0x1f) | 0x20);
        if (ret)
            return ret;
    }
    if (freq < 37084000) {
        multi = 96;
        reg[5] = 0x82;
        reg[6] = 0x00;
    } else if (freq < 55625000) {
        multi = 64;
        reg[5] = 0x02;
        reg[6] = 0x02;
    } else if (freq < 74167000) {
        multi = 48;
        reg[5] = 0x42;
        reg[6] = 0x00;
    } else if (freq < 111250000) {
        multi = 32;
        reg[5] = 0x82;
        reg[6] = 0x02;
    } else if (freq < 148334000) {
        multi = 24;
        reg[5] = 0x22;
        reg[6] = 0x00;
    } else if (freq < 222500000) {
        multi = 16;
        reg[5] = 0x42;
        reg[6] = 0x02;
    } else if (freq < 296667000) {
        multi = 12;
        reg[5] = 0x12;
        reg[6] = 0x00;
    } else if (freq < 445000000) {
        multi = 8;
        reg[5] = 0x22;
        reg[6] = 0x02;
    } else if (freq < 593334000) {
        multi = 6;
        reg[5] = 0x0a;
        reg[6] = 0x00;
    } else if (freq < 950000000) {
        multi = 4;
        reg[5] = 0x12;
        reg[6] = 0x02;
    } else {
        multi = 2;
        reg[5] = 0x0a;
        reg[6] = 0x02;
    }
    f_vco = freq * multi;
    if (f_vco >= 3060000000) {
        reg[6] |= 0x08;
        vco_select = 1;
    }
    xdiv = (f_vco / xtal_freq_div_2) | 0;
    if ((f_vco - xdiv * xtal_freq_div_2) >= ((xtal_freq_div_2 / 2) | 0))
        xdiv++;
    pm = (xdiv / 8) | 0;
    am = xdiv - 8 * pm;
    if (am < 2) {
        am += 8;
        pm--;
    }
    if (pm > 31) {
        reg[1] = am + 8 * (pm - 31);
        reg[2] = 31;
    } else {
        reg[1] = am;
        reg[2] = pm;
    }
    if ((reg[1] > 15) || (reg[2] < 0x0b))
        return -1;
    reg[6] |= 0x20;
    xin = ((f_vco - ((f_vco / xtal_freq_div_2) | 0) * xtal_freq_div_2) / 1000) | 0;
    xin = ((xin << 15) / ((xtal_freq_div_2 / 1000) | 0)) | 0;
    if (xin >= 16384)
        xin += 32768;
    reg[3] = xin >> 8;
    reg[4] = xin & 0xff;
    reg[6] &= 0x3f;
    switch (bandwidth) {
    case 6000000:
        reg[6] |= 0x80;
        break;
    case 7000000:
        reg[6] |= 0x40;
        break;
    case 8000000:
    default:
        break;
    }
    reg[5] |= 0x07;
    for (let i = 1; i <= 6; i++) {
        ret = fc0013_writereg(dev, i, reg[i]);
        if (ret)
            return ret;
    }
    ret = fc0013_readreg(dev, 0x11, tmp);
    tmp = global1;
    if (ret)
        return ret;
    if (multi === 64)
        ret = fc0013_writereg(dev, 0x11, tmp | 0x04);
    else
        ret = fc0013_writereg(dev, 0x11, tmp & 0xfb);
    if (ret)
        return ret;
    ret = fc0013_writereg(dev, 0x0e, 0x80);
    if (!ret)
        ret = fc0013_writereg(dev, 0x0e, 0x00);
    if (!ret)
        ret = fc0013_writereg(dev, 0x0e, 0x00);
    if (!ret)
        ret = fc0013_readreg(dev, 0x0e, tmp);
    tmp = global1;
    if (ret)
        return ret;
    tmp &= 0x3f;
    if (vco_select) {
        if (tmp > 0x3c) {
            reg[6] &= ~0x08;
            ret = fc0013_writereg(dev, 0x06, reg[6]);
            if (!ret)
                ret = fc0013_writereg(dev, 0x0e, 0x80);
            if (!ret)
                ret = fc0013_writereg(dev, 0x0e, 0x00);
        }
    } else {
        if (tmp < 0x02) {
            reg[6] |= 0x08;
            ret = fc0013_writereg(dev, 0x06, reg[6]);
            if (!ret)
                ret = fc0013_writereg(dev, 0x0e, 0x80);
            if (!ret)
                ret = fc0013_writereg(dev, 0x0e, 0x00);
        }
    }
    return ret;
}


function fc0013_set_gain_mode(dev, manual)
{
    let ret = 0;
    let tmp = 0;
    ret |= fc0013_readreg(dev, 0x0d, tmp);
    tmp = global1;
    if (manual)
        tmp |= (1 << 3);
    else
        tmp &= ~(1 << 3);
    ret |= fc0013_writereg(dev, 0x0d, tmp);
    ret |= fc0013_writereg(dev, 0x13, 0x0a);
    return ret;
}


const fc0013_lna_gains = new Int32Array([-99, 0x02, -73, 0x03, -65, 0x05, -63, 0x04,-63, 0x00, -60, 0x07, -58, 0x01, -54, 0x06, 58, 0x0f, 61, 0x0e, 63, 0x0d, 65, 0x0c, 67, 0x0b,
                                         68, 0x0a, 70, 0x09, 71, 0x08, 179, 0x17, 181, 0x16, 182, 0x15, 184, 0x14, 186, 0x13, 188, 0x12, 191, 0x11, 197, 0x10]);
const GAIN_CNT = 24;


function fc0013_set_lna_gain(dev, gain)
{
    let ret = 0;
    let tmp = 0;
    ret |= fc0013_readreg(dev, 0x14, tmp);
    tmp = global1;
    tmp &= 0xe0;
    for (let i = 0; i < GAIN_CNT; i++) {
        if ((fc0013_lna_gains[i * 2] >= gain) || (i + 1 === GAIN_CNT)) {
            tmp |= fc0013_lna_gains[i * 2 + 1];
            break;
        }
    }
    ret |= fc0013_writereg(dev, 0x14, tmp);
    return ret;
}


const BORDER_FREQ = 2600000;
const USE_EXT_CLK = 0;
const OFS_RSSI = 57;
const FC2580_I2C_ADDR = 0xac;
const FC2580_CHECK_ADDR = 0x01;
const FC2580_CHECK_VAL = 0x56;
const FC2580_XTAL_FREQ = 16384000;
const FC2580_UHF_BAND = 0;
const FC2580_L_BAND = 1;
const FC2580_VHF_BAND = 2;
const FC2580_NO_BAND = 3;
const FC2580_FCI_FAIL = 0;
const FC2580_FCI_SUCCESS = 1;
const FUNCTION_SUCCESS = 0;
const FUNCTION_ERROR = 1;
const FC2580_AGC_INTERNAL = 1;
const FC2580_AGC_EXTERNAL = 2;
const FC2580_BANDWIDTH_1530000HZ = 1;
const FC2580_BANDWIDTH_6000000HZ = 6;
const FC2580_BANDWIDTH_7000000HZ = 7;
const FC2580_BANDWIDTH_8000000HZ = 8;
const CRYSTAL_FREQ = 16384000;


function fc2580_i2c_write(pTuner, reg, val)
{
    let data = Uint8Array([reg, val]);;
    if (rtlsdr_i2c_write_fn(pTuner, FC2580_I2C_ADDR, data, 2) < 0)
        return FC2580_FCI_FAIL;
    return FC2580_FCI_SUCCESS;
}


function fc2580_i2c_read(pTuner, reg, read_data)
{
    let data = new Uint8Array([reg]);
    if (rtlsdr_i2c_write_fn(pTuner, FC2580_I2C_ADDR, data, 1) < 0)
        return FC2580_FCI_FAIL;
    if (rtlsdr_i2c_read_fn(pTuner, FC2580_I2C_ADDR, data, 1) < 0)
        return FC2580_FCI_FAIL;
    read_data = data[0];
    global1 = read_data;
    return FC2580_FCI_SUCCESS;
}


function fc2580_Initialize(pTuner)
{
    let AgcMode = FC2580_AGC_EXTERNAL;
    let CrystalFreqKhz = ((CRYSTAL_FREQ + 500) / 1000) | 0;
    if(fc2580_set_init(pTuner, AgcMode, CrystalFreqKhz) !== FC2580_FCI_SUCCESS)
        return FUNCTION_ERROR;
    return FUNCTION_SUCCESS;
}


function fc2580_SetRfFreqHz(pTuner, RfFreqHz)
{
    let RfFreqKhz = ((RfFreqHz + 500) / 1000) | 0;
    let CrystalFreqKhz = ((CRYSTAL_FREQ + 500) / 1000) | 0;
    if(fc2580_set_freq(pTuner, RfFreqKhz, CrystalFreqKhz) !== FC2580_FCI_SUCCESS)
        return FUNCTION_ERROR;
    return FUNCTION_SUCCESS;
}


function fc2580_SetBandwidthMode(pTuner, BandwidthMode)
{
    CrystalFreqKhz = ((CRYSTAL_FREQ + 500) / 1000) | 0;
    if(fc2580_set_filter(pTuner, BandwidthMode, CrystalFreqKhz) !== FC2580_FCI_SUCCESS)
        return FUNCTION_ERROR;
    return FUNCTION_SUCCESS;
}


function fc2580_wait_msec(pTuner, a)
{
    return;
}


function fc2580_set_init(pTuner, ifagc_mode, freq_xtal)
{
    let result = FC2580_FCI_SUCCESS;
    result &= fc2580_i2c_write(pTuner, 0x00, 0x00);
    result &= fc2580_i2c_write(pTuner, 0x12, 0x86);
    result &= fc2580_i2c_write(pTuner, 0x14, 0x5C);
    result &= fc2580_i2c_write(pTuner, 0x16, 0x3C);
    result &= fc2580_i2c_write(pTuner, 0x1F, 0xD2);
    result &= fc2580_i2c_write(pTuner, 0x09, 0xD7);
    result &= fc2580_i2c_write(pTuner, 0x0B, 0xD5);
    result &= fc2580_i2c_write(pTuner, 0x0C, 0x32);
    result &= fc2580_i2c_write(pTuner, 0x0E, 0x43);
    result &= fc2580_i2c_write(pTuner, 0x21, 0x0A);
    result &= fc2580_i2c_write(pTuner, 0x22, 0x82);
    if( ifagc_mode === 1 ) {
        result &= fc2580_i2c_write(pTuner, 0x45, 0x10);
        result &= fc2580_i2c_write(pTuner, 0x4C, 0x00);
    } else if( ifagc_mode === 2 ) {
        result &= fc2580_i2c_write(pTuner, 0x45, 0x20);
        result &= fc2580_i2c_write(pTuner, 0x4C, 0x02);
    }
    result &= fc2580_i2c_write(pTuner, 0x3F, 0x88);
    result &= fc2580_i2c_write(pTuner, 0x02, 0x0E);
    result &= fc2580_i2c_write(pTuner, 0x58, 0x14);
    result &= fc2580_set_filter(pTuner, 8, freq_xtal);
    return result;
}


function fc2580_set_freq(pTuner, f_lo, freq_xtal)
{
    let f_diff, f_diff_shifted, n_val, k_val;
    let f_vco, r_val, f_comp;
    let pre_shift_bits = 4;
    let data_0x18;
    let data_0x02 = (USE_EXT_CLK << 5)|0x0e;
    let band = f_lo > 1000000 ? FC2580_L_BAND : (f_lo > 400000 ? FC2580_UHF_BAND : FC2580_VHF_BAND);
    let result = FC2580_FCI_SUCCESS;
    f_vco = band === FC2580_UHF_BAND ? f_lo * 4 : (band === FC2580_L_BAND ? f_lo * 2 : f_lo * 12);
    r_val = f_vco >= 2 * 76 * freq_xtal ? 1 : (f_vco >= 76 * freq_xtal ? 2 : 4);
    f_comp = (freq_xtal / r_val) | 0;
    n_val =	(((f_vco / 2 ) | 0) / f_comp) | 0;
    f_diff = f_vco - 2 * f_comp * n_val;
    f_diff_shifted = f_diff << (20 - pre_shift_bits);
    k_val = (f_diff_shifted / ((2* f_comp ) >> pre_shift_bits)) | 0;
    if (f_diff_shifted - k_val * (( 2* f_comp ) >> pre_shift_bits) >= (f_comp >> pre_shift_bits))
        k_val++;
    if (f_vco >= BORDER_FREQ)
        data_0x02 = data_0x02 | 0x08;
    else
        data_0x02 = data_0x02 & 0xf7;
    switch(band) {
    case FC2580_UHF_BAND:
        data_0x02 = data_0x02 & 0x3f;
        result &= fc2580_i2c_write(pTuner, 0x25, 0xf0);
        result &= fc2580_i2c_write(pTuner, 0x27, 0x77);
        result &= fc2580_i2c_write(pTuner, 0x28, 0x53);
        result &= fc2580_i2c_write(pTuner, 0x29, 0x60);
        result &= fc2580_i2c_write(pTuner, 0x30, 0x09);
        result &= fc2580_i2c_write(pTuner, 0x50, 0x8c);
        result &= fc2580_i2c_write(pTuner, 0x53, 0x50);
        if(f_lo < 538000)
            result &= fc2580_i2c_write(pTuner, 0x5f, 0x13);
        else
            result &= fc2580_i2c_write(pTuner, 0x5f, 0x15);
        if(f_lo < 538000) {
            result &= fc2580_i2c_write(pTuner, 0x61, 0x07);
            result &= fc2580_i2c_write(pTuner, 0x62, 0x06);
            result &= fc2580_i2c_write(pTuner, 0x67, 0x06);
            result &= fc2580_i2c_write(pTuner, 0x68, 0x08);
            result &= fc2580_i2c_write(pTuner, 0x69, 0x10);
            result &= fc2580_i2c_write(pTuner, 0x6a, 0x12);
        } else if(f_lo < 794000) {
            result &= fc2580_i2c_write(pTuner, 0x61, 0x03);
            result &= fc2580_i2c_write(pTuner, 0x62, 0x03);
            result &= fc2580_i2c_write(pTuner, 0x67, 0x03);
            result &= fc2580_i2c_write(pTuner, 0x68, 0x05);
            result &= fc2580_i2c_write(pTuner, 0x69, 0x0c);
            result &= fc2580_i2c_write(pTuner, 0x6a, 0x0e);
        } else {
            result &= fc2580_i2c_write(pTuner, 0x61, 0x07);
            result &= fc2580_i2c_write(pTuner, 0x62, 0x06);
            result &= fc2580_i2c_write(pTuner, 0x67, 0x07);
            result &= fc2580_i2c_write(pTuner, 0x68, 0x09);
            result &= fc2580_i2c_write(pTuner, 0x69, 0x10);
            result &= fc2580_i2c_write(pTuner, 0x6a, 0x12);
        }
        result &= fc2580_i2c_write(pTuner, 0x63, 0x15);
        result &= fc2580_i2c_write(pTuner, 0x6b, 0x0b);
        result &= fc2580_i2c_write(pTuner, 0x6c, 0x0c);
        result &= fc2580_i2c_write(pTuner, 0x6d, 0x78);
        result &= fc2580_i2c_write(pTuner, 0x6e, 0x32);
        result &= fc2580_i2c_write(pTuner, 0x6f, 0x14);
        result &= fc2580_set_filter(pTuner, 8, freq_xtal);
        break;
    case FC2580_VHF_BAND:
        data_0x02 = (data_0x02 & 0x3f) | 0x80;
        result &= fc2580_i2c_write(pTuner, 0x27, 0x77);
        result &= fc2580_i2c_write(pTuner, 0x28, 0x33);
        result &= fc2580_i2c_write(pTuner, 0x29, 0x40);
        result &= fc2580_i2c_write(pTuner, 0x30, 0x09);
        result &= fc2580_i2c_write(pTuner, 0x50, 0x8c);
        result &= fc2580_i2c_write(pTuner, 0x53, 0x50);
        result &= fc2580_i2c_write(pTuner, 0x5f, 0x0f);
        result &= fc2580_i2c_write(pTuner, 0x61, 0x07);
        result &= fc2580_i2c_write(pTuner, 0x62, 0x00);
        result &= fc2580_i2c_write(pTuner, 0x63, 0x15);
        result &= fc2580_i2c_write(pTuner, 0x67, 0x03);
        result &= fc2580_i2c_write(pTuner, 0x68, 0x05);
        result &= fc2580_i2c_write(pTuner, 0x69, 0x10);
        result &= fc2580_i2c_write(pTuner, 0x6a, 0x12);
        result &= fc2580_i2c_write(pTuner, 0x6b, 0x08);
        result &= fc2580_i2c_write(pTuner, 0x6c, 0x0a);
        result &= fc2580_i2c_write(pTuner, 0x6d, 0x78);
        result &= fc2580_i2c_write(pTuner, 0x6e, 0x32);
        result &= fc2580_i2c_write(pTuner, 0x6f, 0x54);
        result &= fc2580_set_filter(pTuner, 7, freq_xtal);
        break;
    case FC2580_L_BAND:
        data_0x02 = (data_0x02 & 0x3f) | 0x40;
        result &= fc2580_i2c_write(pTuner, 0x2b, 0x70);
        result &= fc2580_i2c_write(pTuner, 0x2c, 0x37);
        result &= fc2580_i2c_write(pTuner, 0x2d, 0xe7);
        result &= fc2580_i2c_write(pTuner, 0x30, 0x09);
        result &= fc2580_i2c_write(pTuner, 0x44, 0x20);
        result &= fc2580_i2c_write(pTuner, 0x50, 0x8c);
        result &= fc2580_i2c_write(pTuner, 0x53, 0x50);
        result &= fc2580_i2c_write(pTuner, 0x5f, 0x0f);
        result &= fc2580_i2c_write(pTuner, 0x61, 0x0f);
        result &= fc2580_i2c_write(pTuner, 0x62, 0x00);
        result &= fc2580_i2c_write(pTuner, 0x63, 0x13);
        result &= fc2580_i2c_write(pTuner, 0x67, 0x00);
        result &= fc2580_i2c_write(pTuner, 0x68, 0x02);
        result &= fc2580_i2c_write(pTuner, 0x69, 0x0c);
        result &= fc2580_i2c_write(pTuner, 0x6a, 0x0e);
        result &= fc2580_i2c_write(pTuner, 0x6b, 0x08);
        result &= fc2580_i2c_write(pTuner, 0x6c, 0x0a);
        result &= fc2580_i2c_write(pTuner, 0x6d, 0xa0);
        result &= fc2580_i2c_write(pTuner, 0x6e, 0x50);
        result &= fc2580_i2c_write(pTuner, 0x6f, 0x14);
        result &= fc2580_set_filter(pTuner, 1, freq_xtal);
        break;
    default:
        break;
    }
    if (freq_xtal >= 28000)
        result &= fc2580_i2c_write(pTuner, 0x4b, 0x22 );
    result &= fc2580_i2c_write(pTuner, 0x02, data_0x02);
    data_0x18 = (r_val === 1 ? 0x00 : (r_val === 2 ? 0x10 : 0x20) + (k_val >> 16));
    result &= fc2580_i2c_write(pTuner, 0x18, data_0x18);
    result &= fc2580_i2c_write(pTuner, 0x1a, k_val >> 8);
    result &= fc2580_i2c_write(pTuner, 0x1b, k_val);
    result &= fc2580_i2c_write(pTuner, 0x1c, n_val);
    if (band === FC2580_UHF_BAND)
        result &= fc2580_i2c_write(pTuner, 0x2d, f_lo <= 794000 ? 0x9F : 0x8F );
    return result;
}


function fc2580_set_filter(pTuner, filter_bw, freq_xtal)
{
    let cal_mon = 0;
    let result = FC2580_FCI_SUCCESS;
    if (filter_bw === 1) {
        result &= fc2580_i2c_write(pTuner, 0x36, 0x1c);
        result &= fc2580_i2c_write(pTuner, 0x37, (4151 * freq_xtal / 1000000) | 0);
        result &= fc2580_i2c_write(pTuner, 0x39, 0x00);
        result &= fc2580_i2c_write(pTuner, 0x2e, 0x09);
    }
    if (filter_bw === 6) {
        result &= fc2580_i2c_write(pTuner, 0x36, 0x18);
        result &= fc2580_i2c_write(pTuner, 0x37, (4400 * freq_xtal / 1000000) | 0);
        result &= fc2580_i2c_write(pTuner, 0x39, 0x00);
        result &= fc2580_i2c_write(pTuner, 0x2e, 0x09);
    } else if (filter_bw === 7) {
        result &= fc2580_i2c_write(pTuner, 0x36, 0x18);
        result &= fc2580_i2c_write(pTuner, 0x37, (3910 * freq_xtal / 1000000) | 0);
        result &= fc2580_i2c_write(pTuner, 0x39, 0x80);
        result &= fc2580_i2c_write(pTuner, 0x2e, 0x09);
    } else if (filter_bw === 8) {
        result &= fc2580_i2c_write(pTuner, 0x36, 0x18);
        result &= fc2580_i2c_write(pTuner, 0x37, (3300 * freq_xtal / 1000000) | 0);
        result &= fc2580_i2c_write(pTuner, 0x39, 0x80);
        result &= fc2580_i2c_write(pTuner, 0x2e, 0x09);
    }
    for (let i = 0; i < 5; i++) {
        fc2580_wait_msec(pTuner, 5);
        result &= fc2580_i2c_read(pTuner, 0x2f, cal_mon);
        cal_mon = global1;
        if(cal_mon & 0xc0 !== 0xC0) {
            result &= fc2580_i2c_write(pTuner, 0x2e, 0x01);
            result &= fc2580_i2c_write(pTuner, 0x2e, 0x09);
        } else
            break;
    }
    result &= fc2580_i2c_write(pTuner, 0x2e, 0x01);
    return result;
}


const R820T_I2C_ADDR = 0x34;
const R828D_I2C_ADDR = 0x74;
const R828D_XTAL_FREQ = 16000000;
const R82XX_CHECK_ADDR = 0x00;
const R82XX_CHECK_VAL = 0x69;
const R82XX_IF_FREQ = 3570000;
const REG_SHADOW_START = 5;
const NUM_REGS = 32;
const NUM_IMR = 5;
const IMR_TRIAL = 9;
const VER_NUM = 49;
const USE_R82XX_ENV_VARS = 0;
const CHIP_R820T = 0;
const CHIP_R620D = 1;
const CHIP_R828D = 2;
const CHIP_R828 = 3;
const CHIP_R828S = 4;
const CHIP_R820C = 5;
const TUNER_RADIO = 1;
const TUNER_ANALOG_TV = 2;
const TUNER_DIGITAL_TV = 3;
const XTAL_LOW_CAP_30P = 0;
const XTAL_LOW_CAP_20P = 1;
const XTAL_LOW_CAP_10P = 2;
const XTAL_LOW_CAP_0P = 3;
const XTAL_HIGH_CAP_0P = 4;


function r82xx_config()
{
    this.i2c_addr = 0;
    this.vco_curr_min = 0;
    this.vco_curr_max = 0;
    this.vco_algo = 0;
    this.harmonic = 0;
    this.xtal = 0;
    this.rafael_chip = 0;
    this.max_i2c_msg_len = 0;
    this.use_predetect = 0;
    this.verbose = 0;
}


function r82xx_priv()
{
    this.cfg = null;
    this.regs = new Uint8Array(NUM_REGS);
    this.buf = new Uint8Array(NUM_REGS + 1);
    this.override_data = new Uint8Array(NUM_REGS);
    this.override_mask = new Uint8Array(NUM_REGS);
    this.xtal_cap_sel = 0;
    this.pll = 0;
    this.rf_freq = 0;
    this.int_freq = 0;
    this.if_band_center_freq = 0;
    this.fil_cal_code = 0;
    this.input = 0;
    this.last_vco_curr = 0;
    this.has_lock = 0;
    this.tuner_pll_set = 0;
    this.tuner_harmonic = 0;
    this.init_done = 0;
    this.sideband = 0;
    this.disable_dither = 0;
    this.delsys = 0;
    this.type = 0;
    this.bw = 0;
    this.rtl_dev = null;
    this.last_if_mode = 0;
    this.last_manual_gain = 0;
    this.last_extended_mode = 0;
    this.last_LNA_value = 0;
    this.last_Mixer_value = 0;
    this.last_VGA_value = 0;
}


function r82xx_freq_range(freq, open_d, rf_mux_ploy, tf_c, xtal_cap20p, xtal_cap10p, xtal_cap0p)
{
    this.freq = freq;
    this.open_d = open_d;
    this.rf_mux_ploy = rf_mux_ploy;
    this.tf_c = tf_c;
    this.xtal_cap20p = xtal_cap20p;
    this.xtal_cap10p = xtal_cap10p;
    this.xtal_cap0p = xtal_cap0p;
}


const SYS_UNDEFINED = 0;
const SYS_DVBT = 1;
const SYS_DVBT2 = 2;
const SYS_ISDBT = 3;
const FIFTH_HARM_FRQ_THRESH_KHZ	= 1770000;
const RETRY_WITH_FIFTH_HARM_KHZ = 1760000;
const DEFAULT_HARMONIC = 5;
const DEFAULT_IF_VGA_VAL = 11;

const r82xx_init_array = new Uint8Array([0x80, 0x13, 0x70, 0xc0, 0x40, 0xdb, 0x6b, 0xe0 | DEFAULT_IF_VGA_VAL,
                                         0x53, 0x75,	0x68, 0x6c,	0xbb, 0x80,	VER_NUM & 0x3f,
                                         0x0f, 0x00,	0xc0, 0x30,	0x48, 0xec,	0x60, 0x00,	0x24, 0xdd,	0x0e, 0x40]);

const freq_ranges = [
                      new r82xx_freq_range(0, 0x08, 0x02, 0xdf, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(50, 0x08, 0x02, 0xbe, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(55, 0x08, 0x02, 0x8b, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(60, 0x08, 0x02, 0x7b, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(65, 0x08, 0x02, 0x69, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(70, 0x08, 0x02, 0x58, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(75, 0x00, 0x02, 0x44, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(80, 0x00, 0x02, 0x44, 0x02, 0x01, 0x00),
                      new r82xx_freq_range(90, 0x00, 0x02, 0x34, 0x01, 0x01, 0x00),
                      new r82xx_freq_range(100, 0x00, 0x02, 0x34, 0x01, 0x01, 0x00),
                      new r82xx_freq_range(110, 0x00, 0x02, 0x24, 0x01, 0x01, 0x00),
                      new r82xx_freq_range(120, 0x00, 0x02, 0x24, 0x01, 0x01, 0x00),
                      new r82xx_freq_range(140, 0x00, 0x02, 0x14, 0x01, 0x01, 0x00),
                      new r82xx_freq_range(180, 0x00, 0x02, 0x13, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(220, 0x00, 0x02, 0x13, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(250, 0x00, 0x02, 0x11, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(280, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(310, 0x00, 0x41, 0x00, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(450, 0x00, 0x41, 0x00, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(588, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00),
                      new r82xx_freq_range(650, 0x00, 0x40, 0x00, 0x00, 0x00, 0x00)
                  ];


function shadow_store(priv, reg, val, len)
{
    let r = reg - REG_SHADOW_START;
    if (r < 0) {
        len += r;
        r = 0;
    }
    if (len <= 0)
        return;
    if (len > NUM_REGS - r)
        len = NUM_REGS - r;
    priv.regs.set(val.subarray(0, len), r);
}


function r82xx_write_arr(priv, reg, val, len)
{
    let size, regOff, regIdx, bufIdx, oldBuf, pos = 0;
    shadow_store(priv, reg, val, len);
    do {
        if (len > priv.cfg.max_i2c_msg_len - 1)
            size = priv.cfg.max_i2c_msg_len - 1;
        else
            size = len;
        priv.buf[0] = reg;
        priv.buf.set(val.subarray(pos, pos + size), 1);
        for (let k = 0; k < size; ++k) {
            regOff = pos + k;
            regIdx = reg - REG_SHADOW_START + regOff;
            if (priv.override_mask[regIdx]) {
                oldBuf = priv.buf[1 + k];
                bufIdx = 1 + k;
                priv.buf[bufIdx] = (priv.buf[bufIdx] & ~priv.override_mask[regIdx]) | (priv.override_mask[regIdx] & priv.override_data[regIdx]);
            }
        }
        let rc = rtlsdr_i2c_write_fn(priv.rtl_dev, priv.cfg.i2c_addr, priv.buf, size + 1);
        if (rc !== size + 1) {
            if (rc < 0)
                return rc;
            return -1;
        }
        reg += size;
        len -= size;
        pos += size;
    } while (len > 0);
    return 0;
}


function r82xx_write_reg(priv, reg, val)
{
    return r82xx_write_arr(priv, reg, new Uint8Array([val]), 1);
}


function r82xx_read_cache_reg(priv, reg)
{
    reg -= REG_SHADOW_START;
    if (reg >= 0 && reg < NUM_REGS)
        return priv.regs[reg];
    else
        return -1;
}


function r82xx_write_reg_mask(priv, reg, val, bit_mask)
{
    let rc = r82xx_read_cache_reg(priv, reg);
    if (rc < 0)
        return rc;
    val = (rc & ~bit_mask) | (val & bit_mask);
    return r82xx_write_arr(priv, reg, new Uint8Array([val]), 1);
}


function r82xx_write_reg_mask_ext(priv, reg, val, bit_mask, func_name)
{
    return r82xx_write_reg_mask(priv, reg, val, bit_mask);
}


function r82xx_bitrev(byte)
{
    let lut = new Uint8Array([0x0, 0x8, 0x4, 0xc, 0x2, 0xa, 0x6, 0xe, 0x1, 0x9, 0x5, 0xd, 0x3, 0xb, 0x7, 0xf]);
    return (lut[byte & 0xf] << 4) | lut[byte >> 4];
}


function r82xx_read(priv, reg, val, len)
{
    let p = priv.buf.subarray(1);

    priv.buf[0] = reg;
    let rc = rtlsdr_i2c_read_fn(priv.rtl_dev, priv.cfg.i2c_addr, p, len);
    if (rc !== len) {
        if (rc < 0)
            return rc;
        return -1;
    }
    for (let i = 0; i < len; i++)
        val[i] = r82xx_bitrev(p[i]);
    return 0;
}


function print_registers(priv)
{
}


function r82xx_set_mux(priv, freq)
{
    let i;
    let val;
    freq = freq / 1000000;
    for (i = 0; i < ARRAY_SIZE(freq_ranges) - 1; i++) {
        if (freq < freq_ranges[i + 1].freq)
            break;
    }
    let range = freq_ranges[i];
    let rc = r82xx_write_reg_mask(priv, 0x17, range.open_d, 0x08);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg_mask(priv, 0x1a, range.rf_mux_ploy, 0xc3);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x1b, range.tf_c);
    if (rc < 0)
        return rc;
    switch (priv.xtal_cap_sel) {
    case XTAL_LOW_CAP_30P:
    case XTAL_LOW_CAP_20P:
        val = range.xtal_cap20p | 0x08;
        break;
    case XTAL_LOW_CAP_10P:
        val = range.xtal_cap10p | 0x08;
        break;
    case XTAL_HIGH_CAP_0P:
        val = range.xtal_cap0p | 0x00;
        break;
    default:
    case XTAL_LOW_CAP_0P:
        val = range.xtal_cap0p | 0x08;
        break;
    }
    rc = r82xx_write_reg_mask(priv, 0x10, val, 0x0b);
    return rc;
}


function r82xx_set_pll_yc(priv, freq)
{
    let vco_min = 1770000000;
    let vco_max = 3900000000;
    let pll_ref = priv.cfg.xtal;
    let pll_ref_2x = pll_ref * 2;
    let rc;
    let vco_exact;
    let vco_frac;
    let con_frac;
    let div_num;
    let n_sdm;
    let sdm;
    let ni;
    let si;
    let nint;
    let val_dith;
    let data = new Uint8Array(5);
    for (div_num = 0; div_num < 5; div_num++) {
        vco_exact = freq << (div_num + 1);
        if (vco_exact >= vco_min && vco_exact <= vco_max)
            break;
    }
    vco_exact = freq << (div_num + 1);
    nint = ((vco_exact + (pll_ref >> 16)) / pll_ref_2x) | 0;
    vco_frac = vco_exact - pll_ref_2x * nint;
    nint -= 13;
    ni = (nint >> 2);
    si = nint - (ni << 2);
    rc = r82xx_write_reg_mask(priv, 0x10, div_num << 5, 0xe0);
    if(rc < 0)
        return rc;
    val_dith = priv.disable_dither ? 0x10 : 0x00;
    rc = r82xx_write_reg_mask(priv, 0x12, val_dith, 0x18);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x14, ni + (si << 6));
    if(rc < 0)
        return rc;
    if (vco_frac === 0) {
        rc = r82xx_write_reg_mask(priv, 0x12, 0x08, 0x08);
        if(rc < 0)
            return rc;
    } else {
        vco_frac += pll_ref >> 16;
        sdm = 0;
        for(n_sdm = 0; n_sdm < 16; n_sdm++) {
            con_frac = pll_ref >> n_sdm;
            if (vco_frac >= con_frac) {
                sdm |= 0x8000 >> n_sdm;
                vco_frac -= con_frac;
                if (vco_frac === 0)
                    break;
            }
        }
        rc = r82xx_write_reg(priv, 0x15, sdm & 0xff);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg(priv, 0x16, sdm >> 8);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x12, 0x00, 0x08);
        if (rc < 0)
            return rc;
    }
    priv.tuner_pll_set = 1;
    rc = r82xx_read(priv, 0x00, data, 3);
    if (rc < 0)
        return rc;
    if (!(data[2] & 0x40)) {
        priv.has_lock = 0;
        return -1;
    }
    priv.has_lock = 1;
    return rc;
}


function r82xx_set_pll(priv, freq)
{
    let rc, i;
    let vco_freq;
    let vco_div;
    let vco_min = 1770000;
    let vco_max = priv.cfg.vco_algo === 0 ? vco_min * 2 : 3900000;
    let freq_khz, pll_ref;
    let sdm = 0;
    let mix_div = 2;
    let div_buf = 0;
    let div_num = 0;
    let vco_power_ref = 2;
    let refdiv2 = 0;
    let ni, si, nint, vco_fine_tune, val;
    let vco_curr_min = priv.cfg.vco_curr_min === 0xff ? 0x80 : priv.cfg.vco_curr_min << 5;
    let vco_curr_max = priv.cfg.vco_curr_max === 0xff ? 0x60 : priv.cfg.vco_curr_max << 5;
    let data = new Uint8Array(5);
    priv.tuner_pll_set = 0;
    if (priv.cfg.vco_algo === 2) {
        if (priv.last_vco_curr !== vco_curr_max) {
            rc = r82xx_write_reg_mask(priv, 0x12, vco_curr_max, 0xe0);
            if (rc < 0)
                return rc;
            priv.last_vco_curr = vco_curr_max;
        }
        return r82xx_set_pll_yc(priv, freq);
    }
    freq_khz = ((freq + 500) / 1000) | 0;
    pll_ref = priv.cfg.xtal;
    rc = r82xx_write_reg_mask(priv, 0x10, refdiv2, 0x10);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg_mask(priv, 0x1a, 0x00, 0x0c);
    if (rc < 0)
        return rc;
    if (priv.last_vco_curr !== vco_curr_min) {
        rc = r82xx_write_reg_mask(priv, 0x12, vco_curr_min, 0xe0);
        if (rc < 0)
            return rc;
        priv.last_vco_curr = vco_curr_min;
    }
    while (mix_div <= 64) {
        if (freq_khz * mix_div >= vco_min && freq_khz * mix_div < vco_max) {
            div_buf = mix_div;
            while (div_buf > 2) {
                div_buf = div_buf >> 1;
                div_num++;
            }
            break;
        }
        mix_div = mix_div << 1;
    }
    rc = r82xx_read(priv, 0x00, data, data.byteLength);
    if (rc < 0)
        return rc;
    if (priv.cfg.rafael_chip === CHIP_R828D)
        vco_power_ref = 1;
    vco_fine_tune = (data[4] & 0x30) >> 4;
    if (vco_fine_tune > vco_power_ref)
        div_num--;
    else if (vco_fine_tune < vco_power_ref)
        div_num++;
    rc = r82xx_write_reg_mask(priv, 0x10, div_num << 5, 0xe0);
    if (rc < 0)
        return rc;
    vco_freq = freq * mix_div;
    vco_div = ((pll_ref + 65536 * vco_freq) / (2 * pll_ref)) | 0;
    nint = (vco_div / 65536) | 0;
    sdm = vco_div % 65536;
    if (nint > (128 / vco_power_ref - 1) | 0)
        return -1;
    ni = ((nint - 13) / 4) | 0;
    si = nint - 4 * ni - 13;
    rc = r82xx_write_reg(priv, 0x14, ni + (si << 6));
    if (rc < 0)
        return rc;
    if (sdm === 0)
        val = 0x08;
    else
        val = 0x00;
    if (priv.disable_dither)
        val |= 0x10;
    rc = r82xx_write_reg_mask(priv, 0x12, val, 0x18);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x16, sdm >> 8);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x15, sdm & 0xff);
    if (rc < 0)
        return rc;
    priv.tuner_pll_set = 1;
    for (i = 0; i < 2; i++) {
        rc = r82xx_read(priv, 0x00, data, 3);
        if (rc < 0)
            return rc;
        if ((data[2] & 0x40) || vco_curr_max === vco_curr_min)
            break;
        if (!i) {
            if (priv.last_vco_curr !== vco_curr_max) {
                rc = r82xx_write_reg_mask(priv, 0x12, vco_curr_max, 0xe0);
                if (rc < 0)
                    return rc;
                priv.last_vco_curr = vco_curr_max;
            }
        }
    }
    if (!(data[2] & 0x40)) {
        priv.has_lock = 0;
        return -1;
    }
    priv.has_lock = 1;
    rc = r82xx_write_reg_mask(priv, 0x1a, 0x08, 0x08);
    return rc;
}


function r82xx_is_tuner_locked(priv)
{
    let rc;
    let data = new Uint8Array(5);
    if (!priv.tuner_pll_set)
        return 1;
    rc = r82xx_read(priv, 0x00, data, sizeof(data));
    if (rc < 0)
        return -3;
    if (!(data[2] & 0x40))
        return 1;
    return 0;
}


function r82xx_sysfreq_sel(priv, type)
{
    let rc;
    let lna_top = 0xe5;
    let pre_dect = 0x40;
    let air_cable1_in = 0x00;
    let cable2_in = 0x00;
    if (priv.cfg.use_predetect) {
        rc = r82xx_write_reg_mask(priv, 0x06, pre_dect, 0x40);
        if (rc < 0)
            return rc;
    }
    priv.input = air_cable1_in;
    rc = r82xx_write_reg_mask(priv, 0x05, air_cable1_in, 0x60);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg_mask(priv, 0x06, cable2_in, 0x08);
    if (rc < 0)
        return rc;
    if (type !== TUNER_ANALOG_TV) {
        rc = r82xx_write_reg_mask(priv, 0x1d, 0, 0x38);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x06, 0, 0x40);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x1a, 0x30, 0x30);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x1d, 0x18, 0x38);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x1a, 0x20, 0x30);
        if (rc < 0)
            return rc;
    } else {
        rc = r82xx_write_reg_mask(priv, 0x06, 0, 0x40);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x1d, lna_top, 0x38);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x1a, 0x00, 0x30);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x10, 0x00, 0x04);
        if (rc < 0)
            return rc;
    }
    return 0;
}


function r82xx_set_tv_standard(priv, type, delsys)
{
    let rc, i;
    let data = new Uint8Array(5);
    let need_calibration = 1;
    let filt_q = 0x10;
    if (type !== TUNER_ANALOG_TV) {
        rc = r82xx_write_reg_mask(priv, 0x1d, 0x00, 0x38);
        if (rc < 0)
            return rc;
    }
    priv.rf_freq = 56000000;
    priv.if_band_center_freq = 0;
    priv.int_freq = 3570000;
    priv.sideband = 0;
    if (need_calibration) {
        for (i = 0; i < 2; i++) {
            rc = r82xx_write_reg_mask(priv, 0x0f, 0x04, 0x04);
            if (rc < 0)
                return rc;
            priv.tuner_pll_set = 0;
            rc = r82xx_set_pll(priv, priv.rf_freq);
            if (rc < 0 || !priv.has_lock)
                return rc;
            rc = r82xx_write_reg_mask_ext(priv, 0x0b, 0x10, 0x10, "r82xx_set_tv_standard");
            if (rc < 0)
                return rc;
            rc = r82xx_write_reg_mask_ext(priv, 0x0b, 0x00, 0x10, "r82xx_set_tv_standard");
            if (rc < 0)
                return rc;
            rc = r82xx_write_reg_mask(priv, 0x0f, 0x00, 0x04);
            if (rc < 0)
                return rc;
            rc = r82xx_read(priv, 0x00, data, data.length);
            if (rc < 0)
                return rc;
            priv.fil_cal_code = data[4] & 0x0f;
            if (priv.fil_cal_code && priv.fil_cal_code !== 0x0f)
                break;
        }
        if (priv.fil_cal_code === 0x0f)
            priv.fil_cal_code = 0;
    }
    rc = r82xx_write_reg_mask_ext(priv, 0x0a, filt_q | priv.fil_cal_code, 0x1f, "r82xx_set_tv_standard");
    if (rc < 0)
        return rc;
    priv.delsys = delsys;
    priv.type = type;
    priv.bw = 3;
    return 0;
}


const VGA_BASE_GAIN = -47;
const r82xx_vga_gain_steps = new Int32Array([0, 26, 26, 30, 42, 35, 24, 13, 14, 32, 36, 34, 35, 37, 35, 36]);
const r82xx_lna_gain_steps = new Int32Array([0, 9, 13, 40, 38, 13, 31, 22, 26, 31, 26, 14, 19, 5, 35, 13]);
const r82xx_mixer_gain_steps = new Int32Array([0, 5, 10, 10, 19, 9, 10, 25, 17, 10, 8, 16, 13, 6, 3, -8]);


function r82xx_get_rf_gain_index(gain, ptr_lna_index, ptr_mix_index)
{
    let total_gain = 0;
    let mix_index = 0;
    let lna_index = 0;
    for (let i = 0; i < 15; i++) {
        if (total_gain >= gain)
            break;
        total_gain += r82xx_lna_gain_steps[++lna_index];
        if (total_gain >= gain)
            break;
        total_gain += r82xx_mixer_gain_steps[++mix_index];
    }
    global1 = lna_index;
    global2 = mix_index;
}


function r82xx_get_if_gain_index(gain)
{
    let vga_index, total_gain = VGA_BASE_GAIN;
    for (vga_index = 0; vga_index < 15; vga_index++) {
        if (total_gain >= gain)
            break;
        total_gain += r82xx_vga_gain_steps[++vga_index];
    }
    return vga_index;
}


function r82xx_get_lna_gain_from_index(lna_index)
{
    let total_gain = 0;
    if (lna_index < 0 || lna_index > 15)
        return 0;
    for (let i = 0; i <= lna_index; ++i)
        total_gain += r82xx_lna_gain_steps[i];
    return total_gain;
}


function r82xx_get_mixer_gain_from_index(mixer_index)
{
    let total_gain = 0;
    if (mixer_index < 0 || mixer_index > 15)
        return 0;
    for (let i = 0; i <= mixer_index; ++i)
        total_gain += r82xx_mixer_gain_steps[i];
    return total_gain;
}


function r82xx_get_vga_gain_from_index(vga_index)
{
    let total_gain = VGA_BASE_GAIN;
    if (vga_index < 0 || vga_index > 15)
        return 0;
    for (let i = 0; i <= vga_index; ++i)
        total_gain += r82xx_vga_gain_steps[i];
    return total_gain;
}


function r82xx_set_gain(priv, set_manual_gain, gain, extended_mode, lna_gain_idx, mixer_gain_idx, vga_gain_idx, rtl_vga_control)
{
    let rc;
    let new_if_mode = priv.last_if_mode;
    let data = new Uint8Array(4);
    if (extended_mode || set_manual_gain) {
        if (set_manual_gain) {
            r82xx_get_rf_gain_index(gain, lna_gain_idx, mixer_gain_idx);
            lna_gain_idx = global1;
            mixer_gain_idx = global2;
        }
        rc = r82xx_write_reg_mask(priv, 0x05, 0x10, 0x10);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x07, 0, 0x10);
        if (rc < 0)
            return rc;
        rc = r82xx_read(priv, 0x00, data, data.byteLength);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x05, lna_gain_idx, 0x0f);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x07, mixer_gain_idx, 0x0f);
        if (rc < 0)
            return rc;
        priv.last_manual_gain = set_manual_gain;
        priv.last_extended_mode = extended_mode;
        priv.last_LNA_value = lna_gain_idx;
        priv.last_Mixer_value = mixer_gain_idx;
        if (extended_mode)
            new_if_mode = vga_gain_idx + 10000;
    } else {
        rc = r82xx_write_reg_mask(priv, 0x05, 0, 0x10);
        if (rc < 0)
            return rc;
        rc = r82xx_write_reg_mask(priv, 0x07, 0x10, 0x10);
        if (rc < 0)
            return rc;
        priv.last_manual_gain = set_manual_gain;
        priv.last_extended_mode = extended_mode;
    }
    rc = r82xx_set_if_mode(priv, new_if_mode, rtl_vga_control);
    if (rtl_vga_control)
        global1 = rtl_vga_control;
    return rc;
}


function r82xx_get_rf_gain(priv)
{
    let lna_gain = r82xx_get_lna_gain_from_index(priv.last_LNA_value);
    let mix_gain = r82xx_get_mixer_gain_from_index(priv.last_Mixer_value);
    let gain = lna_gain + mix_gain;
    return gain;
}


function r82xx_get_if_gain(priv)
{
    let vga_gain = r82xx_get_vga_gain_from_index(priv.last_VGA_value);
    return vga_gain;
}


function r82xx_set_if_mode(priv, if_mode, rtl_vga_control)
{
    let rc = 0, vga_gain_idx = 0;
    if (rtl_vga_control)
        global1 = 0;
    if (0 === if_mode || 10016 === if_mode)
        vga_gain_idx = 0x10;
    else if (-2500 <= if_mode && if_mode <= 2500)
        vga_gain_idx = r82xx_get_if_gain_index(if_mode);
    else if (2500 < if_mode && if_mode < 10000)
        vga_gain_idx = r82xx_get_if_gain_index(if_mode - 5000);
    else if (10000 <= if_mode && if_mode <= 10016 + 15)
        vga_gain_idx = if_mode -10000;
    else {
        if_mode = 10000 + DEFAULT_IF_VGA_VAL;
        vga_gain_idx = DEFAULT_IF_VGA_VAL;
    }
    rc = r82xx_write_reg_mask(priv, 0x0c, vga_gain_idx, 0x1f);
    if (rc < 0)
        return rc;
    priv.last_if_mode = if_mode;
    priv.last_VGA_value = vga_gain_idx;
    if ((vga_gain_idx & 0x10) && rtl_vga_control)
        global1 = 1;
    return rc;
}


function r82xx_set_i2c_register(priv, i2c_register, data, mask)
{
    let reg = i2c_register & 0xff;
    let reg_mask = mask & 0xff;
    let reg_val = data & 0xff;
    return r82xx_write_reg_mask(priv, reg, reg_val, reg_mask);
}


function r82xx_get_i2c_register(priv, data, len)
{
    let rc, len1;
    if (len < 5)
        len1 = len;
    else
        len1 = 5;
    rc = r82xx_read(priv, 0x00, data, len1);
    if (rc < 0)
        return rc;
    if (len > 5)
        for (let i = 5; i < len; i++)
            data[i] = r82xx_read_cache_reg(priv, i);
    return 0;
}


function r82xx_set_i2c_override(priv, i2c_register, data, mask)
{
    let reg = i2c_register & 0xff;
    let reg_mask = mask & 0xff;
    let reg_val = data & 0xff;
    if (REG_SHADOW_START <= reg && reg < REG_SHADOW_START + NUM_REGS) {
        let oldMask = priv.override_mask[reg - REG_SHADOW_START];
        let oldData = priv.override_data[reg - REG_SHADOW_START];
        if (data & ~0xff) {
            priv.override_mask[reg - REG_SHADOW_START] &= ~reg_mask;
            priv.override_data[reg - REG_SHADOW_START] &= ~reg_mask;
        } else {
            priv.override_mask[reg - REG_SHADOW_START] |= reg_mask;
            priv.override_data[reg - REG_SHADOW_START] &= (~reg_mask);
            priv.override_data[reg - REG_SHADOW_START] |= (reg_mask & reg_val);
        }
        return r82xx_write_reg_mask_ext(priv, reg, 0, 0, "r82xx_set_i2c_override");
    } else
        return -1;
}


function IFinfo(sharpCorner, bw, fif, fc, reg10Lo, reg11, reg30Hi)
{
    this.sharpCorner = sharpCorner;
    this.bw = bw;
    this.fif = fif;
    this.fc = fc;
    this.reg10Lo = reg10Lo;
    this.reg11 = reg11;
    this.reg30Hi = reg30Hi;
}


const IFi = [
              new IFinfo(3,  290, 1950, -25, 0x0f, 0xe7, 0x00),
              new IFinfo(3,  375, 1870, -13, 0x0f, 0xe8, 0x00),
              new IFinfo(3,  420, 2100,  21, 0x0f, 0xd7, 0x00),
              new IFinfo(3,  470, 1800, -12, 0x0f, 0xe9, 0x00),
              new IFinfo(3,  600, 1700,   6, 0x0f, 0xea, 0x00),
              new IFinfo(3,  860, 1550,   8, 0x0f, 0xeb, 0x00),
              new IFinfo(3,  950, 2200,   5, 0x0f, 0x88, 0x00),
              new IFinfo(3, 1100, 2100,  25, 0x0f, 0x89, 0x00),
              new IFinfo(3, 1200, 1350,   0, 0x0f, 0xee, 0x00),
              new IFinfo(3, 1300, 2050,  -7, 0x0f, 0x8a, 0x00),
              new IFinfo(3, 1503, 1300, -24, 0x0f, 0xef, 0x60),
              new IFinfo(3, 1600, 1900,   0, 0x0f, 0x8b, 0x00),
              new IFinfo(3, 1753, 1400,  12, 0x0f, 0xcf, 0x60),
              new IFinfo(3, 1800, 1400,   0, 0x0f, 0xaf, 0x00),
              new IFinfo(3, 1953, 1500,  30, 0x0f, 0x8f, 0x60),
              new IFinfo(3, 2200, 1600,   0, 0x0f, 0x8f, 0x00),
              new IFinfo(3, 3000, 2000,   0, 0x04, 0x8f, 0x00),
              new IFinfo(3, 5000, 3570,   0, 0x0b, 0x6b, 0x00)
          ];

const r82xx_bw_tablen = IFi.length;
const FILT_HP_BW1 = 350000;
const FILT_HP_BW2 = 380000;


function r82xx_set_bandwidth(priv, bw, rate, applied_bw, apply)
{
    let rc;
    let i;
    let real_bw = 0;
    let reg_mask;
    let reg_0a;
    let reg_0b;
    let reg_1e = 0x60;
    if (bw > 7000000) {
        applied_bw = 8000000;
        reg_0a = 0x10;
        reg_0b = 0x0b;
        if (apply)
            priv.int_freq = 4570000;
    } else if (bw > 6000000) {
        applied_bw = 7000000;
        reg_0a = 0x10;
        reg_0b = 0x2a;
        if (apply)
            priv.int_freq = 4570000;
    } else if (bw > 4500000) {
        applied_bw = 6000000;
        reg_0a = 0x10;
        reg_0b = 0x6b;
        if (apply)
            priv.int_freq = 3570000;
    } else {
        let bwnext;
        let bwcurr;
        for (i = 0; i < r82xx_bw_tablen - 1; ++i) {
            bwnext = IFi[i + 1].bw * 1000 + (IFi[i + 1].sharpCorner === 2 ? 400 : 0 );
            bwcurr = IFi[i].bw * 1000 + (IFi[i].sharpCorner === 2 ? 400 : 0 );
            if (bw < ((bwnext + bwcurr) / 2) | 0)
                break;
        }
        reg_0a = IFi[i].reg10Lo;
        reg_0b = IFi[i].reg11;
        reg_1e = IFi[i].reg30Hi;
        real_bw = IFi[i].bw * 1000;
        applied_bw = real_bw;
        if (apply)
            priv.int_freq = (IFi[i].fif + IFi[i].fc) * 1000;
    }
    global1 = applied_bw;
    if (!apply)
        return 0;
    reg_mask = 0x0f;
    rc = r82xx_write_reg_mask_ext(priv, 0x0a, reg_0a, reg_mask, "r82xx_set_bandwidth");
    if (rc < 0)
        return rc;
    reg_mask = 0xef;
    rc = r82xx_write_reg_mask_ext(priv, 0x0b, reg_0b, reg_mask, "r82xx_set_bandwidth");
    if (rc < 0)
        return rc;
    reg_mask = 0x40;
    rc = r82xx_write_reg_mask_ext(priv, 0x1e, reg_1e, reg_mask, "r82xx_set_bandwidth");
    return priv.int_freq;
}


function r82xx_set_bw_center(priv, if_band_center_freq)
{
    priv.if_band_center_freq = if_band_center_freq;
    return priv.int_freq;
}


function r82xx_set_sideband(priv, sideband)
{
    let rc;
    priv.sideband = sideband;
    rc = r82xx_write_reg_mask(priv, 0x07, (sideband << 7) & 0x80, 0x80);
    if (rc < 0)
        return rc;
    return 0;
}


function r82xx_get_sideband(priv)
{
    return priv.sideband;
}


const harm_sideband_xor = new Uint32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]);


function r82xx_flip_rtl_sideband(priv)
{
    return harm_sideband_xor[priv.tuner_harmonic];
}


function r82xx_set_freq64(priv, freq)
{
    let rc = -1;
    let nth_harm;
    let harm = (priv.cfg.harmonic <= 0) ? DEFAULT_HARMONIC : priv.cfg.harmonic;
    let lo_freq;
    let lo_freqHarm;
    let air_cable1_in;
    nth_harm = freq > FIFTH_HARM_FRQ_THRESH_KHZ * 1000 ? 1 : 0;
    for (; nth_harm < 2; ++nth_harm ) {
        priv.tuner_pll_set = 0;
        priv.tuner_harmonic = nth_harm ? harm : 0;
        if (!freq)
            freq = priv.rf_freq;
        else
            priv.rf_freq = freq;
        if (priv.sideband ^ harm_sideband_xor[priv.tuner_harmonic] )
            lo_freq = freq - priv.int_freq + priv.if_band_center_freq;
        else
            lo_freq = freq + priv.int_freq + priv.if_band_center_freq;
        lo_freqHarm = nth_harm ? (lo_freq / harm) | 0 : lo_freq;
        rc = r82xx_set_mux(priv, lo_freq);
        if (rc < 0)
            return rc;
        rc = r82xx_set_pll(priv, lo_freqHarm);
        if (rc < 0 || !priv.has_lock) {
            if (!nth_harm && lo_freq > RETRY_WITH_FIFTH_HARM_KHZ * 1000 )
                continue;
            return rc;
        }
        break;
    }
    air_cable1_in = (freq > MHZ(345)) ? 0x00 : 0x60;
    if ((priv.cfg.rafael_chip === CHIP_R828D) && (air_cable1_in !== priv.input)) {
        priv.input = air_cable1_in;
        rc = r82xx_write_reg_mask(priv, 0x05, air_cable1_in, 0x60);
    }
    return rc;
}


function r82xx_set_freq(priv, freq)
{
    return r82xx_set_freq64(priv, freq);
}


function r82xx_set_dither(priv, dither)
{
    priv.disable_dither = !dither;
    return 0;
}


function r82xx_standby(priv)
{
    let rc;
    if (!priv.init_done)
        return 0;
    rc = r82xx_write_reg(priv, 0x06, 0xb1);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x05, 0xa0);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x07, 0x3a);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x08, 0x40);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x09, 0xc0);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x0a, 0x36);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x0c, 0x35);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x0f, 0x68);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x11, 0x03);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x17, 0xf4);
    if (rc < 0)
        return rc;
    rc = r82xx_write_reg(priv, 0x19, 0x0c);
    priv.type = -1;
    return rc;
}


function r82xx_init(priv)
{
    let rc;
    priv.xtal_cap_sel = XTAL_HIGH_CAP_0P;
    priv.rf_freq = 0;
    priv.if_band_center_freq = 0;
    priv.last_if_mode = 0;
    priv.last_manual_gain = 0;
    priv.last_extended_mode = 0;
    priv.last_LNA_value = 0;
    priv.last_Mixer_value = 0;
    priv.last_VGA_value = DEFAULT_IF_VGA_VAL;
    priv.last_vco_curr = 0xff;
    priv.override_data.fill(0);
    priv.override_mask.fill(0);
    rc = r82xx_write_arr(priv, 0x05, r82xx_init_array, r82xx_init_array.length);
    priv.last_vco_curr = r82xx_init_array[0x12 - 0x05] & 0xe0;
    rc = r82xx_set_tv_standard(priv, TUNER_DIGITAL_TV, 0);
    if (rc < 0)
        return rc;
    rc = r82xx_sysfreq_sel(priv, TUNER_DIGITAL_TV);
    priv.init_done = 1;
    return rc;
}


function rtlsdr_tuner_iface_t(init, exit, set_freq, set_freq64, set_bw, set_bw_center, set_gain, set_if_gain, set_gain_mode, set_i2c_register, set_i2c_override, get_i2c_register, get_i2c_reg_array, set_sideband)
{
    this.init = init;
    this.exit = exit;
    this.set_freq = set_freq;
    this.set_freq64 = set_freq64;
    this.set_bw = set_bw;
    this.set_bw_center = set_bw_center;
    this.set_gain = set_gain;
    this.set_if_gain = set_if_gain;
    this.set_gain_mode = set_gain_mode;
    this.set_i2c_register = set_i2c_register;
    this.set_i2c_override = set_i2c_override;
    this.get_i2c_register = get_i2c_register;
    this.get_i2c_reg_array = get_i2c_reg_array;
    this.set_sideband = set_sideband;
}


const RTLSDR_INACTIVE = 0;
const RTLSDR_CANCELING = 1;
const RTLSDR_RUNNING = 2;
const FIR_LEN = 16;
const fir_default = new Int32Array([-54, -36, -41, -40, -32, -14, 14, 53, 101, 156, 215, 273, 327, 372, 404, 421]);
const SOFTAGC_OFF = 0;
const SOFTAGC_ON_CHANGE = 1;
const SOFTAGC_AUTO_ATTEN = 2;
const SOFTAGC_AUTO = 3;
const SOFTSTATE_OFF = 0;
const SOFTSTATE_ON = 1;
const SOFTSTATE_RESET_CONT = 2;
const SOFTSTATE_RESET = 3;
const SOFTSTATE_INIT = 4;


function softagc_state()
{
    this.command_newGain = 0;
    this.command_changeGain = 0;
    this.agcState = 0;
    this.softAgcMode = 0;
    this.verbose = 0;
    this.scanTimeMs = 0;
    this.deadTimeMs = 0;
    this.scanTimeSps = 0;
    this.deadTimeSps = 0;
    this.remainingDeadSps = 0;
    this.remainingScanSps = 0;
    this.numInHisto = 0;
    this.histo = new Int32Array(16);
    this.gainIdx = 0;
    this.softAgcBiasT = 0;
    this.rpcNumGains = 0;
    this.rpcGainValues = null;
    this.timer = rtl.box.timer();
    this.timer.timeout.connect(softagc_control_worker);
}


function rtlsdr_dev()
{
    this.devh = 0;
    this.xfer_buf_num = 0;
    this.xfer_buf_len = 0;
    this.cb = null;
    this.async_status = 0;
    this.async_cancel = 0;
    this.use_zerocopy = 0;
    this.rate = 0;
    this.rtl_xtal = 0;
    this.fir = new Int32Array(FIR_LEN);
    this.direct_sampling = 0;
    this.rtl_vga_control = 0;
    this.tuner_type = 0;
    this.tuner = null;
    this.tun_xtal = 0;
    this.freq = 0;
    this.bw = 0;
    this.offs_freq = 0;
    this.if_band_center_freq = 0;
    this.tuner_if_freqv;
    this.tuner_sideband = 0;
    this.rtl_spectrum_sideband = 0;
    this.corr = 0;
    this.direct_sampling_mode = 0;
    this.direct_sampling_threshold = 0;
    this.e4k_s = new e4k_state();
    this.r82xx_c = new r82xx_config();
    this.r82xx_p = new r82xx_priv();
    this.softagc = new softagc_state();
    this.biast_gpio_pin_no = 0;
    this.gpio_state_known = 0;
    this.gpio_state = 0;
    this.called_set_opt = 0;
    this.dev_lost = 0;
    this.driver_active = 0;
    this.xfer_errors = 0;
    this.i2c_repeater_on = 0;
    this.rc_active = 0;
    this.verbose = 0;
    this.dev_num = 0;
}


function e4000_init(dev)
{
    dev.e4k_s.i2c_addr = E4K_I2C_ADDR;
    rtlsdr_get_xtal_freq(dev, null, dev.e4k_s.vco.fosc);
    dev.e4k_s.vco.fosc = global2;
    dev.e4k_s.rtl_dev = dev;
    return e4k_init(dev.e4k_s);
}


function e4000_exit(dev)
{
    return e4k_standby(dev.e4k_s, 1);
}


function e4000_set_freq(dev, freq)
{
    return e4k_tune_freq(dev.e4k_s, freq);
}


function e4000_set_bw(dev, bw, applied_bw, apply)
{
    let r = 0;
    if (!apply)
        return 0;
    r |= e4k_if_filter_bw_set(dev.e4k_s, E4K_IF_FILTER_MIX, bw);
    r |= e4k_if_filter_bw_set(dev.e4k_s, E4K_IF_FILTER_RC, bw);
    r |= e4k_if_filter_bw_set(dev.e4k_s, E4K_IF_FILTER_CHAN, bw);
    global1 = applied_bw;
    return r;
}


function e4000_set_gain(dev, gain)
{
    let mixgain = gain > 340 ? 12 : 4;
    if (e4k_set_lna_gain(dev.e4k_s, Math.min(300, gain - mixgain * 10)) === -EINVAL)
        return -1;
    if(e4k_mixer_gain_set(dev.e4k_s, mixgain) === -EINVAL)
        return -1;
    return 0;
}


function e4000_set_if_gain(dev, stage, gain)
{
    return e4k_if_gain_set(dev.e4k_s, stage, (gain / 10) | 0);
}


function e4000_set_gain_mode(dev, manual)
{
    return e4k_enable_manual_gain(dev.e4k_s, manual);
}


function fc0012_exit(dev)
{
    return 0;
}


function fc0012_set_freq(dev, freq)
{
    rtlsdr_set_gpio_bit(dev, 6, freq > 300000000 ? 1 : 0);
    return fc0012_set_params(dev, freq, 6000000);
}


function fc0012_set_bw(dev, bw, applied_bw, apply)
{
    global1 = applied_bw;
    return 0;
}


function fc0012_set_gain_mode(dev, manual)
{
    return 0;
}


function _fc0012_set_i2c_register(dev, i2c_register, data, mask )
{
    return fc0012_set_i2c_register(dev, i2c_register, data);
}


function _fc0013_init(dev)
{
    return fc0013_init(dev);
}


function fc0013_exit(dev)
{
    return 0;
}


function fc0013_set_freq(dev, freq)
{
    return fc0013_set_params(dev, freq, 6000000);
}


function fc0013_set_bw(dev, bw, applied_bw, apply)
{
    global1 = applied_bw;
    return 0;
}


function _fc0013_set_gain(dev, gain)
{
    return fc0013_set_lna_gain(dev, gain);
}


function fc2580_init(dev)
{
    return fc2580_Initialize(dev);
}


function fc2580_exit(dev)
{
    return 0;
}


function _fc2580_set_freq(dev, freq)
{
    return fc2580_SetRfFreqHz(dev, freq);
}


function fc2580_set_bw(dev, bw, applied_bw, apply)
{
    global1 = applied_bw;
    if(!apply)
        return 0;
    return fc2580_SetBandwidthMode(dev, 1);
}


function fc2580_set_gain(dev, gain)
{
    return 0;
}


function fc2580_set_gain_mode(dev, manual)
{
    return 0;
}


function r820t_init(dev)
{
    dev.r82xx_p.rtl_dev = dev;
    if (dev.tuner_type === RTLSDR_TUNER_R828D) {
        dev.r82xx_c.i2c_addr = R828D_I2C_ADDR;
        dev.r82xx_c.rafael_chip = CHIP_R828D;
    } else {
        dev.r82xx_c.i2c_addr = R820T_I2C_ADDR;
        dev.r82xx_c.rafael_chip = CHIP_R820T;
    }
    rtlsdr_get_xtal_freq(dev, null, dev.r82xx_c.xtal);
    dev.r82xx_c.xtal = global2;
    dev.r82xx_c.max_i2c_msg_len = 8;
    dev.r82xx_c.use_predetect = 0;
    dev.r82xx_p.cfg = dev.r82xx_c;
    return r82xx_init(dev.r82xx_p);
}


function r820t_exit(dev)
{
    return r82xx_standby(dev.r82xx_p);
}


function r820t_set_freq64(dev, freq)
{
    let r = r82xx_set_freq64(dev.r82xx_p, freq);
    let sideband = r82xx_get_sideband(dev.r82xx_p);
    let flip = r82xx_flip_rtl_sideband(dev.r82xx_p);
    let ri = rtlsdr_set_spectrum_inversion(dev, sideband ^ flip);
    if (ri)
        return ri;
    return r;
}


function r820t_set_freq(dev, freq)
{
    return r820t_set_freq64(dev, freq);
}


function r820t_set_bw(dev, bw, applied_bw, apply)
{
    let r;
    let iffreq = r82xx_set_bandwidth(dev.r82xx_p, bw, dev.rate, applied_bw, apply);
    applied_bw = global1;
    if (!apply)
        return 0;
    if (iffreq < 0) {
        r = iffreq;
        return r;
    }
    dev.tuner_if_freq = iffreq;
    iffreq = dev.tuner_sideband ? dev.tuner_if_freq - dev.if_band_center_freq : dev.tuner_if_freq + dev.if_band_center_freq;
    r = rtlsdr_set_if_freq(dev, iffreq);
    if (r)
        return r;
    r = rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function r820t_set_bw_center(dev, if_band_center_freq)
{
    let r;
    let iffreq = r82xx_set_bw_center(dev.r82xx_p, if_band_center_freq);
    if (iffreq < 0) {
        r = iffreq;
        return r;
    }
    dev.tuner_if_freq = iffreq;
    dev.if_band_center_freq = if_band_center_freq;
    iffreq = dev.tuner_sideband ? dev.tuner_if_freq - dev.if_band_center_freq : dev.tuner_if_freq + dev.if_band_center_freq;
    r = rtlsdr_set_if_freq(dev, iffreq);
    if (r)
        return r;
    r = rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function rtlsdr_vga_control(dev, rc, rtl_vga_control)
{
    if (rc < 0)
        return rc;
    if (rtl_vga_control !== dev.rtl_vga_control )
        dev.rtl_vga_control = rtl_vga_control;
    return rc;
}


function r820t_set_gain(dev, gain)
{
    let rc, rtl_vga_control = 0;
    rc = r82xx_set_gain(dev.r82xx_p, 1, gain, 0, 0, 0, 0, rtl_vga_control);
    rtl_vga_control = global1;
    rc = rtlsdr_vga_control(dev, rc, rtl_vga_control);
    return rc;
}


function r820t_set_gain_ext(dev, lna_gain, mixer_gain, vga_gain)
{
    let rc, rtl_vga_control = 0;
    rc = r82xx_set_gain(dev.r82xx_p, 0, 0, 1, lna_gain, mixer_gain, vga_gain, rtl_vga_control);
    rtl_vga_control = global1;
    rc = rtlsdr_vga_control(dev, rc, rtl_vga_control);
    return rc;
}


function r820t_set_if_mode(dev, if_mode)
{
    let rc, rtl_vga_control = 0;
    rc = r82xx_set_if_mode(dev.r82xx_p, if_mode, rtl_vga_control);
    rtl_vga_control = global1;
    rc = rtlsdr_vga_control(dev, rc, rtl_vga_control);
    return rc;
}


function r820t_set_gain_mode(dev, manual)
{
    let rc, rtl_vga_control = 0;
    rc = r82xx_set_gain(dev.r82xx_p, manual, 0, 0, 0, 0, 0, rtl_vga_control);
    rtl_vga_control = global1;
    rc = rtlsdr_vga_control(dev, rc, rtl_vga_control);
    return rc;
}


function r820t_get_i2c_register(dev, reg)
{
    return r82xx_read_cache_reg(dev.r82xx_p, reg);
}


function r820t_set_i2c_register(dev, i2c_register, data, mask)
{
    return r82xx_set_i2c_register(dev.r82xx_p, i2c_register, data, mask);
}


function r820t_get_i2c_reg_array(dev, data, len)
{
    return r82xx_get_i2c_register(dev.r82xx_p, data, len);
}


function r820t_set_sideband(dev, sideband)
{
    let r = r82xx_set_sideband(dev.r82xx_p, sideband);
    if(r < 0)
        return r;
    let flip = r82xx_flip_rtl_sideband(dev.r82xx_p);
    r = rtlsdr_set_spectrum_inversion(dev, sideband ^ flip);
    if (r)
        return r;
    if (!dev.freq)
        return r;
    r = rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function r820t_set_i2c_override(dev, i2c_register, data, mask)
{
    return r82xx_set_i2c_override(dev.r82xx_p, i2c_register, data, mask);
}


const tuners = [
                 new rtlsdr_tuner_iface_t(null, null, null, null, null, null, null, null, null, null, null, null, null, null),
                 new rtlsdr_tuner_iface_t(e4000_init, e4000_exit, e4000_set_freq, null, e4000_set_bw, null, e4000_set_gain, e4000_set_if_gain, e4000_set_gain_mode, null, null, null, null, null),
                 new rtlsdr_tuner_iface_t(fc0012_init, fc0012_exit, fc0012_set_freq, null, fc0012_set_bw, null, fc0012_set_gain, null, fc0012_set_gain_mode, _fc0012_set_i2c_register, null, null, fc0012_get_i2c_register, null),
                 new rtlsdr_tuner_iface_t(_fc0013_init, fc0013_exit, fc0013_set_freq, null, fc0013_set_bw, null, _fc0013_set_gain, null, fc0013_set_gain_mode, null, null, null, null, null),
                 new rtlsdr_tuner_iface_t(fc2580_init, fc2580_exit, _fc2580_set_freq, null, fc2580_set_bw, null, fc2580_set_gain, null, fc2580_set_gain_mode, null, null, null, null, null),
                 new rtlsdr_tuner_iface_t(r820t_init, r820t_exit, r820t_set_freq, r820t_set_freq64, r820t_set_bw, r820t_set_bw_center, r820t_set_gain, null, r820t_set_gain_mode, r820t_set_i2c_register, r820t_set_i2c_override, r820t_get_i2c_register, r820t_get_i2c_reg_array, r820t_set_sideband),
                 new rtlsdr_tuner_iface_t(r820t_init, r820t_exit, r820t_set_freq, r820t_set_freq64, r820t_set_bw, r820t_set_bw_center, r820t_set_gain, null, r820t_set_gain_mode, r820t_set_i2c_register, r820t_set_i2c_override, r820t_get_i2c_register, r820t_get_i2c_reg_array, r820t_set_sideband)
             ];


function rtlsdr_dongle_t(vid, pid, name)
{
    this.vid = vid;
    this.pid = pid;
    this.name = name;
}


const known_devices = [
                        new rtlsdr_dongle_t(0x0bda, 0x2832, "Generic RTL2832U"),
                        new rtlsdr_dongle_t(0x0bda, 0x2838, "Generic RTL2832U OEM"),
                        new rtlsdr_dongle_t(0x0413, 0x6680, "DigitalNow Quad DVB-T PCI-E card"),
                        new rtlsdr_dongle_t(0x0413, 0x6f0f, "Leadtek WinFast DTV Dongle mini D"),
                        new rtlsdr_dongle_t(0x0458, 0x707f, "Genius TVGo DVB-T03 USB dongle (Ver. B)"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00a9, "Terratec Cinergy T Stick Black (rev 1)"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b3, "Terratec NOXON DAB/DAB+ USB dongle (rev 1)"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b4, "Terratec Deutschlandradio DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b5, "Terratec NOXON DAB Stick - Radio Energy"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b7, "Terratec Media Broadcast DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b8, "Terratec BR DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00b9, "Terratec WDR DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00c0, "Terratec MuellerVerlag DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00c6, "Terratec Fraunhofer DAB Stick"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00d3, "Terratec Cinergy T Stick RC (Rev.3)"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00d7, "Terratec T Stick PLUS"),
                        new rtlsdr_dongle_t(0x0ccd, 0x00e0, "Terratec NOXON DAB/DAB+ USB dongle (rev 2)"),
                        new rtlsdr_dongle_t(0x1209, 0x2832, "Generic RTL2832U"),
                        new rtlsdr_dongle_t(0x1554, 0x5020, "PixelView PV-DT235U(RN)"),
                        new rtlsdr_dongle_t(0x15f4, 0x0131, "Astrometa DVB-T/DVB-T2"),
                        new rtlsdr_dongle_t(0x15f4, 0x0133, "HanfTek DAB+FM+DVB-T"),
                        new rtlsdr_dongle_t(0x185b, 0x0620, "Compro Videomate U620F"),
                        new rtlsdr_dongle_t(0x185b, 0x0650, "Compro Videomate U650F"),
                        new rtlsdr_dongle_t(0x185b, 0x0680, "Compro Videomate U680F"),
                        new rtlsdr_dongle_t(0x1b80, 0xd393, "GIGABYTE GT-U7300"),
                        new rtlsdr_dongle_t(0x1b80, 0xd394, "DIKOM USB-DVBT HD"),
                        new rtlsdr_dongle_t(0x1b80, 0xd395, "Peak 102569AGPK"),
                        new rtlsdr_dongle_t(0x1b80, 0xd397, "KWorld KW-UB450-T USB DVB-T Pico TV"),
                        new rtlsdr_dongle_t(0x1b80, 0xd398, "Zaapa ZT-MINDVBZP"),
                        new rtlsdr_dongle_t(0x1b80, 0xd39d, "SVEON STV20 DVB-T USB & FM"),
                        new rtlsdr_dongle_t(0x1b80, 0xd3a4, "Twintech UT-40"),
                        new rtlsdr_dongle_t(0x1b80, 0xd3a8, "ASUS U3100MINI_PLUS_V2"),
                        new rtlsdr_dongle_t(0x1b80, 0xd3af, "SVEON STV27 DVB-T USB & FM"),
                        new rtlsdr_dongle_t(0x1b80, 0xd3b0, "SVEON STV21 DVB-T USB & FM"),
                        new rtlsdr_dongle_t(0x1d19, 0x1101, "Dexatek DK DVB-T Dongle (Logilink VG0002A)"),
                        new rtlsdr_dongle_t(0x1d19, 0x1102, "Dexatek DK DVB-T Dongle (MSI DigiVox mini II V3.0)"),
                        new rtlsdr_dongle_t(0x1d19, 0x1103, "Dexatek Technology Ltd. DK 5217 DVB-T Dongle"),
                        new rtlsdr_dongle_t(0x1d19, 0x1104, "MSI DigiVox Micro HD"),
                        new rtlsdr_dongle_t(0x1f4d, 0xa803, "Sweex DVB-T USB"),
                        new rtlsdr_dongle_t(0x1f4d, 0xb803, "GTek T803"),
                        new rtlsdr_dongle_t(0x1f4d, 0xc803, "Lifeview LV5TDeluxe"),
                        new rtlsdr_dongle_t(0x1f4d, 0xd286, "MyGica TD312"),
                        new rtlsdr_dongle_t(0x1f4d, 0xd803, "PROlectrix DV107669")
                    ];

const DEFAULT_BUF_NUMBER = 15;
const DEFAULT_BUF_LENGTH = 16 * 32 * 512;
const DEF_RTL_XTAL_FREQ	= 28800000;
const MIN_RTL_XTAL_FREQ = DEF_RTL_XTAL_FREQ - 1000;
const MAX_RTL_XTAL_FREQ = DEF_RTL_XTAL_FREQ + 1000;
const CTRL_IN = (0x02 << 5) | 0x80;
const CTRL_OUT = (0x02 << 5) | 0x00;
const CTRL_TIMEOUT = 300;
const BULK_TIMEOUT = 0;
const EEPROM_ADDR = 0xa0;
const USB_SYSCTL = 0x2000;
const USB_CTRL = 0x2010;
const USB_STAT = 0x2014;
const USB_EPA_CFG = 0x2144;
const USB_EPA_CTL = 0x2148;
const USB_EPA_MAXPKT = 0x2158;
const USB_EPA_MAXPKT_2 = 0x215a;
const USB_EPA_FIFO_CFG = 0x2160;
const DEMOD_CTL = 0x3000;
const GPO = 0x3001;
const GPI = 0x3002;
const GPOE = 0x3003;
const GPD = 0x3004;
const SYSINTE = 0x3005;
const SYSINTS = 0x3006;
const GP_CFG0 = 0x3007;
const GP_CFG1 = 0x3008;
const SYSINTE_1 = 0x3009;
const SYSINTS_1 = 0x300a;
const DEMOD_CTL_1 = 0x300b;
const IR_SUSPEND = 0x300c;
const SYS_IRRC_PSR = 0x3020;
const SYS_IRRC_PER = 0x3024;
const SYS_IRRC_SF = 0x3028;
const SYS_IRRC_DPIR = 0x302c;
const SYS_IRRC_CR = 0x3030;
const SYS_IRRC_RP = 0x3034;
const SYS_IRRC_SR = 0x3038;
const SYS_I2CCR = 0x3040;
const SYS_I2CMCR = 0x3044;
const SYS_I2CMSTR = 0x3048;
const SYS_I2CMSR = 0x304c;
const SYS_I2CMFR = 0x3050;
const IR_RX_BUF = 0xfc00;
const IR_RX_IE = 0xfd00;
const IR_RX_IF = 0xfd01;
const IR_RX_CTRL = 0xfd02;
const IR_RX_CFG = 0xfd03;
const IR_MAX_DURATION0 = 0xfd04;
const IR_MAX_DURATION1 = 0xfd05;
const IR_IDLE_LEN0 = 0xfd06;
const IR_IDLE_LEN1 = 0xfd07;
const IR_GLITCH_LEN = 0xfd08;
const IR_RX_BUF_CTRL = 0xfd09;
const IR_RX_BUF_DATA = 0xfd0a;
const IR_RX_BC = 0xfd0b;
const IR_RX_CLK = 0xfd0d;
const IR_RX_C_COUNT_L = 0xfd0d;
const IR_RX_C_COUNT_H = 0xfd0e;
const IR_SUSPEND_CTRL = 0xfd10;
const IR_ERR_TOL_CTRL = 0xfd11;
const IR_UNIT_LEN = 0xfd12;
const IR_ERR_TOL_LEN = 0xfd13;
const IR_MAX_H_TOL_LEN = 0xfd14;
const IR_MAX_L_TOL_LEN = 0xfd15;
const IR_MASK_CTRL = 0xfd16;
const IR_MASK_DATA = 0xfd17;
const IR_RES_MASK_ADDR = 0xfd18;
const IR_RES_MASK_T_LEN = 0xfd19;
const DEMODB = 0;
const USBB = 1;
const SYSB = 2;
const TUNB = 3;
const ROMB = 4;
const IRB = 5;
const IICB = 6;

const dsmode_str = [
                     "0: use I & Q",
                     "1: use I",
                     "2: use Q",
                     "3: use I below threshold frequency",
                     "4: use Q below threshold frequency"
                 ];


function rtlsdr_read_array(dev, block, addr, array, len)
{
    let index = block << 8;
    if (block === IRB)
        index = (SYSB << 8) | 0x01;
    let r = rtl.box.USB_control_transfer(dev.devh, CTRL_IN, 0, addr, index, array.buffer, len, CTRL_TIMEOUT);
    if (r.byteLength === 0)
        return -1;
    else {
        array.set(new Uint8Array(r));
        return r.byteLength;
    }
}


function rtlsdr_write_array(dev, block, addr, array, len)
{
    let index = (block << 8) | 0x10;
    if (block === IRB)
        index = (SYSB << 8) | 0x11;
    let r = rtl.box.USB_control_transfer(dev.devh, CTRL_OUT, 0, addr, index, array.buffer, len, CTRL_TIMEOUT);
    if (r.byteLength === 0)
        return -1;
    else {
        array.set(new Uint8Array(r));
        return r.byteLength;
    }
}


function rtlsdr_i2c_write_reg(dev, i2c_addr, reg, val)
{
    let data = new Uint8Array([reg, val]);
    return rtlsdr_write_array(dev, IICB, i2c_addr, data, 2);
}


function rtlsdr_i2c_read_reg(dev, i2c_addr, reg)
{
    let data = new Uint8Array(1);
    rtlsdr_write_array(dev, IICB, i2c_addr, new Uint8Array([reg]), 1);
    rtlsdr_read_array(dev, IICB, i2c_addr, data, 1);
    return data[0];
}


function rtlsdr_i2c_write(dev, i2c_addr, buffer, len)
{
    if (!dev)
        return -1;
    return rtlsdr_write_array(dev, IICB, i2c_addr, buffer, len);
}


function rtlsdr_i2c_read(dev, i2c_addr, buffer, len)
{
    if (!dev)
        return -1;
    return rtlsdr_read_array(dev, IICB, i2c_addr, buffer, len);
}


function rtlsdr_read_reg(dev, block, addr, len)
{
    let data = new Uint8Array(2);
    let reg;
    let index = block << 8;
    if (block === IRB)
        index = (SYSB << 8) | 0x01;
    data = rtl.box.USB_control_transfer(dev.devh, CTRL_IN, 0, addr, index, data.buffer, len, CTRL_TIMEOUT);
    reg = (data[1] << 8) | data[0];
    return reg;
}


function rtlsdr_write_reg(dev, block, addr, val, len)
{
    let data = new Uint8Array(2);
    let index = (block << 8) | 0x10;
    if (block === IRB)
        index = (SYSB << 8) | 0x11;
    if (len === 1)
        data[0] = val & 0xff;
    else
        data[0] = val >> 8;
    data[1] = val & 0xff;
    let r = rtl.box.USB_control_transfer(dev.devh, CTRL_OUT, 0, addr, index, data.buffer, len, CTRL_TIMEOUT);
    if (r.byteLength === 0)
        return -1;
    else
        return r.byteLength;
}


function rtlsdr_demod_read_reg(dev, page, addr, len)
{
    let data = new Uint8Array(2);
    let index = page;
    let reg;
    addr = (addr << 8) | 0x20;
    data = rtl.box.USB_control_transfer(dev.devh, CTRL_IN, 0, addr, index, data.buffer, len, CTRL_TIMEOUT);
    reg = (data[1] << 8) | data[0];
    return reg;
}


function rtlsdr_demod_write_reg(dev, page, addr, val, len)
{
    let data = new Uint8Array(2);
    let index = 0x10 | page;
    addr = (addr << 8) | 0x20;
    if (len === 1)
        data[0] = val & 0xff;
    else
        data[0] = val >> 8;
    data[1] = val & 0xff;
    let r = rtl.box.USB_control_transfer(dev.devh, CTRL_OUT, 0, addr, index, data.buffer, len, CTRL_TIMEOUT);
    rtlsdr_demod_read_reg(dev, 0x0a, 0x01, 1);
    return 0;
}


function rtlsdr_set_gpio_bit(dev, gpio, val)
{
    gpio = 1 << gpio;
    let r = rtlsdr_read_reg(dev, SYSB, GPO, 1);
    r = val ? r | gpio : r & ~gpio;
    let retval = rtlsdr_write_reg(dev, SYSB, GPO, r, 1);
    return retval;
}


function rtlsdr_set_gpio_output(dev, gpio)
{
    let retval = 0;
    gpio = 1 << gpio;
    if (!(dev.gpio_state_known & gpio) || (dev.gpio_state & gpio)) {
        let r = rtlsdr_read_reg(dev, SYSB, GPD, 1);
        retval = rtlsdr_write_reg(dev, SYSB, GPD, r & ~gpio, 1);
        if (retval < 0)
            return retval;
        r = rtlsdr_read_reg(dev, SYSB, GPOE, 1);
        retval = rtlsdr_write_reg(dev, SYSB, GPOE, r | gpio, 1);
        if (retval < 0)
            return retval;
        dev.gpio_state_known |= gpio;
        dev.gpio_state &= ~gpio;
    }
    return retval;
}


function rtlsdr_get_gpio_bit(dev, gpio, val)
{
    gpio = 1 << gpio;
    let r = rtlsdr_read_reg(dev, SYSB, GPI, 1);
    val = (r & gpio) ? 1 : 0;
    global1 = val;
    return 0;
}


function rtlsdr_set_gpio_input(dev, gpio)
{
    let retval = 0;
    gpio = 1 << gpio;
    if (!(dev.gpio_state_known & gpio) || !(dev.gpio_state & gpio)) {
        let r = rtlsdr_read_reg(dev, SYSB, GPD, 1);
        retval = rtlsdr_write_reg(dev, SYSB, GPD, r | gpio, 1);
        if (retval < 0)
            return retval;
        r = rtlsdr_read_reg(dev, SYSB, GPOE, 1);
        retval = rtlsdr_write_reg(dev, SYSB, GPOE, r & ~gpio, 1);
        if (retval < 0)
            return retval;
        dev.gpio_state_known |= gpio;
        dev.gpio_state |= gpio;
    }
    return retval;
}


function rtlsdr_set_gpio_status(dev, status)
{
    let r = rtlsdr_read_reg(dev, SYSB, GPD, 1);
    status = r;
    globa11 = status;
    return 0;
}


function rtlsdr_get_gpio_byte(dev, val)
{
    val = rtlsdr_read_reg(dev, SYSB, GPI, 1);
    global1 = val;
    return 0;
}


function rtlsdr_set_gpio_byte(dev, val)
{
    let retval = rtlsdr_write_reg(dev, SYSB, GPO, val, 1);
    return retval;
}


function rtlsdr_set_i2c_repeater(dev, on)
{
    if (on !== dev.i2c_repeater_on) {
        dev.i2c_repeater_on = on;
        rtlsdr_demod_write_reg(dev, 1, 0x01, on ? 0x18 : 0x10, 1);
    }
}


function rtlsdr_set_fir(dev)
{
    let fir = new Uint8Array(20);
    let i;
    let val;
    for (i = 0; i < 8; ++i) {
        val = dev.fir[i];
        if (val < -128 || val > 127)
            return -1;
        fir[i] = val;
    }
    let val0, val1;
    for (i = 0; i < 8; i += 2) {
        val0 = dev.fir[8 + i];
        val1 = dev.fir[9 + i];
        if (val0 < -2048 || val0 > 2047 || val1 < -2048 || val1 > 2047)
            return -1;
        fir[(8 + i * 3 / 2) | 0] = val0 >> 4;
        fir[(9 + i * 3 / 2) | 0] = (val0 << 4) | ((val1 >> 8) & 0x0f);
        fir[(10 + i * 3 / 2) | 0] = val1;
    }
    for (i = 0; i < 20; i++)
        if (rtlsdr_demod_write_reg(dev, 1, 0x1c + i, fir[i], 1))
            return -1;
    return 0;
}


function rtlsdr_init_baseband(dev)
{
    rtlsdr_write_reg(dev, USBB, USB_SYSCTL, 0x09, 1);
    rtlsdr_write_reg(dev, USBB, USB_EPA_MAXPKT, 0x0002, 2);
    rtlsdr_write_reg(dev, USBB, USB_EPA_CTL, 0x1002, 2);
    rtlsdr_write_reg(dev, SYSB, DEMOD_CTL_1, 0x22, 1);
    rtlsdr_write_reg(dev, SYSB, DEMOD_CTL, 0xe8, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x01, 0x14, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x01, 0x10, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x15, 0x00, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x16, 0x0000, 2);
    for (let i = 0; i < 6; i++)
        rtlsdr_demod_write_reg(dev, 1, 0x16 + i, 0x00, 1);
    rtlsdr_set_fir(dev);
    rtlsdr_demod_write_reg(dev, 0, 0x19, 0x05, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x93, 0xf0, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x94, 0x0f, 1);
    rtlsdr_demod_write_reg(dev, 1, 0x11, 0x00, 1);
    dev.rtl_vga_control = 0;
    rtlsdr_demod_write_reg(dev, 0, 0x61, 0x60, 1);
    rtlsdr_demod_write_reg(dev, 0, 0x06, 0x80, 1);
    rtlsdr_demod_write_reg(dev, 1, 0xb1, 0x1b, 1);
    rtlsdr_demod_write_reg(dev, 0, 0x0d, 0x83, 1);
}


function rtlsdr_deinit_baseband(dev)
{
    let r = 0;
    if (!dev)
        return -1;
    if (dev.tuner && dev.tuner.exit) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.exit(dev);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    rtlsdr_write_reg(dev, SYSB, DEMOD_CTL, 0x20, 1);
    return r;
}


function rtlsdr_set_if_freq(dev, freq)
{
    let rtl_xtal;
    let if_freq;
    let tmp;
    let r;
    if (!dev)
        return -1;
    if (rtlsdr_get_xtal_freq(dev, rtl_xtal, null))
        return -2;
    rtl_xtal = global1;
    if_freq = (-freq * TWO_POW(22) / rtl_xtal) | 0;
    tmp = (if_freq >> 16) & 0x3f;
    r = rtlsdr_demod_write_reg(dev, 1, 0x19, tmp, 1);
    tmp = (if_freq >> 8) & 0xff;
    r |= rtlsdr_demod_write_reg(dev, 1, 0x1a, tmp, 1);
    tmp = if_freq & 0xff;
    r |= rtlsdr_demod_write_reg(dev, 1, 0x1b, tmp, 1);
    return r;
}


function rtlsdr_set_spectrum_inversion(dev, sideband)
{
    let r = 0;
    if (dev.rtl_spectrum_sideband !== sideband + 1) {
        if(sideband)
            r = rtlsdr_demod_write_reg(dev, 1, 0x15, 0x00, 1);
        else
            r = rtlsdr_demod_write_reg(dev, 1, 0x15, 0x01, 1);
        dev.rtl_spectrum_sideband = r ? 0 : sideband + 1;
    }
    return r;
}


function rtlsdr_set_sample_freq_correction(dev, ppm)
{
    let r = 0;
    let tmp;
    let offs = (-ppm * TWO_POW(24) / 1000000) | 0;
    tmp = offs & 0xff;
    r |= rtlsdr_demod_write_reg(dev, 1, 0x3f, tmp, 1);
    tmp = (offs >> 8) & 0x3f;
    r |= rtlsdr_demod_write_reg(dev, 1, 0x3e, tmp, 1);
    return r;
}


function rtlsdr_set_xtal_freq(dev, rtl_freq, tuner_freq)
{
    let r = 0;
    if (!dev)
        return -1;
    if (rtl_freq > 0 && (rtl_freq < MIN_RTL_XTAL_FREQ || rtl_freq > MAX_RTL_XTAL_FREQ))
        return -2;
    if (rtl_freq > 0 && dev.rtl_xtal !== rtl_freq) {
        dev.rtl_xtal = rtl_freq;
        if (dev.rate)
            r = rtlsdr_set_sample_rate(dev, dev.rate);
    }
    if (dev.tun_xtal !== tuner_freq) {
        if (0 === tuner_freq)
            dev.tun_xtal = dev.rtl_xtal;
        else
            dev.tun_xtal = tuner_freq;
        if (rtlsdr_get_xtal_freq(dev, null, dev.e4k_s.vco.fosc)) {
            dev.e4k_s.vco.fosc = global2;
            return -3;
        }
        if (rtlsdr_get_xtal_freq(dev, null, dev.r82xx_c.xtal)) {
            dev.r82xx_c.xtal = global2;
            return -3;
        }
        if (dev.freq)
            r = rtlsdr_set_center_freq64(dev, dev.freq);
    }
    return r;
}


function rtlsdr_get_xtal_freq(dev, rtl_freq, tuner_freq)
{
    if (!dev)
        return -1;
    if (rtl_freq !== null)
        rtl_freq = (dev.rtl_xtal * (1 + dev.corr / 1000000)) | 0;
    if (tuner_freq !== null)
        tuner_freq = (dev.tun_xtal * (1 + dev.corr / 1000000)) | 0;
    global1 = rtl_freq;
    global2 = tuner_freq;
    return 0;
}


function rtlsdr_get_usb_strings(dev, manufact, product, serial)
{
    if (!dev)
        return -1;
    if (!dev.devh)
        return -1;
    let device = rtl.box.USB_get_device(dev.devh);
    let dd = rtl.box.USB_get_device_descriptor(device);
    if (dd.length === 0)
        return -1;
    if (manufact)
        manufact = rtl.box.USB_get_string_descriptor_ascii(dev.devh, dd[Box.USB_iManufacturer]);
    if (product)
        product = rtl.box.USB_get_string_descriptor_ascii(dev.devh, dd[Box.USB_iProduct]);
    if (serial)
        serial = rtl.box.USB_get_string_descriptor_ascii(dev.devh, dd[Box.USB_iSerialNumber]);
    global1 = manufact;
    global2 = product;
    global3 = serial;
    return 0;
}


function rtlsdr_write_eeprom(dev, data, offset, len)
{
    let r = 0;
    let cmd = Uint8Array(2);
    if (!dev)
        return -1;
    if (len + offset > 256)
        return -2;
    for (let i = 0; i < len; i++) {
        cmd[0] = i + offset;
        r = rtlsdr_write_array(dev, IICB, EEPROM_ADDR, cmd, 1);
        r = rtlsdr_read_array(dev, IICB, EEPROM_ADDR, cmd.subarray(1), 1);
        if (cmd[1] === data[i])
            continue;
        cmd[1] = data[i];
        r = rtlsdr_write_array(dev, IICB, EEPROM_ADDR, cmd, 2);
        if (r !== 2)
            return -3;
        rtl.box.sleep(5);
    }
    return 0;
}


function rtlsdr_read_eeprom(dev, data, offset, len)
{
    let r = 0;
    if (!dev)
        return -1;
    if (len + offset > 256)
        return -2;
    r = rtlsdr_write_array(dev, IICB, EEPROM_ADDR, new Uint8Array([offset]), 1);
    if (r < 0)
        return -3;
    for (let i = 0; i < len; i++) {
        r = rtlsdr_read_array(dev, IICB, EEPROM_ADDR, data.subarray(i), 1);
        if (r < 0)
            return -3;
    }
    return r;
}


function rtlsdr_set_center_freq(dev, freq)
{
    let r = -1;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.direct_sampling_mode > RTLSDR_DS_Q)
        rtlsdr_update_ds(dev, freq);
    if (dev.direct_sampling)
        r = rtlsdr_set_if_freq(dev, freq);
    else if (dev.tuner && dev.tuner.set_freq) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_freq(dev, freq - dev.offs_freq);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    if (!r)
        dev.freq = freq;
    else
        dev.freq = 0;
    return r;
}


function rtlsdr_set_center_freq64(dev, freq)
{
    let r = -1;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.direct_sampling_mode > RTLSDR_DS_Q)
        rtlsdr_update_ds(dev, freq);
    if (dev.direct_sampling)
        r = rtlsdr_set_if_freq(dev, freq);
    else if (dev.tuner && dev.tuner.set_freq64) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_freq64(dev, freq - dev.offs_freq);
        rtlsdr_set_i2c_repeater(dev, 0);
    } else if (dev.tuner && dev.tuner.set_freq) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_freq(dev, freq - dev.offs_freq);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    if (!r)
        dev.freq = freq;
    else
        dev.freq = 0;
    return r;
}


function rtlsdr_is_tuner_PLL_locked(dev)
{
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner_type !== RTLSDR_TUNER_R820T && dev.tuner_type !== RTLSDR_TUNER_R828D )
        return -2;
    rtlsdr_set_i2c_repeater(dev, 1);
    let r = r82xx_is_tuner_locked(dev.r82xx_p);
    rtlsdr_set_i2c_repeater(dev, 0);
    return r;
}


function rtlsdr_get_center_freq(dev)
{
    if (!dev)
        return 0;
    return dev.freq;
}


function rtlsdr_get_center_freq64(dev)
{
    if (!dev)
        return 0;
    return dev.freq;
}


function rtlsdr_set_freq_correction(dev, ppm)
{
    let r = 0;
    if (!dev)
        return -1;
    if (dev.corr === ppm)
        return -2;
    dev.corr = ppm;
    r |= rtlsdr_set_sample_freq_correction(dev, ppm);
    if (rtlsdr_get_xtal_freq(dev, null, dev.e4k_s.vco.fosc)) {
        dev.e4k_s.vco.fosc = global2;
        return -3;
    }
    if (rtlsdr_get_xtal_freq(dev, null, dev.r82xx_c.xtal)) {
        dev.r82xx_c.xtal = global2;
        return -3;
    }
    if (dev.freq)
        r |= rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function rtlsdr_get_freq_correction(dev)
{
    if (!dev)
        return 0;
    return dev.corr;
}


function rtlsdr_get_tuner_type(dev)
{
    if (!dev)
        return RTLSDR_TUNER_UNKNOWN;
    return dev.tuner_type;
}


export function get_tuner_gains(dev, pNum)
{
    let e4k_gains = new Int32Array([-10, 15, 40, 65, 90, 115, 140, 165, 190, 215, 240, 290, 340, 420]);
    let fc0012_gains = new Int32Array([-99, -40, 71, 179, 192]);
    let fc0013_gains = new Int32Array([-99, -73, -65, -63, -60, -58, -54, 58, 61, 63, 65, 67, 68, 70, 71, 179, 181, 182, 184, 186, 188, 191, 197]);
    let fc2580_gains = new Int32Array([0]);
    let r82xx_gains = new Int32Array([0, 9, 14, 27, 37, 77, 87, 125, 144, 157, 166, 197, 207, 229, 254, 280, 297, 328, 338, 364, 372, 386, 402, 421, 434, 439, 445, 480, 496]);
    let unknown_gains = new Int32Array([0]);
    let ptr = null;
    let len = 0;
    switch (dev.tuner_type) {
    case RTLSDR_TUNER_E4000:
        ptr = e4k_gains;
        len = e4k_gains.length;
        break;
    case RTLSDR_TUNER_FC0012:
        ptr = fc0012_gains;
        len = fc0012_gains.length;
        break;
    case RTLSDR_TUNER_FC0013:
        ptr = fc0013_gains;
        len = fc0013_gains.length;
        break;
    case RTLSDR_TUNER_FC2580:
        ptr = fc2580_gains;
        len = fc2580_gains.length;
        break;
    case RTLSDR_TUNER_R820T:
    case RTLSDR_TUNER_R828D:
        ptr = r82xx_gains;
        len = r82xx_gains.length;
        break;
    default:
        ptr = unknown_gains;
        len = unknown_gains.length;
        break;
    }
    global1 = len;
    return ptr;
}


function rtlsdr_get_tuner_gains(dev, gains)
{
    let ptr = null;
    let len = 0;
    if (!dev)
        return -1;
    ptr = get_tuner_gains(dev, len);
    len = global1;
    if (!gains)
        return len;
    else {
        if (len) {
            gains.length = len;
            for (let i = 0; i < len; i++)
                gains[i] = ptr[i];
        }
        return len;
    }
}


function rtlsdr_set_and_get_tuner_bandwidth(dev, bw, applied_bw, apply_bw)
{
    let r = 0;
    applied_bw = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if(!apply_bw) {
        if (dev.tuner.set_bw) {
            r = dev.tuner.set_bw(dev, bw > 0 ? bw : dev.rate, applied_bw, apply_bw);
            applied_bw = global1;
        }
        return r;
    }
    if (dev.tuner.set_bw) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_bw(dev, bw > 0 ? bw : dev.rate, applied_bw, apply_bw);
        applied_bw = global1;
        rtlsdr_set_i2c_repeater(dev, 0);
        reactivate_softagc(dev, SOFTSTATE_RESET);
        if (r)
            return r;
        dev.bw = bw;
    }
    return r;
}


function rtlsdr_set_tuner_bandwidth(dev, bw)
{
    let applied_bw = 0;
    let r = rtlsdr_set_and_get_tuner_bandwidth(dev, bw, applied_bw, 1);
    global1 = applied_bw;
    return r;
}


function rtlsdr_set_tuner_band_center(dev, if_band_center_freq )
{
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (!dev.tuner.set_bw_center)
        return -1;
    return dev.tuner.set_bw_center(dev, if_band_center_freq);
}


function rtlsdr_set_tuner_gain(dev, gain)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_gain) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_gain(dev, gain);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_set_tuner_gain_ext(dev, lna_gain, mixer_gain, vga_gain)
{
    let r = 0;
    if (!dev)
        return -1;
    if (dev.tuner_type !== RTLSDR_TUNER_R820T && dev.tuner_type !== RTLSDR_TUNER_R828D)
        return -1;
    if (dev.tuner.set_gain) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = r820t_set_gain_ext(dev, lna_gain, mixer_gain, vga_gain);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_set_tuner_if_mode(dev, if_mode)
{
    let r = 0;
    if (!dev)
        return -1;
    if (dev.tuner_type !== RTLSDR_TUNER_R820T && dev.tuner_type !== RTLSDR_TUNER_R828D)
        return -1;
    if (dev.tuner.set_gain) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = r820t_set_if_mode(dev, if_mode);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_get_tuner_gain(dev)
{
    let rf_gain = 0;
    if (!dev)
        return 0;
    if (dev.tuner_type === RTLSDR_TUNER_R820T)
        rf_gain = r82xx_get_rf_gain(dev.r82xx_p);
    return rf_gain;
}


function rtlsdr_set_tuner_if_gain(dev, stage, gain)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_if_gain) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_if_gain(dev, stage, gain);
        rtlsdr_set_i2c_repeater(dev, 0);
        reactivate_softagc(dev, SOFTSTATE_RESET);
    }
    return r;
}


function rtlsdr_set_tuner_gain_mode(dev, mode)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_gain_mode) {
        if (dev.softagc.softAgcMode !== SOFTAGC_OFF)
            mode = 1;
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_gain_mode(dev, mode);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_set_tuner_sideband(dev, sideband)
{
    let r = 0, iffreq;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_sideband) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_sideband(dev, sideband);
        rtlsdr_set_i2c_repeater(dev, 0);
        if (r)
            return r;
        dev.tuner_sideband = sideband;
        iffreq = dev.tuner_sideband ? dev.tuner_if_freq - dev.if_band_center_freq : dev.tuner_if_freq + dev.if_band_center_freq;
        r = rtlsdr_set_if_freq(dev, iffreq);
        if (r)
            return r;
        if (!dev.freq)
            return r;
        r = rtlsdr_set_center_freq64(dev, dev.freq);
        return r;
    }
    return r;
}


function rtlsdr_set_tuner_i2c_register(dev, i2c_register, mask, data)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_i2c_register) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_i2c_register(dev, i2c_register, data, mask);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_get_tuner_i2c_register(dev, data, len)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.get_i2c_register) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.get_i2c_reg_array(dev, data, len);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_set_tuner_i2c_override(dev, i2c_register, mask, data)
{
    let r = 0;
    if (!dev)
        return -1;
    if (!dev.tuner)
        return -1;
    if (dev.tuner.set_i2c_override) {
        rtlsdr_set_i2c_repeater(dev, 1);
        r = dev.tuner.set_i2c_override(dev, i2c_register, data, mask);
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    return r;
}


function rtlsdr_set_sample_rate(dev, samp_rate)
{
    let r = 0;
    let tmp;
    let rsamp_ratio, real_rsamp_ratio;
    let real_rate;
    if (!dev)
        return -1;
    if ((samp_rate <= 225000) || (samp_rate > 3200000) || ((samp_rate > 300000) && (samp_rate <= 900000)))
        return -EINVAL;
    rsamp_ratio = (dev.rtl_xtal * TWO_POW(22) / samp_rate) | 0;
    rsamp_ratio &= 0x0ffffffc;
    real_rsamp_ratio = rsamp_ratio | ((rsamp_ratio & 0x08000000) << 1);
    real_rate = dev.rtl_xtal * TWO_POW(22) / real_rsamp_ratio;
    dev.rate = real_rate | 0;
    if (dev.tuner && dev.tuner.set_bw) {
        let applied_bw = 0;
        rtlsdr_set_i2c_repeater(dev, 1);
        dev.tuner.set_bw(dev, dev.bw > 0 ? dev.bw : dev.rate, applied_bw, 1);
        applied_bw = global1;
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    tmp = rsamp_ratio >> 16;
    r |= rtlsdr_demod_write_reg(dev, 1, 0x9f, tmp, 2);
    tmp = rsamp_ratio & 0xffff;
    r |= rtlsdr_demod_write_reg(dev, 1, 0xa1, tmp, 2);
    r |= rtlsdr_set_sample_freq_correction(dev, dev.corr);
    r |= rtlsdr_demod_write_reg(dev, 1, 0x01, 0x14, 1);
    r |= rtlsdr_demod_write_reg(dev, 1, 0x01, 0x10, 1);
    if (dev.offs_freq)
        rtlsdr_set_offset_tuning(dev, 1);
    if (reactivate_softagc(dev, SOFTSTATE_RESET)) {
        dev.softagc.deadTimeSps = 0;
        dev.softagc.scanTimeSps = 0;
    }
    return r;
}


function rtlsdr_get_sample_rate(dev)
{
    if (!dev)
        return 0;
    return dev.rate;
}


function rtlsdr_set_testmode(dev, on)
{
    if (!dev)
        return -1;
    return rtlsdr_demod_write_reg(dev, 0, 0x19, on ? 0x03 : 0x05, 1);
}


function rtlsdr_set_agc_mode(dev, on)
{
    if (!dev)
        return -1;
    return rtlsdr_demod_write_reg(dev, 0, 0x19, on ? 0x25 : 0x05, 1);
}


function rtlsdr_set_direct_sampling(dev, on)
{
    let r = 0;
    if (!dev)
        return -1;
    if (on) {
        if (dev.tuner && dev.tuner.exit) {
            rtlsdr_set_i2c_repeater(dev, 1);
            r = dev.tuner.exit(dev);
            rtlsdr_set_i2c_repeater(dev, 0);
        }
        r |= rtlsdr_demod_write_reg(dev, 1, 0xb1, 0x1a, 1);
        r |= rtlsdr_demod_write_reg(dev, 1, 0x15, 0x00, 1);
        r |= rtlsdr_demod_write_reg(dev, 0, 0x08, 0x4d, 1);
        r |= rtlsdr_demod_write_reg(dev, 0, 0x06, (on > 1) ? 0x90 : 0x80, 1);
        r |= rtlsdr_demod_write_reg(dev, 1, 0xb1, 0x1a, 1);
        r |= rtlsdr_demod_write_reg(dev, 1, 0x15, 0x00, 1);
        r |= rtlsdr_demod_write_reg(dev, 0, 0x08, 0x4d, 1);
        r |= rtlsdr_demod_write_reg(dev, 0, 0x06, (on === 2) ? 0x90 : 0x80, 1);
        dev.direct_sampling = on;
    } else {
        if (dev.tuner && dev.tuner.init) {
            rtlsdr_set_i2c_repeater(dev, 1);
            r |= dev.tuner.init(dev);
            rtlsdr_set_i2c_repeater(dev, 0);
        }
        if (dev.tuner_type === RTLSDR_TUNER_R820T || dev.tuner_type === RTLSDR_TUNER_R828D) {
            r |= rtlsdr_set_if_freq(dev, R82XX_IF_FREQ);
            r |= rtlsdr_demod_write_reg(dev, 1, 0x15, 0x01, 1);
        } else {
            r |= rtlsdr_set_if_freq(dev, 0);
            r |= rtlsdr_demod_write_reg(dev, 0, 0x08, 0xcd, 1);
            r |= rtlsdr_demod_write_reg(dev, 1, 0xb1, 0x1b, 1);
        }
        r |= rtlsdr_demod_write_reg(dev, 0, 0x06, 0x80, 1);
        dev.direct_sampling = 0;
    }
    r |= rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function rtlsdr_get_direct_sampling(dev)
{
    if (!dev)
        return -1;
    return dev.direct_sampling;
}


function rtlsdr_set_ds_mode(dev, mode, freq_threshold)
{
    let center_freq;
    if (!dev)
        return -1;
    center_freq = rtlsdr_get_center_freq64(dev);
    if (!center_freq )
        return -2;
    if (!freq_threshold) {
        switch(dev.tuner_type) {
        default:
        case RTLSDR_TUNER_UNKNOWN:
            freq_threshold = 28800000;
            break;
        case RTLSDR_TUNER_E4000:
            freq_threshold = 50000000;
            break;
        case RTLSDR_TUNER_FC0012:
            freq_threshold = 28800000;
            break;
        case RTLSDR_TUNER_FC0013:
            freq_threshold = 28800000;
        case RTLSDR_TUNER_FC2580:
            freq_threshold = 28800000;
            break;
        case RTLSDR_TUNER_R820T:
            freq_threshold = 24000000;
            break;
        case RTLSDR_TUNER_R828D:
            freq_threshold = 28800000;
            break;
        }
    }
    dev.direct_sampling_mode = mode;
    dev.direct_sampling_threshold = freq_threshold;
    if (mode <= RTLSDR_DS_Q)
        rtlsdr_set_direct_sampling(dev, mode);
    return rtlsdr_set_center_freq64(dev, center_freq);
}


function rtlsdr_update_ds(dev, freq)
{
    let new_ds = 0;
    let curr_ds = rtlsdr_get_direct_sampling(dev);
    if (curr_ds < 0)
        return -1;
    switch (dev.direct_sampling_mode) {
    default:
    case RTLSDR_DS_IQ:
        break;
    case RTLSDR_DS_I:
        new_ds = 1;
        break;
    case RTLSDR_DS_Q:
        new_ds = 2;
        break;
    case RTLSDR_DS_I_BELOW:
        new_ds = freq < dev.direct_sampling_threshold ? 1 : 0;
        break;
    case RTLSDR_DS_Q_BELOW:
        new_ds = freq < dev.direct_sampling_threshold ? 2 : 0;
        break;
    }
    if (curr_ds !== new_ds)
        return rtlsdr_set_direct_sampling(dev, new_ds);
    return 0;
}


function rtlsdr_set_offset_tuning(dev, on)
{
    let r = 0;
    let bw;
    if (!dev)
        return -1;
    if (dev.tuner_type === RTLSDR_TUNER_R820T || dev.tuner_type === RTLSDR_TUNER_R828D)
        return -2;
    if (dev.direct_sampling)
        return -3;
    dev.offs_freq = on ? (((dev.rate / 2) | 0) * 170 / 100) | 0 : 0;
    r |= rtlsdr_set_if_freq(dev, dev.offs_freq);
    if (dev.tuner && dev.tuner.set_bw) {
        let applied_bw = 0;
        rtlsdr_set_i2c_repeater(dev, 1);
        if (on)
            bw = 2 * dev.offs_freq;
        else if (dev.bw > 0)
            bw = dev.bw;
        else
            bw = dev.rate;
        dev.tuner.set_bw(dev, bw, applied_bw, 1);
        globl1 = applied_bw;
        rtlsdr_set_i2c_repeater(dev, 0);
    }
    if (dev.freq > dev.offs_freq)
        r |= rtlsdr_set_center_freq64(dev, dev.freq);
    return r;
}


function rtlsdr_get_offset_tuning(dev)
{
    if (!dev)
        return -1;
    return (dev.offs_freq) ? 1 : 0;
}


function rtlsdr_set_dithering(dev, dither)
{
    if (dev.tuner_type === RTLSDR_TUNER_R820T) {
        return r82xx_set_dither(dev.r82xx_p, dither);
    }
    return 1;
}


function find_known_device(vid, pid)
{
    let device = null;
    for (let i = 0; i < known_devices.length; i++ ) {
        if (known_devices[i].vid === vid && known_devices[i].pid === pid) {
            device = known_devices[i];
            break;
        }
    }
    return device;
}


function rtlsdr_get_device_count()
{
    let list = rtl.box.USB_get_device_list();
    let cnt = list.length;
    let device_count = 0;
    let dd;
    for (let i = 0; i < cnt; i++) {
        dd = rtl.box.USB_get_device_descriptor(list[i]);
        if (find_known_device(dd[Box.USB_idVendor], dd[Box.USB_idProduct]))
            device_count++;
    }
    return device_count;
}


function rtlsdr_get_device_name(index)
{
    let device_count = 0;
    let dd;
    let device;
    let list = rtl.box.USB_get_device_list();
    for (let i = 0; i < list.length; i++) {
        dd = rtl.box.USB_get_device_descriptor(list[i]);
        device = find_known_device(dd[Box.USB_idVendor], dd[Box.USB_idProduct]);
        if (device) {
            device_count++;
            if (index === device_count - 1)
                break;
        }
    }
    if (device)
        return device.name;
    else
        return "";
}


function rtlsdr_get_device_usb_strings(index, manufact, product, serial)
{
    let dd;
    let device;
    let dev = new rtlsdr_dev();
    let device_count = 0;
    let list = rtl.box.USB_get_device_list();
    for (let i = 0; i < list.length; i++) {
        dd = rtl.box.USB_get_device_descriptor(list[i]);
        device = find_known_device(dd[Box.USB_idVendor], dd[Box.USB_idProduct]);
        if (device) {
            device_count++;
            if (index === device_count - 1) {
                dev.devh = rtl.box.USB_open(list[i]);
                if (dev.devh > -1) {
                    r = rtlsdr_get_usb_strings(dev, manufact, product, serial);
                    manufact = global1;
                    product = global2;
                    serial = global3;
                    rtl.box.USB_close(dev.devh);
                }
                break;
            }
        }
    }
    return r;
}


function rtlsdr_get_index_by_serial(serial)
{
    let r;
    let str = "";
    if (!serial)
        return -1;
    let cnt = rtlsdr_get_device_count();
    if (!cnt)
        return -2;
    for (let i = 0; i < cnt; i++) {
        r = rtlsdr_get_device_usb_strings(i, null, null, str);
        if (!r && serial === global3)
            return i;
    }
    return -3;
}


function rtlsdr_open(index)
{
    let device = null;
    let device_count = 0;
    let dd;
    let reg;
    let dev = new rtlsdr_dev();
    dev.fir.set(fir_default);
    dev.rtl_vga_control = 0;
    dev.biast_gpio_pin_no = 0;
    dev.gpio_state_known = 0;
    dev.gpio_state = 0;
    dev.called_set_opt = 0;
    dev.r82xx_c.harmonic = 0;
    dev.r82xx_c.vco_curr_min = 0xff;
    dev.r82xx_c.vco_curr_max = 0xff;
    dev.r82xx_c.vco_algo = 0x00;
    dev.r82xx_c.verbose = 0;
    dev.softagc.agcState = SOFTSTATE_OFF;
    dev.softagc.softAgcMode = SOFTAGC_OFF;
    dev.softagc.verbose = 0;
    dev.softagc.scanTimeMs = 100;
    dev.softagc.deadTimeMs = 1;
    dev.softagc.scanTimeSps = 0;
    dev.softagc.deadTimeSps = 0;
    dev.softagc.rpcNumGains = 0;
    dev.softagc.rpcGainValues = null;
    dev.dev_num = index;
    dev.dev_lost = 1;
    let list = rtl.box.USB_get_device_list();
    for (let i = 0; i < list.length; i++) {
        device = list[i];
        dd = rtl.box.USB_get_device_descriptor(list[i]);
        if (find_known_device(dd[Box.USB_idVendor], dd[Box.USB_idProduct]))
            device_count++;
        if (index === device_count - 1)
            break;
        device = null;
    }
    if (device === null)
        return err();
    dev.devh = rtl.box.USB_open(device);
    if (dev.devh < 0)
        return err();
    if (rtl.box.USB_kernel_driver_active(dev.devh, 0) === 1) {
        dev.driver_active = 1;
        rtl.box.USB_detach_kernel_driver(dev.devh, 0);
    }
    let r = rtl.box.USB_claim_interface(dev.devh, 0);
    if (r < 0)
        return err();
    dev.rtl_xtal = DEF_RTL_XTAL_FREQ;
    if (rtlsdr_write_reg(dev, USBB, USB_SYSCTL, 0x09, 1) < 0)
        rtl.box.USB_reset_device(dev.devh);
    rtlsdr_init_baseband(dev);
    dev.dev_lost = 0;
    rtlsdr_set_i2c_repeater(dev, 1);
    reg = rtlsdr_i2c_read_reg(dev, E4K_I2C_ADDR, E4K_CHECK_ADDR);
    if (reg === E4K_CHECK_VAL) {
        dev.tuner_type = RTLSDR_TUNER_E4000;
        return found();
    }
    reg = rtlsdr_i2c_read_reg(dev, FC0013_I2C_ADDR, FC0013_CHECK_ADDR);
    if (reg === FC0013_CHECK_VAL) {
        dev.tuner_type = RTLSDR_TUNER_FC0013;
        return found();
    }
    reg = rtlsdr_i2c_read_reg(dev, R820T_I2C_ADDR, R82XX_CHECK_ADDR);
    if (reg === R82XX_CHECK_VAL) {
        dev.tuner_type = RTLSDR_TUNER_R820T;
        return found();
    }
    reg = rtlsdr_i2c_read_reg(dev, R828D_I2C_ADDR, R82XX_CHECK_ADDR);
    if (reg === R82XX_CHECK_VAL) {
        dev.tuner_type = RTLSDR_TUNER_R828D;
        return found();
    }
    rtlsdr_set_gpio_output(dev, 4);
    rtlsdr_set_gpio_bit(dev, 4, 1);
    rtlsdr_set_gpio_bit(dev, 4, 0);
    reg = rtlsdr_i2c_read_reg(dev, FC2580_I2C_ADDR, FC2580_CHECK_ADDR);
    if ((reg & 0x7f) === FC2580_CHECK_VAL) {
        dev.tuner_type = RTLSDR_TUNER_FC2580;
        return found();
    }
    reg = rtlsdr_i2c_read_reg(dev, FC0012_I2C_ADDR, FC0012_CHECK_ADDR);
    if (reg === FC0012_CHECK_VAL) {
        rtlsdr_set_gpio_output(dev, 6);
        dev.tuner_type = RTLSDR_TUNER_FC0012;
        return found();
    }
    return err();

    function found()
    {
        dev.tun_xtal = dev.rtl_xtal;
        dev.tuner = tuners[dev.tuner_type];
        switch (dev.tuner_type) {
        case RTLSDR_TUNER_FC2580:
            dev.tun_xtal = FC2580_XTAL_FREQ;
            break;
        case RTLSDR_TUNER_E4000:
            rtlsdr_demod_write_reg(dev, 1, 0x12, 0x5a, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x02, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x03, 0x5a, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc7, 0x30, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x04, 0xd0, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x05, 0xbe, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc8, 0x18, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x06, 0x35, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc9, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xca, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcb, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x07, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcd, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xce, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x11, 0xe9d4, 2);
            rtlsdr_demod_write_reg(dev, 1, 0xe5, 0xf0, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd9, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xdb, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xdd, 0x14, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xde, 0xec, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd8, 0x0c, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xe6, 0x02, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd7, 0x09, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x10, 0x49, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x0d, 0x85, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x13, 0x02, 1);
            break;
        case RTLSDR_TUNER_FC0012:
        case RTLSDR_TUNER_FC0013:
            rtlsdr_demod_write_reg(dev, 1, 0x12, 0x5a, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x02, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x03, 0x5a, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc7, 0x2c, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x04, 0xcc, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x05, 0xbe, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc8, 0x16, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x06, 0x35, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc9, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xca, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcb, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x07, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcd, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xce, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x11, 0xe9bf, 2);
            rtlsdr_demod_write_reg(dev, 1, 0xe5, 0xf0, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd9, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xdb, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xdd, 0x11, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xde, 0xef, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd8, 0x0c, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xe6, 0x02, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xd7, 0x09, 1);
            break;
        case RTLSDR_TUNER_R828D:
            dev.tun_xtal = R828D_XTAL_FREQ;
        case RTLSDR_TUNER_R820T:
            rtlsdr_demod_write_reg(dev, 1, 0x12, 0x5a, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x02, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x03, 0x80, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc7, 0x24, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x04, 0xcc, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x05, 0xbe, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc8, 0x14, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x06, 0x35, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xc9, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xca, 0x21, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcb, 0x00, 1);
            rtlsdr_demod_write_reg(dev, 1, 0x07, 0x40, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xcd, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 1, 0xce, 0x10, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x11, 0xe9f4, 2);
            rtlsdr_demod_write_reg(dev, 1, 0xb1, 0x1a, 1);
            rtlsdr_demod_write_reg(dev, 0, 0x08, 0x4d, 1);
            rtlsdr_set_if_freq(dev, R82XX_IF_FREQ);
            rtlsdr_demod_write_reg(dev, 1, 0x15, 0x01, 1);
            break;
        case RTLSDR_TUNER_UNKNOWN:
            rtlsdr_set_direct_sampling(dev, 1);
            break;
        default:
            break;
        }
        if (dev.tuner.init)
            r = dev.tuner.init(dev);
        rtlsdr_set_i2c_repeater(dev, 0);
        return dev;
    }

    function err()
    {
        if (dev) {
            if (dev.devh)
                rtl.box.USB_close(dev.devh);
        }
        return null;
    }
}


function rtlsdr_close(dev)
{
    if (!dev)
        return -1;
    if(!dev.dev_lost) {
        while (RTLSDR_INACTIVE !== dev.async_status)
            rtl.box.sleep(1000);
        rtlsdr_deinit_baseband(dev);
    }
    softagc_uninit(dev);
    rtl.box.USB_release_interface(dev.devh, 0);
    if (dev.driver_active)
        rtl.box.USB_attach_kernel_driver(dev.devh, 0)
    rtl.box.USB_close(dev.devh);
    return 0;
}


function rtlsdr_reset_buffer(dev)
{
    if (!dev)
        return -1;
    rtlsdr_write_reg(dev, USBB, USB_EPA_CTL, 0x1002, 2);
    rtlsdr_write_reg(dev, USBB, USB_EPA_CTL, 0x0000, 2);
    return 0;
}


function rtlsdr_process_env_opts(dev)
{
    dev.called_set_opt = 1;
}


function rtlsdr_read_sync(dev, len)
{
    return rtl.box.USB_bulk_transfer(dev.devh, 0x81, len, BULK_TIMEOUT);
}


function reactivate_softagc(dev, newState)
{
    if (dev.softagc.softAgcMode > SOFTAGC_OFF) {
        if (dev.softagc.agcState !== SOFTSTATE_OFF && dev.softagc.softAgcMode >= SOFTAGC_AUTO)
            return 1;
        else {
            dev.softagc.agcState =  newState;
            return 1;
        }
    }
    return 0;
}


let gdev = null;

function softagc_control_worker()
{
    if (gdev === null)
        return;
    let dev = gdev;
    let agc = dev.softagc;
    if (agc.command_changeGain) {
        agc.command_changeGain = 0;
        rtlsdr_set_tuner_gain(dev, dev.softagc.command_newGain);
        dev.softagc.remainingDeadSps = dev.softagc.deadTimeSps;
    }
}


function softagc_init(dev)
{
    dev.softagc.command_newGain = 0;
    dev.softagc.command_changeGain = 0;
    rtlsdr_set_tuner_gain_mode(dev, 1);
    gdev = dev;
    dev.softagc.timer.start(1000);
}


function softagc_uninit(dev)
{
    if (dev.softagc.softAgcMode === SOFTAGC_OFF)
        return;
    dev.softagc.timer.stop();
    gdev = null;
}


function softagc(dev, abuf, len)
{
    let buf = new Uint8Array(abuf);
    let agc = dev.softagc;
    let distrib = new Int32Array(16);

    if (agc.agcState === SOFTSTATE_INIT) {
        agc.agcState = SOFTSTATE_RESET;
        return 0;
    } else if ( agc.agcState === SOFTSTATE_RESET ) {
        let numGains = 0;
        let gains = get_tuner_gains(dev);
        numGains = global1;
        if (! numGains)
            return 1;
        if (numGains === 1) {
            agc.softAgcMode = SOFTAGC_OFF;
            agc.agcState = SOFTSTATE_OFF;
            return 1;
        }
        if (!agc.scanTimeSps)
            agc.scanTimeSps = (agc.scanTimeMs * dev.rate / 1000) | 0;
        if (!agc.deadTimeSps)
            agc.deadTimeSps = (agc.deadTimeMs * dev.rate / 1000) | 0;
        agc.remainingDeadSps = INT_MAX;
        agc.remainingScanSps = agc.scanTimeSps;
        agc.numInHisto = 0;
        for (let k = 0; k < 16; ++k)
            agc.histo[k] = 0;
        dev.softagc.gainIdx = numGains - 1;
        dev.softagc.command_newGain = gains[dev.softagc.gainIdx];
        dev.softagc.command_changeGain = 1;
        agc.agcState = SOFTSTATE_RESET_CONT;
        return 0;
    }
    if (agc.remainingDeadSps === INT_MAX)
        return 0;
    if (agc.remainingDeadSps) {
        if (agc.remainingDeadSps >= (len / 2) | 0) {
            agc.remainingDeadSps -= (len / 2) | 0;
            return agc.agcState === SOFTSTATE_RESET_CONT ? 0 : 1;
        } else {
            buf = buf.subarray( 2 * agc.remainingDeadSps);
            len -= 2 * agc.remainingDeadSps;
            agc.remainingDeadSps = 0;
        }
    }
    if (! agc.gainIdx && agc.agcState === SOFTSTATE_RESET_CONT) {
        agc.agcState = SOFTSTATE_OFF;
        return 1;
    }
    let histo = agc.histo;
    for (let i = 0; i < len; ++i)
        if (buf[i] >= 128)
            ++histo[(buf[i] - 128) >> 3 ];
        else
            ++histo[(127 - buf[i]) >> 3 ];
    agc.numInHisto += len;
    agc.remainingScanSps -= (len / 2) | 0;
    distrib[15] = histo[15];
    for (let k = 14; k >= 8; --k)
        distrib[k] = distrib[k + 1] + histo[k];
    if (64 * distrib[15] >= agc.numInHisto || 16 * distrib[12] >= agc.numInHisto || 4 * distrib[8] >= agc.numInHisto) {
        let N = agc.numInHisto;
        if ( agc.gainIdx > 0 ) {
            let numGains = 0;
            let gains = get_tuner_gains(dev, numGains);
            numGains = global1;
            agc.remainingDeadSps = INT_MAX;
            agc.remainingScanSps = agc.scanTimeSps;
            agc.numInHisto = 0;
            for (let k = 0; k < 16; ++k)
                agc.histo[k] = 0;
            --agc.gainIdx;
            agc.command_newGain = gains[agc.gainIdx];
            agc.command_changeGain = 1;
        }
        return agc.agcState === SOFTSTATE_RESET_CONT ? 0 : 1;
    }
    if (agc.remainingScanSps < 0) {
        agc.remainingScanSps = 0;
        switch ( agc.softAgcMode ) {
        case SOFTAGC_OFF:
        case SOFTAGC_ON_CHANGE:
            switch (agc.agcState) {
            case SOFTSTATE_OFF:
            case SOFTSTATE_RESET_CONT:
                agc.agcState = SOFTSTATE_OFF;
                return 1;
            case SOFTSTATE_ON:
            case SOFTSTATE_RESET:
            case SOFTSTATE_INIT:
                return 1;
            }
            break;
        case SOFTAGC_AUTO_ATTEN:
        case SOFTAGC_AUTO:
            agc.agcState = SOFTSTATE_ON;
            return 1;
        }
    }
    return agc.agcState === SOFTSTATE_RESET_CONT ? 0 : 1;
}


function rtlsdr_get_tuner_clock(dev)
{
    let tuner_freq;
    if (!dev)
        return 0;
    let r = rtlsdr_get_xtal_freq(dev, null, tuner_freq);
    tuner_freq = global2;
    if (r < 0)
        return 0;
    return tuner_freq;
}


function rtlsdr_i2c_write_fn(dev, addr, buf, len)
{
    if (dev)
        return rtlsdr_i2c_write(dev, addr, buf, len);
    return -1;
}


function rtlsdr_i2c_read_fn(dev, addr, buf, len)
{
    if (dev)
        return rtlsdr_i2c_read(dev, addr, buf, len);
    return -1;
}


//======================== RTLSDR wrapper


let rtl = {
    id: "",
    ds: 0,
    dsmode: 0,
    freq: 0,
    gain: 0,
    inputbits: 0,
    sdrid: 0,
    rtldev: null,
    box: null
}


export function init(box)
{
    rtl.box = box;
}


export function list()
{
    let list = [];
    let devs = rtl.box.USBDevice_list();
    let hex, pid, vid, j;

    for (let i = 0; i < devs.length; i++) {
        hex = devs[i].split(':');
        vid = parseInt(hex[0], 16);
        pid = parseInt(hex[1], 16);

        for (j = 0; j < known_devices.length; j++)
            if (vid == known_devices[j].vid && pid == known_devices[j].pid)
                if (rtl.box.USBDevice_test(devs[i]))
                    list.push(devs[i] + " - " + rtl.box.USBDevice_description(devs[i]));
    }
    
    return list;
}


export function open(id)
{
    if (!id)
        return false;

    let index = list().indexOf(id);
    if (index === -1)
        return false;

    let rtldev = rtlsdr_open(index);
    if (rtldev === null)
        return false;

    rtlsdr_reset_buffer(rtldev);
    rtl.id = id;
    rtl.rtldev = rtldev;
    rtl.ds = -1;

    rtl.box.USB_Data.connect(dataWorker);
    rtl.box.USB_Error.connect(usbError);

    rtl.box.USB_bulk_transfer_start(rtldev.devh, 0x81, Box.USB_BulkSync, 64 * 1024);

    return true;
}


export function close()
{
    if (!rtl.box)
        return;

    rtl.box.USB_Data.disconnect(dataWorker);
    rtl.box.USB_Error.disconnect(usbError);

    if (rtl.rtldev)
        rtl.box.USB_bulk_transfer_stop(rtl.rtldev.devh);

    rtlsdr_close(rtl.rtldev);
}


function usbError(id)
{
    if (id === rtl.rtldev.devh)
        error();
}


function dataWorker(id, data)
{
    if (id !== rtl.rtldev.devh)
        return;

    rtl.box.USB_setBusy(rtl.rtldev.devh, true);

    data = rtl.box.bytesToFloat(data, 8, 8.0);

    deviceData(data);

    rtl.box.USB_setBusy(rtl.rtldev.devh, false);
}


export function tunerType()
{
    let tuner = rtlsdr_get_tuner_type(rtl.rtldev);

    if (tuner === RTLSDR_TUNER_E4000)
        return "Elonics E4000";
    else if (tuner === RTLSDR_TUNER_FC0012)
        return "Fitipower FC0012";
    else if (tuner === RTLSDR_TUNER_FC0013)
        return "Fitipower FC0013";
    else if (tuner === RTLSDR_TUNER_FC2580)
        return "FCI FC2580";
    else if (tuner === RTLSDR_TUNER_R820T)
        return "Rafael Micro R820T/2";
    else if (tuner === RTLSDR_TUNER_R828D)
        return "Rafael Micro R828D";
    else
        return "";
}


export function gains()
{
    let list = [];
    rtlsdr_get_tuner_gains(rtl.rtldev, list);

    return list;
}


export function setFrequencyCorrection(ppm)
{
    if (ppm === undefined)
        return;

    rtlsdr_set_freq_correction(rtl.rtldev, ppm);
}


export function setCenterFrequency(freq)
{
    if (freq === undefined)
        return;

    if (freq > 0) {
        if (freq > 28800000) {
            if (rtl.ds !== 0) {
                rtlsdr_set_direct_sampling(rtl.rtldev, 0);
                rtl.ds = 0;
            }
        } else {
            if (rtl.ds !== rtl.dsmode) {
                rtlsdr_set_direct_sampling(rtl.rtldev, rtl.dsmode);
                rtl.ds = rtl.dsmode;
            }
        }
        rtlsdr_set_center_freq(rtl.rtldev, freq);
        setGain(rtl.gain);
        rtl.freq = freq;
    }
}


export function setAGC(agc)
{
    if (agc === undefined)
        return;

    rtlsdr_set_agc_mode(rtl.rtldev, agc ? 1 : 0);
    setGain(rtl.gain);
}


export function setSampleRate(rate)
{
    if (rate === undefined)
        return;

    rtlsdr_set_sample_rate(rtl.rtldev, rate);

    let buflen = 16384 * Math.trunc(2 * rate / rtl.box.param("system.refreshrate") / 16384);
    rtl.box.USB_bulk_transfer_setBufLen(rtl.rtldev.devh, buflen);
}


export function setGain(gain)
{
    if (gain === undefined)
        return;

    rtl.gain = gain;

    let tuner = rtlsdr_get_tuner_type(rtl.rtldev);

    if (tuner === RTLSDR_TUNER_R820T || tuner === RTLSDR_TUNER_R828D) {
        if (gain === -1) {
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 0);
            rtlsdr_set_tuner_i2c_register(rtl.rtldev, 0x07, 0x1f, 0x00);
        } else {
            let lna_steps = [0, 9, 13, 40, 38, 13, 31, 22, 26, 31, 26, 14, 19, 5, 35, 13];
            let vga_steps = [0, 26, 26, 30, 42, 35, 24, 13, 14, 32, 36, 34, 35, 37, 35, 36];
            let total_gain = -47;
            let lna = 0, vga = 0;
            for (let i = 0; i < 16; i++) {
                if (total_gain > 1.5 * gain)
                    break;
                total_gain += lna_steps[++lna];
                if (total_gain > 1.5 * gain)
                    break;
                total_gain += vga_steps[++vga];
            }
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 1);
            rtlsdr_set_tuner_gain_ext(rtl.rtldev, lna, 0, vga);
        }

    } else if (tuner === RTLSDR_TUNER_E4000) {
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 1, -30);
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 2, 0);
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 3, 0);
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 4, 0);
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 5, 30);
        rtlsdr_set_tuner_if_gain(rtl.rtldev, 6, 30);
        if (gain === -1)
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 0);
        else {
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 1);
            rtlsdr_set_tuner_gain(rtl.rtldev, gain);
        }

    } else {
        if (gain === -1)
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 0);
        else {
            rtlsdr_set_tuner_gain_mode(rtl.rtldev, 1);
            rtlsdr_set_tuner_gain(rtl.rtldev, gain);
        }
    }
}


export function setDirectSampling(mode)
{
    if (mode === undefined)
        return;

    if (mode === "I")
        rtl.dsmode = 1;
    else if (mode === "Q")
        rtl.dsmode = 2;
    else if (mode === "SW")
        rtl.dsmode = 3;
    else
        rtl.dsmode = -1;

    setCenterFrequency(rtl.freq);
}
