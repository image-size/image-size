import { expect } from 'chai'
import { sync as globSync } from 'glob'
import { extname, resolve } from 'path'
import { openSync, readSync } from 'fs'
import { imageSize } from '../lib'
import { detector } from '../lib/detector'
import { ISizeCalculationResult } from '../lib/types/interface'

const bufferSize = 8192

const sizes: { [key: string]: ISizeCalculationResult} = {
  default: {
    width: 123,
    height: 456
  },
  'specs/images/valid/cur/sample.cur': {
    width: 32, height: 32
  },
  'specs/images/valid/ico/sample.ico': {
    width: 32, height: 32
  },
  'specs/images/valid/ico/sample-compressed.ico': {
    width: 32, height: 32
  },
  'specs/images/valid/ico/sample-256.ico': {
    width: 256, height: 256
  },
  'specs/images/valid/ico/sample-256-compressed.ico': {
    width: 256, height: 256
  },
  'specs/images/valid/icns/sample.icns': {
    width: 16,
    height: 16,
    images: [
      { width: 16, height: 16, type: 'is32' },
      { width: 16, height: 16, type: 's8mk' },
      { width: 32, height: 32, type: 'il32' },
      { width: 32, height: 32, type: 'l8mk' },
      { width: 48, height: 48, type: 'ih32' },
      { width: 48, height: 48, type: 'h8mk' },
      { width: 128, height: 128, type: 'it32' },
      { width: 128, height: 128, type: 't8mk' }
    ],
    type: 'icns'
  },
  'specs/images/valid/ico/multi-size.ico': {
    width: 256,
    height: 256,
    images: [
      {width: 256, height: 256},
      {width: 128, height: 128},
      {width: 96, height: 96},
      {width: 72, height: 72},
      {width: 64, height: 64},
      {width: 48, height: 48},
      {width: 32, height: 32},
      {width: 24, height: 24},
      {width: 16, height: 16}
    ]
  },
  'specs/images/valid/ico/multi-size-compressed.ico': {
    width: 256,
    height: 256,
    images: [
      {width: 256, height: 256},
      {width: 128, height: 128},
      {width: 96, height: 96},
      {width: 72, height: 72},
      {width: 64, height: 64},
      {width: 48, height: 48},
      {width: 32, height: 32},
      {width: 24, height: 24},
      {width: 16, height: 16}
    ]
  },
  'specs/images/valid/jpg/large.jpg': {
    width: 1600,
    height: 1200
  },
  'specs/images/valid/jpg/very-large.jpg': {
    width: 4800,
    height: 3600
  },
  'specs/images/valid/jpg/1x2-flipped-big-endian.jpg': {
    width: 1,
    height: 2,
    orientation: 8
  },
  'specs/images/valid/jpg/1x2-flipped-little-endian.jpg': {
    width: 1,
    height: 2,
    orientation: 8
  },
  'specs/images/valid/png/sample_fried.png': {
    width: 128,
    height: 68
  }
}

// Test all valid files
describe('Valid images', () => {

  const validFiles = globSync('specs/images/valid/**/*.*')
    .filter(file => extname(file) !== '.md')

  validFiles.forEach(file => describe(file, () => {
    let type: string | undefined
    let bufferDimensions: ISizeCalculationResult
    let asyncDimensions: ISizeCalculationResult

    beforeEach(done => {
      const buffer = Buffer.alloc(bufferSize)
      const filepath = resolve(file)
      const descriptor = openSync(filepath, 'r')
      readSync(descriptor, buffer, 0, bufferSize, 0)
      type = detector(buffer)

      // tiff cannot support buffers, unless the buffer contains the entire file
      if (type !== 'tiff') {
        bufferDimensions = imageSize(buffer)
      }

      imageSize(file, (err, dim) => {
        if (err || !dim) {
          done(err)
        } else {
          asyncDimensions = dim
          done()
        }
      })
    })

    it('should return correct size for ' + file, () => {
      const expected = sizes[file as keyof typeof sizes] || sizes.default
      expect(asyncDimensions.width).to.equal(expected.width)
      expect(asyncDimensions.height).to.equal(expected.height)
      if (asyncDimensions.images) {
        asyncDimensions.images.forEach((item, index) => {
          if (expected.images) {
            const expectedItem = expected.images[index]
            expect(item.width).to.equal(expectedItem.width)
            expect(item.height).to.equal(expectedItem.height)
            if (expectedItem.type) {
              expect(item.type).to.equal(expectedItem.type)
            }
          }
        })
      }

      if (expected.orientation) {
        expect(asyncDimensions.orientation).to.equal(expected.orientation)
      }

      if (type !== 'tiff') {
        expect(bufferDimensions.width).to.equal(expected.width)
        expect(bufferDimensions.height).to.equal(expected.height)
        if (bufferDimensions.images) {
          bufferDimensions.images.forEach((item, index) => {
            if (expected.images) {
              const expectedItem = expected.images[index]
              expect(item.width).to.equal(expectedItem.width)
              expect(item.height).to.equal(expectedItem.height)
            }
          })
        }
      }
    })
  }))
})
