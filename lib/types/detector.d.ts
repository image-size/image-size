import { imageType } from './types/index.js';
import type { ToAsciiCallback } from './types/interface.js';
export declare function detector(view: DataView, toAscii: ToAsciiCallback): imageType | undefined;
