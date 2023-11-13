import type { IImage } from './interface'

export const TGA: IImage = {
  validate(dataView) {
    return dataView.getUint16(0, true) === 0 && dataView.getUint16(4, true) === 0
  },

  calculate(dataView) {
    return {
      height: dataView.getUint16(14, true),
      width: dataView.getUint16(12, true),
    }
  },
}
