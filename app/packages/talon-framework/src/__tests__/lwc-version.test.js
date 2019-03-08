const lwcEnginePackageJson = require.resolve('@lwc/engine/package.json');
const { version: actualLwcVersion } = require(lwcEnginePackageJson);

const expectedLwcVersion = require('../../package.json').devDependencies['@lwc/engine'];

describe('lwc-version', () => {
    /**
     * For some reason, yarn sometimes picks the wrong LWC version.
     *
     * This test ensures the JAR won't get built with the wrong version.
     */
    it('engine version matches the one in package.json', () => {
        expect(actualLwcVersion).toBe(expectedLwcVersion);
    });
});