var expect = require('expect.js');
var glob = require('glob');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath);
var detector = require(libpath + 'detector');

// Helper method for tests
var fs = require('fs');
function fileToBuffer (file, size) {
  var buffer = new Buffer(size);
  fs.readSync(fs.openSync(file, 'r'), buffer, 0, size, 0);
  return buffer;
}

// Test all valid files
describe('Valid images', function () {

  var validFiles = glob.sync('specs/images/valid/**/*.*');
  validFiles.forEach(function (file) {

    describe(file, function() {

      var dimensions;
      beforeEach(function (done) {
        imageSize(file, function (err, _dim) {
          dimensions = _dim;
          done();
        });
      });

      it('should return correct size for ' + file, function() {
        expect(dimensions.width).to.be(123);
        expect(dimensions.height).to.be(456);
      });
    });
  });
});


// Test all invalid files
describe('Invalid Images', function () {

  var invalidFiles = glob.sync('specs/images/invalid/**/*.*');
  invalidFiles.forEach(function (file) {

    describe(file, function() {

      var calculate = imageSize.bind(null, file);

      it('should throw', function() {
        expect(calculate).to.throwException(function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.match(/^invalid \w+$/);
        });
      });
    });
  });
});

// Test all unsupported files
describe('Unsupported Images', function () {

  var unsupportedFiles = glob.sync('specs/images/unsupported/**/*.*');
  unsupportedFiles.forEach(function (file) {

    describe(file, function () {
      var calculate = imageSize.bind(null, file);
      it('should throw', function() {
        expect(calculate).to.throwException(function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.be('unsupported file type');
        });
      });
    });
  });
});

describe('Invalid invocation', function () {

  describe('invalid type', function () {
    it('should throw', function() {
      expect(imageSize.bind(null, {})).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
        expect(e.message).to.be('invalid invocation');
      });
    });
  });

  describe('non existant file', function () {
    it('should throw', function() {
      expect(imageSize.bind(null, '/monkey/man/yo')).to.throwException(function (e) {
        expect(e.errno).to.be(34);
        expect(e.code).to.be('ENOENT');
      });
    });
  });

});
