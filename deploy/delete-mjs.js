const del = require('del');

del.sync('./lib/mjs/**', './lib/types/**')