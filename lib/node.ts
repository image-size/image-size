import * as fs from 'node:fs'
import * as path from 'node:path'

import { lookup } from './lookup'
import type { ISizeCalculationResult } from './types/interface'

// Maximum input size, with a default of 512 kilobytes.
// TO-DO: make this adaptive based on the initial signature of the image
const MaxInputSize = 512 * 1024

type Job = {
  filePath: string
  resolve: (value: ISizeCalculationResult) => void
}

// This queue is for async `fs` operations, to avoid reaching file-descriptor limits
const queue: Job[] = []

let concurrency = 3
export const setConcurrency = (c: number): void => {
  concurrency = c
}

const processQueue = async () => {
  const jobs = queue.splice(0, concurrency)
  const promises = jobs.map(async ({ filePath, resolve }) => {
    const handle = await fs.promises.open(path.resolve(filePath), 'r')
    await new Promise((r) => setTimeout(r, 1000))
    try {
      const { size } = await handle.stat()
      if (size <= 0) {
        throw new Error('Empty file')
      }
      const inputSize = Math.min(size, MaxInputSize)
      const input = new Uint8Array(inputSize)
      await handle.read(input, 0, inputSize, 0)
      resolve(lookup(input))
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
export const imageSize = async (filePath: string) =>
  new Promise<ISizeCalculationResult>((resolve) => {
    queue.push({ filePath, resolve })
    processQueue()
  })
