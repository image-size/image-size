import type { ISizeCalculationResult } from './types/interface'
import { lookup } from './lookup'

export default imageSize
export function imageSize(input: Uint8Array): ISizeCalculationResult

/**
 * @param {Uint8Array} input - Uint8Array of the image file
 */
export function imageSize(input: Uint8Array): ISizeCalculationResult {
  // Handle Uint8Array input
  return lookup(input)
}
