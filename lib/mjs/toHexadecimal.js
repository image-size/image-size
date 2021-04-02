export default function toHexadecimal(view, begin, end) {
    let output = '';
    for (let i = begin; i < end; i += 1) {
        const value = view.getUint8(i);
        output += value.toString(16);
    }
    return output;
}
