import {readUInt24LE, readInt16LE} from "../readUInt.js";
import toHexadecimal from "../toHexadecimal.js";
function calculateExtended(buffer, offset) {
  return {
    height: 1 + readUInt24LE(buffer, offset + 7),
    width: 1 + readUInt24LE(buffer, offset + 4)
  };
}
function calculateLossless(buffer, offset) {
  const a = buffer.getUint8(offset + 4);
  const b = buffer.getUint8(offset + 3);
  const c = buffer.getUint8(offset + 2);
  const d = buffer.getUint8(offset + 2);
  const e = buffer.getUint8(offset + 1);
  return {
    height: 1 + ((a & 15) << 10 | b << 2 | (c & 192) >> 6),
    width: 1 + ((d & 63) << 8 | e)
  };
}
function calculateLossy(buffer, offset) {
  return {
    height: readInt16LE(buffer, offset + 8) & 16383,
    width: readInt16LE(buffer, offset + 6) & 16383
  };
}
export const WEBP = {
  validate(buffer, toAscii) {
    const riffHeader = toAscii(buffer, 0, 4) === "RIFF";
    const webpHeader = toAscii(buffer, 8, 12) === "WEBP";
    const vp8Header = toAscii(buffer, 12, 15) === "VP8";
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(buffer, toAscii) {
    const chunkHeader = toAscii(buffer, 12, 16);
    const sampleStart = 20;
    if (chunkHeader === "VP8X") {
      const extendedHeader = buffer.getUint8(sampleStart);
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(buffer, sampleStart);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && buffer.getUint8(sampleStart) !== 47) {
      return calculateLossy(buffer, sampleStart);
    }
    const signature = toHexadecimal(buffer, sampleStart + 3, sampleStart + 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(buffer, sampleStart);
    }
    throw new TypeError("Invalid WebP");
  }
};
