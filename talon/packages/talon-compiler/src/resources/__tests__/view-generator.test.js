import ViewGenerator from '../view-generator';
import { startTestContext, endTestContext } from 'test-talon-context';
import { compileTemplate, sortDependencies, buildResourceContents } from '../../compiler/compiler-service';
import { getView } from '../../metadata/metadata-service';
import view from '../../__tests__/fixtures/src/views/about.json';

jest.mock('../../compiler/compiler-service');
jest.mock('../../metadata/metadata-service');

beforeEach(() => {
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

    compileTemplate.mockImplementation(() => {
        return Promise.resolve({
            compiledModules: {
                [view.component.name]: {"dev": "dev code", "prod": "prod code"}
            },
            requiredLabels: [],
            graph: [[undefined, view.component.name]]
        });
    });

    sortDependencies.mockImplementation(() => {
        return [view.component.name];
    });

    buildResourceContents.mockImplementation(() => {
        return { "dev": "dev code", "prod": "prod code" };
    });

    it('generates view resource', async () => {
        return generator.get('view://community_flashhelp/about').then((staticResource) => {
            expect(JSON.stringify(staticResource, null, 3)).toMatchSnapshot();
        });
    });
});

