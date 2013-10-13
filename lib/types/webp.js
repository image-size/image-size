// based on https://developers.google.com/speed/webp/docs/riff_container

function isWebP (buffer) {
  var riffHeader = 'RIFF' === buffer.toString('ascii', 0, 4);
  var webpHeader = 'WEBP' === buffer.toString('ascii', 8, 12);
  var vp8Header  = 'VP8'  === buffer.toString('ascii', 12, 15);
  // console.log(buffer.readUInt32LE(4));
  return (riffHeader && webpHeader && vp8Header);
}

function calculate (buffer) {
  var chunkHeader = buffer.toString('ascii', 12, 16);
  var lossless = ('L' === chunkHeader[3]);
  if (lossless) {
    // var chunkSize = buffer.readUInt32LE(16);
    var signature = buffer.toString('hex', 20, 21);
    if (signature === '2f') {
      // read 14 bits of width & 14 bits of height
      var bits = buffer.slice(21, 25).toJSON();
      bits = bits.map(function (dec) {
        // console.log(dec.toString(2));
        return dec.toString(2);
      }).join('');
      // console.log(bits);
      // var width = (bits[0] << 6) + (bits[1] >> 2);
      // var height = bits[]
      // console.log(bits, width, (bits[0] << 6), (bits[1] >> 2));
    }
  } else {
    // TODO: implementation for lossy webp
  }
  return false;
}

module.exports = {
  'detect': isWebP,
  'calculate': calculate
};
