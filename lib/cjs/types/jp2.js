"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JP2 = void 0;
const readUInt_1 = require("../readUInt");
const toHexadecimal_1 = __importDefault(require("../toHexadecimal"));
const BoxTypes = {
    ftyp: '66747970',
    ihdr: '69686472',
    jp2h: '6a703268',
    jp__: '6a502020',
    rreq: '72726571',
    xml_: '786d6c20',
};
const calculateRREQLength = (box, begin) => {
    const unit = box.getUint8(begin);
    let offset = begin + 1 + 2 * unit;
    const numStdFlags = readUInt_1.readUInt16BE(box, offset);
    const flagsLength = numStdFlags * (2 + unit);
    offset = offset + 2 + flagsLength;
    const numVendorFeatures = readUInt_1.readUInt16BE(box, offset);
    const featuresLength = numVendorFeatures * (16 + unit);
    return offset + 2 + featuresLength;
};
const parseIHDR = (box, offset) => {
    return {
        height: readUInt_1.readUInt32BE(box, offset + 4),
        width: readUInt_1.readUInt32BE(box, offset + 8),
    };
};
exports.JP2 = {
    validate(buffer) {
        const signature = toHexadecimal_1.default(buffer, 4, 8);
        const signatureLength = readUInt_1.readUInt32BE(buffer, 0);
        if (signature !== BoxTypes.jp__ || signatureLength < 1) {
            return false;
        }
        const ftypeBoxStart = signatureLength + 4;
        // const ftypBoxLength = readUInt32BE(buffer, signatureLength)
        // const ftypBox = buffer.buffer.slice(ftypeBoxStart, ftypeBoxStart + ftypBoxLength)
        return (toHexadecimal_1.default(buffer, ftypeBoxStart, ftypeBoxStart + 4) === BoxTypes.ftyp);
    },
    calculate(buffer, toAscii) {
        const signatureLength = readUInt_1.readUInt32BE(buffer, 0);
        const ftypBoxLength = readUInt_1.readUInt16BE(buffer, signatureLength + 2);
        let offset = signatureLength + 4 + ftypBoxLength;
        const nextBoxType = toHexadecimal_1.default(buffer, offset, offset + 4);
        switch (nextBoxType) {
            case BoxTypes.rreq:
                // WHAT ARE THESE 4 BYTES?????
                // eslint-disable-next-line no-case-declarations
                const MAGIC = 4;
                offset = offset + 4 + MAGIC + calculateRREQLength(buffer, offset + 4);
                return parseIHDR(buffer, offset + 8);
            case BoxTypes.jp2h:
                return parseIHDR(buffer, offset + 8);
            default:
                throw new TypeError('Unsupported header found: ' +
                    toAscii(buffer, offset, offset + 4));
        }
    },
};
