import type { IImage } from './interface';
import { ICO } from './ico';
import { readUInt16LE } from '../readUInt';

const TYPE_CURSOR = 2;
export const CUR: IImage = {
  validate(buffer) {
    if (readUInt16LE(buffer, 0) !== 0) {
      return false;
    }
    return readUInt16LE(buffer, 2) === TYPE_CURSOR;
  },

  calculate(buffer, toAscii) {
    return ICO.calculate(buffer, toAscii);
  },
};
