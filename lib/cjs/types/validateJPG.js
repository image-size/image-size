"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toHexadecimal_1 = __importDefault(require("../toHexadecimal"));
function validateJPG(view) {
    const SOIMarker = toHexadecimal_1.default(view, 0, 2);
    return SOIMarker;
}
exports.default = validateJPG;
