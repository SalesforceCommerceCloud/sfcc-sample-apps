import { Resolver } from "../resolver";

describe('talon/scopedModuleResolver/resolver', () => {
    it('resolves using underlying resolver by scope', () => {
        const resolver = new Resolver({
            scope: 'someScope',
            resolve(resource) {
                return resource;
            }
        });
        expect(resolver.resolve('someScope/some/resource')).toBe('some/resource');
    });

    it('resolves using an array of underlying resolver by scope', () => {
        const resolver = new Resolver([{
            scope: 'someScope',
            resolve(resource) {
                return resource;
            }
        }]);
        expect(resolver.resolve('someScope/some/resource')).toBe('some/resource');
    });

    it('resolves to null for unknown scope', () => {
        const resolver = new Resolver();
        expect(resolver.resolve('unknown/scope')).toBeNull();
    });

    for (const falsyResolver of [null, undefined, false]) {
        it(`ignores ${JSON.stringify(falsyResolver)} falsy resolver`, () => {
            const resolver = new Resolver([{
                scope: 'someScope',
                resolve(resource) {
                    return resource;
                }
            }, falsyResolver]);
            expect(resolver.resolve('someScope/some/resource')).toBe('some/resource');
        });
    }
});