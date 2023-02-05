import { ServerContext, PluginClass, Endpoint, registerPluginEndpoint } from "@reactive/server";
import controllers from "./apis/controller"
import routes from "./apis/routes"
import * as schema from "./apis/schema.json"
export default class ClassBuilder implements PluginClass {

    constructor(
        private ctx: ServerContext
    ) {
    }

    async init(ctx: ServerContext) {
        this.ctx = ctx
        registerPluginEndpoint(ctx => ({
            name: "data-types",
            controllers: controllers(),
            routes: routes(),
            schema
        }))()
    }


}