import type { IImage } from './interface'

export const BMP: IImage = {
  validate: (dataView) => dataView.getInt16(0) === 0x424d,

  calculate: (dataView) => ({
    height: Math.abs(dataView.getInt32(22, true)),
    width: dataView.getUint32(18, true),
  }),
}
