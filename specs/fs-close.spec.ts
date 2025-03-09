import * as assert from 'node:assert'
import * as fs from 'node:fs'
import { after, before, describe, it, mock } from 'node:test'
import { imageSizeFromFile } from '../lib/fromFile'

const testBuf = new Uint8Array(1)
const readFromClosed = (fd: number) => fs.readSync(fd, testBuf, 0, 1, 0)

describe('after done reading from files', () => {
  it('should close the file descriptor', async () => {
    const spy = mock.method(fs.promises, 'open')
    try {
      await imageSizeFromFile('specs/images/valid/jpg/large.jpg')
      assert.equal(spy.mock.callCount(), 1)
      const fileHandle = await spy.mock.calls[0].result
      // biome-ignore lint/style/noNonNullAssertion:
      assert.throws(() => readFromClosed(fileHandle!.fd))
    } finally {
      spy.mock.restore()
    }
  })
})

describe('when Uint8Array allocation fails', () => {
  const originalUint8Array = global.Uint8Array
  class FakeUint8Array {
    constructor() {
      // Error like the one thrown by Buffer.alloc when there is not enough free memory
      throw new RangeError('Array allocation failed')
    }
  }

  before(() => {
    global.Uint8Array = FakeUint8Array as unknown as typeof Uint8Array
  })

  after(() => {
    global.Uint8Array = originalUint8Array
  })

  it('should close the file descriptor', async () => {
    const spy = mock.method(fs.promises, 'open')
    try {
      const err = await imageSizeFromFile(
        'specs/images/valid/jpg/large.jpg',
      ).catch((error) => error)
      console.log(err)
      assert.equal(err instanceof RangeError, true)
      assert.equal(spy.mock.callCount(), 1)
      const fileHandle = await spy.mock.calls[0].result
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      assert.throws(() => readFromClosed(fileHandle!.fd))
    } finally {
      spy.mock.restore()
    }
  })
})
