var expect = require('expect.js');
var glob = require('glob');
var path = require('path');

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

var sizes = {
  'default': {
    'width': 123,
    'height': 456
  },
  'specs/images/valid/jpg/large.jpg': {
    'width': 1600,
    'height': 1200
  },
  'specs/images/valid/jpg/very-large.jpg': {
    'width': 4800,
    'height': 3600
  }
};

// Test all valid files
describe('Valid images', function () {

  var validFiles = glob.sync('specs/images/valid/**/*.*');
  validFiles.forEach(function (file) {

    describe(file, function() {

      var type, bufferDimensions, asyncDimensions;
      var bufferSize = 8192;

      beforeEach(function (done) {

        var buffer = new Buffer(bufferSize);
        var filepath = path.resolve(file);
        var descriptor = fs.openSync(filepath, 'r');
        fs.readSync(descriptor, buffer, 0, bufferSize, 0);
        type = detector(buffer);

        // tiff cannot support buffers, unless the buffer contains the entire file
        if (type !== 'tiff') {
          bufferDimensions = imageSize(buffer);
        }

        imageSize(file, function (err, _dim) {
          asyncDimensions = _dim;
          done();
        });
      });

      it('should return correct size for ' + file, function() {
        var expected = sizes[file] || sizes.default;
        expect(asyncDimensions.width).to.be(expected.width);
        expect(asyncDimensions.height).to.be(expected.height);

        if (type !== 'tiff') {
          expect(bufferDimensions.width).to.be(expected.width);
          expect(bufferDimensions.height).to.be(expected.height);
        }
      });
    });
  });
});