'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        deprecated: true,

        docs: {
            description: 'disallow usage of "requestAnimationFrame"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-raf'),
        },

        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                if (node.callee.type === 'MemberExpression') {
                    if (
                        node.callee.object.type === 'Identifier' &&
                        node.callee.object.name === 'window' &&
                        node.callee.property.type === 'Identifier' &&
                        node.callee.property.name == 'requestAnimationFrame'
                    ) {
                        context.report({
                            node: node,
                            message:
                                "Using 'requestAnimationFrame' is not allowed for performance reasons",
                        });
                    }
                }
            },
        };
    },
};
