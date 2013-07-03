UI = bdd
REPORTER = dot
TESTS = specs/*.spec.js
BIN = ./node_modules/.bin/mocha

test:
	@$(BIN) --ui $(UI) --reporter $(REPORTER) $(TESTS)

coverage:
	@jscoverage --no-highlight lib lib-cov
	@TEST_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm -rf lib-cov

.PHONY: test coverage
