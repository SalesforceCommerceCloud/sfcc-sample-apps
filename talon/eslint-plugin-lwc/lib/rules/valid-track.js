'use strict';

const { docUrl } = require('../util/doc-url');

const TRACK_DECORATOR_IDENTIFIER = 'track';

module.exports = {
    meta: {
        docs: {
            description: 'validate track decorator usage',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-track'),
        },

        schema: [],
    },

    create(context) {
        return {
            Decorator(node) {
                const { expression, parent } = node;

                if (
                    expression.type === 'CallExpression' &&
                    expression.callee.type === 'Identifier' &&
                    expression.callee.name === TRACK_DECORATOR_IDENTIFIER
                ) {
                    context.report({
                        node,
                        message: `"@track" decorators don't support argument`,
                    });
                }

                if (
                    expression.type === 'Identifier' &&
                    expression.name === TRACK_DECORATOR_IDENTIFIER
                ) {
                    if (
                        parent.type !== 'ClassProperty' ||
                        (parent.type === 'ClassProperty' && parent.static) ||
                        (parent.type === 'ClassProperty' && parent.kind !== undefined)
                    ) {
                        context.report({
                            node,
                            message: '"@track" decorators can only be applied to class fields',
                        });
                    }
                }
            },
        };
    },
};
