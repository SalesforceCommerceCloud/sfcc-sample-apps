import resolver from '../salesforceCssvars';

jest.mock('talon/brandingService', () => ({
    style: 'style'
}));

describe('talon/scopedModuleResolver/salesforceApex', () => {
    it('scope is cssvars', () => {
        expect(resolver.scope).toBe('cssvars');
    });
    it('resolves customProperties to brandingService style', () => {
        expect(resolver.resolve('customProperties')).toBe('style');
    });
    it('resolves unknown resource to null', () => {
        expect(resolver.resolve('unknown/resource')).toBeNull();
    });
});