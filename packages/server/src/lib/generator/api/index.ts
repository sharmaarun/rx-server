
import { BaseAttributeType, EntitySchema, RelationType } from "@reactive/commons";
import { injectable } from "inversify";
import { resolve } from "path";
import { pluralize } from "@reactive/commons";
import { Generator } from "../index";

export type SaveEndpointOpts = {
    updateRefs?: boolean
}

export const ReverseRelationsMap = {
    [RelationType.MANY_TO_MANY]: RelationType.MANY_TO_MANY,
    [RelationType.MANY_TO_ONE]: RelationType.ONE_TO_MANY,
    [RelationType.ONE_TO_MANY]: RelationType.MANY_TO_ONE,
    [RelationType.ONE_TO_ONE]: RelationType.ONE_TO_ONE,
    [RelationType.HAS_MANY]: undefined,
    [RelationType.HAS_ONE]: undefined,
}

@injectable()
export class APIGenerator extends Generator {
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

    public async saveEndpointSchema(schema: EntitySchema, opts?: SaveEndpointOpts) {
        const { updateRefs = true } = opts || {}
        if (!schema || !schema.attributes || !schema.name) throw new Error("Invalid schema provided")
        if (Object.keys(schema.attributes).length <= 0) throw new Error("At least one attribute/field required")

        const destDir = resolve(this.ctx.appDir, this.ctx.config.api.path, schema.name)
        if (!this.ctx.fs.exists(destDir)) throw new Error(`API doesn't exist: ${destDir}`)

        const schemaFilePath = resolve(destDir, "schema", "schema.json")
        this.ctx.fs.writeFile(schemaFilePath, JSON.stringify(schema, null, 2))

        if (updateRefs) {
            const allSchemas = this.ctx.endpoints.endpoints.filter(ep => ep.schema && ep.schema.name)?.map(ep => ep.schema)
            const refsToUpdate = await this.prepareRelatedSchemas(schema, allSchemas as any || [])
            if (refsToUpdate?.length) {
                console.log(refsToUpdate)
                for (let ref of refsToUpdate) {
                    await this.saveEndpointSchema(ref, { updateRefs: false })
                }
            }
        }

        return schema
    }

    public async prepareRelatedSchemas(schema: EntitySchema, allSchemas: EntitySchema[]) {
        const refAttributes = Object.values(schema?.attributes || {}).filter(attr => attr.type === BaseAttributeType.relation)

        if (refAttributes.length <= 0) return;
        const refSchemas: EntitySchema[] = []
        for (let refAttr of refAttributes) {
            const refSchema = allSchemas.find(s => s?.name === refAttr.ref)
            if (refSchema?.name) {
                if (!refAttr.relationType) throw new Error(`Invalid relation type ${refAttr.relationType} for attribute ${refAttr?.name}`)
                if (!refAttr.foreignKey) throw new Error(`Invalid foreign key  ${refAttr.foreignKey} for attribute ${refAttr?.name}`)
                if (!ReverseRelationsMap[refAttr.relationType]) throw new Error(`Invalid reverse relation type : ${ReverseRelationsMap[refAttr.relationType]} for attribute ${refAttr?.name}`)


                refSchema.attributes = {
                    ...(refSchema.attributes || {}),
                    [refAttr.foreignKey]: {
                        type: BaseAttributeType.relation,
                        ref: schema.name,
                        name: refAttr.foreignKey,
                        relationType: ReverseRelationsMap[refAttr.relationType],
                        customType: refAttr.customType,
                        foreignKey: refAttr.name
                    }
                }
                refSchemas.push(refSchema)
            }
        }
        return refSchemas
    }

}