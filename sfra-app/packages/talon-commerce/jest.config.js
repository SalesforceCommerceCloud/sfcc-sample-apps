module.exports = {
    displayName: "talon-commerce",
    preset: "lwc-jest-preset",
    moduleNameMapper: {
        "^(community_talon)/(.+)$": "<rootDir>/../talon-framework/src/modules/$1/$2/$2",
        "^(commerce)/(.+)$": "<rootDir>/src/modules/$1/$2/$2",
        "^(lightning)/(.+)$": "<rootDir>/src/jest-modules/$1/$2/$2",
        "^@salesforce/apex/(.+)$": "<rootDir>/src/jest-modules/salesforce/apex.js",
    },
    testURL: "https://localhost"
};
