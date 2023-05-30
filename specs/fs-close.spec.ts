import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'
import { imageSize } from '../lib'

const testBuf = new Uint8Array(1)
const readFromClosed = (fd: number) => fs.readSync(fd, testBuf, 0, 1, 0)

describe('after done reading from files', () => {
  describe('should close the file descriptor', () => {
    it('async', (done) => {
      const spy = sinon.spy(fs.promises, 'open')
      imageSize('specs/images/valid/jpg/large.jpg', async (err) => {
        try {
          expect(err).to.be.null
          expect(spy.calledOnce).to.be.true
          const fileHandle = await spy.returnValues[0]
          expect(() => readFromClosed(fileHandle.fd)).to.throw(Error)

          done()
        } catch (err) {
          done(err)
        } finally {
          spy.restore()
        }
      })
    })

    it('sync', () => {
      const spy = sinon.spy(fs, 'openSync')
      imageSize('specs/images/valid/jpg/large.jpg')
      expect(() => readFromClosed(spy.returnValues[0])).to.throw(
        Error,
        'bad file descriptor'
      )
      spy.restore()
    })
  })
})

describe('when Uint8Array allocation fails', () => {
  const sandbox = sinon.createSandbox()

  before(() => {
    sandbox
      .stub(global, 'Uint8Array')
      // Error like the one thrown by Buffer.alloc when there is not enough free memory
      .throws(new RangeError('Array allocation failed'))
  })

  after(() => {
    sandbox.restore()
  })

  describe('should close the file descriptor', () => {
    it('async', (done) => {
      const spy = sinon.spy(fs.promises, 'open')
      imageSize('specs/images/valid/jpg/large.jpg', async (err) => {
        try {
          expect(err).to.be.instanceOf(RangeError)
          expect(spy.calledOnce).to.be.true
          const fileHandle = await spy.returnValues[0]
          expect(() => readFromClosed(fileHandle.fd)).to.throw(Error)

          done()
        } catch (err) {
          done(err)
        } finally {
          spy.restore()
        }
      })
    })

    it('sync', () => {
      const spy = sinon.spy(fs, 'openSync')
      expect(() => imageSize('specs/images/valid/jpg/large.jpg')).to.throw(
        RangeError
      )
      expect(() => readFromClosed(spy.returnValues[0])).to.throw(
        Error,
        'bad file descriptor'
      )
      spy.restore()
    })
  })
})
