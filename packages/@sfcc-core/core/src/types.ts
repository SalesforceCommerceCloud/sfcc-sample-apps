type ConfigValues =
    | 'COMMERCE_API_PATH'
    | 'COMMERCE_CLIENT_API_SITE_ID'
    | 'COMMERCE_CLIENT_CLIENT_ID'
    | 'COMMERCE_CLIENT_REALM_ID'
    | 'COMMERCE_CLIENT_INSTANCE_ID'
    | 'COMMERCE_CLIENT_ORGANIZATION_ID'
    | 'COMMERCE_CLIENT_SHORT_CODE'
    | 'COMMERCE_SESSION_SECRET'
    | 'COMMERCE_LOG_LEVEL'
    | 'COMMERCE_CORS';

export type Config = { [key in ConfigValues]: string };

export interface ApiConfig {
    config: Config;
}
export interface Logger {
    setLevel: (level: LogLevel) => void;
    log: (...args: Array<string>) => void;
    info: (...args: Array<string>) => void;
    debug: (...args: Array<string>) => void;
    warn: (...args: Array<string>) => void;
    error: (...args: Array<string>) => void;
}
export type Extension = any;
export type Service = any;
export type ExtensionFactory = () => Extension;
export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}
