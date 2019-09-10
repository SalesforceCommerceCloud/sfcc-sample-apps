const { docUrl } = require('./doc-url');

// TODO: change to 'aura-compat'
const AURA_COMPAT = 'aura';

function noAuraCompatRule(method, ruleName) {
    return {
        meta: {
            docs: {
                description: `disallow import of "${method}" from "${AURA_COMPAT}"`,
                category: 'LWC',
                url: docUrl(ruleName),
            },
            schema: [],
        },

        create(context) {
            return {
                ImportDeclaration(node) {
                    const source = node.source.value;
                    if (source !== AURA_COMPAT) {
                        return;
                    }

                    for (const specifier of node.specifiers) {
                        if (specifier.type === 'ImportSpecifier') {
                            const imported = specifier.imported;
                            if (imported.name === method) {
                                context.report({
                                    node: imported,
                                    message:
                                        "Do not use '" + imported.name + "' from '" + source + "'",
                                });
                            }
                        }
                    }
                },
            };
        },
    };
}

function noAuraModuleRule(module, ruleName) {
    return {
        meta: {
            docs: {
                description: `disallow import of "${module}"`,
                category: 'LWC',
                url: docUrl(ruleName),
            },
            schema: [],
        },

        create(context) {
            return {
                ImportDeclaration(node) {
                    const source = node.source.value;
                    if (source !== module) {
                        return;
                    }

                    if (node.specifiers.length === 0) {
                        context.report({
                            node: node,
                            message: "Do not import the entire '" + source + "' module",
                        });
                        return;
                    }

                    for (const specifier of node.specifiers) {
                        if (specifier.type == 'ImportDefaultSpecifier') {
                            context.report({
                                node: specifier,
                                message: "Do not import the default export from '" + source + "'",
                            });
                        } else if (specifier.type == 'ImportNamespaceSpecifier') {
                            context.report({
                                node: specifier,
                                message: "Do not import the entire '" + source + "' module",
                            });
                        }
                    }
                },
            };
        },
    };
}

module.exports = {
    AURA_COMPAT,
    noAuraCompatRule,
    noAuraModuleRule,
};
