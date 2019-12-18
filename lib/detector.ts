import { typeHandlers } from './types'

const keys = Object.keys(typeHandlers)

// This map helps avoid validating for every single image type
const firstBytes: { [byte: number]: string } = {
  0x38: 'psd',
  0x42: 'bmp',
  0x44: 'dds',
  0x47: 'gif',
  0x49: 'tiff',
  0x4d: 'tiff',
  0x52: 'webp',
  0x69: 'icns',
  0x89: 'png',
  0xff: 'jpg'
}

// tslint:disable: no-console
export function detector(buffer: Buffer): string | undefined {
  console.log('Initial buffer length', buffer.length)

  const byte = buffer[0]
  if (byte in firstBytes) {
    const type = firstBytes[byte]
    console.log(`Quick lookup for ${type}. Buffer length`, buffer.length)
    if (typeHandlers[type].validate(buffer)) {
      return type
    }
  }

  console.log('Quick lookup wasn\'t helpful')

  const finder = (type: string) => {
    console.log(`Full lookup for ${type}. Buffer length`, buffer.length)
    return typeHandlers[type].validate(buffer)
  }
  return keys.find(finder)
}
