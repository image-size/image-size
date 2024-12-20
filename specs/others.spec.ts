import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { resolve } from 'node:path'
import { openSync, readSync } from 'node:fs'
import { disableTypes } from '../lib/lookup'
import { types } from '../lib/types'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'
import { imageSize } from '../lib/index'

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
      'bmp',
      'cur',
      'dds',
      'gif',
      'heif',
      'icns',
      'ico',
      'j2c',
      'jp2',
      'jpg',
      'ktx',
      'png',
      'pnm',
      'psd',
      'svg',
      'tga',
      'tiff',
      'webp',
    ])
  })
})
