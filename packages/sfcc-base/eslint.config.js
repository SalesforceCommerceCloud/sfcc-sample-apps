module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
    es6: true,
    jasmine: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module', // es6 import/export
  },
  parser: 'babel-eslint', // class properties
  plugins: ['prettier'],
  rules: {
    'no-extra-boolean-cast': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
};