"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KTX = void 0;
const readUInt_js_1 = require("../readUInt.js");
const SIGNATURE = 'KTX 11';
exports.KTX = {
    validate(buffer, toAscii) {
        return SIGNATURE === toAscii(buffer, 1, 7);
    },
    calculate(buffer) {
        return {
            height: readUInt_js_1.readUInt32LE(buffer, 40),
            width: readUInt_js_1.readUInt32LE(buffer, 36),
        };
    },
};
