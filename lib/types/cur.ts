import { IImage } from './interface'
import { ICO } from './ico'

const TYPE_CURSOR = 2
export const CUR: IImage = {
  validate(buffer) {
    const reserved = buffer.readUInt16LE(0)
    const imageCount = buffer.readUInt16LE(4)
    if (reserved !== 0 ||imageCount === 0) {
      return false
    }
    const imageType = buffer.readUInt16LE(2)
    return imageType === TYPE_CURSOR
  },

  calculate(buffer) {
    return ICO.calculate(buffer)
  }
}
