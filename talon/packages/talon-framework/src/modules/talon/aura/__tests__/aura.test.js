import { executeGlobalController, createComponent } from "talon/aura";
import { log } from "talon/logger";

jest.mock('talon/logger', () => {
    return {
        log: jest.fn()
    };
});

beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
        function handleRecordUi(action, params) {
            const re = /\/([a-zA-Z0-9,]+)(\?fields=([a-z,A-Z.0-9]+))?/;
            const paramsParse = re.exec(params);
            const recordIdParam = paramsParse[1];
            const fieldParam = paramsParse[2];
            let promiseResolver;

            if (action === "getRecordsWithFields") {
                if (paramsParse[0] !== params) {
                    promiseResolver = (resolve) => {
                        const response = { json: () => Object.assign({}, { "hasErrors": true })};
                        resolve(response);
                    };
                } else {
                    promiseResolver = (resolve) => {
                        const fields = fieldParam.split(",");
                        const fieldsResponse = fields.reduce((map, field) => {
                            map[field.split(".")[1]] = "Whatever";
                            return map;
                        }, {});

                        const recordIds = recordIdParam.split(",");
                        const response = recordIds.reduce((map, id) => {
                            map = {id, "apiName": "Account", "fields": fieldsResponse};
                            return { json: () => Object.assign({}, {"results": [{"result": map}] }) };
                        }, {});

                        resolve(response);
                    };
                }
            } else if (action === "getRecordUis") {
                promiseResolver = (resolve) => {
                    const recordIds = recordIdParam.split(",");
                    const recordMap = {};
                    recordIds.forEach(recordId => {
                        recordMap[recordId] = {"id": recordId, "apiName": "Account"};
                    });

                    const response = { json: () => recordMap };

                    resolve(response);
                };
            } else {
                return Promise.reject("Unknown action");
            }

            return new Promise(promiseResolver);
        }

        function handleApexAction(action) {
            let promiseResolver;

            if (action === "execute") {
                promiseResolver = (resolve) => {
                    const jsonResponse = {};
                    jsonResponse.returnValue = true;
                    resolve({ json: () => jsonResponse });
                };
                return new Promise(promiseResolver);
            }
            return Promise.reject("Unknown action");
        }

        const urlParse = /api\/(\w+)\/(\w+)(.*)/.exec(url);
        const controller = urlParse[1];
        const action = urlParse[2];

        if (controller === "RecordUiController") {
            return handleRecordUi(action, urlParse[3]);
        } else if (controller === "ApexActionController") {
            return handleApexAction(action);
        }
        return Promise.reject(`Unsupported wire service controller: ${controller}`);
    });
});

describe('talon/aura', () => {
    describe('createComponent', () => {
        it('fails with unsupported wire service', () => {
            const name = 'someComponent';
            const attributes = {name: 'someName', value: 'someValue'};
            createComponent(name, attributes);
            expect(log).toHaveBeenCalledWith(`[aura] createComponent(${JSON.stringify({ name, attributes })})`);
        });
    });
    describe('executeGlobalController', () => {
        it('fails with unsupported wire service', () => {
            const response = executeGlobalController("RecordUiController.unknown", {});
            return expect(response).rejects.toBe("Unsupported RecordUiController action: unknown");
        });

        it('calls getRecordsWithFields and returns the right data', async () => {
            const response = await executeGlobalController("RecordUiController.getRecordWithFields", {"optionalFields": ["Account.Name,Account.SystemModstamp"], "recordId": "abc"});
            expect(response.id).toBe("abc");
            expect(response.fields.Name).toBe("Whatever");
            expect(response.fields.SystemModstamp).toBe("Whatever");
        });

        it('calls getRecordUis and returns the right data', async () => {
            const response = await executeGlobalController("RecordUiController.getRecordUis", {"recordIds": ["abc", "cbd"]});
            expect(response.abc.id).toBe("abc");
            expect(response.cbd.id).toBe("cbd");
        });

        it('fails when the response hasErrors', () => {
            // this is required because of a bug in jest which is fixed in v23.0.1
            // https://github.com/facebook/jest/issues/3839
            async function waitForIt()  {
                await executeGlobalController("RecordUiController.getRecordWithFields", {"optionalFields": ["@"], "recordId": "abc"});
            }
            return expect(waitForIt()).rejects.toBe('There are errors');
        });

        it('promise is rejected when server returns a non successful status', () => {
            // this is required because of a bug in jest which is fixed in v23.0.1
            // https://github.com/facebook/jest/issues/3839
            async function waitForIt() {
                await executeGlobalController("SomeOtherController.getRecordWithFields", {"optionalFields": ["Account.Name"], "recordId": "abc"});
            }
            return expect(waitForIt()).rejects.toBe("Unsupported wire service controller: SomeOtherController");
        });

        it('calls ApexActionController.execute and returns the right data', async () => {
            const params = { username: 'admin@gus.com', password: '1234', startUrl: 'https://some.url.com' };
            const options = {
                namespace: 'applauncher',
                classname: 'LoginFormController',
                methodname: 'login',
                params
            };
            const fetchData = {...options, controller : "ApexActionController" };

            const response =  await executeGlobalController(`${fetchData.controller}.execute`, options);
            expect(response).toBe(true);
        });

        it('promise is rejected when ApexActionController is called with incorrect action', () => {
            const params = { username: 'admin@gus.com', password: '1234', startUrl: 'https://some.url.com' };
            const options = {
                namespace: 'applauncher',
                classname: 'LoginFormController',
                methodname: 'login',
                params
            };
            const fetchData = {...options, controller : "ApexActionController" };

            async function waitForIt() {
                await executeGlobalController(`${fetchData.controller}.badAction`, options);
            }
            return expect(waitForIt()).rejects.toBe("Unsupported ApexActionController action: badAction");
        });
    });
});