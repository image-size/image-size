import { expect } from 'chai'
import imageSize, { imageSize as imageSizeNamed } from '../lib/index'
import imageSizeNode, { imageSize as imageSizeNodeNamed } from '../lib/node'

describe('Imports', () => {
  it('should import both default and named export', () => {
    expect(imageSize).to.equal(imageSizeNamed)
    expect(imageSizeNode).to.equal(imageSizeNodeNamed)
  })
})
