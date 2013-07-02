var assert = require('assert');
var imageSize = require('..');

['png', 'gif'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensions;

    beforeEach(function () {
      dimensions = imageSize('specs/images/sample.' + type);
    });

    it('should return correct size for ' + type, function() {
      assert.equal(123, dimensions.width);
      assert.equal(456, dimensions.height);
    });
  });
});