const merge = require('deepmerge');
const master_config = require('codeceptjs-shared').config.master;
const codeceptjs_saucelabs = require('codeceptjs-saucelabs').config.saucelabs;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DEFAULT_HOST = process.env.HEROKU_APP_NAME
    ? `https://${process.env.heroku_app_name}.herokuapp.com/`
    : 'https://sfcc-team-sample-app.herokuapp.com/';

const RELATIVE_PATH = './tests/acceptance/';
const PAGES_PATH = RELATIVE_PATH + 'pages/';

const HOST = DEFAULT_HOST;

// replace sauce_username & sauce_key with your SauceLabs Account
const SAUCE_USERNAME = process.env.SAUCE_USERNAME
    ? process.env.SAUCE_USERNAME
    : 'sso-saleforce-blittle';
const SAUCE_KEY = process.env.SAUCE_KEY || '';

let conf = {
    output: RELATIVE_PATH + 'report',
    cleanup: true,
    dev: {
        host: HOST,
    },
    helpers: {
        WebDriver: {
            url: HOST,
        },
        REST: {},
    },
    gherkin: {
        features: RELATIVE_PATH + 'features/**/*.feature',
    },
    include: {
        I: RELATIVE_PATH + 'helpers/custom.methods.js',
        ghHomePage: PAGES_PATH + 'github/gh-home.page.js',
        ghSearchPage: PAGES_PATH + 'github/gh-search.page.js',
    },
    tests: RELATIVE_PATH + '*.test.js',
    name: 'Sample App Acceptance Tests',
};

exports.config = merge(
    merge(conf, master_config),
    codeceptjs_saucelabs(SAUCE_USERNAME, SAUCE_KEY),
);
