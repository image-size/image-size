import { readUInt32LE } from '../readUInt.js';
export const DDS = {
    validate(buffer) {
        return readUInt32LE(buffer, 0) === 0x20534444;
    },
    calculate(buffer) {
        return {
            height: readUInt32LE(buffer, 12),
            width: readUInt32LE(buffer, 16),
        };
    },
};
