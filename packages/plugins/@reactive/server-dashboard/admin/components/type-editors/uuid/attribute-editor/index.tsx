import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface UUIDAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class UUIDValidation extends DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Please choose a string type" })
    subType!: string
}

export function UUIDAttributeEditor({ children, attribute, ...props }: UUIDAttributeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <Stack {...props}>
            <FormStage validationClass={UUIDValidation}>
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

export default UUIDAttributeEditor