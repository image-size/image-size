import type { imageType } from './types/imageType';
import type { ToAsciiCallback } from './types/interface';
/**
 * detect the image type
 *
 * @param {DataView} view - view of buffer
 * @param {function} toAscii - function to transform byte to ascii string
 * @returns {imageType | undefined} - returns image type (as string)
 **/
declare const detectType: {
    (view: DataView, toAscii: ToAsciiCallback): imageType | undefined;
    default: any;
};
export default detectType;
