// @ts-check
import nx from '@nx/eslint-plugin';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsplugin from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser';
import { parseForESLint } from 'jsonc-eslint-parser';
import baseConfig from '../../eslint.config.js';

// See https://typescript-eslint.io/packages/typescript-eslint#config 
export default [
  ...[
    ...baseConfig,
  ].map((config) => ({
    ...config,
    files: ['pacakges/translations/**/*.ts', 'pacakges/translations/**/*.tsx', 'pacakges/translations/**/*.js', 'pacakges/translations/**/*.jsx'],
    // Override or add rules here
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: 'packages/translations/tsconfig.lib.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsplugin,
    },
  })),
  {
    ignores: ['**/*.config.js', '**/*.config.ts'],
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: {
        parseForESLint: parseForESLint,
      },
    },
    rules: {
      '@nx/dependency-checks': 'error',
    },
    plugins: {
      "@nx": nx,
    }
  }
]
