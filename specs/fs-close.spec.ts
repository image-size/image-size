import * as assert from 'node:assert'
import * as fs from 'node:fs'
import { after, before, describe, it, mock } from 'node:test'
import { imageSize } from '../lib'
import { imageSizeFileAsync } from './test-helpers'

const testBuf = new Uint8Array(1)
const readFromClosed = (fd: number) => fs.readSync(fd, testBuf, 0, 1, 0)

describe('after done reading from files', () => {
  describe('should close the file descriptor', () => {
    it('async', async () => {
      const spy = mock.method(fs.promises, 'open')
      try {
        await imageSizeFileAsync('specs/images/valid/jpg/large.jpg')
        assert.equal(spy.mock.callCount(), 1)
        const fileHandle = await spy.mock.calls[0].result
        // biome-ignore lint/style/noNonNullAssertion:
        assert.throws(() => readFromClosed(fileHandle!.fd))
      } finally {
        spy.mock.restore()
      }
    })

    it('sync', () => {
      const spy = mock.method(fs, 'openSync')
      try {
        imageSize('specs/images/valid/jpg/large.jpg')
      } finally {
        spy.mock.restore()
      }
      imageSize('specs/images/valid/jpg/large.jpg')
      const fileHandle = spy.mock.calls[0].result
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      assert.throws(() => readFromClosed(fileHandle!))
    })
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

  describe('should close the file descriptor', () => {
    it('async', async () => {
      const spy = mock.method(fs.promises, 'open')
      try {
        const err = await imageSizeFileAsync(
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

    it('sync', () => {
      const spy = mock.method(fs, 'openSync')
      assert.throws(
        () => imageSize('specs/images/valid/jpg/large.jpg'),
        RangeError,
      )
      // expect(() => readFromClosed(spy.returnValues[0])).to.throw(
      //   Error,
      //   'bad file descriptor',
      // )
      spy.mock.restore()
    })
  })
})
