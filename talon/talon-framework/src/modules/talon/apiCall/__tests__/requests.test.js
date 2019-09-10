import makeRequest from '../requests';
import { getBasePath } from 'talon/configProvider';

jest.mock('talon/configProvider');

global.fetch = jest.fn(async () => ({ ok: true, json: () => ({}) }));
const { fetch } = global;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('talon/apiCall/requests', () => {
    it('fetches', () => {
        getBasePath.mockImplementationOnce(() => '');

        makeRequest({ path: '/resource?a=1', method: 'method' });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/resource?a=1', { "body": undefined, "credentials": "same-origin", "headers": {}, "method": "method" });
    });
    it('fetches with body', () => {
        getBasePath.mockImplementationOnce(() => '');

        makeRequest({ path: '/resource?a=1', method: 'method', body: { a: 1 } });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/api/resource?a=1', { "body": '{"a":1}', "credentials": "same-origin", "headers": { 'Content-Type': 'application/json; charset=utf-8' }, "method": "method" });
    });
    it('adds base path', () => {
        getBasePath.mockImplementationOnce(() => '/talon');

        makeRequest({ path: '/resource', method: 'method' });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('/talon/api/resource', { "body": undefined, "credentials": "same-origin", "headers": {}, "method": "method" });
    });
    it('returns json', async () => {
        fetch.mockImplementationOnce(async () => ({ ok: true, json: () => ({ b: 2 }) }));

        const returnValue = await makeRequest({});
        expect(returnValue).toEqual({ b: 2 });
    });
    it('throws when response is not ok', async () => {
        fetch.mockImplementationOnce(async () => ({ ok: false, statusText: 'statusText' }));

        return expect(makeRequest({})).rejects.toBe('statusText');
    });
});