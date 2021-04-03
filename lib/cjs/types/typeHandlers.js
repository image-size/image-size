"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// load all available handlers explicitely for browserify support
const bmp_js_1 = require("./bmp.js");
const cur_js_1 = require("./cur.js");
const dds_js_1 = require("./dds.js");
const gif_js_1 = require("./gif.js");
const icns_js_1 = require("./icns.js");
const ico_js_1 = require("./ico.js");
const j2c_js_1 = require("./j2c.js");
const jp2_js_1 = require("./jp2.js");
const jpg_js_1 = require("./jpg.js");
const ktx_js_1 = require("./ktx.js");
const png_js_1 = require("./png.js");
const pnm_js_1 = require("./pnm.js");
const psd_js_1 = require("./psd.js");
const svg_js_1 = require("./svg.js");
// import { TIFF } from './tiff'
const webp_js_1 = require("./webp.js");
const typeHandlers = {
    bmp: bmp_js_1.BMP,
    cur: cur_js_1.CUR,
    dds: dds_js_1.DDS,
    gif: gif_js_1.GIF,
    icns: icns_js_1.ICNS,
    ico: ico_js_1.ICO,
    j2c: j2c_js_1.J2C,
    jp2: jp2_js_1.JP2,
    jpg: jpg_js_1.JPG,
    ktx: ktx_js_1.KTX,
    png: png_js_1.PNG,
    pnm: pnm_js_1.PNM,
    psd: psd_js_1.PSD,
    svg: svg_js_1.SVG,
    // tiff: TIFF,
    webp: webp_js_1.WEBP,
};
exports.default = typeHandlers;
