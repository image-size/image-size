const fs = require('fs')

fs.copyFileSync('./deploy/package-mjs.json', "./lib/mjs/package.json")