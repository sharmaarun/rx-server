import { createCoreControllers } from "@reactive/server";

export default createCoreControllers("admin", ctx => ({
    config(req) {
        return req.send({
            endpoints: ctx.endpoints.endpoints
        })
    }
}))