import { createControllers } from "@reactive/server";

export default createControllers("data-types", ctx => ({
    async list(req) {
        return req.send(
            ctx.endpoints.endpoints.filter(e => e.type === "basic")
        )
    },
    async create(req) {
        const res = ctx.apiGen.generateAPI(req.params.name)
        return req.send(res)
    }
}))