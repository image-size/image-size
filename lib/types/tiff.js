// based on http://www.compix.com/fileformattif.htm
// TODO: support big-endian as well

var fs = require('fs');

// Abstract reading multi-byte unsigned integers
function readUInt(bits, offset, isBigEndian) {
  offset = offset || 0;
  var endian = !!isBigEndian ? 'BE' : 'LE';
  var method = this['readUInt' + bits + endian];
  return method.call(this, offset);
}
Buffer.prototype.readUInt = readUInt;

// Read IFD (image-file-directory) into a buffer
function readIFD (buffer, filepath, isBigEndian) {

  var ifdOffset = buffer.readUInt(32, 4, isBigEndian);

  // read only till the end of the file
  var bufferSize = 1024;
  var fileSize = fs.statSync(filepath).size;
  if (ifdOffset + bufferSize > fileSize) {
    bufferSize = fileSize - ifdOffset - 10;
  }

  // populate the buffer
  var endBuffer = new Buffer(bufferSize);
  var descriptor = fs.openSync(filepath, 'r');
  fs.readSync(descriptor, endBuffer, 0, bufferSize, ifdOffset);

  // var ifdLength = endBuffer.readUInt(16, 0, isBigEndian);
  var ifdBuffer = endBuffer.slice(2); //, 2 + 12 * ifdLength);
  return ifdBuffer;
}

// TIFF values seem to be messed up on Big-Endian, this helps
function readValue (buffer, isBigEndian) {
  var low = buffer.readUInt(16, 8, isBigEndian);
  var high = buffer.readUInt(16, 10, isBigEndian);
  return (high << 16) + low;
}

// Extract IFD tags from TIFF metadata
function extractTags (buffer, isBigEndian) {
  var tags = {};
  var code, type, length;
  while (buffer.length) {
    code = buffer.readUInt(16, 0, isBigEndian);
    type = buffer.readUInt(16, 2, isBigEndian);
    length = buffer.readUInt(32, 4, isBigEndian);

    // 0 means end of IFD
    if (code === 0) {
      break;
    } else {
      // 256 is width, 257 is height
      // if (code === 256 || code === 257) {
      if (length === 1 && type === 3) {
        tags[code] = readValue(buffer, isBigEndian);
      }
      // move to the next tag
      buffer = buffer.slice(12);
    }
  }
  return tags;
}

// Test if the TIFF is Big Endian or Little Endian
function determineEndianness (buffer) {
  var signature = buffer.toString('ascii', 0, 2);
  if ('II' === signature) {
    return 'LE';
  } else if ('MM' === signature) {
    return 'BE';
  }
}

module.exports = function (buffer, filepath) {

  if (!filepath) {
    throw new TypeError('Tiff doesn\'t support buffer');
  }

  // Determine BE/LE
  var isBigEndian = determineEndianness(buffer) === 'BE';

  // read the IFD
  var ifdBuffer = readIFD(buffer, filepath, isBigEndian);

  // extract the tags from the IFD
  var tags = extractTags(ifdBuffer, isBigEndian);

  var width = tags[256];
  var height = tags[257];

  if (!width || !height) {
    throw new TypeError('Invalid Tiff, missing tags');
  }

  return {
    'width': width,
    'height': height
  };
};
