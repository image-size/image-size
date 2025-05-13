export class ImageSizeInfoOutOfBoundsError extends Error {
  requiredStartOffset: number

  constructor(message: string, requiredStartOffset: number) {
    super(message)
    this.name = 'ImageSizeInfoOutOfBoundsError'
    this.requiredStartOffset = requiredStartOffset
    Object.setPrototypeOf(this, ImageSizeInfoOutOfBoundsError.prototype)
  }
}
