import { LoggerConfig, LogLevel } from "@reactive/commons";
import chalk from "chalk";
import { isNotEmpty } from "class-validator";
import { format } from "date-fns";
import { injectable } from "inversify";
import { ServerContext } from "../context";
import { PluginClass } from "../plugin";

export const LoggerLevelColorMap = {
    [LogLevel.debug]: (str: string) => chalk.blueBright(str),
    [LogLevel.error]: (str: string) => chalk.redBright(str),
    [LogLevel.info]: (str: string) => chalk.gray(str),
    [LogLevel.log]: (str: string) => str,
    [LogLevel.warn]: (str: string) => chalk.yellow(str),
    [LogLevel.success]: (str: string) => chalk.greenBright(str),
}

export type PrintOptions = LoggerConfig & {
    mode: LogLevel
}

@injectable()
export class Logger extends PluginClass {
    private level!: LogLevel
    private timestamps!: boolean
    override async init(ctx?: ServerContext) {
        this.level = ctx?.config.logger.level ?? LogLevel.debug;
        this.timestamps = isNotEmpty(ctx?.config.logger.timestamps) ? ctx?.config.logger.timestamps ?? true : true;
    }

    print(opts: PrintOptions, ...strs: string[]) {
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
                console.debug(timestampStr, ...str_)
                break;
            case LogLevel.error:
                console.error(timestampStr, ...str_)
                break;
            case LogLevel.info:
                console.info(timestampStr, ...str_)
                break;
            case LogLevel.log:
                console.log(timestampStr, ...str_)
                break;
            case LogLevel.warn:
                console.warn(timestampStr, ...str_)
                break;
            case LogLevel.success:
                console.log(timestampStr, ...str_)
                break;
        }
    }

    debug(...str: string[]) {
        this.print({ mode: LogLevel.debug }, ...str)
    }
    info(...str: string[]) {
        this.print({ mode: LogLevel.info }, ...str)
    }
    log(...str: string[]) {
        this.print({ mode: LogLevel.log }, ...str)
    }
    warn(...str: string[]) {
        this.print({ mode: LogLevel.warn }, ...str)
    }
    error(...str: string[]) {
        this.print({ mode: LogLevel.error }, ...str)
    }
    success(...str: string[]) {
        this.print({ mode: LogLevel.success }, ...str)
    }
}