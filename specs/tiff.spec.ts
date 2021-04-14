import { 
  detectImageType,
  isTiffBigEndian
 } from '../src/index';
import toAscii from './toAscii';
import setupView from './setupView';
import { TIFF } from '../src/types/tiff';
import type { TiffTagLookup } from '../src/types/tiffHelpers';
import viewTiffImage from '../src/viewTiffImage';
import { 
  getIdfOffset, 
  beginIndexForIdf,
  getNoOfIdfEntries,
  endIndexForIdf,
  getStrideForIdf,
  extractIdfEntry
} from '../src/types/tiffHelpers'

describe('tiff file test', () => {
  type TiffTestElement = [
    testFilePath: string,
    bufferSize: number,
    imageType: string,
    isBigEndian: boolean,
    idfOffset: number,
    noOfEntries: number,
    result: any,
  ]

  const testCases: TiffTestElement[]  = [
    [
      "specs/images/valid/tiff/big-endian.tiff",
      1024,
      "tiff",
      true,
      224360,
      17,
      {type: 'tiff', width: 123, height: 456}
    ],
    [
      "specs/images/valid/tiff/jpeg.tiff",
      4096,
      "tiff",
      false,
      33416,
      18,
      {type: 'tiff', width: 123, height: 456}
    ],
    [
      "specs/images/valid/tiff/little-endian.tiff",
      4096,
      "tiff",
      false,
      157220,
      17,
      {type: 'tiff', width: 123, height: 456}
    ],
  ]

  describe.each(testCases)('%s', (testFilePath, bufferSize, imageType, isBigEndian, idfOffset, noOfEntries, expected) => {
    test('imageType', () => {
      const view = setupView(testFilePath, bufferSize);
      const type = detectImageType(view, toAscii);
      expect(type).toBe(imageType)
    })

    test('validate', () => {
      const view = setupView(testFilePath, bufferSize);
      const actual = TIFF.validate(view, toAscii);
      expect(actual).toEqual(true);
    })

    test('isBigEndian', () => {
      const view = setupView(testFilePath, 1024);
      const actual = isTiffBigEndian(view, toAscii, 0);
      expect(actual).toEqual(isBigEndian);
    })

    test('isOffset', () => {
      const view = setupView(testFilePath, 1024);
      const actual = getIdfOffset(view, isBigEndian);
      expect(actual).toEqual(idfOffset);
    })

    test('noOfEntries', () => {
      const tags: TiffTagLookup = {}
      const view = setupView(testFilePath, 1024, idfOffset);
      
      const actual = getNoOfIdfEntries(view, 0, isBigEndian);

      expect(actual).toEqual(noOfEntries);
    });

    describe('single loop', () => {
      const tags: TiffTagLookup = {}
      const view = setupView(testFilePath, 1024, idfOffset);
      
      const doLoop  = () => {
        const zeroOffset = 0
        const begin = beginIndexForIdf(zeroOffset);
        const end = endIndexForIdf(zeroOffset, noOfEntries);
        const stride = getStrideForIdf();

        for (let i = begin; i < end; i += stride) {
          extractIdfEntry(tags, view, i, isBigEndian);
        }
      }
      
      test('loop no throw', () => {
        expect(doLoop).not.toThrow();
      })
    });

    const adjustView = (position: number, minimumSize: number): DataView => {
      return setupView(testFilePath, 1024, position);
    }

    describe('full loop', () => {
      const doLoop  = () => {
        viewTiffImage(isBigEndian, adjustView);
      }
      
      test('loop no throw', () => {
        expect(doLoop).not.toThrow();
      })
    })

    describe('result', () => {
      const actual = viewTiffImage(isBigEndian, adjustView);
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