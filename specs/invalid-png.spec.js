var expect = require('expect.js');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath);

describe('Invalid PNG', function() {

  var dimensions;

  function calculate () {
    dimensions = imageSize('specs/images/sample-invalid.png');
  }

  it('should throw for invalid png', function() {
    expect(calculate).to.throwException(function (e) {
      expect(e).to.be.a(TypeError);
      expect(e.message).to.be('invalid png');
    });
  });
});
