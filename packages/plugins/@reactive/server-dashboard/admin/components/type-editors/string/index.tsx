import { TypeEditorContext } from "@reactive/client"
import { BaseFieldType } from "@reactive/commons"
import { Field, FieldControl, useFormContext, FieldDescription, FieldLabel, FormStage, HStack, Input, Stack, StackProps } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface StringTypeEditorProps extends StackProps, TypeEditorContext {
    children?: any
}

class TmpDTO {
    @IsNotEmpty({ message: "Name is required" })
    name!: string
}

export function StringTypeEditor({ children, form, ...props }: StringTypeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <Stack {...props}>
            <FormStage validationClass={TmpDTO}>
                <HStack alignItems="flex-start">
                    <Field hidden name="type" defaultValue={BaseFieldType.string}>
                        <Input value={BaseFieldType.string} />
                    </Field>
                    <Field hidden name="customType" defaultValue={BaseFieldType.string}>
                        <Input value={BaseFieldType.string} />
                    </Field>
                    <FieldControl flex={1}>
                        <FieldLabel >
                            Attribute Name
                        </FieldLabel>
                        <Field name="name">
                            <Input isDisabled={defaultValue?.name?.length} />
                        </Field>

                        <FieldDescription>
                            Enter a unique name for this attribute
                        </FieldDescription>
                    </FieldControl>
                </HStack>
            </FormStage>
        </Stack>
    )
}

export default StringTypeEditor