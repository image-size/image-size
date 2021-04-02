"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUR = void 0;
const ico_js_1 = require("./ico.js");
const readUInt_js_1 = require("../readUInt.js");
const TYPE_CURSOR = 2;
exports.CUR = {
    validate(buffer) {
        if (readUInt_js_1.readUInt16LE(buffer, 0) !== 0) {
            return false;
        }
        return readUInt_js_1.readUInt16LE(buffer, 2) === TYPE_CURSOR;
    },
    calculate(buffer, toAscii) {
        return ico_js_1.ICO.calculate(buffer, toAscii);
    },
};
