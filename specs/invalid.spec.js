'use strict';

var expect = require('chai').expect;
var glob = require('glob');

var imageSize = require('..');

// Test all invalid files
describe('Invalid Images', function () {

  var invalidFiles = glob.sync('specs/images/invalid/**/*.*');
  invalidFiles.forEach(function (file) {

    describe(file, function() {

      var calculate = imageSize.bind(null, file);

      it('should throw when called synchronously', function() {
        expect(calculate).to.throw(TypeError, 'Invalid');
      });

      it('should callback with error when called asynchronously', function(done) {
        calculate(function (e) {
          expect(e).to.be.instanceOf(TypeError);
          expect(e.message).to.match(/^Invalid \w+$/);
          done();
        });
      });
    });
  });

  describe('non-existent file', function() {

    var calculate = imageSize.bind(null, 'fakefile.jpg');

    it('should throw when called synchronously', function() {
      expect(calculate).to.throw(Error, 'ENOENT');
    });

    it('should callback with error when called asynchronously', function(done) {
      calculate(function (e) {
        expect(e.message).to.match(/^ENOENT.*$/);
        done();
      });
    });
  });
});
