"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSD = void 0;
const readUInt_js_1 = require("../readUInt.js");
exports.PSD = {
    validate(buffer, toAscii) {
        return '8BPS' === toAscii(buffer, 0, 4);
    },
    calculate(buffer) {
        return {
            height: readUInt_js_1.readUInt32BE(buffer, 14),
            width: readUInt_js_1.readUInt32BE(buffer, 18),
        };
    },
};
