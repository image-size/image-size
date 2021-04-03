"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firstBytes_js_1 = __importDefault(require("./firstBytes.js"));
const keys_js_1 = __importDefault(require("./keys.js"));
const typeHandlers_js_1 = __importDefault(require("./types/typeHandlers.js"));
/**
 * detect the image type
 *
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {imageType | undefined} - returns image type (as string)
 **/
const detectType = (view, toAscii) => {
    const byte = view.getUint8(0);
    if (byte in firstBytes_js_1.default) {
        const type = firstBytes_js_1.default[byte];
        if (type && typeHandlers_js_1.default[type].validate(view, toAscii)) {
            return type;
        }
    }
    const finder = (key) => typeHandlers_js_1.default[key].validate(view, toAscii);
    return keys_js_1.default.find(finder);
};
detectType.default = detectType;
exports.default = detectType;
