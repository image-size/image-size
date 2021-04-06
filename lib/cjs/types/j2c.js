"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.J2C = void 0;
const readUInt_1 = require("../readUInt");
const toHexadecimal_1 = __importDefault(require("../toHexadecimal"));
exports.J2C = {
    validate(buffer) {
        // TODO: this doesn't seem right. SIZ marker doesnt have to be right after the SOC
        return toHexadecimal_1.default(buffer, 0, 4) === 'ff4fff51';
    },
    calculate(buffer) {
        return {
            height: readUInt_1.readUInt32BE(buffer, 12),
            width: readUInt_1.readUInt32BE(buffer, 8),
        };
    },
};
