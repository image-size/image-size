var expect = require('expect.js');
var sinon = require('sinon');
var fs = require('fs');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var imageSize = require(libpath);

describe('after done reading from files', function () {

  var oldOpen = fs.open;
  function readFromClosed (descriptor) {
    fs.readSync(descriptor, new Buffer(1), 0, 1, 0);
  }

  describe('should close the file descriptor', function () {

    it('async', function (done) {

      var descriptor;
      var oldOpen = fs.open;
      fs.open = sinon.spy(function (path, mode, callback) {
        oldOpen.call(fs, path, mode, function (err, d) {
          descriptor = d;
          callback(err, d);
        });
      });

      imageSize('specs/images/valid/jpg/large.jpg', function () {

        expect(readFromClosed.bind(null, descriptor)).to.throwException(function (e) {
          expect(e.code).to.equal('EBADF');
          expect(e).to.be.an(Error);
          expect(e.message).to.match(/bad file descriptor/);
        });

        fs.open = oldOpen;
        done();
      });
    });

    it('sync', function () {
      var descriptor;
      var oldOpen = fs.openSync;
      fs.openSync = sinon.spy(function (path, mode) {
        descriptor = oldOpen.call(fs, path, mode);
        return descriptor;
      });

      imageSize('specs/images/valid/jpg/large.jpg');

      expect(readFromClosed.bind(null, descriptor)).to.throwException(function (e) {
        expect(e.code).to.equal('EBADF');
        expect(e).to.be.an(Error);
        expect(e.message).to.match(/bad file descriptor/);
      });

      fs.openSync = oldOpen;
    });
  });
});