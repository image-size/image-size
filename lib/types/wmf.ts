import { IImage } from './interface'

/* [MS-WMF] */
const PPI = 96

export const WMF: IImage = {
  // NOTE: this just checks header, but it probably should scan the entire file
  validate(buffer) {
    let h = buffer.readUInt16LE(0)
    if (h === 0xCDD7) { return buffer.readUInt16LE(2) === 0x9AC6 }
    if (h !== 1 && h !== 2) { return false }
    if (buffer.readUInt16LE(2) !== 9) { return false }
    h = buffer.readUInt16LE(4)
    if (h !== 0x0100 && h !== 0x0300) { return false }
    return true
  },

  calculate(buffer) {
    if (buffer.readUInt16LE(0) === 0xCDD7) {
      /* META_PLACEABLE */
      const left = buffer.readUInt16LE(6)
      const top = buffer.readUInt16LE(8)
      const right = buffer.readUInt16LE(10)
      const bottom = buffer.readUInt16LE(12)
      const inch = buffer.readUInt16LE(14)
      const scale = (inch > 0 ? 1440 / inch : 1)
      const h = bottom - top
      const w = right - left
      return {
        height: Math.round(h * scale * (PPI / 1440)),
        width: Math.round(w * scale * (PPI / 1440))
      }
    }
    let offset = 18
    while (offset < buffer.length) {
      const sz = buffer.readUInt32LE(offset)
      const end = offset + sz * 2
      const rt = buffer.readUInt16LE(offset + 4)
      if (rt === 0x020C) {
        return {
          height: buffer.readUInt16LE(offset + 6),
          width: buffer.readUInt16LE(offset + 8)
        }
      }
      offset = end
    }
    throw new TypeError('Invalid WMF')
  }
}
