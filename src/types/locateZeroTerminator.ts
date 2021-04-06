export default function locateZeroTerminator(view: DataView, offset: number, length: number): number {
  let index = 0;
  let letter = view.getUint8(index)
  while(letter !== 0x00)
  {
    index += 1;
    if (index >= length) {
      throw new Error('zero terminator not found');
    }

    letter = view.getUint8(offset + index);
  } 
  return offset + index;
}