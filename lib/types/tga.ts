import { IImage } from './interface'

export const TGA: IImage = {
  validate(buffer) {
    return buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(4) === 0
  },

  calculate(buffer) {
    return {
      height: buffer.readUInt16LE(14),
      width: buffer.readUInt16LE(12),
    }
  }
}
