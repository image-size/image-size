import * as fs from 'node:fs'
import * as path from 'node:path'

import { imageSize } from './lookup'
import type { ISizeCalculationResult } from './types/interface'

// Default maximum input size is 512 kilobytes.
const DefaultMaxInputSize = 512 * 1024

type Job = {
  filePath: string
  maxInputSize: number
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
  const promises = jobs.map(
    async ({ filePath, maxInputSize, resolve, reject }) => {
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
        // TO-DO: make this adaptive based on the initial signature of the image
        const inputSize = Math.min(size, maxInputSize)
        const input = new Uint8Array(inputSize)
        await handle.read(input, 0, inputSize, 0)
        resolve(imageSize(input))
      } catch (err) {
        reject(err as Error)
      } finally {
        await handle.close()
      }
    },
  )

  await Promise.allSettled(promises)

  if (queue.length) setTimeout(processQueue, 100)
}

/**
 * @param {string} filePath - relative/absolute path of the image file
 * @param {number} maxInputSize - maximum input size, with a default of 512 kilobytes.
 */
export const imageSizeFromFile = async (
  filePath: string,
  maxInputSize: number = DefaultMaxInputSize,
) =>
  new Promise<ISizeCalculationResult>((resolve, reject) => {
    queue.push({ filePath, maxInputSize, resolve, reject })
    processQueue()
  })
