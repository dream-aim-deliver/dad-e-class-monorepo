import { defineConfig, type UserConfigFnPromise } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// Async config to avoid Node.js ESM race condition (ERR_INTERNAL_ASSERTION)
// when Nx loads multiple vite configs in parallel during project graph construction
const config: UserConfigFnPromise = async () => {
  let dtsPlugin: any;
  let checkerPlugin: any;
  if (!process.env.CI) {
    const { default: dts } = await import('vite-plugin-dts');
    const { checker } = await import('vite-plugin-checker');
    dtsPlugin = dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    });
    checkerPlugin = checker({
      typescript: {
        buildMode: true
      }
    });
  }

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/models',
    plugins: [
      react(),
      nxCopyAssetsPlugin(['*.md']),
      dtsPlugin,
      checkerPlugin,
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
  };
};

export default defineConfig(config);
