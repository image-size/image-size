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

function isJPG (buffer) {
  var SOIMarker = buffer.toString('hex', 0, 2);
  var JFIFMarker = buffer.toString('hex', 2, 4);

  if ('ffd8' === SOIMarker) {
    var signature = buffer.toString('hex', 6, 11);

    // standard jpeg
    if ('ffe0' === JFIFMarker) {
      return '4a46494600' === signature;
    }

    // camera jpeg, with EXIF data
    if ('ffe1' === JFIFMarker) {
      return '4578696600' === signature;
    }

    // SPIFF jpeg
    if ('ffe8' === JFIFMarker) {
      var twelth = buffer.toString('hex', 11, 12);
      return '5350494646' === signature && '00' === twelth;
    }

    // TODO: handle the following as well
    // ffdb - Samsung D807 JPEG
    // dde2 — Canon EOS-1D JPEG
    // ffe3 — Samsung D500 JPEG
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
