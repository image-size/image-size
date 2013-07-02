var fs = require('fs');
var path = require('path');

var detector = require('./lib/detector');
var handlers = {
  'png': require('./lib/png')
};

module.exports = function (filepath) {

  // resolve the file path
  filepath = path.resolve(filepath);

  // get the file descriptor
  var descriptor = fs.openSync(filepath, 'r');

  // create a buffer to read data in
  var buffer = new Buffer(1024);

  // read first 1KB from the file
  fs.readSync(descriptor, buffer, 0, 1024, 0);

  var type = detector(buffer);

  if (type in handlers) {
    return handlers[type](buffer);
  } else {
    throw new Error('unsupported file type');
  }
};