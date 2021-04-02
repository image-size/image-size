"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSize = exports.detect = exports.lookup = void 0;
const detector_js_1 = require("./detector.js");
const index_js_1 = require("./types/index.js");
/**
 * Return size information based on a buffer
 *
 * @param {imageType | undefined} type detector return by detectType()
 * @param {DataView} view
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {ISizeCalculationResult}
 */
function lookup(type, view, cb) {
    if (typeof type !== 'undefined') {
        // find an appropriate handler for this file type
        if (type in index_js_1.typeHandlers) {
            const size = index_js_1.typeHandlers[type].calculate(view, cb);
            if (size !== undefined) {
                size.type = type;
                return size;
            }
        }
    }
    // throw up, if we don't understand the image type
    throw new TypeError('unsupported image type: ' + type);
}
exports.lookup = lookup;
/**
 * detect the image type
 *
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {
 **/
function detect(view, toAscii) {
    return detector_js_1.detector(view, toAscii);
}
exports.detect = detect;
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
function imageSize(view, toAscii) {
    if (typeof toAscii !== 'function') {
        throw new Error('toAscii is not a callback function');
    }
    // detect the file type.. don't rely on the extension
    const type = detect(view, toAscii);
    return lookup(type, view, toAscii);
}
exports.imageSize = imageSize;
