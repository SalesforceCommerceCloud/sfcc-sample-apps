/*
 * These are integration test for the template middleware.
 *
 * We use an actual Talon template (src/__tests__/fixtures)
 * and actual LWC components.
 *
 * We don't mock the filesystem, LWC compiler or anything.
 *
 * The test components include labels.
 *
 * We just check that generateHTML() returns without error
 * since we have other unit and UI tests that covers
 * the actual generated HTML.
 */
const touch = require("touch");
const tmp = require('tmp');
const path = require('path');

const { generateHTML } = require('../template-middleware');
const { startContext, endContext } = require('../context/context-service');
const { getOutputConfigs } = require('talon-common');

jest.unmock('mkdirp');

const templateDir = path.resolve(__dirname, 'fixtures');
const route = require('./fixtures/src/routes.json')[0];
const basePath = '/test';
const sourceNonce = "T3stVa1ue";

// create a temporary dir to write resources
const outputDir = tmp.dirSync({
    keep: true
}).name;

// touch the template dir so that version key is bumped
// and components resources are re-generated
touch.sync(templateDir);

beforeEach(async () => {
    return startContext({ templateDir, outputDir, basePath });
});

afterEach(() => {
    endContext();
});

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);

describe('template-middleware [integration]', () => {
    getOutputConfigs().forEach(({ mode }) => {
        it(`generates ${route.name} route HTML in ${mode} mode`, async () => {
            return generateHTML(mode, route.path, sourceNonce);
        });
    });
});