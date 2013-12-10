// based on https://developers.google.com/speed/webp/docs/riff_container

function isWebP (buffer) {
  var riffHeader = 'RIFF' === buffer.toString('ascii', 0, 4);
  var webpHeader = 'WEBP' === buffer.toString('ascii', 8, 12);
  var vp8Header  = 'VP8'  === buffer.toString('ascii', 12, 15);
  return (riffHeader && webpHeader && vp8Header);
}

function calculate (buffer) {

  var chunkHeader = buffer.toString('ascii', 12, 16);

  switch (chunkHeader) {
    case 'VP8 ': return calculateLossy(buffer);
    case 'VP8L': return calculateLossless(buffer);
  }

  return false;
}

function calculateLossless (buffer) {
  /*

   https://gerrit.chromium.org/gerrit/gitweb?p=webm/libwebp.git;a=blob;f=doc/webp-lossless-bitstream-spec.txt;hb=master

   The first 28 bits of the bitstream specify the width and height of the
   image. Width and height are decoded as 14-bit integers as follows:

   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   int image_width = ReadBits(14) + 1;
   int image_height = ReadBits(14) + 1;
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  */

  var signature = buffer[20];

  if(signature !== 0x2f) { return false; }

  var b0 = buffer[21],
    b1 = buffer[22],
    b2 = buffer[23],
    b3 = buffer[24];

  return {
    width: 1 + (((b1 & 0x3F) << 8) | b0),
    height: 1 + (((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6))
  };
}

function calculateLossy (buffer) {
  /*

   http://tools.ietf.org/html/rfc6386#page-30

   ---- Begin code block --------------------------------------

   Start code byte 0     0x9d
   Start code byte 1     0x01
   Start code byte 2     0x2a

   16 bits      :     (2 bits Horizontal Scale << 14) | Width (14 bits)
   16 bits      :     (2 bits Vertical Scale << 14) | Height (14 bits)

   ---- End code block ----------------------------------------

  */

  var offset = 23;
  var startCodes = buffer.slice(offset, offset + 3);

  if(startCodes[0] !== 0x9d) { return false; }
  if(startCodes[1] !== 0x01) { return false; }
  if(startCodes[2] !== 0x2a) { return false; }

  var width = buffer.readInt16LE(offset + 3);
  var height = buffer.readInt16LE(offset + 5);

  return {
    width: (width & 0x3fff),
    height: (height & 0x3fff)
  };
}

module.exports = {
  'detect': isWebP,
  'calculate': calculate
};
