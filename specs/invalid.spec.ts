import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { sync as globSync } from 'glob'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'
chai.use(chaiAsPromised)
const { expect } = chai

// Test all invalid files
describe('Invalid Images', () => {
  const invalidFiles = globSync('specs/images/invalid/**/*.*')

  invalidFiles.forEach((file) => {
    it(file, async () => {
      await expect(imageSizeFromFile(file)).to.be.rejectedWith(
        TypeError,
        'Invalid',
      )
    })
  })

  it('non-existent file', async () => {
    await expect(imageSizeFromFile('fakefile.jpg')).to.be.rejectedWith(
      'ENOENT: no such file or directory',
    )
  })
})
