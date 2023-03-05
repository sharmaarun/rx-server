import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { DateAttributeSubType, toPascalCase } from "@reactive/commons"
import { AttributeValidationsEditor, Checkbox, Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface DateTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class DateValidation extends DefaultAttributesValidationClass {

    @IsNotEmpty({ message: "Please choose a date type" })
    subType!: string
}

export function DateTypeEditor({ children, attribute, ...props }: DateTypeEditorProps) {
    const { defaultValue } = useFormContext()
    const subTypes = Object.values(DateAttributeSubType)
    return (
        <FormStage {...props} validationClass={DateValidation}>
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

export default DateTypeEditor