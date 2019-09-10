import { compile } from '../compiler';
import { getConfig } from '../../config/config-service';
import { rollup } from 'rollup';
import { getContext } from '../../context/context-service';

jest.mock('rollup', () => {
    const result = { code: 'code' };

    const bundle = {
        generate() {
            return result;
        }
    };

    return {
        rollup: jest.fn(() => bundle)
    };
});

jest.mock('../../context/context-service', () => ({
    startContext: jest.fn(),
    getContext: jest.fn(() => ({})),
    endContext: jest.fn()
}));

jest.mock('../../config/config-service', () => ({
    getConfig: jest.fn(() => ({
        rollup: {
            external: [],
            output: {
                globals: {}
            }
        }
    }))
}));

const warn = jest.fn();

const input = 'input';
const id = 'id';
const env = 'es2017';
const target = 'production';
const virtualModules = {
    './ns/template1.js': 'some javascript',
    './ns/template1.html': 'some html',
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('compiler', () => {
    describe('compile', () => {
        it('returns content', async () => {
            return compile({ input, id, virtualModules, env, target }).then(content => {
                expect(content).toBe('code');
            });
        });
        it('logs warnings', async () => {
            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { onwarn } = rollup.mock.calls[0][0];
                onwarn({ code: 'SOME_WARNING', message: 'Warning!' }, warn);
                expect(warn).toHaveBeenCalledTimes(1);
            });
        });
        it('ignores circular dependencies warnings', async () => {
            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { onwarn } = rollup.mock.calls[0][0];
                onwarn({ code: 'CIRCULAR_DEPENDENCY', message: 'Warning!' }, warn);
                expect(warn).toHaveBeenCalledTimes(0);
            });
        });
        it('ignores talon modules', async () => {
            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { external } = rollup.mock.calls[0][0];
                expect(external('talon/someModule')).toBe(true);
            });
        });
        it('add talon-designtime plugin if env RENDER is DESIGNTIME', async () => {
            getContext.mockReturnValueOnce({ isPreview: true });
            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { plugins } = rollup.mock.calls[0][0];
                const designtimeplugin = plugins.find(plugin => plugin && plugin.name === 'rollup-plugin-talon-designtime');
                expect(designtimeplugin).toBeDefined();
            });
        });
        it('ignores talon-designtime plugin if env RENDER is not DESIGNTIME', async () => {
            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { plugins } = rollup.mock.calls[0][0];
                const designtimeplugin = plugins.find(plugin => plugin && plugin.name === 'rollup-plugin-talon-designtime');
                expect(designtimeplugin).toBeUndefined();
            });
        });
        it('ignores external modules', async () => {
            getConfig.mockImplementationOnce(() => ({
                rollup: {
                    external: ['a'],
                    output: {
                        globals: {}
                    }
                }
            }));

            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { external } = rollup.mock.calls[0][0];
                expect(external('a')).toBe(true);
            });
        });
        it('does not ignore global modules', async () => {
            getConfig.mockImplementationOnce(() => ({
                rollup: {
                    external: ['a'],
                    output: {
                        globals: {
                            'a': 'A'
                        }
                    }
                }
            }));

            return compile({ input, id, virtualModules, env, target }).then(() => {
                expect(rollup).toHaveBeenCalledTimes(1);
                const { external } = rollup.mock.calls[0][0];
                expect(external('a')).toBe(false);
            });
        });
    });
});

