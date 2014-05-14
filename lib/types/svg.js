'use strict';
var fs = require('fs');

var fileContents;

function isSVG (buffer, filepath) {
  if (!filepath) {
    throw new TypeError('SVG requires a filepath');
  }

  var string = getFileContents(filepath);
  var isValid = ('<?xml' === buffer.toString('ascii', 0, 5)) &&
    getSvgRegex().test(string);

  return isValid;
}

function calculate (buffer, filepath) {
  var string = getFileContents(filepath);
  if (!filepath) {
    throw new TypeError('SVG requires a filepath');
  }
  return {
    'width': parseInt(string.match(getWidthRegex())[4]),
    'height': parseInt(string.match(getHeightRegex())[4])
  };
}

function getFileContents (path) {
  fileContents = fileContents || fs.readFileSync(path).toString();
  return fileContents;
}

function getSvgRegex() {
  var regexStr = '<svg((.|\n)*)xmlns=(\'|")' +
    'http:\/\/www(.|\n)w3(.|\n)org\/2000\/svg(\'|")((.|\n)*)>';
  return new RegExp(regexStr, 'i');
}

function getHeightRegex() {
  var regexStr = '<svg((.|\\n)*?)height=(\'|")(\\d*\\.?\\d*?)' +
    '((.|\\n)*?)(\'|")((.|\\n)*?)>';
  return new RegExp(regexStr, 'i');
}

function getWidthRegex() {
  var regexStr = '<svg((.|\\n)*?)width=(\'|")(\\d*\\.?\\d*?)' +
    '((.|\\n)*?)(\'|")((.|\\n)*?)>';
  return new RegExp(regexStr, 'i');
}

module.exports = {
  'detect': isSVG,
  'calculate': calculate
};