/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { glob } from "glob";
import { fileURLToPath } from "url";

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/packages/auth',
  // resolve: {
  //   alias: [
  //     {
  //       find: "@",
  //       replacement: "/src",
  //     },
  //   ],
  // },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    // commonjsOptions: {
    //   transformMixedEsModules: true,
    // },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@maany_shr/e-class-auth',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['@maany_shr/e-class-models'],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob.sync("src/**/*.{ts,tsx}").map((file) => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          path.relative("src", file.slice(0, file.length - path.extname(file).length)),
          // 2. The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        preserveModules: true,
      }
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/auth',
      provider: 'v8',
    },
  },
});
