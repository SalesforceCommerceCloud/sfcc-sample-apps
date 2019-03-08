import '../handlebars-helpers';
import { compatBabelOptions } from 'talon-common';
import { getViewToThemeLayoutMap } from '../routes/route-service';
import { helpers } from 'handlebars';
import { transform } from '@babel/core';
import beautify from 'js-beautify';

const routes = require('./fixtures/src/routes.json');
const currentRoute = routes[0];
const brandingProperties = require('./fixtures/src/branding.json');
const theme = require('./fixtures/src/theme.json');
const viewToThemeLayoutMap = getViewToThemeLayoutMap(routes, theme);

jest.mock('../metadata/metadata-service', () => ({
    getView: () => {
        return {
            "themeLayoutType": "inner"
        };
    }
}));

/**
 * Extract inline scripts from HTML.
 */
function extractScripts(code) {
    const scripts = [];
    const regex = /<script[^>]*>([^<]+)<\/script>/g;
    let match;
    while ((match = regex.exec(code))) {
        scripts.push(match[1]);
    }
    return scripts;
}

describe('handlebars-helpers', () => {
    describe('talonInit', () => {
        const basePath = '/test';
        const mode = 'prod';
        const locale = 'fr';
        const resources = {};
        const sourceNonce = "T3stVa1ue";
        const user = { isGuest: false };

        it('returns script tags for talon init', () => {
            const { string: out } = helpers.talonInit({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap, user });
            expect(out).toMatchSnapshot();
        });

        it('returns script tags for talon init with script-src nonce', () => {
            const { string: out } = helpers.talonInit({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap, sourceNonce, user });
            out.includes('<script type="text/javascript" nonce="T3stVa1ue">');
            expect(out).toMatchSnapshot();
        });

        it('throws when no theme specified', () => {
            expect(() => {
                helpers.talonInit({ brandingProperties, routes, currentRoute, mode, basePath, resources, locale });
            }).toThrow();
        });

        it('throws when no mode specified', () => {
            expect(() => {
                helpers.talonInit({ theme, brandingProperties, routes, currentRoute, basePath, resources, locale });
            }).toThrow();
        });

        [undefined, null, ""].forEach((invalidTestRoute) => {
            it(`throws when current route is ${JSON.stringify(invalidTestRoute)}`, () => {
                expect(() => {
                    helpers.talonInit({ theme, brandingProperties, routes, currentRoute: invalidTestRoute, mode, basePath, resources, locale });
                }).toThrow('Current route not specified');
            });
        });

        it('returns es5 javascript', () => {
            const { string: out } = helpers.talonInit({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap, sourceNonce, user });
            const scripts = extractScripts(out);

            expect(scripts).toHaveLength(1);

            const { code: es5Script } = transform(scripts[0], compatBabelOptions);
            expect(beautify(scripts[0])).toBe(beautify(es5Script));
        });

        it('returns designtime script for preview', () => {
            const { string: out } = helpers.talonInit({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap, sourceNonce, isPreview: true });
            expect(out).toMatchSnapshot();
        });
    });

    describe('talonViews', () => {
        const basePath = '/test';
        const mode = 'prod';
        const locale = 'fr';
        const resources = {};
        const sourceNonce = "T3stVa1ue";

        it('returns script tags for talon views', () => {
            const { string: out } = helpers.talonViews({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap });
            expect(out).toMatchSnapshot();
        });

        it('returns es5 javascript', () => {
            const { string: out } = helpers.talonViews({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap, sourceNonce });
            const scripts = extractScripts(out);
            expect(scripts).toHaveLength(0);
        });
    });

    describe('talonApp', () => {
        const sourceNonce = "T3stVa1ue";
        const testContainerId = "01234";
        const testContext = { sourceNonce };

        it('returns script tags for talon app component', () => {
            const { string: out } = helpers.talonApp({}, testContainerId);
            out.includes('document.getElementById("01234"');
            expect(out).toMatchSnapshot();
        });

        it('returns script tags for talon app component with script-src nonce', () => {
            const { string: out } = helpers.talonApp(testContext, testContainerId);
            out.includes('<script type="text/javascript" nonce="T3stVa1ue">');
            expect(out).toMatchSnapshot();
        });

        it('returns es5 javascript', () => {
            const { string: out } = helpers.talonApp({ sourceNonce }, testContainerId);
            const scripts = extractScripts(out);

            expect(scripts).toHaveLength(1);

            const { code: es5Script } = transform(scripts[0], compatBabelOptions);
            expect(beautify(scripts[0])).toBe(beautify(es5Script));
        });
    });
});