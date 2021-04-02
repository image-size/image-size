import type { IImage } from './interface.js';
import { readUInt32LE } from '../readUInt.js';

const SIGNATURE = 'KTX 11';

export const KTX: IImage = {
  validate(buffer: DataView, toAscii) {
    return SIGNATURE === toAscii(buffer, 1, 7);
  },

  calculate(buffer: DataView) {
    return {
      height: readUInt32LE(buffer, 40),
      width: readUInt32LE(buffer, 36),
    };
  },
};
