import { createControllers } from "@reactive/server";

export default createControllers("data-types", ctx => ({
    list(req, res) {
        return res.send(
            ctx.endpoints.endpoints
        )
    }
}))