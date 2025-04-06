import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    ignores: ['postcss.config.js'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      prettier: eslintPluginPrettier,
      js,
    },
    rules: {
      'prettier/prettier': 'error',
    },
    extends: ['js/recommended', prettier],
  },
]);
