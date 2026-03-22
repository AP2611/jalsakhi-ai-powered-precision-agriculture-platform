/**
 * Modular Logger for JalSakhi
 * Provides tagged and leveled logging for easier debugging.
 */

declare var __DEV__: boolean;

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

// Current environment level - can be linked to __DEV__ or env variables
const CURRENT_LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

const log = (level: number, tag: string, message: string, data?: any) => {
    if (level >= CURRENT_LOG_LEVEL) {
        const timestamp = new Date().toISOString();
        const levelKey = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key as keyof typeof LOG_LEVELS] === level);
        const logMessage = `[${timestamp}] [${levelKey}] [${tag}]: ${message}`;

        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }
};

export const Logger = {
    debug: (tag: string, message: string, data?: any) => log(LOG_LEVELS.DEBUG, tag, message, data),
    info: (tag: string, message: string, data?: any) => log(LOG_LEVELS.INFO, tag, message, data),
    warn: (tag: string, message: string, data?: any) => log(LOG_LEVELS.WARN, tag, message, data),
    error: (tag: string, message: string, data?: any) => log(LOG_LEVELS.ERROR, tag, message, data),
};
