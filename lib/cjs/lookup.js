"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeHandlers_1 = __importDefault(require("./types/typeHandlers"));
/**
 * Return size information based on a buffer
 *
 * @param {imageType | undefined} type detector return by detectType()
 * @param {DataView} view
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {ISizeCalculationResult}
 */
function lookup(type, view, toAscii) {
    if (typeof type !== 'undefined') {
        // find an appropriate handler for this file type
        if (type in typeHandlers_1.default) {
            const size = typeHandlers_1.default[type].calculate(view, toAscii);
            if (size !== undefined) {
                size.type = type;
                return size;
            }
        }
    }
    // throw up, if we don't understand the image type
    throw new TypeError('unsupported image type: ' + type);
}
exports.default = lookup;
