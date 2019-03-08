const { getContext } = require('../../context/context-service');
const memoizePlugin = require('../rollup-plugin-memoize');

jest.mock('../../context/context-service', () => ({ getContext: jest.fn(() => ({})) }));

const plugin = jest.fn(() => ({
    name: 'my-plugin',
    options: jest.fn(),
    resolveId: jest.fn(),
    load: jest.fn(),
    transform: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
});
describe('rollup-plugin-memoize', () => {
    it('creates plugin with options once', async () => {
        const options = { a: 1 };
        memoizePlugin(plugin, options);
        memoizePlugin(plugin, options);
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin).toHaveBeenCalledWith(options);
    });

    it('creates plugin when versionKey changes', async () => {
        const versionKeys = [2, 3];
        getContext.mockImplementation(() => {
            return {
                versionKey: versionKeys.pop()
            };
        });

        const options = {};
        memoizePlugin(plugin, options);
        memoizePlugin(plugin, options);
        expect(plugin).toHaveBeenCalledTimes(2);
        expect(plugin).toHaveBeenCalledWith(options);
    });

    it('sets plugin name', async () => {
        const options = {};
        const memoizedPlugin = memoizePlugin(plugin, options);
        expect(memoizedPlugin.name).toBe('my-plugin-memoized');
    });

    it('memoizes options', async () => {
        const pluginOptions = { a: 2 };
        const rollupOptions = {};

        const memoizedPlugin = memoizePlugin(plugin, pluginOptions);
        memoizedPlugin.options(rollupOptions);
        memoizedPlugin.options(rollupOptions);

        expect(plugin.mock.calls).toHaveLength(1);
        const pluginInstance = plugin.mock.results[0].value;

        expect(pluginInstance.options).toHaveBeenCalledTimes(1);
        expect(pluginInstance.options).toHaveBeenCalledWith(rollupOptions);
    });

    it('memoizes resolveId', async () => {
        const id = 'id3';
        const memoizedPlugin = memoizePlugin(plugin, { a: 3 });
        memoizedPlugin.resolveId(id);
        memoizedPlugin.resolveId(id);
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.resolveId).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.resolveId).toHaveBeenCalledWith(id);
    });

    it('memoizes load', async () => {
        const id = 'id4';
        const memoizedPlugin = memoizePlugin(plugin, { a: 4 });
        memoizedPlugin.load(id);
        memoizedPlugin.load(id);
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.load).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.load).toHaveBeenCalledWith(id);
    });

    it('memoizes transform', async () => {
        const id = 'id5';
        const memoizedPlugin = memoizePlugin(plugin, { a: 5 });
        memoizedPlugin.transform(id);
        memoizedPlugin.transform(id);
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.transform).toHaveBeenCalledTimes(1);
        expect(plugin.mock.results[0].value.transform).toHaveBeenCalledWith(id);
    });
});

