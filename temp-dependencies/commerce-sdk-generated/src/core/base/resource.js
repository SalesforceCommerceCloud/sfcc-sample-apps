"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
class Resource {
    constructor(baseUri, path, pathParameters, queryParameters) {
        this.renderedPath = this.path
            ? this.substitutePathParameters(this.path, this.pathParameters)
            : "";
        this.baseUri = baseUri;
        this.path = path;
        this.pathParameters = pathParameters;
        this.queryParameters = queryParameters;
    }
    substitutePathParameters(path, parameters) {
        return path.replace(/\{([^}]+)\}/g, (entireMatch, param) => {
            if (parameters && param in parameters) {
                return parameters[param];
            }
            throw new Error(`Failed to find a value for required path parameter '${param}'`);
        });
    }
    toString() {
        if (this.baseUri === null || this.baseUri === undefined) {
            throw new Error("baseUri is not set");
        }
        const renderedPath = this.path
            ? this.substitutePathParameters(this.path, this.pathParameters)
            : "";
        const queryString = qs_1.default.stringify(this.queryParameters);
        return `${this.baseUri}${renderedPath}${queryString ? "?" : ""}${queryString}`;
    }
}
exports.default = Resource;
exports.Resource = Resource;
