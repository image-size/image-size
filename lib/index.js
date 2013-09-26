var fs = require('fs');
var path = require('path');

var libpath = process.env.TEST_COV ? '../lib-cov/' : '../lib/';
var detector = require(libpath + 'detector');

var handlers = {};
['png', 'gif', 'bmp', 'psd', 'jpg', 'webp'].forEach(function (type) {
  handlers[type] = require(libpath + 'types/' + type);
});

function lookup (buffer) {
  // detect the file type.. don't rely on the extension
  var type = detector(buffer);

  if (type in handlers) {
    return handlers[type](buffer);
  } else {
    throw new TypeError('unsupported file type');
  }
}

/**
 * @params file - relative/absolute path or buffer of the image
 * @params callback - optional function for async detection
 */
module.exports = function(file, callback) {
  if(typeof file === 'string') {
    returnDimensionsFromFilePath(file, callback);
  } else {
    // file argument is already a buffer
    returnDimensionsFromBuffer(file, callback);
  }
};

function returnDimensionsFromBuffer(buffer, callback) {
  if (typeof callback === 'function') {
    var dimensions = lookup(buffer);
    callback(null, dimensions);
  } else {
    // return the dimensions
    return lookup(buffer);
  }
}

function returnDimensionsFromFilePath(filePath, callback) {

  // resolve the file path
  filePath = path.resolve(filePath);

  // create a buffer to read data in
  var buffer = new Buffer(1024);

  if (typeof callback === 'function') {
    // read first 1KB from the file, asynchronously
    fs.open(filePath, 'r', function (err, descriptor) {

      if (err) {
        return callback(err);
      }

      fs.read(descriptor, buffer, 0, 1024, 0, function (err) {
        if (err) {
          return callback(err);
        }

        returnDimensionsFromBuffer(buffer, callback);
      });
    });
  } else {
    // read first 1KB from the file, synchronously
    var descriptor = fs.openSync(filePath, 'r');

    fs.readSync(descriptor, buffer, 0, 1024, 0);

    // return the dimensions
    return returnDimensionsFromBuffer(buffer);
  }
}
