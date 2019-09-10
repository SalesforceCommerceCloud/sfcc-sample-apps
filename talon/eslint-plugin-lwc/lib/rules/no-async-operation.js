'use strict';

const { docUrl } = require('../util/doc-url');

const GLOBAL_OBJECT = 'window';

const RESTRICTED_ASYNC_OPERATIONS = new Set(['setTimeout', 'setInterval', 'requestAnimationFrame']);

module.exports = {
    meta: {
        docs: {
            description: 'restrict usage of async operations',
            category: 'LWC',
            recommended: true,
            url: docUrl('no-async-operation'),
        },

        schema: [],
    },

    create(context) {
        function isGlobal(node, name) {
            // Early exit if the node is not an identifier nor match the name.
            if (node.type === 'Identifier' && node.name !== name) {
                return false;
            }

            // Retrieve the identifier in the context of the current scope
            const scope = context.getScope();
            const ref = scope.references.find(r => r.identifier === node);

            // If the reference is not resolved, or if it is resolved in the global scope it means the
            // identifier is global. ESLint automatically add global properties in the global scope
            // depending on the env config.
            // eg. "browser": true will automatically inject "window" and "setTimeout" in the global scope.
            return ref && (ref.resolved === null || ref.resolved.scope.type === 'global');
        }

        return {
            CallExpression(node) {
                // Check for direct invocation of global restricted APIs.
                // eg. setTimeout() or requestAnimationFrame();
                for (let operation of RESTRICTED_ASYNC_OPERATIONS) {
                    if (isGlobal(node.callee, operation)) {
                        context.report({
                            node,
                            message: `Restricted async operation "${node.callee.name}"`,
                        });
                    }
                }

                // Check for invocation of restricted APIs accessed via the global object.
                // eg. window.setTimeout() or window["setTimeout"]();
                if (node.callee.type === 'MemberExpression') {
                    const { object, property } = node.callee;

                    const isObjectGlobalObject = isGlobal(object, GLOBAL_OBJECT);
                    const isPropertyRestrictedApi =
                        (property.type === 'Identifier' &&
                            RESTRICTED_ASYNC_OPERATIONS.has(property.name)) ||
                        (property.type === 'Literal' &&
                            RESTRICTED_ASYNC_OPERATIONS.has(property.value));

                    if (isObjectGlobalObject && isPropertyRestrictedApi) {
                        context.report({
                            node,
                            message: `Restricted async operation "${property.name ||
                                property.value}"`,
                        });
                    }
                }
            },
        };
    },
};
