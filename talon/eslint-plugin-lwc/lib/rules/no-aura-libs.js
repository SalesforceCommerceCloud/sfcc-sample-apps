'use strict';

const { docUrl } = require('../util/doc-url');

module.exports = {
    meta: {
        docs: {
            description: 'disallow import of Aura libraries',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-aura-libs'),
        },

        schema: [],
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (source && source.indexOf(':') != -1) {
                    context.report({
                        node: node,
                        message: 'Do not use an aura library from LWC: ' + source,
                    });
                }
            },
        };
    },
};
