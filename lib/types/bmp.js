module.exports = function (buffer) {
  return {
    'width': buffer.readUInt32LE(18),
    'height': buffer.readUInt32LE(22)
  };
};
