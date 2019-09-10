'use strict';

const { docUrl } = require('../util/doc-url');

const RESTRICTED_QUERY_OPERATIONS = new Set([
    'querySelector',
    'querySelectorAll',
    'getElementsByClassName',
    'getElementsByName',
    'getElementsByTagName',
    'getElementsByTagNameNS',
    'getElementById',
]);

module.exports = {
    meta: {
        docs: {
            description: 'disallow DOM query at the document level.',
            category: 'LWC',
            url: docUrl('no-document-query'),
        },
        schema: [],
    },

    create(context) {
        return {
            CallExpression(node) {
                const { callee } = node;

                if (callee.type === 'MemberExpression') {
                    const { object, property } = callee;

                    const isDocument =
                        (object.type === 'Identifier' && object.name === 'document') ||
                        (object.type === 'MemberExpression' &&
                            object.property.type === 'Identifier' &&
                            object.property.name === 'document');
                    const isRestrictedQueryOperation =
                        property.type === 'Identifier' &&
                        RESTRICTED_QUERY_OPERATIONS.has(property.name);

                    if (isDocument && isRestrictedQueryOperation) {
                        context.report({
                            node,
                            message: `Invalid usage of "${
                                property.name
                            }". DOM query at the document level is forbidden.`,
                        });
                    }
                }
            },
        };
    },
};
