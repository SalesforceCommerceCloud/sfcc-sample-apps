"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const path_1 = __importDefault(require("path"));
const yamljs_1 = __importDefault(require("yamljs"));
require("colors");
class TalonMetadataValidator {
    constructor(configId) {
        this.ajv = new ajv_1.default({ allErrors: true, extendRefs: true, verbose: true });
        this.allSchemas = new Map();
        const configPath = path_1.default.resolve(__dirname, '../config', `${configId}.config.yaml`);
        const config = yamljs_1.default.load(configPath);
        this.compileSchemas(config.schemas);
    }
    compileSchemas(schemasToCompile) {
        schemasToCompile.forEach((schemaId) => {
            const schema = this.loadSchema(schemaId);
            this.allSchemas.set(schemaId, schema);
            this.ajv.addSchema(schema);
        });
    }
    validate(data, schema) {
        return this.internalValidate(this.ajv, schema, data);
    }
    internalValidate(ajv, schemaId, data) {
        return new Promise((resolve, reject) => {
            const schema = this.allSchemas.get(schemaId);
            const validate = ajv.compile(schema);
            const valid = validate(data);
            if (!valid) {
                reject({ errors: validate.errors, schemaId, name: data.name });
            }
            else {
                resolve(`✔️ Validated ${schemaId}`);
            }
        });
    }
    loadSchema(schemaId) {
        const schemaDir = path_1.default.resolve(__dirname, '../schema');
        const schemaPath = path_1.default.resolve(schemaDir, `${schemaId}.schema.yaml`);
        const schema = yamljs_1.default.load(schemaPath);
        return schema;
    }
}
exports.default = TalonMetadataValidator;
