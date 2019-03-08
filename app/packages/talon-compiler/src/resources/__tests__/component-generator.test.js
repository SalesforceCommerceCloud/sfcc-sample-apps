import ComponentGenerator from '../component-generator';
import { startTestContext, endTestContext } from 'test-talon-context';
import { compile } from '../../compiler/compiler-service';

jest.mock('../../compiler/compiler-service');
jest.mock('../../metadata/metadata-service');

beforeEach(() => {
    jest.clearAllMocks();
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

const generator = new ComponentGenerator();

describe('component-generator', () => {
    compile.mockImplementation((componentName) => {
        return Promise.resolve({
            "dev": `dev code ${componentName}`,
            "prod": `prod code ${componentName}`
        });
    });

    it('generates component resource', async () => {
        return generator.get('component://x/cmp1').then((staticResource) => {
            expect(JSON.stringify(staticResource, null, 3)).toMatchSnapshot();
        });
    });

    it('compiles component', async () => {
        return generator.get('component://x/cmp1').then(() => {
            expect(compile.mock.calls).toHaveLength(1);
            expect(compile.mock.calls[0][0]).toBe('x/cmp1');
        });
    });
});

