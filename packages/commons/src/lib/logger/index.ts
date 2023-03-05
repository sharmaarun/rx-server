

export enum LogLevel {
    "debug",
    "info",
    "log",
    "success",
    "warn",
    "error",
}

export type LoggerConfig = {
    level?: LogLevel
    timestamps?: boolean
}
