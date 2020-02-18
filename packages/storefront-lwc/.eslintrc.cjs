const baseConfig = require("sfcc-base/eslint.config.js");

module.exports = {
    ...baseConfig,
    globals: {
        ...baseConfig.globals,
        anotherGlobal: true,
    },
    plugins: ["@lwc/eslint-plugin-lwc", ...baseConfig.plugins],
    rules: {
        "@lwc/lwc/no-deprecated": "error",
        "@lwc/lwc/valid-api": "error",
        "@lwc/lwc/no-document-query": "error",
        ...baseConfig.rules,
    },
    env: {
        ...baseConfig.env,
        browser: true
    }
};
