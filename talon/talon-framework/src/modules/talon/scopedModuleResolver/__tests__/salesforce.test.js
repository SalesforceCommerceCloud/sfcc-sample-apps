import resolver from '../salesforce';

jest.mock('../salesforceApex', () => ({
    scope: 'apex',
    resolve(resource) {
        return resource;
    }
}));

jest.mock('../salesforceCssvars', () => ({
    scope: 'cssvars',
    resolve(resource) {
        return resource;
    }
}));

jest.mock('../salesforceUser', () => ({
    scope: 'user',
    resolve(resource) {
        return resource;
    }
}));

describe('talon/scopedModuleResolver/salesforce', () => {
    it('scope is @salesforce', () => {
        expect(resolver.scope).toBe('@salesforce');
    });
    it('resolves apex', () => {
        expect(resolver.resolve('apex/someResource')).toBe('someResource');
    });
    it('resolves cssvars', () => {
        expect(resolver.resolve('cssvars/someResource')).toBe('someResource');
    });
    it('resolves user', () => {
        expect(resolver.resolve('user/someResource')).toBe('someResource');
    });
    it('resolves unknown resource to null', () => {
        expect(resolver.resolve('unknown/resource')).toBeNull();
    });
});