"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readUInt_1 = require("../readUInt");
function readJpgBlockLength(view, offset) {
    // read length of the next block
    return readUInt_1.readUInt16BE(view, offset);
}
exports.default = readJpgBlockLength;
