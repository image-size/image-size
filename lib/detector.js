function isBMP (buffer) {
  return ('BM' === buffer.toString('ascii', 0, 2));
}

function isPSD (buffer) {
  return ('8BPS' === buffer.toString('ascii', 0, 4));
}

var gifRegexp = /^GIF8[7,9]a/;
function isGIF (buffer) {
  var signature = buffer.toString('ascii', 0, 6);
  return (gifRegexp.test(signature));
}

var pngSignature = 'PNG\r\n\u001a\n';
function isPNG (buffer) {
  if (pngSignature === buffer.toString('ascii', 1, 8)) {
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


// TODO: handle the following as well
// ffe2 — Canon EOS-1D JPEG
// ffe3 — Samsung D500 JPEG
var validJFIFMarkers = {
  'ffe0': '4a46494600', // standard jpeg
  'ffe1': '4578696600', // camera jpeg, with EXIF data
  'ffe8': '5350494646', // SPIFF jpeg
  'ffdb': '0001010101'  // Samsung D807 JPEG
};

function isJPG (buffer) { //, filepath
  var SOIMarker = buffer.toString('hex', 0, 2);
  var JFIFMarker = buffer.toString('hex', 2, 4);

  // not a valid jpeg
  if ('ffd8' !== SOIMarker) {
    return false;
  }

  // TODO: validate the end-bytes of a jpeg file
  // use filepath, get the last bytes, check for ffd9

  var actual, expected;
  for (var marker in validJFIFMarkers) {
    expected = validJFIFMarkers[marker];
    actual = buffer.toString('hex', 6, 6 + (expected.length / 2));
    if (marker === JFIFMarker) {
      return validJFIFMarkers[marker] === actual;
    }
  }

  // not a valid jpeg
  return false;
}

function isWebP (buffer) {
  return ('RIFF' === buffer.toString('ascii', 0, 4) &&
          'WEBP' === buffer.toString('ascii', 8, 12) &&
          'VP8'  === buffer.toString('ascii', 12, 15));
}

var typeMap = {
  'bmp': isBMP,
  'gif': isGIF,
  'jpg': isJPG,
  'png': isPNG,
  'psd': isPSD,
  'tiff': isTIFF,
  'webp': isWebP
};

module.exports = function (buffer, filepath) {

  var type, result;
  buffer = buffer.slice(0, 16);

  for (type in typeMap) {
    result = typeMap[type](buffer, filepath);
    if (result) {
      return type;
    }
  }
};
