const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const app = require('talon-template-flashhelp');
const { globals } = require('../jest.config.js');

module.exports = async function globalSetup() {
    await setupPuppeteer();

    await new Promise(((resolve) => {
        process.testServer = app.listen(globals.port, () => {
            console.log(`Server up on http://localhost:${process.testServer.address().port}`);
            resolve();
        });
    }));
};