import { lookup } from './lookup'

/**
 * @param {Uint8Array} input - Uint8Array/Buffer of the image file
 */
const imageSize = (input: Uint8Array) => lookup(input)
export default imageSize
