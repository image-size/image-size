import {readUInt32BE} from "../readUInt.js";
const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
export const PNG = {
  validate(buffer, toAscii) {
    if (pngSignature === toAscii(buffer, 1, 8)) {
      let chunkName = toAscii(buffer, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toAscii(buffer, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(buffer, toAscii) {
    if (toAscii(buffer, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(buffer, 36),
        width: readUInt32BE(buffer, 32)
      };
    }
    return {
      height: readUInt32BE(buffer, 20),
      width: readUInt32BE(buffer, 16)
    };
  }
};
