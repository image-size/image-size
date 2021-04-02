export function readInt16LE(view, offset) {
    return view.getInt16(offset, true);
}
export function readInt32LE(view, offset) {
    return view.getInt32(offset, true);
}
export function readUInt24LE(view, offset) {
    return view.getUint32(offset, true) & 0xffffff;
}
export function readUInt16(view, offset, isBigEndian) {
    return view.getUint16(offset, !isBigEndian);
}
export function readUInt16BE(view, offset) {
    return view.getUint16(offset, false);
}
export function readUInt16LE(view, offset) {
    return view.getUint16(offset, true);
}
export function readUInt32(view, offset, isBigEndian) {
    return view.getUint32(offset, !isBigEndian);
}
export function readUInt32BE(view, offset) {
    return view.getUint32(offset, false);
}
export function readUInt32LE(view, offset) {
    return view.getUint32(offset, true);
}
