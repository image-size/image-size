import type { imageType } from './imageType';

// ["cur", "ico", "j2c", "jp2", "ktx", "pnm", "svg"]
// every image handler not covered by the first byte lookup
export const specificHandlers: imageType[] = [
  'cur',
  'ico',
  'j2c',
  'jp2',
  'ktx',
  'pnm',
  'svg',
  'tiff',
];
