import { Response } from "node-fetch";
interface IClient {
    baseUri: string;
}
export default class BaseClient implements IClient {
    baseUri: string;
    constructor(baseUri: string);
    private _headers;
    protected _get(path: string, pathParameters?: object, queryParameters?: object): Promise<Response>;
}
export { BaseClient };
export { Response } from "node-fetch";
