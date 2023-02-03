import { injectable } from "inversify"
import { ServerContext } from "../context"
import { PluginClass } from "../plugin"

export type DBConfig = {
    adapter: string
    options: DBConnectionOpts
}

export interface DBAdapter extends PluginClass<ServerContext> {
    connect: () => void
    disconnect: () => void
}

export type DBConnectionOpts = {
    type?: string
    protocol?: string
    host?: string
    port?: number
    username?: string
    password?: string
    database?: string
}

export type EntitySchema = {
    name: string
}

@injectable()
export class DBManager implements PluginClass<ServerContext>{
    public async init(opts?: ServerContext) {
        const { config } = opts || {}
        const { adapter: name, options } = config?.db || {}
        // load the adapter
        const adapter = (await import("@reactive/adapter-" + name))?.default
        // initialise the adapter and pass the config
        const registerEntity = await adapter?.(opts)
    }
}
