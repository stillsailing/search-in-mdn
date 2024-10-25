/**
 * @type {import('vite').UserConfig}
 */
export default {
  publicDir: "assets",
  build: {
    target: "es2015",
    outDir: "output/build",
    lib: {
      entry: {
        background: "src/background/index.ts",
      },
      name: "search-in-mdn",
      formats: ["cjs"],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    manifest: false,
  },
};
