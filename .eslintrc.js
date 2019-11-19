module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ['jest', 'prettier'],
  rules: {}
};
