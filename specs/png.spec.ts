import imageSize from '../src/index';
import toAscii from './toAscii';
import detector from '../src/detectType';
import setupView from './setupView'

describe.skip('png mjs test files', () => {
  // Inputs - fileName, path, 
  // Outputs - ... imageType, dims
  type TestElement = [
    testFilePath: string,
    imageType: string,
    result: any,
  ]

  const testCases: TestElement[]  = [
    [
      'specs/images/valid/png/sample.png',
      'png', 
      {type: 'png', width: 123, height: 456}
    ],
    [
      'specs/images/valid/png/sample_fried.png',
      'png',
       {type: 'png', width: 128, height: 68}
    ],
  ];

  describe.each(testCases)('%s', (testFilePath, imageType, expected) => {
    const view = setupView(testFilePath, 1024);

    test('imageType', () => {
      const type = detector(view, toAscii);
      expect(type).toBe(imageType)
    })

    describe('result', () => {
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