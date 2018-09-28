/**
 * logger functions
 */
enum LogLevel {
    TRACE,
    INFO,
    WARN,
    CRIT,
    FATAL
}

class Logger {
    private lvl: LogLevel;

    constructor(lvl: LogLevel = LogLevel.INFO) {
        this.lvl = lvl;
    }

    info(): void {

    }

    trace(): void {

    }

    warn(): void {

    }

    crit(): void {

    }

    fatal(): void {

    }
}