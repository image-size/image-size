import lookup from "./lookup.js";
import detectType from "./detectType.js";
export function imageSize(view, toAscii) {
  if (typeof toAscii !== "function") {
    throw new Error("toAscii is not a callback function");
  }
  const type = detectType(view, toAscii);
  return lookup(type, view, toAscii);
}
imageSize.default = imageSize;
export default imageSize;
