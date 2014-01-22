require('../lib/patches');

var expect = require('expect.js');

describe('readBits', function () {

  // it('should read bits for offset 0', function () {
  //   var buffer = new Buffer([0x40, 0x20]);
  //   var expected = (((buffer[1] & 0x3F) << 8) | buffer[0]);
  //   var got = buffer.readBits(14);

  //   expect(got).to.equal(expected);
  //   expect(got).to.equal(8256);
  // });

  // it('should read bits for non-zero offset', function () {
  //   var buffer = new Buffer([0x2f, 0x7a, 0xc0, 0x71, 0x00]);
  //   var expected = (((buffer[2] & 0x3F) << 8) | buffer[1]);
  //   var got = buffer.readBits(14, 8);

  //   expect(got).to.equal(expected);
  //   expect(got).to.equal(122);
  //   expect(buffer.readBits(14, 22)).to.equal(455);
  // });
});