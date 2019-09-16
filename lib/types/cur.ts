import { IImage } from './interface'
import { ICO } from './ico'

const TYPE_CURSOR = 2
export const CUR: IImage = {
  validate(buffer) {
    if (buffer.readUInt16LE(0) !== 0) {
      return false
    }
    return buffer.readUInt16LE(2) === TYPE_CURSOR
  },

  calculate(buffer) {
    return ICO.calculate(buffer)
  }
}
