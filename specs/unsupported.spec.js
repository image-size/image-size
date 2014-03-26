var expect = require('expect.js');
var glob = require('glob');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath);

// Test all unsupported files
describe('Unsupported Images', function () {

  var unsupportedFiles = glob.sync('specs/images/unsupported/**/*.*');
  unsupportedFiles.forEach(function (file) {

    describe(file, function () {

      it('should throw, if no callback is passed', function () {
        var calculate = imageSize.bind(null, file);
        expect(calculate).to.throwException(function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.be('unsupported file type');
        });
      });

      it('shouldn\'t throw, if a callback is passed', function (done) {
        var calculate = imageSize.bind(null, file, function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.be('unsupported file type');
          done();
        });
        expect(calculate).to.not.throwException(TypeError);
      });
    });
  });
});