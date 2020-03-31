const cleanup = require('./plugin-cleanup');
const html = require('./plugin-html');
const copyAssets = require('./plugin-copy-assets');
const lwc = require('@lwc/rollup-plugin');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;
const commonjs = require('rollup-plugin-commonjs');
const visualizer = require('rollup-plugin-visualizer');
const { execSync } = require('child_process');

const path = require('path');

const input = path.resolve(__dirname, '../src/index.js');
const env = process.env.NODE_ENV || 'development';
const isProduction = env !== 'development';

const lwcPlugin = lwc({
    include: ['**/*.js', '**/*.html', '**/*.css', '**/*.ts'],
    rootDir: './src/modules',
});

const COMMIT_HASH = (
    process.env.SOURCE_VERSION ||
    execSync('git rev-parse HEAD')
        .toString()
        .trim()
).slice(0, 7);

module.exports = {
    input,
    output: {
        dir: 'dist',
        format: 'iife',
        entryFileNames: 'entry-[name]-[hash].js',
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
