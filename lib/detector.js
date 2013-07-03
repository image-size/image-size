function isBMP (buffer) {
  return ('BM' === buffer.toString('ascii', 0, 2));
}

function isPSD (buffer) {
  return ('8BPS' === buffer.toString('ascii', 0, 4));
}

var gifRegexp = /^GIF8[7,9]a/;
function isGIF (buffer) {
  return (gifRegexp.test(buffer.toString('ascii', 0, 6)));
}

var pngSignature = '\tPNG\r\n\u001a\n';
function isPNG (buffer) {
  if (pngSignature === buffer.toString('ascii', 0, 8)) {
    if ('IHDR' !== buffer.toString('ascii', 12, 16)) {
      throw new TypeError('invalid png');
    }
    return true;
  }
}

function isTIFF (buffer) {
  var hex4 = buffer.toString('hex', 0, 4);
  return ('49492a00' === hex4 || '4d4d002a' === hex4);
}

function isJPG (buffer) {
  return ('ffd8' === buffer.toString('hex', 0, 2));
}

var typeMap = {
  'bmp': isBMP,
  'gif': isGIF,
  'jpg': isJPG,
  'png': isPNG,
  'psd': isPSD,
  'tiff': isTIFF
};

module.exports = function (buffer) {

  var type, result;
  buffer = buffer.slice(0, 16);

  for (type in typeMap) {
    result = typeMap[type](buffer);
    if (result) {
      return type;
    }
  }
};
