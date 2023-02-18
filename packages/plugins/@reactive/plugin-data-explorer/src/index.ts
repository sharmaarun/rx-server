
import { PluginClass, registerCoreEndpoint, ServerContext } from "@reactive/server";
import explorerController from "./apis/explorer/controller";
import explorerRoutes from "./apis/explorer/routes";
import * as explorerSchema from "./apis/explorer/schema.json";

export default class ExplorerDashboard extends PluginClass {

    override async init(ctx: ServerContext) {
        this.ctx = ctx

        // explorer routes
        registerCoreEndpoint(ctx => ({
            name: "explorer",
            routes: explorerRoutes(),
            controllers: explorerController(),
            schema: explorerSchema,
        }))()
    }
}