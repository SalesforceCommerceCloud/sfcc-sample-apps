const fs = require('fs');

// Returns the application entry point.
function getEntryChunk(bundle) {
    return Object.values(bundle).find(
        entry => entry.type === 'chunk' && entry.isEntry,
    );
}

module.exports = () => ({
    name: 'html',
    buildStart() {
        this.addWatchFile('src/index.html');
    },
    generateBundle(options, bundle) {
        let source = fs.readFileSync('src/index.html', 'utf-8');

        const entryChunk = getEntryChunk(bundle);

        source = source.replace(
            '<!-- MODULE_ENTRY -->',
            `<script type="module" src="/${entryChunk.fileName}"></script>`,
        );

        this.emitFile({
            type: 'asset',
            source,
            name: 'HTML Asset',
            fileName: 'index.html',
        });
    },
});
