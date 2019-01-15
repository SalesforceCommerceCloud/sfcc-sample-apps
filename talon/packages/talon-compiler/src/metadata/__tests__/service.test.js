import { getRoutes, getTheme, getBrandingProperties, getLabels, getHTML } from '../metadata-service.js';
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
        it('returns branding properties', () => {
            const theme = {
                branding: 'awesomeBranding.json'
            };

            const brandingProperties = [
                {
                    name: 'prop1',
                    type: 'color',
                    value: 'red'
                }
            ];

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme),
                '/my/awesomeBranding.json': JSON.stringify(brandingProperties)
            });

            updateTestContext({ themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual(brandingProperties);
        });

        it('adds base path to images', () => {
            const basePath = '/test';
            const theme = {
                branding: 'awesomeBranding.json'
            };

            const brandingProperties = [
                {
                    name: 'prop1',
                    type: 'Image',
                    value: '/image.png'
                }
            ];

            vol.fromJSON({
                '/my/theme.json': JSON.stringify(theme),
                '/my/awesomeBranding.json': JSON.stringify(brandingProperties)
            });

            updateTestContext({ basePath, themeJson: '/my/theme.json' });

            expect(getBrandingProperties()).toEqual([
                {
                    name: 'prop1',
                    type: 'Image',
                    value: '/test/image.png'
                }
            ]);
        });
    });
});