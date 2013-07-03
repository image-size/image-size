UI = bdd
REPORTER = dot
TESTS = specs/*.spec.js
BIN = ./node_modules/.bin/mocha
LINT = ./node_modules/.bin/jshint
WATCH =

all: lint test

lint:
	@$(LINT) lib/

test:
	@$(BIN) --ui $(UI) --reporter $(REPORTER) $(WATCH) $(TESTS)

watch:
	@$(MAKE) test REPORTER=spec WATCH=--watch

coverage:
	@jscoverage --no-highlight lib lib-cov
	@TEST_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@rm -rf lib-cov

.PHONY: test coverage
