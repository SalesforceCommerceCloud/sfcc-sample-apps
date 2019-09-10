"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const validator = new index_1.default("base");
const errorFixture = [{
        dataPath: "foo-dataPath",
        message: "blah message",
        schemaPath: "foo-schemaPath",
        params: { hello: "world" }
    }];
const badSchemaError = new Error("bad schema!");
jest.mock('ajv', () => {
    // this is the constructor
    return function (configId) {
        // the compile function
        return { compile: (schema) => {
                // the validate function, only returned if compile succeeds
                function validateFunction() {
                    return false;
                }
                validateFunction.errors = errorFixture;
                if (schema) {
                    return validateFunction;
                }
                else {
                    throw badSchemaError;
                }
            },
            addSchema: jest.fn()
        };
    };
});
describe("When validation throws an error", function () {
    it("Rejects the promise with the right error object", () => {
        return expect(validator.validate([], "routes")).rejects.toEqual({
            errors: errorFixture,
            schemaId: "routes"
        });
    });
    it("Rejects the promise when the schema is not found", () => {
        return expect(validator.validate([], "unknownSchema")).rejects.toEqual(badSchemaError);
    });
});
