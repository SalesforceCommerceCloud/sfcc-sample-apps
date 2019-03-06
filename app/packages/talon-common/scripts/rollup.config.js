/* eslint-env node */
const path = require('path');

function getConfig(format) {
    return {
        input: path.resolve(__dirname, '../src/index.js'),
        output: {
            file: path.resolve(__dirname, `../dist/${format}.js`),
            format
        }
    };
}

export default [
    getConfig('es'),
    getConfig('cjs'),
];