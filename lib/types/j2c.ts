import type { IImage } from './interface'

export const J2C: IImage = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (dataView) => dataView.getInt32(0) === 0xff4fff51,

  calculate: (dataView) => ({
    height: dataView.getUint32(12),
    width: dataView.getUint32(8),
  }),
}
