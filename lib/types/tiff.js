'use strict';

// based on http://www.compix.com/fileformattif.htm
// TO-DO: support big-endian as well

var fs = require('fs');
var readUInt = require('../readUInt');

var WIDTH = 256;
var HEIGHT = 257;

function isTIFF (buffer) {
  return determineEndianness(buffer);
}

// Read IFD (image-file-directory) into a buffer
function readIFD (buffer, isBigEndian) {
  var ifdOffset = readUInt(buffer, 32, 4, isBigEndian);
  var ifdDirEntries = readUInt(buffer, 16, ifdOffset, isBigEndian);
  var ifdStart = ifdOffset + 2;
  return buffer.slice(ifdStart, ifdStart + ifdDirEntries * 12);
}

// TIFF values seem to be messed up on Big-Endian, this helps
function readValue (buffer, isBigEndian) {
  var low = readUInt(buffer, 16, 8, isBigEndian);
  var high = readUInt(buffer, 16, 10, isBigEndian);
  return (high << 16) + low;
}

// move to the next tag
function nextTag (buffer) {
  return buffer.slice(12);
}

// Extract IFD tags from TIFF metadata
function extractTags (buffer, isBigEndian) {
  var tags = {};
  var code;

  while (buffer && buffer.length) {
    code = readUInt(buffer, 16, 0, isBigEndian);
    // WIDTH == 256 is width, HEIGHT == 257 is height
    if (typeof tags[WIDTH] != 'undefined'
      && typeof tags[HEIGHT] != 'undefined'){
      break; 
    } else {
      if (code == WIDTH || code == HEIGHT){
        dbg("Code: %d | Value: %d", code, readValue(buffer, isBigEndian));
        tags[code] = readValue(buffer, isBigEndian);
      }
    }
    // move to the next tag
    buffer = nextTag(buffer);
  }
  return tags;
}

// Test if the TIFF is Big Endian or Little Endian
function determineEndianness (buffer) {
  var hex4 = buffer.toString('hex', 0, 4);
  return '49492a00' == hex4 
    ? 'LE'
    : '4d4d002a' == hex4
    ? 'BE'
    : false;
}

function calculate (buffer) {
  // Determine BE/LE
  var isBigEndian = determineEndianness(buffer) === 'BE';

  // read the IFD
  var ifdBuffer = readIFD(buffer, isBigEndian);

  // extract the tags from the IFD
  var tags = extractTags(ifdBuffer, isBigEndian);

  if (typeof tags[WIDTH] == 'undefined' || typeof tags[HEIGHT] == 'undefined') {
    throw new TypeError('Invalid Tiff, missing tags');
  }

  return {
    'width': tags[WIDTH],
    'height': tags[HEIGHT]
  };
}

module.exports = {
  'detect': isTIFF,
  'calculate': calculate,
  'extractTags': extractTags
};
