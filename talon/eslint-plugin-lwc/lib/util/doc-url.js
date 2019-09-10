'use strict';

const { version } = require('../../package.json');

const REPO_URL = 'https://git.soma.salesforce.com/lwc/eslint-plugin-lwc.git';

function docUrl(ruleName) {
    return `${REPO_URL}/blob/${version}/docs/rules/${ruleName}.md`;
}

module.exports = {
    docUrl,
};
