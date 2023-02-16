import { Attribute, EntitySchema } from "@reactive/commons";
import { injectable } from "inversify";
import { createContext, useContext } from "react";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export interface AttributeEditorContext {
    attribute?: Attribute
    schema?: EntitySchema
}

export const AttributeEditorContext = createContext<AttributeEditorContext>({})
export const useAttributeEditorContext = () => useContext(AttributeEditorContext)

export type AttributeComponents = {
    valueEditor?: any
    valueRenderer?: any
    typeEditor?: (props: AttributeEditorContext) => JSX.Element
}

export type AttributeMetaData = {
    components?: AttributeComponents
    icon: any
}

export class RegisteredAttribute {
    constructor(opts: typeof RegisteredAttribute) {
        Object.assign(this, opts)
    }
    attribute!: Omit<Attribute, "name">
    metadata!: AttributeMetaData
}

@injectable()
export class AttributesManager extends PluginClass {

    public register(cb: (ctx: ClientContext) => RegisteredAttribute) {
        const attribute = cb(this.ctx)

        const exists = this.ctx.attributes.attributes.find((f: any) => (f.attribute.customType === attribute.attribute.customType && f.attribute.type === attribute.attribute.type))

        if (exists) throw new Error("Attribute with this type is already registered: " + attribute.attribute.customType)

        this.ctx.attributes.attributes.push(attribute)
    }
}
