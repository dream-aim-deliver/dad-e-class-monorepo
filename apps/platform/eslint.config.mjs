import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import baseConfig from '../../eslint.config.js';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  ...nextCoreWebVitals,
  ...baseConfig,
  {
    ignores: ['.next/**/*', "new-types.d.ts"],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
      'react-hooks/static-components': 'warn',
      'react-hooks/use-memo': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-render': 'warn',
    },
  },
];

export default config;
