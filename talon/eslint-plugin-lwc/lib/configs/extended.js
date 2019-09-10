module.exports = {
    plugins: ['compat'],

    extends: ['plugin:lwc/recommended'],

    settings: {
        browsers: ['Chrome >= 59', 'Edge >= 15', 'Firefox >= 54', 'Safari >= 11'],
    },

    rules: {
        // LWC COMPAT performance restrictions
        'lwc/no-async-await': 2,
        'lwc/no-for-of': 2,
        'lwc/no-rest-parameter': 2,

        // Restrict usage of certain browser APIs based on Salesforce supported browsers
        // https://github.com/amilajack/eslint-plugin-compat
        'compat/compat': 2,
    },
};
