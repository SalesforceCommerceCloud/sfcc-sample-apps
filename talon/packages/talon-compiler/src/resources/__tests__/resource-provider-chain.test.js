import ResourceProviderChain from '../resource-provider-chain';

class MockProvider {
    constructor() {
        this.get = jest.fn();
    }
}

describe('resource-provider-chain', () => {
    describe('get', () => {
        it('invokes next provider', () => {
            const providers = [
                new MockProvider(),
                new MockProvider(),
                new MockProvider()
            ];
            const chain = new ResourceProviderChain(providers);

            chain.get('resource1', true);
            expect(providers[0].get).toHaveBeenCalledTimes(1);
            expect(providers[1].get).toHaveBeenCalledTimes(0);
            expect(providers[2].get).toHaveBeenCalledTimes(0);
            expect(providers[0].get).toHaveBeenCalledWith('resource1', true, chain);

            chain.get('resource2', true);
            expect(providers[0].get).toHaveBeenCalledTimes(1);
            expect(providers[1].get).toHaveBeenCalledTimes(1);
            expect(providers[2].get).toHaveBeenCalledTimes(0);
            expect(providers[1].get).toHaveBeenCalledWith('resource2', true, chain);

            chain.get('resource3', false);
            expect(providers[0].get).toHaveBeenCalledTimes(1);
            expect(providers[1].get).toHaveBeenCalledTimes(1);
            expect(providers[2].get).toHaveBeenCalledTimes(1);
            expect(providers[2].get).toHaveBeenCalledWith('resource3', false, chain);
        });

        it('rejects when getting from empty chain', () => {
            return expect(new ResourceProviderChain([]).get('resource1'))
                .rejects.toMatchObject({
                    message: 'No provider left in the chain for resource resource1'
                });
        });
    });
});