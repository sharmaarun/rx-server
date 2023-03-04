import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Checkbox, Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Select, SelectOption, Stack, StackProps, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"

export interface RichTextAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class RichTextValidation extends DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Please choose a string type" })
    subType!: string
}

export function RichTextAttributeEditor({ children, attribute, ...props }: RichTextAttributeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <FormStage {...props} validationClass={RichTextValidation}>
            <HStack alignItems="flex-start">
                <FieldControl>
                    <FieldLabel>Name</FieldLabel>
                    <Field name="name">
                        <Input isDisabled={defaultValue?.name?.length} />
                    </Field>
                    <FieldDescription>Enter a unique name</FieldDescription>
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
        </FormStage>
    )
}

export default RichTextAttributeEditor