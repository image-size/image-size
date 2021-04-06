import toHexadecimal from '../toHexadecimal';
export default function validateJPG(view) {
    const SOIMarker = toHexadecimal(view, 0, 2);
    return SOIMarker;
}
