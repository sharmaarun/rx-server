import { File, isClass, loadModule, Plugin } from "@reactive/commons";
import { ServerContext } from "../context";
import { Request, Response } from "../express";
import { PluginClass } from "../plugin";

export abstract class MediaAdapter extends PluginClass {
    public abstract upload(fieldName: string, req: Request, res: Response): File | Promise<File>
}

/**
 * Media manager plugin
 * (can be extended via adapter plugin)
 */
export class MediaManager extends PluginClass {
    private _adapter!: MediaAdapter
    override async init(ctx: ServerContext) {
        this.ctx = ctx;

        // initialize the adapter if any
        const adapterName = ctx.config.media.adapter
        const Clazz = await loadModule(adapterName)
        this._adapter = new Clazz()
        console.debug(`Loaded media adapter: ${adapterName}`)
        await this.adapter.init(ctx)
    }

    get adapter() {
        return this._adapter
    }

}