const { getSourcePathsFromContext, getModuleEntries } = require('../resolver');
const { startTestContext, endTestContext, DEFAULT_OPTIONS: { templateDir } } = require('test-talon-context');

jest.mock('lwc-module-resolver', () => ({
    resolveModulesInDir(dir) {
        const paths = {};
        paths[dir.split('/packages/')[1]] = true;
        return paths;
    },
    resolveLwcNpmModules() {
        return {
            npm: true
        };
    }
}));

describe('resolver', () => {
    describe('getSourcePathsFromContext', () => {
        beforeEach(() => {
            return startTestContext();
        });

        afterEach(() => {
            endTestContext();
        });

        it('includes NPM modules', () => {
            expect(getSourcePathsFromContext()).toHaveProperty("npm");
        });
        it('includes framework modules', () => {
            expect(getSourcePathsFromContext()).toHaveProperty("talon-framework/src/modules");
        });
        it('includes template modules', () => {
            expect(getSourcePathsFromContext()).toHaveProperty("talon-compiler/src/__tests__/fixtures/src/modules");
        });
    });
    describe('getModuleEntries', () => {
        it('includes sub directories', () => {
            return getModuleEntries(`${templateDir}/src/modules/x/cmp2`).then(entries => {
                expect(entries).toMatchSnapshot();
            });
        });
    });
});