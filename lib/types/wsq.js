'use strict';

// NOTE: due to the structure of the loader class, we only get a buffer
// with a maximum size of 4096 bytes. so if the SOF marker is outside
// if this range we can't detect the file size correctly.

function isWSQ (buffer) { //, filepath
  var SOIMarker = buffer.toString('hex', 0, 2);

  return ('ffa0' === SOIMarker); // SOI_WSQ
}

function extractSize (buffer, i) {
  return {
    'height' : buffer.readUInt16BE(i),
    'width' : buffer.readUInt16BE(i + 2)
  };
}

function validateBuffer (buffer, i) {
  // index should be within buffer limits
  if (i > buffer.length) {
    throw new TypeError('Corrupt WSQ, exceeded buffer limits');
  }
  // Every WSQ block must begin with a 0xFF
  if (buffer[i] !== 0xFF) {
    throw new TypeError('Invalid WSQ, marker table corrupted');
  }
}

function calculate (buffer) {
  // Skip 4 chars, they are for signature
  buffer = buffer.slice(4);

  var i, next;
  while (buffer.length) {
    // read length of the next block
    i = buffer.readUInt16BE(0);

    // ensure correct format
    validateBuffer(buffer, i);

    // 0xFFA2 is SOF_WSQ
    next = buffer[i + 1];
    if (next === 0xA2) {
      return extractSize(buffer, i + 6);
    }

    // move to the next block
    buffer = buffer.slice(i + 2);
  }

  throw new TypeError('Invalid WSQ, no size found');
}

module.exports = {
  'detect': isWSQ,
  'calculate': calculate
};
