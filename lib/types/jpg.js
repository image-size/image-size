module.exports = function (buffer) {

  var i = 4;
  var len = buffer.length;

  // NOTE: we only support baseline and progressive JPGs here
  // due to the structure of the loader class, we only get a buffer
  // with a maximum size of 4096 bytes. so if the SOF marker is outside
  // if this range we can't detect the file size correctly.

  // read block length of first JPG block
  var currentBlockLength = buffer.readUInt16BE(i);

  while (i < len) {

    i += currentBlockLength;

    if (i >= len) {
      throw new TypeError('Corrupt JPG, exceeded buffer limits');
    }

    // every JPG marker starts with 0xFF
    if (buffer[i] !== 0xFF) {
      throw new TypeError('Invalid JPG, marker table corrupted');
    }

    // 0xFFC0 is baseline(SOF), 0xFFC2 is progressive(SOF2)
    var next = buffer[i + 1];
    if (next === 0xC0 || next === 0xC2) {
      // SOF/SOF2 layout:
      // byte0 = marker           (size 16)
      // byte2 = block length     (size 16)
      // byte4 = sample precision (size 8)
      // byte5 = height           (size 16)
      // byte7 = width            (size 16)
      return {
        'height' : buffer.readUInt16BE(i + 5),
        'width' : buffer.readUInt16BE(i + 7)
      };
    }

    i = i + 2;
    currentBlockLength = buffer.readUInt16BE(i);
  }

  throw new TypeError('Invalid JPG, no size found');
};
