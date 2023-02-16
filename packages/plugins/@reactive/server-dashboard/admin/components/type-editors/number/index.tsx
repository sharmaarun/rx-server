import { AttributeEditorContext } from "@reactive/client"
import { Field, FieldControl, FieldLabel, FormStage, HStack, Select, Stack, StackProps, useFormContext } from "@reactive/ui"

export interface NumberTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}

export function NumberTypeEditor({ children, ...props }: NumberTypeEditorProps) {
    return (
        <FormStage >
            <Stack {...props}>
                <HStack alignItems="flex-start">
                    <FieldControl flex={1}>
                        <FieldLabel>
                            Attribute Type
                        </FieldLabel>
                        <Field name="subType">
                            <Select />
                        </Field>
                    </FieldControl>
                </HStack>
            </Stack>
        </FormStage>
    )
}

export default NumberTypeEditor