import { Attribute, EntitySchema } from "@reactive/commons";
import { IsNotEmpty } from "class-validator";
import { injectable } from "inversify";
import { createContext, useContext } from "react";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export interface AttributeEditorContext {
    attribute?: Attribute
    schema?: EntitySchema
}

export interface ValueEditorContext {
    attribute?: Attribute
    schema?: EntitySchema
}

export interface ValueRendererContext {
    attribute?: Attribute
    schema?: EntitySchema
}

export const AttributeEditorContext = createContext<AttributeEditorContext>({})
export const useAttributeEditorContext = () => useContext(AttributeEditorContext)

export type AttributeComponents = {
    valueEditor?: {
        /**
         * Indicates the number of columns, this component takes in the editor space
         */
        span?: number,
        component: (props: ValueEditorContext) => JSX.Element
    },
    valueRenderer?: (props: ValueRendererContext) => JSX.Element
    attributeEditor?: (props: AttributeEditorContext) => JSX.Element
}

export type AttributeMetaData = {
    components?: AttributeComponents
    icon: any
    /**
     * make this attribute type private
     */
    private?: boolean
}

export class RegisteredAttribute {
    constructor(opts: typeof RegisteredAttribute) {
        Object.assign(this, opts)
    }
    attribute!: Omit<Attribute, "name">
    metadata!: AttributeMetaData
}

export class DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Name should not be empty" })
    name!: string
}

@injectable()
export class AttributesManager extends PluginClass {
    init(ctx: ClientContext): void | Promise<void> {
        super.ctx = ctx
    }

    public register(cb: (ctx: ClientContext) => RegisteredAttribute) {
        const attribute = cb(this.ctx)

        const exists = this.ctx.attributes.attributes.find((f: any) => (f.attribute.customType === attribute.attribute.customType && f.attribute.type === attribute.attribute.type))

        if (exists) throw new Error("Attribute with this type is already registered: " + attribute.attribute.customType)

        this.ctx.attributes.attributes.push(attribute)
    }
}
