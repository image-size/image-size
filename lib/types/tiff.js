// based on http://www.compix.com/fileformattif.htm
// TODO: support big-endian as well

var fs = require('fs');

module.exports = function (buffer, filepath) {

  if (!filepath) {
    throw new Error('Tiff can\'t support buffers, pass file instead');
  }

  var signature = buffer.toString('ascii', 0, 2);

  var read;
  // if ('II' === signature) {
  //   read = [
  //     buffer.readUInt16LE,
  //     buffer.readUInt32LE
  //   ];
  // } else { //if ('MM' === signature) {
  //   read = [
  //     buffer.readUInt16BE,
  //     buffer.readUInt32BE
  //   ];
  // }

  // TODO: check if other versions exist
  var version = buffer.readUInt16LE(2);
  if (version !== 42) {
    throw new TypeError('only version 42 Tiff images allowed');
  }

  var ifdOffset = buffer.readUInt32LE(4);

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

  var ifdLength = endBuffer.readUInt16LE(0);
  var ifdBuffer = endBuffer.slice(2);

  var tag, width, height;
  while (ifdBuffer.length) {
    tag = ifdBuffer.readUInt16LE(0);
    if (tag === 256) {
      width = ifdBuffer.readUInt32LE(8);
    } else if (tag === 257) {
      height = ifdBuffer.readUInt32LE(8);
    }
    if (tag === 0 || (width && height)) {
      break;
    } else {
      ifdBuffer = ifdBuffer.slice(12);
    }
  }

  return {
    'width': width,
    'height': height
  };
};