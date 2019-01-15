import validateRoutes from '../validate-routes';

describe('routes', () => {
    describe('validateRoutes', () => {
        [undefined, null, []].forEach((notSpecifiedRoutes) => {
            it(`throws when routes are ${JSON.stringify(notSpecifiedRoutes)}`, () => {
                expect(() => {
                    validateRoutes(notSpecifiedRoutes);
                }).toThrow("No route specified");
            });
        });
        it('throws when default route is not specified', () => {
            expect(() => {
                validateRoutes([{
                    "name": "home",
                    "path": "/",
                    "isRoot": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }]);
            }).toThrow("Default route not defined");
        });
        it('throws when root route is not specified', () => {
            expect(() => {
                validateRoutes([{
                    "name": "home",
                    "path": "/",
                    "isDefault": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }]);
            }).toThrow("Root route not defined");
        });
        it('throws when multiple root routes are specified', () => {
            expect(() => {
                validateRoutes([{
                    "name": "home",
                    "path": "/",
                    "isRoot": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }, {
                    "name": "about",
                    "path": "/about",
                    "isRoot": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }]);
            }).toThrow("Multiple root routes defined");
        });
        it('throws when multiple default routes are specified', () => {
            expect(() => {
                validateRoutes([{
                    "name": "home",
                    "path": "/",
                    "isDefault": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }, {
                    "name": "about",
                    "path": "/about",
                    "isDefault": true,
                    "themeLayout": "community_flashhelp-app",
                    "component": "community_flashhelp-home"
                }]);
            }).toThrow("Multiple default routes defined");
        });
        it('does not throw', () => {
            validateRoutes([{
                "name": "home",
                "path": "/",
                "isRoot": true,
                "themeLayout": "community_flashhelp-app",
                "component": "community_flashhelp-home"
            }, {
                "name": "about",
                "path": "/about",
                "isDefault": true,
                "themeLayout": "community_flashhelp-app",
                "component": "community_flashhelp-home"
            }]);
        });
    });
});
