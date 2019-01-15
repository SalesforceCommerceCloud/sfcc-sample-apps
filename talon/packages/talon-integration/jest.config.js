module.exports = {
    preset: "jest-puppeteer",
    globalSetup: "<rootDir>/scripts/global-setup.js",
    globalTeardown: "<rootDir>/scripts/global-teardown.js",
    globals: {
        port: 4444
    },
    setupTestFrameworkScriptFile: "<rootDir>/scripts/setup-test-framework.js"
};