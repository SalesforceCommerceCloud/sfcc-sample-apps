module.exports = {
    displayName: "talon-framework",
    preset: "lwc-jest-preset",
    moduleNameMapper: {
        "^(talon)/(.+)$": "<rootDir>/src/modules/$1/$2/$2"
    },
    testURL: "https://localhost"
};