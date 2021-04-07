import toAscii from '../../specs/toAscii';
import readJpgBlockLength from '../../src/types/readJpgBlockLength';
import locateZeroTerminator from '../../src/types/locateZeroTerminator'
import { readUInt16BE, readUInt32BE } from '../../src/readUInt';
import findNonZeroCharacter from '../../src/types/findNonZeroCharacter';

// import imageSize from '../src/index';
// import detector from '../src/detectType';
import setupView from '../../specs/setupView'
// import validateJPG from '../src/types/validateJPG';


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

    test.skip('getBlockLength', () => {
      // skip 4 bytes 
      let offset = 0
      const firstMarker = readUInt16BE(view, offset);
      expect(firstMarker).toBe(0xffd8); // SOI - always
      offset += 2;

      const secondMarker = readUInt16BE(view, offset);
      expect(secondMarker).toBe(markerValue); // APP1

      // https://bitmiracle.github.io/libjpeg.net/help/articles/KB/special-markers.html
      // at most Keep in mind that at most 65533 bytes can be put into one marker, but you can have as many markers as you like.      

      // https://en.wikipedia.org/wiki/JPEG
      // (The length includes the two bytes for the length, but not the two bytes for the marker.)

      offset += 2;
      // length of marker from len position HERE

      const blockLength = readJpgBlockLength(view, offset);
      expect(blockLength).toEqual(4)

      let markerOffset = offset + 2;
      const identiferEnd = locateZeroTerminator(view, markerOffset, blockLength);
      const identifier = toAscii(view, markerOffset, identiferEnd);
      expect(identifier).toBe(markerId);

      // match identifier with second marker => solution
        // APP1 with EXIF 
        // APP0 with JFIF
        // APP0 with JFXX
        // else skip

      markerOffset = findNonZeroCharacter(view, identiferEnd, blockLength);
      // PROBABLY SKIP THESE SECTIONS
      const majorVersion = view.getUint8(markerOffset);
      markerOffset += 1;
      const minorVersion = view.getUint8(markerOffset);
      markerOffset += 1;
      const densityUnits = view.getUint8(markerOffset);
      markerOffset += 1;
      const xDensity = readUInt16BE(view, offset);
      markerOffset += 2;
      const yDensity = readUInt16BE(view, offset);
      markerOffset += 2;
      const xThumbnail = view.getUint8(markerOffset);
      markerOffset += 1;
      const yThumbnail = view.getUint8(markerOffset);
      markerOffset += 1;

      // uncompressed 24bit-color thumbnail r0, g0, b0 .. ... Rn-1, Gn-1, Bn-1
      const thumbnailSize = 3 * xThumbnail * yThumbnail 
      markerOffset += thumbnailSize;

      // next marker please
      offset += blockLength;
      const thirdMarker = readUInt16BE(view, offset);
      expect(thirdMarker).toBe(0xffc0);
    })
})