// load all available handlers explicitely for browserify support
import { BMP } from './bmp'
import { CUR } from './cur'
import { DDS } from './dds'
import { GIF } from './gif'
import { ICNS } from './icns'
import { ICO } from './ico'
import { J2C } from './j2c'
import { JP2 } from './jp2'
import { JPG } from './jpg'
import { KTX } from './ktx'
import { PNG } from './png'
import { PNM } from './pnm'
import { PSD } from './psd'
import { SVG } from './svg'
import { TGA } from './tga'
import { TIFF } from './tiff'
import { WEBP } from './webp'

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
  tga: TGA,
  tiff: TIFF,
  webp: WEBP,
}

export type imageType = keyof typeof typeHandlers
