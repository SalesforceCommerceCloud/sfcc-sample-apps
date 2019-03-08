import { compile } from '../compiler-service';

jest.mock('../../context/context-service');

jest.mock('workerpool', () => {
    const pools = {};

    return {
        pools,
        pool(path) {
             const pool = {
                workers: [],
                async proxy() {
                    const worker = {
                        async compile({ input, id, virtualModules = {}, target, env }) {
                            return `${input}:${id}:${env}:${target}:${JSON.stringify(virtualModules)}`;
                        },
                        async minify({ input, target, env, content }) {
                            return `${input}:${env}:${target}:minify:${content}`;
                        }
                    };
                    pool.workers.push(worker);
                    return worker;
                }
            };
            pools[path] = pool;
            return pools[path];
        }
    };
});

const virtualModules = {
    './ns/template1.js': 'some javascript',
    './ns/template1.html': 'some html',
};

describe('compiler-service', () => {
    describe('compile', () => {
        it('returns content', async () => {
            const contents = await compile('input', 'id', virtualModules);
            expect(contents).toMatchSnapshot();
        });
    });
});

