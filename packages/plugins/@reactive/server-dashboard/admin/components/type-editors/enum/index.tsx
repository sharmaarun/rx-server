import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { Field, FieldControl, FieldDescription, FieldLabel, FormStage, HStack, Input, Stack, StackProps, Textarea, TextareaProps, useFormContext } from "@reactive/ui"
import { ArrayMinSize, IsNotEmpty } from "class-validator"
import { ChangeEvent, useEffect, useState } from "react"

export interface EnumValueInputProps extends Omit<TextareaProps, "onChange"> {
    value?: string[]
    defaultValue?: string[]
    onChange?: (value: string[]) => void
}

export const EnumValueInput = ({ defaultValue, onChange, value: _, ...props }: EnumValueInputProps) => {
    const onChange_ = (e: any) => {
        const v_ = e.target.value?.split("\n")?.filter((v: string) => v.length) || []
        onChange?.([...v_])
    }
    return (
        <>
            <Textarea minH="32"  {...props} defaultValue={defaultValue?.join("\n")} onChange={onChange_} />
        </>
    )
}

class EnumValidation extends DefaultAttributesValidationClass {
}

export interface EnumTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}

export function EnumTypeEditor({ children, ...props }: EnumTypeEditorProps) {
    const { defaultValue } = useFormContext()
    return (
        <FormStage validationClass={EnumValidation}>
            <Stack {...props}>

                <FieldControl>
                    <FieldLabel>Name</FieldLabel>
                    <Field name="name">
                        <Input isDisabled={defaultValue?.name?.length} />
                    </Field>
                    <FieldDescription>Enter a unique name</FieldDescription>
                </FieldControl>
                <FieldControl flex={1}>
                    <FieldLabel>
                        Values
                    </FieldLabel>
                    <Field name="values">
                        {/* <Textarea placeholder={"Enter one value per line"} /> */}
                        <EnumValueInput placeholder={"Enter one value per line"} />
                    </Field>
                </FieldControl>
            </Stack>
        </FormStage>
    )
}

export default EnumTypeEditor