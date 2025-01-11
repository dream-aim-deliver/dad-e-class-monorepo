import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.js';
import { parseForESLint } from 'jsonc-eslint-parser';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
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
  },
];
