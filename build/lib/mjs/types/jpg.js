import {readUInt16, readUInt32, readUInt16BE} from "../readUInt.js";
import toHexadecimal from "../toHexadecimal.js";
const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(buffer, offset) {
  return toHexadecimal(buffer, offset + 2, offset + 6) === EXIF_MARKER;
}
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
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
  if (buffer.getUint8(index) !== 255) {
    throw new TypeError("Invalid JPG, marker table corrupted");
  }
}
export const JPG = {
  validate(buffer) {
    const SOIMarker = toHexadecimal(buffer, 0, 2);
    return SOIMarker === "ffd8";
  },
  calculate(buffer) {
    let offset = 4;
    let orientation;
    let next;
    while (buffer.byteLength) {
      const i = readUInt16BE(buffer, offset);
      if (isEXIF(buffer, offset)) {
        orientation = validateExifBlock(buffer, i);
      }
      validateBuffer(buffer, i);
      next = buffer.getUint8(i + 1);
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(buffer, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      offset = i + 2;
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};
