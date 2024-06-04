"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 'latest',
    project: require.resolve("./tsconfig.json")
  }, 
  plugins: ["@typescript-eslint"], 
  env: {
    "browser": true,
    "node": true,
    "es6": true
  },
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
};
