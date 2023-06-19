import type { imageType } from './types/index'
import { typeHandlers } from './types/index'
import { detector } from './detector'
import type { ISizeCalculationResult } from './types/interface'

type Options = {
  disabledTypes: imageType[]
}

const globalOptions: Options = {
  disabledTypes: [],
}

/**
 * Return size information based on an Uint8Array
 *
 * @param {Uint8Array} input
 * @returns {Object}
 */
export function lookup(input: Uint8Array): ISizeCalculationResult {
  // detect the file type... don't rely on the extension
  const type = detector(input)

  if (typeof type !== 'undefined') {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError('disabled file type: ' + type)
    }

    // find an appropriate handler for this file type
    if (type in typeHandlers) {
      const size = typeHandlers[type].calculate(input)
      if (size !== undefined) {
        size.type = type
        return size
      }
    }
  }

  // throw up, if we don't understand the file
  throw new TypeError('unsupported file type: ' + type)
}

export const disableTypes = (types: imageType[]): void => {
  globalOptions.disabledTypes = types
}
export const types = Object.keys(typeHandlers)
