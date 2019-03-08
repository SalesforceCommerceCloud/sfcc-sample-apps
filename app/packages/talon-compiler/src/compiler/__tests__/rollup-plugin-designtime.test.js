const path = require('path');
const plugin = require('../rollup-plugin-designtime');

describe('rollup-plugin-designtime', () => {
    describe('resolveId', () => {
        it('resolves talondesign modules', async () => {
            expect(plugin().resolveId('talondesign/componentWrapper'))
                .toBe(path.resolve(__dirname, '../../../../talon-framework/src/modules/talondesign/componentWrapper/componentWrapper.js'));
        });

        it('ignores other modules', async () => {
            expect(plugin().resolveId('talon/bird')).toBe(null);
        });
    });
});