import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { resolve } from 'node:path'
import { openSync, readSync } from 'node:fs'
import { disableTypes } from '../lib/lookup'
import { types } from '../lib/types'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'
import { imageSize } from '../lib/index'
import { detector } from '../lib/detector'

// If something other than a buffer or filepath is passed
describe('Invalid invocation', () => {
  describe('passing buffer for tiff', () => {
    const bufferSize = 2048
    const file = 'specs/images/valid/tiff/little-endian.tiff'

    it('should throw', () => {
      const buffer = new Uint8Array(bufferSize)
      const filepath = resolve(file)
      const descriptor = openSync(filepath, 'r')
      readSync(descriptor, buffer, 0, bufferSize, 0)
      expect(() => imageSize(buffer)).toThrow('Invalid Tiff. Missing tags')
    })
  })

  describe('for a disabled image type', () => {
    beforeAll(() => disableTypes(['jpg', 'bmp']))
    afterAll(() => disableTypes([]))

    it('should throw', async () => {
      await expect(
        imageSizeFromFile('specs/images/valid/jpg/sample.jpg'),
      ).rejects.toThrow('disabled file type: jpg')
      await expect(
        imageSizeFromFile('specs/images/valid/bmp/sample.bmp'),
      ).rejects.toThrow('disabled file type: bmp')
      await expect(
        imageSizeFromFile('specs/images/valid/png/sample.png'),
      ).resolves.toBeDefined()
    })
  })
})

describe('.types property', () => {
  it('should expose supported file types', () => {
    expect(types).toEqual([
      'bmp', 'cur', 'dds', 'gif', 'heif', 'icns', 'ico',
      'j2c', 'jp2', 'jpg', 'ktx', 'png', 'pnm', 'psd',
      'svg', 'tga', 'tiff', 'webp'
    ])
  })
})

describe('lookup edge cases', () => {
  it('should handle undefined type with valid size', () => {
    // Create a buffer that doesn't match any known format
    const buffer = new Uint8Array([0x00, 0x00, 0x00, 0x00])
    expect(() => imageSize(buffer)).toThrow('unsupported file type: undefined')
  })

  it('should handle corrupted headers', () => {
    // Test with partially valid PNG header
    const buffer = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, // PNG signature start
      0x0D, 0x0A, 0x1A, 0xFF  // Corrupted PNG signature end
    ])
    expect(() => imageSize(buffer)).toThrow()
  })

  it('should handle non-image files', () => {
    // Test with PDF-like header
    const buffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // %PDF
    expect(() => imageSize(buffer)).toThrow('unsupported file type: undefined')
  })
})

describe('Type detection', () => {
  it('should detect type based on first byte optimization', () => {
    // Test PNG detection (0x89) with valid IHDR
    const buffer = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // "IHDR"
      0x00, 0x00, 0x00, 0x20, // Width: 32
      0x00, 0x00, 0x00, 0x20, // Height: 32
      0x08,                   // Bit depth
      0x06,                   // Color type
      0x00,                   // Compression method
      0x00,                   // Filter method
      0x00                    // Interlace method
    ])
    expect(detector(buffer)).toBe('png')
  })

  it('should fall back to full validation when first byte is not conclusive', () => {
    // Test with a byte that's not in the firstBytes map
    const buffer = new Uint8Array([0x3C]) // SVG starting with '<'
    expect(detector(buffer)).toBeUndefined()
  })
}) 