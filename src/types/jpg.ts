// NOTE: we only support baseline and progressive JPGs here
// due to the structure of the loader class, we only get a buffer
// with a maximum size of 4096 bytes. so if the SOF marker is outside
// if this range we can't detect the file size correctly.

import type { IImage, ISize } from './interface';
import { readUInt16, readUInt32, readUInt16BE } from '../readUInt';
import toHexadecimal from '../toHexadecimal';

const EXIF_MARKER = '45786966';
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = '4d4d';
const LITTLE_ENDIAN_BYTE_ALIGN = '4949';

// Each entry is exactly 12 bytes
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;

function isEXIF(buffer: DataView, offset: number): boolean {
  return toHexadecimal(buffer, offset + 2, offset + 6) === EXIF_MARKER;
}

function extractSize(buffer: DataView, index: number): ISize {
  return {
    height: readUInt16BE(buffer, index),
    width: readUInt16BE(buffer, index + 2),
  };
}

function extractOrientation(
  exifBlock: DataView,
  begin: number,
  isBigEndian: boolean,
) {
  // TODO: assert that this contains 0x002A
  // let STATIC_MOTOROLA_TIFF_HEADER_BYTES = 2
  // let TIFF_IMAGE_FILE_DIRECTORY_BYTES = 4

  // TODO: derive from TIFF_IMAGE_FILE_DIRECTORY_BYTES
  const idfOffset = 8;

  // IDF osset works from right after the header bytes
  // (so the offset includes the tiff byte align)
  const offset = begin + EXIF_HEADER_BYTES + idfOffset;

  const idfDirectoryEntries = readUInt16(exifBlock, offset, isBigEndian);

  for (
    let directoryEntryNumber = 0;
    directoryEntryNumber < idfDirectoryEntries;
    directoryEntryNumber++
  ) {
    const start =
      offset +
      NUM_DIRECTORY_ENTRIES_BYTES +
      directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;

    // Skip on corrupt EXIF blocks
    if (start > exifBlock.byteLength) {
      return;
    }

    // const block = exifBlock.slice(start, end)
    const blockStart = start;
    const tagNumber = readUInt16(exifBlock, blockStart, isBigEndian);

    // 0x0112 (decimal: 274) is the `orientation` tag ID
    if (tagNumber === 274) {
      const dataFormat = readUInt16(exifBlock, blockStart + 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }

      // unsinged int has 2 bytes per component
      // if there would more than 4 bytes in total it's a pointer
      const numberOfComponents = readUInt32(
        exifBlock,
        blockStart + 4,
        isBigEndian,
      );
      if (numberOfComponents !== 1) {
        return;
      }

      return readUInt16(exifBlock, blockStart + 8, isBigEndian);
    }
  }
}

function validateExifBlock(buffer: DataView, index: number) {
  // Skip APP1 Data Size
  // const exifBlock = buffer.slice(APP1_DATA_SIZE_BYTES, index)
  const start = index;

  // Consider byte alignment
  // const byteAlign = toHexadecimal(exifBlock, EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES)
  const byteAlign = toHexadecimal(
    buffer,
    index + EXIF_HEADER_BYTES,
    index + EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES,
  );

  // Ignore Empty EXIF. Validate byte alignment
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;

  if (isBigEndian || isLittleEndian) {
    return extractOrientation(buffer, index, isBigEndian);
  }
}

function validateBuffer(buffer: DataView, index: number): void {
  // index should be within buffer limits
  if (index > buffer.byteLength) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits');
  }
  // Every JPEG block must begin with a 0xFF
  if (buffer.getUint8(index) !== 0xff) {
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

export const JPG: IImage = {
  validate(buffer: DataView) {
    const SOIMarker = toHexadecimal(buffer, 0, 2);
    return 'ffd8' === SOIMarker;
  },

  calculate(buffer: DataView) {
    // Skip 4 chars, they are for signature
    // buffer = buffer.slice(4)
    let offset = 4;

    let orientation: number | undefined;
    let next: number;
    while (buffer.byteLength) {
      // read length of the next block
      const i = readUInt16BE(buffer, offset);

      if (isEXIF(buffer, offset)) {
        orientation = validateExifBlock(buffer, i);
      }

      // ensure correct format
      validateBuffer(buffer, i);

      // 0xFFC0 is baseline standard(SOF)
      // 0xFFC1 is baseline optimized(SOF)
      // 0xFFC2 is progressive(SOF2)
      next = buffer.getUint8(i + 1);
      if (next === 0xc0 || next === 0xc1 || next === 0xc2) {
        const size = extractSize(buffer, i + 5);

        // TODO: is orientation=0 a valid answer here?
        if (!orientation) {
          return size;
        }

        return {
          height: size.height,
          orientation,
          width: size.width,
        };
      }

      // move to the next block
      offset = i + 2;
      // buffer = buffer.slice(i + 2)
    }

    throw new TypeError('Invalid JPG, no size found');
  },
};
