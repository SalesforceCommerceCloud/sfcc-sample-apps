import { sortDependencies, buildResourceContents, compileTemplate, compile } from '../compiler-service';
import { getLabels } from '../../metadata/metadata-service';
import { startTestContext, endTestContext } from 'test-talon-context';

jest.mock('../../metadata/metadata-service');
getLabels.mockImplementation(() => {
    return {"MySection": {
        "foo": "foo label"
    }};
});

describe('compiler-service', () => {
    describe('sortDependencies', () => {
        it('sorts component dependencies', () => {
            const compiledModules = {
                'x-app': {name: 'x-app'},
                'x-search': {name: 'x-search'},
                'x-form': {name: 'x-form'},
                'x-input': {name: 'x-input'},
                'x-contact': {name: 'x-contact'}
            };
            const graph = [
                ['x-form', 'x-input'],
                ['x-contact', 'x-form'],
                ['x-app', 'x-search'],
                ['x-app', 'x-contact']
            ];

            expect(sortDependencies({graph, compiledModules})).toEqual(
                [{name: 'x-search'},
                 {name: 'x-input'},
                 {name: 'x-form'},
                 {name: 'x-contact'},
                 {name: 'x-app'}]
            );
        });

        it('ignores undefined values', () => {
            const compiledModules = {
                'x-app': {name: 'x-app'},
                'x-search': {name: 'x-search'},
                'x-form': {name: 'x-form'},
                'x-input': {name: 'x-input'},
                'x-contact': {name: 'x-contact'}
            };
            const graph = [
                [undefined, 'x-input'],
                ['x-form', 'x-input'],
                [undefined, 'x-form'],
                ['x-app', 'x-search'],
                ['x-contact', 'x-form'],
                ['x-app', 'x-contact']
            ];

            expect(sortDependencies({graph, compiledModules})).toEqual(
                [{name: 'x-input'},
                 {name: 'x-form'},
                 {name: 'x-contact'},
                 {name: 'x-search'},
                 {name: 'x-app'}]
            );
        });

        it('throws when no dependencies sorted', () => {
            const compiledModules = {
                'x-app': {name: 'x-app'},
                'x-search': {name: 'x-search'},
                'x-form': {name: 'x-form'},
                'x-input': {name: 'x-input'},
                'x-contact': {name: 'x-contact'}
            };
            const graph = [
            ];

            expect(() => {
                sortDependencies({graph, compiledModules});
            }).toThrowError('No dependencies to write!');
        });
    });

    describe('buildResourceContents', () => {
        it('adds label code at the beginning', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "dev code"
                }]
            ];
            const requiredLabels = ["MySection.foo"];
            const contents = buildResourceContents(dependencies, requiredLabels);
            expect(contents.dev).toMatch(`Talon.moduleRegistry.addModules({"@salesforce/label/MySection.foo":"foo label"});`);
        });

        it('throws if label section not found', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "dev code"
                }]
            ];
            const requiredLabels = ["SomeSection.foo"];
            expect(() => {
                buildResourceContents(dependencies, requiredLabels);
            }).toThrowError("Labels section not found: SomeSection");
        });

        it('throws if label not found', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "dev code"
                }]
            ];
            const requiredLabels = ["MySection.notFound"];
            expect(() => {
                buildResourceContents(dependencies, requiredLabels);
            }).toThrowError("Label not found in section MySection: notFound");
        });

        it('adds a module to the module registry', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('hello', function() { };);"
                }]
            ];

            expect(buildResourceContents(dependencies, []).dev).toMatchSnapshot();
        });

        it('adds multiple modules to the module registry', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('foo', function() { };);\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('bar', function() { };);\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('baz', function() { };);\n"
                }]
            ];

            expect(buildResourceContents(dependencies, []).dev).toMatchSnapshot();
        });

        it('conditionally adds to module registry based on amd define method', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "export function whatever() { console.log(\"whatever\"); };\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('bar', function() { };);\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('baz', function() { };);\n"
                }]
            ];

            expect(buildResourceContents(dependencies, []).dev).toMatchSnapshot();
        });

        it('bundles dev and prod modes separately', () => {
            const dependencies = [
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('foo', function() { };);\n"
                },
                {
                    outputConfig: {
                        mode: "prod"
                    },
                    code: "define('blah', someProdStuff() { }\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('bar', function() { };);\n"
                }],
                [{
                    outputConfig: {
                        mode: "dev"
                    },
                    code: "define('baz', function() { };);\n"
                }]
            ];

            expect(buildResourceContents(dependencies, [])).toMatchSnapshot();
        });
    });

    describe('compileTemplate', () => {
        beforeEach(() => {
            return startTestContext();
        });

        afterEach(() => {
            endTestContext();
        });

        it('returns the right compiled modules', async () => {
            return compileTemplate('x', 'foo', '<template></template>', 'console.log("foo");').then(({compiledModules}) => {
                expect(compiledModules).toMatchSnapshot();
            });
        });

        it('returns the right dependency graph', async () => {
            return compileTemplate('x', 'foo', '<template></template>', 'console.log("foo");').then(({graph}) => {
                expect(graph).toEqual([[undefined, "x/foo"]]);
            });
        });

        it('returns the right required labels', async () => {
            return compileTemplate('x', 'foo', '<template></template>', `import emailLabel from '@salesforce/label/SomeSection.foo';\n\nconsole.log("foo");`).then(({requiredLabels}) => {
                expect(requiredLabels).toContain("SomeSection.foo");
            });
        });
    });

    describe('compile', () => {
        beforeEach(() => {
            return startTestContext();
        });

        afterEach(() => {
            endTestContext();
        });

        it('includes dependencies', async () => {
            return compile('x/home').then(({compiledModules}) => {
                expect(compiledModules).toMatchSnapshot();
            });
        });
    });
});