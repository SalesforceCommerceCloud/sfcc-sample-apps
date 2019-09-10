import ComponentGenerator from '../component-generator';
import { startTestContext, endTestContext } from 'test-talon-context';

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

const generator = new ComponentGenerator();

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);

describe('component-generator [integration]', () => {
    it('generates component resource', async () => {
        return generator.get('component://x/cmp1').then((staticResource) => {
            expect(staticResource).toMatchSnapshot();
        });
    });
});

