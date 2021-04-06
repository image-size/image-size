export default function findNonZeroCharacter(view, offset, length) {
  let index = 0;
  let letter = view.getUint8(index);
  while (letter === 0) {
    index += 1;
    if (index >= length) {
      throw new Error("non-zero terminator not found");
    }
    letter = view.getUint8(offset + index);
  }
  return offset + index;
}
