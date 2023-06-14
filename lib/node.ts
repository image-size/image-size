import * as fs from 'node:fs'
import * as path from 'node:path'
import Queue from 'queue'
import type { ISizeCalculationResult } from './types/interface'
import { lookup } from './lookup'

type CallbackFn = (e: Error | null, r?: ISizeCalculationResult) => void

// Maximum input size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxInputSize = 512 * 1024

// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue = new Queue({ concurrency: 100, autostart: true })

/**
 * Reads a file into an Uint8Array.
 * @param {String} filepath
 * @returns {Promise<Uint8Array>}
 */
async function readFileAsync(filepath: string): Promise<Uint8Array> {
  const handle = await fs.promises.open(filepath, 'r')
  try {
    const { size } = await handle.stat()
    if (size <= 0) {
      throw new Error('Empty file')
    }
    const inputSize = Math.min(size, MaxInputSize)
    const input = new Uint8Array(inputSize)
    await handle.read(input, 0, inputSize, 0)
    return input
  } finally {
    await handle.close()
  }
}

/**
 * Synchronously reads a file into an Uint8Array, blocking the nodejs process.
 *
 * @param {String} filepath
 * @returns {Uint8Array}
 */
function readFileSync(filepath: string): Uint8Array {
  // read from the file, synchronously
  const descriptor = fs.openSync(filepath, 'r')
  try {
    const { size } = fs.fstatSync(descriptor)
    if (size <= 0) {
      throw new Error('Empty file')
    }
    const inputSize = Math.min(size, MaxInputSize)
    const input = new Uint8Array(inputSize)
    fs.readSync(descriptor, input, 0, inputSize, 0)
    return input
  } finally {
    fs.closeSync(descriptor)
  }
}

export default imageSize
export function imageSize(input: string): ISizeCalculationResult
export function imageSize(input: string, callback: CallbackFn): void

/**
 * @param {string} input - relative/absolute path of the image file
 * @param {Function=} [callback] - optional function for async detection
 */
export function imageSize(
  input: string,
  callback?: CallbackFn
): ISizeCalculationResult | void {
  // resolve the file path
  const filepath = path.resolve(input)
  if (typeof callback === 'function') {
    queue.push(() =>
      readFileAsync(filepath)
        .then((input) => process.nextTick(callback, null, lookup(input)))
        .catch(callback)
    )
  } else {
    const input = readFileSync(filepath)
    return lookup(input)
  }
}
export const setConcurrency = (c: number): void => {
  queue.concurrency = c
}
