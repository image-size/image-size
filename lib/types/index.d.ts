import type { imageType } from './types/index.js';
import type { ISizeCalculationResult, ToAsciiCallback } from './types/interface.js';
/**
 * Return size information based on a buffer
 *
 * @param {imageType | undefined} type detector return by detectType()
 * @param {DataView} view
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {ISizeCalculationResult}
 */
export declare function lookup(type: imageType | undefined, view: DataView, cb: ToAsciiCallback): ISizeCalculationResult;
/**
 * detect the image type
 *
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {
 **/
export declare function detect(view: DataView, toAscii: ToAsciiCallback): imageType | undefined;
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
export declare function imageSize(view: DataView, toAscii: ToAsciiCallback): ISizeCalculationResult;
