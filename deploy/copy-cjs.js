const fs = require('fs')

fs.copyFileSync('./deploy/package-cjs.json', "./lib/cjs/package.json")