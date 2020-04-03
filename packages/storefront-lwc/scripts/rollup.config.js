const cleanup = require('./plugin-cleanup');
const html = require('./plugin-html');
const copyAssets = require('./plugin-copy-assets');
const lwc = require('@lwc/rollup-plugin');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;
const commonjs = require('rollup-plugin-commonjs');
const visualizer = require('rollup-plugin-visualizer');

const path = require('path');

const input = path.resolve(__dirname, '../src/index.js');
const env = process.env.NODE_ENV || 'development';
const isProduction = env !== 'development';

const lwcPlugin = lwc({
    exclude: [
        '**/*.mjs',
        '../../../node_modules/**/*.mjs',
        '../../node_modules/**/*.mjs',
        '../node_modules/**/*.mjs',
    ],
    rootDir: './src/modules',
});

module.exports = {
    input,
    output: {
        dir: 'dist',
        format: 'iife',
        entryFileNames: isProduction ? 'app-[name]-[hash].js' : 'app.js',
        sourcemap: true,
    },
    plugins: [
        cleanup(),
        resolve({
            mainFields: ['module', 'main'],
            browser: true,
        }),
        html(),
        copyAssets(),
        lwcPlugin,
        commonjs(),
        replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
        isProduction && terser(),
        isProduction &&
            visualizer({
                gzipSize: true,
                filename: 'dist/report.html',
            }),
    ].filter(Boolean),
};
