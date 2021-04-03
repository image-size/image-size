import type { IImage, ToAsciiCallback } from './interface';
import { readInt32LE, readUInt32LE } from '../readUInt';

export const BMP: IImage = {
  validate(buffer: DataView, toAscii: ToAsciiCallback) {
    return 'BM' === toAscii(buffer, 0, 2);
  },

  calculate(buffer) {
    return {
      height: Math.abs(readInt32LE(buffer, 22)),
      width: readUInt32LE(buffer, 18),
    };
  },
};
