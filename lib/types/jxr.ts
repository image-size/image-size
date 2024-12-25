import type { IImage } from './interface'
import { readUInt32BE, readUInt32LE } from './utils'

export const JXR: IImage = {
  validate: (input) => readUInt32BE(input) === 0x4949bc01,

  calculate(input) {
    // In JPEG-XR, width and height are stored in little-endian format
    // Typically found in the image header after the initial signature
    return {
      width: readUInt32LE(input, 24),
      height: readUInt32LE(input, 28),
    }
  }
}
