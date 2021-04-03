import imageSize, { imageSize as imageSizeNamed } from '../src/index';

describe('Imports', () => {
  it('should import both default and named export', () => {
    expect(imageSize).toEqual(imageSizeNamed)
  })
})
