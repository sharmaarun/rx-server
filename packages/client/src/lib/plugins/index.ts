import { injectable } from "inversify"
import { ClientContext } from "../contexts"

@injectable()
export abstract class PluginClass<T = ClientContext> {
    protected ctx!: T
    public async init(ctx: T) {
        this.ctx = ctx
    }
    public start?(): void | Promise<void>
}

