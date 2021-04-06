"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// load all available handlers explicitely for browserify support
const bmp_1 = require("./bmp");
const cur_1 = require("./cur");
const dds_1 = require("./dds");
const gif_1 = require("./gif");
const icns_1 = require("./icns");
const ico_1 = require("./ico");
const j2c_1 = require("./j2c");
const jp2_1 = require("./jp2");
const jpg_1 = require("./jpg");
const ktx_1 = require("./ktx");
const png_1 = require("./png");
const pnm_1 = require("./pnm");
const psd_1 = require("./psd");
const svg_1 = require("./svg");
// import { TIFF } from './tiff'
const webp_1 = require("./webp");
const typeHandlers = {
    bmp: bmp_1.BMP,
    cur: cur_1.CUR,
    dds: dds_1.DDS,
    gif: gif_1.GIF,
    icns: icns_1.ICNS,
    ico: ico_1.ICO,
    j2c: j2c_1.J2C,
    jp2: jp2_1.JP2,
    jpg: jpg_1.JPG,
    ktx: ktx_1.KTX,
    png: png_1.PNG,
    pnm: pnm_1.PNM,
    psd: psd_1.PSD,
    svg: svg_1.SVG,
    // tiff: TIFF,
    webp: webp_1.WEBP,
};
exports.default = typeHandlers;
