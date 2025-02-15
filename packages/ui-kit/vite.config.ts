import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { glob } from "glob";
import { fileURLToPath } from "url";
import preserveDirectives from 'rollup-preserve-directives';

/**
 * STATIC_ASSETS_DIR is the directory where static assets are stored. They are copied to the dist directory during the build process.
 */
const STATIC_ASSETS_DIR = "lib/assets/";


/**
 * COMPILE_ALIAS is a list of paths that are used to alias imports in the compiler. (tsconfig.json)
 */
const COMPILER_ALIAS = [
  {
    find: "@",
    replacement: "/lib",
  },
]

const COVERAGE_THRESHOLDS = {
  statements: 10,
  branches: 10,
  functions: 10,
  lines: 10,
};

const COVERAGE_EXCLUDE_PATTERNS = [
  "tests/**/*.{ts,tsx}",
  "**/*.config.{ts,tsx,js}",
  ".eslint*",
  "tools",
  "lib/utils/*.{ts,tsx}",
  "vitest.config.ts",
  "vite.*.*",
  "lib/utils/**/*.{ts,tsx}",
];


export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/ui-kit',
  publicDir: STATIC_ASSETS_DIR,
  resolve: {
    alias: COMPILER_ALIAS,
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    // tailwindcss(),
    preserveDirectives(),
    dts({
      entryRoot: 'lib',
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
    outDir: '../../dist/packages/ui-kit',
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'lib/index.ts',
      name: 'ui-kit',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime', '@maany_shr/e-class-translations'],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob.sync("lib/**/*.{ts,tsx}").map((file) => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          path.relative("lib", file.slice(0, file.length - path.extname(file).length)),
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
    alias: COMPILER_ALIAS,
    clearMocks: true,
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ["tests/vitest.setup.ts"],
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ["tests/**/*.setup.{ts,tsx}", "tests/**/*.d.ts", "tests/**/*.config.ts"],
    reporters: ['json', 'dot', 'github-actions'],
    coverage: {
      reportsDirectory: '../../coverage/packages/ui-kit',
      provider: 'v8',
      thresholds: COVERAGE_THRESHOLDS,
      exclude: COVERAGE_EXCLUDE_PATTERNS,
      reportOnFailure: true,
    },
  },
});
