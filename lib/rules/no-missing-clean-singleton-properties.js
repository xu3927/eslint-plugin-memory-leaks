/**
 * @fileoverview eslint-plugin-memory-leaks
 * @author eslint-plugin-memory-leaks
 */

const eslintUtils = require('eslint-utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const bindMethodNames = ['on', 'addListener', 'addListeners', 'addEventListener', 'register']
const unbindMethodNames = ['off', 'removeListener', 'removeListeners', ' removeEventListener', 'removeEvent', 'unRegister']
const unbindAllMethodNames = ['removeAllListeners']

/**
 *  是否有解绑的方法, 依赖ts类型解析
 * @param node {} ast 节点
 * @param typeChecker {} @typescript-eslint/parser 解析器的方法
 */
const hasUnbindMethod = (node, typeChecker) => {
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
    const type = typeChecker.getTypeAtLocation(tsNode);
    const allUnbindMethodNames = [...unbindMethodNames, ...unbindAllMethodNames]
    for (let i = 0; i < allUnbindMethodNames.length; i++) {
        const propName = allUnbindMethodNames[i]
        if (type.getProperty(propName)) {
            return true
        }
    }
    return false
}

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
            lackOfUnbind: `event '{{eventName}}' was bind with handler '{{handler}}' but never unbind.`,
        },

    },
    create(context) {
        const singletons = []
        // const parserServices = context.parserServices;
        // const typeChecker = parserServices.program.getTypeChecker();
        const bindListeners = {}
        const unbindListeners = {}
        const unbindAllListeners = new Set()

        return {
            ExportNamedDeclaration: function (node) {
                if (
                    node.declaration &&
                    node.declaration.type === 'VariableDeclaration' &&
                    node.declaration.declarations.length > 0
                ) {
                    const declaration = node.declaration.declarations[0];
                    if (
                        declaration.init &&
                        declaration.init.type === 'NewExpression' &&
                        declaration.init.callee.type === 'Identifier'
                    ) {
                        singletons.push(node)
                    }
                }
            },
            CallExpression(node) {
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier'
                ) {
                    const propertyName = node.callee.property.name
                    const eventName = node.arguments[0].value;
                    const handlerName = node.arguments && node.arguments[1] ? eslintUtils.getPropertyName(node.arguments[1]) : '';
                    if (eventName && unbindMethodNames.includes(propertyName)) {
                        unbindAllListeners.add(eventName)
                    } else if (eventName && handlerName && bindMethodNames.includes(propertyName)) {
                        if (!bindListeners[eventName]) {
                            bindListeners[eventName] = [];
                        }
                        bindListeners[eventName].push({ handlerName: handlerName, node: node });
                    } else if (eventName && handlerName && unbindAllMethodNames.includes(propertyName)) {
                        if (!unbindAllMethodNames[eventName]) {
                            unbindAllMethodNames[eventName] = new Set();
                        }
                        unbindAllMethodNames[eventName].add(handlerName);
                    }
                }
            },

            'Program:exit'() {
                for (const [eventName, handlers] of Object.entries(bindListeners)) {
                    if (!unbindAllListeners.has(eventName)) {
                        handlers.forEach((data) => {
                            const { handlerName, node } = data
                            if (!unbindListeners[eventName] || !unbindListeners[eventName].has(handlerName)) {
                                context.report({
                                    node: node,
                                    messageId: 'lackOfUnbind',
                                    data: {
                                        eventName,
                                        handler: handlerName
                                    }
                                });
                            }
                        });
                    }
                }
            },
        };
    },
}
