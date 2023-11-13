import type { IImage } from './interface'

export const PSD: IImage = {
  validate: (dataView) => dataView.getInt32(0) === 0x38425053,

  calculate: (dataView) => ({
    height: dataView.getUint32(14),
    width: dataView.getUint32(18),
  }),
}
