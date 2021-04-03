import {readUInt32LE} from "../readUInt.js";
export const DDS = {
  validate(buffer) {
    return readUInt32LE(buffer, 0) === 542327876;
  },
  calculate(buffer) {
    return {
      height: readUInt32LE(buffer, 12),
      width: readUInt32LE(buffer, 16)
    };
  }
};
