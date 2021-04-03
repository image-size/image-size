import firstBytes from './firstBytes';
import keys from './keys';
import type { imageType } from './types/imageType';
import typeHandlers from './types/typeHandlers';
import type { ToAsciiCallback } from './types/interface';

/**
 * detect the image type 
 * 
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {imageType | undefined} - returns image type (as string)
 **/
const detectType = (
  view: DataView, 
  toAscii: ToAsciiCallback
  ): imageType | undefined => {
  const byte = view.getUint8(0);
  if (byte in firstBytes) {
    const type = firstBytes[byte];
    if (type && typeHandlers[type].validate(view, toAscii)) {
      return type;
    }
  }

  const finder = (key: imageType) => typeHandlers[key].validate(view, toAscii);
  return keys.find(finder);
}

detectType.default = detectType;
export default detectType;