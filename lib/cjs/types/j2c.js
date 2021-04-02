"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.J2C = void 0;
const readUInt_js_1 = require("../readUInt.js");
const toHexadecimal_js_1 = __importDefault(require("../toHexadecimal.js"));
exports.J2C = {
    validate(buffer) {
        // TODO: this doesn't seem right. SIZ marker doesnt have to be right after the SOC
        return toHexadecimal_js_1.default(buffer, 0, 4) === 'ff4fff51';
    },
    calculate(buffer) {
        return {
            height: readUInt_js_1.readUInt32BE(buffer, 12),
            width: readUInt_js_1.readUInt32BE(buffer, 8),
        };
    },
};
