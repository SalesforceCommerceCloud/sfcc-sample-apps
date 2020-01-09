/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/* eslint-env node */
const path = require( 'path' );
const resolve = require( 'rollup-plugin-node-resolve' );
const builtins = require( 'rollup-plugin-node-builtins' );
const globals = require( 'rollup-plugin-node-globals' );
const commonjs = require( 'rollup-plugin-commonjs' );

const input = path.resolve( __dirname, '../src/libs.js' );
const output = path.resolve( __dirname, `../src/public/assets/js/libs.js` );

const plugins = [
    builtins(),
    globals(),
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
