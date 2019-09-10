module.exports = {
    plugins: ['import', 'jest'],

    extends: [
        'plugin:lwc/base',
        'eslint:recommended', // https://eslint.org/docs/rules/
        'plugin:import/errors', // https://github.com/benmosher/eslint-plugin-import
        'plugin:jest/recommended', // https://github.com/jest-community/eslint-plugin-jest
    ],

    env: {
        jest: true,
    },

    globals: {
        // used to mock calls to global variables in jest tests
        global: true,
    },

    rules: {
        // Possible errors
        // https://eslint.org/docs/rules/#possible-errors
        'no-await-in-loop': 2,

        // Best practices
        // https://eslint.org/docs/rules/#best-practices
        'array-callback-return': 2,
        'consistent-return': 2,
        'default-case': 2,
        'dot-notation': [2, { allowKeywords: true }],
        eqeqeq: [2, 'smart'],
        'guard-for-in': 2,
        'no-alert': 2,
        'no-caller': 2,
        'no-else-return': 2,
        'no-empty-function': [
            2,
            {
                allow: ['arrowFunctions', 'functions', 'methods'],
            },
        ],
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-floating-decimal': 2,
        'no-implied-eval': 2,
        'no-iterator': 2,
        'no-labels': 2,
        'no-loop-func': 2,
        'no-multi-str': 2,
        'no-new': 2,
        'no-new-func': 2,
        'no-new-object': 2,
        'no-new-wrappers': 2,
        'no-octal-escape': 2,
        'no-proto': 2,
        'no-return-assign': 2,
        'no-return-await': 2,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-throw-literal': 2,
        'no-useless-concat': 2,
        'no-useless-escape': 2,
        'no-useless-return': 2,
        'no-unused-expressions': 2,
        'no-void': 2,
        'no-with': 2,
        radix: 2,
        'vars-on-top': 2,
        'wrap-iife': [2, 'any'],

        // Variables
        // https://eslint.org/docs/rules/#variables
        'no-label-var': 2,
        'no-restricted-globals': [
            2,
            {
                name: 'event',
                message:
                    'Use local parameter instead of accessing the current event out of the global object.',
            },
        ],
        'no-shadow': 2,
        'no-shadow-restricted-names': 2,
        'no-undef-init': 2,
        'no-unused-vars': [2, { vars: 'all', args: 'after-used' }],
        'no-use-before-define': [2, { functions: false }],

        // NodeJs style
        // https://eslint.org/docs/rules/#nodejs-and-commonjs
        'handle-callback-err': 2,

        // ES6
        // https://eslint.org/docs/rules/#ecmascript-6
        'no-confusing-arrow': 2,
        'no-useless-computed-key': 2,
        'no-useless-constructor': 2,
        'no-useless-rename': 2,

        // Stylistic Issues
        // https://eslint.org/docs/rules/#stylistic-issues
        'no-array-constructor': 2, // help with instanceof

        // LWC specific rules
        'lwc/no-inner-html': 2,
        'lwc/no-document-query': 2,

        // Disable unresolved import rule since it doesn't work well with the way the LWC compiler
        // resolves the different modules
        'import/no-unresolved': 0,
    },
};
