import { getConfig } from '../config-service.js';
import { startTestContext, updateTestContext, endTestContext } from 'test-talon-context';
const path = require('path');

jest.mock('../../utils/observable-folder-hash');
jest.mock('../../utils/filesystem');

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

describe('config-service', () => {
    describe('getConfig', () => {
        it('loads config from default path', () => {
            expect(getConfig()).toEqual({"rollup": {"external": ["a", "b"], "output": {"globals": {"b": "B", "c": "C"}}}});
        });
        it('loads config from custom path', () => {
            updateTestContext({ talonConfigJson: path.resolve(__dirname, 'talon.config.json') });
            expect(getConfig()).toEqual({"a": 1, "rollup": {"external": [], "output": {"globals": {}}}});
        });
    });
});