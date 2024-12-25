import type { IImage, ISize, ISizeCalculationResult } from './interface'
import { findBox, readUInt32BE, toUTF8String } from './utils'

const brandMap = {
  avif: 'avif',
  mif1: 'heif',
  msf1: 'heif', // heif-sequence
  heic: 'heic',
  heix: 'heic',
  hevc: 'heic', // heic-sequence
  hevx: 'heic', // heic-sequence
}

interface ImageDimensions {
  width: number
  height: number
  cropRight?: number
  cropLeft?: number
  cropTop?: number
  cropBottom?: number
}

export const HEIF: IImage = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8)
    if (boxType !== 'ftyp') return false

    const ftypBox = findBox(input, 'ftyp', 0)
    if (!ftypBox) return false

    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12)
    return brand in brandMap
  },

  calculate(input) {
    // Based on https://nokiatech.github.io/heif/technical.html
    const metaBox = findBox(input, 'meta', 0)
    const iprpBox = metaBox && findBox(input, 'iprp', metaBox.offset + 12)
    const ipcoBox = iprpBox && findBox(input, 'ipco', iprpBox.offset + 8)

    if (!ipcoBox) {
      throw new TypeError('Invalid HEIF, no ipco box found')
    }

    const type = toUTF8String(input, 8, 12)

    const images: ISize[] = []
    let currentOffset = ipcoBox.offset + 8

    // Find all ispe and clap boxes
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, 'ispe', currentOffset)
      if (!ispeBox) break

      const rawWidth = readUInt32BE(input, ispeBox.offset + 12)
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16)

      // Look for a clap box after the ispe box
      const clapBox = findBox(input, 'clap', currentOffset)
      let width = rawWidth
      let height = rawHeight

      if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12)
        if (cropRight === 1) {
          width = rawWidth - 1
        }
      }

      images.push({
        height,
        width,
      })

      currentOffset = ispeBox.offset + ispeBox.size
    }

    if (images.length === 0) {
      throw new TypeError('Invalid HEIF, no size found')
    }

    // Find the largest image by area
    const mainImage = images.reduce((largest, current) => {
      return current.width * current.height > largest.width * largest.height
        ? current
        : largest
    }, images[0])

    const result: ISizeCalculationResult = {
      width: mainImage.width,
      height: mainImage.height,
      type,
    }

    // Only add images array if there are multiple images
    if (images.length > 1) {
      result.images = images
    }

    return result
  },
}
