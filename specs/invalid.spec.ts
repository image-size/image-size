import { expect } from 'chai'
import { sync as globSync } from 'glob'
import { imageSize } from '../lib/node'

// Test all invalid files
describe('Invalid Images', () => {
  const invalidFiles = globSync('specs/images/invalid/**/*.*')

  invalidFiles.forEach((file) => {
    describe(file, () => {
      it('should throw when called synchronously', () => {
        expect(() => imageSize(file)).to.throw(TypeError, 'Invalid')
      })

      it('should callback with error when called asynchronously', async () => {
        try {
          imageSize(file)
        } catch (e) {
          expect(e).to.be.instanceOf(TypeError)
          expect(e?.message).to.match(/^Invalid \w+$/)
        }
      })
    })
  })

  describe('non-existent file', () => {
    const fakeFile = 'fakefile.jpg'

    it('should throw when called synchronously', () => {
      expect(async () => await imageSize(fakeFile)).to.throw(Error, 'ENOENT')
    })

    it('should callback with error when called asynchronously', async () => {
      try {
        await imageSize(fakeFile)
      } catch (e) {
        expect(e?.message).to.match(/^ENOENT.*$/)
      }
    })
  })
})
