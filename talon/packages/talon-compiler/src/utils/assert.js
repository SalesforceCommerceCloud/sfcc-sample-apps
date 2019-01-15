function assert(assertion, message) {
    if (!assertion) {
        throw new Error(message);
    }
}

module.exports = { assert };