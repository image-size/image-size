import typeHandlers from './types/typeHandlers';
import type { imageType } from './types/imageType';
import type { ISizeCalculationResult, ToAsciiCallback } from './types/interface';

/**
 * Return size information based on a buffer
 *
 * @param {imageType | undefined} type detector return by detectType()
 * @param {DataView} view
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {ISizeCalculationResult}
 */
export default function lookup(
  type: imageType | undefined,
  view: DataView,
  toAscii: ToAsciiCallback
): ISizeCalculationResult { 

  if (typeof type !== 'undefined') {
    // find an appropriate handler for this file type
    if (type in typeHandlers) {
      const size = typeHandlers[type].calculate(view, toAscii);
      if (size !== undefined) {
        size.type = type;
        return size;
      }
    }
  }

  // throw up, if we don't understand the image type
  throw new TypeError(
    'unsupported image type: ' + type,
  );
}