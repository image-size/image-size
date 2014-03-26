var esj = require('escomplex-js');
var expect = require('expect.js');
var glob = require('glob');

var path = require('path');
var fs = require('fs');

var options = {
  'max_complexity': 6,
  'max_cyclomatic_density': 110,
  'max_dependencies': 10,
  'maintainability': 100
};

describe('Code complexity', function () {
  // find all source files
  var codeFiles = glob.sync('lib/**/*.js');
  // loop through them
  codeFiles.forEach(function (file) {

    describe(file, function () {
      // get the absolute path
      file = path.resolve(file);
      // read the file
      var code = fs.readFileSync(file, 'utf-8');

      // calculate the complexity
      var analysis = esj.analyse(code);

      // Halstead
      // TO-DO: analysis.aggregate.halstead

      // Complexity
      describe('functions', function () {
        var fns = analysis.functions || [];
        fns.forEach(function (fn) {
          it(fn.name, function () {
            // TO-DO: add checks on fn.halstead
            expect(fn.cyclomatic).to.be.lessThan(options.max_complexity);
            expect(fn.cyclomaticDensity).to.be.lessThan(options.max_cyclomatic_density);
          });
        });
      });

      // prevent too many dependencies
      it('dependencies', function () {
        expect(analysis.dependencies.length).to.be.lessThan(options.max_dependencies);
      });

      // keep functions maintainable
      it('maintainability', function () {
        expect(analysis.maintainability).to.be.greaterThan(options.maintainability);
      });
    });
  });
});
