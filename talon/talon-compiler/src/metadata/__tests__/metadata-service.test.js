import { getRoutes, getTheme, getBrandingProperties, getLabels, getHTML, getAllViews } from '../metadata-service.js';
import { startTestContext, updateTestContext, endTestContext } from 'test-talon-context';
import { vol } from 'memfs';

jest.mock('../../utils/observable-folder-hash');
jest.mock('../../utils/filesystem');

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

describe('metadata-service', () => {
    describe('getRoutes', () => {
        it('returns routes', () => {
            const routes = {
                my: 'routes'
            };

            vol.fromJSON({
                '/my/routes.json': JSON.stringify(routes)
            });

            updateTestContext({ routesJson: '/my/routes.json' });

            expect(getRoutes()).toEqual(routes);
        });
    });

    describe('getAllViews', () => {
        it('returns views', () => {
            const routes = [
                {
                    name: "home",
                    path: "/",
                    view: "home"
                },
                {
                    name: "error",
                    path: "/error",
                    view: "error"
                },
                {
                    name: "about",
                    path: "/about",
                    view: "about"
                }
            ];

            const home = {
                name: "home",
                component: {
                    name: "x/home"
                }
            };

            const error = {
                name: "error",
                component: {
                    name: "x/error"
                }
            };

            const about = {
                name: "about",
                component: {
                    name: "x/about"
                }
            };

            vol.fromJSON({
                '/my/routes.json': JSON.stringify(routes),
                '/my/home.json': JSON.stringify(home),
                '/my/error.json': JSON.stringify(error),
                '/my/about.json': JSON.stringify(about)
            });

            updateTestContext({ routesJson: '/my/routes.json', viewsDir: '/my' });
            const allViews = getAllViews(routes, {themeLayouts: {}});
            expect(allViews).toEqual([home, error, about]);
        });

        it('returns views and theme views', () => {
            const routes = [
                {
                    name: "home",
                    path: "/",
                    view: "home"
                },
                {
                    name: "error",
                    path: "/error",
                    view: "error"
                },
                {
                    name: "about",
                    path: "/about",
                    view: "about"
                }
            ];

            const home = {
                name: "home",
                themeLayoutType: "inner",
                component: {
                    name: "x/home"
                }
            };

            const error = {
                name: "error",
                themeLayoutType: "default",
                component: {
                    name: "x/error"
                }
            };

            const about = {
                name: "about",
                component: {
                    name: "x/about"
                }
            };

            const full = {
                name: "full",
                component: {
                    name: "x/full"
                }
            };

            const theme = {
                themeLayouts: {
                    "inner": {
                        view: "about"
                    },
                    "default": {
                        view: "full"
                    }
                }
            };

            vol.fromJSON({
                '/my/routes.json': JSON.stringify(routes),
                '/my/home.json': JSON.stringify(home),
                '/my/error.json': JSON.stringify(error),
                '/my/about.json': JSON.stringify(about),
                '/my/full.json': JSON.stringify(full),
                '/my/theme.json': JSON.stringify(theme)
            });

            updateTestContext({ routesJson: '/my/routes.json', viewsDir: '/my', themeJson: '/my/theme.json' });
            const result = getAllViews(routes, theme);
            expect(result).toHaveLength(4);
            expect(result).toEqual(expect.arrayContaining([home, about, error, full]));
        });
    });

    describe('getTheme', () => {
        it('returns theme', () => {
            const theme = {
                my: 'theme'
            };

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme)
            });

            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getTheme()).toEqual(theme);
        });
    });

    describe('getLabels', () => {
        it('returns labels', () => {
            const labels = {
                my: 'labels'
            };

            vol.fromJSON({
                '/my/labels.json': JSON.stringify(labels)
            });

            updateTestContext({ labelsJson: '/my/labels.json' });

            expect(getLabels()).toEqual(labels);
        });
    });

    describe('getHTML', () => {
        it('returns HTML', () => {
            const html = '<html />';

            vol.fromJSON({
                '/my/index.html': html
            });

            updateTestContext({ indexHtml: '/my/index.html' });

            expect(getHTML()).toEqual(html);
        });
    });

    describe('getBrandingProperties', () => {
        it('returns branding properties from json', () => {
            const theme = {
                branding: 'awesomeBranding.json'
            };

            const brandingProperties = [
                {
                    name: 'prop1',
                    value: 'red',
                    nonCanonical: 'skipped',
                    type: 'this is simply passed in',
                },
                {
                    name: 'rootRelativeImage',
                    value: '/my/image.png',
                    type: 'Image'
                }
            ];

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme),
                '/my/awesomeBranding.json': JSON.stringify(brandingProperties)
            });

            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([
                {
                    name: 'prop1',
                    value: 'red',
                    nonCanonical: 'skipped',
                    type: 'this is simply passed in',
                },
                {
                    name: 'rootRelativeImage',
                    value: '/my/image.png',
                    type: 'Image'
                }
            ]);
        });

        it('returns empty list if no properties', () => {
            const theme = {
                branding: 'awesomeBranding.json'
            };

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme),
                '/my/awesomeBranding.json': '[]'
            });

            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([]);
        });

        it('evaluates proper option for type Picklist', () => {
            const theme = {
                branding: 'awesomeBranding.json'
            };

            const brandingProperties = [
                {
                    name: 'Picklist - one option',
                    value: 'something:what',
                    type: 'Picklist'
                },
                {
                    name: 'picklist with no default',
                    value: 'label1:option1,label2:option2',
                    type: 'Picklist'
                },
                {
                    name: 'picklist with default',
                    value: 'label1:option1,label2:option2:default,label3:option3',
                    type: 'Picklist'
                }
            ];

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme),
                '/my/awesomeBranding.json': JSON.stringify(brandingProperties)
            });

            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([
                {
                    name: 'Picklist - one option',
                    value: 'what',
                    type: 'Picklist'
                },
                {
                    name: 'picklist with no default',
                    value: 'option1',
                    type: 'Picklist'
                },
                {
                    name: 'picklist with default',
                    value: 'option2',
                    type: 'Picklist'
                }
            ]);
        });

        it('returns empty properties list if no theme', () => {
            vol.fromJSON({
                '/my/theme.json': 'null'
            });
            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([]);
        });

        it('returns empty properties list if theme has no branding', () => {
            vol.fromJSON({
                '/my/theme.json': '{}',
            });
            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([]);
        });
    });
});