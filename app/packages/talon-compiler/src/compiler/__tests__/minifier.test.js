import { minify } from '../minifier';
import terser from 'terser';

jest.mock('terser', () => ({
    minify: jest.fn((code) => ({ code : `minified[${code}]`}))
}));

const input = 'input';
const env = 'es2017';
const target = 'production';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('minifier', () => {
    describe('minify', () => {
        it('minifies', async () => {
            return minify({ input, env, target, content: 'some code' }).then(minifiedContent => {
                expect(minifiedContent).toBe('minified[some code]');
            });
        });

        it('rejects on error', async () => {
            terser.minify.mockImplementationOnce(() => {
                return {
                    error: 'Failed'
                };
            });

            return expect(minify({ input, env, target, content: 'some code' })).rejects.toBe('Failed to minify input (production, es2017): Failed');
        });
    });
});

