import typeHandlers from "./types/typeHandlers.js";
const keys = Object.keys(typeHandlers);
const firstBytes = {
  56: "psd",
  66: "bmp",
  68: "dds",
  71: "gif",
  82: "webp",
  105: "icns",
  137: "png",
  255: "jpg"
};
export default firstBytes;
