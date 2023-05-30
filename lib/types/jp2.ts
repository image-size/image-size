import type { IImage, ISize } from './interface'
import { toHexString, toUTF8String, readUInt32BE, readUInt16BE } from './utils'

const BoxTypes = {
  ftyp: '66747970',
  ihdr: '69686472',
  jp2h: '6a703268',
  jp__: '6a502020',
  rreq: '72726571',
  xml_: '786d6c20',
}

const calculateRREQLength = (box: Uint8Array): number => {
  const unit = box[0]
  let offset = 1 + 2 * unit
  const numStdFlags = readUInt16BE(box, offset)
  const flagsLength = numStdFlags * (2 + unit)
  offset = offset + 2 + flagsLength
  const numVendorFeatures = readUInt16BE(box, offset)
  const featuresLength = numVendorFeatures * (16 + unit)
  return offset + 2 + featuresLength
}

const parseIHDR = (box: Uint8Array): ISize => {
  return {
    height: readUInt32BE(box, 4),
    width: readUInt32BE(box, 8),
  }
}

export const JP2: IImage = {
  validate(input) {
    const signature = toHexString(input, 4, 8)
    const signatureLength = readUInt32BE(input, 0)
    if (signature !== BoxTypes.jp__ || signatureLength < 1) {
      return false
    }

    const ftypeBoxStart = signatureLength + 4
    const ftypBoxLength = readUInt32BE(input, signatureLength)
    const ftypBox = input.slice(ftypeBoxStart, ftypeBoxStart + ftypBoxLength)
    return toHexString(ftypBox, 0, 4) === BoxTypes.ftyp
  },

  calculate(input) {
    const signatureLength = readUInt32BE(input, 0)
    const ftypBoxLength = readUInt16BE(input, signatureLength + 2)
    let offset = signatureLength + 4 + ftypBoxLength
    const nextBoxType = toHexString(input, offset, offset + 4)
    switch (nextBoxType) {
    case BoxTypes.rreq:
      // WHAT ARE THESE 4 BYTES?????
      // eslint-disable-next-line no-case-declarations
      const MAGIC = 4
      offset =
          offset + 4 + MAGIC + calculateRREQLength(input.slice(offset + 4))
      return parseIHDR(input.slice(offset + 8, offset + 24))
    case BoxTypes.jp2h:
      return parseIHDR(input.slice(offset + 8, offset + 24))
    default:
      throw new TypeError(
        'Unsupported header found: ' + toUTF8String(input, offset, offset + 4)
      )
    }
  },
}
