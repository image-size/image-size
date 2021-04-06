"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBP = void 0;
const readUInt_1 = require("../readUInt");
const toHexadecimal_1 = __importDefault(require("../toHexadecimal"));
function calculateExtended(buffer, offset) {
    return {
        height: 1 + readUInt_1.readUInt24LE(buffer, offset + 7),
        width: 1 + readUInt_1.readUInt24LE(buffer, offset + 4),
    };
}
function calculateLossless(buffer, offset) {
    const a = buffer.getUint8(offset + 4);
    const b = buffer.getUint8(offset + 3);
    const c = buffer.getUint8(offset + 2);
    const d = buffer.getUint8(offset + 2);
    const e = buffer.getUint8(offset + 1);
    return {
        height: 1 + (((a & 0xf) << 10) | (b << 2) | ((c & 0xc0) >> 6)),
        width: 1 + (((d & 0x3f) << 8) | e),
    };
}
function calculateLossy(buffer, offset) {
    // `& 0x3fff` returns the last 14 bits
    // TO-DO: include webp scaling in the calculations
    return {
        height: readUInt_1.readInt16LE(buffer, offset + 8) & 0x3fff,
        width: readUInt_1.readInt16LE(buffer, offset + 6) & 0x3fff,
    };
}
exports.WEBP = {
    validate(buffer, toAscii) {
        const riffHeader = 'RIFF' === toAscii(buffer, 0, 4);
        const webpHeader = 'WEBP' === toAscii(buffer, 8, 12);
        const vp8Header = 'VP8' === toAscii(buffer, 12, 15);
        return riffHeader && webpHeader && vp8Header;
    },
    calculate(buffer, toAscii) {
        const chunkHeader = toAscii(buffer, 12, 16);
        // const sample = buffer.slice(20, 30)
        const sampleStart = 20;
        // Extended webp stream signature
        if (chunkHeader === 'VP8X') {
            const extendedHeader = buffer.getUint8(sampleStart);
            const validStart = (extendedHeader & 0xc0) === 0;
            const validEnd = (extendedHeader & 0x01) === 0;
            if (validStart && validEnd) {
                return calculateExtended(buffer, sampleStart);
            }
            else {
                // TODO: breaking change
                throw new TypeError('Invalid WebP');
            }
        }
        // Lossless webp stream signature
        if (chunkHeader === 'VP8 ' && buffer.getUint8(sampleStart) !== 0x2f) {
            return calculateLossy(buffer, sampleStart);
        }
        // Lossy webp stream signature
        const signature = toHexadecimal_1.default(buffer, sampleStart + 3, sampleStart + 6);
        if (chunkHeader === 'VP8L' && signature !== '9d012a') {
            return calculateLossless(buffer, sampleStart);
        }
        throw new TypeError('Invalid WebP');
    },
};
