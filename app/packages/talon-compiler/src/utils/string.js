/**
 * Removes a substring only if it is at the beginning of a source string, otherwise returns the source string.
 *
 * @param {string} str The string to remove the prefix from
 * @param {string} prefix The prefix to remove
 * @returns The string without the prefix, or the string unchanged
 *           if it does not start with the prefix
 */
function stripPrefix(str, prefix) {
    if (str && prefix && str.startsWith(prefix)) {
        return str.substring(prefix.length);
    }

    return str;
}

module.exports = { stripPrefix };