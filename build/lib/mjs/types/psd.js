import {readUInt32BE} from "../readUInt.js";
export const PSD = {
  validate(buffer, toAscii) {
    return toAscii(buffer, 0, 4) === "8BPS";
  },
  calculate(buffer) {
    return {
      height: readUInt32BE(buffer, 14),
      width: readUInt32BE(buffer, 18)
    };
  }
};
