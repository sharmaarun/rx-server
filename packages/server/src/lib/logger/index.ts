import { LoggerConfig, LogLevel } from "@reactive/commons";
import chalk from "chalk";
import { isNotEmpty } from "class-validator";
import { format } from "date-fns";
import { injectable } from "inversify";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";

export const LoggerLevelColorMap = {
    [LogLevel.success]: (str: string) => chalk.greenBright(str),
    [LogLevel.log]: (str: string) => str,
    [LogLevel.warn]: (str: string) => chalk.yellow(str),
    [LogLevel.info]: (str: string) => chalk.gray(str),
    [LogLevel.error]: (str: string) => chalk.redBright(str),
    [LogLevel.debug]: (str: string) => chalk.gray(str),
}

export type PrintOptions = LoggerConfig & {
    mode: LogLevel
}

@injectable()
export class Logger extends PluginClass {
    private level!: LogLevel
    private timestamps!: boolean
    private _log!: any
    private _warn!: any
    private _debug!: any
    private _info!: any
    private _error!: any
    constructor() {
        super()

        // hijack default console methods
        this._log = console.log
        this._warn = console.warn
        this._debug = console.debug
        this._info = console.info
        this._error = console.error
        console.log = this.log
        console.warn = this.warn
        console.debug = this.debug
        console.info = this.info
        console.error = this.error

    }

    override async init(ctx?: ServerContext) {
        this.level = ctx?.config.logger.level ?? LogLevel.debug;
        this.timestamps = isNotEmpty(ctx?.config.logger.timestamps) ? ctx?.config.logger.timestamps ?? true : true;
    }

    private print = (opts: PrintOptions, ...strs: string[]) => {
        const opts_ = {
            level: this.level,
            timestamps: this.timestamps,
            ...(opts)
        }
        const { mode, timestamps } = opts_ || {}
        // colorify 
        let str_ = Array.isArray(strs) ? strs.map(s => LoggerLevelColorMap[mode]?.(s)) : LoggerLevelColorMap[mode]?.(strs)
        let timestampStr = ""
        if (timestamps) {
            timestampStr = chalk.bgGray(`[${format(new Date(), "dd-MM-yyyy HH:mm:ss a")}]`)
        }

        switch (mode) {
            case LogLevel.debug:
                this._debug(timestampStr, ...str_)
                break;
            case LogLevel.error:
                this._error(timestampStr, ...str_)
                break;
            case LogLevel.info:
                this._info(timestampStr, ...str_)
                break;
            case LogLevel.log:
                this._log(timestampStr, ...str_)
                break;
            case LogLevel.warn:
                this._warn(timestampStr, ...str_)
                break;
            case LogLevel.success:
                this._log(timestampStr, ...str_)
                break;
        }
    }

    public debug = (...str: string[]) => {
        this.print({ mode: LogLevel.debug }, ...str)
    }
    public info = (...str: string[]) => {
        this.print({ mode: LogLevel.info }, ...str)
    }
    public log = (...str: string[]) => {
        this.print({ mode: LogLevel.log }, ...str)
    }
    public warn = (...str: string[]) => {
        this.print({ mode: LogLevel.warn }, ...str)
    }
    public error = (...str: string[]) => {
        this.print({ mode: LogLevel.error }, ...str)
    }
    public success = (...str: string[]) => {
        this.print({ mode: LogLevel.success }, ...str)
    }
}