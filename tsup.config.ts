import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'lib/index.ts',
    'lib/types/*.ts'
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.cjs'
  }),
  platform: 'node',
  target: 'node16',
}) 