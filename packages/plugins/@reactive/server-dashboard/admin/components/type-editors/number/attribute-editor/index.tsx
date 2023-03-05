import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { NumberAttributeSubType, toPascalCase } from "@reactive/commons"
import { AttributeValidationsEditor, Checkbox, Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface NumberAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class NumberValidation extends DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Please choose a number type" })
    subType!: string
}

export function NumberAttributeEditor({ children, attribute, ...props }: NumberAttributeEditorProps) {
    const { defaultValue } = useFormContext()
    const subTypes = Object.values(NumberAttributeSubType)
    return (
        <FormStage {...props} validationClass={NumberValidation}>
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
            <HStack alignItems="flex-start">
                <FieldControl w={["100%", "100%", "50%"]}>
                    <FieldLabel>
                        Required
                    </FieldLabel>
                    <HStack>
                        <Field name="isRequired" type="boolean">
                            <Checkbox />
                        </Field>
                        <FieldDescription>
                            Make it required in the database
                        </FieldDescription>
                    </HStack>
                </FieldControl>
                <FieldControl w={["100%", "100%", "50%"]}>
                    <FieldLabel>
                        Unique
                    </FieldLabel>
                    <HStack>
                        <Field name="isUnique" type="boolean">
                            <Checkbox />
                        </Field>
                        <FieldDescription>
                            Make it unique field in the database
                        </FieldDescription>
                    </HStack>
                </FieldControl>
            </HStack>
            <Field name="validations">
                <AttributeValidationsEditor />
            </Field>
        </FormStage>
    )
}

export default NumberAttributeEditor