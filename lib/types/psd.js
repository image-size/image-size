module.exports = function (buffer) {
  return {
    'width': buffer.readUInt32BE(18),
    'height': buffer.readUInt32BE(14)
  };
};
