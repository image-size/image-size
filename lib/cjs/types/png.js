"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNG = void 0;
const readUInt_1 = require("../readUInt");
const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';
// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI';
exports.PNG = {
    validate(buffer, toAscii) {
        if (pngSignature === toAscii(buffer, 1, 8)) {
            let chunkName = toAscii(buffer, 12, 16);
            if (chunkName === pngFriedChunkName) {
                chunkName = toAscii(buffer, 28, 32);
            }
            if (chunkName !== pngImageHeaderChunkName) {
                throw new TypeError('Invalid PNG');
            }
            return true;
        }
        return false;
    },
    calculate(buffer, toAscii) {
        if (toAscii(buffer, 12, 16) === pngFriedChunkName) {
            return {
                height: readUInt_1.readUInt32BE(buffer, 36),
                width: readUInt_1.readUInt32BE(buffer, 32),
            };
        }
        return {
            height: readUInt_1.readUInt32BE(buffer, 20),
            width: readUInt_1.readUInt32BE(buffer, 16),
        };
    },
};
