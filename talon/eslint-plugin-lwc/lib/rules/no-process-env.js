'use strict';

const { docUrl } = require('../util/doc-url');

function processDeclaredInScope(scope) {
    return (
        scope.variables.find(variable => {
            return variable.name === 'process';
        }) !== undefined
    );
}

function validateProcessUsage(node, envIdentifier, propertyIdentifier, context) {
    // No local process variables being referenced
    if (!processDeclaredInScope(context.getScope())) {
        if (!envIdentifier) {
            // Block references to process
            context.report({
                node,
                message: `process is not allowed in LWC code`,
            });
        } else if (!propertyIdentifier) {
            // Block references to process.XX
            context.report({
                node,
                message: `process.${envIdentifier.name} is not allowed in LWC code`,
            });
        } else if (propertyIdentifier.name) {
            // Block references to process.XX.XX
            context.report({
                node,
                message: `process.${envIdentifier.name}.${
                    propertyIdentifier.name
                } is not allowed in LWC code`,
            });
        }
    }
}

module.exports = {
    meta: {
        docs: {
            description: 'restrict usage of the "process" global object',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-process-env'),
        },

        schema: [],
    },

    create(context) {
        return {
            'ExpressionStatement > Identifier': node => {
                if (node.name !== 'process') {
                    return;
                }
                if (!processDeclaredInScope(context.getScope())) {
                    context.report({
                        node: node,
                        message: 'process is not allowed in LWC code',
                    });
                }
            },
            MemberExpression(node) {
                const objectName = node.object.name;
                const propertyName = node.property.name;
                // process.XX.XX
                if (objectName === 'process') {
                    validateProcessUsage(node, node.property, node.parent.property, context);
                    // global.process.XX.XX
                } else if (objectName === 'global' && propertyName === 'process') {
                    validateProcessUsage(
                        node,
                        node.parent && node.parent.property,
                        node.parent.parent.property,
                        context,
                    );
                }
            },
        };
    },
};
