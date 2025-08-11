import * as assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { describe, it } from 'node:test'
import { sync as globSync } from 'glob'

import { imageFormat } from '../lib/index'

// Test all valid files
describe('Valid image formats', () => {
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
