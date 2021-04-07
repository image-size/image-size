import type {
  ISizeCalculationResult,
  ToAsciiCallback,
} from './types/interface';
import lookup from './lookup';
import detectType from './detectType';

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
export const imageSize = (
  view: DataView,
  toAscii: ToAsciiCallback,
): ISizeCalculationResult => {
  if (typeof toAscii !== 'function') {
    throw new Error('toAscii is not a callback function');
  }

  // detect the file type.. don't rely on the extension
  const type = detectType(view, toAscii);
  return lookup(type, view, toAscii);
};

export const libName = 'image-size-view';

imageSize.default = imageSize;
export default imageSize;
