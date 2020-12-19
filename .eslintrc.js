module.exports = {
  root: true,
  extends: ['react-app', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-duplicate-imports': 'error',
    'no-alert': 'warn',
    'no-console': 'warn',
  },
};
