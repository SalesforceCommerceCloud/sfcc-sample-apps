const plugin = require('../rollup-plugin-progress');

jest.mock('readline');

const write = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('rollup-plugin-progress', () => {
    it('reports on creation', () => {
        plugin('context', { write });
        expect(write).toHaveBeenCalledTimes(1);
    });
    it('reports on transform', () => {
        plugin('context', { write }).transform();
        expect(write).toHaveBeenCalledTimes(2);
    });
    it('reports on generateBundle', () => {
        plugin('context', { write }).generateBundle();
        expect(write).toHaveBeenCalledTimes(2);
    });
});

