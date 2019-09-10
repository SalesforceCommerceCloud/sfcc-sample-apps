'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        deprecated: true,

        docs: {
            description: 'disallow usage of "setInterval"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-set-interval'),
        },

        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                if ('setInterval' === node.callee.name) {
                    context.report({
                        node: node,
                        message: "Using 'setInterval' is not allowed for performance reasons",
                    });
                }
            },
        };
    },
};
