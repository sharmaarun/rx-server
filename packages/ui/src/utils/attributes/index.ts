import { Attribute, BaseAttributeType, NumberAttributeSubType } from "@reactive/commons";

/**
 * Get form field type for specified attribute
 * @param attribute 
 * @returns 
 */
export const getFormFieldTypeForAttribute = (attribute: Attribute): any => {
    switch (attribute.type) {
        case BaseAttributeType.boolean:
            return "boolean"
        case BaseAttributeType.number:
            return (attribute?.subType === NumberAttributeSubType.float ||
                attribute?.subType === NumberAttributeSubType.decimal) ? "float" : "number"
        default:
            return;
    }
}