const { Readable } = require('stream');
/**
 * A generated static resource, composed of a descriptor,
 * and contents and uids which are maps keyed by compile mode.
 */
class StaticResource {
    constructor({ descriptor, contents, uids }) {
        this.descriptor = descriptor;
        this.contents = contents;
        this.uids = uids;
    }

    getReadableStream(mode) {
        const stream = new Readable();
        stream.push(this.contents[mode]);
        stream.push(null);
        return stream;
    }
}

module.exports = StaticResource;