import type { IImage } from './interface'
import { findBox, readUInt32BE, toUTF8String } from './utils'

const brandMap = {
  avif: 'avif',
  mif1: 'heif',
  msf1: 'heif', // hief-sequence
  heic: 'heic',
  heix: 'heic',
  hevc: 'heic', // heic-sequence
  hevx: 'heic', // heic-sequence
}

function detectType(buffer: Uint8Array, start: number, end: number) {
  const brandsDetected = new Set<keyof typeof brandMap>()
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4) as keyof typeof brandMap
    if (brand in brandMap) {
      brandsDetected.add(brand)
    }
  }

  if (brandsDetected.has('avif')) {
    return 'avif'
  } else if (brandsDetected.has('heic') || brandsDetected.has('heix') || brandsDetected.has('hevc') || brandsDetected.has('hevx')) {
    return 'heic'
  } else if (brandsDetected.has('mif1') || brandsDetected.has('msf1')) {
    return 'heif'
  }
}

export const HEIF: IImage = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8)
    const brand = toUTF8String(buffer, 8, 12)
    return 'ftyp' === ftype && brand in brandMap
  },

  calculate(buffer) {
    // Based on https://nokiatech.github.io/heif/technical.html
    const metaBox = findBox(buffer, 'meta', 0)
    const iprpBox = metaBox && findBox(buffer, 'iprp', metaBox.offset + 12)
    const ipcoBox = iprpBox && findBox(buffer, 'ipco', iprpBox.offset + 8)
    const ispeBox = ipcoBox && findBox(buffer, 'ispe', ipcoBox.offset + 8)
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectType(buffer, 8, metaBox.offset),
      }
    }
    throw new TypeError('Invalid HEIF, no size found')
  }
}
