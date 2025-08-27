import type { IImage, ISize } from './interface'
import { boyerMoore, toUTF8String } from './utils'

interface IAttributes {
  width: number | null
  height: number | null
  viewbox?: IAttributes | null
}

const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: /<svg\s([^>"']|"[^"]*"|'[^']*')*>/,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/,
}

const INCH_CM = 2.54
const units: Record<string, number> = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: (96 / INCH_CM) * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1,
}

const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join('|')})?$`,
)

function parseLength(len: string) {
  const m = unitsReg.exec(len)
  if (!m) {
    return undefined
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1))
}

function parseViewbox(viewbox: string): IAttributes {
  const bounds = viewbox.split(' ')
  return {
    height: parseLength(bounds[3]) as number,
    width: parseLength(bounds[2]) as number,
  }
}

function parseAttributes(root: string): IAttributes {
  const width = root.match(extractorRegExps.width)
  const height = root.match(extractorRegExps.height)
  const viewbox = root.match(extractorRegExps.viewbox)
  return {
    height: height && (parseLength(height[2]) as number),
    viewbox: viewbox && (parseViewbox(viewbox[2]) as IAttributes),
    width: width && (parseLength(width[2]) as number),
  }
}

function calculateByDimensions(attrs: IAttributes): ISize {
  return {
    height: attrs.height as number,
    width: attrs.width as number,
  }
}

function calculateByViewbox(attrs: IAttributes, viewbox: IAttributes): ISize {
  const ratio = (viewbox.width as number) / (viewbox.height as number)
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width,
    }
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio),
    }
  }
  return {
    height: viewbox.height as number,
    width: viewbox.width as number,
  }
}

const encoder = new TextEncoder()

const findXmlStart = boyerMoore(encoder.encode('<?xml'))
const findDoctypeStart = boyerMoore(encoder.encode('<!DOCTYPE'))
const findSvgStart = boyerMoore(encoder.encode('<svg'))

type IImageWithSearchLimits = IImage & {
  /**
   * Defines how many bytes to search for specific markers,
   * customize these values in case of specific needs
   */
  searchLimits: {
    /**
     * Number of bytes to search for the XML header '<?xml'
     * when detecting XML files (slow path of SVG detection)
     * defaults to 10 bytes (to account for initial whitespace)
     */
    xmlStart: number
    /**
     * Number of bytes to search for the XML doctype '<!DOCTYPE'
     * when detecting XML files (slow path of SVG detection)
     * defaults to 60 bytes (to account for additional whitespace and XML header)
     */
    doctypeStart: number

    /**
     * Number of bytes to search for the SVG root element '<svg'
     * when detecting SVG files (fast path of SVG detection)
     * defaults to 180 bytes (to account for additional whitespace, XML header and doctype)
     */
    svgStart: number
  }
};

export const SVG: IImageWithSearchLimits = {
  searchLimits: {
    xmlStart: 10,
    doctypeStart: 60,
    svgStart: 180
  },

  validate(input) {
    // See https://github.com/image-size/image-size/issues/397

    // typical fast path: '<svg' in the first few bytes
    if (findSvgStart(input, SVG.searchLimits.svgStart) >= 0) {
      return true
    }

    // slower path: check if we detect an XML file and then to a full search
    // SVG is the only XML based format this lib supports, it should be an
    // acceptable performance hit if somebody provides non SVG XMLs
    if (
      findXmlStart(input, SVG.searchLimits.xmlStart) >= 0 ||
      findDoctypeStart(input, SVG.searchLimits.doctypeStart) >= 0
    ) {
      return findSvgStart(input) >= 0
    }

    return false
  },

  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root)
    if (root) {
      const attrs = parseAttributes(root[0])
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs)
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox)
      }
    }
    throw new TypeError('Invalid SVG')
  },
}
