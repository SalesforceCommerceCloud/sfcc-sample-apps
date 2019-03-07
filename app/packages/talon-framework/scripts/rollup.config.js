/* eslint-env node */
import * as fs from 'fs';
import * as path from 'path';
import replace from 'rollup-plugin-replace';
import lwcCompiler from 'rollup-plugin-lwc-compiler';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import strip from 'rollup-plugin-strip';
import hash from 'rollup-plugin-hash';
import babel from '@babel/core';
import minify from 'babel-preset-minify';

import { getOutputConfigs, getResourceUrl } from '@sfcc-dev/talon-common';

const PROD_MODES = ['prod', 'prod_compat'];
const ROOT = path.resolve(__dirname, '..');
const SRC = `${ROOT}/src`;
const DIST = `${ROOT}/dist`;

// write resources.json on exit
const resources = { 'framework://talon': {} };

const minifyBabelConfig = {
    babelrc: false,
    comments: false,
    sourceMaps: false,
    presets: [minify],
};

function inlineMinifyPlugin() {
    return {
        transformBundle(code) {
            return babel.transform(code, minifyBabelConfig);
        }
    };
}

function getConfig({ mode }) {
    const isProduction = PROD_MODES.includes(mode);

    const url = getResourceUrl('framework://talon', mode, '[hash:10]');

    const plugins = [
        hash({
            dest: `${DIST}/public${url}`,
            replace: true,
            algorithm: 'md5',
            callback: (fileName) => {
                // get the uid/hash from the filename and add it to the resource map
                const uid = fileName.split('/').splice(-3)[0];
                resources['framework://talon'][mode] = uid;
                fs.writeFileSync(`${DIST}/resources.json`, JSON.stringify(resources, null, 4));
            }
        }),
        lwcCompiler({ resolveFromPackages: true, mapNamespaceFromPath: true, mode, exclude: ['/**/*.mjs'] }),
        replace({ 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"'}),
        nodeResolve(),
        commonjs(),
        // TODO: our custom assert still being called here for prod mode
        isProduction && strip({functions: ['console.log', 'assert.*']}),
        isProduction && inlineMinifyPlugin()
    ];

    return {
        input: `${SRC}/index.js`,
        output: {
            file: `talon.js (${mode})`,
            format: 'umd',
            name: 'Talon'
        },
        plugins
    };
}

export default getOutputConfigs(process.env.MODE).map(getConfig);
