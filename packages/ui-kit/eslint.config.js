// @ts-check
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.js';
import { parseForESLint } from 'jsonc-eslint-parser';

export default [
  ...baseConfig,
  // @ts-expect-error - This is a valid configuration
  ...nx.configs['flat/react'],
  {
    files: ['packages/ui-kit/**/*.ts', 'packages/ui-kit/**/*.tsx', 'packages/ui-kit/**/*.js', 'packages/ui-kit/**/*.jsx'],
    // Override or add rules here
    rules: {
      "no-unused-vars": "error",
    },
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
  }
];