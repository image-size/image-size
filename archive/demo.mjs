import { imageSize } from '../lib/mjs/index.js'
import { readFileSync } from 'fs'

const toAscii = (view, begin, end) => {
  return Buffer.from(view.buffer).toString('ascii', begin, end);
}

try {
  const buf = readFileSync('./specs/images/valid/bmp/sample.bmp', toAscii)
  const view = new DataView(buf.buffer);
  console.log(toAscii(view, 0, 2));
  console.log(imageSize(buf.buffer, toAscii))
}
catch(err) {
  console.error(err)
}

