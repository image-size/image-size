import typeHandlers from "./types/typeHandlers.js";
export default function lookup(type, view, toAscii) {
  if (typeof type !== "undefined") {
    if (type in typeHandlers) {
      const size = typeHandlers[type].calculate(view, toAscii);
      if (size !== void 0) {
        size.type = type;
        return size;
      }
    }
  }
  throw new TypeError("unsupported image type: " + type);
}
