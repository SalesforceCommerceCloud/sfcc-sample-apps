import { getApexInvoker } from 'talon/apexUtils';
import apiCall from "talon/apiCall";

jest.mock("talon/apiCall", () => jest.fn());

describe('talon/apexUtils', () => {
    describe('getApexInvoker', () => {
        it('returns a function that will call executeGlobalController', () => {
            const namespace = 'applauncher';
            const classname = 'LoginFormController';
            const methodname = 'login';
            const resource = `@salesforce/apex/${namespace}.${classname}.${methodname}`;
            const params = { username: 'admin@gus.com', password: '1234', startUrl: 'https://some.url.com' };
            const cacheable = false;

            const loginFunction = getApexInvoker(resource);
            loginFunction(params);

            expect(apiCall)
                .toBeCalledWith("ApexActionController.execute", { namespace, classname, methodname, params, cacheable });
        });

        it('returns a function that will call executeGlobalController without a namespace', () => {
            const classname = 'LoginFormController';
            const methodname = 'login';
            const resource = `@salesforce/apex/${classname}.${methodname}`;
            const params = { username: 'admin@gus.com', password: '1234', startUrl: 'https://some.url.com' };
            const cacheable = false;

            const loginFunction = getApexInvoker(resource);
            loginFunction(params);

            expect(apiCall)
                .toBeCalledWith("ApexActionController.execute", { namespace: '', classname, methodname, params, cacheable });
        });

        it('fails if no method name is specified', () => {
            const classname = 'LoginFormController';
            const methodname = '';
            const resource = `@salesforce/apex/${classname}.${methodname}`;

            expect(() => getApexInvoker(resource)).toThrow(new Error(`Failed to parse Apex method name for ${resource}.`));
        });
    });
});