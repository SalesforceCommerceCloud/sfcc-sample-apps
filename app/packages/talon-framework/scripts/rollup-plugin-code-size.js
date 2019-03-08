import prettyBytes from 'pretty-bytes';
import gzipSize from 'gzip-size';

const { log } = console;

/**
 * Plugin that prints the code size, uncompressed and gzipped.
 */
export default () => ({
    name: 'rollup-plugin-code-size',

    onwrite(bundle, data) {
        const { code } = data;
        log(`File size: ${prettyBytes(code.length)} (gzipped: ${prettyBytes(gzipSize.sync(code))})`);
    }
});