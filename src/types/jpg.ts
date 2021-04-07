// NOTE: we only support baseline and progressive JPGs here
// due to the structure of the loader class, we only get a buffer
// with a maximum size of 4096 bytes. so if the SOF marker is outside
// if this range we can't detect the file size correctly.

import type { IImage, ISize, ToAsciiCallback } from './interface';
import { readUInt16, readUInt32, readUInt16BE } from '../readUInt';
import toHexadecimal from '../toHexadecimal';
import validateJPG from './validateJPG';
import readJpgBlockLength from './readJpgBlockLength';
import isEXIFAppMarker from './isEXIFAppMarker';

const EXIF_MARKER = '45786966';
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = '4d4d';
const LITTLE_ENDIAN_BYTE_ALIGN = '4949';

// Each entry is exactly 12 bytes
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;

// function isEXIF(buffer: DataView, offset: number): boolean {
//   return toHexadecimal(buffer, offset + 2, offset + 6) === EXIF_MARKER;
// }

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
    throw new TypeError(
      `Corrupt JPG index (${index}), exceeded buffer limits (${buffer.byteLength})`,
    );
  }
  // Every JPEG block must begin with a 0xFF
  if (buffer.getUint8(index) !== 0xff) {
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

const readMarker = (view: DataView, index: number): number => {
  return readUInt16BE(view, index);
};

export const JPG: IImage = {
  validate(buffer: DataView) {
    const markerShort = validateJPG(buffer); // SOI
    return markerShort === 'ffd8';
  },

  calculate(buffer: DataView, toAscii: ToAsciiCallback) {
    // Skip 2 bytes, first is SOI
    let offset = 2;

    let orientation: number | undefined;
    let next: number;
    while (offset < buffer.byteLength) {
      // or EOI 0xffD9
      // console.log('@shortMarker', offset)
      const shortMarker = readMarker(buffer, offset);

      // console.log('=shortMarker ', shortMarker.toString(16));

      let markerOffset = offset + 2;
      // console.log('@blockLength', markerOffset)
      const blockLength = readJpgBlockLength(buffer, markerOffset);
      // console.log('=blockLength', blockLength)

      const headerOffset = markerOffset + 2;
      if (isEXIFAppMarker(buffer, shortMarker, headerOffset)) {
        // console.log('EXIF HERE')
        const EXIF_IDENTIFIER_ID_LEN = 6;
        orientation = validateExifBlock(
          buffer,
          headerOffset + EXIF_IDENTIFIER_ID_LEN,
        );
        // console.log('orientation', orientation);
      }

      // ensure correct format
      validateBuffer(buffer, offset);

      // 0xFFC0 is baseline standard(SOF)
      // 0xFFC1 is baseline optimized(SOF)
      // 0xFFC2 is progressive(SOF2)
      // next = buffer.getUint8(i + 1);
      if (
        shortMarker === 0xffc0 ||
        shortMarker === 0xffc1 ||
        shortMarker === 0xffc2
      ) {
        // https://www.ccoderun.ca/programming/2017-01-31_jpeg/
        const size = extractSize(buffer, markerOffset + 3);

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
      offset = markerOffset + blockLength;
      // buffer = buffer.slice(i + 2)
    }

    throw new TypeError('Invalid JPG, no size found');
  },
};
