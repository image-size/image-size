'use strict';

var expect = require('expect.js');
var path = require('path');
var fs = require('fs');

var imageSize = require('..');
var types = require('..').types;

// If something other than a buffer or filepath is passed
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
        // expect(e.errno).to.be(34);
        expect(e.code).to.be('ENOENT');
      });
    });
  });

  describe('passing buffer for tiff', function () {

    var buffer;
    beforeEach(function () {
      var bufferSize = 2048;
      var file = 'specs/images/valid/tiff/little-endian.tiff';

      buffer = Buffer.alloc(bufferSize);
      var filepath = path.resolve(file);
      var descriptor = fs.openSync(filepath, 'r');
      fs.readSync(descriptor, buffer, 0, bufferSize, 0);
    });

    it('should throw', function () {
      expect(imageSize.bind(null, buffer)).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
        expect(e.message).to.contain('doesn\'t support buffer');
      });
    });
  });

});

describe('Callback function', function () {
  it('should be called only once', function(done) {
    var tmpError = new Error();

    var origException = process.listeners('uncaughtException').pop();
    process.removeListener('uncaughtException', origException);
    process.once('uncaughtException', function (err) {
      expect(err).to.be(tmpError);
    });

    imageSize('specs/images/valid/jpg/sample.jpg', function() {
      process.nextTick(function () {
        done();
      });
      throw tmpError;
    });
  });
});

describe('.types property', function () {
  it('should expose supported file types', function() {
    expect(types).to.eql(['bmp', 'cur', 'dds', 'gif', 'icns', 'ico', 'jpg', 'png', 'psd', 'svg', 'tiff', 'webp']);
  });
});
