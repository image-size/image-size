import {readUInt16BE, readUInt32BE} from "../readUInt.js";
const EXIF_MARKER_HI_UINT32_BE = 1165519206;
const EXIF_MARKER_LO_UINT16_BE = 0;
const compareEXIFIdentifier = (view, offset) => {
  const identifierHi = readUInt32BE(view, offset);
  const identiferLo = readUInt16BE(view, offset + 4);
  return identifierHi === EXIF_MARKER_HI_UINT32_BE && identiferLo === EXIF_MARKER_LO_UINT16_BE;
};
export default function isEXIFAppMarker(view, shortMarker, offset) {
  if (shortMarker == 65505) {
    const flag = compareEXIFIdentifier(view, offset);
    return flag;
  } else {
    return false;
  }
}
