"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUR = void 0;
const ico_1 = require("./ico");
const readUInt_1 = require("../readUInt");
const TYPE_CURSOR = 2;
exports.CUR = {
    validate(buffer) {
        if (readUInt_1.readUInt16LE(buffer, 0) !== 0) {
            return false;
        }
        return readUInt_1.readUInt16LE(buffer, 2) === TYPE_CURSOR;
    },
    calculate(buffer, toAscii) {
        return ico_1.ICO.calculate(buffer, toAscii);
    },
};
