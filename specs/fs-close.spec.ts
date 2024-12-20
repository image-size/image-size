import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fs from 'node:fs'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'

describe('after done reading from files', () => {
  it('should close the file descriptor', async () => {
    const spy = vi.spyOn(fs.promises, 'open')
    await imageSizeFromFile('specs/images/valid/jpg/large.jpg')
    expect(spy).toHaveBeenCalledTimes(1)
    const fileHandle = spy.mock.results[0].value
    await expect(fs.promises.readFile(fileHandle)).rejects.toThrow(
      'EBADF: bad file descriptor',
    )
    spy.mockRestore()
  })
})

describe('when Uint8Array allocation fails', () => {
  beforeEach(() => {
    vi.spyOn(global, 'Uint8Array').mockImplementation(() => {
      throw new RangeError('Array allocation failed')
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should close the file descriptor', async () => {
    const spy = vi.spyOn(fs.promises, 'open')
    await expect(
      imageSizeFromFile('specs/images/valid/jpg/large.jpg'),
    ).rejects.toThrow('Array allocation failed')
    expect(spy).toHaveBeenCalledTimes(1)
    const fileHandle = spy.mock.results[0].value
    await expect(fs.promises.readFile(fileHandle)).rejects.toThrow(
      'EBADF: bad file descriptor',
    )
    spy.mockRestore()
  })
})
