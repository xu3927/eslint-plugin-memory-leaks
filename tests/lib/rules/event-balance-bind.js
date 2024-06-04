"use strict";
const rule = require("../../../lib/rules/event-balance-binding");
const eslintConfig = require('../../../.eslintrc')
// import rule from '../../../lib/rules/event-balance-binding'
// import RuleTester from 'eslint'
// const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester.RuleTester({
    // parser: require.resolve('@typescript-eslint/parser'),
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ["@typescript-eslint"], 
    env: {
        browser: true,
        node: true,
        es6: true
    },
});
// const ruleTester = new RuleTester(eslintConfig)
ruleTester.run("bind with unbind", rule, {
    valid: [
        { 
            code: `
            // 正确示例 
            class EventEmitter {
               on(){}
               off(){}
            };
            eventEmitter = new EventEmitter()
            handler = () => {}
            eventEmitter.on('show', handler)
            eventEmitter.off('show', handler)
            `
        }
    ],

    invalid: [
    //     {
    //         code: `
    //         // 错误示例 
    //         class EventEmitter {
    //             on(){}
    //             off(){}
    //         };
    //         const eventEmitter = new EventEmitter()
    //         const handler = () => {}
    //         eventEmitter.on('show', handler)`,
    //         errors: [
    //             {
    //                 message: 'events shoud bind pair with unbind', // 错误信息  
    //                 type: 'AssignmentExpression', // AST节点类型  
    //             },
    //         ],
    //     },
    ],
});
