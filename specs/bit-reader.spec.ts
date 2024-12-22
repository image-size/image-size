import { expect } from 'chai'
import { BitReader } from '../lib/utils/bit-reader'

describe('BitReader', () => {
  describe('Big-endian mode', () => {
    it('should read single bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      expect(reader.getBits()).to.equal(1)
      expect(reader.getBits()).to.equal(0)
      expect(reader.getBits()).to.equal(1)
      expect(reader.getBits()).to.equal(0)
    })

    it('should read multiple bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      expect(reader.getBits(3)).to.equal(0b101)
      expect(reader.getBits(5)).to.equal(0b01010)
      expect(reader.getBits(8)).to.equal(0b11001100)
    })

    it('should handle reading across byte boundaries', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')

      expect(reader.getBits(12)).to.equal(0b101010101100)
      expect(reader.getBits(12)).to.equal(0b110000110011)
    })

    it('should throw an error when reaching end of input', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'big-endian')

      expect(() => reader.getBits(9)).to.throw('Reached end of input')
    })
  })

  describe('Little-endian mode', () => {
    it('should read single bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'little-endian')

      expect(reader.getBits()).to.equal(0)
      expect(reader.getBits()).to.equal(1)
      expect(reader.getBits()).to.equal(0)
      expect(reader.getBits()).to.equal(1)
    })

    it('should read multiple bits correctly', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'little-endian')

      expect(reader.getBits(3)).to.equal(0b010)
      expect(reader.getBits(5)).to.equal(0b10101)
      expect(reader.getBits(8)).to.equal(0b11001100)
    })

    it('should handle reading across byte boundaries', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'little-endian')

      expect(reader.getBits(12)).to.equal(0b110010101010)
      expect(reader.getBits(12)).to.equal(0b001100111100)
    })

    it('should throw an error when reaching end of input', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'little-endian')

      expect(() => reader.getBits(9)).to.throw('Reached end of input')
    })
  })

  describe('Byte offset handling', () => {
    it('should start reading from the third byte by default', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')

      expect(reader.getBits(8)).to.equal(0b10101010)
    })
  })

  describe('Edge cases', () => {
    it('should handle reading 0 bits', () => {
      const input = new Uint8Array([0b10101010])
      const reader = new BitReader(input, 'big-endian')
      expect(reader.getBits(0)).to.equal(0)
    })

    it('should handle reading all bits from input', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')
      expect(reader.getBits(16)).to.equal(0b1010101011001100)
      expect(() => reader.getBits(1)).to.throw('Reached end of input')
    })

    it('should handle reading bits at byte boundary', () => {
      const input = new Uint8Array([0xff, 0xff, 0b10101010, 0b11001100])
      const reader = new BitReader(input, 'big-endian')
      expect(reader.getBits(8)).to.equal(0b10101010)
      expect(reader.getBits(8)).to.equal(0b11001100)
    })

    it('should handle reading bits across multiple bytes', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')
      expect(reader.getBits(20)).to.equal(0b10101010110011000011)
    })

    it('should handle alternating between small and large bit reads', () => {
      const input = new Uint8Array([
        0xff, 0xff, 0b10101010, 0b11001100, 0b00110011,
      ])
      const reader = new BitReader(input, 'big-endian')
      expect(reader.getBits(3)).to.equal(0b101)
      expect(reader.getBits(10)).to.equal(0b0101011001)
      expect(reader.getBits(2)).to.equal(0b10)
      expect(reader.getBits(9)).to.equal(0b000110011)
    })
  })
})
