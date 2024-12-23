import * as assert from 'node:assert'
import { describe, it } from 'node:test'

import imageSize, { imageSize as imageSizeNamed } from '../lib'

describe('Imports', () => {
  it('should import both default and named export', () => {
    assert.equal(imageSize, imageSizeNamed)
  })
})
