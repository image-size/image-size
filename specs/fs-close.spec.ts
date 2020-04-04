import { expect } from 'chai'
import * as sinon from 'sinon'
import * as fs from 'fs'
import { imageSize } from '../lib'

describe('after done reading from files', () => {
  const readFromClosed = (fd: number) => fs.readSync(fd, Buffer.alloc(1), 0, 1, 0)

  describe('should close the file descriptor', () => {
    it('async', done => {
      const spy = sinon.spy(fs.promises, 'open')
      imageSize('specs/images/valid/jpg/large.jpg', () => {
        expect(spy.calledOnce).to.be.true
        const fsPromise = spy.returnValues[0]
        fsPromise.then((handle) => {
          expect(() => readFromClosed(handle.fd)).to.throw(Error)
          spy.restore()
          done()
        })
      })
    })

    // TODO: revisit this spec. how to ensure that we never leave descriptors open
    it('sync', () => {
      const spy = sinon.spy(fs, 'openSync')
      imageSize('specs/images/valid/jpg/large.jpg')
      expect(() => readFromClosed(spy.returnValues[0])).to.throw(Error, 'bad file descriptor')
      spy.restore()
    })
  })
})
