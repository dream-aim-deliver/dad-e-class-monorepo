import { defineConfig, type UserConfigFnPromise } from 'vitest/config';
import * as path from 'path';
import { glob } from "glob";
import { fileURLToPath } from "url";

// Async config to avoid Node.js ESM race condition (ERR_INTERNAL_ASSERTION)
// when Nx loads multiple vite configs in parallel during project graph construction
const config: UserConfigFnPromise = async () => {
  const { default: dts } = await import('vite-plugin-dts');
  const { checker } = await import('vite-plugin-checker');

  return {
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
        external: ['@maany_shr/e-class-models', '@dream-aim-deliver/e-class-cms-rest'],
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
      server: {
        deps: {
          inline: ['next']
        }
      },
      environment: 'node',
      include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/packages/auth',
        provider: 'v8',
      },
    },
  };
};

export default defineConfig(config);
