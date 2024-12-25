import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { sync as globSync } from 'glob'
import { imageSize } from '../lib'
import { imageSizeFileAsync } from './test-helpers'

// Test all invalid files
describe('Invalid Images', () => {
  const invalidFiles = globSync('specs/images/invalid/**/*.*')

  for (const file of invalidFiles) {
    describe(file, () => {
      it('should throw when called synchronously', () => {
        assert.throws(() => imageSize(file), TypeError, 'Invalid')
      })

      it('should callback with error when called asynchronously', async () => {
        await assert.rejects(
          async () => await imageSizeFileAsync(file),
          (err: Error) => {
            assert.ok(err instanceof TypeError)
            assert.match(err.message, /^Invalid \w+$/)
            return true
          },
        )
      })
    })
  }

  describe('non-existent file', () => {
    const fakeFile = 'fakefile.jpg'

    it('should throw when called synchronously', () => {
      assert.throws(() => imageSize(fakeFile), Error, 'ENOENT')
    })

    it('should callback with error when called asynchronously', async () => {
      await assert.rejects(
        async () => await imageSizeFileAsync(fakeFile),
        (err: Error) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /^ENOENT.*$/)
          return true
        },
      )
    })
  })
})
