import firstBytes from "./firstBytes.js";
import keys from "./keys.js";
import typeHandlers from "./types/typeHandlers.js";
const detectType = (view, toAscii) => {
  const byte = view.getUint8(0);
  if (byte in firstBytes) {
    const type = firstBytes[byte];
    if (type && typeHandlers[type].validate(view, toAscii)) {
      return type;
    }
  }
  const finder = (key) => typeHandlers[key].validate(view, toAscii);
  return keys.find(finder);
};
detectType.default = detectType;
export default detectType;
