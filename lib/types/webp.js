module.exports = function (buffer) {
  var lossless = ('L' === buffer.toString('ascii', 15, 16));
  if (lossless) {

  } else {

  }

  return {};
};