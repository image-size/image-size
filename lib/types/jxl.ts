import type { IImage } from './interface'
import { readUInt32BE, readUInt16BE } from './utils'

export const JXL: IImage = {
  validate: (input) => readUInt16BE(input, 0) === 0xff0a,

  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8),
  }),
}
