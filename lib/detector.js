'use strict';

var typeMap = {};
var handlers = require('./types');
var types = Object.keys(typeMap);

// fetch all available handlers
types.forEach(function (type) {
  typeMap[type] = handlers[type].detect;
});

module.exports = function (buffer, filepath) {
  var type, result;
  for (type in typeMap) {
    result = typeMap[type](buffer, filepath);
    if (result) {
      return type;
    }
  }
};
