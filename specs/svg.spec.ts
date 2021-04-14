import imageSize from '../src/index';
import toAscii from './toAscii';
import detector from '../src/detectImageType';
import setupView from './setupView'

describe('svg test files', () => {
  // Inputs - fileName, path, 
  // Outputs - ... imageType, dims
  type SVGTestElement = [
    testFilePath: string,
    bufferSize: number,
    imageType: string,
    result: any,
  ]

  const testCases: SVGTestElement[]  = [
    [
      "specs/images/valid/svg/exponent-width-height.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/ignore-stroke-width.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/percentage.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/single-quotes.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/units-inches.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-height.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-lowercase.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-units.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-width-height-brackets.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-width-height.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox-width.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/viewbox.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
    [
      "specs/images/valid/svg/width-height.svg",
      1024,
      "svg",
      {type: 'svg', width: 123, height: 456}
    ],
  ];

  describe.each(testCases)('%s', (testFilePath, bufferSize, imageType, expected) => {
    test('imageType', () => {
      const view = setupView(testFilePath, bufferSize);
      const type = detector(view, toAscii);
      expect(type).toBe(imageType)
    })

    describe('result', () => {
      const view = setupView(testFilePath, bufferSize);
      const actual = imageSize(view, toAscii);
      test('width', () => {
        expect(actual.width).toEqual(expected.width)
      })
      test('height', () => {
        expect(actual.height).toEqual(expected.height)
      })
      test('type', () => {
        expect(actual.type).toEqual(expected.type)
      })
    })
  })

})