// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import baseConfig from '../../eslint.config.js';
import nx from '@nx/eslint-plugin';
export default [...baseConfig, ...nx.configs['flat/react-typescript'], {
  files: ['**/*.json'],
  rules: {
    '@nx/dependency-checks': [
      'error',
      {
        ignoredFiles: [
          '{projectRoot}/eslint.config.{js,cjs,mjs}',
          '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          '{projectRoot}/vite.config.ts.timestamp-**.{js,ts,mjs,mts}'
        ],
      },
    ],
  },
  languageOptions: {
    parser: await import('jsonc-eslint-parser'),
  },
}, {
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
     '@typescript-eslint/ban-ts-comment': 'off'
  },
}, ...storybook.configs["flat/recommended"]];
