export interface ISize {
  width: number | undefined
  height: number | undefined
  orientation?: number | undefined
  type?: string
}

export interface ISizes {
  result: ISize[]
  type?: string
}

export interface IImage {
  validate: (buffer: Buffer) => boolean
  calculate: (buffer: Buffer, filepath?: string) => ISize | ISizes | undefined
}
