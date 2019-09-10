import getOutputConfigs from '../output-configs';

describe('output-configs', () => {
    describe('getOutputConfigs', () => {
        for (const modes of [null, undefined, ""]) {
            it(`returns all configs when specified modes is ${JSON.stringify(modes)}`, () => {
                expect(getOutputConfigs(modes)).toHaveLength(6);
            });
        }
        it(`returns specified config`, () => {
            expect(getOutputConfigs('dev')).toHaveLength(1);
        });
        it(`returns multiple specified config`, () => {
            expect(getOutputConfigs(['dev', 'compat', 'prod'])).toHaveLength(3);
        });
        it(`returns default if specified mode is unkmown`, () => {
            expect(getOutputConfigs('unknown')).toHaveLength(1);
        });
    });
});
