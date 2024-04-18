"use strict";

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 设置为您希望支持的 ECMAScript 版本，例如 2018 或更高  
  }, 
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
