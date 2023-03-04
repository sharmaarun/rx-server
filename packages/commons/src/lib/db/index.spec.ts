import { BaseAttributeType, BasicAttributeValidation, EntitySchema, validateEntity, validateValue } from "./"

describe('Commons : DB', () => {
    it("should validate a single value based on its validation type", () => {
        const valid = validateValue("", { type: BasicAttributeValidation.notEmpty, value: "" })
        expect(valid).toBe("Is required")
    })
    it("should validate contains validation", () => {
        const valid = validateValue("", { type: BasicAttributeValidation.contains, value: "val" })
        expect(valid).toBe("Should contain val")
    })
    it("should validate min validation", () => {
        const valid = validateValue(2, { type: BasicAttributeValidation.min, value: 3 })
        expect(valid).toBe("Should be more than 3")
    })
    it("should validate max validation", () => {
        const valid = validateValue(4, { type: BasicAttributeValidation.max, value: 3 })
        expect(valid).toBe("Should be less than 3")
    })
    it("should validate minLen validation", () => {
        const valid = validateValue("", { type: BasicAttributeValidation.minLen, value: 3 })
        expect(valid).toBe("Length should be more than 3 characters")
    })
    it("should validate maxLen validation", () => {
        const valid = validateValue("asdasd", { type: BasicAttributeValidation.maxLen, value: 3 })
        expect(valid).toBe("Length should be less than 3 characters")
    })
    it("should validate regex validation", () => {
        const valid = validateValue("", { type: BasicAttributeValidation.matches, value: "val" })
        expect(valid).toBe("Invalid value")
    })

    it("should validate object based on its schema and validation type", () => {
        const schema: EntitySchema = {
            name: "tst",
            attributes: {
                name: {
                    name: "Test",
                    type: BaseAttributeType.string,
                    validations: [{
                        type: BasicAttributeValidation.contains,
                        value: "asd"
                    }]
                }
            }
        }
        const errors = validateEntity(schema, {})
        expect(errors.length).toBe(1)
        expect(errors?.[0].property).toBe(schema.attributes?.["name"]?.name)
        expect(JSON.stringify(errors?.[0].target)).toBe("{}")
        expect(errors?.[0].value).toBe(undefined)
    })
})