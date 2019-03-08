import ViewGenerator from '../view-generator';
import { startTestContext, endTestContext } from 'test-talon-context';
import { compile } from '../../compiler/compiler-service';
import { getView } from '../../metadata/metadata-service';
import view from '../../__tests__/fixtures/src/views/home.json';

jest.mock('../../compiler/compiler-service');
jest.mock('../../metadata/metadata-service');

beforeEach(() => {
    jest.clearAllMocks();
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

const generator = new ViewGenerator();

describe('view-generator', () => {
    getView.mockImplementation(() => {
        return view;
    });

    compile.mockImplementation(() => {
        return Promise.resolve({
            "dev": "dev code",
            "prod": "prod code"
        });
    });

    it('generates view resource', async () => {
        return generator.get('view://x/home').then((staticResource) => {
            expect(JSON.stringify(staticResource, null, 3)).toMatchSnapshot();
        });
    });

    it('compiles virtual modules', async () => {
        return generator.get('view://x/home').then(() => {
            expect(compile.mock.calls).toHaveLength(1);
            expect(compile.mock.calls[0][2]).toMatchSnapshot();
        });
    });
});

