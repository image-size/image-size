import {readUInt16LE} from "../readUInt.js";
const TYPE_ICON = 1;
const SIZE_HEADER = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(buffer, offset) {
  const value = buffer.getUint8(offset);
  return value === 0 ? 256 : value;
}
function getImageSize(buffer, imageIndex) {
  const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(buffer, offset + 1),
    width: getSizeFromOffset(buffer, offset)
  };
}
export const ICO = {
  validate(buffer) {
    if (readUInt16LE(buffer, 0) !== 0) {
      return false;
    }
    return readUInt16LE(buffer, 2) === TYPE_ICON;
  },
  calculate(buffer, toAscii) {
    const nbImages = readUInt16LE(buffer, 4);
    const imageSize = getImageSize(buffer, 0);
    if (nbImages === 1) {
      return imageSize;
    }
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize(buffer, imageIndex));
    }
    const result = {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
    return result;
  }
};
