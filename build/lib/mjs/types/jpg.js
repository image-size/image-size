import {readUInt16, readUInt32, readUInt16BE} from "../readUInt.js";
import toHexadecimal from "../toHexadecimal.js";
import validateJPG from "./validateJPG.js";
import readJpgBlockLength from "./readJpgBlockLength.js";
import isEXIFAppMarker from "./isEXIFAppMarker.js";
const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function extractSize(buffer, index) {
  return {
    height: readUInt16BE(buffer, index),
    width: readUInt16BE(buffer, index + 2)
  };
}
function extractOrientation(exifBlock, begin, isBigEndian) {
  const idfOffset = 8;
  const offset = begin + EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt16(exifBlock, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.byteLength) {
      return;
    }
    const blockStart = start;
    const tagNumber = readUInt16(exifBlock, blockStart, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt16(exifBlock, blockStart + 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt32(exifBlock, blockStart + 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt16(exifBlock, blockStart + 8, isBigEndian);
    }
  }
}
function validateExifBlock(buffer, index) {
  const start = index;
  const byteAlign = toHexadecimal(buffer, index + EXIF_HEADER_BYTES, index + EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(buffer, index, isBigEndian);
  }
}
function validateBuffer(buffer, index) {
  if (index > buffer.byteLength) {
    throw new TypeError(`Corrupt JPG index (${index}), exceeded buffer limits (${buffer.byteLength})`);
  }
  if (buffer.getUint8(index) !== 255) {
    throw new TypeError("Invalid JPG, marker table corrupted");
  }
}
const readMarker = (view, index) => {
  return readUInt16BE(view, index);
};
export const JPG = {
  validate(buffer) {
    const markerShort = validateJPG(buffer);
    return markerShort === "ffd8";
  },
  calculate(buffer, toAscii) {
    let offset = 2;
    let orientation;
    let next;
    while (offset < buffer.byteLength) {
      const shortMarker = readMarker(buffer, offset);
      let markerOffset = offset + 2;
      const blockLength = readJpgBlockLength(buffer, markerOffset);
      const headerOffset = markerOffset + 2;
      if (isEXIFAppMarker(buffer, shortMarker, headerOffset)) {
        const EXIF_IDENTIFIER_ID_LEN = 6;
        orientation = validateExifBlock(buffer, headerOffset + EXIF_IDENTIFIER_ID_LEN);
      }
      validateBuffer(buffer, offset);
      if (shortMarker === 65472 || shortMarker === 65473 || shortMarker === 65474) {
        const size = extractSize(buffer, markerOffset + 3);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      offset = markerOffset + blockLength;
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};
