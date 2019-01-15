import { getViewModuleName, getViewModuleFullyQualifiedName } from '../view-utils';

describe('view-utils', () => {
    describe('getViewModuleName', () => {
        [null, undefined, ''].forEach(viewName => {
            it(`throws if view name is ${JSON.stringify(viewName)}`, () => {
                expect(() => {
                    getViewModuleName(viewName);
                }).toThrow('View name must be specified');
            });
        });

        it(`adds prefix`, () => {
            expect(getViewModuleName('myView')).toBe('view__myView');
        });
    });

    describe('getViewModuleFullyQualifiedName', () => {
        [null, undefined, ''].forEach(viewName => {
            it(`throws if view name is ${JSON.stringify(viewName)}`, () => {
                expect(() => {
                    getViewModuleFullyQualifiedName(viewName);
                }).toThrow('View name must be specified');
            });
        });

        it(`adds namespace`, () => {
            expect(getViewModuleFullyQualifiedName('myView')).toBe('talonGenerated/view__myView');
        });
    });
});
