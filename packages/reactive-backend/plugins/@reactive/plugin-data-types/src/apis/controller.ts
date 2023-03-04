import { createCoreControllers } from "@reactive/server";
export default createCoreControllers("data-types", ctx => ({
    async list(req) {

        return req.send(
            ctx.endpoints.endpoints.filter(e => e.type === "basic").map(e => e.schema)
        )
    },
    async create(req) {
        if (!req.body?.attributes) throw new Error("Invalid request")
        // start a transaction before actually writing out the api structure
        const transaction = await ctx.db.transaction()
        let res: any
        try {
            if (!req.body || !req.body.name) throw new Error(`Invalid request to create new data type}`)
            // extract all the modified schemas related to the requested one
            let relatedSchemasToMigrate = await ctx.db.getAllModifiedSchemas(req?.body)
            //filter out this new schema
            const processedNewSchema = relatedSchemasToMigrate.find(s => s.name === req?.body?.name)
            if (!processedNewSchema) throw new Error(`Process schema cound not be generated`)

            relatedSchemasToMigrate = relatedSchemasToMigrate.filter(s => s.name !== req?.body?.name)
            console.log("schemas", JSON.stringify(relatedSchemasToMigrate, null, 2))

            //for all the modified schemas
            for (let s of relatedSchemasToMigrate) {
                // try to perform the migrations the db definitions
                const os = ctx.endpoints.endpoints.find(ep => ep?.schema?.name === s.name)?.schema
                if (!os) throw new Error(`No existing schema found for ref : ${s.name}`)
                res = await ctx.db.migrateSchema(s, os, transaction)
            }

            // once migrated, define the new schema
            await ctx.db.defineSchema(processedNewSchema)

            // once defined, save modified apis and generate the new API
            res = await Promise.all(relatedSchemasToMigrate?.map(async s => await ctx.apiGen.saveEndpointSchema(s)) || [])
            res = await ctx.apiGen.generateAPI(req.body)
            await transaction.commit()

            // restart the server for the changes to take effect
            restartServer(ctx.utils.restartServer)
            return req.send(res)
        } catch (e: any) {
            console.error(e)
            await transaction.rollback()
            throw new Error(e.message)
        }
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
        const schema = ctx.endpoints.endpoints.find(ep => ep.schema?.name === name)?.schema
        if (!schema || !schema?.name?.length!) throw new Error("No such schema exists")

        // start a transaction for migrating the db for new changes
        const transaction = await ctx.db.transaction()
        try {

            //try to remove the db entity
            await ctx.db.removeSchema(schema)

            // If successfully removed, writeout the changes on the file system (remove from disk)
            await ctx.apiGen.removeEndpointSchema(schema)

            // commit the transaction if all changes were done successfuly
            await transaction.commit()

            //restart the server for the changes to take effecr
            restartServer(ctx.utils.restartServer)
            return req.send(schema)
        } catch (e: any) {
            console.error(e)
            await transaction.rollback()
            throw new Error(e.message)
        }
    }
}))

const restartServer = (restartFn: any) => {
    setTimeout(() => restartFn?.(), 500)
}