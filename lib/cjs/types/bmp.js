"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BMP = void 0;
const readUInt_js_1 = require("../readUInt.js");
exports.BMP = {
    validate(buffer, toAscii) {
        return 'BM' === toAscii(buffer, 0, 2);
    },
    calculate(buffer) {
        return {
            height: Math.abs(readUInt_js_1.readInt32LE(buffer, 22)),
            width: readUInt_js_1.readUInt32LE(buffer, 18),
        };
    },
};
