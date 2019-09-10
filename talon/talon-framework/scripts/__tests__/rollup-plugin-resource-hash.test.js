import resourceHashPlugin from '../rollup-plugin-resource-hash';
import * as fs from 'fs';

jest.mock('fs');

jest.mock('talon-common', () => ({
    getResourceUrl: (name, mode, hash) => {
        return `${hash}/${name}/${mode}`;
    }
}));

jest.mock('rollup-plugin-hash', () => {
    return {
        __esModule: true,
        default: (opt) => {
            return {
                onwrite: (filename) => {
                    opt.callback(filename);
                }
            };
        },
    };
});

describe('rollup-plugin-resource-hash', () => {
    describe('onwrite', () => {
        it('writes out new resource map', async () => {
            const plugin = resourceHashPlugin({
                mode: 'dev',
                resourceDescriptor: 'talontest'
            });
            plugin.onwrite('testfilename');

            expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
        });
        it('adds to existing resource map', async () => {
            const existing = {
                "framework://talon": {
                    "dev": "aa6f1ead02"
                }
            };

            fs.existsSync.mockReturnValue(true);
            fs.readFileSync.mockReturnValue(JSON.stringify(existing));

            const plugin = resourceHashPlugin({
                mode: 'dev',
                resourceDescriptor: 'talontest'
            });
            plugin.onwrite('testfilename');

            const output = fs.writeFileSync.mock.calls[1][1];
            expect(JSON.parse(output)["framework://talon"]).toEqual(existing["framework://talon"]);
            expect(output).toMatchSnapshot();
        });
    });
});