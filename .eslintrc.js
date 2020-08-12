module.exports = {
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
  },
};
