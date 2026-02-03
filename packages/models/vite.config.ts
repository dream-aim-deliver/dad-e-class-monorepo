/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { checker } from 'vite-plugin-checker';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/models',
  plugins: [
    react(),
    nxCopyAssetsPlugin(['*.md']),
    !process.env.CI ? dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }) : undefined,
    !process.env.CI ? checker({
      typescript: {
        buildMode: true
      }
    }) : undefined,
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
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@maany_shr/e-class-models',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime', '@dream-aim-deliver/e-class-cms-rest'],
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/models',
      provider: 'v8',
    },
  },
});
