export default function toHexadecimal(
  view: DataView,
  begin: number,
  end: number,
): string {
  let output = '';
  for (let i = begin; i < end; i += 1) {
    const value = view.getUint8(i);
    output += value.toString(16).padStart(2, '0');
  }
  return output;
}
