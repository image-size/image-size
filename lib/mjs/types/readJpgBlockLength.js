import { readUInt16BE } from '../readUInt';
export default function readJpgBlockLength(view, offset) {
    // read length of the next block
    return readUInt16BE(view, offset);
}
