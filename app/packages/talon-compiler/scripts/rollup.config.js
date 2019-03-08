/* eslint-env node */
const path = require('path');
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

module.exports = {
    input: path.resolve(__dirname, '../src/handlebars-helpers.js'),
    output: {
        file: path.resolve(__dirname, '../dist/handlebars-helpers.js'),
        format: 'iife',
        strict: false,
        name: 'handlebarsHelpers',
        globals: {
            handlebars: 'Handlebars'
        }
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            "presets": [[
                "@babel/preset-env",
                {
                    "modules": false,
                    "targets": {
                        "ie": "7"
                    }
                }
            ]],
            "plugins": [
                "@babel/plugin-proposal-object-rest-spread"
            ],
            "comments": false
        })
    ],
    external: ['handlebars']
};