import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { writeFileSync, unlinkSync, promises } from 'node:fs'
import { imageSize as imageSizeFromFile } from '../lib/fromFile'

describe('after done reading from files', () => {
  it('should close the file descriptor', async () => {
    const spy = vi.spyOn(promises, 'open')
    await imageSizeFromFile('specs/images/valid/jpg/large.jpg')
    expect(spy).toHaveBeenCalledTimes(1)
    const fileHandle = spy.mock.results[0].value
    await expect(promises.readFile(fileHandle)).rejects.toThrowError()
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
    const spy = vi.spyOn(promises, 'open')
    await expect(
      imageSizeFromFile('specs/images/valid/jpg/large.jpg'),
    ).rejects.toThrow('Array allocation failed')
    expect(spy).toHaveBeenCalledTimes(1)
    const fileHandle = spy.mock.results[0].value
    await expect(promises.readFile(fileHandle)).rejects.toThrowError()
    spy.mockRestore()
  })
})

describe('File System Edge Cases', () => {
  it('should handle empty files', async () => {
    const emptyFile = 'specs/images/empty.jpg'
    writeFileSync(emptyFile, '')
    await expect(imageSizeFromFile(emptyFile)).rejects.toThrow('Empty file')
    unlinkSync(emptyFile)
  })
})
