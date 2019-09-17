'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');

var imageSize = require('..');

describe('after done reading from files', function () {
  function readFromClosed (descriptor) {
    fs.readSync(descriptor, Buffer.alloc(1), 0, 1, 0);
  }

  describe('should close the file descriptor', function () {
    var spy;

    beforeEach(function () {
      spy = sinon.spy(fs.promises, 'open');
    });

    afterEach(function () {
      sinon.restore();
    });

    it('async', function (done) {
      imageSize('specs/images/valid/jpg/large.jpg', function () {
        expect(spy.calledOnce).to.be.true;
        var fsPromise = spy.returnValues[0];
        fsPromise.then(function (handle) {
          expect(readFromClosed.bind(null, handle.fd)).to.throw(Error, 'bad file descriptor').with.property('code', 'EBADF');
          done();
        });
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

      expect(readFromClosed.bind(null, descriptor)).to.throw(Error, 'bad file descriptor').with.property('code', 'EBADF');

      fs.openSync = oldOpen;
    });
  });
});
