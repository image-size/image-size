import type { IImage } from './interface'

export const DDS: IImage = {
  validate: (dataView) => dataView.getInt32(0, true) === 0x20534444,

  calculate: (dataView) => ({
    height: dataView.getInt32(12, true),
    width: dataView.getInt32(16, true),
  }),
}
