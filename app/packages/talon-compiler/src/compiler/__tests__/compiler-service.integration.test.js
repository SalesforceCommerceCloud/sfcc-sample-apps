import { compile } from '../compiler-service';
import { startTestContext, endTestContext } from 'test-talon-context';

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);

describe('compiler-service [integration]', () => {
    it('compiles component', async () => {
        return compile('x/cmp1').then(contents => {
            expect(contents).toMatchSnapshot();
        });
    });
    it('compiles template', async () => {
        const virtualModules = {
            './x/myModule/myModule.js': `import html from './myHtml.html'; export default { html };`,
            './x/myModule/myHtml.html': `<template><x-cmp1></x-cmp1></template>`,
        };
        return compile('./x/myModule/myModule.js', 'x/myModule', virtualModules).then(contents => {
            expect(contents).toMatchSnapshot();
        });
    });
    it('rejects on invalid javascript', async () => {
        const virtualModules = {
            './x/myModule/myModule.js': `import  from './myHtml.html'; export default { html };`,
            './x/myModule/myHtml.html': `<template><x-cmp1></x-cmp1></template>`,
        };
        return expect(compile('./x/myModule/myModule.js', 'x/myModule', virtualModules)).rejects.toThrow();
    });
    it('rejects on invalid html', async () => {
        const virtualModules = {
            './x/myModule/myModule.js': `import html from './myHtml.html'; export default { html };`,
            './x/myModule/myHtml.html': `<template><x-cmp1></template>`,
        };
        return expect(compile('./x/myModule/myModule.js', 'x/myModule', virtualModules)).rejects.toThrow();
    });
});

