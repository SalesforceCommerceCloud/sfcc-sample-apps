import { compile } from '../compiler';

import { DEFAULT_OPTIONS as context } from 'test-talon-context';

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);

describe('compiler [integration]', () => {
    describe('compile', () => {
        it('returns content', async () => {
            return compile({ input: 'x/cmp1', target: 'es2017', env: 'development', context }).then(content => {
                expect(content).toMatchSnapshot();
            });
        });
    });
});