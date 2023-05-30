import type { imageType } from './types/index'
import { typeHandlers } from './types/index'

const keys = Object.keys(typeHandlers) as imageType[]

// This map helps avoid validating for every single image type
const firstBytes: { [byte: number]: imageType } = {
  0x38: 'psd',
  0x42: 'bmp',
  0x44: 'dds',
  0x47: 'gif',
  0x49: 'tiff',
  0x4d: 'tiff',
  0x52: 'webp',
  0x69: 'icns',
  0x89: 'png',
  0xff: 'jpg',
}

export function detector(input: Uint8Array): imageType | undefined {
  const byte = input[0]
  if (byte in firstBytes) {
    const type = firstBytes[byte]
    if (type && typeHandlers[type].validate(input)) {
      return type
    }
  }

  const finder = (key: imageType) => typeHandlers[key].validate(input)
  return keys.find(finder)
}
