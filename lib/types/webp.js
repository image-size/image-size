function isWebP (buffer) {
  return ('RIFF' === buffer.toString('ascii', 0, 4) &&
          'WEBP' === buffer.toString('ascii', 8, 12) &&
          'VP8'  === buffer.toString('ascii', 12, 15));
}

function calculate (buffer) {
  var lossless = ('L' === buffer.toString('ascii', 15, 16));
  if (lossless) {

  } else {

  }
  return false;
}

module.exports = {
  'detect': isWebP,
  'calculate': calculate
};
