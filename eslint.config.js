import { defineConfig } from 'eslint-define-config';
import js from '@eslint/js';
import jquery from 'eslint-plugin-jquery';

export default defineConfig([
  {
    files: ['src/**/*.js', 'gulpfile.js'],
    plugins: {
      jquery
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        jquery: true,
        es2021: true
      }
    },
    ...js.configs.recommended,
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'linebreak-style': ['error', 'unix'],
      'no-console': ['warn'],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'prefer-const': ['error'],
      'arrow-body-style': ['error', 'as-needed'],
      'jquery/no-ajax': 'off',
      'jquery/no-ready': 'off'
    }
  }
]);
