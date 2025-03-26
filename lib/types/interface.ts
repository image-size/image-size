import { ImageFormat } from '.'

export interface ISize {
  width: number
  height: number
  orientation?: number
  type?: ImageFormat
}

export type IImageCalculationResult = {
  images?: ISize[]
} & ISize

export type ISizeCalculationResult = {
  type: ImageFormat
} & Omit<IImageCalculationResult, 'type'>

export interface IImage {
  validate: (input: Uint8Array) => boolean
  calculate: (input: Uint8Array) => IImageCalculationResult
}
