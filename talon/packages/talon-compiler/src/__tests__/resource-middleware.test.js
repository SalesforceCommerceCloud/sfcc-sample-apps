const { resourceMiddleware } = require('../resource-middleware');
const { startTestContext, endTestContext } = require('test-talon-context');
const resourceService = require('../resources/resource-service');

jest.mock('../utils/observable-folder-hash');
jest.mock('../resources/resource-service');

const basePath = '/test';
const middleware = resourceMiddleware();

beforeEach(() => {
    return startTestContext({ basePath });
});

afterEach(() => {
    endTestContext();
});

describe('resource-middleware', () => {
    it('ignore unrecognized resource type requests', () => {
        const req = {
            originalUrl: '/test/talon/someType/latest/dev/someName.js'
        };

        const res = {};

        const next = jest.fn();

        return middleware(req, res, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    it('ignore component requests when UID is specified', () => {
        const req = {
            originalUrl: '/test/talon/component/123/dev/en_US/x/about.js'
        };

        const res = {};

        const next = jest.fn();

        return middleware(req, res, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1);
        });
    });

    it('redirects to latest URL', () => {
        const req = {
            originalUrl: '/test/talon/component/latest/dev/en_US/x/about.js'
        };

        const res = {
            redirect: jest.fn()
        };

        resourceService.get.mockImplementationOnce(async () => {
            return {
                uids: {
                    dev: '456'
                }
            };
        });

        return middleware(req, res).then(() => {
            expect(res.redirect).toHaveBeenCalledTimes(1);
            expect(res.redirect).toHaveBeenCalledWith('/test/talon/component/456/dev/en_US/x/about.js');
        });
    });

    it('sends error 500 when resourceService fails', () => {
        const req = {
            originalUrl: '/test/talon/component/latest/dev/en_US/x/about.js'
        };

        const res = {
            status: jest.fn(() => {
                return res;
            }),
            send: jest.fn()
        };

        const next = jest.fn();

        resourceService.get.mockImplementationOnce(async () => {
            return Promise.reject("failed");
        });


        return middleware(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.send).toHaveBeenCalledWith("failed");
        });
    });

    it('delegates to next middleware when resourceService fails and headers have been sent', () => {
        const req = {
            originalUrl: '/test/talon/component/latest/dev/en_US/x/about.js'
        };

        const res = {
            status: jest.fn(() => {
                return res;
            }),
            send: jest.fn(),
            headersSent: true
        };

        const next = jest.fn();

        resourceService.get.mockImplementationOnce(async () => {
            return Promise.reject();
        });

        return middleware(req, res, next).then(() => {
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});