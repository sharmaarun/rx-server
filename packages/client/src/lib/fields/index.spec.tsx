import "reflect-metadata"

import { BaseFieldType } from "@reactive/commons"
import { ClientContext } from "../contexts"
import { FieldsContext } from "../contexts/fields"
import { FieldsManager, TypeEditor } from "./index"
describe('Fields Manager', () => {
    const fieldsMgr = new FieldsManager()
    fieldsMgr.init(ClientContext)
    it("should register a field", () => {
        fieldsMgr.register(ctx => ({
            field: {
                type: BaseFieldType.string,
                customType: "string"
            },
            metadata: {
                icon: <></>,
                inputComponent: <></>,
                viewComponent: <></>,
            }
        }),)
        const found = FieldsContext.fields.find(f => f.field.type === BaseFieldType.string && f.field.customType === "string")
        expect(found).toBeDefined()
    })
})