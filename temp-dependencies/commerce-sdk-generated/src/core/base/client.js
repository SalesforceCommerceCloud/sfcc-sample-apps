"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const resource_1 = require("./resource");
class BaseClient {
    constructor(baseUri) {
        this._headers = {
            "x-dw-client-id": "aaaaaaaaaaaaaaaaaaaa",
            "ms2-authorization": "bearer ea5a8ed9-0e0c-495c-81fe-ff954736c970"
        };
        this.baseUri = baseUri;
    }
    _get(path, pathParameters, queryParameters) {
        return node_fetch_1.default(new resource_1.Resource(this.baseUri, path, pathParameters, queryParameters).toString(), { headers: this._headers });
    }
}
exports.default = BaseClient;
exports.BaseClient = BaseClient;
var node_fetch_2 = require("node-fetch");
exports.Response = node_fetch_2.Response;
