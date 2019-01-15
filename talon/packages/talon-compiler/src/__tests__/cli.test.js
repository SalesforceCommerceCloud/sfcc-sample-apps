const main = require('../cli');
const { startContext, endContext } = require('../context/context-service');
const metadataService = require('../metadata/metadata-service');
const routesService = require('../routes/route-service');
const resourceService = require('../resources/resource-service');

jest.mock('../context/context-service', () => {
    const context = {
        locale: Symbol("mockLocale")
    };
    return {
        async startContext() {
            return context;
        },
        endContext: jest.fn()
    };
});

jest.mock('../metadata/metadata-service', () => {
    const routes = [Symbol("mockRoutes")];
    const theme = Symbol("mockTheme");
    return {
        getRoutes: jest.fn(() => {
            return routes;
        }),
        getTheme() {
            return theme;
        }
    };
});

jest.mock('../routes/route-service', () => {
    const descriptors = ["descriptor1", "descriptor2"];
    return {
        validateRoutes: jest.fn(),
        getRoutesResources: jest.fn(() => {
            return descriptors;
        })
    };
});

jest.mock('../resources/resource-service', () => ({
    get: jest.fn(() => Promise.resolve())
}));

const exit = jest.spyOn(process, "exit").mockImplementation(() => { });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('cli', () => {
    describe('on error', () => {
        beforeEach(() => {
            metadataService.getRoutes.mockImplementationOnce(() => {
                throw new Error();
            });
        });
        it('exits with code 1', async () => {
            return main().then(() => {
                expect(exit).toHaveBeenCalledTimes(1);
                expect(exit).toHaveBeenCalledWith(1);
            });
        });
        it('end context', async () => {
            return main().then(() => {
                expect(endContext).toHaveBeenCalledTimes(1);
            });
        });
    });
    describe('on success', () => {
        it('exits with code 0', async () => {
            return main().then(() => {
                expect(exit).toHaveBeenCalledTimes(1);
                expect(exit).toHaveBeenCalledWith(0);
            });
        });
        it('end context', async () => {
            return main().then(() => {
                expect(endContext).toHaveBeenCalledTimes(1);
            });
        });
        it('validates routes', async () => {
            return main().then(() => {
                const routes = metadataService.getRoutes();

                expect(routesService.validateRoutes).toHaveBeenCalledTimes(1);
                expect(routesService.validateRoutes).toHaveBeenCalledWith(routes);
            });
        });
        it('gets routes resource descriptors', async () => {
            return main().then(async () => {
                const routes = metadataService.getRoutes();
                const theme = metadataService.getTheme();
                const { locale } = await startContext();

                expect(routesService.getRoutesResources).toHaveBeenCalledTimes(1);
                expect(routesService.getRoutesResources).toHaveBeenCalledWith(routes, theme, locale);
            });
        });
        it('gets resources', async () => {
            return main().then(async () => {
                const descriptors = routesService.getRoutesResources();

                expect(resourceService.get).toHaveBeenCalledTimes(2);
                expect(resourceService.get).toHaveBeenCalledWith(descriptors[0]);
                expect(resourceService.get).toHaveBeenCalledWith(descriptors[1]);
            });
        });
        it('gets filtered resources', async () => {
            return main({ filter: "1" }).then(async () => {
                const descriptors = routesService.getRoutesResources();

                expect(resourceService.get).toHaveBeenCalledTimes(1);
                expect(resourceService.get).toHaveBeenCalledWith(descriptors[0]);
            });
        });
    });
});