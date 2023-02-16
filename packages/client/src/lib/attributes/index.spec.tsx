import "reflect-metadata"

import { BaseAttributeType } from "@reactive/commons"
import { ClientContext } from "../contexts"
import { AttributesContext } from "../contexts/attributes"
import { AttributesManager } from "./index"
describe('Attributes Manager', () => {
    const attributesMgr = new AttributesManager()
    attributesMgr.init(ClientContext)
    it("should register a attribute", () => {
        attributesMgr.register(ctx => ({
            attribute: {
                type: BaseAttributeType.string,
                customType: "string"
            },
            metadata: {
                icon: <></>,
                inputComponent: <></>,
                viewComponent: <></>,
            }
        }),)
        const found = AttributesContext.attributes.find(f => f.attribute.type === BaseAttributeType.string && f.attribute.customType === "string")
        expect(found).toBeDefined()
    })
})