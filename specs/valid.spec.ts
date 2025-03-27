import * as assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { sync as globSync } from 'glob'

import { detector } from '../lib/detector'
import type { ISizeCalculationResult } from '../lib/types/interface'
import { imageSizeFromFile } from '../lib/fromFile'

const sizes: Record<string, ISizeCalculationResult> = {
  'specs/images/valid/cur/sample.cur': {
    type: 'cur',
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample.ico': {
    type: 'ico',
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample-compressed.ico': {
    type: 'ico',
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample-256.ico': {
    type: 'ico',
    width: 256,
    height: 256,
  },
  'specs/images/valid/ico/sample-256-compressed.ico': {
    type: 'ico',
    width: 256,
    height: 256,
  },
  'specs/images/valid/icns/sample.icns': {
    width: 128,
    height: 128,
    images: [
      { width: 16, height: 16, type: 'is32' },
      { width: 16, height: 16, type: 's8mk' },
      { width: 32, height: 32, type: 'il32' },
      { width: 32, height: 32, type: 'l8mk' },
      { width: 48, height: 48, type: 'ih32' },
      { width: 48, height: 48, type: 'h8mk' },
      { width: 128, height: 128, type: 'it32' },
      { width: 128, height: 128, type: 't8mk' },
    ],
    type: 'icns',
  },
  'specs/images/valid/ico/multi-size.ico': {
    type: 'ico',
    width: 256,
    height: 256,
    images: [
      { width: 256, height: 256 },
      { width: 128, height: 128 },
      { width: 96, height: 96 },
      { width: 72, height: 72 },
      { width: 64, height: 64 },
      { width: 48, height: 48 },
      { width: 32, height: 32 },
      { width: 24, height: 24 },
      { width: 16, height: 16 },
    ],
  },
  'specs/images/valid/ico/multi-size-compressed.ico': {
    type: 'ico',
    width: 256,
    height: 256,
    images: [
      { width: 256, height: 256 },
      { width: 128, height: 128 },
      { width: 96, height: 96 },
      { width: 72, height: 72 },
      { width: 64, height: 64 },
      { width: 48, height: 48 },
      { width: 32, height: 32 },
      { width: 24, height: 24 },
      { width: 16, height: 16 },
    ],
  },
  'specs/images/valid/jpg/large.jpg': {
    type: 'jpg',
    width: 1600,
    height: 1200,
    orientation: 1,
  },
  'specs/images/valid/jpg/very-large.jpg': {
    type: 'jpg',
    width: 4800,
    height: 3600,
    orientation: 1,
  },
  'specs/images/valid/jpg/1x2-flipped-big-endian.jpg': {
    type: 'jpg',
    width: 1,
    height: 2,
    orientation: 8,
  },
  'specs/images/valid/jpg/1x2-flipped-little-endian.jpg': {
    type: 'jpg',
    width: 1,
    height: 2,
    orientation: 8,
  },
  'specs/images/valid/png/sample_fried.png': {
    type: 'png',
    width: 128,
    height: 68,
  },
  'specs/images/valid/jxl-stream/small_square.jxl': {
    type: 'jxl-stream',
    width: 64,
    height: 64,
  },
  'specs/images/valid/jxl-stream/small_rect.jxl': {
    type: 'jxl-stream',
    width: 120,
    height: 80,
  },
  'specs/images/valid/jxl-stream/large_explicit.jxl': {
    type: 'jxl-stream',
    width: 3000,
    height: 2000,
  },
  'specs/images/valid/jxl-stream/large_16_9.jxl': {
    type: 'jxl-stream',
    width: 1920,
    height: 1080,
  },
  'specs/images/valid/jxl-stream/max_small.jxl': {
    type: 'jxl-stream',
    width: 256,
    height: 256,
  },
  'specs/images/valid/jxl-stream/min_large.jxl': {
    type: 'jxl-stream',
    width: 257,
    height: 257,
  },
  'specs/images/valid/heif/sample.heic': {
    type: 'heic',
    width: 123,
    height: 456,
  },
  'specs/images/valid/heif/sample-multi.heic': {
    type: 'heic',
    width: 123,
    height: 456,
    images: [
      { width: 123, height: 456 },
      { width: 63, height: 64 },
    ],
  },
  'specs/images/valid/webp/lossy.webp': {
    width: 123,
    height: 456,
    type: 'webp',
  },
  'specs/images/valid/webp/lossless.webp': {
    width: 123,
    height: 456,
    type: 'webp',
  },
  'specs/images/valid/webp/extended.webp': {
    width: 123,
    height: 456,
    type: 'webp',
  },
  'specs/images/valid/tiff/little-endian.tiff': {
    width: 123,
    height: 456,
    type: 'tiff',
  },
  'specs/images/valid/tiff/jpeg.tiff': {
    width: 123,
    height: 456,
    type: 'tiff',
  },
  'specs/images/valid/tiff/bigtiff-little-endian.tiff': {
    width: 123,
    height: 456,
    type: 'bigtiff',
  },
  'specs/images/valid/tiff/bigtiff-jpeg.tiff': {
    width: 123,
    height: 456,
    type: 'bigtiff',
  },
  'specs/images/valid/tiff/bigtiff-big-endian.tiff': {
    width: 123,
    height: 456,
    type: 'bigtiff',
  },
  'specs/images/valid/tiff/big-endian.tiff': {
    width: 123,
    height: 456,
    type: 'tiff',
  },
  'specs/images/valid/tga/sample.tga': {
    width: 123,
    height: 456,
    type: 'tga',
  },
  'specs/images/valid/svg/width-height.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-width.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-width-height.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-width-height-brackets.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-units.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-lowercase.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/viewbox-height.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/units-inches.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/single-quotes.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/percentage.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/ignore-stroke-width.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/svg/exponent-width-height.svg': {
    width: 123,
    height: 456,
    type: 'svg',
  },
  'specs/images/valid/psd/sample.psd': {
    width: 123,
    height: 456,
    type: 'psd',
  },
  'specs/images/valid/pnm/sample.ppm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample.pgm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample.pfm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample.pbm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample.pam': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample-ascii.ppm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample-ascii.pgm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/pnm/sample-ascii.pbm': {
    width: 123,
    height: 456,
    type: 'pnm',
  },
  'specs/images/valid/png/sample.png': {
    width: 123,
    height: 456,
    type: 'png',
  },
  'specs/images/valid/ktx/sample.ktx2': {
    width: 123,
    height: 456,
    type: 'ktx2',
  },
  'specs/images/valid/ktx/sample.ktx': {
    width: 123,
    height: 456,
    type: 'ktx',
  },
  'specs/images/valid/jxl-stream/sample.jxl.stream': {
    width: 123,
    height: 456,
    type: 'jxl-stream',
  },
  'specs/images/valid/jxl/sample.jxl': {
    width: 123,
    height: 456,
    type: 'jxl',
  },
  'specs/images/valid/jpg/sampleExported.jpg': {
    width: 123,
    height: 456,
    type: 'jpg',
  },
  'specs/images/valid/jpg/sample.jpg': {
    width: 123,
    height: 456,
    type: 'jpg',
  },
  'specs/images/valid/jpg/progressive.jpg': {
    width: 123,
    height: 456,
    type: 'jpg',
  },
  'specs/images/valid/jpg/optimized.jpg': {
    width: 123,
    height: 456,
    type: 'jpg',
  },
  'specs/images/valid/jp2/sample.jp2': {
    width: 123,
    height: 456,
    type: 'jp2',
  },
  'specs/images/valid/heif/sample.heif': {
    width: 123,
    height: 456,
    type: 'heic',
  },
  'specs/images/valid/heif/sample.avif': {
    width: 123,
    height: 456,
    type: 'avif',
  },
  'specs/images/valid/heif/sample-garbled.avif': {
    width: 123,
    height: 456,
    type: 'avif',
  },
  'specs/images/valid/gif/sample.gif': {
    width: 123,
    height: 456,
    type: 'gif',
  },
  'specs/images/valid/dds/sample.dds': {
    width: 123,
    height: 456,
    type: 'dds',
  },
  'specs/images/valid/bmp/sample.bmp': {
    width: 123,
    height: 456,
    type: 'bmp',
  },
}

// Test all valid files
describe('Valid images', () => {
  const validFiles = globSync('specs/images/valid/**/*.*').filter(
    (file) => extname(file) !== '.md',
  )

  for (const file of validFiles) {
    const filepath = resolve(file)
    const buffer = readFileSync(filepath)
    const type = detector(buffer)

    describe(type, () => {
      it(file, async () => {
        const dimensions = await imageSizeFromFile(file)

        const expected = sizes[file]

        // The `compression` property is created for tiff images, but there is no typing for it.
        // It is deleted to not fail test.
        delete (dimensions as any).compression

        assert.deepStrictEqual(dimensions, expected)
      })
    })
  }
})
