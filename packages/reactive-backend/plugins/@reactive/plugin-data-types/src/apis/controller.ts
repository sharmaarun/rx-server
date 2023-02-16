import { createControllers } from "@reactive/server";
export default createControllers("data-types", ctx => ({
    async list(req) {

        return req.send(
            ctx.endpoints.endpoints.filter(e => e.type === "basic").map(e => e.schema)
        )
    },
    async create(req) {
        if (!req.body?.attributes) throw new Error("Invalid request")
        const res = await ctx.apiGen.generateAPI(req.body)
        restartServer(ctx.utils.restartServer)
        return req.send(res)
    },
    async update(req) {
        if (!req.body?.attributes) throw new Error("Invalid request")

        // try to migrate the changes
        const oldSchema = ctx.db.entities.find(e => e.schema.name === req.body?.name)?.schema
        if (oldSchema) {
            const diff = await ctx.db.diffSchemas(req.body, oldSchema)
            console.log(diff)
            await ctx.db.migrateSchema(req.body, oldSchema)
        }
        await new Promise(res => setTimeout(res, 200))
        const res = await ctx.apiGen.saveEndpointSchema(req.body, { updateRefs: true })
        // exit so server can auto restart and pickup the new changes
        restartServer(ctx.utils.restartServer)
        return req.send(res)
    }
}))

const restartServer = (restartFn: any) => {
    setTimeout(() => restartFn?.(), 500)
}