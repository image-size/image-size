import { readUInt16, readUInt32 } from '../readUInt';
import toHexadecimal from '../toHexadecimal';
import type { IImage } from './interface';
import {
  isBigEndian as isTiffBigEndian,
  getIdfOffset as getTiffIdfOffset,
  extractIdfEntry as extractTiffIdfEntry,
  intoResult as intoTiffResult,
  getNoOfIdfEntries as getTiffNoOfIdfEntries,
  beginIndexForIdf as beginIndexForTiffIdf,
  endIndexForIdf as endIndexForTiffIdf,
  getStrideForIdf as getStrideForTiffIdf,
  getIdfOffsetLocation as getTiffIdfOffsetLocation,
} from './tiffHelpers';
import type { TiffTagLookup } from './tiffHelpers';

const signatures = [
  // '492049', // currently not supported
  '49492a00', // Little endian
  '4d4d002a', // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];

export const TIFF: IImage = {
  validate(view, toAscii) {
    const fileSignature = toHexadecimal(view, 0, 4);
    // console.log('file sig', fileSignature);
    return signatures.includes(fileSignature);
  },

  calculate(view, toAscii) {
    // Determine BE/LE
    const initialLocation = getTiffIdfOffsetLocation();
    const isBigEndian = isTiffBigEndian(view, toAscii, initialLocation);

    // read the IFD
    const ifdOffset = getTiffIdfOffset(view, isBigEndian);

    // extract the tags from the IFD
    const tags: TiffTagLookup = {};
    let nextOffset = ifdOffset;
    do {
      const noOfEntries = getTiffNoOfIdfEntries(view, nextOffset, isBigEndian);

      const start = beginIndexForTiffIdf(nextOffset);
      const end = endIndexForTiffIdf(nextOffset, noOfEntries);
      const stride = getStrideForTiffIdf();

      for (let i = start; i < end; i += stride) {
        extractTiffIdfEntry(tags, view, i, isBigEndian);
      }

      nextOffset = getTiffIdfOffset(view, isBigEndian, end);
    } while (nextOffset !== 0);

    return intoTiffResult(tags);
  },
};
