var fs = require('fs');
var path = require('path');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var detector = require(libpath + 'detector');

var handlers = {};
var types = ['png', 'gif', 'bmp', 'psd', 'jpg', 'tiff'];

// load all available handlers
types.forEach(function (type) {
  handlers[type] = require(libpath + 'types/' + type);
});

/// Maximum buffer size, with a default of 64 kilobytes.
var bufferSize = 64*1024;

function lookup (buffer, filepath) {
  // detect the file type.. don't rely on the extension
  var type = detector(buffer, filepath);
  // find an appropriate handler for this file type
  if (type in handlers) {
    return handlers[type](buffer, filepath);
  }
  // throw up, if we can't understand the file
  else {
    throw new TypeError('unsupported file type');
  }
}

function asyncFileToBuffer (filepath, buffer, callback) {
  // open the file in read only mode
  fs.open(filepath, 'r', function (err, descriptor) {
    if (err) { throw err; }
    // read first buffer block from the file, asynchronously
    fs.read(descriptor, buffer, 0, bufferSize, 0, function (err) {
      if (err) { throw err; }
      // no errors, return the buffer
      callback();
    });
  });
}

function syncFileToBuffer (filepath, buffer) {
  // read from the file, synchronously
  var descriptor = fs.openSync(filepath, 'r');
  fs.readSync(descriptor, buffer, 0, bufferSize, 0);
}

/**
 * @params input - buffer or relative/absolute path of the image file
 * @params callback - optional function for async detection
 */
module.exports = function (input, callback) {

  // Handle buffer input
  if (input instanceof Buffer) {
    return lookup(input);
  }

  // input should be a string at this point
  if (typeof input !== 'string') {
    throw new TypeError('invalid invocation');
  }

  // resolve the file path
  var filepath = path.resolve(input);

  // create a buffer to read data in
  var buffer = new Buffer(bufferSize);

  if (typeof callback === 'function') {
    asyncFileToBuffer(filepath, buffer, function () {
      // return the dimensions
      callback(null, lookup(buffer, filepath));
    });
  } else {
    syncFileToBuffer(filepath, buffer);
    // return the dimensions
    return lookup(buffer, filepath);
  }
};
