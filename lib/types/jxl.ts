import type { IImage } from './interface'
import { readUInt32BE, findBox, toUTF8String } from './utils'

export const JXL: IImage = {
  validate: (input) => {
    const boxType = toUTF8String(input, 4, 8)
    if (boxType !== 'JXL ') return false

    const ftypBox = findBox(input, 'ftyp', 0)
    if (!ftypBox) return false

    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12)
    return brand === 'jxl '
  },

  calculate(input) {
    // TODO: add support for jxlc containers as well
    const jxlpBox = findBox(input, 'jxlp', 0)
    if (!jxlpBox) throw new TypeError('Unsupported JPEG XL format')

    return {
      height: readUInt32BE(input, jxlpBox.offset + 4),
      width: readUInt32BE(input, jxlpBox.offset + 8),
    }
  },
}
