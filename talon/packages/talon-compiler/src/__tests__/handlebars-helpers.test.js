import '../handlebars-helpers';
import { helpers } from 'handlebars';
import { getViewToThemeLayoutMap } from '../routes/route-service';

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

describe('handlebars-helpers', () => {
    describe('talonInit', () => {
        const basePath = '/test';
        const mode = 'prod';
        const locale = 'fr';
        const resources = {};

        it('returns script tags for talon init', () => {
            const { string: out } = helpers.talonInit({ theme, brandingProperties, routes, currentRoute, mode, basePath, resources, locale, viewToThemeLayoutMap });
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
    });

    describe('talonApp', () => {
        const testContainerId = "01234";

        it('returns script tags for theme layout component', () => {
            const { string: out } = helpers.talonApp(testContainerId);
            expect(out).toMatchSnapshot();
        });

        it('returns script tags for other theme layout component', () => {
            const { string: out } = helpers.talonApp(testContainerId);
            expect(out).toMatchSnapshot();
        });
    });
});