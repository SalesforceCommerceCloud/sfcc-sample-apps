module.exports = {
    displayName: "talon-common",
    transform: {
      "^.+\\.js$": "babel-jest"
    },
    moduleFileExtensions: [
      "js", "json"
    ],
    moduleDirectories: [
      "node_modules",
      "src"
    ],
    testURL: "https://localhost",
    testRegex: "/__tests__/.*.test.js$"
};