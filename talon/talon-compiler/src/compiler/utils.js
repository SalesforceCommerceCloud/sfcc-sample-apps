const readline = require('readline');

/**
 * Clear the line, move the cursor to position 0 and write the given message
 * to the provided stdout, or process.stdout.
 */
function clearAndWrite(message, stdout = process.stdout) {
    readline.clearLine(stdout, 0);
    readline.cursorTo(stdout, 0);
    stdout.write(message);
}

// be silent during tests
const verbose = !process.env.JENKINS_NAME && process.env.NODE_ENV !== 'test';

module.exports = { clearAndWrite, verbose };