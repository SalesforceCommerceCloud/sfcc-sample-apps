import 'colors';
interface ErrorResult {
    schemaId: string;
    errors: any[];
}
export default class TalonMetadataValidator {
    constructor(configId: string);
    private ajv;
    private allSchemas;
    private compileSchemas;
    validate(data: any, schema: string): Promise<string | ErrorResult>;
    private internalValidate;
    private loadSchema;
}
export {};
