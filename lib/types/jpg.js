'use strict';

var readUInt = require('../readUInt');

// NOTE: we only support baseline and progressive JPGs here
// due to the structure of the loader class, we only get a buffer
// with a maximum size of 4096 bytes. so if the SOF marker is outside
// if this range we can't detect the file size correctly.

function isJPG (buffer) { //, filepath
  var SOIMarker = buffer.toString('hex', 0, 2);
  return ('ffd8' === SOIMarker);
}

function isEXIF (buffer) { //, filepath
  var exifMarker = buffer.toString('hex', 2, 6);
  return (exifMarker === '45786966'); // 'Exif'
}

function extractSize (buffer, i) {
  return {
    'height' : buffer.readUInt16BE(i),
    'width' : buffer.readUInt16BE(i + 2)
  };
}

var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = '4d4d';

// Each entry is exactly 12 bytes
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;

function extractOrientation (buffer, i) {
  // Skip APP1 Data Size
  var exifBlock = buffer.slice(APP1_DATA_SIZE_BYTES, i);

  // Consider byte alignment
  var byteAlign = exifBlock.toString('hex', EXIF_HEADER_BYTES, EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES);
  var bigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;

  // TODO: assert that this contains 0x002A
  // var STATIC_MOTOROLA_TIFF_HEADER_BYTES = 2;
  // var TIFF_IMAGE_FILE_DIRECTORY_BYTES = 4;

  // TODO: derive from TIFF_IMAGE_FILE_DIRECTORY_BYTES
  var idfOffset = 8;

  // IDF osset works from right after the header bytes
  // (so the offset includes the tiff byte align)
  var offset = EXIF_HEADER_BYTES + idfOffset;

  var idfDirectoryEntries = readUInt(exifBlock, 16, offset, bigEndian);

  var start;
  var end;
  for (var directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    start = offset + NUM_DIRECTORY_ENTRIES_BYTES + (directoryEntryNumber * IDF_ENTRY_BYTES);
    end = start + IDF_ENTRY_BYTES;

    var block = exifBlock.slice(start, end);
    var tagNumber = readUInt(block, 16, 0, bigEndian);

    // 0x0112 (decimal: 274) is the `orientation` tag ID
    if (tagNumber === 274) {
      var dataFormat = readUInt(block, 16, 2, bigEndian);
      if (dataFormat !== 3) {
        return;
      }

      // unsinged int has 2 bytes per component
      // if there would more than 4 bytes in total it's a pointer
      var numberOfComponents = readUInt(block, 32, 4, bigEndian);
      if (numberOfComponents !== 1) {
        return;
      }

      var orientation = readUInt(block, 16, 8, bigEndian);

      return orientation;
    }
  }
}

function validateBuffer (buffer, i) {
  // index should be within buffer limits
  if (i > buffer.length) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits');
  }
  // Every JPEG block must begin with a 0xFF
  if (buffer[i] !== 0xFF) {
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

function calculate (buffer) {
  // Skip 4 chars, they are for signature
  buffer = buffer.slice(4);

  var orientation;

  var i, next;
  while (buffer.length) {
    // read length of the next block
    i = buffer.readUInt16BE(0);


    if (isEXIF(buffer)) {
      orientation = extractOrientation(buffer, i);
    }

    // ensure correct format
    validateBuffer(buffer, i);

    // 0xFFC0 is baseline standard(SOF)
    // 0xFFC1 is baseline optimized(SOF)
    // 0xFFC2 is progressive(SOF2)
    next = buffer[i + 1];
    if (next === 0xC0 || next === 0xC1 || next === 0xC2) {
      var size = extractSize(buffer, i + 5);

      if (!orientation) {
        return size;
      }

      return {
        width: size.width,
        height: size.height,
        orientation: orientation
      };
    }

    // move to the next block
    buffer = buffer.slice(i + 2);
  }

  throw new TypeError('Invalid JPG, no size found');
}

module.exports = {
  'detect': isJPG,
  'calculate': calculate
};
