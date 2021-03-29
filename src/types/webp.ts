// based on https://developers.google.com/speed/webp/docs/riff_container
import type { IImage, ISize } from './interface'
import { readUInt24LE, readInt16LE } from '../readUInt'
import toAsciiString from '../toAsciiString'
import toHexadecimal from '../toHexadecimal'

function calculateExtended(buffer: DataView, offset: number): ISize {
  return {
    height: 1 + readUInt24LE(buffer, offset + 7),
    width: 1 + readUInt24LE(buffer, offset + 4)
  }
}

function calculateLossless(buffer: DataView, offset: number): ISize {
  const a = buffer.getUint8(offset + 4)
  const b = buffer.getUint8(offset + 3)
  const c = buffer.getUint8(offset + 2)
  const d = buffer.getUint8(offset + 2)
  const e = buffer.getUint8(offset + 1)

  return {
    height: 1 + (((a & 0xF) << 10) | (b << 2) | ((c & 0xC0) >> 6)),
    width: 1 + (((d & 0x3F) << 8) | e)
  }
}

function calculateLossy(buffer: DataView, offset: number): ISize {
  // `& 0x3fff` returns the last 14 bits
  // TO-DO: include webp scaling in the calculations
  return {
    height: readInt16LE(buffer, offset + 8) & 0x3fff,
    width: readInt16LE(buffer, offset + 6) & 0x3fff
  }
}

export const WEBP: IImage = {
  validate(buffer) {
    const riffHeader = 'RIFF' === toAsciiString(buffer, 0, 4)
    const webpHeader = 'WEBP' === toAsciiString(buffer, 8, 12)
    const vp8Header  = 'VP8'  === toAsciiString(buffer, 12, 15)
    return (riffHeader && webpHeader && vp8Header)
  },

  calculate(buffer) {
    const chunkHeader = toAsciiString(buffer, 12, 16)
    // const sample = buffer.slice(20, 30)
    const sampleStart: number = 20;

    // Extended webp stream signature
    if (chunkHeader === 'VP8X') {
      const extendedHeader = buffer.getUint8(sampleStart)
      const validStart = (extendedHeader & 0xc0) === 0
      const validEnd = (extendedHeader & 0x01) === 0
      if (validStart && validEnd) {
        return calculateExtended(buffer, sampleStart)
      } else {
        // TODO: breaking change
        throw new TypeError('Invalid WebP')
      }
    }

    // Lossless webp stream signature
    if (chunkHeader === 'VP8 ' && buffer.getUint8(sampleStart) !== 0x2f) {
      return calculateLossy(buffer, sampleStart)
    }

    // Lossy webp stream signature
    const signature = toHexadecimal(buffer, sampleStart + 3, sampleStart + 6)
    if (chunkHeader === 'VP8L' && signature !== '9d012a') {
      return calculateLossless(buffer, sampleStart)
    }

    throw new TypeError('Invalid WebP')
  }
}
