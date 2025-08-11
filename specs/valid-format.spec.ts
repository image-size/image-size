import * as assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { sync as globSync } from 'glob'

import type { ISizeCalculationResult } from '../lib/types/interface'
import { imageFormat } from '../lib/index'

const sizes: Record<string, ISizeCalculationResult> = {
  default: {
    width: 123,
    height: 456,
  },
  'specs/images/valid/cur/sample.cur': {
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample.ico': {
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample-compressed.ico': {
    width: 32,
    height: 32,
  },
  'specs/images/valid/ico/sample-256.ico': {
    width: 256,
    height: 256,
  },
  'specs/images/valid/ico/sample-256-compressed.ico': {
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
    width: 1600,
    height: 1200,
  },
  'specs/images/valid/jpg/very-large.jpg': {
    width: 4800,
    height: 3600,
  },
  'specs/images/valid/jpg/1x2-flipped-big-endian.jpg': {
    width: 1,
    height: 2,
    orientation: 8,
  },
  'specs/images/valid/jpg/1x2-flipped-little-endian.jpg': {
    width: 1,
    height: 2,
    orientation: 8,
  },
  'specs/images/valid/png/sample_fried.png': {
    width: 128,
    height: 68,
  },
  'specs/images/valid/jxl-stream/small_square.jxl': {
    width: 64,
    height: 64,
  },
  'specs/images/valid/jxl-stream/small_rect.jxl': {
    width: 120,
    height: 80,
  },
  'specs/images/valid/jxl-stream/large_explicit.jxl': {
    width: 3000,
    height: 2000,
  },
  'specs/images/valid/jxl-stream/large_16_9.jxl': {
    width: 1920,
    height: 1080,
  },
  'specs/images/valid/jxl-stream/max_small.jxl': {
    width: 256,
    height: 256,
  },
  'specs/images/valid/jxl-stream/min_large.jxl': {
    width: 257,
    height: 257,
  },
  'specs/images/valid/heif/sample.heic': {
    width: 123,
    height: 456,
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
}

// Test all valid files
describe('Valid images', () => {
  const validFiles = globSync('specs/images/valid/**/*.*').filter(
    (file) => extname(file) !== '.md',
  )

  for (const file of validFiles) {
    it(file, async () => {
      const filepath = resolve(file)
      const buffer = readFileSync(filepath)
      let type = imageFormat(buffer)
      let ext = filepath.split('.').pop() || ''
      if (ext === 'ppm' || ext === 'pgm' || ext === 'pfm' || ext === 'pbm' || ext === 'pam') {
        ext = 'pnm'
      }
      if (ext === 'jxl-stream' || ext === 'stream') {
        ext = 'jxl'
      }
      if (ext === 'ktx2') {
        ext = 'ktx'
      }
      if (ext === 'avif' || ext === 'heic') {
        // TODO: should we add more granual heif types?
        ext = 'heif'
      }
      if (type === 'jxl-stream') {
        // TODO: should we expose jxl-stream typ?
        type = 'jxl'
      }
      assert.equal(type, ext)
    })
  }
})
