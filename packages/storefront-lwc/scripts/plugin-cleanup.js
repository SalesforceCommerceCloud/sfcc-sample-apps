const fs = require('fs-extra');

// Clean up the dist folder between each build.
module.exports = () => ({
    name: 'cleanup',
    renderStart(options) {
        fs.rmdirSync(options.dir, {
            recursive: true,
        });
    },
});
