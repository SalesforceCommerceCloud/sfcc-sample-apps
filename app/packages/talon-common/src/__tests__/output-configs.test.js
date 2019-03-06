import getOutputConfigs from '../output-configs';

describe('output-configs', () => {
    describe('getOutputConfigs', () => {
        it(`returns all configs`, () => {
            expect(getOutputConfigs()).toHaveLength(2);
        });
        it(`returns specified config`, () => {
            expect(getOutputConfigs('dev')).toHaveLength(1);
        });
        it(`returns default if specified mode is unkmown`, () => {
            expect(getOutputConfigs('unknown')).toHaveLength(1);
        });
    });
});
