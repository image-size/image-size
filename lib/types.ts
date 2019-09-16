// load all available handlers explicitely for browserify support
import { IImage } from './types/interface'
import { BMP } from './types/bmp'
import { CUR } from './types/cur'
import { DDS } from './types/dds'
import { GIF } from './types/gif'
import { ICNS } from './types/icns'
import { ICO } from './types/ico'
import { JPG } from './types/jpg'
import { PNG } from './types/png'
import { PSD } from './types/psd'
import { SVG } from './types/svg'
import { TIFF } from './types/tiff'
import { WEBP } from './types/webp'

export const typeHandlers: {[key: string]: IImage} = {
  bmp: BMP,
  cur: CUR,
  dds: DDS,
  gif: GIF,
  icns: ICNS,
  ico: ICO,
  jpg: JPG,
  png: PNG,
  psd: PSD,
  svg: SVG,
  tiff: TIFF,
  webp: WEBP,
}
