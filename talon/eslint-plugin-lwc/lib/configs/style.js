module.exports = {
    extends: ['./configs/defaults.js'],

    rules: {
        // Best practices
        // https://eslint.org/docs/rules/#best-practices
        'array-bracket-spacing': 2,
        'block-scoped-var': 2,
        'block-spacing': 2,
        complexity: [2, 24],
        'computed-property-spacing': 2,
        curly: [2, 'all'],
        'linebreak-style': 2,
        'new-cap': [2, { capIsNewExceptionPattern: 'Mixin$' }],
        'no-continue': 2,
        'no-lone-blocks': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multiple-empty-lines': 2,
        'no-restricted-syntax': [
            2,
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        'no-tabs': 2,
        'operator-assignment': 2,
        'padded-blocks': [2, 'never'],
        'space-before-blocks': 2,
        'space-in-parens': 2,
        'space-infix-ops': 2,
        'spaced-comment': 2,
        'unicode-bom': 2,
        yoda: [2, 'never'],

        // Stylistic issues
        // https://eslint.org/docs/rules/#stylistic-issues
        'brace-style': [2, '1tbs'],
        camelcase: [2, { allow: ['.+__.+'] }],
        'comma-spacing': 2,
        'comma-style': 2,
        'consistent-this': [2, 'that'],
        'func-call-spacing': 2,
        'keyword-spacing': 2,
        'no-lonely-if': 2,
        'no-mixed-operators': 2,
        'space-before-function-paren': [
            2,
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'no-trailing-spaces': 2,
        'semi-spacing': [2, { before: false, after: true }],
        semi: 2,
        'space-unary-ops': [2, { words: true, nonwords: false }],

        // ES6
        // https://eslint.org/docs/rules/#ecmascript-6
        'arrow-spacing': 2,
        'generator-star-spacing': 2,
        'no-var': 2,
        'object-shorthand': 2,
        'prefer-arrow-callback': 2,
        'prefer-const': 2,
        'prefer-numeric-literals': 2,
        'rest-spread-spacing': 2,
        'symbol-description': 2,
        'template-curly-spacing': 2,
        'yield-star-spacing': 2,
    },
};
