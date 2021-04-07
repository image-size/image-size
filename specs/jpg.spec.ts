import imageSize from '../src/index';
import toAscii from './toAscii';
import detector from '../src/detectType';
import setupView from './setupView'
import validateJPG from '../src/types/validateJPG';

describe('jpg test files', () => {
  // Inputs - fileName, path, 
  // Outputs - ... imageType, dims
  type TestElement = [
    testFilePath: string,
    bufferSize: number,
    imageType: string,
    markerValue: number,
    markerId: string,
    result: any,
  ]

  const testCases: TestElement[]  = [
    [
      'specs/images/valid/jpg/1x2-flipped-big-endian.jpg',
      1024,
      'jpg', 
      0xffe0,
      'JFIF',
      {type: 'jpg', width: 1, height: 2}
    ],
    [
      'specs/images/valid/jpg/1x2-flipped-little-endian.jpg',
      1024,
      'jpg',
      0xffe0,
      'JFIF',       
      {type: 'jpg', width: 1, height: 2}
    ],    
    [
      'specs/images/valid/jpg/large.jpg',
      8192,
      'jpg', 
      0xffe0,
      'JFIF',
      {type: 'jpg', width: 1600, height: 1200}
    ],    
    [
      'specs/images/valid/jpg/optimized.jpg',
      1024,
      'jpg',
      0xffe0,
      'JFIF',    
      {type: 'jpg', width: 123, height: 456}
    ],    
    [
      'specs/images/valid/jpg/progressive.jpg',
      1024,
      'jpg', 
      0xffe0,
      'JFIF',        
      {type: 'jpg', width: 123, height: 456}
    ],
    [
      'specs/images/valid/jpg/sample.jpg',
      1024,      
      'jpg', 
      0xffe0,
      'JFIF',        
      {type: 'jpg', width: 123, height: 456}
    ],
    [
      'specs/images/valid/jpg/sampleExported.jpg',
      2048,
      'jpg', 
      0xffe0,
      'JFIF',      
      {type: 'jpg', width: 123, height: 456}
    ],
    [
      'specs/images/valid/jpg/very-large.jpg',
      8192,
      'jpg', 
      0xffe0,
      'JFIF',      
      {type: 'jpg', width: 4800, height: 3600}
    ],    

  ];

  describe.each(testCases)('%s', (testFilePath, bufferSize, imageType, markerValue, markerId, expected) => {
    const view = setupView(testFilePath, bufferSize);

    test('firstByte', () => {
      const firstByte = view.getUint8(0);
      expect(firstByte).toBe(0xff);
    })

    test('marker-0', () => {
      const actual = validateJPG(view);
      expect(actual).toEqual('ffd8');
    })

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