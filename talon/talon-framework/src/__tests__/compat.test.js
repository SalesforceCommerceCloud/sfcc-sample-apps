import { resolvers } from "../compat";

jest.mock('es5-proxy-compat/module', () => ({
    regenerator: 'regenerator',
    babelHelpers: {
        helper1: 'helper1',
        more: {
            helper2: 'helper2'
        }
    }
}));

describe('compat', () => {
    it('exports on resolver', () => {
        expect(resolvers).toHaveLength(1);
    });
    it('exports @babel resolver', () => {
        expect(resolvers[0].scope).toBe('@babel');
    });
    it('resolves regenerator', () => {
        expect(resolvers[0].resolve('runtime/regenerator')).toBe('regenerator');
    });
    it('resolves helper', () => {
        expect(resolvers[0].resolve('runtime/helpers/helper1')).toBe('helper1');
    });
    it('resolves helper deep', () => {
        expect(resolvers[0].resolve('runtime/helpers/more/helper2')).toBe('helper2');
    });
    it('resolves unknown module to null', () => {
        expect(resolvers[0].resolve('unknown/module')).toBeNull();
    });
});