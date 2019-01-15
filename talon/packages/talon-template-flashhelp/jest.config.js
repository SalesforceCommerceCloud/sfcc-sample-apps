module.exports = {
    displayName: "talon-template-flashhelp",
    preset: "lwc-jest-preset",
    moduleNameMapper: {
        "^(talon)/(.+)$": "<rootDir>/../talon-framework/src/modules/$1/$2/$2",
        "^(community_flashhelp)/(.+)$": "<rootDir>/src/modules/$1/$2/$2",
        "^(lightning)/(.+)$": "<rootDir>/src/jest-modules/$1/$2/$2",
        "^@salesforce/apex/(.+)$": "<rootDir>/src/jest-modules/salesforce/apex.js",
    },
    testURL: "https://localhost"
};
