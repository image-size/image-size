import imageSize from '../lib'
import type { ISizeCalculationResult } from '../lib/types/interface'

// TODO: remove in 2.0
export const imageSizeFileAsync = (
  file: string,
): Promise<ISizeCalculationResult> =>
  new Promise<ISizeCalculationResult>((resolve, reject) =>
    imageSize(file, (e, r) => {
      if (e || !r) reject(e)
      else resolve(r)
    }),
  )
