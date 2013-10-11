var fs = require('fs');
var path = require('path');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var detector = require(libpath + 'detector');

var handlers = {};
var types = ['png', 'gif', 'bmp', 'psd', 'jpg'];

// load all available handlers
types.forEach(function (type) {
  handlers[type] = require(libpath + 'types/' + type);
});

/// Maximum buffer size, with a default of 4096 bytes.
var bufferSize = 4096;

function lookup (buffer) {
  // detect the file type.. don't rely on the extension
  var type = detector(buffer);
  // find an appropriate handler for this file type
  if (type in handlers) {
    return handlers[type](buffer);
  }
  // throw up, if we can't understand the file
  else {
    throw new TypeError('unsupported file type');
  }
}

/**
 * @params filepath - relative/absolute path of the image file
 * @params callback - optional function for async detection
 */
module.exports = function (filepath, callback) {

  // resolve the file path
  filepath = path.resolve(filepath);

  // create a buffer to read data in
  var buffer = new Buffer(bufferSize);

  if (typeof callback === 'function') {
    // open the file in read only mode
    fs.open(filepath, 'r', function (err, descriptor) {

      if (err) { throw err; }

      // read first buffer block from the file, asynchronously
      fs.read(descriptor, buffer, 0, bufferSize, 0, function (err) {
        if (err) { throw err; }

        // return the dimensions
        var dimensions = lookup(buffer);
        callback(null, dimensions);
      });
    });
  } else {
    // read first 1KB from the file, synchronously
    var descriptor = fs.openSync(filepath, 'r');
    fs.readSync(descriptor, buffer, 0, bufferSize, 0);

    // return the dimensions
    return lookup(buffer);
  }
};

// Export the lookup method for benchmarking
module.exports.lookup = lookup;
