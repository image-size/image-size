var assert = require('assert');
var imageSize = require('..');

describe('PNG', function() {

  var dimensions;

  beforeEach(function () {
    dimensions = imageSize('specs/images/sample.png');
  });

  it('should return correct size for png', function() {
    assert.equal(123, dimensions.width);
    assert.equal(456, dimensions.height);
  });
});