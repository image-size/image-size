import { readUInt16LE } from '../readUInt.js';
const gifRegexp = /^GIF8[79]a/;
export const GIF = {
    validate(buffer, toAscii) {
        const signature = toAscii(buffer, 0, 6);
        return gifRegexp.test(signature);
    },
    calculate(buffer) {
        return {
            height: readUInt16LE(buffer, 8),
            width: readUInt16LE(buffer, 6),
        };
    },
};
