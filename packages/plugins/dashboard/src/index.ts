import { PluginClass, registerCoreEndpoint, ServerContext } from "@reactive/server";
import controller from "./apis/controller";
import routes from "./apis/routes";
import * as schema from "./apis/schema.json";
export * from "./builder";
export default class AdminDashboard implements PluginClass {
    private ctx?: ServerContext;
    init = async (ctx: ServerContext) => {
        this.ctx = ctx
        console.log("loaded...")
        registerCoreEndpoint(ctx => ({
            name: "/",
            routes: routes(),
            controllers: controller(),
            schema,
        }))()
    }
}