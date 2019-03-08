import { ModuleRegistry } from "talon/moduleRegistry";
import { register as registerConfigProvider } from "talon/configProvider";
import { getViewModuleFullyQualifiedName } from "talon-common";
import * as lwc from '@lwc/engine';

jest.mock('@lwc/engine');
jest.mock('talon-connect-gen', () => ({}), { virtual: true });

registerConfigProvider({
    getBasePath() {
        return "/base";
    },
    getMode() {
        return "dev";
    },
    getLocale() {
        return "fr";
    }
});

let moduleRegistry;

beforeEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    moduleRegistry = new ModuleRegistry();
});

describe('talon/moduleRegistry', () => {
    describe('getModule', () => {
        it('returns added module', () => {
            const myModule = {};
            moduleRegistry.addModules({'my-module': myModule});
            return expect(moduleRegistry.getModule('my-module')).resolves.toBe(myModule);
        });
        it('returns added module with exporter', () => {
            const myModule = {};
            moduleRegistry.addModule(null, 'my-module', [], () => myModule);
            return expect(moduleRegistry.getModule('my-module')).resolves.toBe(myModule);
        });
        it('resolves dependencies', async () => {
            const myModule1 = {};
            moduleRegistry.addModule(null, 'my-module1', [], () => myModule1);

            const myModule2 = {};
            moduleRegistry.addModule(null, 'my-module2', ['my-module1'], (_myModule1) => Object.assign(myModule2, {
                myModule1: _myModule1
            }));

            const myActualModule2 = await moduleRegistry.getModule('my-module2');
            expect(myActualModule2).toBe(myModule2);
            expect(myActualModule2.myModule1).toBe(myModule1);
        });
        it('rejects on script load if module has not been loaded', async () => {
            const promise = moduleRegistry.getModule('my-module-async');

            document.body.firstChild.onload();

            return expect(promise).rejects.toEqual("Failed to load module: my-module-async");
        });
        it('rejects on script error', async () => {
            const promise = moduleRegistry.getModule('my-module-async');
            const error = {};

            document.body.firstChild.onerror(error);

            return expect(promise).rejects.toBe(error);
        });
        it('resolves module', async () => {
            const promise = moduleRegistry.getModule('my-module-async');

            const myModuleAsync = {};
            moduleRegistry.addModules({'my-module-async': myModuleAsync});

            document.body.firstChild.onload();

            return expect(promise).resolves.toBe(myModuleAsync);
        });
    });
    describe('addModules', () => {
        it('adds modules', async () => {
            moduleRegistry.addModules({
                'my-modules/1': 'my-modules/1 content',
                'my-modules/2': 'my-modules/2 content'
            });

            expect(await moduleRegistry.getModule('my-modules/1')).toBe('my-modules/1 content');
            expect(await moduleRegistry.getModule('my-modules/2')).toBe('my-modules/2 content');
        });
    });
    describe('addModule', () => {
        it('resolves lwc dependency', async () => {
            const myModule = {};
            moduleRegistry.addModule(null, 'my-module', ['lwc'], (_lwc) => Object.assign(myModule, {
                lwc: _lwc
            }));

            const myActualModule = await moduleRegistry.getModule('my-module');
            expect(myActualModule).toBe(myModule);
            expect(myActualModule.lwc).toBe(lwc);
            expect(document.body.firstChild).toBeNull();
        });

        it('swaps interop namespace', async () => {
            const myModule1 = {};
            moduleRegistry.addModule(null, 'interop/button', [], () => {});
            moduleRegistry.addModule(null, 'test/module1', ['lwc', 'lightning/button'], () => myModule1);

            expect(await moduleRegistry.getModule('interop/button')).toEqual(myModule1);
        });

        it('swaps messy interop namespace name', async () => {
            const myModule1 = {};
            moduleRegistry.addModule(null, 'interop/button-lightning-icon', [], () => {});
            moduleRegistry.addModule(null, 'test-module1', ['lwc', 'lightning/button-lightning-icon'], () => myModule1);

            expect(await moduleRegistry.getModule('interop/button-lightning-icon')).toEqual(myModule1);
        });

        it('supports AMD define with no dependency', async () => {
            const myModule = {};
            moduleRegistry.addModule(null, 'my-module', () => myModule);
            return expect(moduleRegistry.getModule('my-module')).resolves.toBe(myModule);
        });

        it('supports Salesforce scoped dependency with apex', async () => {
            const myModule = {};
            moduleRegistry.addModule(null, 'my-module', ['lwc', '@salesforce/apex/some.namespaced.apex'], () => myModule);
            return expect(moduleRegistry.getModule('my-module')).resolves.toBe(myModule);
        });

        it('cannot resolve unsupported Salesforce module dependency', async () => {
            function addFakeSalesforceModule() {
                moduleRegistry.addModule(null, 'my-module', ['lwc', '@salesforce/fake/namespace'], () => {});
            }

            expect(addFakeSalesforceModule)
                .toThrowError('Cannot resolve dependency \'@salesforce/fake/namespace\'');
        });

        it('cannot resolve unsupported scope dependency', async () => {
            function addFakeSalesforceModule() {
                moduleRegistry.addModule(null, 'my-module', ['lwc', '@fake/scope'], () => {});
            }

            expect(addFakeSalesforceModule)
                .toThrowError('Cannot resolve dependency \'@fake/scope\'');
        });

        it('cannot resolve unsupported module dependency', async () => {
            function addFakeSalesforceModule() {
                moduleRegistry.addModule(null, 'my-module', ['lwc', 'fake/module'], () => {});
            }

            expect(addFakeSalesforceModule)
                .toThrowError('Cannot resolve module \'fake\'');
        });

        it('support circular dependency', async () => {
            moduleRegistry.addModule(null, 'test-circular-module', ['lwc', 'test-circular-module'], (_lwc, _testCircularModule) => ({
                a() {
                    return 'a';
                },
                b() {
                    return _testCircularModule.a() + 'b';
                }
            }));

            const testCircularModule = await moduleRegistry.getModule('test-circular-module');

            expect(testCircularModule.b()).toBe('ab');
        });

        it('supports modules with no default export', async () => {
            moduleRegistry.addModule(null, 'test-exports-module', ['exports'], (exports) => {
                exports.a = 1;
                exports.b = 2;
            });

            const testExportsModule = await moduleRegistry.getModule('test-exports-module');

            expect(testExportsModule).toEqual({
                a: 1,
                b: 2
            });
        });
    });
    describe('getTemplate', () => {
        it('return a template', () => {
            const myModule = {};
            const moduleName = 'my-module';
            const fullyQualifiedModuleName = getViewModuleFullyQualifiedName(moduleName);
            moduleRegistry.addModule(null, fullyQualifiedModuleName, () => myModule);
            return expect(moduleRegistry.getTemplate(moduleName)).resolves.toBe(myModule);
        });
    });
    describe('getComponent', () => {
        it('returns a component', () => {
            const cmp1 = {};
            moduleRegistry.addModule(null, 'x/cmp1', () => cmp1);
            return expect(moduleRegistry.getComponent('x/cmp1')).resolves.toBe(cmp1);
        });
        it('gets component from server', () => {
            moduleRegistry.getComponent('x/cmp1');
            expect(document.body.firstChild.tagName).toBe('SCRIPT');
            expect(document.body.firstChild.src).toBe('https://localhost/base/talon/component/latest/dev/fr/x/cmp1.js');
        });
    });
    describe('getModuleIfPresent', () => {
        it('return a present module', () => {
            const myModule = {};
            moduleRegistry.addModule(null, 'my-module', () => myModule);
            expect(moduleRegistry.getModuleIfPresent('my-module')).toBe(myModule);
        });
    });
    describe('setResourceUids', () => {
        it('set a resource uid', () => {
            moduleRegistry.setResourceUids('someResourceUid');
            expect(moduleRegistry.resourceUids).toEqual('someResourceUid');
        });
    });
    describe('hasModule', () => {
        it('check if module is present', () => {
            moduleRegistry.addModule(null, 'my-module', () => {});
            expect(moduleRegistry.hasModule('my-module')).toEqual(true);
        });
    });
});
