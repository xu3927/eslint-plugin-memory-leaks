/**
 * @fileoverview eslint-plugin-memory-leaks
 * @author eslint-plugin-memory-leaks
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require delete properties bound to the global window object',
      category: 'Possible Errors',
      recommended: true,  
    },
    fixable: null, // 根据实际情况，可以提供自动修复或设置为null 
    schema: [], // no options  
    messages: {
      requireClearGlobalProperty: `Window property {{propertyName}} was set but not cleared in this file.`,
    },
    
  },
  create: function (context) {
    const windowProperties = new Set();
    const deleteProperties = new Set();
    const emptyValueProperties = new Set()

    return {
      AssignmentExpression: function (node) {
        if (
          node.left.type === 'MemberExpression' &&
          node.left.object.name === 'window' &&
          node.left.property.type === 'Identifier'
        ) {
          if (!['TemplateLiteral', 'Literal', 'TaggedTemplateExpression'].includes(node.right.type)) {
            windowProperties.add(node);
          }
          const isEmptyValue = ['Literal', 'TemplateLiteral'].includes(node.right.type)
            && (node.right.value === null || node.right.value === '')
          const isEmptyArray = node.right.type === 'ArrayExpression' && node.right.elements.length === 0
          const isEmptyObject = node.right.type === 'ObjectExpression' && node.right.properties.length === 0
          if (isEmptyValue || isEmptyArray || isEmptyObject) {
            emptyValueProperties.add(node.left.property.name)
          }
        }
      },
      UnaryExpression(node) {
        // 确保是 delete 操作  
        if (node.operator === 'delete') {
          // 检查 delete 操作的参数是否涉及 window 对象的属性  
          if (node.argument.type === 'MemberExpression' && node.argument.object.name === 'window') {
            deleteProperties.add(node.argument.property.name)
          }
        }
      },  
      'Program:exit': function () {
        // console.log(windowProperties, deleteProperties, emptyValueProperties);
        windowProperties.forEach((node) => {
          const propertyName = node.left.property.name
          if (!deleteProperties.has(propertyName) && !emptyValueProperties.has(propertyName)) {
            context.report({
              node: node, // No specific node to highlight
              messageId: 'requireClearGlobalProperty',
              data: {
                propertyName: propertyName
              }
            });
          }
        });
      },
    };
  }  
}
