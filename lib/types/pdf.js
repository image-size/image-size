'use strict';

// Max number of bytes to search of items from starting points.
var MAX_SEARCH_LENGTH = 1024;

// Useful regex for parsing dictionary objects.
var TYPE_REGEX = /\/Type\s+\/(\w+)/;
var MEDIABOX_REGEX = /MediaBox\s+\[(.*)\]/;
var CROPBOX_REGEX = /CropBox\s+\[(.*)\]/;

// ASCII encodings
var PERCENT  =  37; // '%'
var SPACE    =  32; // ' '
var TAB      =   9; // '\t'
var NEWLINE  =  10; // '\n'
var RETURN   =  13; // '\r'
var FORMFEED =  12; // '\f'
var LESS     =  60; // '<'
var E_LOW    = 101; // 'e'
var S_LOW    = 115; // 's'
var O_LOW    = 111; // 'o'
var T_LOW    = 116; // 't'

// Valid whitespace characters
var WHITESPACE_CHARACTERS = [SPACE, TAB, NEWLINE, RETURN, FORMFEED];

// Returns the ASCII string at the given location of the buffer.
function read (buffer, start, end) {
  return buffer.toString('ascii', start, end);
}

// Returns true if the ASCII code at the give location of the buffer
// is one of the five allowed whitespace characters.
function isWhitespace (character) {
  return WHITESPACE_CHARACTERS.indexOf(character) !== -1;
}

// Returns the minimum index to search for the xref pointer.
// This is a minimum because we are searching backwards from
// the end of the file.
function minXrefSearchIndex (buffer) {
  var index = buffer.length - MAX_SEARCH_LENGTH;
  return index > 0 ? index : 0;
}

// Returns the maximum index to search for any item while moving
// forward through the buffer.
function maxSearchIndex (buffer, offset) {
  var index = offset + MAX_SEARCH_LENGTH;
  return index > buffer.length - 1 ? buffer.length - 1 : index;
}

// Finds the 'startxref' section in the file and returns the offset
// of the xref table.
function getXrefOffset (buffer) {
  var offsetStart, offsetEnd;
  var minIndex = minXrefSearchIndex(buffer);
  for (var i = buffer.length - 1; i > minIndex; i--) {
    if (buffer.length - i < 50) {
      console.log(i, buffer[i], read(buffer, i, i + 1));
    }
    if (buffer[i] === PERCENT) {
      offsetEnd = i - 1;
    } else if (buffer[i] === S_LOW &&
        read(buffer, i, i + 9) === 'startxref') {
      offsetStart = i + 10;
      break;
    }
  }
  if (offsetStart && offsetEnd) {
    return parseInt(read(buffer, offsetStart, offsetEnd));
  } else {
    throw new TypeError('Invalid PDF, could not find xref table');
  }
}

// Given the start of an xref table, returns an array of
// string for each section.
function getXrefSectionStrings (buffer, offset) {
  var i = offset, strings = [];
  var maxIndex = maxSearchIndex(buffer, offset);
  var character, countStart, count;

  while (i < maxIndex) {
    character = buffer[i];
    if (character === SPACE) {
      countStart = i + 1;
      i += 1;
    } else if (countStart && character === NEWLINE) {
      count = parseInt(read(buffer, countStart, i));
      strings.push(read(buffer, i + 1, i + 20 * count));
      countStart = null;
      i += 20 * count;
    } else if (character === T_LOW &&
        read(buffer, i, i + 7) === 'trailer') {
      break;
    } else {
      i++;
    }
  }

  return strings;
}

// Returns an array of integers representing the location of every
// active object listed in the given xref section string.
function parseXrefSectionString (string) {
  var objectStrings = string.split('\n');
  var offsets = [];
  objectStrings.forEach(function (object) {
    object = object.split(' ');
    if (object[2] === 'n') {
      offsets.push(parseInt(object[0]));
    }
  });
  return offsets;
}

// Returns an array of the offsets of every in-use object in the file.
function getObjectOffsets (buffer, xrefOffset) {

  // Check to make sure the xref table lives at the given offset.
  if (read(buffer, xrefOffset, xrefOffset + 4) !== 'xref') {
    throw new TypeError('Invalid PDF, count not find xref table');
  }

  // Get the section strings, skipping over the 'xref' part
  // of the table.
  var sectionStrings = getXrefSectionStrings(buffer, xrefOffset + 5);

  if (sectionStrings.length < 0) {
    throw new TypeError('Invalid PDF, could not read xref table');
  }

  // Parse each xref section and concatenate the offsets returned.
  var offsets = [];
  sectionStrings.forEach(function (string) {
    offsets = offsets.concat(parseXrefSectionString(string));
  });

  return offsets;
}

// Returns an object string starting at the given offset.
// Returns null if the object at the given offset is not
// of type dictionary.
function getObjectString (buffer, offset) {
  var maxIndex = maxSearchIndex(buffer, offset);
  var objFound, start, character;
  for (var i = offset; i < maxIndex; i++) {
    character = buffer[i];
    if (!objFound && character === O_LOW &&
        read(buffer, i, i + 3) === 'obj') {
      objFound = true;
      i += 2;
    } else if (objFound && !start && character === LESS &&
        read(buffer, i, i + 2) === '<<') {
      start = i;
    } else if (objFound && !start && !isWhitespace(character)) {
      // Don't allow any non-whitespace characters between
      // 'obj' and '<<'.
      return null;
    } else if (start && character === E_LOW &&
        read(buffer, i, i + 6) === 'endobj') {
      return read(buffer, start, i - 1);
    } else if (character === S_LOW &&
        read(buffer, i, i + 6) === 'stream') {
      return null;
    }
  }
  return null;
}


// Returns an object with a width and height based on the box
// attribute.
// Returns undefined if the regex does not match the string.
function parseBox (regex, string) {
  var dict, box = regex.exec(string);
  if (box) {
    dict = {};
    box = box[1].split(' ');
    dict.width = parseInt(box[2] - box[0]);
    dict.height = parseInt(box[3] - box[1]);
  }
  return dict;
}

// Returns an object dictionary containing "mediabox" and "cropbox"
// if they exist at the offset.
// Returns an empty object if the Type of the dictionary given
// by the string is not a "Page".
function getObjectDictionary (buffer, offset) {
  var dict = {};
  var dictString = getObjectString(buffer, offset);
  if (dictString) {
    var type = TYPE_REGEX.exec(dictString);
    if (type && type[1] === 'Page') {
      dict.mediaBox = parseBox(MEDIABOX_REGEX, dictString);
      dict.cropBox = parseBox(CROPBOX_REGEX, dictString);
    }
  }
  return dict;
}

// Returns true if the file is a PDF file.
function isPDF (buffer) {
  return ('%PDF' === read(buffer, 0, 4));
}

// Returns the width and height of the PDF.
function calculate (buffer) {

  console.log(buffer.length);

  // Get the offset of the xref table.
  var xrefOffset = getXrefOffset(buffer);

  console.log('xref:', xrefOffset);

  // Get the offsets of every object in the PDF.
  var objectOffsets = getObjectOffsets(buffer, xrefOffset);

  // Find the first dictionary-type object with a type of "Page" and a
  // "MediaBox" or "CropBox" attribute.
  var dict;
  for (var i = 0; i < objectOffsets.length; i++) {
    dict = getObjectDictionary(buffer, objectOffsets[i]);
    console.log('dict:', dict);
    if (dict.cropBox) {
      return dict.cropBox;
    } else if (dict.mediaBox) {
      return dict.mediaBox;
    }
  }

  throw new TypeError('Invalid PDF, could not find MediaBox ' +
    'or CropBox');
}

module.exports = {
  detect: isPDF,
  calculate: calculate
};
