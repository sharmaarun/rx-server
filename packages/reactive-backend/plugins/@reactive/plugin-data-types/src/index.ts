// import { PluginClass } from "@reactive/commons";
import { registerPluginEndpoint, ServerContext, PluginClass } from "@reactive/server";
import controllers from "./apis/controller";
import routes from "./apis/routes";
import * as schema from "./apis/schema.json";

export default class ClassBuilder extends PluginClass {

    override async init(ctx: ServerContext) {
        this.ctx = ctx
        registerPluginEndpoint(ctx => ({
            name: "data-types",
            controllers: controllers(),
            routes: routes(),
            schema
        }))()
    }


}