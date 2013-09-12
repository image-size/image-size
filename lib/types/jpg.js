function increment(i, buffer, equals255) {
  if(!equals255) {
    while (buffer[i] !== 255) i++;
  } else {
    while (buffer[i] === 255) i++;
  }
  return i;
}

module.exports = function (buffer) {

  var i = 2;
  var len = buffer.length;
  var current;

  while (i < len) {

    i = increment(i, buffer, false);
    i = increment(i, buffer, true);

    current = buffer[i];
    if (current < 192 || current > 207) {
      i += buffer.readUInt16BE(++i);
      continue;
    }

    return {
      'width': buffer.readUInt16BE(i + 6),
      'height': buffer.readUInt16BE(i + 4)
    };
  }

  throw new TypeError('invalid jpg');
};
