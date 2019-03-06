import FileSystemResourceProvider from '../filesystem-resource-provider';
const { startTestContext, updateTestContext, endTestContext } = require('test-talon-context');
import StaticResource from '../static-resource';
import { vol } from 'memfs';

jest.mock('../../utils/observable-folder-hash');
jest.mock('../../utils/filesystem');
jest.mock('mkdirp');

const provider = new FileSystemResourceProvider();
const versionKey = '123';

function content(descriptor, mode) {
    return JSON.stringify({ descriptor, mode, versionKey });
}

const chain = {
    get: jest.fn((descriptor) => {
        const contents = {
            dev: content(descriptor, 'dev'),
            prod: content(descriptor, 'prod')
        };
        const uids = {
            dev: 'uid1',
            prod: 'uid2'
        };
        return new StaticResource({ descriptor, contents, uids });
    })
};

beforeEach(() => {
    vol.reset();
    return startTestContext({ versionKey });
});

afterEach(() => {
    endTestContext();
});

describe('filesystem-resource-provider', () => {
    it('creates files', async () => {
        const descriptor = 'typeA://resourceB';
        await provider.get(descriptor, false, chain);

        expect(Object.keys(vol.toJSON())).toEqual([
            '/public/talon/typeA/uid1/dev/resourceB.js',
            '/public/talon/typeA/uid2/prod/resourceB.js',
            '/resources.json'
        ]);
    });

    it('writes contents', async () => {
        const descriptor = 'typeA://resourceB';

        await provider.get(descriptor, false, chain);

        const files = vol.toJSON();

        expect(files['/public/talon/typeA/uid1/dev/resourceB.js']).toEqual(
            content(descriptor, 'dev')
        );

        expect(files['/public/talon/typeA/uid2/prod/resourceB.js']).toEqual(
            content(descriptor, 'prod')
        );
    });

    it('writes uids', async () => {
        const descriptor = 'typeA://resourceB';

        await provider.get(descriptor, false, chain);

        const files = vol.toJSON();

        expect(JSON.parse(files['/resources.json'])).toEqual({
            '123': {
                'typeA://resourceB': {
                    dev: 'uid1',
                    prod: 'uid2'
                }
            }
        });
    });

    it('respects the output dir param', async () => {
        updateTestContext({ outputDir: '/some dir' });

        const descriptor = 'typeA://resourceB';
        await provider.get(descriptor, false, chain);

        expect(Object.keys(vol.toJSON())).toEqual([
            '/some dir/public/talon/typeA/uid1/dev/resourceB.js',
            '/some dir/public/talon/typeA/uid2/prod/resourceB.js',
            '/some dir/resources.json'
        ]);
    });
});