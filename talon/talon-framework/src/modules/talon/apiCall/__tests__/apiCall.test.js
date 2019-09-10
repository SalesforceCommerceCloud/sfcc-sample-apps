import apiCall from "talon/apiCall";
import { getResourceReferenceFromAuraMethod } from 'talon-connect-gen';
import makeRequest from '../requests';

jest.mock('talon-connect-gen', () => ({
    getResourceReferenceFromAuraMethod: jest.fn()
}), { virtual: true });

jest.mock('../requests');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('talon/apiCall', () => {
    it('fails with unsupported controller', () => {
        const response = apiCall("UnknownController.unknownAction", {});
        return expect(response).rejects.toThrowError("Unsupported controller action: UnknownController.unknownAction");
    });

    it('fails with unsupported Apex action', () => {
        const response = apiCall("ApexActionController.unknownAction", {});
        return expect(response).rejects.toThrowError("Unsupported Apex action: unknownAction");
    });

    it('makes Apex POST request', async () => {
        makeRequest.mockImplementationOnce(async () => ({ returnValue: { data: 1 } }));

        const params = {};
        const actualReturnValue = await apiCall("ApexActionController.execute", params);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith({ path: `/apex/execute`, method: 'POST', body: params });
        expect(actualReturnValue).toEqual({ data: 1 });
    });

    it('makes UI API GET request', async () => {
        getResourceReferenceFromAuraMethod.mockImplementationOnce(endpoint => {
            return endpoint === 'UiApiController.action' && { urlPath: '/resource/${a}/${b}', urlPathParamNames: ['a', 'b'], verb: 'GET' };
        });

        makeRequest.mockImplementationOnce(async () => ({ data: 2 }));

        const params = {
            a: 1,
            b: 2
        };
        const actualReturnValue = await apiCall("UiApiController.action", params);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith({ path: `/resource/1/2`, method: 'GET' });
        expect(actualReturnValue).toEqual({ data: 2 });
    });

    it('makes UI API GET request with query param', async () => {
        getResourceReferenceFromAuraMethod.mockImplementationOnce(endpoint => {
            return endpoint === 'UiApiController.action' && { urlPath: '/resource/${a}', urlPathParamNames: ['a'], verb: 'GET' };
        });

        makeRequest.mockImplementationOnce(async () => ({ data: 2 }));

        const params = {
            a: 1,
            b: 2
        };
        const actualReturnValue = await apiCall("UiApiController.action", params);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith({ path: `/resource/1?b=2`, method: 'GET' });
        expect(actualReturnValue).toEqual({ data: 2 });
    });

    it('makes UI API POST request', async () => {
        getResourceReferenceFromAuraMethod.mockImplementationOnce(endpoint => {
            return endpoint === 'UiApiController.action' && { urlPath: '/resource/${a}/${b}', urlPathParamNames: ['a', 'b'], verb: 'POST', inputRepresentation: 'input' };
        });

        makeRequest.mockImplementationOnce(async () => ({ data: 2 }));

        const params = {
            a: 1,
            b: 2,
            input: {
                c: 3,
                d: 4
            }
        };
        const actualReturnValue = await apiCall("UiApiController.action", params);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith({ path: `/resource/1/2`, method: 'POST', body: { c: 3, d: 4 } });
        expect(actualReturnValue).toEqual({ data: 2 });
    });

    it('makes UI API POST request with query param', async () => {
        getResourceReferenceFromAuraMethod.mockImplementationOnce(endpoint => {
            return endpoint === 'UiApiController.action' && { urlPath: '/resource/${a}', urlPathParamNames: ['a'], verb: 'POST', inputRepresentation: 'input' };
        });

        makeRequest.mockImplementationOnce(async () => ({ data: 2 }));

        const params = {
            a: 1,
            b: 2,
            input: {
                c: 3,
                d: 4
            }
        };
        const actualReturnValue = await apiCall("UiApiController.action", params);
        expect(makeRequest).toHaveBeenCalledTimes(1);
        expect(makeRequest).toHaveBeenCalledWith({ path: `/resource/1?b=2`, method: 'POST', body: { c: 3, d: 4 } });
        expect(actualReturnValue).toEqual({ data: 2 });
    });
});