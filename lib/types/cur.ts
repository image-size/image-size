import type { IImage } from './interface'
import { ICO } from './ico'

const TYPE_CURSOR = 2
export const CUR: IImage = {
  validate(dataView) {
    const reserved = dataView.getUint16(0, true)
    const imageCount = dataView.getUint16(4, true)
    if (reserved !== 0 || imageCount === 0) return false

    const imageType = dataView.getUint16(2, true)
    return imageType === TYPE_CURSOR
  },

  calculate: (dataView, input) => ICO.calculate(dataView, input),
}
