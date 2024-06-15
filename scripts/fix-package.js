const { resolve } = require('node:path')
const { writeFileSync, renameSync } = require('node:fs')
const { sync: globSync } = require('glob')

const distDir = resolve(__dirname, '../dist')

writeFileSync(
  resolve(distDir, 'cjs/package.json'),
  '{ "type": "commonjs" }\n',
  'utf-8'
)

writeFileSync(
  resolve(distDir, 'esm/package.json'),
  '{ "type": "module" }\n',
  'utf-8'
)

const esmDir = resolve(distDir, 'esm')
const esmFiles = globSync('**/*.js', { cwd: esmDir })
for (const file of esmFiles) {
  renameSync(
    resolve(esmDir, file),
    resolve(esmDir, file.replace(/\.js$/, '.mjs'))
  )
}
