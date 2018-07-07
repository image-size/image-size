'use strict';

var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
function isSVG (buffer) {
  return svgReg.test(buffer);
}

var extractorRegExps = {
  'root': svgReg,
  'width': /\bwidth=(['"])([^%]+?)\1/,
  'height': /\bheight=(['"])([^%]+?)\1/,
  'viewbox': /\bviewBox=(['"])(.+?)\1/
};

var units = {
  'cm': 96/2.54,
  'mm': 96/2.54/10,
  'm':  96/2.54*100,
  'pt': 96/72,
  'pc': 96/72/12,
  'em': 16,
  'ex': 8,
};

function parseLength (len) {
  var m = /([0-9.]+)([a-z]*)/.exec(len);
  if (!m) {
    return undefined;
  }
  return Math.round(parseFloat(m[1]) * (units[m[2]] || 1));
}

function parseViewbox (viewbox) {
  var bounds = viewbox.split(' ');
  return {
    'width': parseLength(bounds[2]),
    'height': parseLength(bounds[3])
  };
}

function parseAttributes (root) {
  var width = root.match(extractorRegExps.width);
  var height = root.match(extractorRegExps.height);
  var viewbox = root.match(extractorRegExps.viewbox);
  return {
    'width': width && parseLength(width[2]),
    'height': height && parseLength(height[2]),
    'viewbox': viewbox && parseViewbox(viewbox[2])
  };
}

function calculateByDimensions (attrs) {
  return {
    'width': attrs.width,
    'height': attrs.height
  };
}

function calculateByViewbox (attrs) {
  var ratio = attrs.viewbox.width / attrs.viewbox.height;
  if (attrs.width) {
    return {
      'width': attrs.width,
      'height': Math.floor(attrs.width / ratio)
    };
  }
  if (attrs.height) {
    return {
      'width': Math.floor(attrs.height * ratio),
      'height': attrs.height
    };
  }
  return {
    'width': attrs.viewbox.width,
    'height': attrs.viewbox.height
  };
}

function calculate (buffer) {
  var root = buffer.toString('utf8').match(extractorRegExps.root);
  if (root) {
    var attrs = parseAttributes(root[0]);
    if (attrs.width && attrs.height) {
      return calculateByDimensions(attrs);
    }
    if (attrs.viewbox) {
      return calculateByViewbox(attrs);
    }
  }
  throw new TypeError('invalid svg');
}

module.exports = {
  'detect': isSVG,
  'calculate': calculate
};
