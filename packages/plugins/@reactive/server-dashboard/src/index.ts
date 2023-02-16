
import { PluginClass, registerCoreEndpoint, ServerContext } from "@reactive/server";
import adminController from "./apis/admin/controller";
import adminRoutes from "./apis/admin/routes";
import * as adminSchema from "./apis/admin/schema.json";
export * from "./builder";
export default class AdminDashboard extends PluginClass {

    override async init(ctx: ServerContext) {
        this.ctx = ctx

        // admin routes
        registerCoreEndpoint(ctx => ({
            name: "/",
            routes: adminRoutes(),
            controllers: adminController(),
            schema: adminSchema,
        }))()
    }
}