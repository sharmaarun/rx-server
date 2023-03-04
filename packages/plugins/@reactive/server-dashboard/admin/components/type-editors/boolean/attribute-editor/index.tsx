import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Checkbox, Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface BooleanAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class BooleanValidation extends DefaultAttributesValidationClass {
}

export function BooleanAttributeEditor({ children, attribute, ...props }: BooleanAttributeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <FormStage {...props} validationClass={BooleanValidation}>
            <HStack alignItems="flex-start">
                <FieldControl>
                    <FieldLabel>Name</FieldLabel>
                    <Field name="name">
                        <Input isDisabled={defaultValue?.name?.length} />
                    </Field>
                    <FieldDescription>Enter a unique name</FieldDescription>
                </FieldControl>
            </HStack>
        </FormStage>
    )
}

export default BooleanAttributeEditor