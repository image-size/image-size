'use strict';

var esj = require('escomplex-js');
var expect = require('expect.js');
var glob = require('glob');

var path = require('path');
var fs = require('fs');

var options = {
  'max_complexity': 6,
  'max_cyclomatic_density': 101,
  'max_dependencies': 6,
  'maintainability': 110
};

describe('Code complexity', function () {
  // find all source files
  var codeFiles = glob.sync('lib/**/*.js');
  // loop through them
  codeFiles.forEach(function (file) {

    it(file, function () {
      // get the absolute path
      file = path.resolve(file);
      // read the file
      var code = fs.readFileSync(file, 'utf-8');

      // calculate the complexity
      var analysis = esj.analyse(code);

      // Halstead
      // TO-DO: analysis.aggregate.halstead

      // Complexity
      var fns = analysis.functions || [];
      fns.forEach(function (fn) {
        it(fn.name, function () {
          // TO-DO: add checks on fn.halstead
          expect(fn.cyclomatic).to.be.lessThan(options.max_complexity);
          expect(fn.cyclomaticDensity).to.be.lessThan(options.max_cyclomatic_density);
        });
      });

      // prevent too many dependencies
      expect(analysis.dependencies.length).to.be.lessThan(options.max_dependencies);

      // keep functions maintainable
      expect(analysis.maintainability).to.be.greaterThan(options.maintainability);
    });
  });
});
