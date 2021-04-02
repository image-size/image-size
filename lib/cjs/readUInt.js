"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUInt32LE = exports.readUInt32BE = exports.readUInt32 = exports.readUInt16LE = exports.readUInt16BE = exports.readUInt16 = exports.readUInt24LE = exports.readInt32LE = exports.readInt16LE = void 0;
function readInt16LE(view, offset) {
    return view.getInt16(offset, true);
}
exports.readInt16LE = readInt16LE;
function readInt32LE(view, offset) {
    return view.getInt32(offset, true);
}
exports.readInt32LE = readInt32LE;
function readUInt24LE(view, offset) {
    return view.getUint32(offset, true) & 0xffffff;
}
exports.readUInt24LE = readUInt24LE;
function readUInt16(view, offset, isBigEndian) {
    return view.getUint16(offset, !isBigEndian);
}
exports.readUInt16 = readUInt16;
function readUInt16BE(view, offset) {
    return view.getUint16(offset, false);
}
exports.readUInt16BE = readUInt16BE;
function readUInt16LE(view, offset) {
    return view.getUint16(offset, true);
}
exports.readUInt16LE = readUInt16LE;
function readUInt32(view, offset, isBigEndian) {
    return view.getUint32(offset, !isBigEndian);
}
exports.readUInt32 = readUInt32;
function readUInt32BE(view, offset) {
    return view.getUint32(offset, false);
}
exports.readUInt32BE = readUInt32BE;
function readUInt32LE(view, offset) {
    return view.getUint32(offset, true);
}
exports.readUInt32LE = readUInt32LE;
