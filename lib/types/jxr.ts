import type { IImage } from './interface'
import { readUInt32BE } from './utils'

export const JXR: IImage = {
  validate: (input) => readUInt32BE(input, 0) === 0x4949BC01,

  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8),
  }),
}
