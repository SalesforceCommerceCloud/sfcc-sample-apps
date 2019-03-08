import { createElement } from "talon/componentService";

jest.mock('lwc', () => ({
    createElement(sel, options) {
        return { sel, options };
    }
}));

jest.mock('talon/moduleRegistry', () => ({
    async getComponent(name) {
        return `module(${name})`;
    }
}));

jest.mock('talon-common', () => ({
    moduleSpecifierToElementName(name) {
        return `moduleSpecifierToElementName(${name})`;
    }
}));

describe('talon/componentService', () => {
    describe('createElement', () => {
        it('create element using engine', async () => {
            const el = await createElement('my-module');
            expect(el).toEqual({
                sel: 'moduleSpecifierToElementName(my-module)',
                options: {
                    is: 'module(my-module)',
                    fallback: true
                }
            });
        });
    });
});