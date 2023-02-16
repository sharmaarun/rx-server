import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { NumberAttributeSubType, toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface NumberTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class NumberValidation extends DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Please choose a number type" })
    subType!: string
}

export function NumberTypeEditor({ children, attribute, ...props }: NumberTypeEditorProps) {
    const { defaultValue } = useFormContext()
    const subTypes = Object.values(NumberAttributeSubType)
    return (
        <Stack {...props}>
            <FormStage validationClass={NumberValidation}>
                <HStack alignItems="flex-start">
                    <FieldControl>
                        <FieldLabel>Name</FieldLabel>
                        <Field name="name">
                            <Input isDisabled={defaultValue?.name?.length} />
                        </Field>
                        <FieldDescription>Enter a unique name</FieldDescription>
                    </FieldControl>
                    <FieldControl>
                        <FieldLabel>Type</FieldLabel>
                        <Field name="subType" defaultValue={subTypes?.[0]}>
                            <Select>
                                <SelectOption value="">--Select--</SelectOption>
                                {subTypes.map((sast, ind) =>
                                    <SelectOption key={ind} value={sast}>
                                        {toPascalCase(sast)}
                                    </SelectOption>
                                )}
                            </Select>
                        </Field>
                    </FieldControl>
                </HStack>
            </FormStage>
        </Stack>
    )
}

export default NumberTypeEditor