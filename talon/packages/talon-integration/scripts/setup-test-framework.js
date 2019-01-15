const { setDefaultOptions } = require('expect-puppeteer');

// give more time for the tests to run in the CI
const JEST_TIMEOUT = 30000;
const JEST_EXPECT_TIMEOUT = 2500;

setDefaultOptions({ timeout: JEST_EXPECT_TIMEOUT });

jest.setTimeout(JEST_TIMEOUT);