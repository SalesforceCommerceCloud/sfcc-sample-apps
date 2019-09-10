'use strict';

const { docUrl } = require('../util/doc-url');

const API_DECORATOR_IDENTIFIER = 'api';

/**
 * Set of APIs that we reserved for forward compatibility of LWC.
 */
const RESERVED_PUBLIC_PROPERTIES = new Set(['slot', 'part']);

/**
 * Maps containing attributes that have a camelCased property mapping. We do not want users
 * to define @api properties with these names since the engine will use the camelCased version.
 */
const AMBIGUOUS_ATTRIBUTES = new Map([
    ['bgcolor', 'bgColor'],
    ['accesskey', 'accessKey'],
    ['contenteditable', 'contentEditable'],
    ['contextmenu', 'contextMenu'],
    ['tabindex', 'tabIndex'],
    ['maxlength', 'maxLength'],
    ['maxvalue', 'maxValue'],
]);

function isApiDecorator(node) {
    return (
        node.type === 'Decorator' &&
        node.expression.type === 'Identifier' &&
        node.expression.name === API_DECORATOR_IDENTIFIER
    );
}

function validateUniqueness(classBody, context) {
    const { body } = classBody;

    const publicProperties = body.filter(
        property => property.decorators && property.decorators.some(isApiDecorator),
    );

    const seenPublicProperties = new Set();
    for (let property of publicProperties) {
        const { key } = property;
        if (key && key.type === 'Identifier') {
            const { name } = key;
            if (!seenPublicProperties.has(name)) {
                seenPublicProperties.add(name);
            } else {
                context.report({
                    node: property,
                    message: `"${name}" has already been declared as a public property.`,
                });
            }
        }
    }
}

function validatePropertyName(property, context) {
    const { name } = property;

    if (name.startsWith('on') && name === name.toLowerCase()) {
        context.report({
            node: property,
            message: `Invalid public property "${name}". Properties starting with "on" are reserved for event handlers.`,
        });
    }

    if (name.startsWith('data')) {
        context.report({
            node: property,
            message: `Invalid public property "${name}". Properties starting with "data" are reserved properties.`,
        });
    }

    if (RESERVED_PUBLIC_PROPERTIES.has(name)) {
        context.report({
            node: property,
            message: `Invalid public property "${name}". This property name is a reserved property.`,
        });
    }

    if (AMBIGUOUS_ATTRIBUTES.has(name)) {
        const message = [
            `Ambiguous public property "${name}".`,
            `Consider renaming the property to it's camelCased version "${AMBIGUOUS_ATTRIBUTES.get(
                name,
            )}".`,
        ].join(' ');
        context.report({
            node: property,
            message,
        });
    }
}

function validatePropertyValue(property, value, context) {
    const { name } = property;

    if (value.type === 'Literal' && value.raw === 'true') {
        const message = [
            `Invalid public property initialization for "${name}". Boolean public properties should not be initialized to "true",`,
            `consider initializing the property to "false".`,
        ].join(' ');

        context.report({
            node: value,
            message,
        });
    }
}

module.exports = {
    meta: {
        docs: {
            description: 'validate api decorator usage',
            category: 'LWC',
            recommended: true,
            url: docUrl('valid-api'),
        },

        schema: [],
    },

    create(context) {
        return {
            ClassBody(node) {
                validateUniqueness(node, context);
            },

            Decorator(node) {
                const { expression, parent } = node;

                if (
                    expression.type === 'CallExpression' &&
                    expression.callee.type === 'Identifier' &&
                    expression.callee.name === API_DECORATOR_IDENTIFIER
                ) {
                    context.report({
                        node,
                        message: `"@api" decorators don't support argument.`,
                    });
                }

                if (isApiDecorator(node)) {
                    if (parent.key.type === 'Identifier') {
                        validatePropertyName(parent.key, context);
                    }

                    if (
                        parent.key.type === 'Identifier' &&
                        parent.type === 'ClassProperty' &&
                        parent.value
                    ) {
                        validatePropertyValue(parent.key, parent.value, context);
                    }

                    if (parent.static) {
                        context.report({
                            node,
                            message:
                                '"@api" decorators can only be applied to class fields and methods.',
                        });
                    }
                }
            },
        };
    },
};
