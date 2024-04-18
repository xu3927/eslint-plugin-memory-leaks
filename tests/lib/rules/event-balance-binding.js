"use strict";

const rule = require("../../../lib/rules/event-balance-binding"),
    RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 'latest', // 或你 .eslintrc 中指定的 ecmaVersion  
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
});
ruleTester.run("bind with unbind", rule, {
    valid: [
        {
            code: `
            // 正确示例 
            // function EventEmitter {}
            EventEmitter.prototype.on = () => {}
            EventEmitter.prototype.off = () => {}
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
