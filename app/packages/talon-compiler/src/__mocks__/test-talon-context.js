const path = require('path');
const { startContext, getContext, endContext } = require('../context/context-service');
const crypto = require("crypto");

jest.mock('../utils/observable-folder-hash');

const DEFAULT_OPTIONS = {
    templateDir: path.resolve(__dirname, '../__tests__/fixtures'),
    basePath: '/basePath',
    outputDir: '/'
};

async function startTestContext(options = {}) {
    return startContext({
        ...DEFAULT_OPTIONS,
        ...options
    }).then(context => {
        context.versionKey = options.versionKey || crypto.randomBytes(16).toString("hex");
    });
}

function updateTestContext(options) {
    Object.assign(getContext(), options);
}

module.exports = {
    startTestContext,
    getTestContext: getContext,
    updateTestContext,
    endTestContext: endContext,
    DEFAULT_OPTIONS
};
