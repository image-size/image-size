import {readUInt16BE} from "../readUInt.js";
export default function readJpgBlockLength(view, offset) {
  return readUInt16BE(view, offset);
}
