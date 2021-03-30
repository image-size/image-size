import type { IImage } from './interface';
import { readUInt32BE } from '../readUInt';
import toAsciiString from '../toAsciiString';

export const PSD: IImage = {
  validate(buffer) {
    return '8BPS' === toAsciiString(buffer, 0, 4);
  },

  calculate(buffer) {
    return {
      height: readUInt32BE(buffer, 14),
      width: readUInt32BE(buffer, 18),
    };
  },
};
