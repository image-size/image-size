import { IImage, ISize } from './interface'

/**
 * ICNS Header
 *
 * | Offset | Size | Purpose                                                |
 * | 0	    | 4    | Magic literal, must be "icns" (0x69, 0x63, 0x6e, 0x73) |
 * | 4      | 4    | Length of file, in bytes, msb first.                   |
 *
 */
const SIZE_HEADER = 4 + 4 // 8
const FILE_LENGTH_OFFSET = 4 // MSB => BIG ENDIAN

/**
 * Image Entry
 *
 * | Offset | Size | Purpose                                                          |
 * | 0	    | 4    | Icon type, see OSType below.                                     |
 * | 4      | 4    | Length of data, in bytes (including type and length), msb first. |
 * | 8      | n    | Icon data                                                        |
 */
const ENTRY_LENGTH_OFFSET = 4 // MSB => BIG ENDIAN

const ICON_TYPE_SIZE: {[key: string]: number} = {
  'ICON': 32,
  'ICN#': 32,
  'icm#': 16,
  'icm4': 16,
  'icm8': 16,
  'ics#': 16,
  'ics4': 16,
  'ics8': 16,
  'is32': 16,
  's8mk': 16,
  'icl4': 32,
  'icl8': 32,
  'il32': 32,
  'l8mk': 32,
  'ich#': 48,
  'ich4': 48,
  'ich8': 48,
  'ih32': 48,
  'h8mk': 48,
  'it32': 128,
  't8mk': 128,
  'icp4': 16,
  'icp5': 32,
  'icp6': 64,
  'ic07': 128,
  'ic08': 256,
  'ic09': 512,
  'ic10': 1024,
  'ic11': 32,
  'ic12': 64,
  'ic13': 256,
  'ic14': 512,
  'ic04': 16,
  'ic05': 32,
  'icsB': 36,
  'icsb': 18,
}

function readImageHeader(buffer: Buffer, imageOffset: number): [string, number] {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET
  return [
    buffer.toString('ascii', imageOffset, imageLengthOffset),
    buffer.readUInt32BE(imageLengthOffset)
  ]
}

function getImageSize(type: string): ISize {
  const size = ICON_TYPE_SIZE[type]
  return { width: size, height: size, type }
}

export const ICNS: IImage = {
  validate(buffer) {
    return ('icns' === buffer.toString('ascii', 0, 4))
  },

  calculate(buffer) {
    const bufferLength = buffer.length
    const fileLength = buffer.readUInt32BE(FILE_LENGTH_OFFSET)
    let imageOffset = SIZE_HEADER

    let imageHeader = readImageHeader(buffer, imageOffset)
    let imageSize = getImageSize(imageHeader[0])
    imageOffset += imageHeader[1]

    if (imageOffset === fileLength) {
      return imageSize
    }

    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    }

    while (imageOffset < fileLength && imageOffset < bufferLength) {
      imageHeader = readImageHeader(buffer, imageOffset)
      imageSize = getImageSize(imageHeader[0])
      imageOffset += imageHeader[1]
      result.images.push(imageSize)
    }

    return result
  }
}
