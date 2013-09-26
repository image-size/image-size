var expect = require('expect.js');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var sizeOf = require(libpath),
    fs = require('fs');


['png', 'gif', 'bmp', 'psd', 'jpg'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensionsFilePath, dimensionsBuffer;

    beforeEach(function (done) {
      sizeOf('specs/images/sample.' + type, function (err, _dim) {
        dimensionsFilePath = _dim;
        var buffer = fs.readFile('specs/images/sample.' + type, function (err, data) {
          sizeOf(data, function (err, _dimBuffer) {
            dimensionsBuffer = _dimBuffer;
            done();
          });
        });
      });
    });

    it('should return correct size for ' + type, function() {
      expect(dimensionsFilePath.width).to.be(123);
      expect(dimensionsFilePath.height).to.be(456);
      expect(dimensionsBuffer.width).to.be(123);
      expect(dimensionsBuffer.height).to.be(456);
    });
  });
});
