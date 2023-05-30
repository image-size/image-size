export type ISize = {
  width: number | undefined
  height: number | undefined
  orientation?: number
  type?: string
}

export type ISizeCalculationResult = {
  images?: ISize[]
} & ISize

export type IImage = {
  validate: (buffer: Buffer) => boolean
  calculate: (buffer: Buffer, filepath?: string) => ISizeCalculationResult
}
