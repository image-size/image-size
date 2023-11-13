import type { IImage } from './interface'

export const GIF: IImage = {
  validate: (dataView) => dataView.getInt32(0) === 0x47494638 &&
  [0x3761, 0x3961].includes(dataView.getInt16(4)),

  calculate: (dataView) => ({
    height: dataView.getUint16(8, true),
    width: dataView.getUint16(6, true),
  }),
}
