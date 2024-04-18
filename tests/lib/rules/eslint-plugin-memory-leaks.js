/**
 * @fileoverview eslint-plugin-memory-leaks
 * @author eslint-plugin-memory-leaks
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/eslint-plugin-memory-leaks"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("eslint-plugin-memory-leaks", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "xxx",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
