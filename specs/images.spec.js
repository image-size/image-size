var expect = require('expect.js');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath);

['png', 'gif', 'bmp', 'psd', 'jpg'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensions;

    beforeEach(function () {
      dimensions = imageSize('specs/images/sample.' + type);
    });

    it('should return correct size for ' + type, function() {
      expect(dimensions.width).to.be(123);
      expect(dimensions.height).to.be(456);
    });
  });
});
