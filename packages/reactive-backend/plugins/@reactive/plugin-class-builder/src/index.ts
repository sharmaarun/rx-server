import { ServerContext, PluginClass, Endpoint, registerEndpoint } from "@reactive/server";
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
        registerEndpoint(ctx => ({
            name: "class-builder",
            constrollers: controllers(),
            routes: routes(),
            schema
        }))()
    }


}