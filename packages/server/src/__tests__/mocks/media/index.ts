import { PluginClass } from "@reactive/commons";

export class MediaManager implements PluginClass {
    ctx!: any
    async init(ctx: any) {
        this.ctx = ctx
    }
}