"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDS = void 0;
const readUInt_js_1 = require("../readUInt.js");
exports.DDS = {
    validate(buffer) {
        return readUInt_js_1.readUInt32LE(buffer, 0) === 0x20534444;
    },
    calculate(buffer) {
        return {
            height: readUInt_js_1.readUInt32LE(buffer, 12),
            width: readUInt_js_1.readUInt32LE(buffer, 16),
        };
    },
};
