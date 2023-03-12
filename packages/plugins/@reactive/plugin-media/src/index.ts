import { PluginClass, ServerContext } from "@reactive/server";

export type MediaManagerOptions = {
    hashRounds?: number,
    jsonSecret?: string
}

export default class MediaManager extends PluginClass<MediaManagerOptions> {
    public override options!: MediaManagerOptions;
    override async init(ctx: ServerContext, options: MediaManagerOptions) {
        this.ctx = ctx
        this.options = options

    }
}