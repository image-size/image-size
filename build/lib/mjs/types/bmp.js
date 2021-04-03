import {readInt32LE, readUInt32LE} from "../readUInt.js";
export const BMP = {
  validate(buffer, toAscii) {
    return toAscii(buffer, 0, 2) === "BM";
  },
  calculate(buffer) {
    return {
      height: Math.abs(readInt32LE(buffer, 22)),
      width: readUInt32LE(buffer, 18)
    };
  }
};
