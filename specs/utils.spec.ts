import { describe, it } from 'node:test'
import * as assert from 'node:assert'
import {
  toUTF8String,
  toHexString,
  readInt16LE,
  readUInt16BE,
  readUInt16LE,
  readUInt24LE,
  readInt32LE,
  readUInt32BE,
  readUInt32LE,
  readUInt,
  findBox,
  readUInt64,
  boyerMoore,
} from '../lib/types/utils'

describe('Utils', () => {
  describe('toUTF8String', () => {
    it('should convert Uint8Array to UTF8 string', () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      assert.equal(toUTF8String(input), 'Hello')
    })

    it('should handle substring conversion with start and end', () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      assert.equal(toUTF8String(input, 1, 4), 'ell')
    })
  })

  describe('toHexString', () => {
    it('should convert Uint8Array to hex string', () => {
      const input = new Uint8Array([255, 0, 16])
      assert.equal(toHexString(input), 'ff0010')
    })

    it('should handle substring conversion with start and end', () => {
      const input = new Uint8Array([255, 0, 16])
      assert.equal(toHexString(input, 1, 2), '00')
    })
  })

  describe('Integer reading functions', () => {
    it('readInt16LE should read 16-bit signed integer (little-endian)', () => {
      const input = new Uint8Array([255, 255]) // -1 in 16-bit signed
      assert.equal(readInt16LE(input), -1)
    })

    it('readUInt16BE should read 16-bit unsigned integer (big-endian)', () => {
      const input = new Uint8Array([1, 0]) // 256 in big-endian
      assert.equal(readUInt16BE(input), 256)
    })

    it('readUInt16LE should read 16-bit unsigned integer (little-endian)', () => {
      const input = new Uint8Array([0, 1]) // 256 in little-endian
      assert.equal(readUInt16LE(input), 256)
    })

    it('readUInt24LE should read 24-bit unsigned integer (little-endian)', () => {
      const input = new Uint8Array([1, 1, 1]) // 65793 in little-endian
      assert.equal(readUInt24LE(input), 65793)
    })

    it('readInt32LE should read 32-bit signed integer (little-endian)', () => {
      const input = new Uint8Array([255, 255, 255, 255]) // -1 in 32-bit signed
      assert.equal(readInt32LE(input), -1)
    })

    it('readUInt32BE should read 32-bit unsigned integer (big-endian)', () => {
      const input = new Uint8Array([0, 0, 1, 0]) // 256 in big-endian
      assert.equal(readUInt32BE(input), 256)
    })

    it('readUInt32LE should read 32-bit unsigned integer (little-endian)', () => {
      const input = new Uint8Array([0, 1, 0, 0]) // 256 in little-endian
      assert.equal(readUInt32LE(input), 256)
    })
  })

  describe('readUInt', () => {
    it('should read 16-bit unsigned integer with different endianness', () => {
      const input = new Uint8Array([1, 0])
      assert.equal(readUInt(input, 16, 0, true), 256) // big-endian
      assert.equal(readUInt(input, 16, 0, false), 1) // little-endian
    })

    it('should read 32-bit unsigned integer with different endianness', () => {
      const input = new Uint8Array([0, 0, 1, 0])
      assert.equal(readUInt(input, 32, 0, true), 256) // big-endian
      assert.equal(readUInt(input, 32, 0, false), 65536) // little-endian
    })
  })

  describe('readUInt64', () => {
    it('should read zero correctly in both endianness', () => {
      const input = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])
      assert.equal(readUInt64(input, 0, true), 0n) // BE
      assert.equal(readUInt64(input, 0, false), 0n) // LE
    })

    it('should read 2^32 in big-endian', () => {
      // 2^32 = 4294967296 = 0x0000000100000000
      const input = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0])
      assert.equal(readUInt64(input, 0, true), 4294967296n)
    })

    it('should read 2^32 in little-endian', () => {
      // 2^32 = 4294967296 = 0x0000000100000000
      const input = new Uint8Array([0, 0, 0, 0, 1, 0, 0, 0])
      assert.equal(readUInt64(input, 0, false), 4294967296n)
    })

    it('should read max uint64 value in both endianness', () => {
      // max uint64 = 2^64 - 1 = 18446744073709551615
      const input = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255])
      const expected = 18446744073709551615n
      assert.equal(readUInt64(input, 0, true), expected) // BE
      assert.equal(readUInt64(input, 0, false), expected) // LE
    })
  })

  describe('findBox', () => {
    it('should find box by name in Uint8Array', () => {
      // Create a mock box structure: size (4 bytes) + name (4 bytes)
      const boxSize = new Uint8Array([0, 0, 0, 8]) // 8 bytes total
      const boxName = new Uint8Array([116, 101, 115, 116]) // "test"
      const input = new Uint8Array([...boxSize, ...boxName])

      const result = findBox(input, 'test', 0)
      assert.deepEqual(result, {
        name: 'test',
        offset: 0,
        size: 8,
      })
    })

    it('should return undefined when box is not found', () => {
      const input = new Uint8Array([0, 0, 0, 8, 116, 101, 115, 116])
      const result = findBox(input, 'none', 0)
      assert.equal(result, undefined)
    })

    it('should handle incomplete box data', () => {
      const input = new Uint8Array([0, 0]) // Too short to be a valid box
      const result = findBox(input, 'test', 0)
      assert.equal(result, undefined)
    })

    it('should handle box size larger than remaining input', () => {
      // Create a box with size larger than the actual data
      // First 4 bytes indicate a size of 100, but array is only 8 bytes long
      const boxSize = new Uint8Array([0, 0, 0, 100]) // Size of 100 bytes
      const boxName = new Uint8Array([116, 101, 115, 116]) // "test"
      const input = new Uint8Array([...boxSize, ...boxName])

      const result = findBox(input, 'test', 0)
      assert.equal(result, undefined)
    })
  })

  describe('boyerMoore', () => {
    it('should find needle in haystack', () => {
      const needle = new Uint8Array([1, 2, 3])
      const haystack = new Uint8Array([0, 1, 2, 3, 4])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), 1)
    })

    it('should return -1 when needle is not found', () => {
      const needle = new Uint8Array([5, 6, 7])
      const haystack = new Uint8Array([0, 1, 2, 3, 4])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), -1)
    })

    it('should handle needle longer than haystack', () => {
      const needle = new Uint8Array([1, 2, 3, 4])
      const haystack = new Uint8Array([1, 2])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), -1) // Needle cannot be found in shorter haystack
    })

    it('should handle haystack with needle at the start', () => {
      const needle = new Uint8Array([1, 2])
      const haystack = new Uint8Array([1, 2, 3, 4])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), 0) // Needle found at index 0
    })

    it('should handle needle at the end of haystack', () => {
      const needle = new Uint8Array([3, 4])
      const haystack = new Uint8Array([1, 2, 3, 4])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), 2) // Needle found at index 2
    })

    it('should handle multiple occurrences of needle in haystack', () => {
      const needle = new Uint8Array([1, 2])
      const haystack = new Uint8Array([0, 1, 2, 0, 1, 2])
      const search = boyerMoore(needle)
      assert.equal(search(haystack), 1) // First occurrence found at index 1
    })

    it('should handle large haystack and needle', () => {
      const encoder = new TextEncoder()
      const needle = encoder.encode('<svg')
      const start = '<?xml version="1.0" encoding="utf-8"?>'
      const largeComment = new Array(1000).fill('<!-- comment -->').join('\n')
      const haystack = encoder.encode(`${start}${largeComment}<svg`)
      const search = boyerMoore(needle)
      assert.equal(search(haystack), start.length + largeComment.length) // Needle found after the XML declaration and comments
    })
  })
})
