import resolver from '../salesforceApex';

jest.mock('talon/apexUtils', () => ({
    getApexInvoker: jest.fn(resource => `getApexInvoker(${resource})`)
}));

describe('talon/scopedModuleResolver/salesforceApex', () => {
    it('scope is apex', () => {
        expect(resolver.scope).toBe('apex');
    });
    it('delegates to getApexInvoker', () => {
        expect(resolver.resolve('some/apex/resource')).toBe('getApexInvoker(some/apex/resource)');
    });
});