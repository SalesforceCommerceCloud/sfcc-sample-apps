import resolver from '../salesforceUser';
import { getUser } from 'talon/configProvider';

jest.mock('talon/configProvider');

beforeEach(() => {
    jest.resetAllMocks();
    getUser.mockImplementation(() => ({ isGuest: true}));
});

describe('talon/scopedModuleResolver/salesforceUser', () => {
    it('scope is user', () => {
        expect(resolver.scope).toBe('user');
    });
    describe('resolves isGuest', () => {
        it('by invoking configProvider', () => {
            resolver.resolve('isGuest');
            expect(getUser).toBeCalledTimes(1);
        });
        describe('to the correct value when configProvider.getUser().isGuest', () => {
            it('returns false', () => {
                getUser.mockImplementation(() => ({ isGuest: false }));
                expect(resolver.resolve('isGuest')).toBe(false);
            });
            it('returns true', () => {
                getUser.mockImplementation(() => ({ isGuest: true }));
                expect(resolver.resolve('isGuest')).toBe(true);
            });
        });
    });
    it('resolves unknown resource to null', () => {
        expect(resolver.resolve('nothingparticular')).toBeNull();
    });
});
