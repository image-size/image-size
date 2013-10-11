// based on http://www.compix.com/fileformattif.htm
// TODO: support big-endian as well

var fs = require('fs');

// Abstract reading multi-byte unsigned integers
function readUInt(bits, offset, isBigEndian) {
  offset = offset || 0;
  var endian = !!isBigEndian ? 'BE' : 'LE';
  var method = this['readUInt' + bits + endian];
  if (!method) {
    throw new Error('invalid UInt invocation');
  }
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
  return endBuffer.slice(2);
}

// Extract IFD tags from TIFF metadata
function extractTags (ifdBuffer, isBigEndian) {
  var tags = {};
  var code, length;
  while (ifdBuffer.length) {
    code = ifdBuffer.readUInt(16, 0, isBigEndian);
    if (code === 0) {
      break;
    } else {
      length = ifdBuffer.readUInt(16, 4, isBigEndian);
      if (length === 1) {
        tags[code] = ifdBuffer.readUInt(32, 8, isBigEndian);
      }
      ifdBuffer = ifdBuffer.slice(12);
    }
  }
  return tags;
}

// Test if the TIFF is Big Endian or Little Endian
function determineEndianness (buffer) {
  var signature = buffer.toString('ascii', 0, 2);
  if ('II' === signature) {
    return 'LE';
  } else { //if ('MM' === signature) {
    return 'BE';
  }
}

function validateVersion (buffer, isBigEndian) {
  // TODO: check if other versions exist
  var version = buffer.readUInt(16, 2, isBigEndian);
  if (version !== 42) {
    throw new TypeError('only version 42 Tiff images allowed');
  }
}

module.exports = function (buffer, filepath) {

  if (!filepath) {
    throw new Error('Tiff can\'t support buffers, pass file instead');
  }

  // Determine BE/LE
  var isBigEndian = determineEndianness(buffer) === 'BE';

  // Ensure version 42
  validateVersion (buffer, isBigEndian);

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
