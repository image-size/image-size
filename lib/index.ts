import * as fs from 'fs'
import * as path from 'path'
import { typeHandlers } from './types'
import { detector } from './detector'
import { ISizes, ISize } from './types/interface'

type CallbackFn = (e: Error | null, b?: Buffer) => void
type Dimensions = ISize | ISizes | null | undefined

// Maximum buffer size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxBufferSize = 512 * 1024

/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @param {String} filepath
 * @returns {Object}
 */
function lookup(buffer: Buffer, filepath?: string) {
  // detect the file type.. don't rely on the extension
  const type = detector(buffer)
  if (!type) { return null }

  // find an appropriate handler for this file type
  if (type in typeHandlers) {
    const size = typeHandlers[type].calculate(buffer, filepath)
    if (size !== undefined) {
      size.type = type
      return size
    }
  }

  // throw up, if we don't understand the file
  throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')')
}

/**
 * Reads a file into a buffer.
 *
 * The callback will be called after the process has completed. The
 * callback's first argument will be an error (or null). The second argument
 * will be the Buffer, if the operation was successful.
 *
 * @param {String} filepath
 * @param {Function} callback
 */
function asyncFileToBuffer(filepath: string, callback: CallbackFn): void {
  // open the file in read only mode
  fs.open(filepath, 'r', (err1, descriptor) => {
    if (err1) {
      return callback(err1)
    }
    fs.fstat(descriptor, (err2, stats) => {
      if (err2) {
        return callback(err2)
      }
      const size = stats.size
      if (size <= 0) {
        return callback(new Error('File size is not greater than 0 —— ' + filepath))
      }
      const bufferSize = Math.min(size, MaxBufferSize)
      const buffer = Buffer.alloc(bufferSize)
      // read first buffer block from the file, asynchronously
      fs.read(descriptor, buffer, 0, bufferSize, 0, (err3) => {
        if (err3) {
          return callback(err3)
        }
        // close the file, we are done
        fs.close(descriptor, (err4) => {
          callback(err4, buffer)
        })
      })
    })
  })
}

/**
 * Synchronously reads a file into a buffer, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Buffer}
 */
function syncFileToBuffer(filepath: string): Buffer {
  // read from the file, synchronously
  const descriptor = fs.openSync(filepath, 'r')
  const size = fs.fstatSync(descriptor).size
  const bufferSize = Math.min(size, MaxBufferSize)
  const buffer = Buffer.alloc(bufferSize)
  fs.readSync(descriptor, buffer, 0, bufferSize, 0)
  fs.closeSync(descriptor)
  return buffer
}

export function imageSize(input: Buffer): Dimensions
export function imageSize(input: string, callback: CallbackFn): void
/**
 * @param {Buffer|string} input - buffer or relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
export function imageSize(input: any, callback?: any): any {
  // Handle buffer input
  if (Buffer.isBuffer(input)) {
    return lookup(input)
  }

  // input should be a string at this point
  if (typeof input !== 'string') {
    throw new TypeError('invalid invocation')
  }

  // resolve the file path
  const filepath = path.resolve(input)

  if (typeof callback === 'function') {
    asyncFileToBuffer(filepath, (err, buffer) => {
      if (err || !buffer) {
        return callback(err)
      }
      let dimensions: Dimensions = null
      try {
        dimensions = lookup(buffer, filepath)
      } catch (e) {
        err = e
      }
      callback(err, dimensions)
    })
  } else {
    const buffer = syncFileToBuffer(filepath)
    return lookup(buffer, filepath)
  }
}

export const types = Object.keys(typeHandlers)
