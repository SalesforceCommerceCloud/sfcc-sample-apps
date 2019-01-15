const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');
const { endContext } = require('talon-compiler');

module.exports = async function globalTeardown() {
    if (process.testServer) {
        console.log(`Closing server`);
        process.testServer.close();
        endContext();
    }

    await teardownPuppeteer();
};