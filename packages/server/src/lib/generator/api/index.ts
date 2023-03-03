
import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons";
import { inject, injectable } from "inversify";
import { resolve } from "path";
import { pluralize } from "@reactive/commons";
import { Generator } from "../index";
import { existsSync } from "fs";
import { DBManager } from "../../db";

export type SaveEndpointOpts = {
    updateRefs?: boolean
}
/**
 * Remove endpoint schema options
 */
export type RemoveEndpointSchemaOpts = {
    /**
     * Indicates if should remove all or just the schema component of the endpoint\
     * if true, all the controllers, routes and services (not the data) are cleared along with the schema component\
     * 
     * @default default true
     */
    all?: boolean
}

@injectable()
export class APIGenerator extends Generator {

    constructor(@inject(DBManager) private db: DBManager) {
        super()
    }

    /**
     * Generates endpoint schema in the api path configured
     * @param schema 
     * @returns 
     */
    public async generateAPI(schema: EntitySchema) {
        const dest = resolve(this.ctx.appDir, this.ctx.config.api.path, schema.name)
        if (this.ctx.fs.exists(dest)) throw new Error("API with this name already exists")
        // generate the api
        super.generate({
            src: resolve(__dirname, "template"),
            dest,
            replaceVars: {
                ts: "ts",
                json: "json",
                name: schema.name
            }
        })

        // write out default schema
        return await this.saveEndpointSchema(schema)
    }

    /**
     * Save the endpoint schemas to the file system
     * @param schema 
     * @param opts 
     * @returns 
     */
    public async saveEndpointSchema(schema: EntitySchema) {
        if (!schema || !schema.attributes || !schema.name) throw new Error("Invalid schema provided")
        if (Object.keys(schema.attributes).length <= 0) throw new Error("At least one attribute/field required")

        const destDir = resolve(this.ctx.appDir, this.ctx.config.api.path, schema.name)
        if (!this.ctx.fs.exists(destDir)) throw new Error(`API doesn't exist: ${destDir}`)
        
        const schemaFilePath = resolve(destDir, "schema", "schema.json")
        this.ctx.fs.writeFile(schemaFilePath, JSON.stringify(schema, null, 2))
        
        return schema
    }



    /**
     * Remove endpoint schema
     * @param opts 
     */
    public async removeEndpointSchema(schema: EntitySchema, opts?: RemoveEndpointSchemaOpts) {
        const { all = true } = opts || {}
        let path = resolve(this.ctx.appDir, this.ctx.config.api.path, schema.name)
        if (!all) {
            path = resolve(path, "schema", "schema.json")
        }
        if (!existsSync(path)) throw new Error("No such endpoint schema exists")
        await this.ctx.fs.rmDir(path)
    }




}