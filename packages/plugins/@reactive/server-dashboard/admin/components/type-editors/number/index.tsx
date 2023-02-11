import { Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, Stack, StackProps, useFormContext } from "@reactive/ui"
import { BaseFieldType } from "@reactive/commons"
import { IsNotEmpty } from "class-validator"

export interface NumberTypeEditorProps extends StackProps {
    children?: any
}

class TmpDTO {
    @IsNotEmpty({ message: "Name is required" })
    name!: string
}

export function NumberTypeEditor({ children, ...props }: NumberTypeEditorProps) {
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
                    <FieldControl flex={1}>
                        <FieldLabel>
                            Attribute Type
                        </FieldLabel>
                        <Field name="subType">
                            <Select />
                        </Field>
                    </FieldControl>
                </HStack>
            </FormStage>
        </Stack>
    )
}

export default NumberTypeEditor