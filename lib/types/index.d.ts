import type { ISizeCalculationResult, ToAsciiCallback } from './types/interface';
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
export declare namespace imageSize {
    var _a: typeof imageSize;
    export { _a as default };
}
export default imageSize;
