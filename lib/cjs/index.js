"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.libName = exports.imageSize = void 0;
const lookup_1 = __importDefault(require("./lookup"));
const detectType_1 = __importDefault(require("./detectType"));
/**
 * get image size and type from a DataView of buffer
 *
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {
 *  {
 *  width: number,
 *  height: number,
 *  orientation?: number,
 *  type?: string
 * }
 * } image size
 */
const imageSize = (view, toAscii) => {
    if (typeof toAscii !== 'function') {
        throw new Error('toAscii is not a callback function');
    }
    // detect the file type.. don't rely on the extension
    const type = detectType_1.default(view, toAscii);
    return lookup_1.default(type, view, toAscii);
};
exports.imageSize = imageSize;
exports.libName = 'image-size-view';
exports.imageSize.default = exports.imageSize;
exports.default = exports.imageSize;
