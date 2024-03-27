module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:react/recommended',
    "plugin:@typescript-eslint/recommended",
    'eslint:recommended'
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  rules: {
    "react/no-children-prop": 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
}
