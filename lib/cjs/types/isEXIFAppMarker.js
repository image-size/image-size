"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readUInt_1 = require("../readUInt");
const EXIF_MARKER_HI_UINT32_BE = 1165519206;
const EXIF_MARKER_LO_UINT16_BE = 0;
const compareEXIFIdentifier = (view, offset) => {
    const identifierHi = readUInt_1.readUInt32BE(view, offset);
    const identiferLo = readUInt_1.readUInt16BE(view, offset + 4);
    // console.log('=identifier', identifierHi, identiferLo)
    return (identifierHi === EXIF_MARKER_HI_UINT32_BE
        && identiferLo === EXIF_MARKER_LO_UINT16_BE);
};
function isEXIFAppMarker(view, shortMarker, offset
// ,toAscii: ToAsciiCallback,
) {
    // console.log('@identifier', offset);
    if (shortMarker == 0xffe1) {
        const flag = compareEXIFIdentifier(view, offset);
        // const identifer = toAscii(view, offset, offset + 6);
        // console.log('=identifier', identifer, flag);
        return flag;
    }
    else {
        return false;
    }
}
exports.default = isEXIFAppMarker;
