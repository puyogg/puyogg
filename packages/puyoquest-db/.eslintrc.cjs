/* eslint-disable no-undef */
/** @type {import('@typescript-eslint/utils').TSESLint.ClassicConfig.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier',
  ],
  root: true,
  parserOptions: {
    project: [
      './tsconfig.json',
      './src/tsconfig.json',
      './infra/tsconfig.json',
      './tsconfig.dev.json',
    ],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['**/*.js'],
};
