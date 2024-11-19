import type { IImage, ISize } from './interface'
import { findBox, readUInt32BE, toUTF8String, readUInt8 } from './utils'

const brandMap = {
  avif: 'avif',
  mif1: 'heif',
  msf1: 'heif', // heif-sequence
  heic: 'heic',
  heix: 'heic',
  hevc: 'heic', // heic-sequence
  hevx: 'heic', // heic-sequence
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
    let orientation = 1; // Default orientation (1 = normal)

    // Find all ispe, irot, imir, and clap boxes
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
        width = rawWidth - cropRight
      }

      // Variables to track rotation and mirroring
      let rotationAngle = 0; // 0, 90, 180, 270 degrees
      let isMirrored = false;
      let mirrorAxis = 0; // 0 = horizontal axis, 1 = vertical axis

      // Look for an irot box (rotation)
      const irotBox = findBox(input, 'irot', currentOffset)
      if (irotBox && irotBox.offset < ipcoBox.offset + ipcoBox.size) {
        const angle = readUInt8(input, irotBox.offset + 8) & 0x3; // Only use bottom 2 bits
        rotationAngle = angle * 90; // Convert to degrees (0, 90, 180, 270)
      }

      // Look for an imir box (mirroring)
      const imirBox = findBox(input, 'imir', currentOffset)
      if (imirBox && imirBox.offset < ipcoBox.offset + ipcoBox.size) {
        isMirrored = true;
        mirrorAxis = readUInt8(input, imirBox.offset + 8) & 0x1; // Get axis (bit 0)
      }

      // Map the rotation and mirroring to EXIF orientation (1-8)
      // 1: Normal
      // 2: Flipped horizontally
      // 3: Rotated 180°
      // 4: Flipped vertically
      // 5: Rotated 90° CCW and flipped horizontally
      // 6: Rotated 90° CW
      // 7: Rotated 90° CW and flipped horizontally
      // 8: Rotated 270° CW (or 90° CCW)
      if (!isMirrored) {
        // Not mirrored, just handle rotation
        if (rotationAngle === 0) orientation = 1;
        else if (rotationAngle === 90) orientation = 6;
        else if (rotationAngle === 180) orientation = 3;
        else if (rotationAngle === 270) orientation = 8;
      } else {
        // Mirrored (flipped)
        if (mirrorAxis === 1) { // Vertical axis (horizontal flip)
          if (rotationAngle === 0) orientation = 2;
          else if (rotationAngle === 90) orientation = 5;
          else if (rotationAngle === 180) orientation = 4;
          else if (rotationAngle === 270) orientation = 7;
        } else { // Horizontal axis (vertical flip)
          if (rotationAngle === 0) orientation = 4;
          else if (rotationAngle === 90) orientation = 7;
          else if (rotationAngle === 180) orientation = 2;
          else if (rotationAngle === 270) orientation = 5;
        }
      }

      images.push({ height, width })

      currentOffset = ispeBox.offset + ispeBox.size
    }

    if (images.length === 0) {
      throw new TypeError('Invalid HEIF, no sizes found')
    }

    return {
      width: images[0].width,
      height: images[0].height,
      orientation,
      type,
      ...(images.length > 1 ? { images } : {}),
    }
  },
}
