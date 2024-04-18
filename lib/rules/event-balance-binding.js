/**
 * @fileoverview eslint-plugin-memory-leaks
 * @author eslint-plugin-memory-leaks
 */
"use strict";

const eslintUtils = require('eslint-utils');  

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Ensure events are bind pair with unbind',  
            category: 'Possible Errors',
            recommended: true,
        },
        fixable: null, // 根据实际情况，可以提供自动修复或设置为null 
        schema: [], // no options  
        messages: {
            noUnbind: `EventEmitter event '{{eventName}}' was bind with handler '{{handler}}' but never unbind.`,
        },

    },
    create(context) {
        const listeners = {};

        return {
            CallExpression(node) {
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.property.name === 'on' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'events' &&
                    node.arguments.length === 2
                ) {
                    const eventName = node.arguments[0].value;
                    const handlerName = eslintUtils.getStaticPropertyName(node.arguments[1]);
                    if (eventName && handlerName) {
                        if (!listeners[eventName]) {
                            listeners[eventName] = [];
                        }
                        listeners[eventName].push(handlerName);
                    }
                }

                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.property.name === 'off' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'events' &&
                    node.arguments.length === 2
                ) {
                    const eventName = node.arguments[0].value;
                    const handlerName = eslintUtils.getStaticPropertyName(node.arguments[1]);
                    if (eventName && handlerName && listeners[eventName]) {
                        const index = listeners[eventName].indexOf(handlerName);
                        if (index !== -1) {
                            listeners[eventName].splice(index, 1);
                        }
                    }
                }
            },

            'Program:exit'() {
                for (const [eventName, handlers] of Object.entries(listeners)) {
                    handlers.forEach((handler) => {
                        context.report({
                            node: null,
                            messageId: 'noUnbind',
                            data: {
                                eventName,
                                handler
                            }
                        });
                    });
                }
            },
        };
    },
}
