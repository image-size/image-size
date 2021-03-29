import type { IImage } from './interface'
import { readUInt32LE } from '../readUInt'
import toAsciiString from '../toAsciiString'

const SIGNATURE = 'KTX 11'

export const KTX: IImage = {
  validate(buffer: DataView) {
    return SIGNATURE === toAsciiString(buffer, 1, 7)
  },

  calculate(buffer: DataView) {
    return {
      height: readUInt32LE(buffer, 40),
      width: readUInt32LE(buffer, 36),
    }
  }
}
