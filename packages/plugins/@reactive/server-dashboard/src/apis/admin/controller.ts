import { createControllers } from "@reactive/server";

export default createControllers("admin", ctx => ({
    config(req) {
        return req.send({
            endpoints: ctx.endpoints.endpoints
        })
    }
}))