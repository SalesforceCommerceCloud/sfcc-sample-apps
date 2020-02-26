export interface ApiConfig {
    config: { [key: string]: string };
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
