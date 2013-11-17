// Abstract reading multi-byte unsigned integers
function readUInt (bits, offset, isBigEndian) {
  offset = offset || 0;
  var endian = !!isBigEndian ? 'BE' : 'LE';
  var method = this['readUInt' + bits + endian];
  return method.call(this, offset);
}

module.exports = Buffer.prototype.readUInt = readUInt;