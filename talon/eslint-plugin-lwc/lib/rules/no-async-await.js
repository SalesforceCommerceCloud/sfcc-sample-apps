'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow usage of the async-await syntax',
            category: 'LWC',
            url: docUrl('no-async-await'),
        },
        schema: [],
    },

    create(context) {
        const reportAsyncAwait = node => {
            if (node.async) {
                context.report({
                    node,
                    message: 'Invalid usage of async-await.',
                });
            }
        };

        return {
            FunctionDeclaration: reportAsyncAwait,
            FunctionExpression: reportAsyncAwait,
            ArrowFunctionExpression: reportAsyncAwait,
        };
    },
};
