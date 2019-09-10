'use strict';

const { docUrl } = require('../util/doc-url');

const WIRE_SERVICE = 'wire-service';

module.exports = {
    meta: {
        docs: {
            description: 'disallow import of "wire-service"',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-wire-service'),
        },

        schema: [],
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (source !== WIRE_SERVICE) {
                    return;
                }

                context.report({
                    node: node,
                    message: "Do not import the '" + source + "' module",
                });
                return;
            },
        };
    },
};
