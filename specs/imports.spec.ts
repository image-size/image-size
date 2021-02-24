import { expect } from 'chai'
import imageSize, { imageSize as imageSizeNamed } from '../lib'

describe('Imports', () => {
  it('should import both default and named export', () => {
    expect(imageSize).to.equal(imageSizeNamed)
  })
})
