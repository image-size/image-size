import { ImageFormat } from '.'

export interface ISizeCalculationResult {
  width: number
  height: number
  orientation?: number
  type: ImageFormat
  images?: ISize[]
}

export interface IImageCalculationResult
  extends Omit<ISizeCalculationResult, 'type'> {
  type?: ImageFormat
}

export type ISize = Omit<IImageCalculationResult, 'images'>

export interface IImage {
  validate: (input: Uint8Array) => boolean
  calculate: (input: Uint8Array) => IImageCalculationResult
}
