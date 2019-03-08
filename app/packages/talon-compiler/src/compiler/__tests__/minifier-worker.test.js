require('../minifier-worker');

const { minify } = require('../minifier');
const { worker } = require('workerpool');

jest.mock('../minifier');
jest.mock('workerpool');

describe('minifier-worker', () => {
    it('sets up worker', async () => {
        expect(worker).toHaveBeenCalledTimes(1);
        expect(worker).toHaveBeenCalledWith({ minify });
    });
});

