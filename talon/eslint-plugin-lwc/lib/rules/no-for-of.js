'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow usage of the for-of syntax',
            category: 'LWC',
            url: docUrl('no-for-of'),
        },
        schema: [],
    },

    create(context) {
        return {
            ForOfStatement(node) {
                context.report({
                    node,
                    message: 'Invalid usage of for-of.',
                });
            },
        };
    },
};
