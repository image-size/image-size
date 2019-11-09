'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var glob = require('glob');
var path = require('path');

var imageSize = require('..');
var detector = require('../dist/detector').detector;

var sizes = {
  'default': {
    'width': 123,
    'height': 456
  },
  'specs/images/valid/cur/sample.cur': {
    'width': 32, 'height': 32
  },
  'specs/images/valid/ico/sample.ico': {
    'width': 32, 'height': 32
  },
  'specs/images/valid/ico/sample-compressed.ico': {
    'width': 32, 'height': 32
  },
  'specs/images/valid/ico/sample-256.ico': {
    'width': 256, 'height': 256
  },
  'specs/images/valid/ico/sample-256-compressed.ico': {
    'width': 256, 'height': 256
  },
  'specs/images/valid/icns/sample.icns': {
    'width': 16,
    'height': 16,
    'images': [
      { 'width': 16, 'height': 16, 'type': 'is32' },
      { 'width': 16, 'height': 16, 'type': 's8mk' },
      { 'width': 32, 'height': 32, 'type': 'il32' },
      { 'width': 32, 'height': 32, 'type': 'l8mk' },
      { 'width': 48, 'height': 48, 'type': 'ih32' },
      { 'width': 48, 'height': 48, 'type': 'h8mk' },
      { 'width': 128, 'height': 128, 'type': 'it32' },
      { 'width': 128, 'height': 128, 'type': 't8mk' }
    ],
    'type': 'icns'
  },
  'specs/images/valid/ico/multi-size.ico': {
    'width': 256,
    'height': 256,
    'images': [
      {'width': 256, 'height': 256},
      {'width': 128, 'height': 128},
      {'width': 96, 'height': 96},
      {'width': 72, 'height': 72},
      {'width': 64, 'height': 64},
      {'width': 48, 'height': 48},
      {'width': 32, 'height': 32},
      {'width': 24, 'height': 24},
      {'width': 16, 'height': 16}
    ]
  },
  'specs/images/valid/ico/multi-size-compressed.ico': {
    'width': 256,
    'height': 256,
    'images': [
      {'width': 256, 'height': 256},
      {'width': 128, 'height': 128},
      {'width': 96, 'height': 96},
      {'width': 72, 'height': 72},
      {'width': 64, 'height': 64},
      {'width': 48, 'height': 48},
      {'width': 32, 'height': 32},
      {'width': 24, 'height': 24},
      {'width': 16, 'height': 16}
    ]
  },
  'specs/images/valid/jpg/large.jpg': {
    'width': 1600,
    'height': 1200
  },
  'specs/images/valid/jpg/very-large.jpg': {
    'width': 4800,
    'height': 3600
  },
  'specs/images/valid/jpg/1x2-flipped-big-endian.jpg': {
    'width': 1,
    'height': 2,
    'orientation': 8
  },
  'specs/images/valid/jpg/1x2-flipped-little-endian.jpg': {
    'width': 1,
    'height': 2,
    'orientation': 8
  },
  'specs/images/valid/png/sample_fried.png': {
    'width': 128,
    'height': 68
  },
  'specs/images/valid/wsq/cmp00001.wsq': {
    'width': 589,
    'height': 605
  },
  'specs/images/valid/wsq/fp.wsq': {
    'width': 320,
    'height': 480
  }
};

// Test all valid files
describe('Valid images', function () {

  var validFiles = glob
    .sync('specs/images/valid/**/*.*')
    .filter(function (file) {
      return path.extname(file) !== '.md';
    });

  validFiles.forEach(function (file) {

    describe(file, function() {

      var type, bufferDimensions, asyncDimensions;
      var bufferSize = 8192;

      beforeEach(function (done) {

        var buffer = Buffer.alloc(bufferSize);
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
        expect(asyncDimensions.width).to.equal(expected.width);
        expect(asyncDimensions.height).to.equal(expected.height);
        if (asyncDimensions.images) {
          asyncDimensions.images.forEach(function (item, index) {
            var expectedItem = expected.images[index];
            expect(item.width).to.equal(expectedItem.width);
            expect(item.height).to.equal(expectedItem.height);
            if (expectedItem.type) {
              expect(item.type).to.equal(expectedItem.type);
            }
          });
        }

        if (expected.orientation) {
          expect(asyncDimensions.orientation).to.equal(expected.orientation);
        }

        if (type !== 'tiff') {
          expect(bufferDimensions.width).to.equal(expected.width);
          expect(bufferDimensions.height).to.equal(expected.height);
          if (bufferDimensions.images) {
            bufferDimensions.images.forEach(function (item, index) {
              var expectedItem = expected.images[index];
              expect(item.width).to.equal(expectedItem.width);
              expect(item.height).to.equal(expectedItem.height);
            });
          }
        }
      });
    });
  });
});
