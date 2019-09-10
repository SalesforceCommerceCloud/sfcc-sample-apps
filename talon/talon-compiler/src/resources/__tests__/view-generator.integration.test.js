import ViewGenerator from '../view-generator';
import { startTestContext, endTestContext } from 'test-talon-context';

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

const generator = new ViewGenerator();

jest.setTimeout(process.env.JEST_TIMEOUT || 30000);

describe('view-generator [integration]', () => {
    it('generates view resource', async () => {
        return generator.get('view://home').then((staticResource) => {
            expect(staticResource).toMatchSnapshot();
        });
    });
    it('generates theme layout view resource', async () => {
        return generator.get('view://themeLayoutDefault').then((staticResource) => {
            expect(staticResource).toMatchSnapshot();
        });
    });
});

