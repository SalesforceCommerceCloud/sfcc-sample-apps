interface IResource {
    baseUri: string;
    path: string;
    pathParameters: object;
    queryParameters: object;
    substitutePathParameters(path: string, parameters: object): string;
    toString(): string;
}
export default class Resource implements IResource {
    baseUri: string;
    path: string;
    pathParameters: object;
    queryParameters: object;
    constructor(baseUri?: string, path?: string, pathParameters?: object, queryParameters?: object);
    substitutePathParameters(path: string, parameters: object): string;
    renderedPath: string;
    toString(): string;
}
export { Resource };
