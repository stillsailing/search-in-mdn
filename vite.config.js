import path from 'path'

const dev = process.env.NODE_ENV === 'development'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  mode: process.env.NODE_ENV,
  publicDir: 'assets',
  build: {
    target: 'es2015',
    outDir: dev ? 'output/dev' : 'output/build',
    lib: {
      entry: {
        background: 'src/background/index.ts',
      },
      name: 'search-in-mdn',
      formats: ['cjs'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    manifest: false,
    sourcemap: dev,
    watch: dev,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}
