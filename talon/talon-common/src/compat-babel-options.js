/**
 * Babel options used to compile in compat mode.
 * See browser compatilibity here: https://opensource.salesforce.com/es5-proxy-compat/website/.
 *
 * This module has dependencies on @babel/preset-env and the required plugins,
 * consuming packages don't need to declare these dependencies again.
 */
export const compatBabelOptions = {
    "babelrc": false,
    "presets": [
        ["@babel/preset-env",
            {
                "modules": false,
                "targets": {
                    "chrome": "30",
                    "ie": "11",
                    "edge": "13",
                    "firefox": "32",
                    "safari": "9"
                }
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-transform-regenerator"
    ]
};
