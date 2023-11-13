import { resolve } from 'node:path'
import { openSync, readSync } from 'node:fs'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { disableTypes } from '../lib/lookup'
import { types } from '../lib/types'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'
import { imageSize } from '../lib/index'
chai.use(chaiAsPromised)
const { expect } = chai

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
      expect(() => imageSize(buffer)).to.throw(
        TypeError,
        'Invalid Tiff. Missing tags',
      )
    })
  })

  describe('for a disabled image type', () => {
    before(() => disableTypes(['jpg', 'bmp']))
    after(() => disableTypes([]))

    it('should throw', async () => {
      await expect(
        imageSizeFromFile('specs/images/valid/jpg/sample.jpg'),
      ).to.be.rejectedWith(TypeError, 'disabled file type: jpg')
      await expect(
        imageSizeFromFile('specs/images/valid/bmp/sample.bmp'),
      ).to.be.rejectedWith(TypeError, 'disabled file type: bmp')
      await expect(imageSizeFromFile('specs/images/valid/png/sample.png')).to
        .not.be.rejected
    })
  })
})

describe('.types property', () => {
  it('should expose supported file types', () => {
    expect(types).to.eql([
      'bmp',
      'cur',
      'dds',
      'gif',
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
