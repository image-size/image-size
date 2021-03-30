import type { IImage } from './interface';
import { readInt32LE, readUInt32LE } from '../readUInt';
import toAsciiString from '../toAsciiString';

export const BMP: IImage = {
  validate(buffer) {
    return 'BM' === toAsciiString(buffer, 0, 2);
  },

  calculate(buffer) {
    return {
      height: Math.abs(readInt32LE(buffer, 22)),
      width: readUInt32LE(buffer, 18),
    };
  },
};
