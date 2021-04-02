const imageSize =  require('./lib/cjs/index');
const fs = require('fs');

function toAscii(view, begin, end) {
  return Buffer.from(view.buffer).toString('ascii', begin, end);
}

const buf = fs.readFileSync('./specs/images/valid/bmp/sample.bmp')
const arrayBuf = buf.buffer;
const view = new DataView(arrayBuf)

console.log(toAscii(view, 0, 4));
console.log(imageSize.imageSize(arrayBuf, toAscii));
