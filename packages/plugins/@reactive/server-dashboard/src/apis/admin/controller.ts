import { createCoreControllers } from "@reactive/server";

export default createCoreControllers("admin", ctx => ({
    config(req) {
        return req.send({
            endpoints: ctx.endpoints.endpoints,
            host: ctx.config.server.host,
            port: ctx.config.server.port,
            webRoot: ctx.config.api.webRoot
        })
    }
}))