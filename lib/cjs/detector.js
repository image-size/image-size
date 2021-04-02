"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detector = void 0;
const index_js_1 = require("./types/index.js");
const keys = Object.keys(index_js_1.typeHandlers);
// This map helps avoid validating for every single image type
const firstBytes = {
    0x38: 'psd',
    0x42: 'bmp',
    0x44: 'dds',
    0x47: 'gif',
    // 0x49: 'tiff',
    // 0x4d: 'tiff',
    0x52: 'webp',
    0x69: 'icns',
    0x89: 'png',
    0xff: 'jpg',
};
function detector(view, toAscii) {
    const byte = view.getUint8(0);
    if (byte in firstBytes) {
        const type = firstBytes[byte];
        if (type && index_js_1.typeHandlers[type].validate(view, toAscii)) {
            return type;
        }
    }
    const finder = (key) => index_js_1.typeHandlers[key].validate(view, toAscii);
    return keys.find(finder);
}
exports.detector = detector;
