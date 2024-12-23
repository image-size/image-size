import * as assert from 'node:assert'
import { describe, it } from 'node:test'

import { BitReader } from '../lib/utils/bit-reader'

describe('BitReader', () => {
  describe('Big-endian mode', () => {
    it('should read single bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      assert.equal(reader.getBits(), 1)
      assert.equal(reader.getBits(), 0)
      assert.equal(reader.getBits(), 1)
      assert.equal(reader.getBits(), 0)
    })

    it('should read multiple bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      assert.equal(reader.getBits(3), 0b101)
      assert.equal(reader.getBits(5), 0b01010)
      assert.equal(reader.getBits(8), 0b11001100)
    })

    it('should handle reading across byte boundaries', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')

      assert.equal(reader.getBits(12), 0b101010101100)
      assert.equal(reader.getBits(12), 0b110000110011)
    })

    it('should throw an error when reaching end of input', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'big-endian')

      assert.throws(() => reader.getBits(9), /Reached end of input/)
    })
  })

  describe('Little-endian mode', () => {
    it('should read single bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'little-endian')

      assert.equal(reader.getBits(), 0)
      assert.equal(reader.getBits(), 1)
      assert.equal(reader.getBits(), 0)
      assert.equal(reader.getBits(), 1)
    })

    it('should read multiple bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'little-endian')

      assert.equal(reader.getBits(3), 0b010)
      assert.equal(reader.getBits(5), 0b10101)
      assert.equal(reader.getBits(8), 0b11001100)
    })

    it('should handle reading across byte boundaries', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'little-endian')

      assert.equal(reader.getBits(12), 0b110010101010)
      assert.equal(reader.getBits(12), 0b001100111100)
    })

    it('should throw an error when reaching end of input', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'little-endian')

      assert.throws(() => reader.getBits(9), /Reached end of input/)
    })
  })

  describe('Byte offset handling', () => {
    it('should start reading from the third byte by default', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      assert.equal(reader.getBits(8), 0b10101010)
    })
  })

  describe('Edge cases', () => {
    it('should handle reading 0 bits', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'big-endian')
      assert.equal(reader.getBits(0), 0)
    })

    it('should handle reading all bits from input', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')
      assert.equal(reader.getBits(16), 0b1010101011001100)
      assert.throws(() => reader.getBits(1), /Reached end of input/)
    })

    it('should handle reading bits at byte boundary', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')
      assert.equal(reader.getBits(8), 0b10101010)
      assert.equal(reader.getBits(8), 0b11001100)
    })

    it('should handle reading bits across multiple bytes', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')
      assert.equal(reader.getBits(20), 0b10101010110011000011)
    })

    it('should handle alternating between small and large bit reads', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')
      assert.equal(reader.getBits(3), 0b101)
      assert.equal(reader.getBits(10), 0b0101011001)
      assert.equal(reader.getBits(2), 0b10)
      assert.equal(reader.getBits(9), 0b000110011)
    })
  })
})
