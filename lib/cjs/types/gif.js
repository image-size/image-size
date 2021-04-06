"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIF = void 0;
const readUInt_1 = require("../readUInt");
const gifRegexp = /^GIF8[79]a/;
exports.GIF = {
    validate(buffer, toAscii) {
        const signature = toAscii(buffer, 0, 6);
        return gifRegexp.test(signature);
    },
    calculate(buffer) {
        return {
            height: readUInt_1.readUInt16LE(buffer, 8),
            width: readUInt_1.readUInt16LE(buffer, 6),
        };
    },
};
