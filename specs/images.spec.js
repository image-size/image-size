var expect = require('expect.js');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath),
    fs = require('fs');


['png', 'gif', 'bmp', 'psd', 'jpg'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensions;

    beforeEach(function (done) {
      imageSize.sizeOf('specs/images/sample.' + type, function (err, _dim) {
        dimensions = _dim;
        done();
      });
    });

    it('should return correct size for ' + type, function() {
      expect(dimensions.width).to.be(123);
      expect(dimensions.height).to.be(456);
    });
  });
});

['png', 'gif', 'bmp', 'psd', 'jpg'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensions;

    beforeEach(function (done) {
      var buffer = fs.readFile('specs/images/sample.' + type, function (err, data) {
        imageSize.sizeOfBuffer(data, function (err, _dim) {
          dimensions = _dim;
          done();
        });
      });
    });

    it('should return correct size for buffer of ' + type, function() {
      expect(dimensions.width).to.be(123);
      expect(dimensions.height).to.be(456);
    });
  });
});
