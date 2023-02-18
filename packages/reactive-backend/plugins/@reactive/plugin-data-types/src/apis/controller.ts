import { createCoreControllers } from "@reactive/server";
export default createCoreControllers("data-types", ctx => ({
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
        // restart the server
        restartServer(ctx.utils.restartServer)
        return req.send(res)
    },
    async delete(req) {
        const { name } = req.params || {}
        if (!name) throw new Error("Invalid schema name provided")
        const schema = ctx.endpoints.endpoints.find(ep => ep.schema?.name === name)
        if (!schema || !schema?.name?.length!) throw new Error("No such schema exists")
        await ctx.apiGen.removeEndpointSchema(schema)
        // restart the server
        restartServer(ctx.utils.restartServer)
        return req.send(schema)
    }
}))

const restartServer = (restartFn: any) => {
    setTimeout(() => restartFn?.(), 500)
}