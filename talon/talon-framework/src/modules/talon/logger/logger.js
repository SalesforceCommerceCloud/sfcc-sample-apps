const { log: consoleLog, error: consoleError } = console;

export function log(...msg) {
    consoleLog(`[talon]`, ...msg);
}

export function logError(...msg) {
    consoleError(`[talon]`, ...msg);
}

export default { log, logError };