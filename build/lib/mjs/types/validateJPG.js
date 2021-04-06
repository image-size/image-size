import toHexadecimal from "../toHexadecimal.js";
export default function validateJPG(view) {
  const SOIMarker = toHexadecimal(view, 0, 2);
  return SOIMarker;
}
