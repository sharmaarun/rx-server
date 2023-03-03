import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface JSONAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class JSONValidation extends DefaultAttributesValidationClass {
}

export function JSONAttributeEditor({ children, attribute, ...props }: JSONAttributeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <Stack {...props}>
            <FormStage validationClass={JSONValidation}>
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
        </Stack>
    )
}

export default JSONAttributeEditor