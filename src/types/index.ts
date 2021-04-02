// load all available handlers explicitely for browserify support
import { BMP } from './bmp.js';
import { CUR } from './cur.js';
import { DDS } from './dds.js';
import { GIF } from './gif.js';
import { ICNS } from './icns.js';
import { ICO } from './ico.js';
import { J2C } from './j2c.js';
import { JP2 } from './jp2.js';
import { JPG } from './jpg.js';
import { KTX } from './ktx.js';
import { PNG } from './png.js';
import { PNM } from './pnm.js';
import { PSD } from './psd.js';
import { SVG } from './svg.js';
// import { TIFF } from './tiff'
import { WEBP } from './webp.js';

export const typeHandlers = {
  bmp: BMP,
  cur: CUR,
  dds: DDS,
  gif: GIF,
  icns: ICNS,
  ico: ICO,
  j2c: J2C,
  jp2: JP2,
  jpg: JPG,
  ktx: KTX,
  png: PNG,
  pnm: PNM,
  psd: PSD,
  svg: SVG,
  // tiff: TIFF,
  webp: WEBP,
};

export type imageType = keyof typeof typeHandlers;