'use strict';

const { docUrl } = require('../util/doc-url');

const WIRE_DECORATOR_IDENTIFIER = 'wire';

module.exports = {
    meta: {
        docs: {
            description: 'validate wire decorator usage',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-wire'),
        },

        schema: [],
    },

    create(context) {
        return {
            Decorator(node) {
                const { expression, parent } = node;

                if (
                    expression.type === 'Identifier' &&
                    expression.name === WIRE_DECORATOR_IDENTIFIER
                ) {
                    context.report({
                        node,
                        message: `"@wire" decorators need to be invoked with a wire adapter as first argument.`,
                    });
                }

                if (
                    expression.type === 'CallExpression' &&
                    expression.callee.type === 'Identifier' &&
                    expression.callee.name === WIRE_DECORATOR_IDENTIFIER
                ) {
                    const [wireAdapter, wireConfig] = expression.arguments;

                    if (wireAdapter === undefined || wireAdapter.type !== 'Identifier') {
                        // If the wire adapter is present report the error on this node, otherwise
                        // report the error on the wire decorator call expression
                        const incriminatedNode = wireAdapter || node;

                        context.report({
                            node: incriminatedNode,
                            message: `"@wire" decorators expect the identifier of an adapter to be passed as first argument.`,
                        });
                    }

                    if (wireConfig && wireConfig.type !== 'ObjectExpression') {
                        context.report({
                            node: wireConfig,
                            message: `"@wire" decorators expect a configuration as an object expression as second argument.`,
                        });
                    }

                    if (parent.static) {
                        context.report({
                            node,
                            message: `"@wire" decorators can't be applied to static properties.`,
                        });
                    }

                    if (
                        (parent.type !== 'ClassProperty' && parent.type !== 'MethodDefinition') ||
                        (parent.type === 'MethodDefinition' && parent.kind !== 'method')
                    ) {
                        context.report({
                            node,
                            message: `"@wire" decorators can only be applied to class field and methods.`,
                        });
                    }
                }
            },
        };
    },
};
