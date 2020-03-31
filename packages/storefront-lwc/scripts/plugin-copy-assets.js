const fs = require('fs-extra');

const ASSETS = {
    'src/assets/favicon.ico': 'favicon.ico',
    'src/assets/manifest.json': 'manifest.json',

    'src/assets/fonts/': 'fonts/',
    'src/assets/images/': 'images/',
    'src/assets/img/': 'img/',
};

// Copy the assets to the dist folder.
module.exports = () => ({
    name: 'copy-assets',
    buildStart() {
        for (const src of Object.keys(ASSETS)) {
            this.addWatchFile(src);
        }
    },
    renderStart(options) {
        function copyAssets(config) {
            for (const [src, dest] of Object.entries(config)) {
                fs.copySync(src, `${options.dir}/${dest}`);
            }
        }

        copyAssets(ASSETS);
    },
});
