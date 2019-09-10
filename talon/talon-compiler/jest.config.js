module.exports = {
    displayName: "talon-compiler",
    moduleFileExtensions: [
      "js", "json"
    ],
    moduleDirectories: [
      "node_modules",
      "src"
    ],
    moduleNameMapper: {
      "test-talon-context": "<rootDir>/src/__mocks__/test-talon-context.js"
    },
    testEnvironment: "node",
    testURL: "https://localhost",
    testRegex: "/__tests__/.*.test.js$"
};