import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts', 'lib/types/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.cjs',
    dts: format === 'esm' ? '.d.ts' : '.d.cts',
  }),
  platform: 'node',
  target: 'node16',
  outDir: 'dist',
})
