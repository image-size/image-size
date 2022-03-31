import { IImage, toUTF8String, readUInt32BE } from './interface'

export const PSD: IImage = {
  validate: input => toUTF8String(input, 0, 4) === '8BPS',

  calculate: input => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
}
