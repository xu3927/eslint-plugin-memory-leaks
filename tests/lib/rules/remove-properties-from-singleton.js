/**
 * @fileoverview remove variables bind to global
 * @author xu3927
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-missing-remove-global-properties"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("remove-global-properties", rule, {
  valid: [
    // give me some code that won't trigger a warning
    {
      code: `// 正确示例 
      window.dog = {};
      delete window.dog;`
    },
    {
      code: `// 正确示例
      window.dog = dog;
      window.dog = null;`
    }
  ],

  invalid: [
      {
        code: `// 错误示例 
        window.dog = {age: 3};`,
        errors: [
          {
            message: 'Window property dog was set but not cleared in this file.', // 错误信息  
            type: 'AssignmentExpression', // AST节点类型  
          },
        ],  
      },
  ],
});
