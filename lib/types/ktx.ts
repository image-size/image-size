import type { IImage } from './interface'
import { toUTF8String } from './utils'

export const KTX: IImage = {
  validate: (dataView, input) => toUTF8String(input, 1, 7) === 'KTX 11',

  calculate: (dataView) => ({
    height: dataView.getInt32(40, true),
    width: dataView.getInt32(36, true),
  }),
}
