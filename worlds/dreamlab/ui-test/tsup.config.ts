import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['./src/client.ts', './src/server.ts'],

  target: 'es2021',
  format: 'esm',
  platform: 'neutral',

  clean: true,
  minify: !options.watch,

  dts: false,
  sourcemap: false,

  splitting: true,
  keepNames: true,
  skipNodeModulesBundle: true,
}))
