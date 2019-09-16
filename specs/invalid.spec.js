'use strict';

var expect = require('expect.js');
var glob = require('glob');

var imageSize = require('..').imageSize;

// Test all invalid files
describe('Invalid Images', function () {

  var invalidFiles = glob.sync('specs/images/invalid/**/*.*');
  invalidFiles.forEach(function (file) {

    describe(file, function() {

      var calculate = imageSize.bind(null, file);

      it('should throw when called synchronously', function() {
        expect(calculate).to.throwException(function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.match(/^Invalid \w+$/);
        });
      });

      it('should callback with error when called asynchronously', function(done) {
        calculate(function (e) {
          expect(e).to.be.a(TypeError);
          expect(e.message).to.match(/^Invalid \w+$/);
          done();
        });
      });
    });
  });

  describe('non-existent file', function() {

    var calculate = imageSize.bind(null, 'fakefile.jpg');

    it('should throw when called synchronously', function() {
      expect(calculate).to.throwException(function (e) {
        expect(e).to.be.a(Error);
        expect(e.message).to.match(/^ENOENT.*$/);
      });
    });

    it('should callback with error when called asynchronously', function(done) {
      calculate(function (e) {
        expect(e.message).to.match(/^ENOENT.*$/);
        done();
      });
    });
  });
});
