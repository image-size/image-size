import * as assert from 'node:assert'
import { openSync, readSync } from 'node:fs'
import { resolve } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { disableFS, disableTypes, imageSize, types } from '../lib'

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
      assert.throws(
        () => imageSize(buffer),
        TypeError,
        "Tiff doesn't support buffer",
      )
    })
  })

  describe('for a disabled image type', () => {
    before(() => disableTypes(['jpg', 'bmp']))
    after(() => disableTypes([]))

    it('should throw', () => {
      assert.throws(
        () => imageSize('specs/images/valid/jpg/sample.jpg'),
        TypeError,
        'disabled file type: jpg',
      )
      assert.throws(
        () => imageSize('specs/images/valid/bmp/sample.bmp'),
        TypeError,
        'disabled file type: bmp',
      )
      assert.doesNotThrow(() => imageSize('specs/images/valid/png/sample.png'))
    })
  })

  describe('when FS reads are disabled', () => {
    before(() => disableFS(true))
    after(() => disableFS(false))

    it('should only allow Uint8Array inputs', () => {
      assert.throws(
        () => imageSize('specs/images/valid/jpg/sample.jpg'),
        TypeError,
        'invalid invocation. input should be a Uint8Array',
      )
    })
  })
})

describe('Callback ', () => {
  it('should be called only once', async () => {
    const tmpError = new Error()

    const origException = process.listeners('uncaughtException').pop()
    if (origException) {
      process.removeListener('uncaughtException', origException)
    }

    process.once('uncaughtException', (err) => {
      assert.equal(err, tmpError)
    })

    await new Promise<void>((resolve) => {
      imageSize('specs/images/valid/jpg/sample.jpg', () => {
        process.nextTick(() => resolve())
        throw tmpError
      })
    })
  })
})

describe('.types property', () => {
  it('should expose supported file types', () => {
    assert.deepEqual(types, [
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
      'jxl',
      'jxl-stream',
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
