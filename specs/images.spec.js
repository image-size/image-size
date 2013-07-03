var expect = require('expect.js');

var imageSize = require('..');

['png', 'gif'].forEach(function (type) {

  describe(type.toUpperCase(), function() {

    var dimensions;

    beforeEach(function () {
      dimensions = imageSize('specs/images/sample.' + type);
    });

    it('should return correct size for ' + type, function() {
      expect(dimensions.width).to.be(123);
      expect(dimensions.height).to.be(456);
    });
  });
});