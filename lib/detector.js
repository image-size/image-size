module.exports = function (buffer) {

  var char2 = buffer.toString('ascii', 0, 2);
  if ('BM' === char2) {
    return 'bmp';
  }

  var char4 = buffer.toString('ascii', 0, 4);
  if ('8BPS' === char4) {
    return 'psd';
  }

  var char6 = buffer.toString('ascii', 0, 6);
  if (/^GIF8[7,9]a/.test(char6)) {
    return 'gif';
  }

  var char8 = buffer.toString('ascii', 0, 8);
  if ('\tPNG\r\n\u001a\n' === char8) {
    if ('IHDR' !== buffer.toString('ascii', 12, 16)) {
      throw new TypeError('invalid png');
    }
    return 'png';
  }

  var hex2 = buffer.toString('hex', 0, 2);
  if ('ffd8' === hex2) {
    return 'jpg';
  }

  var hex4 = buffer.toString('hex', 0, 4);
  if ('49492a00' === hex4 || '4d4d002a' === hex4) {
    return 'tiff';
  }
};
