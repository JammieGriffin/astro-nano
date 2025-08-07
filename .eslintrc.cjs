module.exports = {
  env: {
    node: true,
    browser: true,
    es2024: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'standard',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
}
