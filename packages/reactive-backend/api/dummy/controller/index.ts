import { createControllers } from "@reactive/server";

export default createControllers("dummy", (ctx) => ({
    async list(req) {
        const data = await ctx.query("dummy").findAll()
        return req.send(data)
    },
    async create(req) {
        const created = await ctx.query("dummy").create({
            name: "first name"
        })
        return req.send(created)
    }
}))
