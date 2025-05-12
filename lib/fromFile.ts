import * as fs from 'node:fs'
import * as path from 'node:path'

import { imageSize } from './lookup'
import type { ISizeCalculationResult } from './types/interface'
import { ImageSizeInfoOutOfBoundsError } from './utils/customErrors'

// Default maximum input size is 512 kilobytes.
const DefaultMaxInputSize = 512 * 1024

type Job = {
  filePath: string
  resolve: (value: ISizeCalculationResult) => void
  reject: (error: Error) => void
}

// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue: Job[] = []

let concurrency = 100
export const setConcurrency = (c: number): void => {
  concurrency = c
}

const processQueue = async () => {
  const jobs = queue.splice(0, concurrency)
  const promises = jobs.map(async ({ filePath, resolve, reject }) => {
    let handle: fs.promises.FileHandle
    try {
      handle = await fs.promises.open(path.resolve(filePath), 'r')
    } catch (err) {
      return reject(err as Error)
    }
    try {
      const { size } = await handle.stat()
      if (size <= 0) {
        throw new Error('Empty file')
      }
      const inputSize = Math.min(size, DefaultMaxInputSize)
      const input = new Uint8Array(inputSize)
      await handle.read(input, 0, inputSize, 0)
      try {
        resolve(imageSize(input))
      } catch (err) {
        // If the image size information was outside of the originally read part of the file, re-attempt using an extended input buffer.
        if (err instanceof ImageSizeInfoOutOfBoundsError) {
          const input = new Uint8Array(size)
          const inputStart = Math.min(size, err.newOffset)
          const inputSize = Math.min(size, err.newOffset + DefaultMaxInputSize)
          await handle.read(input, 0, inputSize, 0)
          resolve(imageSize(input))
        }
      }
    } catch (err) {
      reject(err as Error)
    } finally {
      await handle.close()
    }
  })

  await Promise.allSettled(promises)

  if (queue.length) setTimeout(processQueue, 100)
}

/**
 * @param {string} filePath - relative/absolute path of the image file
 */
export const imageSizeFromFile = async (filePath: string) =>
  new Promise<ISizeCalculationResult>((resolve, reject) => {
    queue.push({ filePath, resolve, reject })
    processQueue()
  })
