module.exports = {
    projects: [
        "packages/talon-common",
        "packages/talon-compiler",
        "packages/talon-framework",
        "packages/talon-template-flashhelp"
    ],
    coverageThreshold: {
        "global": {
            "statements": 90,
            "branches": 75,
            "functions": 90,
            "lines": 90
        }
    },
    collectCoverageFrom: [
        "**/src/**/*.{js}",
        "!**/node_modules/**",
        "!**/src/index.js",
        '!**/src/modules/talon/intlLibrary/**',
        '!**/src/modules/talon/auraInstrumentation/**',
        '!**/src/modules/community_flashhelp/form/**',
        "!**/__tests__/**",
        "!**/jest-modules/**"
    ],
    testResultsProcessor: "<rootDir>/node_modules/jest-html-reporter",
    testURL: "https://localhost",
    testRegex: "/__tests__/.*.test.js$"
};