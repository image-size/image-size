import type { IImage } from './interface'
import { readUInt32LE } from '../readUInt'

export const DDS: IImage = {
  validate(buffer) {
    return readUInt32LE(buffer, 0) === 0x20534444
  },

  calculate(buffer) {
    return {
      height: readUInt32LE(buffer, 12),
      width: readUInt32LE(buffer, 16)
    }
  }
}
