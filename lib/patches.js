
function readBits (bits, offset) {
  offset = offset || 0;

  var value = 0, byte, start, bitsToRead;
  while (bits > 0 && this.length) {
    value = value << (bits > 8 ? 8 : bits);
    start = Math.floor(offset / 8);
    byte = this[start];
    bitsToRead = (start + 1) * 8 - offset;
    value |= byte & (Math.pow(2, bitsToRead) - 1);
    offset += bitsToRead;
    bits -= bitsToRead;
  }

  return value;

  // var byteCount = Math.ceil(bits / 8);
  // var byteOffset = Math.floor(offset / 8);

  // var source = [].slice.call(this,
  // byteOffset, byteOffset + byteCount);

  // var start = ((byteOffset + 1) * 8) - offset;
  // console.log(source, start);
  // var value = 0, read = 0;
  // for (var i = 0; i < bits;) {
  //   if ((bits - i) >= 8 && ((offset & 7) === 0)) {
  //     value |= (bytes[offset >> 3] << i);
  //     read = 8;
  //   } else {
  //     value |= ((this[offset >> 3] >> (offset & 7) & 0x1) << i);
  //     read = 1;
  //   }

  //   offset += read;
  //   i += read;
  // }

  // return value >>> 0;
}
