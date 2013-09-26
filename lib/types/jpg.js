module.exports = function (buffer) {

  var i = 2;
  var len = buffer.length;
  var current;

  while (i < len) {

    while (buffer[i] !== 255) i++;
    while (buffer[i] === 255) i++;

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
