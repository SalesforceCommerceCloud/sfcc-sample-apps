/* eslint-env node */
const path = require( 'path' );
const resolve = require( 'rollup-plugin-node-resolve' );
const commonjs = require( 'rollup-plugin-commonjs' );

const input = path.resolve( __dirname, '../src/libs.js' );
const output = path.resolve( __dirname, `../public/js/libs.js` );

const plugins = [
    resolve( {
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    } ),
    commonjs()
];

module.exports = [ {
    input,
    output: {
        file: output,
        format: 'iife',
    },
    plugins
} ];
