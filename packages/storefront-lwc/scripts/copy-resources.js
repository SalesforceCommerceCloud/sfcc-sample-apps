/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/* eslint-env node */
require('colors');

const cpx = require('cpx');
const mkdirp = require('mkdirp');
const watch = process.argv.includes('--watch');

const { log } = console;

function copy(src, dest) {
    if (watch) {
        const watcher = cpx.watch(src, dest);
        let ready = false;
        watcher.on('watch-ready', () => {
            ready = true;
            log(`Done copying ${src} to ${dest}`);
            log(`Watching ${src} for changes...`.green);
        });
        watcher.on('watch-error', err => {
            log(`Error watching ${src}: ${err}`.red);
        });
        watcher.on('copy', event => {
            if (ready) {
                log(`Copied ${event.srcPath} to ${event.dstPath}`);
            }
        });
        watcher.on('remove', event => {
            log(`Removed ${event.path}`);
        });
    } else {
        cpx.copy(src, dest, () => {
            log(`Done copying ${src} to ${dest}`);
        });
    }
}

mkdirp.sync('dist/public');
mkdirp.sync('dist/views');

copy('src/!(modules)', 'dist');
copy('src/public/**/*', 'dist/public');
copy('src/views/*', 'dist/views');
copy('src/partials/*', 'dist/partials');
copy('node_modules/@salesforce-ux/design-system/assets/**/symbols.svg', 'dist/public/assets');
copy(
    'node_modules/@salesforce-ux/design-system/assets/**/*.{woff2,css}',
    'dist/public/assets'
);