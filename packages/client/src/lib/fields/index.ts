import { Field } from "@reactive/commons";
import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

export interface TypeEditorContext {
    form?: any
}

export type FieldComponents = {
    valueEditor?: any
    valueRenderer?: any
    typeEditor?: (props: TypeEditorContext) => JSX.Element
}

export type FieldMetaData = {
    components?: FieldComponents
    icon: any
}

export class RegisteredField {
    constructor(opts: typeof RegisteredField) {
        Object.assign(this, opts)
    }
    field!: Omit<Field, "name">
    metadata!: FieldMetaData
}

@injectable()
export class FieldsManager extends PluginClass {

    public register(cb: (ctx: ClientContext) => RegisteredField) {
        const field = cb(this.ctx)

        const exists = this.ctx.fields.fields.find(f => (f.field.customType === field.field.customType && f.field.type === field.field.type))

        if (exists) throw new Error("Field with this type is already registered: " + field.field.customType)

        this.ctx.fields.fields.push(field)
    }
}