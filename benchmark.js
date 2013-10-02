'use strict';

const Benchmark = require('benchmark');
// const microtime = require('microtime');
const path = require('path');
const fs = require('fs');

const withCache = require('./dist');
const withoutCache = require('./dist1'); // generated with tsc --outDir dist1

const buffer = new Buffer(1024);
const file = path.resolve('specs/images/valid/png/sample.png');
const descriptor = fs.openSync(file, 'r');
fs.readSync(descriptor, buffer, 0, 1024, 0);

// Warm up the VM
withCache(buffer);
withoutCache(buffer);

const suite = new Benchmark.Suite();
suite
  .on('complete', function () {
    const fastest = this.filter('fastest');
    console.log('Fastest is ' + fastest.map('name'));
  })
  .add('withoutCache', () => withoutCache(buffer))
  .add('withCache', () => withCache(buffer))
  .on('cycle', (e) => console.log(String(e.target)))
  .run();
