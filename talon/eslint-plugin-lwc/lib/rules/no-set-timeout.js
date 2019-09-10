'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        deprecated: true,

        docs: {
            description: 'disallow usage of "setTimeout"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-set-timeout'),
        },

        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                if ('setTimeout' === node.callee.name) {
                    context.report({
                        node: node,
                        message: "Using 'setTimeout' is not allowed for performance reasons",
                    });
                }
            },
        };
    },
};
