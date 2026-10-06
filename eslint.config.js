import js from '@eslint/js';
import globals from 'globals';
import { flatConfigs } from 'eslint-plugin-import-x';

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },

  js.configs.recommended,
  flatConfigs.recommended,

  {
    files: ['**/*.js', '**/*.jsx'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.browser,
        ...globals.node, 
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'import-x/ignore': [
        'node_modules',    
        'react-native',    
      ],

      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ios.js', '.android.js', '.native.js'],
        },
      },
    },

    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'preserve-caught-error': 'off',
      'import-x/no-unresolved': 'error',

    },
  },
];