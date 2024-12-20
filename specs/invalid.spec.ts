import { describe, it, expect } from 'vitest'
import { sync as globSync } from 'glob'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'

// Test all invalid files
describe('Invalid Images', () => {
  const invalidFiles = globSync('specs/images/invalid/**/*.*')

  invalidFiles.forEach((file) => {
    it(file, async () => {
      await expect(imageSizeFromFile(file)).rejects.toThrow('Invalid')
    })
  })

  it('non-existent file', async () => {
    await expect(imageSizeFromFile('fakefile.jpg')).rejects.toThrow(
      'ENOENT: no such file or directory',
    )
  })
})
