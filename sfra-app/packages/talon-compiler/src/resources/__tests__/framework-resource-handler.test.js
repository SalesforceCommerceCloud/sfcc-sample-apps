import FrameworkResourceHandler from '../framework-resource-handler';
import { vol } from 'memfs';

const resourcesJson = require.resolve('talon-framework/dist/resources.json');

jest.mock('../../utils/filesystem');

const handler = new FrameworkResourceHandler();

describe('framework-resource-handler', () => {
    describe('type', () => {
        it('is framework', () => {
            expect(handler.type).toBe('framework');
        });
    });
    describe('get', () => {
        it('returns resource', () => {
            const files = {};
            files[resourcesJson] = JSON.stringify({
                'A': {
                    dev: '1',
                    prod: '2'
                }
            });

            vol.fromJSON(files);

            return handler.get('A').then(staticResource => {
                expect(staticResource).toEqual({
                    descriptor: 'A',
                    uids: {
                        dev: '1',
                        prod: '2'
                    }
                });
            });
        });
        it('rejects unknown resource', () => {
            return expect(handler.get('B'))
                .rejects.toMatchObject({
                    message: 'Cannot find framework resource B'
                });
        });
    });
});