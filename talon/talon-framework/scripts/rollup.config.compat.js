/* eslint-env node */
import { compatBabelOptions } from 'talon-common';
import * as fs from 'fs';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import codeSize from './rollup-plugin-code-size';

import { envGetPolyfills } from 'es5-proxy-compat';
const ecmaPolyfills = envGetPolyfills();

const fetchPolyfill = fs.readFileSync(require.resolve('whatwg-fetch'), 'utf8');

function polyfills() {
    return {
        renderChunk(code) {
            return ecmaPolyfills + fetchPolyfill + code;
        }
    };
}

/**
 * Generate compat.js file containing:
 *      - es5-proxy-compat polyfills
 *      - @babel/runtime helpers and regenerator
 *      - fetch polyfill
 *
 * The generated file is then used in rollup.config.framework.js
 * which bundles compat.js in talon.js when applicable.
 */
export default {
    input: 'src/compat.js',
    output: {
        file: 'dist/compat.js',
        format: 'iife',
        name: 'TalonCompat'
    },
    plugins: [
        resolve(),
        babel(compatBabelOptions),
        polyfills(),
        codeSize()
    ]
};
