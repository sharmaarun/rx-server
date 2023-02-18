import { createCoreControllers } from "@reactive/server";

export default createCoreControllers("explorer", ctx => ({
    config(req) {
        return req.send({
            endpoints: ctx.endpoints.endpoints
        })
    }
}))