module.exports = {
  env: {
    es2021: true,
    node: true
  },
  root: true,
  extends: [
    'standard',
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
    "plugin:jest/recommended",
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
