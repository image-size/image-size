module.exports = function (buffer) {
  return {
    'width': buffer.readUInt16LE(6),
    'height': buffer.readUInt16LE(8)
  };
};
