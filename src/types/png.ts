import type { IImage } from './interface';
import { readUInt32BE } from '../readUInt';
import toAsciiString from '../toAsciiString';

const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';

// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI';

export const PNG: IImage = {
  validate(buffer) {
    if (pngSignature === toAsciiString(buffer, 1, 8)) {
      let chunkName = toAsciiString(buffer, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toAsciiString(buffer, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError('Invalid PNG');
      }
      return true;
    }
    return false;
  },

  calculate(buffer) {
    if (toAsciiString(buffer, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(buffer, 36),
        width: readUInt32BE(buffer, 32),
      };
    }
    return {
      height: readUInt32BE(buffer, 20),
      width: readUInt32BE(buffer, 16),
    };
  },
};
