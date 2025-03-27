// load all available handlers explicitly for browserify support
import { BMP } from './bmp'
import { CUR } from './cur'
import { DDS } from './dds'
import { GIF } from './gif'
import { HEIF } from './heif'
import { ICNS, IconType, isIconType } from './icns'
import { ICO } from './ico'
import { J2C } from './j2c'
import { JP2 } from './jp2'
import { JPG } from './jpg'
import { JXL } from './jxl'
import { JXLStream } from './jxl-stream'
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
  heif: HEIF,
  icns: ICNS,
  ico: ICO,
  j2c: J2C,
  jp2: JP2,
  jpg: JPG,
  jxl: JXL,
  'jxl-stream': JXLStream,
  ktx: KTX,
  png: PNG,
  pnm: PNM,
  psd: PSD,
  svg: SVG,
  tga: TGA,
  tiff: TIFF,
  webp: WEBP,
} as const

export const types = Object.keys(typeHandlers) as readonly ImageType[]
export type ImageType = keyof typeof typeHandlers
function isImageType(imageType: string): imageType is ImageType {
  return imageType in typeHandlers
}
export function parseImageType(imageType: string): ImageType {
  if (!isImageType(imageType)) {
    throw new Error(`Not a valid ImageType: ${imageType}`)
  }
  return imageType
}

const extraImageFormats = ['ktx2', 'bigtiff', 'avif', 'heic'] as const
type ExtraImageFormat = (typeof extraImageFormats)[number]
function isExtraImageFormat(
  extraImageFormat: string,
): extraImageFormat is ExtraImageFormat {
  return extraImageFormats.includes(extraImageFormat as ExtraImageFormat)
}

export type ImageFormat = ImageType | IconType | ExtraImageFormat
export function parseImageFormat(imageFormat: string): ImageFormat {
  if (
    !(
      isImageType(imageFormat) ||
      isIconType(imageFormat) ||
      isExtraImageFormat(imageFormat)
    )
  ) {
    throw new Error(`Not a valid ImageFormat: ${imageFormat}`)
  }
  return imageFormat
}
