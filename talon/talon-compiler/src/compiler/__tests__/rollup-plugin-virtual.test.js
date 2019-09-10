const plugin = require('../rollup-plugin-virtual');

describe('rollup-plugin-virtual', () => {
    describe('resolveId', () => {
        it('resolves key', async () => {
            expect(plugin({ 'a.js': 1 }).resolveId('a.js')).toBe('a.js');
        });
        it('add .js extension', async () => {
            expect(plugin({ a: 1 }).resolveId('a')).toBe('a.js');
        });
        it('resolves relative path', async () => {
            expect(plugin({ './a.js': 1 }).resolveId('./a.js', '/module/b')).toBe('/module/a.js');
        });
    });
    describe('load', () => {
        it('loads value', async () => {
            expect(plugin({ a: 1 }).load('a')).toBe(1);
        });
        it('loads relative path', async () => {
            const virtual = plugin({ './a': 1 });
            virtual.resolveId('./a', '/module/b');
            expect(virtual.load('/module/a.js')).toBe(1);
        });
    });
});

