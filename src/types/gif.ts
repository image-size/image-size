import type { IImage } from './interface'
import { readUInt16LE } from '../readUInt';
import toAsciiString from '../toAsciiString';

const gifRegexp = /^GIF8[79]a/
export const GIF: IImage = {
  validate(buffer) {
    const signature = toAsciiString(buffer, 0, 6);
    return (gifRegexp.test(signature))
  },

  calculate(buffer) {
    return {
      height: readUInt16LE(buffer, 8),
      width: readUInt16LE(buffer, 6)
    }
  }
}
