import { typeHandlers } from './types'
import { detector } from './detector'
import type { ISizeCalculationResult } from './types/interface'
import { beginRead } from './readUInt'

/**
 * Return size information based on a buffer
 *
 * @param {Buffer} buffer
 * @param {String} filepath
 * @returns {Object}
 */
 function lookup(buffer: ArrayBuffer, filepath?: string): ISizeCalculationResult {
  // detect the file type.. don't rely on the extension
  const view = beginRead(buffer);
  const type = detector(view)

  if (typeof type !== 'undefined') {

    // find an appropriate handler for this file type
    if (type in typeHandlers) {
      const size = typeHandlers[type].calculate(view, filepath)
      if (size !== undefined) {
        size.type = type
        return size
      }
    }
  }

  // throw up, if we don't understand the file
  throw new TypeError('unsupported file type: ' + type + ' (file: ' + filepath + ')')
} 

/**
 * @param {Buffer|string} input - buffer or relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
export function imageSize(input: ArrayBuffer): ISizeCalculationResult {
  return lookup(input)
}

console.log('hello world')