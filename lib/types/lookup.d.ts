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
export default function lookup(type: imageType | undefined, view: DataView, toAscii: ToAsciiCallback): ISizeCalculationResult;
