/**
 * logger functions
 */
enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
}


// TODO: make DEFAULT_LOGGER_LEVEL configurable
const DEFAULT_LOGGER_LEVEL = LogLevel.INFO;

// TODO: use format string
export class Logger {
    private level: LogLevel;
    private moduleName: string;

    constructor(moduleName: string, level: LogLevel = DEFAULT_LOGGER_LEVEL) {
        this.level = level;
        this.moduleName = moduleName;
    }

    info(...message: any[]): void {
        if (this.level <= LogLevel.INFO) {
            console.log(new Date().toLocaleString(), this.moduleName, "INFO", ...message);
        }
    }

    debug(message: string): void {
        if (this.level <= LogLevel.DEBUG) {
            console.log(new Date().toLocaleString(), this.moduleName, "DEBUG", message);
        }
    }

    warn(...message: any[]): void {
        if (this.level <= LogLevel.WARN) {
            console.log(new Date().toLocaleString(), this.moduleName, "WARN", ...message);
        }
    }

    error(message: string): void {
        if (this.level <= LogLevel.ERROR) {
            console.log(new Date().toLocaleString(), this.moduleName, "CRIT", message);
        }
    }

    fatal(message: string): void {
        if (this.level <= LogLevel.FATAL) {
            console.log(new Date().toLocaleString(), this.moduleName, "FATAL", message);
            throw new Error("FATAL error deteced");
        }
    }
}
