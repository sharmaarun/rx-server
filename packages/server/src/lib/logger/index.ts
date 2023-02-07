import { injectable } from "inversify";
import { PluginClass } from "../plugin";


export type LoggerOpts = {
}

@injectable()
export class Logger extends PluginClass {
    override async init(opts?: LoggerOpts) {

    }
    info(str: any) {
        console.info(str)
    }
    log(str: any) {
        console.log(str)
    }
    warn(str: any) {
        console.warn(str)
    }
    error(str: any) {
        console.error(str)
    }
}