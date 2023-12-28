import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as sinon from 'sinon'
import * as fs from 'node:fs'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'
chai.use(chaiAsPromised)
const { expect } = chai

describe('after done reading from files', () => {
  it('should close the file descriptor', async () => {
    const spy = sinon.spy(fs.promises, 'open')
    await imageSizeFromFile('specs/images/valid/jpg/large.jpg')
    expect(spy.calledOnce).to.be.true
    const fileHandle = await spy.returnValues[0]
    await expect(fs.promises.readFile(fileHandle)).to.be.rejectedWith(
      'EBADF: bad file descriptor',
    )
    spy.restore()
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

  it('should close the file descriptor', async () => {
    const spy = sinon.spy(fs.promises, 'open')
    expect(
      imageSizeFromFile('specs/images/valid/jpg/large.jpg'),
    ).to.be.rejectedWith(RangeError, 'Array allocation failed')
    expect(spy.calledOnce).to.be.true
    const fileHandle = await spy.returnValues[0]
    await expect(fs.promises.readFile(fileHandle)).to.be.rejectedWith(
      'EBADF: bad file descriptor',
    )
    spy.restore()
  })
})
