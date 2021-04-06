"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSD = void 0;
const readUInt_1 = require("../readUInt");
exports.PSD = {
    validate(buffer, toAscii) {
        return '8BPS' === toAscii(buffer, 0, 4);
    },
    calculate(buffer) {
        return {
            height: readUInt_1.readUInt32BE(buffer, 14),
            width: readUInt_1.readUInt32BE(buffer, 18),
        };
    },
};
