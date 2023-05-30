import { resolve } from 'path'
import { openSync, readSync } from 'fs'
import { expect } from 'chai'
import { imageSize, types, disableTypes, disableFS } from '../lib'

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
        'Tiff doesn\'t support buffer'
      )
    })
  })

  describe('for a disabled image type', () => {
    before(() => disableTypes(['jpg', 'bmp']))
    after(() => disableTypes([]))

    it('should throw', () => {
      expect(() => imageSize('specs/images/valid/jpg/sample.jpg')).to.throw(
        TypeError,
        'disabled file type: jpg'
      )
      expect(() => imageSize('specs/images/valid/bmp/sample.bmp')).to.throw(
        TypeError,
        'disabled file type: bmp'
      )
      expect(() =>
        imageSize('specs/images/valid/png/sample.png')
      ).to.not.throw()
    })
  })

  describe('when FS reads are disabled', () => {
    before(() => disableFS(true))
    after(() => disableFS(false))

    it('should only allow Uint8Array inputs', () => {
      expect(() => imageSize('specs/images/valid/jpg/sample.jpg')).to.throw(
        TypeError,
        'invalid invocation. input should be a Uint8Array'
      )
    })
  })
})

describe('Callback ', () => {
  it('should be called only once', (done) => {
    const tmpError = new Error()

    const origException = process.listeners('uncaughtException').pop()
    if (origException) {
      process.removeListener('uncaughtException', origException)
    }

    process.once('uncaughtException', (err) => {
      expect(err).to.equal(tmpError)
    })

    imageSize('specs/images/valid/jpg/sample.jpg', () => {
      process.nextTick(() => done())
      throw tmpError
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
