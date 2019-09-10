'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow usage of "$A"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-aura'),
        },

        schema: [],
    },

    create(context) {
        return {
            Identifier(node) {
                if ('$A' === node.name) {
                    context.report({
                        node: node,
                        message: 'Do not use $A in LWC code',
                    });
                }
            },
        };
    },
};
