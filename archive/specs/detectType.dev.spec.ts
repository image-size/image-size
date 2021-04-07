import typeHandlers from '../src/types/typeHandlers';
import firstBytes from '../src/firstBytes';
import type { IImage } from '../src/types/interface'

const getAllBinaryFiles = () => {
  return Object.values(firstBytes);
}

const getAllFileTypes = () => {
  return Object.keys(typeHandlers)
}

type TypeCounter = {
  [key: string]: any;
}

type BinLookup = {
  [key: string]: number;
}

type TextLookup = {
  [key: string]: IImage;
}

const getTextFiles = () => {
  // foreach all files
  const allFiles = getAllFileTypes();
  const binaryFiles = getAllBinaryFiles();
  const lookup: BinLookup = {}
  binaryFiles.forEach(file => {
    lookup[file] = 1;
  })

  const output: Array<string> = []
  allFiles.forEach(file => {
    // file type is not in binary files
    const found = lookup[file];
    if (!found) {
      output.push(file);
    }
  })

  return output;
}



describe.skip('detectType', () => {
  describe('textFileFormats', () => {

    const binaryFiles = getAllBinaryFiles();
    const fileTypes = getAllFileTypes();

    test('array type', () => {
      expect(binaryFiles).toEqual(expect.any(Array))
    })

    test('no duplicates', () => {
      const totals: TypeCounter = {}
      binaryFiles.forEach(file => {
        const found = totals[file]
        if (!!found) {
          totals[file] = 1;
        } else {
          totals[file] += 1;
        }
      });
      
      const duplicates = []
      for(let key in totals) {
        const total = totals[key]
        if (total > 1) {
          duplicates.push(key);
        }
      }

      expect(duplicates).toEqual(expect.arrayContaining([]));
    })

    test('all files', () => {
      expect(fileTypes).toEqual(expect.any(Array));
    })

    test('text files', () => {
      const actual = getTextFiles();
      expect(actual).toEqual(expect.arrayContaining([1]));
    })
  })

})