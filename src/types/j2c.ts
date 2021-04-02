import type { IImage } from './interface.js';
import { readUInt32BE } from '../readUInt.js';
import toHexadecimal from '../toHexadecimal.js';

export const J2C: IImage = {
  validate(buffer) {
    // TODO: this doesn't seem right. SIZ marker doesnt have to be right after the SOC
    return toHexadecimal(buffer, 0, 4) === 'ff4fff51';
  },

  calculate(buffer) {
    return {
      height: readUInt32BE(buffer, 12),
      width: readUInt32BE(buffer, 8),
    };
  },
};
