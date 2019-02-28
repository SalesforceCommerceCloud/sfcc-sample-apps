const { generateHTML, templateMiddleware } = require('../template-middleware');
const { startTestContext, endTestContext } = require('test-talon-context');
const resourceService = require('../resources/resource-service');
const { getOutputConfigs } = require('talon-common');

jest.mock('../resources/resource-service');
jest.mock('../utils/observable-folder-hash');

const versionKey = '1';

beforeEach(() => {
    return startTestContext({ versionKey });
});

afterEach(() => {
    endTestContext();
});

describe('template-middleware', () => {
    describe('generateHTML', () => {
        getOutputConfigs().forEach(({ mode }) => {
            it(`generates HTML in ${mode} mode`, async () => {
                return generateHTML(mode, '/my-page').then(html => {
                    expect(html).toMatchSnapshot();
                });
            });
        });

        it('includes UIDs', async () => {
            const mode = 'dev';
            resourceService.get.mockImplementation(descriptor => {
                const uids = {
                    dev: `[${mode} uid for ${descriptor}]`
                };
                return Promise.resolve({ descriptor, uids });
            });

            return generateHTML(mode, '/').then(html => {
                expect(html).toMatchSnapshot();
            });
        });
    });

    describe('templateMiddleware', () => {
        it('send HTML', () => {
            const middleware = templateMiddleware();

            const req = {
                query: {
                    mode: 'dev'
                },
                originalUrl: '/my-page?a=1'
            };

            const res = {
                send: jest.fn()
            };

            function next(err) {
                throw err;
            }

            return middleware(req, res, next).then(() => {
                expect(res.send).toHaveBeenCalledTimes(1);
                expect(res.send.mock.calls[0][0]).toMatchSnapshot();
            });
        });
    });
});