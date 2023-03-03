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

        // extract all the modified schemas related to the requested one
        const relatedSchemasToMigrate = await ctx.db.getAllModifiedSchemas(req?.body)
        console.log("schemas", JSON.stringify(relatedSchemasToMigrate?.map(s => s.name), null, 2))

        // start a transaction for migrating the db for new changes
        const transaction = await ctx.db.transaction()
        try {
            // for each modified schema (including the requested one),
            // try to migrate the changes

            for (let schema of relatedSchemasToMigrate || []) {
                // get the old unchanged schema
                const os = ctx.endpoints.endpoints.find(ep => ep?.schema?.name === schema.name)?.schema
                if (os) {
                    // migrate the schema changes
                    await ctx.db.migrateSchema(schema, os, transaction)
                }
            }

            // write out all the changes if successfully done
            await new Promise(res => setTimeout(res, 200))
            const res = await Promise.all(relatedSchemasToMigrate?.map(async s => await ctx.apiGen.saveEndpointSchema(s)) || [])

            // commit the transaction if all changes were done successfuly
            await transaction.commit()

            //restart the server for the changes to take effecr
            restartServer(ctx.utils.restartServer)
            return req.send(res?.[0])
        } catch (e: any) {
            console.error(e)
            await transaction.rollback()
            throw new Error(e.message)
        }
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