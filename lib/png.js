module.exports = function (buffer) {
  return {
    'width': buffer.readUInt32BE(16),
    'height': buffer.readUInt32BE(20)
  };
};
