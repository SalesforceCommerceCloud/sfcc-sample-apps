require('../compiler-worker');

const { compile } = require('../compiler');
const { worker } = require('workerpool');

jest.mock('../compiler');
jest.mock('../minifier');
jest.mock('workerpool');

describe('compiler-worker', () => {
    it('sets up worker', async () => {
        expect(worker).toHaveBeenCalledTimes(1);
        expect(worker).toHaveBeenCalledWith({ compile });
    });
});

